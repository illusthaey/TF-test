document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("page-content");
  if (!mount) return;

  mount.innerHTML = `
    <section class="section-block compact">
      <div class="section-head">
        <h3>관리자 신규 등록</h3>
        <p>다자녀 입학준비금 관리자 추가 화면의 표 형식 입력 흐름을 참고한 구성입니다.</p>
      </div>
      ${window.AppForms.renderFormHtml({
        context: "admin",
        submitLabel: "추가",
        secondaryLabel: "목록으로",
        secondaryAction: "list"
      })}
    </section>
  `;

  const form = document.getElementById("admin-application-form");
  const resultBox = document.getElementById("admin-resultBox");
  window.AppForms.initForm(form, "admin");

  const secondaryButton = form.querySelector('[data-secondary-action="list"]');
  secondaryButton?.addEventListener("click", () => {
    location.href = "admin-list.html";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const check = window.AppForms.validate(form, "admin");
    if (!check.ok) {
      window.AppUtil.showToast(check.message);
      return;
    }

    const created = window.AppDB.create({
      ...check.value,
      source: "admin",
      status: check.value.status || "접수"
    });

    resultBox.hidden = false;
    resultBox.innerHTML = `
      <strong>관리자 등록이 완료되었습니다.</strong>
      <p>접수번호: <b>${created.receiptNo}</b></p>
      <p>상태: <span class="status-pill ${window.AppUtil.statusClass(created.status)}">${window.AppUtil.escapeHtml(created.status)}</span></p>
      <div class="button-row">
        <a class="btn btn-secondary" href="admin-list.html">신청 현황으로 이동</a>
      </div>
    `;
    window.AppUtil.showToast("신규 등록이 저장되었습니다.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
