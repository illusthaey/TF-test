(function () {
  const STATUS_ORDER = (window.APP_CONFIG?.statuses || []).reduce((acc, status, index) => {
    acc[status] = index;
    return acc;
  }, {});

  const SCHOOL_LEVEL_LABELS = (window.APP_CONFIG?.schoolLevels || []).reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function digits(value) {
    return String(value ?? "").replace(/\D/g, "");
  }

  function formatPhone(value) {
    const source = digits(value).slice(0, 11);
    if (!source) return "";
    if (source.length < 4) return source;
    if (source.length < 8) return `${source.slice(0, 3)}-${source.slice(3)}`;
    return `${source.slice(0, 3)}-${source.slice(3, 7)}-${source.slice(7)}`;
  }

  function bindPhoneFormatter(scope = document) {
    scope.querySelectorAll('input[data-phone]').forEach((input) => {
      if (input.dataset.phoneBound === 'true') return;
      input.addEventListener('input', () => {
        input.value = formatPhone(input.value);
      });
      input.dataset.phoneBound = 'true';
    });
  }

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return String(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }

  function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return String(dateString);
    return `${formatDate(dateString)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  function uid(prefix = 'ID') {
    const seed = Math.random().toString(36).slice(2, 10).toUpperCase();
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${seed}`;
  }

  function getSupportLabel(type) {
    const labels = window.APP_CONFIG?.policy?.labels || {};
    return labels[type] || type || '-';
  }

  function schoolLevelLabel(value) {
    return SCHOOL_LEVEL_LABELS[value] || value || '-';
  }

  function statusClass(status) {
    const map = {
      '신청 접수': 'status-received',
      '학교장 승인 대기': 'status-review',
      '담당자 반려': 'status-rejected',
      '학교장 승인': 'status-approved',
      '학교장 반려': 'status-rejected',
      '도교육청 접수': 'status-office',
      '도교육청 승인': 'status-approved',
      '지급 완료': 'status-complete'
    };
    return map[status] || 'status-default';
  }

  function modeBadgeHtml() {
    const mode = window.APP_CONFIG?.policy?.mode;
    const label = mode === 'voucher' ? '바우처 단일' : '바우처 / 현물 선택형';
    return `<span class="mode-badge">${escapeHtml(label)}</span>`;
  }

  function normalizeClassName(value) {
    return String(value ?? '')
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s*반$/u, '')
      .trim();
  }

  function normalizeStudentNo(value) {
    return digits(String(value ?? '').replace(/번$/u, ''));
  }

  function validateBirthDate(value) {
    if (!value) return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return false;
    return value <= todayIso();
  }

  function textOrDash(value) {
    return value ? String(value) : '-';
  }

  function summarizeApplications(items) {
    const summary = {
      total: items.length,
      voucher: 0,
      inKind: 0,
      byStatus: {}
    };
    items.forEach((item) => {
      summary.byStatus[item.status] = (summary.byStatus[item.status] || 0) + 1;
      if (item.supportType === 'inKind') summary.inKind += 1;
      else summary.voucher += 1;
    });
    return summary;
  }

  function downloadCsv(filename, rows) {
    const escapeCell = (cell) => {
      const value = String(cell ?? '');
      if (/[",\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };
    const csv = rows.map((row) => row.map(escapeCell).join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }

  function showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  function rejectionSummary(item) {
    const reasons = Array.isArray(item.rejectionReasons) ? item.rejectionReasons.filter(Boolean) : [];
    const detail = String(item.rejectionReasonText || '').trim();
    if (!reasons.length && !detail) return '-';
    if (detail && !reasons.includes('기타')) {
      return [...reasons, detail].join(', ');
    }
    const parts = reasons.filter((reason) => reason !== '기타');
    if (detail) parts.push(`기타: ${detail}`);
    return parts.join(', ');
  }

  function compareValues(left, right, type = 'string') {
    if (type === 'number') {
      const a = Number(left || 0);
      const b = Number(right || 0);
      return a - b;
    }

    if (type === 'date') {
      const a = new Date(left || 0).getTime();
      const b = new Date(right || 0).getTime();
      return a - b;
    }

    if (type === 'status') {
      const a = STATUS_ORDER[left] ?? Number.MAX_SAFE_INTEGER;
      const b = STATUS_ORDER[right] ?? Number.MAX_SAFE_INTEGER;
      return a - b;
    }

    return String(left ?? '').localeCompare(String(right ?? ''), 'ko', {
      numeric: true,
      sensitivity: 'base'
    });
  }

  function bindArrowNavigation(scope) {
    if (!scope || scope.dataset.arrowNavBound === 'true') return;
    const selector = 'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])';

    scope.addEventListener('keydown', (event) => {
      const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (!keys.includes(event.key)) return;
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches(selector)) return;
      if (target.tagName === 'SELECT' && ['ArrowUp', 'ArrowDown'].includes(event.key)) return;

      const items = Array.from(scope.querySelectorAll(selector)).filter((element) => {
        if (!(element instanceof HTMLElement)) return false;
        if (element.closest('dialog[open]')) return false;
        if (element.offsetParent === null && !element.matches('dialog[open] *')) return false;
        return true;
      });
      const currentIndex = items.indexOf(target);
      if (currentIndex < 0) return;

      const moveToPrevious = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
      const nextIndex = moveToPrevious
        ? Math.max(0, currentIndex - 1)
        : Math.min(items.length - 1, currentIndex + 1);

      if (nextIndex === currentIndex) return;
      event.preventDefault();
      const nextTarget = items[nextIndex];
      nextTarget.focus();
      if (typeof nextTarget.select === 'function' && nextTarget.matches('input[type="text"], input[type="search"], input[type="date"], textarea')) {
        nextTarget.select();
      }
    });

    scope.dataset.arrowNavBound = 'true';
  }

  function bindDemoSearchForms(scope = document) {
    scope.querySelectorAll('.js-demo-search-form').forEach((form) => {
      if (form.dataset.searchBound === 'true') return;
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        showToast('테스트 페이지에서는 통합검색이 연결되어 있지 않습니다.');
      });
      form.dataset.searchBound = 'true';
    });
  }

  function statusOrder(status) {
    return STATUS_ORDER[status] ?? Number.MAX_SAFE_INTEGER;
  }

  window.AppUtil = {
    escapeHtml,
    digits,
    formatPhone,
    bindPhoneFormatter,
    todayIso,
    formatDate,
    formatDateTime,
    uid,
    getSupportLabel,
    schoolLevelLabel,
    statusClass,
    modeBadgeHtml,
    normalizeClassName,
    normalizeStudentNo,
    validateBirthDate,
    textOrDash,
    summarizeApplications,
    downloadCsv,
    showToast,
    rejectionSummary,
    compareValues,
    bindArrowNavigation,
    bindDemoSearchForms,
    statusOrder
  };

  document.addEventListener('DOMContentLoaded', () => {
    bindDemoSearchForms(document);
  });
})();
