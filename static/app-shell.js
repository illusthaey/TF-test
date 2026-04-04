(function () {
  const pageBase = document.body.dataset.base || '';

  const AppPath = {
    base: pageBase,
    home() {
      return pageBase || './';
    },
    page(pageKey) {
      return pageKey === 'home' ? AppPath.home() : `${pageBase}${pageKey}/`;
    },
    asset(filename) {
      return `${pageBase}static/${filename}`;
    }
  };

  window.AppPath = AppPath;

  const PAGES = {
    home: {
      title: '홈',
      section: 'home',
      heading: '교복 지원 TF 테스트 페이지',
      description: '학부모 신청 화면과 관리자 화면을 함께 점검하기 위한 정적 프로토타입입니다.',
      breadcrumb: ['홈']
    },
    info: {
      title: '교복 지원이란?',
      section: 'support',
      heading: '교복 지원이란?',
      description: '지원 대상, 신청 흐름, 화면 설계 방향을 빠르게 검토할 수 있도록 정리했습니다.',
      breadcrumb: ['사업안내', '교복 지원이란?']
    },
    apply: {
      title: '교복 지원 신청',
      section: 'apply',
      heading: '교복 지원 신청',
      description: '학부모 신청 화면입니다. 제출 전에 입력 내용 확인 팝업이 한 번 더 표시됩니다.',
      breadcrumb: ['신청하기', '교복 지원 신청']
    },
    usage: {
      title: '사용 안내',
      section: 'support',
      heading: '사용 안내',
      description: '학부모와 관리자 각각의 주요 사용 흐름을 한눈에 볼 수 있게 정리했습니다.',
      breadcrumb: ['사업안내', '사용 안내']
    },
    faq: {
      title: '자주 묻는 질문',
      section: 'support',
      heading: '자주 묻는 질문',
      description: 'TF 설명 시 자주 나오는 질문을 데모 기준으로 정리했습니다.',
      breadcrumb: ['사업안내', '자주 묻는 질문']
    },
    'admin-list': {
      title: '신청 현황 선택',
      section: 'admin',
      heading: '신청 현황 화면 선택',
      description: '학교 담당자용 화면과 도교육청 관리자용 화면을 역할별로 나눠 확인할 수 있습니다.',
      breadcrumb: ['신청 관리자', '신청 현황 선택']
    },
    'admin-school': {
      title: '신청 현황 (학교 담당자)',
      section: 'admin',
      heading: '신청 현황 (학교 담당자)',
      description: '특정 학교 담당자 권한 기준으로 신청 건을 확인하고 학교 단계 상태를 처리하는 화면입니다.',
      breadcrumb: ['신청 관리자', '신청 현황 (학교 담당자)']
    },
    'admin-office': {
      title: '신청 현황 (도교육청 관리자)',
      section: 'admin',
      heading: '신청 현황 (도교육청 관리자)',
      description: '지역, 학교급, 학교명 기준으로 신청 현황을 선별하고 정렬할 수 있는 화면입니다.',
      breadcrumb: ['신청 관리자', '신청 현황 (도교육청 관리자)']
    },
    'admin-create': {
      title: '관리자 신규 등록',
      section: 'admin',
      heading: '관리자 신규 등록',
      description: '관리자가 신청 데이터를 수기 등록하는 테스트용 입력 화면입니다.',
      breadcrumb: ['신청 관리자', '관리자 신규 등록']
    }
  };

  const DESKTOP_NAV = [
    {
      label: '사업안내',
      page: 'info',
      key: 'support',
      children: [
        { label: '교복 지원이란?', page: 'info', key: 'info' },
        { label: '사용 안내', page: 'usage', key: 'usage' },
        { label: '자주 묻는 질문', page: 'faq', key: 'faq' }
      ]
    },
    {
      label: '신청하기',
      page: 'apply',
      key: 'apply',
      children: [
        { label: '교복 지원 신청', page: 'apply', key: 'apply' }
      ]
    },
    {
      label: '신청 관리자',
      page: 'admin-list',
      key: 'admin',
      children: [
        { label: '신청 현황 선택', page: 'admin-list', key: 'admin-list' },
        { label: '신청 현황 (학교 담당자)', page: 'admin-school', key: 'admin-school' },
        { label: '신청 현황 (도교육청 관리자)', page: 'admin-office', key: 'admin-office' },
        { label: '관리자 신규 등록', page: 'admin-create', key: 'admin-create' }
      ]
    }
  ];

  const SIDE_NAV = {
    home: [],
    support: [
      { label: '교복 지원이란?', page: 'info', key: 'info' },
      { label: '사용 안내', page: 'usage', key: 'usage' },
      { label: '자주 묻는 질문', page: 'faq', key: 'faq' }
    ],
    apply: [
      { label: '교복 지원 신청', page: 'apply', key: 'apply' }
    ],
    admin: [
      { label: '신청 현황 선택', page: 'admin-list', key: 'admin-list' },
      { label: '신청 현황 (학교 담당자)', page: 'admin-school', key: 'admin-school' },
      { label: '신청 현황 (도교육청 관리자)', page: 'admin-office', key: 'admin-office' },
      { label: '관리자 신규 등록', page: 'admin-create', key: 'admin-create' }
    ]
  };

  function currentMeta() {
    const key = document.body.dataset.page || 'home';
    return { key, ...(PAGES[key] || PAGES.home) };
  }

  function renderHeader(meta) {
    const header = document.getElementById('site-header');
    if (!header) return;

    const navHtml = DESKTOP_NAV.map((item) => {
      const isActive = item.children.some((child) => child.key === meta.key) || meta.section === item.key;
      return `
        <li class="gnb-item ${isActive ? 'is-active' : ''}">
          <a href="${AppPath.page(item.page)}" class="gnb-link">${item.label}</a>
          <div class="gnb-submenu" aria-hidden="true">
            <ul>
              ${item.children.map((child) => `<li><a href="${AppPath.page(child.page)}">${child.label}</a></li>`).join('')}
            </ul>
          </div>
        </li>
      `;
    }).join('');

    const mobileNavHtml = DESKTOP_NAV.map((item) => `
      <details class="mobile-nav-group">
        <summary>${item.label}</summary>
        <ul>
          ${item.children.map((child) => `<li><a href="${AppPath.page(child.page)}">${child.label}</a></li>`).join('')}
        </ul>
      </details>
    `).join('');

    header.innerHTML = `
      <div class="skip-links">
        <a href="#main-content">본문 바로가기</a>
        <a href="#desktop-nav">메뉴 바로가기</a>
      </div>
      <header class="site-header">
        <div class="utility-bar">
          <div class="container utility-inner">
            <div class="utility-left">
              <a href="${AppPath.home()}" class="utility-home">홈</a>
            </div>
            <div class="utility-right">
              <a href="#" aria-disabled="true">마이페이지</a>
              <a href="#" aria-disabled="true">로그아웃</a>
              <a href="#" aria-disabled="true">사이트맵</a>
            </div>
          </div>
        </div>
        <div class="container masthead">
          <a class="brand" href="${AppPath.home()}" aria-label="${window.APP_CONFIG.site.logoText}">
            <img src="${AppPath.asset('logo-mark.png')}" alt="" width="42" height="42">
            <div>
              <strong>${window.APP_CONFIG.site.logoText}</strong>
              <span>${window.APP_CONFIG.site.serviceTitle}</span>
            </div>
          </a>

          <form class="search-box js-demo-search-form" role="search">
            <label class="sr-only" for="site-search">사이트 검색</label>
            <input id="site-search" name="q" type="search" placeholder="${window.APP_CONFIG.site.searchPlaceholder}">
            <button type="submit" aria-label="검색">검색</button>
          </form>

          <button type="button" class="mobile-menu-button" id="mobile-menu-button" aria-expanded="false" aria-controls="mobile-drawer">
            <span></span><span></span><span></span>
            <strong>메뉴</strong>
          </button>
        </div>

        <nav class="desktop-nav" id="desktop-nav" aria-label="주 메뉴">
          <div class="container">
            <ul class="desktop-nav-list desktop-nav-list-admin-3">
              ${navHtml}
            </ul>
          </div>
        </nav>

        <aside class="mobile-drawer" id="mobile-drawer" aria-label="모바일 메뉴">
          <div class="mobile-drawer-header">
            <strong>${window.APP_CONFIG.site.serviceTitle}</strong>
            <button type="button" class="drawer-close" id="mobile-drawer-close" aria-label="메뉴 닫기">닫기</button>
          </div>
          <div class="mobile-drawer-body">
            ${mobileNavHtml}
          </div>
        </aside>
        <div class="mobile-backdrop" id="mobile-backdrop"></div>
      </header>
    `;

    window.AppUtil.bindDemoSearchForms(header);
  }

  function renderSubVisual() {
    const container = document.getElementById('sub-visual');
    if (!container) return;
    container.innerHTML = `
      <section class="sub-visual">
        <div class="container sub-visual-inner">
          <div class="sub-copy">
            <p class="eyebrow">TF 검토용 프로토타입</p>
            <h1>${window.APP_CONFIG.site.subVisualTitle}</h1>
            <p>${window.APP_CONFIG.site.subVisualLead}</p>
            <div class="sub-badges">
              ${window.AppUtil.modeBadgeHtml()}
            </div>
          </div>
          <div class="sub-art">
            <img src="${AppPath.asset('hero-uniform.svg')}" alt="교복 지원 서비스 일러스트">
          </div>
        </div>
      </section>
    `;
  }

  function renderSideNav(meta) {
    const side = document.getElementById('side-nav');
    const shell = document.querySelector('.page-shell');
    if (!side || !shell) return;
    const items = SIDE_NAV[meta.section] || [];

    if (meta.section === 'home' || items.length === 0) {
      shell.classList.add('is-home');
      side.innerHTML = '';
      side.hidden = true;
      return;
    }

    shell.classList.remove('is-home');
    side.hidden = false;
    const sideTitle = meta.section === 'admin' ? '신청 관리자' : meta.section === 'apply' ? '신청하기' : '사업안내';
    side.innerHTML = `
      <section class="side-card">
        <h2>${sideTitle}</h2>
        <nav aria-label="${sideTitle} 하위 메뉴">
          <ul class="side-nav-list">
            ${items.map((item) => `
              <li class="${item.key === meta.key ? 'is-active' : ''}">
                <a href="${AppPath.page(item.page)}">${item.label}</a>
              </li>
            `).join('')}
          </ul>
        </nav>
      </section>
    `;
  }

  function renderBreadcrumbs(meta) {
    const el = document.getElementById('breadcrumbs');
    if (!el) return;
    const html = (meta.breadcrumb || []).map((item, index, array) => {
      const isLast = index === array.length - 1;
      return `<li ${isLast ? 'aria-current="page"' : ''}>${window.AppUtil.escapeHtml(item)}</li>`;
    }).join('');
    el.innerHTML = `
      <nav class="breadcrumb" aria-label="현재 위치">
        <ol>
          <li><a href="${AppPath.home()}">홈</a></li>
          ${html}
        </ol>
      </nav>
    `;
  }

  function renderHeading(meta) {
    const el = document.getElementById('page-heading');
    if (!el) return;
    const badge = meta.section === 'admin' ? 'ADMIN' : 'PUBLIC';
    el.innerHTML = `
      <div class="page-heading-box">
        <div>
          <div class="page-heading-top">
            <span class="page-mini-label">${badge}</span>
            ${window.AppUtil.modeBadgeHtml()}
          </div>
          <h2 class="page-title">${meta.heading}</h2>
          <p class="page-description">${meta.description}</p>
        </div>
      </div>
    `;
  }

  function renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-inner">
          <div class="footer-links">
            <a href="#">개인정보처리방침</a>
            <a href="#">이용약관</a>
            <a href="#">저작권보호정책</a>
            <a href="#">사이트맵</a>
          </div>
          <div class="footer-copy">
            <strong>${window.APP_CONFIG.site.footerOrg}</strong>
            <p>${window.APP_CONFIG.site.helpNote}</p>
            <p>문의 예시: ${window.APP_CONFIG.site.helpPhone}</p>
          </div>
        </div>
      </footer>
    `;
  }

  function bindMobileMenu() {
    const button = document.getElementById('mobile-menu-button');
    const closeButton = document.getElementById('mobile-drawer-close');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-backdrop');
    if (!button || !drawer || !backdrop) return;

    const close = () => {
      document.body.classList.remove('drawer-open');
      button.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      document.body.classList.add('drawer-open');
      button.setAttribute('aria-expanded', 'true');
    };

    button.addEventListener('click', () => {
      if (document.body.classList.contains('drawer-open')) close();
      else open();
    });
    closeButton?.addEventListener('click', close);
    backdrop.addEventListener('click', close);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const meta = currentMeta();
    document.title = `${meta.title} | ${window.APP_CONFIG.site.shortTitle}`;
    renderHeader(meta);
    renderSubVisual(meta);
    renderSideNav(meta);
    renderBreadcrumbs(meta);
    renderHeading(meta);
    renderFooter();
    bindMobileMenu();
  });
})();
