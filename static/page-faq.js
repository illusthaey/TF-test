document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('page-content');
  if (!mount) return;

  const isVoucherOnly = window.APP_CONFIG.policy.mode === 'voucher';
  const faqs = [
    {
      q: '이 페이지는 실제 운영 페이지인가요?',
      a: '아니오. TF팀 검토용 정적 데모 페이지입니다. 실제 서버 저장, 인증, 권한 연동은 구현되어 있지 않습니다.'
    },
    {
      q: '신청 데이터는 어디에 저장되나요?',
      a: '데이터베이스 서버가 없어서 로컬 PC에 임시 저장됩니다.'
    },
    {
      q: '분교와 병설유치원은 어떻게 처리되나요?',
      a: '분교는 본교 학교명으로 통합하고, 병설유치원은 초등학교와 분리된 유치원 급 목록에서 보이도록 정리했습니다.'
    },
    {
      q: '반과 번호에 반/번을 붙여 입력해도 되나요?',
      a: '네. 신청 화면에서는 자유롭게 입력할 수 있고, 관리자 화면에서는 끝의 반·번 글자를 제외한 값으로 형식을 통일하여 보여줍니다.'
    },
    {
      q: '현물과 바우처 중 선택할 수 있나요?',
      a: isVoucherOnly
        ? '현재 설정은 바우처 단일형입니다. APP_CONFIG.policy.mode 값을 choice로 두면 선택형 UI가 열립니다.'
        : '현재 데모는 바우처/현물 선택형입니다. 현물을 선택하면 품목과 치수 입력 칸이 자동으로 나타납니다.'
    },
    {
      q: '관리자 화면이 두 개로 나뉜 이유는 무엇인가요?',
      a: '학교 담당자는 지역/학교명 정보는 불필요하고, 도교육청 관리자는 지역·학교급·학교명 기준으로 전체 현황을 선별해야 해서 분리했습니다.'
    }
  ];

  mount.innerHTML = `
    <section class="faq-list">
      ${faqs.map((item, index) => `
        <details class="faq-item" ${index === 0 ? 'open' : ''}>
          <summary>${item.q}</summary>
          <div class="faq-answer">
            <p>${item.a}</p>
          </div>
        </details>
      `).join('')}
    </section>
  `;
});
