document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('page-content');
  if (!mount) return;

  const items = window.AppDB.load();
  const summary = window.AppUtil.summarizeApplications(items);

  mount.innerHTML = `
    <section class="home-grid">
      <article class="hero-card">
        <div class="hero-copy">
          <p class="eyebrow">TF 시연용 테스트 페이지</p>
          <h3>사업 부서 의사 결정 및 소통 보조 도구</h3>
          <div class="button-row">
            <a class="btn btn-primary" href="${window.AppPath.page('apply')}">학부모 신청 화면 보기</a>
            <a class="btn btn-secondary" href="${window.AppPath.page('admin-list')}">관리자 화면 선택</a>
          </div>
        </div>
        <div class="hero-points">
          <div class="mini-stat">
            <strong>${window.AppSchools.canonicalSchools.length.toLocaleString()}</strong>
            <span>강원특별자치도 소속 학교 목록</span>
          </div>
          <div class="mini-stat">
            <strong>${items.length}</strong>
            <span>신청 건수 (테스트용)</span>
          </div>
          <div class="mini-stat">
            <strong>${window.APP_CONFIG.statuses.length}</strong>
            <span>진행 상태 단계</span>
          </div>
        </div>
      </article>
    </section>

    <section class="stats-grid">
      <article class="stat-card">
        <span class="stat-label">총 접수 건</span>
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
        <span class="stat-label">지급 완료</span>
        <strong class="stat-value">${summary.byStatus['지급 완료'] || 0}</strong>
      </article>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>이번 수정에서 반영한 핵심</h3>
      </div>
      <div class="feature-grid">
        <article class="feature-card">
          <h4>1. 학교 필터 정교화</h4>
          <p>지역과 학교급을 어떤 순서로 선택해도 학교 목록이 즉시 함께 좁혀집니다.</p>
        </article>
        <article class="feature-card">
          <h4>2. 반·번호 정규화</h4>
          <p>신청 시 ‘반’, ‘번’을 붙여 입력해도 관리자 화면에서는 정리된 값으로 조회됩니다.</p>
        </article>
        <article class="feature-card">
          <h4>3. 역할별 관리자 화면 분리</h4>
          <p>학교 담당자용 화면과 도교육청 관리자용 화면을 별도 HTML로 나눴습니다.</p>
        </article>
        <article class="feature-card">
          <h4>4. 공통 스크립트 분리</h4>
          <p>중복되던 설정·학교 데이터·유틸을 static 폴더로 분리해 가독성을 높였습니다.</p>
        </article>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h3>최근 신청 데이터</h3>
        <p>localStorage에 저장된 데모 데이터 기준입니다.</p>
      </div>
      <div class="table-scroll">
        <table class="tbl-list compact-table">
          <caption>최근 신청 데이터</caption>
          <thead>
            <tr>
              <th scope="col">신청일시</th>
              <th scope="col">지역</th>
              <th scope="col">학교명</th>
              <th scope="col">학생 성명</th>
              <th scope="col">지원형태</th>
              <th scope="col">상태</th>
            </tr>
          </thead>
          <tbody>
            ${items.slice(0, 5).map((item) => `
              <tr>
                <td>${window.AppUtil.formatDateTime(item.createdAt)}</td>
                <td>${window.AppUtil.escapeHtml(item.region)}</td>
                <td>${window.AppUtil.escapeHtml(item.schoolName)}</td>
                <td>${window.AppUtil.escapeHtml(item.studentName)}</td>
                <td>${window.AppUtil.escapeHtml(window.AppUtil.getSupportLabel(item.supportType))}</td>
                <td><span class="status-pill ${window.AppUtil.statusClass(item.status)}">${window.AppUtil.escapeHtml(item.status)}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
});
