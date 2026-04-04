document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('page-content');
  if (!mount) return;

  mount.innerHTML = `
    <section class="section-block">
      <div class="section-head">
        <h3>역할별 관리자 화면 선택</h3>
        <p>같은 데이터를 서로 다른 역할 기준으로 확인할 수 있습니다.</p>
      </div>
      <div class="link-card-grid admin-link-grid">
        <a class="link-card" href="${window.AppPath.page('admin-school')}">
          <strong>신청 현황 (학교 담당자)</strong>
          <p>특정 학교 담당자 권한 기준. 번호까지 틀고정된 가로 스크롤과 학교 단계 처리 버튼을 확인합니다.</p>
        </a>
        <a class="link-card" href="${window.AppPath.page('admin-office')}">
          <strong>신청 현황 (도교육청 관리자)</strong>
          <p>지역, 학교급, 학교명 기준 필터와 헤더 정렬 기능을 확인합니다.</p>
        </a>
        <a class="link-card" href="${window.AppPath.page('admin-create')}">
          <strong>관리자 신규 등록</strong>
          <p>관리자가 신청 데이터를 수기 등록하는 입력 화면입니다.</p>
        </a>
      </div>
    </section>

    <section class="section-block compact">
      <div class="toolbar toolbar-single">
        <div>
          <h3>데모 데이터 관리</h3>
          <p class="toolbar-note">localStorage에 저장된 샘플 데이터를 초기 상태로 되돌릴 수 있습니다.</p>
        </div>
        <div class="button-row">
          <button type="button" class="btn btn-outline" id="btn-reset-seed">샘플 데이터 재생성</button>
        </div>
      </div>
    </section>
  `;

  document.getElementById('btn-reset-seed')?.addEventListener('click', () => {
    if (!confirm('현재 브라우저의 신청 데이터를 샘플 상태로 다시 채우시겠습니까?')) return;
    window.AppDB.ensureSeeded(true);
    window.AppUtil.showToast('샘플 데이터가 재생성되었습니다.');
  });
});
