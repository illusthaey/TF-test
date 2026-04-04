document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("page-content");
  if (!mount) return;

  mount.innerHTML = `
    <section class="section-block compact">
      <div class="section-head">
        <h3>학부모 신청</h3>
        <p>실제 전송은 없고 브라우저에만 저장됩니다.</p>
      </div>
      ${window.AppForms.renderFormHtml({
        context: "public",
        submitLabel: "신청서 제출",
        secondaryLabel: "입력 초기화",
        secondaryAction: "reset"
      })}
    </section>
  `;

  const form = document.getElementById("public-application-form");
  const resultBox = document.getElementById("public-resultBox");
  window.AppForms.initForm(form, "public");

  form.addEventListener("reset", () => {
    setTimeout(() => {
      window.AppForms.initForm(form, "public");
      resultBox.hidden = true;
      resultBox.innerHTML = "";
    }, 0);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const check = window.AppForms.validate(form, "public");
    if (!check.ok) {
      window.AppUtil.showToast(check.message);
      return;
    }

    const created = window.AppDB.create({
      ...check.value,
      source: "public",
      status: "접수"
    });

    resultBox.hidden = false;
    resultBox.innerHTML = `
      <strong>신청이 저장되었습니다.</strong>
      <p>접수번호: <b>${created.receiptNo}</b></p>
      <p>학생명: ${window.AppUtil.escapeHtml(created.studentName)} / 학교: ${window.AppUtil.escapeHtml(created.schoolName)}</p>
      <p>관리자 목록 화면에서 바로 확인할 수 있습니다.</p>
      <div class="button-row">
        <a class="btn btn-secondary" href="admin-list.html">관리자 목록으로 이동</a>
      </div>
    `;

    form.reset();
    window.AppForms.initForm(form, "public");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
