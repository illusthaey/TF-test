(function () {
  function cycleSort(state, key) {
    if (state.key !== key) {
      state.key = key;
      state.direction = 'asc';
      return state;
    }

    if (state.direction === 'asc') {
      state.direction = 'desc';
      return state;
    }

    if (state.direction === 'desc') {
      state.key = '';
      state.direction = 'none';
      return state;
    }

    state.direction = 'asc';
    return state;
  }

  function sortItems(items, columns, sortState) {
    if (!sortState.key || sortState.direction === 'none') {
      return items.slice();
    }

    const column = columns.find((item) => item.key === sortState.key);
    if (!column) return items.slice();

    const sign = sortState.direction === 'asc' ? 1 : -1;
    return items.slice().sort((left, right) => {
      const compare = window.AppUtil.compareValues(column.value(left), column.value(right), column.type || 'string');
      if (compare !== 0) return compare * sign;
      return window.AppUtil.compareValues(left.createdAt, right.createdAt, 'date') * -1;
    });
  }

  function sortLabel(sortState, key) {
    if (sortState.key !== key || sortState.direction === 'none') return '기본';
    return sortState.direction === 'asc' ? '오름차순' : '내림차순';
  }

  function renderSortButton(label, key, sortState) {
    const stateText = sortLabel(sortState, key);
    const stateClass = stateText === '오름차순' ? 'is-asc' : stateText === '내림차순' ? 'is-desc' : '';
    return `
      <button type="button" class="sort-button ${stateClass}" data-sort-key="${key}" aria-label="${label} ${stateText} 정렬">
        <span>${label}</span>
      </button>
    `;
  }

  function bindSortButtons(scope, sortState, onChange) {
    scope.querySelectorAll('[data-sort-key]').forEach((button) => {
      if (button.dataset.sortBound === 'true') return;
      button.addEventListener('click', () => {
        cycleSort(sortState, button.dataset.sortKey);
        onChange();
      });
      button.dataset.sortBound = 'true';
    });
  }

  function buildDetailRows(item, options = {}) {
    const includeSchool = options.includeSchool !== false;
    const rows = [
      { label: '접수번호', value: item.receiptNo },
      { label: '신청일시', value: window.AppUtil.formatDateTime(item.createdAt) }
    ];

    if (includeSchool) {
      rows.push({ label: '지역', value: item.region });
      rows.push({ label: '학교급', value: item.schoolLevelLabel || window.AppUtil.schoolLevelLabel(item.schoolLevel) });
      rows.push({ label: '학교명', value: item.schoolName });
    }

    rows.push(
      { label: '학생 성명', value: item.studentName },
      { label: '학년', value: `${item.grade}학년` },
      { label: '반', value: item.className || '-' },
      { label: '번호', value: item.studentNo || '-' },
      { label: '생년월일', value: item.birthDate || '-' },
      { label: '보호자 성명', value: item.parentName },
      { label: '보호자 연락처', value: item.parentPhone || '-' },
      { label: '지원 형태', value: window.AppUtil.getSupportLabel(item.supportType) },
      { label: '품목', value: item.supportType === 'inKind' ? (item.itemRequest || '-') : '-' },
      { label: '치수(상의)', value: item.supportType === 'inKind' ? (item.topSize || '-') : '-' },
      { label: '치수(하의)', value: item.supportType === 'inKind' ? (item.bottomSize || '-') : '-' },
      { label: '상태', value: item.status },
      { label: '반려 사유', value: window.AppUtil.rejectionSummary(item) },
      { label: '관리 메모', value: item.adminMemo || '-' }
    );

    return rows;
  }

  function historyRows(item) {
    if (!Array.isArray(item.history) || !item.history.length) return '<p class="empty-note">처리 이력이 없습니다.</p>';
    return `
      <div class="table-scroll compact-scroll">
        <table class="tbl-list admin-history-table">
          <thead>
            <tr>
              <th scope="col">처리일시</th>
              <th scope="col">담당</th>
              <th scope="col">이전 상태</th>
              <th scope="col">변경 상태</th>
              <th scope="col">메모</th>
            </tr>
          </thead>
          <tbody>
            ${item.history.map((entry) => `
              <tr>
                <td>${window.AppUtil.formatDateTime(entry.at)}</td>
                <td>${window.AppUtil.escapeHtml(entry.actor || '-')}</td>
                <td>${window.AppUtil.escapeHtml(entry.fromStatus || '-')}</td>
                <td>${window.AppUtil.escapeHtml(entry.toStatus || '-')}</td>
                <td>${window.AppUtil.escapeHtml(entry.note || '-')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function fillDetailDialog(dialog, item, options = {}) {
    const body = dialog.querySelector('[data-dialog-body]');
    if (!body) return;
    const rows = buildDetailRows(item, options);
    body.innerHTML = `
      <div class="detail-section">
        <dl class="detail-grid">
          ${rows.map((row) => `
            <div>
              <dt>${window.AppUtil.escapeHtml(row.label)}</dt>
              <dd>${window.AppUtil.escapeHtml(row.value)}</dd>
            </div>
          `).join('')}
        </dl>
      </div>
      <div class="detail-section">
        <h4>처리 이력</h4>
        ${historyRows(item)}
      </div>
    `;
  }

  function openDialog(dialog) {
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  }

  function closeDialog(dialog) {
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }
  }

  window.AdminCommon = {
    cycleSort,
    sortItems,
    renderSortButton,
    bindSortButtons,
    fillDetailDialog,
    openDialog,
    closeDialog
  };
})();
