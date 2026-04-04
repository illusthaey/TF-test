(function () {
  const AppUtil = {
    qs(selector, scope = document) {
      return scope.querySelector(selector);
    },
    qsa(selector, scope = document) {
      return Array.from(scope.querySelectorAll(selector));
    },
    escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },
    digits(value) {
      return String(value ?? "").replace(/\D/g, "");
    },
    formatPhone(value) {
      const digits = AppUtil.digits(value).slice(0, 11);
      if (digits.length < 4) return digits;
      if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    },
    bindPhoneFormatter(scope = document) {
      AppUtil.qsa('input[data-phone]', scope).forEach((input) => {
        input.addEventListener("input", () => {
          input.value = AppUtil.formatPhone(input.value);
        });
      });
    },
    todayIso() {
      return new Date().toISOString().slice(0, 10);
    },
    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return dateString;
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    },
    formatDateTime(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return dateString;
      return `${AppUtil.formatDate(dateString)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    },
    uid(prefix = "ID") {
      const seed = Math.random().toString(36).slice(2, 10).toUpperCase();
      return `${prefix}-${Date.now().toString(36).toUpperCase()}-${seed}`;
    },
    getModeLabel(mode = window.APP_CONFIG?.policy?.mode) {
      return mode === "voucher" ? "바우처 단일" : "현물 / 바우처 택1";
    },
    getSupportLabel(type) {
      const labels = window.APP_CONFIG?.policy?.labels || {};
      return labels[type] || type || "-";
    },
    statusClass(status) {
      const map = {
        "접수": "status-received",
        "검토중": "status-review",
        "승인": "status-approved",
        "보완요청": "status-revise",
        "반려": "status-rejected"
      };
      return map[status] || "status-default";
    },
    levelClass(level) {
      const map = {
        "유치원": "level-kinder",
        "초등": "level-elementary",
        "중등": "level-middle",
        "고등": "level-high",
        "초중": "level-mixed",
        "특수/기타": "level-other"
      };
      return map[level] || "level-other";
    },
    modeBadgeHtml() {
      return `<span class="mode-badge">${AppUtil.escapeHtml(AppUtil.getModeLabel())}</span>`;
    },
    downloadCsv(filename, rows) {
      const escapeCell = (cell) => {
        const value = String(cell ?? "");
        if (/[",\n]/.test(value)) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };
      const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
      const bom = "\uFEFF";
      const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    },
    showToast(message) {
      let toast = document.getElementById("app-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "app-toast";
        toast.className = "toast";
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add("show");
      clearTimeout(AppUtil._toastTimer);
      AppUtil._toastTimer = setTimeout(() => {
        toast.classList.remove("show");
      }, 2200);
    },
    summarizeApplications(items) {
      const summary = {
        total: items.length,
        voucher: 0,
        inKind: 0,
        byStatus: {}
      };
      items.forEach((item) => {
        summary.byStatus[item.status] = (summary.byStatus[item.status] || 0) + 1;
        if (item.supportType === "inKind") summary.inKind += 1;
        else summary.voucher += 1;
      });
      return summary;
    },
    noopSearchHandler(form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        AppUtil.showToast("테스트 페이지에서는 통합검색이 연결되어 있지 않습니다.");
      });
    }
  };

  window.AppUtil = AppUtil;

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".js-demo-search-form").forEach((form) => {
      AppUtil.noopSearchHandler(form);
    });
  });
})();
