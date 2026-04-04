document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("page-content");
  if (!mount) return;

  mount.innerHTML = `
    <section class="section-block compact">
      <div class="toolbar">
        <div>
          <h3>관리자 신청 현황</h3>
          <p class="toolbar-note">필터, 상태 변경, CSV 다운로드, 샘플 데이터 재생성을 지원합니다.</p>
        </div>
        <div class="button-row">
          <a class="btn btn-primary" href="admin-create.html">신규 등록</a>
          <button type="button" class="btn btn-secondary" id="btn-export">CSV 다운로드</button>
          <button type="button" class="btn btn-outline" id="btn-seed">샘플 데이터 재생성</button>
        </div>
      </div>

      <form class="filter-panel" id="admin-filter-form">
        <div class="filter-grid">
          <label>
            <span>지역</span>
            <select name="region">
              ${window.AppForms.regionOptions("", true)}
            </select>
          </label>
          <label>
            <span>학교</span>
            <select name="schoolId">
              <option value="">전체</option>
            </select>
          </label>
          <label>
            <span>상태</span>
            <select name="status">
              <option value="">전체</option>
              ${window.APP_CONFIG.statuses.map((status) => `<option value="${status}">${status}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>지원형태</span>
            <select name="supportType">
              <option value="">전체</option>
              <option value="voucher">바우처</option>
              <option value="inKind">현물</option>
            </select>
          </label>
          <label class="wide">
            <span>키워드</span>
            <input type="search" name="keyword" placeholder="학생명, 보호자명, 학교명 검색">
          </label>
          <div class="filter-actions">
            <button type="submit" class="btn btn-primary">검색</button>
            <button type="button" class="btn btn-secondary" id="btn-reset-filters">초기화</button>
          </div>
        </div>
      </form>

      <div class="stats-grid" id="admin-summary"></div>

      <div class="table-scroll">
        <table class="tbl-list" id="admin-table">
          <caption>교복 지원 신청 현황</caption>
          <thead>
            <tr>
              <th scope="col">접수번호</th>
              <th scope="col">신청일</th>
              <th scope="col">지역</th>
              <th scope="col">학교</th>
              <th scope="col">학생명</th>
              <th scope="col">학년</th>
              <th scope="col">지원형태</th>
              <th scope="col">상태</th>
              <th scope="col">작업</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <dialog id="detail-dialog" class="detail-dialog">
      <form method="dialog" class="detail-dialog-inner">
        <div class="detail-dialog-header">
          <strong>신청 상세</strong>
          <button type="submit" class="dialog-close" aria-label="닫기">닫기</button>
        </div>
        <div id="detail-dialog-body"></div>
      </form>
    </dialog>
  `;

  const state = {
    items: window.AppDB.load(),
    filtered: [],
    filters: {
      region: "",
      schoolId: "",
      status: "",
      supportType: "",
      keyword: ""
    }
  };

  const filterForm = document.getElementById("admin-filter-form");
  const tableBody = document.querySelector("#admin-table tbody");
  const summaryBox = document.getElementById("admin-summary");
  const schoolSelect = filterForm.elements.schoolId;
  const detailDialog = document.getElementById("detail-dialog");
  const detailBody = document.getElementById("detail-dialog-body");

  function syncSchoolOptions() {
    const region = filterForm.elements.region.value;
    const selected = filterForm.elements.schoolId.value;
    const options = window.AppForms.schoolOptions(region, selected, "");
    schoolSelect.innerHTML = options.replace('학교를 선택하세요', '전체');
    const emptyOption = schoolSelect.querySelector('option[value=""]');
    if (emptyOption) emptyOption.textContent = "전체";
  }

  function getFilteredItems() {
    const { region, schoolId, status, supportType, keyword } = state.filters;
    const lowerKeyword = keyword.toLowerCase();

    return state.items.filter((item) => {
      if (region && item.region !== region) return false;
      if (schoolId && item.schoolId !== schoolId) return false;
      if (status && item.status !== status) return false;
      if (supportType && item.supportType !== supportType) return false;
      if (lowerKeyword) {
        const source = `${item.studentName} ${item.parentName} ${item.schoolName} ${item.receiptNo}`.toLowerCase();
        if (!source.includes(lowerKeyword)) return false;
      }
      return true;
    });
  }

  function renderSummary(items) {
    const byStatus = window.AppUtil.summarizeApplications(items).byStatus;
    summaryBox.innerHTML = `
      <article class="stat-card">
        <span class="stat-label">조회 건수</span>
        <strong class="stat-value">${items.length}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">접수 + 검토중</span>
        <strong class="stat-value">${(byStatus["접수"] || 0) + (byStatus["검토중"] || 0)}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">승인</span>
        <strong class="stat-value">${byStatus["승인"] || 0}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">보완/반려</span>
        <strong class="stat-value">${(byStatus["보완요청"] || 0) + (byStatus["반려"] || 0)}</strong>
      </article>
    `;
  }

  function renderTable(items) {
    if (!items.length) {
      tableBody.innerHTML = `<tr><td colspan="9" class="empty-cell">조건에 맞는 신청이 없습니다.</td></tr>`;
      return;
    }

    tableBody.innerHTML = items.map((item) => `
      <tr>
        <td>${item.receiptNo}</td>
        <td>${window.AppUtil.formatDate(item.createdAt)}</td>
        <td>${window.AppUtil.escapeHtml(item.region)}</td>
        <td>
          <div class="table-school">
            <strong>${window.AppUtil.escapeHtml(item.schoolName)}</strong>
            <span>${window.AppUtil.escapeHtml(item.schoolLevel || "-")}</span>
          </div>
        </td>
        <td>${window.AppUtil.escapeHtml(item.studentName)}</td>
        <td>${window.AppUtil.escapeHtml(item.grade)}학년</td>
        <td>${window.AppUtil.escapeHtml(window.AppUtil.getSupportLabel(item.supportType))}</td>
        <td>
          <select class="inline-status-select" data-id="${item.id}">
            ${window.APP_CONFIG.statuses.map((status) => `<option value="${status}" ${status === item.status ? "selected" : ""}>${status}</option>`).join("")}
          </select>
        </td>
        <td>
          <div class="button-stack">
            <button type="button" class="btn btn-small btn-outline" data-action="detail" data-id="${item.id}">상세</button>
            <button type="button" class="btn btn-small btn-secondary" data-action="memo" data-id="${item.id}">메모</button>
          </div>
        </td>
      </tr>
    `).join("");

    tableBody.querySelectorAll(".inline-status-select").forEach((select) => {
      select.addEventListener("change", () => {
        window.AppDB.updateStatus(select.dataset.id, select.value);
        refresh();
        window.AppUtil.showToast("상태가 변경되었습니다.");
      });
    });

    tableBody.querySelectorAll('[data-action="detail"]').forEach((button) => {
      button.addEventListener("click", () => {
        openDetail(button.dataset.id);
      });
    });

    tableBody.querySelectorAll('[data-action="memo"]').forEach((button) => {
      button.addEventListener("click", () => {
        const record = window.AppDB.get(button.dataset.id);
        const memo = prompt("관리자 메모를 입력하세요.", record?.adminMemo || "");
        if (memo === null) return;
        window.AppDB.updateMemo(button.dataset.id, memo);
        refresh();
        window.AppUtil.showToast("메모가 저장되었습니다.");
      });
    });
  }

  function openDetail(id) {
    const item = window.AppDB.get(id);
    if (!item) return;
    detailBody.innerHTML = `
      <dl class="detail-grid">
        <div><dt>접수번호</dt><dd>${item.receiptNo}</dd></div>
        <div><dt>신청일</dt><dd>${window.AppUtil.formatDateTime(item.createdAt)}</dd></div>
        <div><dt>지역</dt><dd>${window.AppUtil.escapeHtml(item.region)}</dd></div>
        <div><dt>학교</dt><dd>${window.AppUtil.escapeHtml(item.schoolName)} (${window.AppUtil.escapeHtml(item.schoolLevel || "-")})</dd></div>
        <div><dt>학생명</dt><dd>${window.AppUtil.escapeHtml(item.studentName)}</dd></div>
        <div><dt>생년월일</dt><dd>${window.AppUtil.escapeHtml(item.birthDate || "-")}</dd></div>
        <div><dt>학생 연락처</dt><dd>${window.AppUtil.escapeHtml(item.studentPhone || "-")}</dd></div>
        <div><dt>보호자</dt><dd>${window.AppUtil.escapeHtml(item.parentName)} / ${window.AppUtil.escapeHtml(item.parentPhone || "-")}</dd></div>
        <div><dt>학년/반/번호</dt><dd>${window.AppUtil.escapeHtml(item.grade)}학년 / ${window.AppUtil.escapeHtml(item.className || "-")} / ${window.AppUtil.escapeHtml(item.studentNo || "-")}</dd></div>
        <div><dt>지원형태</dt><dd>${window.AppUtil.escapeHtml(window.AppUtil.getSupportLabel(item.supportType))}</dd></div>
        <div><dt>현물 품목</dt><dd>${window.AppUtil.escapeHtml(item.itemRequest || "-")}</dd></div>
        <div><dt>사이즈</dt><dd>상의 ${window.AppUtil.escapeHtml(item.topSize || "-")} / 하의 ${window.AppUtil.escapeHtml(item.bottomSize || "-")}</dd></div>
        <div><dt>비고</dt><dd>${window.AppUtil.escapeHtml(item.remarks || "-")}</dd></div>
        <div><dt>상태</dt><dd><span class="status-pill ${window.AppUtil.statusClass(item.status)}">${window.AppUtil.escapeHtml(item.status)}</span></dd></div>
        <div><dt>관리자 메모</dt><dd>${window.AppUtil.escapeHtml(item.adminMemo || "-")}</dd></div>
      </dl>
    `;
    if (typeof detailDialog.showModal === "function") detailDialog.showModal();
  }

  function refresh() {
    state.items = window.AppDB.load();
    state.filtered = getFilteredItems();
    renderSummary(state.filtered);
    renderTable(state.filtered);
  }

  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.filters = {
      region: filterForm.elements.region.value,
      schoolId: filterForm.elements.schoolId.value,
      status: filterForm.elements.status.value,
      supportType: filterForm.elements.supportType.value,
      keyword: filterForm.elements.keyword.value.trim()
    };
    refresh();
  });

  filterForm.elements.region.addEventListener("change", () => {
    syncSchoolOptions();
  });

  document.getElementById("btn-reset-filters").addEventListener("click", () => {
    filterForm.reset();
    syncSchoolOptions();
    state.filters = { region: "", schoolId: "", status: "", supportType: "", keyword: "" };
    refresh();
  });

  document.getElementById("btn-export").addEventListener("click", () => {
    const rows = [
      ["접수번호", "신청일", "지역", "학교명", "학교급", "학생명", "학년", "반", "번호", "학생 연락처", "보호자 성명", "보호자 연락처", "지원형태", "현물 품목", "상의 사이즈", "하의 사이즈", "상태", "관리자 메모"]
    ];
    state.filtered.forEach((item) => {
      rows.push([
        item.receiptNo,
        window.AppUtil.formatDateTime(item.createdAt),
        item.region,
        item.schoolName,
        item.schoolLevel,
        item.studentName,
        item.grade,
        item.className,
        item.studentNo,
        item.studentPhone,
        item.parentName,
        item.parentPhone,
        window.AppUtil.getSupportLabel(item.supportType),
        item.itemRequest,
        item.topSize,
        item.bottomSize,
        item.status,
        item.adminMemo
      ]);
    });
    window.AppUtil.downloadCsv("uniform-support-applications.csv", rows);
  });

  document.getElementById("btn-seed").addEventListener("click", () => {
    if (!confirm("현재 브라우저 데이터에 샘플 데이터를 다시 채우시겠습니까?")) return;
    window.AppDB.ensureSeeded(true);
    state.filters = { region: "", schoolId: "", status: "", supportType: "", keyword: "" };
    filterForm.reset();
    syncSchoolOptions();
    refresh();
    window.AppUtil.showToast("샘플 데이터가 재생성되었습니다.");
  });

  syncSchoolOptions();
  refresh();
});
