document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("page-content");
  if (!mount) return;
  const isVoucherOnly = window.APP_CONFIG.policy.mode === "voucher";

  const faqs = [
    {
      q: "이 페이지는 실제 운영 페이지인가요?",
      a: "아니오. TF팀 전달용 테스트 페이지입니다. 다자녀 입학 준비금 신청 페이지와 유사하게 작업했습니다."
    },
    {
      q: "신청 데이터는 어디에 저장되나요?",
      a: "서버와 데이터베이스가 없어서 저장되지 않습니다. 샘플 테스트용으로만 생각 부탁드립니다."
    },
    {
      q: "데이터 저장 없이 학교 목록은 어떻게 구현한 거예요?",
      a: "코드 안에 다 집어넣었습니다."
    },
    {
      q: "현물과 바우처 중 선택할 수 있나요?",
      a: isVoucherOnly
        ? "현재 데모 설정은 바우처 단일형입니다. config.js에서 policy.mode를 \"choice\"로 바꾸면 선택형 UI를 확인할 수 있습니다."
        : "현재 데모 설정은 현물/바우처 선택형입니다. 신청서에서 지원형태를 고르면 현물 상세 입력영역이 자동으로 열립니다."
    },
    {
      q: "반과 번호를 꼭 입력해야 하나요?",
      a: "신입생 시점에는 미정일 수 있어 이 데모에서는 선택 입력처럼 다뤘습니다. 실제 운영 규칙은 TF에서 확정하면 됩니다."
    },
    {
      q: "외주 업체에 무엇을 먼저 전달하면 좋나요?",
      a: "화면 흐름, 필수 입력항목, 상태값, 학교 키 처리 방식, 사업 정책 변수 등을 먼저 전달하면 구현 범위가 빠르게 정해질 것 같습니다."
    }
  ];

  mount.innerHTML = `
    <section class="faq-list">
      ${faqs.map((item, index) => `
        <details class="faq-item" ${index === 0 ? "open" : ""}>
          <summary>${item.q}</summary>
          <div class="faq-answer">
            <p>${item.a}</p>
          </div>
        </details>
      `).join("")}
    </section>
  `;
});
