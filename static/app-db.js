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
      console.error('localStorage read error', error);
      return [];
    }
  }

  function writeStore(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items;
  }

  function nextReceiptNo(items) {
    const max = items.reduce((result, item) => {
      const value = Number(String(item.receiptNo || '').replace(/\D/g, ''));
      return Number.isFinite(value) ? Math.max(result, value) : result;
    }, 260400);
    return `UF-${max + 1}`;
  }

  function statusHistoryEntry(fromStatus, toStatus, actor, note = '') {
    return {
      id: window.AppUtil.uid('HIS'),
      at: new Date().toISOString(),
      fromStatus: fromStatus || '',
      toStatus: toStatus || '',
      actor: actor || 'system',
      note: note || ''
    };
  }

  function normalizeRecord(input) {
    const school = window.AppSchools.findById(input.schoolId)
      || window.AppSchools.findByName(input.schoolName, input.region)
      || {};

    const supportType = window.APP_CONFIG.policy.mode === 'voucher'
      ? 'voucher'
      : (input.supportType || 'voucher');

    const rawClassName = String(input.rawClassName ?? input.className ?? '').trim();
    const rawStudentNo = String(input.rawStudentNo ?? input.studentNo ?? '').trim();
    const normalizedStatus = input.status || '신청 접수';

    return {
      id: input.id || window.AppUtil.uid('APP'),
      receiptNo: input.receiptNo || nextReceiptNo(readStore()),
      createdAt: input.createdAt || new Date().toISOString(),
      source: input.source || 'public',
      region: input.region || school.region || '',
      schoolLevel: input.schoolLevel || school.levelKey || '',
      schoolLevelLabel: input.schoolLevelLabel || school.levelLabel || '',
      schoolId: input.schoolId || school.id || '',
      schoolCode: input.schoolCode || school.schoolCode || '',
      schoolName: input.schoolName || school.name || '',
      grade: String(input.grade || '1'),
      rawClassName,
      className: input.className ?? window.AppUtil.normalizeClassName(rawClassName),
      rawStudentNo,
      studentNo: input.studentNo ?? window.AppUtil.normalizeStudentNo(rawStudentNo),
      studentName: input.studentName || '',
      birthDate: input.birthDate || '',
      parentName: input.parentName || '',
      parentPhone: window.AppUtil.formatPhone(input.parentPhone || ''),
      supportType,
      itemRequest: supportType === 'inKind' ? (input.itemRequest || '') : '',
      topSize: supportType === 'inKind' ? (input.topSize || '') : '',
      bottomSize: supportType === 'inKind' ? (input.bottomSize || '') : '',
      consent: input.consent !== undefined ? Boolean(input.consent) : true,
      status: normalizedStatus,
      rejectionReasons: Array.isArray(input.rejectionReasons) ? input.rejectionReasons.filter(Boolean) : [],
      rejectionReasonText: String(input.rejectionReasonText || '').trim(),
      adminMemo: String(input.adminMemo || '').trim(),
      history: Array.isArray(input.history) && input.history.length
        ? input.history
        : [statusHistoryEntry('', normalizedStatus, input.source || 'system', '초기 생성')]
    };
  }

  function sampleTemplate() {
    const findSchool = (keyword, region = '') => window.AppSchools.findByNameContains(keyword, region);
    const choiceMode = window.APP_CONFIG.policy.mode === 'choice';
    const records = [
      {
        school: findSchool('춘천고등학교', '춘천'),
        grade: '1',
        rawClassName: '3반',
        rawStudentNo: '11번',
        studentName: '전용철',
        birthDate: '2010-03-12',
        parentName: '전철용',
        parentPhone: '010-9045-2211',
        supportType: choiceMode ? 'inKind' : 'voucher',
        itemRequest: choiceMode ? '동복 상·하의' : '',
        topSize: choiceMode ? '95' : '',
        bottomSize: choiceMode ? '74' : '',
        status: '신청 접수',
        source: 'public'
      },
      {
        school: findSchool('춘천고등학교', '춘천'),
        grade: '1',
        rawClassName: '7',
        rawStudentNo: '3',
        studentName: '박우식',
        birthDate: '2010-01-19',
        parentName: '박유식',
        parentPhone: '010-1122-8899',
        supportType: 'voucher',
        status: '학교장 승인 대기',
        source: 'public'
      },
      {
        school: findSchool('춘천고등학교', '춘천'),
        grade: '1',
        rawClassName: '1반',
        rawStudentNo: '7번',
        studentName: '이수아',
        birthDate: '2010-05-02',
        parentName: '이현정',
        parentPhone: '010-4111-2299',
        supportType: 'voucher',
        status: '담당자 반려',
        rejectionReasons: ['중복 신청'],
        source: 'admin'
      },
      {
        school: findSchool('춘천고등학교', '춘천'),
        grade: '1',
        rawClassName: '바다반',
        rawStudentNo: '9번',
        studentName: '최윤호',
        birthDate: '2010-11-21',
        parentName: '최수정',
        parentPhone: '010-9988-7766',
        supportType: choiceMode ? 'inKind' : 'voucher',
        itemRequest: choiceMode ? '생활복 세트' : '',
        topSize: choiceMode ? '100' : '',
        bottomSize: choiceMode ? '78' : '',
        status: '학교장 승인',
        source: 'admin'
      },
      {
        school: findSchool('춘천고등학교', '춘천'),
        grade: '1',
        rawClassName: '나무반',
        rawStudentNo: '13',
        studentName: '정예린',
        birthDate: '2010-02-14',
        parentName: '정다은',
        parentPhone: '010-2456-1357',
        supportType: 'voucher',
        status: '학교장 반려',
        rejectionReasons: ['학생 정보 오류', '기타'],
        rejectionReasonText: '생년월일 재확인 필요',
        source: 'admin'
      },
      {
        school: findSchool('춘천고등학교', '춘천'),
        grade: '1',
        rawClassName: '솔반',
        rawStudentNo: '5번',
        studentName: '오지후',
        birthDate: '2010-07-07',
        parentName: '오정희',
        parentPhone: '010-7777-9988',
        supportType: 'voucher',
        status: '도교육청 접수',
        source: 'admin'
      },
      {
        school: findSchool('춘천고등학교', '춘천'),
        grade: '1',
        rawClassName: '숲반',
        rawStudentNo: '2',
        studentName: '문세아',
        birthDate: '2010-01-30',
        parentName: '문지은',
        parentPhone: '010-8800-6611',
        supportType: choiceMode ? 'inKind' : 'voucher',
        itemRequest: choiceMode ? '체육복 세트' : '',
        topSize: choiceMode ? '85' : '',
        bottomSize: choiceMode ? '68' : '',
        status: '도교육청 승인',
        source: 'admin'
      },
      {
        school: findSchool('춘천고등학교', '춘천'),
        grade: '1',
        rawClassName: '별반',
        rawStudentNo: '1번',
        studentName: '강도윤',
        birthDate: '2010-08-04',
        parentName: '강유정',
        parentPhone: '010-7788-9900',
        supportType: 'voucher',
        status: '지급 완료',
        source: 'admin'
      },
      {
        school: findSchool('원주고등학교', '원주'),
        grade: '1',
        rawClassName: '1반',
        rawStudentNo: '12',
        studentName: '한지민',
        birthDate: '2010-09-19',
        parentName: '한은지',
        parentPhone: '010-5523-7788',
        supportType: 'voucher',
        status: '신청 접수',
        source: 'public'
      },
      {
        school: findSchool('강릉중학교', '강릉'),
        grade: '1',
        rawClassName: '2반',
        rawStudentNo: '8',
        studentName: '홍예나',
        birthDate: '2012-06-03',
        parentName: '홍수연',
        parentPhone: '010-3011-2211',
        supportType: choiceMode ? 'inKind' : 'voucher',
        itemRequest: choiceMode ? '동복 세트' : '',
        topSize: choiceMode ? '90' : '',
        bottomSize: choiceMode ? '70' : '',
        status: '학교장 승인',
        source: 'public'
      },
      {
        school: findSchool('횡성초등학교', '횡성'),
        grade: '4',
        rawClassName: '4반',
        rawStudentNo: '18번',
        studentName: '서하준',
        birthDate: '2015-07-14',
        parentName: '서민주',
        parentPhone: '010-6677-8899',
        supportType: 'voucher',
        status: '도교육청 승인',
        source: 'public'
      },
      {
        school: findSchool('강릉초병설유치원', '강릉'),
        grade: '2',
        rawClassName: '해님반',
        rawStudentNo: '6번',
        studentName: '유소율',
        birthDate: '2020-04-02',
        parentName: '유현정',
        parentPhone: '010-8200-1122',
        supportType: 'voucher',
        status: '학교장 승인',
        source: 'public'
      },
      {
        school: findSchool('강릉오성학교', '강릉'),
        grade: '5',
        rawClassName: '무지개반',
        rawStudentNo: '4번',
        studentName: '임다온',
        birthDate: '2014-12-24',
        parentName: '임지은',
        parentPhone: '010-7700-3344',
        supportType: choiceMode ? 'inKind' : 'voucher',
        itemRequest: choiceMode ? '생활복 세트' : '',
        topSize: choiceMode ? '105' : '',
        bottomSize: choiceMode ? '82' : '',
        status: '지급 완료',
        source: 'admin'
      }
    ];

    return records.filter((item) => item.school).map((record, index) => {
      const status = record.status;
      return normalizeRecord({
        id: window.AppUtil.uid(`SEED${index + 1}`),
        receiptNo: `UF-${260401 + index}`,
        createdAt: new Date(Date.now() - (index * 3600 + 2) * 3600 * 1000).toISOString(),
        region: record.school.region,
        schoolLevel: record.school.levelKey,
        schoolLevelLabel: record.school.levelLabel,
        schoolId: record.school.id,
        schoolCode: record.school.schoolCode,
        schoolName: record.school.name,
        grade: record.grade,
        rawClassName: record.rawClassName,
        rawStudentNo: record.rawStudentNo,
        studentName: record.studentName,
        birthDate: record.birthDate,
        parentName: record.parentName,
        parentPhone: record.parentPhone,
        supportType: record.supportType,
        itemRequest: record.itemRequest,
        topSize: record.topSize,
        bottomSize: record.bottomSize,
        consent: true,
        status,
        rejectionReasons: record.rejectionReasons || [],
        rejectionReasonText: record.rejectionReasonText || '',
        source: record.source,
        history: [statusHistoryEntry('', status, record.source || 'system', '샘플 데이터 생성')]
      });
    });
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
    update(id, patch = {}, actor = 'admin', note = '') {
      const items = readStore();
      const target = items.find((item) => item.id === id);
      if (!target) return null;

      const previousStatus = target.status;
      const nextStatus = patch.status || previousStatus;

      Object.assign(target, patch);
      target.className = window.AppUtil.normalizeClassName(target.rawClassName ?? target.className);
      target.studentNo = window.AppUtil.normalizeStudentNo(target.rawStudentNo ?? target.studentNo);
      target.parentPhone = window.AppUtil.formatPhone(target.parentPhone || '');
      if (target.supportType !== 'inKind') {
        target.itemRequest = '';
        target.topSize = '';
        target.bottomSize = '';
      }

      if (previousStatus !== nextStatus || note || patch.rejectionReasonText !== undefined || patch.rejectionReasons !== undefined) {
        target.history = Array.isArray(target.history) ? target.history : [];
        target.history.unshift(statusHistoryEntry(previousStatus, nextStatus, actor, note));
      }

      writeStore(items);
      return clone(target);
    },
    get(id) {
      const found = readStore().find((item) => item.id === id);
      return found ? clone(found) : null;
    }
  };

  window.AppDB = AppDB;

  document.addEventListener('DOMContentLoaded', () => {
    AppDB.ensureSeeded(false);
  });
})();
