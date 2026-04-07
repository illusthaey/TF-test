document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('page-content');
  if (!mount) return;

  const steps = [
    { title: '1. 지역 · 학교급 선택', desc: '지역과 학교급은 어떤 순서로 선택해도 되고, 둘 중 하나만 골라도 학교 목록이 먼저 선별됩니다.' },
    { title: '2. 신청 정보 입력', desc: '반과 번호는 자유 입력이 가능하지만 관리자 화면에서는 정규화된 값으로 보입니다.' },
    { title: '3. 제출 전 최종 확인', desc: '신청서 제출 버튼을 누르면 입력 내용을 요약한 확인 팝업이 다시 열립니다.' },
    { title: '4. 관리자 단계 처리', desc: '학교 담당자 화면과 도교육청 관리자 화면에서 역할에 맞게 조회와 처리를 이어갑니다.' }
  ];

  mount.innerHTML = `
    <section class="section-block">
      <div class="section-head">
        <h3>학부모 사용 흐름</h3>
        <p>입력 확인 팝업까지 포함한 데모 기준 흐름입니다.</p>
      </div>
      <div class="timeline-grid">
        ${steps.map((step) => `
          <article class="timeline-card">
            <strong>${step.title}</strong>
            <p>${step.desc}</p>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>관리자 화면에서 확인할 것</h3>
      </div>
      <div class="feature-grid">
        <article class="feature-card">
          <h4>학교 담당자 화면</h4>
          <p>반려 처리, 학교장 승인 대기 건 변경, 번호까지의 틀고정 스크롤.</p>
        </article>
        <article class="feature-card">
          <h4>도교육청 관리자 화면</h4>
          <p>지역, 학교급, 학교명 필터, 헤더 3단계 정렬 동작.</p>
        </article>
        <article class="feature-card">
          <h4>학교 필터 규칙</h4>
          <p>분교는 본교로 통합하고, 병설유치원은 유치원 급에서만 별도 선택되도록 구성</p>
        </article>
        <article class="feature-card">
          <h4>데이터 정규화</h4>
          <p>‘달반’과 ‘달’, ‘3번’과 ‘3’이 관리자 화면에서 같은 값으로 취급되는지 확인.</p>
        </article>
      </div>
    </section>
  `;
});
