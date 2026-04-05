document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('page-content');
  if (!mount) return;

  mount.innerHTML = `
    <section class="section-block compact">
      <div class="section-head">
        <h3>학부모 신청 화면</h3>
        <p>제약 조건: 서버에 개인정보 저장 불가 (개인정보보호법, 도교육청 서버 용량)</p>
      </div>
      ${window.AppForms.renderFormHtml({
        context: 'public',
        submitLabel: '신청서 제출',
        secondaryLabel: '입력 초기화',
        secondaryAction: 'reset'
      })}
    </section>

    <dialog id="apply-confirm-dialog" class="detail-dialog confirm-dialog">
      <form method="dialog" class="detail-dialog-inner">
        <div class="detail-dialog-header">
          <strong>신청 내용 확인</strong>
          <button type="submit" class="dialog-close" aria-label="닫기">닫기</button>
        </div>
        <div class="confirm-dialog-body" data-dialog-body></div>
        <div class="dialog-button-row">
          <button type="button" class="btn btn-secondary" id="btn-apply-edit">수정하기</button>
          <button type="button" class="btn btn-primary" id="btn-apply-confirm">신청하기</button>
        </div>
      </form>
    </dialog>
  `;

  const form = document.getElementById('public-application-form');
  const resultBox = document.getElementById('public-resultBox');
  const confirmDialog = document.getElementById('apply-confirm-dialog');
  const confirmBody = confirmDialog.querySelector('[data-dialog-body]');
  const editButton = document.getElementById('btn-apply-edit');
  const confirmButton = document.getElementById('btn-apply-confirm');
  let pendingValue = null;

  window.AppForms.initForm(form, 'public');

  function renderConfirmation(value) {
    const rows = window.AppForms.confirmationRows(value);
    confirmBody.innerHTML = `
      <div class="alert-box subtle compact-alert">
        <p>입력하신 정보대로 신청하시겠습니까?</p>
      </div>
      <div class="table-scroll">
        <table class="tbl-list confirm-table">
          <caption>신청 확인 정보</caption>
          <tbody>
            ${rows.map((row) => `
              <tr>
                <th scope="row">${window.AppUtil.escapeHtml(row.label)}</th>
                <td>${window.AppUtil.escapeHtml(row.value)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function finalizeSubmit() {
    if (!pendingValue) return;
    const created = window.AppDB.create({
      ...pendingValue,
      source: 'public',
      status: '신청 접수'
    });

    resultBox.hidden = false;
    resultBox.innerHTML = `
      <strong>신청이 저장되었습니다.</strong>
      <p>접수번호: <b>${created.receiptNo}</b></p>
      <p>학생 성명: ${window.AppUtil.escapeHtml(created.studentName)} / 학교명: ${window.AppUtil.escapeHtml(created.schoolName)}</p>
      <div class="button-row">
        <a class="btn btn-secondary" href="${window.AppPath.page('admin-list')}">관리자 화면 선택으로 이동</a>
      </div>
    `;

    form.reset();
    pendingValue = null;
    window.AppForms.initForm(form, 'public');
    window.AdminCommon.closeDialog(confirmDialog);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  form.addEventListener('reset', () => {
    setTimeout(() => {
      window.AppForms.initForm(form, 'public');
      resultBox.hidden = true;
      resultBox.innerHTML = '';
      pendingValue = null;
    }, 0);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const check = window.AppForms.validate(form, 'public');
    if (!check.ok) {
      window.AppUtil.showToast(check.message);
      return;
    }

    pendingValue = check.value;
    renderConfirmation(pendingValue);
    window.AdminCommon.openDialog(confirmDialog);
  });

  editButton.addEventListener('click', () => {
    window.AdminCommon.closeDialog(confirmDialog);
    form.querySelector('input, select, textarea')?.focus();
  });

  confirmButton.addEventListener('click', finalizeSubmit);
});
