document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('page-content');
  if (!mount) return;

  const contextConfig = window.APP_CONFIG.demoContext.schoolManager;
  const currentSchool = window.AppSchools.findByName(contextConfig.schoolName, contextConfig.region)
    || window.AppSchools.findByNameContains(contextConfig.schoolName, contextConfig.region);

  if (!currentSchool) {
    mount.innerHTML = '<div class="alert-box"><strong>데모 학교 정보를 찾을 수 없습니다.</strong></div>';
    return;
  }

  mount.innerHTML = `
    <section class="section-block compact context-panel">
      <div class="toolbar toolbar-single">
        <div>
          <h3>학교 담당자 권한 기준 화면</h3>
          <p class="toolbar-note">데모 기준 접속 학교: <strong>${window.AppUtil.escapeHtml(currentSchool.region)} ${window.AppUtil.escapeHtml(currentSchool.name)}</strong></p>
        </div>
      </div>
    </section>

    <section class="stats-grid admin-stats-grid" id="school-admin-summary"></section>

    <section class="section-block compact">
      <div class="table-scroll admin-table-wrap school-admin-table-wrap">
        <table class="tbl-list admin-table admin-table-school" id="school-admin-table">
          <caption>신청 현황 (학교 담당자)</caption>
          <thead>
            <tr>
              <th scope="col" class="sticky-col sticky-col-1">${window.AdminCommon.renderSortButton('신청일시', 'createdAt', { key: '', direction: 'none' })}</th>
              <th scope="col" class="sticky-col sticky-col-2">${window.AdminCommon.renderSortButton('학생 성명', 'studentName', { key: '', direction: 'none' })}</th>
              <th scope="col">${window.AdminCommon.renderSortButton('학년', 'grade', { key: '', direction: 'none' })}</th>
              <th scope="col">${window.AdminCommon.renderSortButton('반', 'className', { key: '', direction: 'none' })}</th>
              <th scope="col">${window.AdminCommon.renderSortButton('번호', 'studentNo', { key: '', direction: 'none' })}</th>
              <th scope="col">${window.AdminCommon.renderSortButton('생년월일', 'birthDate', { key: '', direction: 'none' })}</th>
              <th scope="col">${window.AdminCommon.renderSortButton('보호자 성명', 'parentName', { key: '', direction: 'none' })}</th>
              <th scope="col">${window.AdminCommon.renderSortButton('보호자 연락처', 'parentPhone', { key: '', direction: 'none' })}</th>
              <th scope="col">${window.AdminCommon.renderSortButton('지원형태', 'supportType', { key: '', direction: 'none' })}</th>
              <th scope="col">${window.AdminCommon.renderSortButton('품목', 'itemRequest', { key: '', direction: 'none' })}</th>
              <th scope="col">${window.AdminCommon.renderSortButton('치수(상의)', 'topSize', { key: '', direction: 'none' })}</th>
              <th scope="col">${window.AdminCommon.renderSortButton('치수(하의)', 'bottomSize', { key: '', direction: 'none' })}</th>
              <th scope="col">${window.AdminCommon.renderSortButton('상태', 'status', { key: '', direction: 'none' })}</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <dialog id="school-detail-dialog" class="detail-dialog">
      <form method="dialog" class="detail-dialog-inner">
        <div class="detail-dialog-header">
          <strong>신청 상세</strong>
          <button type="submit" class="dialog-close" aria-label="닫기">닫기</button>
        </div>
        <div data-dialog-body></div>
      </form>
    </dialog>

    <dialog id="school-rejection-dialog" class="detail-dialog small-dialog">
      <form method="dialog" class="detail-dialog-inner" id="school-rejection-form">
        <div class="detail-dialog-header">
          <strong id="school-rejection-title">반려 사유 입력</strong>
          <button type="submit" class="dialog-close" aria-label="닫기">닫기</button>
        </div>
        <div class="dialog-form-body">
          <div class="check-grid">
            ${window.APP_CONFIG.rejectionReasons.map((reason) => `
              <label class="check-line block-check">
                <input type="checkbox" name="rejectionReason" value="${reason}">
                ${reason}
              </label>
            `).join('')}
          </div>
          <label class="field-stack">
            <span class="field-label">기타 사유</span>
            <textarea name="rejectionReasonText" rows="3" placeholder="기타를 선택한 경우 상세 사유를 입력하세요."></textarea>
          </label>
        </div>
        <div class="dialog-button-row">
          <button type="button" class="btn btn-secondary" id="btn-school-rejection-cancel">취소</button>
          <button type="button" class="btn btn-primary" id="btn-school-rejection-save">저장</button>
        </div>
      </form>
    </dialog>

    <dialog id="school-change-dialog" class="detail-dialog small-dialog">
      <form method="dialog" class="detail-dialog-inner">
        <div class="detail-dialog-header">
          <strong>처리 내역 변경</strong>
          <button type="submit" class="dialog-close" aria-label="닫기">닫기</button>
        </div>
        <div class="dialog-form-body" id="school-change-body"></div>
        <div class="dialog-button-row">
          <button type="button" class="btn btn-secondary" id="btn-school-change-close">닫기</button>
        </div>
      </form>
    </dialog>
  `;

  const state = {
    sort: { key: '', direction: 'none' },
    rejectionTarget: null,
    changeTargetId: ''
  };

  const columns = [
    { key: 'createdAt', value: (item) => item.createdAt, type: 'date' },
    { key: 'studentName', value: (item) => item.studentName, type: 'string' },
    { key: 'grade', value: (item) => item.grade, type: 'number' },
    { key: 'className', value: (item) => item.className || '', type: 'string' },
    { key: 'studentNo', value: (item) => item.studentNo || '', type: 'number' },
    { key: 'birthDate', value: (item) => item.birthDate, type: 'string' },
    { key: 'parentName', value: (item) => item.parentName, type: 'string' },
    { key: 'parentPhone', value: (item) => item.parentPhone, type: 'string' },
    { key: 'supportType', value: (item) => window.AppUtil.getSupportLabel(item.supportType), type: 'string' },
    { key: 'itemRequest', value: (item) => item.supportType === 'inKind' ? item.itemRequest : '', type: 'string' },
    { key: 'topSize', value: (item) => item.supportType === 'inKind' ? item.topSize : '', type: 'string' },
    { key: 'bottomSize', value: (item) => item.supportType === 'inKind' ? item.bottomSize : '', type: 'string' },
    { key: 'status', value: (item) => item.status, type: 'status' }
  ];

  const summaryBox = document.getElementById('school-admin-summary');
  const table = document.getElementById('school-admin-table');
  const tbody = table.querySelector('tbody');
  const detailDialog = document.getElementById('school-detail-dialog');
  const rejectionDialog = document.getElementById('school-rejection-dialog');
  const rejectionForm = document.getElementById('school-rejection-form');
  const rejectionTitle = document.getElementById('school-rejection-title');
  const changeDialog = document.getElementById('school-change-dialog');
  const changeBody = document.getElementById('school-change-body');

  function getItems() {
    const items = window.AppDB.load().filter((item) => item.schoolId === currentSchool.id);
    return window.AdminCommon.sortItems(items, columns, state.sort);
  }

  function statusActions(item) {
    const buttons = [];
    if (item.status === '신청 접수') {
      buttons.push(`<button type="button" class="btn btn-small btn-primary" data-action="approve" data-id="${item.id}">승인</button>`);
      buttons.push(`<button type="button" class="btn btn-small btn-outline" data-action="reject" data-id="${item.id}">반려</button>`);
    }
    if (item.status === '학교장 승인 대기') {
      buttons.push(`<button type="button" class="btn btn-small btn-secondary" data-action="change" data-id="${item.id}">처리 내역 변경</button>`);
    }
    buttons.push(`<button type="button" class="btn btn-small btn-outline" data-action="detail" data-id="${item.id}">상세보기</button>`);
    return buttons.join('');
  }

  function renderSummary(items) {
    const summary = window.AppUtil.summarizeApplications(items);
    summaryBox.innerHTML = `
      <article class="stat-card">
        <span class="stat-label">조회 건수</span>
        <strong class="stat-value">${items.length}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">신청 접수</span>
        <strong class="stat-value">${summary.byStatus['신청 접수'] || 0}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">학교장 승인 대기</span>
        <strong class="stat-value">${summary.byStatus['학교장 승인 대기'] || 0}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">반려</span>
        <strong class="stat-value">${(summary.byStatus['담당자 반려'] || 0) + (summary.byStatus['학교장 반려'] || 0)}</strong>
      </article>
    `;
  }

  function renderTable(items) {
    table.querySelector('thead').innerHTML = `
      <tr>
        <th scope="col" class="sticky-col sticky-col-1">${window.AdminCommon.renderSortButton('신청일시', 'createdAt', state.sort)}</th>
        <th scope="col" class="sticky-col sticky-col-2">${window.AdminCommon.renderSortButton('학생 성명', 'studentName', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('학년', 'grade', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('반', 'className', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('번호', 'studentNo', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('생년월일', 'birthDate', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('보호자 성명', 'parentName', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('보호자 연락처', 'parentPhone', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('지원형태', 'supportType', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('품목', 'itemRequest', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('치수(상의)', 'topSize', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('치수(하의)', 'bottomSize', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('상태', 'status', state.sort)}</th>
      </tr>
    `;

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="13" class="empty-cell">조회할 신청 데이터가 없습니다.</td></tr>';
      window.AdminCommon.bindSortButtons(table, state.sort, refresh);
      return;
    }

    tbody.innerHTML = items.map((item) => `
      <tr>
        <td class="sticky-col sticky-col-1">${window.AppUtil.formatDateTime(item.createdAt)}</td>
        <td class="sticky-col sticky-col-2"><strong>${window.AppUtil.escapeHtml(item.studentName)}</strong></td>
        <td>${window.AppUtil.escapeHtml(item.grade)}학년</td>
        <td>${window.AppUtil.escapeHtml(item.className || '-')}</td>
        <td>${window.AppUtil.escapeHtml(item.studentNo || '-')}</td>
        <td>${window.AppUtil.escapeHtml(item.birthDate || '-')}</td>
        <td>${window.AppUtil.escapeHtml(item.parentName || '-')}</td>
        <td>${window.AppUtil.escapeHtml(item.parentPhone || '-')}</td>
        <td>${window.AppUtil.escapeHtml(window.AppUtil.getSupportLabel(item.supportType))}</td>
        <td>${window.AppUtil.escapeHtml(item.supportType === 'inKind' ? (item.itemRequest || '-') : '-')}</td>
        <td>${window.AppUtil.escapeHtml(item.supportType === 'inKind' ? (item.topSize || '-') : '-')}</td>
        <td>${window.AppUtil.escapeHtml(item.supportType === 'inKind' ? (item.bottomSize || '-') : '-')}</td>
        <td class="status-cell">
          <div class="status-stack">
            <span class="status-pill ${window.AppUtil.statusClass(item.status)}">${window.AppUtil.escapeHtml(item.status)}</span>
            <div class="button-stack button-stack-left">${statusActions(item)}</div>
            ${window.AppUtil.rejectionSummary(item) !== '-' ? `<p class="inline-note">반려 사유: ${window.AppUtil.escapeHtml(window.AppUtil.rejectionSummary(item))}</p>` : ''}
          </div>
        </td>
      </tr>
    `).join('');

    window.AdminCommon.bindSortButtons(table, state.sort, refresh);
    tbody.querySelectorAll('[data-action="detail"]').forEach((button) => {
      button.addEventListener('click', () => openDetail(button.dataset.id));
    });
    tbody.querySelectorAll('[data-action="approve"]').forEach((button) => {
      button.addEventListener('click', () => {
        window.AppDB.update(button.dataset.id, {
          status: '학교장 승인 대기',
          rejectionReasons: [],
          rejectionReasonText: ''
        }, '학교담당자', '담당자 승인 처리');
        window.AppUtil.showToast('상태가 학교장 승인 대기로 변경되었습니다.');
        refresh();
      });
    });
    tbody.querySelectorAll('[data-action="reject"]').forEach((button) => {
      button.addEventListener('click', () => openRejectionDialog(button.dataset.id, '담당자 반려'));
    });
    tbody.querySelectorAll('[data-action="change"]').forEach((button) => {
      button.addEventListener('click', () => openChangeDialog(button.dataset.id));
    });
  }

  function openDetail(id) {
    const item = window.AppDB.get(id);
    if (!item) return;
    window.AdminCommon.fillDetailDialog(detailDialog, item, { includeSchool: false });
    window.AdminCommon.openDialog(detailDialog);
  }

  function openRejectionDialog(id, targetStatus) {
    state.rejectionTarget = { id, targetStatus };
    rejectionTitle.textContent = targetStatus === '학교장 반려' ? '학교장 반려 사유 입력' : '담당자 반려 사유 입력';
    rejectionForm.reset();
    window.AdminCommon.openDialog(rejectionDialog);
  }

  function saveRejection() {
    if (!state.rejectionTarget) return;
    const checked = Array.from(rejectionForm.querySelectorAll('input[name="rejectionReason"]:checked')).map((input) => input.value);
    const detail = rejectionForm.elements.rejectionReasonText.value.trim();

    if (!checked.length) {
      window.AppUtil.showToast('반려 사유를 한 가지 이상 선택해주세요.');
      return;
    }
    if (checked.includes('기타') && !detail) {
      window.AppUtil.showToast('기타 사유를 입력해주세요.');
      return;
    }

    window.AppDB.update(state.rejectionTarget.id, {
      status: state.rejectionTarget.targetStatus,
      rejectionReasons: checked,
      rejectionReasonText: detail
    }, '학교담당자', `${state.rejectionTarget.targetStatus} 처리`);

    window.AdminCommon.closeDialog(rejectionDialog);
    state.rejectionTarget = null;
    window.AppUtil.showToast('반려 사유가 저장되었습니다.');
    refresh();
  }

  function openChangeDialog(id) {
    const item = window.AppDB.get(id);
    if (!item) return;
    state.changeTargetId = id;
    changeBody.innerHTML = `
      <div class="field-stack compact-gap">
        <p><strong>${window.AppUtil.escapeHtml(item.studentName)}</strong> 학생의 현재 상태는 <strong>${window.AppUtil.escapeHtml(item.status)}</strong> 입니다.</p>
        <p class="field-help">실수로 승인한 경우 아래 처리 중 하나를 선택하세요.</p>
      </div>
      <div class="button-stack button-stack-left wrap-actions">
        <button type="button" class="btn btn-outline" data-change-status="신청 접수">신청 접수로 되돌리기</button>
        <button type="button" class="btn btn-primary" data-change-status="학교장 승인">학교장 승인</button>
        <button type="button" class="btn btn-secondary" data-change-status="담당자 반려">담당자 반려</button>
        <button type="button" class="btn btn-secondary" data-change-status="학교장 반려">학교장 반려</button>
      </div>
    `;

    changeBody.querySelectorAll('[data-change-status]').forEach((button) => {
      button.addEventListener('click', () => {
        const nextStatus = button.dataset.changeStatus;
        if (nextStatus === '담당자 반려' || nextStatus === '학교장 반려') {
          window.AdminCommon.closeDialog(changeDialog);
          openRejectionDialog(id, nextStatus);
          return;
        }
        window.AppDB.update(id, {
          status: nextStatus,
          rejectionReasons: [],
          rejectionReasonText: ''
        }, '학교담당자', `처리 내역 변경: ${nextStatus}`);
        window.AdminCommon.closeDialog(changeDialog);
        window.AppUtil.showToast('처리 상태가 변경되었습니다.');
        refresh();
      });
    });

    window.AdminCommon.openDialog(changeDialog);
  }

  function refresh() {
    const items = getItems();
    renderSummary(items);
    renderTable(items);
  }

  document.getElementById('btn-school-rejection-save').addEventListener('click', saveRejection);
  document.getElementById('btn-school-rejection-cancel').addEventListener('click', () => {
    state.rejectionTarget = null;
    window.AdminCommon.closeDialog(rejectionDialog);
  });
  document.getElementById('btn-school-change-close').addEventListener('click', () => {
    window.AdminCommon.closeDialog(changeDialog);
  });

  refresh();
});
