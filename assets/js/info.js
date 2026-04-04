document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("page-content");
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
          <div><dt>사용/지급</dt><dd>${mode === "voucher" ? "바우처 지급형(예시)" : "현물 또는 바우처 선택형(예시)"}</dd></div>
        </dl>
      </article>

      <article class="info-card">
        <h3>화면 설계</h3>
        <ul class="check-list">
          <li>도교육청 도메인 하위 서비스처럼 보이도록 공공기관형 레이아웃을 유지했습니다.</li>
          <li>관리자 화면은 다자녀 관리자 추가 폼과 비슷한 테이블 구조를 적용했습니다.</li>
        </ul>
      </article>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>정책안 비교</h3>
        <p>바우처 단일 지원으로 통합/ 또는 바우처와 현물 혼합</p>
      </div>
      <div class="table-scroll">
        <table class="tbl-list compare-table">
          <caption>비교</caption>
          <thead>
            <tr>
              <th scope="col">구분</th>
              <th scope="col">바우처 단일형</th>
              <th scope="col">현물 / 바우처 택1형</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">신청 UI</th>
              <td>신청서가 단순하며 지급/사용 안내가 중심</td>
              <td>지원형태 선택과 현물 상세 입력 UI 필요</td>
            </tr>
            <tr>
              <th scope="row">관리자 처리</th>
              <td>사용처 및 지급상태 확인 중심</td>
              <td>현물 배부/사이즈/추가 요청사항 확인 필요</td>
            </tr>
            <tr>
              <th scope="row">안내 문구</th>
              <td>사용 가능 기간, 가맹점, 잔액 안내 중요</td>
              <td>배부 일정, 품목, 사이즈 변경 절차 안내 중요</td>
            </tr>
            <tr>
              <th scope="row">현재 설정</th>
              <td class="${mode === "voucher" ? "cell-highlight" : ""}">${mode === "voucher" ? "현재 적용 중" : "-"}</td>
              <td class="${mode === "choice" ? "cell-highlight" : ""}">${mode === "choice" ? "현재 적용 중" : "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>외주 개발로 넘길 때 전달하면 좋은 포인트</h3>
      </div>
      <div class="feature-grid">
        <article class="feature-card">
          <h4>레이아웃 우선 고정</h4>
          <p>헤더, GNB, 좌측 사이드메뉴, breadcrumb, 관리자 테이블폼을 우선 합의하면 나중에 JSP 전환이 쉬워집니다.</p>
        </article>
        <article class="feature-card">
          <h4>정책 변수 분리</h4>
          <p>지원형태, 지급 문구, 필수 입력항목을 설정값처럼 분리해두면 정책 변경에 대응하기 좋습니다.</p>
        </article>
        <article class="feature-card">
          <h4>학교 데이터 키 설계</h4>
          <p>학교명이 아니라 학교 ID/코드 기준으로 저장하도록 요구하면 중복명 이슈를 피할 수 있습니다.</p>
        </article>
        <article class="feature-card">
          <h4>관리자 검토 단계</h4>
          <p>접수 → 검토중 → 승인/보완요청/반려 같은 상태값을 초기에 합의하면 목록/통계 설계가 안정됩니다.</p>
        </article>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>데모 범위</h3>
      </div>
      <div class="alert-box subtle">
        <p>
          이 프로토타입은 <strong>실제 인증, 결제, 정산, 개인정보 서버 저장 기능 없이</strong>
          화면 흐름과 데이터 구조만 검토하기 위한 정적 데모입니다.
          그래서 신청 결과는 브라우저에만 저장되고, 새 기기에서는 공유되지 않습니다.
        </p>
      </div>
    </section>
  `;
});
