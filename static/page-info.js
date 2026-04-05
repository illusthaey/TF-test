document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('page-content');
  if (!mount) return;
  const mode = window.APP_CONFIG.policy.mode;

  mount.innerHTML = `
    <section class="info-grid">
      <article class="info-card">
        <h3>사업 개요</h3>
        <dl class="key-value-list">
          <div><dt>검토 대상</dt><dd>${window.APP_CONFIG.policy.sampleTarget}</dd></div>
          <div><dt>지원 금액</dt><dd>${window.APP_CONFIG.policy.sampleAmount}</dd></div>
          <div><dt>신청 시기</dt><dd>${window.APP_CONFIG.policy.sampleWindow}</dd></div>
          <div><dt>지원 방식</dt><dd>${mode === 'voucher' ? '바우처 단일형(예시)' : '바우처 또는 현물 선택형(예시)'}</dd></div>
        </dl>
      </article>

      <article class="info-card">
        <h3>기능 개선 사항</h3>
        <ul class="check-list">
          <li>학부모 신청 화면에서 지역/학교급에 따라 학교명 선택지가 필터링됨.</li>
          <li>학교 담당자 화면에서 데이터별 오름차순/내림차순 정렬 기능 추가</li>
          <li>신청자별로 상세 정보 및 업무 처리 이력 확인 기능 추가 </li>
        </ul>
      </article>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>지원 방식 비교</h3>
        <p>선택형 UI와 바우처 단일형 UI의 차이</p>
      </div>
      <div class="table-scroll">
        <table class="tbl-list compare-table">
          <caption>바우처 단일 vs 혼합형</caption>
          <thead>
            <tr>
              <th scope="col">구분</th>
              <th scope="col">바우처 단일형</th>
              <th scope="col">현물 / 바우처 선택형</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">신청 화면</th>
              <td>입력 항목이 단순하며 사용 안내가 중심입니다.</td>
              <td>지원 형태 선택에 따라 품목, 치수 입력 영역이 열립니다.</td>
            </tr>
            <tr>
              <th scope="row">관리자 처리</th>
              <td>지급 단계 확인이 중심입니다.</td>
              <td>품목 및 치수 확인이 함께 필요합니다.</td>
            </tr>
            <tr>
              <th scope="row">현재 설정</th>
              <td class="${mode === 'voucher' ? 'cell-highlight' : ''}">${mode === 'voucher' ? '현재 적용 중' : '-'}</td>
              <td class="${mode === 'choice' ? 'cell-highlight' : ''}">${mode === 'choice' ? '현재 적용 중' : '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>화면 설계 원칙</h3>
      </div>
      <div class="alert-box subtle">
        <p><strong>정책 검토 단계에서는</strong> 상태값, 필수 입력 항목, 학교 필터 규칙, 관리자 역할 분리를 먼저 고정하는 것이 구현 범위 산정에 가장 중요합니다.</p>
      </div>
    </section>
  `;
});
