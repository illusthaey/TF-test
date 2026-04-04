(function () {
  const STORAGE_KEY = window.APP_CONFIG.storageKey;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("localStorage read error", error);
      return [];
    }
  }

  function writeStore(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items;
  }

  function byRegion(region, fallbackIndex = 0) {
    const list = window.SCHOOLS_DATA.filter((school) => school.region === region);
    return list[fallbackIndex] || window.SCHOOLS_DATA[fallbackIndex] || null;
  }

  function byNameContains(keyword, fallbackRegion = "춘천") {
    const found = window.SCHOOLS_DATA.find((school) => school.name.includes(keyword));
    return found || byRegion(fallbackRegion, 0);
  }

  function nextReceiptNo(items) {
    const numbers = items
      .map((item) => Number(String(item.receiptNo || "").replace(/\D/g, "")))
      .filter((value) => Number.isFinite(value) && value > 0);
    const next = (numbers.length ? Math.max(...numbers) : 250000) + 1;
    return `UF-${next}`;
  }

  function normalizeRecord(input) {
    const school = window.SCHOOLS_DATA.find((item) => item.id === input.schoolId) || {};
    const supportType = window.APP_CONFIG.policy.mode === "voucher"
      ? "voucher"
      : (input.supportType || "voucher");

    return {
      id: input.id || window.AppUtil.uid("APP"),
      receiptNo: input.receiptNo || nextReceiptNo(readStore()),
      createdAt: input.createdAt || new Date().toISOString(),
      source: input.source || "public",
      region: input.region || school.region || "",
      schoolId: input.schoolId || school.id || "",
      schoolCode: input.schoolCode || school.schoolCode || "",
      schoolName: input.schoolName || school.name || "",
      schoolLevel: input.schoolLevel || school.level || "",
      grade: input.grade || "1",
      className: input.className || "",
      studentNo: input.studentNo || "",
      studentName: input.studentName || "",
      birthDate: input.birthDate || "",
      studentPhone: input.studentPhone || "",
      parentName: input.parentName || "",
      parentPhone: input.parentPhone || "",
      supportType,
      itemRequest: supportType === "inKind" ? (input.itemRequest || "") : "",
      topSize: supportType === "inKind" ? (input.topSize || "") : "",
      bottomSize: supportType === "inKind" ? (input.bottomSize || "") : "",
      remarks: input.remarks || "",
      consent: input.consent !== undefined ? Boolean(input.consent) : true,
      status: input.status || "접수",
      adminMemo: input.adminMemo || ""
    };
  }

  function sampleTemplate() {
    const mode = window.APP_CONFIG.policy.mode;
    const mayInKind = mode === "choice";

    const samples = [
      {
        school: byNameContains("춘천고등학교", "춘천"),
        grade: "1",
        className: mayInKind ? "" : "1",
        studentNo: "",
        studentName: "김하늘",
        birthDate: "2010-03-12",
        studentPhone: "010-2456-8901",
        parentName: "김민정",
        parentPhone: "010-9045-2211",
        supportType: mayInKind ? "inKind" : "voucher",
        itemRequest: mayInKind ? "동복 상·하의" : "",
        topSize: mayInKind ? "95" : "",
        bottomSize: mayInKind ? "74" : "",
        status: "검토중",
        remarks: "반 배정 전 접수 예시",
        source: "public"
      },
      {
        school: byNameContains("원주고등학교", "원주"),
        grade: "1",
        className: "3",
        studentNo: "12",
        studentName: "박서준",
        birthDate: "2009-09-19",
        studentPhone: "010-5523-7788",
        parentName: "박은지",
        parentPhone: "010-1122-8899",
        supportType: "voucher",
        status: "접수",
        remarks: "바우처 신청 예시",
        source: "public"
      },
      {
        school: byNameContains("강릉여자고등학교", "강릉"),
        grade: "1",
        className: "2",
        studentNo: "8",
        studentName: "이수아",
        birthDate: "2010-05-02",
        studentPhone: "010-3011-2211",
        parentName: "이현정",
        parentPhone: "010-4111-2299",
        supportType: mayInKind ? "inKind" : "voucher",
        itemRequest: mayInKind ? "생활복 세트" : "",
        topSize: mayInKind ? "90" : "",
        bottomSize: mayInKind ? "70" : "",
        status: "승인",
        remarks: "담당자 승인 처리 예시",
        source: "admin"
      },
      {
        school: byNameContains("속초고등학교", "속초"),
        grade: "1",
        className: "",
        studentNo: "",
        studentName: "최윤호",
        birthDate: "2010-11-21",
        studentPhone: "010-2233-4455",
        parentName: "최수정",
        parentPhone: "010-9988-7766",
        supportType: "voucher",
        status: "보완요청",
        remarks: "서류 보완 예시",
        adminMemo: "생년월일 확인 필요",
        source: "public"
      },
      {
        school: byNameContains("홍천고등학교", "홍천"),
        grade: "1",
        className: "4",
        studentNo: "5",
        studentName: "정예린",
        birthDate: "2010-02-14",
        studentPhone: "010-4567-1234",
        parentName: "정다은",
        parentPhone: "010-2456-1357",
        supportType: mayInKind ? "inKind" : "voucher",
        itemRequest: mayInKind ? "하복 상·하의" : "",
        topSize: mayInKind ? "100" : "",
        bottomSize: mayInKind ? "78" : "",
        status: "접수",
        remarks: "현물 택1 예시",
        source: "public"
      },
      {
        school: byNameContains("북평고등학교", "동해"),
        grade: "1",
        className: "1",
        studentNo: "18",
        studentName: "오지후",
        birthDate: "2010-07-07",
        studentPhone: "010-6677-8899",
        parentName: "오정희",
        parentPhone: "010-7777-9988",
        supportType: "voucher",
        status: "반려",
        remarks: "중복 신청 반려 예시",
        adminMemo: "타 사업 중복으로 테스트 반려 처리",
        source: "admin"
      },
      {
        school: byNameContains("황지고등학교", "태백"),
        grade: "1",
        className: "5",
        studentNo: "20",
        studentName: "문세아",
        birthDate: "2010-01-30",
        studentPhone: "010-5890-1234",
        parentName: "문지은",
        parentPhone: "010-8800-6611",
        supportType: mayInKind ? "inKind" : "voucher",
        itemRequest: mayInKind ? "체육복 세트" : "",
        topSize: mayInKind ? "85" : "",
        bottomSize: mayInKind ? "68" : "",
        status: "승인",
        source: "admin"
      },
      {
        school: byNameContains("횡성고등학교", "횡성"),
        grade: "1",
        className: "",
        studentNo: "",
        studentName: "강도윤",
        birthDate: "2010-08-04",
        studentPhone: "010-1456-7788",
        parentName: "강유정",
        parentPhone: "010-7788-9900",
        supportType: "voucher",
        status: "검토중",
        remarks: "관리자 신규 등록 예시",
        source: "admin"
      }
    ];

    return samples.filter((item) => item.school).map((sample, index) => normalizeRecord({
      id: window.AppUtil.uid(`SEED${index + 1}`),
      receiptNo: `UF-${250001 + index}`,
      createdAt: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
      region: sample.school.region,
      schoolId: sample.school.id,
      schoolCode: sample.school.schoolCode,
      schoolName: sample.school.name,
      schoolLevel: sample.school.level,
      grade: sample.grade,
      className: sample.className,
      studentNo: sample.studentNo,
      studentName: sample.studentName,
      birthDate: sample.birthDate,
      studentPhone: sample.studentPhone,
      parentName: sample.parentName,
      parentPhone: sample.parentPhone,
      supportType: sample.supportType,
      itemRequest: sample.itemRequest,
      topSize: sample.topSize,
      bottomSize: sample.bottomSize,
      remarks: sample.remarks,
      consent: true,
      status: sample.status,
      adminMemo: sample.adminMemo || "",
      source: sample.source
    }));
  }

  const AppDB = {
    load() {
      return clone(readStore());
    },
    save(items) {
      return clone(writeStore(items));
    },
    ensureSeeded(force = false) {
      const existing = readStore();
      if (existing.length && !force) return clone(existing);
      const seeded = sampleTemplate();
      writeStore(seeded);
      return clone(seeded);
    },
    clear() {
      localStorage.removeItem(STORAGE_KEY);
    },
    create(record) {
      const items = readStore();
      const normalized = normalizeRecord({ ...record, receiptNo: nextReceiptNo(items) });
      items.unshift(normalized);
      writeStore(items);
      return clone(normalized);
    },
    updateStatus(id, status) {
      const items = readStore();
      const target = items.find((item) => item.id === id);
      if (!target) return null;
      target.status = status;
      writeStore(items);
      return clone(target);
    },
    updateMemo(id, adminMemo) {
      const items = readStore();
      const target = items.find((item) => item.id === id);
      if (!target) return null;
      target.adminMemo = adminMemo;
      writeStore(items);
      return clone(target);
    },
    get(id) {
      const target = readStore().find((item) => item.id === id);
      return target ? clone(target) : null;
    }
  };

  window.AppDB = AppDB;

  document.addEventListener("DOMContentLoaded", () => {
    AppDB.ensureSeeded(false);
  });
})();
