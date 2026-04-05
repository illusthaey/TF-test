document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('page-content');
  if (!mount) return;

  mount.innerHTML = `
    <section class="section-block compact">
      <form class="filter-panel" id="office-filter-form">
        <div class="filter-grid filter-grid-office">
          <label>
            <span>지역</span>
            <select name="region">
              ${window.AppSchools.regionOptions('', true)}
            </select>
          </label>
          <label>
            <span>학교급</span>
            <select name="schoolLevel">
              ${window.AppSchools.schoolLevelOptions('', true)}
            </select>
          </label>
          <label class="wide">
            <span>학교명</span>
            <select name="schoolId">
              <option value="">전체</option>
            </select>
          </label>
          <div class="filter-actions">
            <button type="submit" class="btn btn-primary">조회</button>
            <button type="button" class="btn btn-secondary" id="btn-office-reset">초기화</button>
          </div>
        </div>
      </form>
    </section>

    <section class="stats-grid admin-stats-grid" id="office-admin-summary"></section>

    <section class="section-block compact">
      <div class="table-scroll admin-table-wrap office-admin-table-wrap">
        <table class="tbl-list admin-table admin-table-office" id="office-admin-table">
          <caption>신청 현황 (도교육청 관리자)</caption>
          <thead></thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <dialog id="office-detail-dialog" class="detail-dialog">
      <form method="dialog" class="detail-dialog-inner">
        <div class="detail-dialog-header">
          <strong>신청 상세</strong>
          <button type="submit" class="dialog-close" aria-label="닫기">닫기</button>
        </div>
        <div data-dialog-body></div>
      </form>
    </dialog>
  `;

  const state = {
    filters: {
      region: '',
      schoolLevel: '',
      schoolId: ''
    },
    sort: { key: '', direction: 'none' }
  };

  const columns = [
    { key: 'createdAt', value: (item) => item.createdAt, type: 'date' },
    { key: 'region', value: (item) => item.region, type: 'string' },
    { key: 'schoolLevel', value: (item) => item.schoolLevelLabel || window.AppUtil.schoolLevelLabel(item.schoolLevel), type: 'string' },
    { key: 'schoolName', value: (item) => item.schoolName, type: 'string' },
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

  const filterForm = document.getElementById('office-filter-form');
  const schoolSelect = filterForm.elements.schoolId;
  const summaryBox = document.getElementById('office-admin-summary');
  const table = document.getElementById('office-admin-table');
  const tbody = table.querySelector('tbody');
  const detailDialog = document.getElementById('office-detail-dialog');

  function syncSchoolOptions() {
    const filters = {
      region: filterForm.elements.region.value,
      schoolLevel: filterForm.elements.schoolLevel.value
    };
    const selectedId = filterForm.elements.schoolId.value;
    schoolSelect.innerHTML = window.AppSchools.schoolOptions(filters, selectedId, true).replace('학교를 선택하세요', '전체');
    const blankOption = schoolSelect.querySelector('option[value=""]');
    if (blankOption) blankOption.textContent = '전체';
  }

  function getFilteredItems() {
    const items = window.AppDB.load();
    const { region, schoolLevel, schoolId } = state.filters;
    const filtered = items.filter((item) => {
      if (region && item.region !== region) return false;
      if (schoolLevel && !window.AppSchools.levelMatchesOption(item.schoolLevel, schoolLevel)) return false;
      if (schoolId && item.schoolId !== schoolId) return false;
      return true;
    });
    return window.AdminCommon.sortItems(filtered, columns, state.sort);
  }

  function renderSummary(items) {
    const summary = window.AppUtil.summarizeApplications(items);
    summaryBox.innerHTML = `
      <article class="stat-card">
        <span class="stat-label">조회 건수</span>
        <strong class="stat-value">${items.length}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">학교장 승인</span>
        <strong class="stat-value">${summary.byStatus['학교장 승인'] || 0}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">도교육청 접수</span>
        <strong class="stat-value">${summary.byStatus['도교육청 접수'] || 0}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">지급 완료</span>
        <strong class="stat-value">${summary.byStatus['지급 완료'] || 0}</strong>
      </article>
    `;
  }

  function renderTable(items) {
    table.querySelector('thead').innerHTML = `
      <tr>
        <th scope="col">${window.AdminCommon.renderSortButton('신청일시', 'createdAt', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('지역', 'region', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('학교급', 'schoolLevel', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('학교명', 'schoolName', state.sort)}</th>
        <th scope="col">${window.AdminCommon.renderSortButton('학생 성명', 'studentName', state.sort)}</th>
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
      tbody.innerHTML = '<tr><td colspan="16" class="empty-cell">조건에 맞는 신청이 없습니다.</td></tr>';
      window.AdminCommon.bindSortButtons(table, state.sort, refresh);
      return;
    }

    tbody.innerHTML = items.map((item) => `
      <tr>
        <td>${window.AppUtil.formatDateTime(item.createdAt)}</td>
        <td>${window.AppUtil.escapeHtml(item.region)}</td>
        <td>${window.AppUtil.escapeHtml(item.schoolLevelLabel || window.AppUtil.schoolLevelLabel(item.schoolLevel))}</td>
        <td>${window.AppUtil.escapeHtml(item.schoolName)}</td>
        <td><button type="button" class="text-link detail-link" data-detail-id="${item.id}">${window.AppUtil.escapeHtml(item.studentName)}</button></td>
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
        <td><span class="status-pill ${window.AppUtil.statusClass(item.status)}">${window.AppUtil.escapeHtml(item.status)}</span></td>
      </tr>
    `).join('');

    window.AdminCommon.bindSortButtons(table, state.sort, refresh);
    tbody.querySelectorAll('[data-detail-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const item = window.AppDB.get(button.dataset.detailId);
        if (!item) return;
        window.AdminCommon.fillDetailDialog(detailDialog, item, { includeSchool: true });
        window.AdminCommon.openDialog(detailDialog);
      });
    });
  }

  function refresh() {
    const items = getFilteredItems();
    renderSummary(items);
    renderTable(items);
  }

  filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    state.filters = {
      region: filterForm.elements.region.value,
      schoolLevel: filterForm.elements.schoolLevel.value,
      schoolId: filterForm.elements.schoolId.value
    };
    refresh();
  });

  filterForm.elements.region.addEventListener('change', syncSchoolOptions);
  filterForm.elements.schoolLevel.addEventListener('change', syncSchoolOptions);

  document.getElementById('btn-office-reset').addEventListener('click', () => {
    filterForm.reset();
    syncSchoolOptions();
    state.filters = { region: '', schoolLevel: '', schoolId: '' };
    refresh();
  });

  syncSchoolOptions();
  refresh();
});
