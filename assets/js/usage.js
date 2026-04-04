document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("page-content");
  if (!mount) return;

  const steps = [
    { title: "1. 사업안내 확인", desc: "대상, 기간, 지원형태를 확인합니다." },
    { title: "2. 학교 선택 및 신청", desc: "지역과 학교를 선택하고 학생/보호자 정보를 입력합니다." },
    { title: "3. 관리자 검토", desc: "접수 후 상태를 검토중, 승인, 보완요청 등으로 관리합니다." },
    { title: "4. 지원 제공", desc: "정책에 따라 바우처 지급 또는 현물 준비 절차를 진행합니다." }
  ];

  mount.innerHTML = `
    <section class="section-block">
      <div class="section-head">
        <h3>학부모 사용 흐름</h3>
        <p>TF 설명용으로 바로 읽을 수 있는 간단한 사용자 여정입니다.</p>
      </div>
      <div class="timeline-grid">
        ${steps.map((step) => `
          <article class="timeline-card">
            <strong>${step.title}</strong>
            <p>${step.desc}</p>
          </article>
        `).join("")}
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>관리자 화면에서 확인할 것</h3>
      </div>
      <div class="feature-grid">
        <article class="feature-card">
          <h4>접수 누락 여부</h4>
          <p>지역/학교 필터로 누락 없이 들어왔는지 빠르게 확인할 수 있어야 합니다.</p>
        </article>
        <article class="feature-card">
          <h4>지원형태별 처리</h4>
          <p>현물 신청은 품목과 사이즈, 바우처 신청은 지급/사용 안내가 핵심입니다.</p>
        </article>
        <article class="feature-card">
          <h4>보완요청 이력</h4>
          <p>관리자 메모와 상태값이 한눈에 보여야 문의 대응이 편해집니다.</p>
        </article>
        <article class="feature-card">
          <h4>학교 키 처리</h4>
          <p>같은 이름 학교가 생겨도 혼동되지 않게 schoolId 기준 저장을 권장합니다.</p>
        </article>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>운영 메모</h3>
      </div>
      <ul class="check-list">
        <li>바우처 단일형이면 신청서가 짧아지고 민원 응대 문구가 중요해집니다.</li>
        <li>현물/바우처 선택형이면 학부모 입장에서 “언제까지 바꿀 수 있는지” 질문이 많아질 가능성이 큽니다.</li>
        <li>신입생 시점에는 반/번호가 미정일 수 있으므로 화면상 optional 처리 여부를 회의에서 합의해두면 좋습니다.</li>
        <li>학교 데이터는 엑셀 기반으로 두고, 실제 운영에서는 최신 학교 마스터를 정기 반영하는 흐름이 필요합니다.</li>
      </ul>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>현재 데모 설정</h3>
      </div>
      <div class="alert-box">
        <p>
          현재 <strong>${window.AppUtil.getModeLabel()}</strong> 모드로 설정되어 있습니다.
          <code>assets/js/config.js</code> 의 <code>policy.mode</code> 값을
          <code>"voucher"</code> 또는 <code>"choice"</code> 로 바꾸면 안내와 신청서 UI가 함께 바뀝니다.
        </p>
      </div>
    </section>
  `;
});
