document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("page-content");
  if (!mount) return;

  const items = window.AppDB.load();
  const summary = window.AppUtil.summarizeApplications(items);
  const mode = window.APP_CONFIG.policy.mode;

  mount.innerHTML = `
    <section class="home-grid">
      <article class="hero-card">
        <div class="hero-copy">
          <p class="eyebrow">TF 시연용</p>
          <h3>다자녀 입학준비금 구조를 닮은<br>교복 지원 웹페이지 샘플 테스트 페이지</h3>
          <div class="button-row">
            <a class="btn btn-primary" href="apply.html">학부모 신청 화면 보기</a>
            <a class="btn btn-secondary" href="admin-list.html">관리자 화면 보기</a>
          </div>
        </div>
        <div class="hero-points">
          <div class="mini-stat">
            <strong>${window.SCHOOLS_DATA.length.toLocaleString()}</strong>
            <span>학교 데이터</span>
          </div>
          <div class="mini-stat">
            <strong>${items.length}</strong>
            <span>목업 신청 건수</span>
          </div>
          <div class="mini-stat">
            <strong>${window.AppUtil.getModeLabel(mode)}</strong>
            <span>현재 설정 모드</span>
          </div>
        </div>
      </article>

    </section>

    <section class="stats-grid">
      <article class="stat-card">
        <span class="stat-label">총 접수</span>
        <strong class="stat-value">${summary.total}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">바우처</span>
        <strong class="stat-value">${summary.voucher}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">현물</span>
        <strong class="stat-value">${summary.inKind}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">승인</span>
        <strong class="stat-value">${summary.byStatus["승인"] || 0}</strong>
      </article>
    </section>


    <section class="section-block">
      <div class="section-head">
        <h3>이 프로토타입에서 보여줄 수 있는 것</h3>
      </div>
      <div class="feature-grid">
        <article class="feature-card">
          <h4>1. 정책안 비교</h4>
          <p>바우처 단일형과 선택형의 화면 차이를 같은 구조 안에서 보여줍니다.</p>
        </article>
        <article class="feature-card">
          <h4>2. 행정 입력 중심 UX</h4>
          <p>관리자 화면은 빠른 입력과 검토에 초점을 둔 표 형식으로 구성했습니다.</p>
        </article>
        <article class="feature-card">
          <h4>3. 외주 이관 용이성</h4>
          <p>화면 요소를 분리해 JSP/jQuery 구조로 옮기기 쉽게 만들었습니다.</p>
        </article>
        <article class="feature-card">
          <h4>4. 학교 데이터 반영</h4>
          <p>업로드한 학교 엑셀을 기반으로 지역/학교 선택 데이터를 구성했습니다.</p>
        </article>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>최근 목업 신청 데이터</h3>
        <p>브라우저 localStorage 기반 예시 데이터입니다.</p>
      </div>
      <div class="table-scroll">
        <table class="tbl-list">
          <caption>최근 목업 신청 데이터</caption>
          <thead>
            <tr>
              <th scope="col">접수번호</th>
              <th scope="col">신청일</th>
              <th scope="col">학교</th>
              <th scope="col">학생명</th>
              <th scope="col">지원형태</th>
              <th scope="col">상태</th>
            </tr>
          </thead>
          <tbody>
            ${items.slice(0, 5).map((item) => `
              <tr>
                <td>${item.receiptNo}</td>
                <td>${window.AppUtil.formatDate(item.createdAt)}</td>
                <td>${window.AppUtil.escapeHtml(item.schoolName)}</td>
                <td>${window.AppUtil.escapeHtml(item.studentName)}</td>
                <td>${window.AppUtil.escapeHtml(window.AppUtil.getSupportLabel(item.supportType))}</td>
                <td><span class="status-pill ${window.AppUtil.statusClass(item.status)}">${window.AppUtil.escapeHtml(item.status)}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
});
