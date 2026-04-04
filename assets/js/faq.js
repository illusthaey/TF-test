document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("page-content");
  if (!mount) return;
  const isVoucherOnly = window.APP_CONFIG.policy.mode === "voucher";

  const faqs = [
    {
      q: "이 페이지는 실제 운영 페이지인가요?",
      a: "아니요. TF 검토용 정적 목업입니다. 실제 인증/지급/정산 기능은 연결되어 있지 않고, 브라우저 localStorage에만 저장됩니다."
    },
    {
      q: "학교명이 같은 경우는 어떻게 처리하나요?",
      a: "화면에는 학교명을 보여주지만 내부 저장은 schoolId를 기준으로 처리하도록 설계했습니다. 실제 운영에서도 학교 코드 기반 처리가 안전합니다."
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
      q: "신청 데이터는 어디에 저장되나요?",
      a: "정적 데모라서 서버가 없고, 브라우저 localStorage에만 저장됩니다. 다른 PC나 브라우저에서는 보이지 않습니다."
    },
    {
      q: "관리자 화면에서 무엇을 보여줘야 하나요?",
      a: "접수번호, 신청일, 지역, 학교, 학생명, 지원형태, 상태, 메모를 기본으로 보고, 필터와 CSV 다운로드를 함께 두는 구성이 실무 설명에 유리합니다."
    },
    {
      q: "외주 개발사에 무엇을 먼저 전달하면 좋나요?",
      a: "화면 흐름, 필수 입력항목, 상태값, 학교 키 처리 방식, 정책 변수(바우처/선택형)를 먼저 전달하면 구현 범위가 빠르게 정리됩니다."
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
