document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('page-content');
  if (!mount) return;

  mount.innerHTML = `
    <section class="section-block compact">
      <div class="section-head">
        <h3>관리자 신규 등록</h3>
        <p>학교급, 학교명, 반/번호 정규화 규칙을 동일하게 적용합니다.</p>
      </div>
      ${window.AppForms.renderFormHtml({
        context: 'admin',
        submitLabel: '저장',
        secondaryLabel: '목록으로',
        secondaryAction: 'list'
      })}
    </section>
  `;

  const form = document.getElementById('admin-application-form');
  const resultBox = document.getElementById('admin-resultBox');
  const secondaryButton = form.querySelector('[data-secondary-action="list"]');

  window.AppForms.initForm(form, 'admin');

  secondaryButton?.addEventListener('click', () => {
    location.href = window.AppPath.page('admin-list');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const check = window.AppForms.validate(form, 'admin');
    if (!check.ok) {
      window.AppUtil.showToast(check.message);
      return;
    }

    const created = window.AppDB.create({
      ...check.value,
      source: 'admin',
      status: check.value.status || '신청 접수'
    });

    resultBox.hidden = false;
    resultBox.innerHTML = `
      <strong>관리자 등록이 완료되었습니다.</strong>
      <p>접수번호: <b>${created.receiptNo}</b></p>
      <p>상태: <span class="status-pill ${window.AppUtil.statusClass(created.status)}">${window.AppUtil.escapeHtml(created.status)}</span></p>
      <div class="button-row">
        <a class="btn btn-secondary" href="${window.AppPath.page('admin-office')}">도교육청 관리자 화면으로 이동</a>
      </div>
    `;

    window.AppUtil.showToast('신규 등록이 저장되었습니다.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
