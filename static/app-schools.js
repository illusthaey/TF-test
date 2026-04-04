(function () {
  const rawSchools = Array.isArray(window.SCHOOLS_DATA) ? window.SCHOOLS_DATA.slice() : [];
  const regionOrder = window.APP_CONFIG?.regionOrder || [];
  const regionIndex = regionOrder.reduce((acc, region, index) => {
    acc[region] = index;
    return acc;
  }, {});

  const levelOptions = window.APP_CONFIG?.schoolLevels || [];
  const levelOptionMap = levelOptions.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});

  function inferRawLevelKey(school) {
    const name = String(school?.name || '');
    const rawLevel = String(school?.level || '');

    if (name.includes('병설유치원') || rawLevel === '유치원') return 'kindergarten';
    if (rawLevel === '초등') return 'elementary';
    if (rawLevel === '중등') return 'middle';
    if (rawLevel === '고등') return 'high';
    if (rawLevel === '초중') return 'elementaryMiddle';
    return 'special';
  }

  function displayLevelLabel(levelKey) {
    const map = {
      kindergarten: '유치원',
      elementary: '초등학교',
      middle: '중학교',
      high: '고등학교',
      elementaryMiddle: '초·중학교',
      special: '특수학교 및 기타'
    };
    return map[levelKey] || levelKey || '-';
  }

  function levelMatchesOption(levelKey, optionKey) {
    if (!optionKey) return true;
    if (optionKey === 'elementary') return levelKey === 'elementary' || levelKey === 'elementaryMiddle';
    if (optionKey === 'middle') return levelKey === 'middle' || levelKey === 'elementaryMiddle';
    if (optionKey === 'special') return levelKey === 'special';
    return levelKey === optionKey;
  }

  function inferBranchRule(name) {
    if (!name.includes('분교장')) return null;
    const rules = [
      { marker: '초', schoolSuffix: '등학교', schoolMatcher: '초등학교', kindergartenSuffix: '병설유치원', levelKey: 'elementary' },
      { marker: '중', schoolSuffix: '학교', schoolMatcher: '중학교', kindergartenSuffix: '병설유치원', levelKey: 'middle' },
      { marker: '고', schoolSuffix: '등학교', schoolMatcher: '고등학교', kindergartenSuffix: '병설유치원', levelKey: 'high' }
    ];

    for (const rule of rules) {
      const index = name.indexOf(rule.marker);
      if (index > -1) {
        return {
          ...rule,
          prefix: name.slice(0, index + 1)
        };
      }
    }

    return null;
  }

  function pickBaseCandidate(rawSchool, branchRule, wantKindergarten) {
    if (!branchRule) return null;
    const matcher = wantKindergarten ? '병설유치원' : branchRule.schoolMatcher;
    return rawSchools.find((item) => {
      if (item.region !== rawSchool.region) return false;
      if (item.name.includes('분교장')) return false;
      return item.name.startsWith(branchRule.prefix) && item.name.includes(matcher);
    }) || null;
  }

  function normalizeSchoolRecord(rawSchool) {
    const levelKey = inferRawLevelKey(rawSchool);
    const isBranch = rawSchool.name.includes('분교장');
    const branchRule = inferBranchRule(rawSchool.name);
    const wantKindergarten = levelKey === 'kindergarten';
    const baseCandidate = isBranch ? pickBaseCandidate(rawSchool, branchRule, wantKindergarten) : null;

    let canonicalName = rawSchool.name;
    let canonicalId = rawSchool.id;
    let canonicalCode = rawSchool.schoolCode;
    let address = rawSchool.address;
    let phone = rawSchool.phone;
    let website = rawSchool.website;

    if (baseCandidate) {
      canonicalName = baseCandidate.name;
      canonicalId = baseCandidate.id;
      canonicalCode = baseCandidate.schoolCode;
      address = baseCandidate.address || address;
      phone = baseCandidate.phone || phone;
      website = baseCandidate.website || website;
    } else if (isBranch && branchRule) {
      if (wantKindergarten) {
        canonicalName = `${branchRule.prefix}${branchRule.kindergartenSuffix}`;
      } else {
        canonicalName = `${branchRule.prefix}${branchRule.schoolSuffix}`;
      }
      canonicalId = `CANON-${rawSchool.region}-${canonicalName}`
        .replace(/\s+/g, '-')
        .replace(/[^A-Za-z0-9가-힣-]/g, '');
      canonicalCode = rawSchool.schoolCode || '';
    }

    return {
      ...rawSchool,
      levelKey,
      levelLabel: displayLevelLabel(levelKey),
      optionLevelLabel: levelOptionMap[levelKey] || (levelKey === 'elementaryMiddle' ? '초등학교/중학교' : displayLevelLabel(levelKey)),
      isBranch,
      canonicalName,
      canonicalId,
      canonicalCode,
      canonicalAddress: address,
      canonicalPhone: phone,
      canonicalWebsite: website
    };
  }

  function buildCanonicalSchools() {
    const normalized = rawSchools.map(normalizeSchoolRecord);
    const map = new Map();

    normalized.forEach((school) => {
      const key = `${school.region}__${school.canonicalId}`;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          id: school.canonicalId,
          schoolCode: school.canonicalCode,
          name: school.canonicalName,
          region: school.region,
          address: school.canonicalAddress,
          phone: school.canonicalPhone,
          website: school.canonicalWebsite,
          levelKey: school.levelKey,
          levelLabel: school.levelLabel,
          aliases: school.canonicalName === school.name ? [] : [school.name],
          rawSchoolIds: [school.id]
        });
        return;
      }

      if (school.levelKey === 'elementaryMiddle') {
        existing.levelKey = 'elementaryMiddle';
        existing.levelLabel = displayLevelLabel('elementaryMiddle');
      }

      if (!existing.aliases.includes(school.name) && school.canonicalName !== school.name) {
        existing.aliases.push(school.name);
      }
      if (!existing.rawSchoolIds.includes(school.id)) {
        existing.rawSchoolIds.push(school.id);
      }
      if (!existing.schoolCode && school.canonicalCode) {
        existing.schoolCode = school.canonicalCode;
      }
      if (!existing.address && school.canonicalAddress) {
        existing.address = school.canonicalAddress;
      }
      if (!existing.phone && school.canonicalPhone) {
        existing.phone = school.canonicalPhone;
      }
      if (!existing.website && school.canonicalWebsite) {
        existing.website = school.canonicalWebsite;
      }
    });

    return Array.from(map.values()).sort((left, right) => {
      const regionCompare = (regionIndex[left.region] ?? 999) - (regionIndex[right.region] ?? 999);
      if (regionCompare !== 0) return regionCompare;
      return left.name.localeCompare(right.name, 'ko');
    });
  }

  const canonicalSchools = buildCanonicalSchools();

  function regions() {
    return regionOrder.filter((region) => canonicalSchools.some((school) => school.region === region));
  }

  function findById(id) {
    return canonicalSchools.find((school) => school.id === id) || null;
  }

  function findByName(name, region = '') {
    return canonicalSchools.find((school) => {
      if (region && school.region !== region) return false;
      return school.name === name;
    }) || null;
  }

  function findByNameContains(keyword, fallbackRegion = '') {
    const term = String(keyword || '').trim();
    if (!term) return null;
    const found = canonicalSchools.find((school) => {
      if (fallbackRegion && school.region !== fallbackRegion) return false;
      return school.name.includes(term) || school.aliases.some((alias) => alias.includes(term));
    });
    if (found) return found;
    return fallbackRegion ? canonicalSchools.find((school) => school.region === fallbackRegion) || null : null;
  }

  function list(filters = {}) {
    const region = String(filters.region || '');
    const schoolLevel = String(filters.schoolLevel || '');
    const keyword = String(filters.keyword || '').trim().toLowerCase();

    return canonicalSchools.filter((school) => {
      if (region && school.region !== region) return false;
      if (schoolLevel && !levelMatchesOption(school.levelKey, schoolLevel)) return false;
      if (keyword) {
        const source = `${school.name} ${school.aliases.join(' ')} ${school.region} ${school.address || ''}`.toLowerCase();
        if (!source.includes(keyword)) return false;
      }
      return true;
    });
  }

  function regionOptions(selected = '', includeBlank = true) {
    const listHtml = regions().map((region) => `
      <option value="${region}" ${selected === region ? 'selected' : ''}>${region}</option>
    `).join('');
    return `${includeBlank ? '<option value="">선택하세요</option>' : ''}${listHtml}`;
  }

  function schoolLevelOptions(selected = '', includeBlank = true) {
    const listHtml = levelOptions.map((item) => `
      <option value="${item.value}" ${selected === item.value ? 'selected' : ''}>${item.label}</option>
    `).join('');
    return `${includeBlank ? '<option value="">선택하세요</option>' : ''}${listHtml}`;
  }

  function schoolOptions(filters = {}, selectedId = '', includeBlank = true) {
    const listHtml = list(filters).map((school) => `
      <option value="${school.id}" ${selectedId === school.id ? 'selected' : ''}>${school.name}</option>
    `).join('');
    return `${includeBlank ? '<option value="">학교를 선택하세요</option>' : ''}${listHtml}`;
  }

  function gradeOptions(schoolLevel) {
    const selectedLevel = String(schoolLevel || '');
    let grades = ['1', '2', '3'];

    if (selectedLevel === 'elementary') grades = ['1', '2', '3', '4', '5', '6'];
    else if (selectedLevel === 'special') grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    return grades.map((grade) => `<option value="${grade}">${grade}학년</option>`).join('');
  }

  window.AppSchools = {
    rawSchools,
    canonicalSchools,
    regions,
    findById,
    findByName,
    findByNameContains,
    list,
    regionOptions,
    schoolLevelOptions,
    schoolOptions,
    gradeOptions,
    displayLevelLabel,
    levelMatchesOption,
    levelOptionMap
  };
})();
