(function () {
  function currentMode() {
    return window.APP_CONFIG.policy.mode;
  }

  function supportTypeRows() {
    if (currentMode() === 'voucher') {
      return `
        <tr>
          <th scope="row">지원 형태</th>
          <td>
            <div class="static-field">
              <strong>바우처</strong>
              <span class="field-help">현재 설정은 바우처 단일형입니다.</span>
            </div>
            <input type="hidden" name="supportType" value="voucher">
          </td>
        </tr>
      `;
    }

    return `
      <tr>
        <th scope="row">지원 형태</th>
        <td>
          <div class="radio-group" role="radiogroup" aria-label="지원 형태">
            <label><input type="radio" name="supportType" value="voucher" checked> ${window.AppUtil.getSupportLabel('voucher')}</label>
            <label><input type="radio" name="supportType" value="inKind"> ${window.AppUtil.getSupportLabel('inKind')}</label>
          </div>
        </td>
      </tr>
      <tr class="in-kind-row is-hidden">
        <th scope="row"><label for="itemRequest">현물 희망 품목</label></th>
        <td>
          <input type="text" name="itemRequest" id="itemRequest" placeholder="예: 동복 상·하의, 생활복 세트">
        </td>
      </tr>
      <tr class="in-kind-row is-hidden">
        <th scope="row">치수</th>
        <td>
          <div class="inline-inputs inline-inputs-wide">
            <label>상의 <input type="text" name="topSize" placeholder="예: 95"></label>
            <label>하의 <input type="text" name="bottomSize" placeholder="예: 74"></label>
          </div>
        </td>
      </tr>
    `;
  }

  function adminExtraRows() {
    return `
      <tr>
        <th scope="row">상태</th>
        <td>
          <select name="status">
            ${window.APP_CONFIG.statuses.map((status, index) => `<option value="${status}" ${index === 0 ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </td>
      </tr>
      <tr>
        <th scope="row">관리 메모</th>
        <td>
          <textarea name="adminMemo" rows="3" placeholder="관리자 확인 메모를 입력하세요."></textarea>
        </td>
      </tr>
    `;
  }

  function consentRow(context) {
    if (context === 'admin') {
      return `
        <tr>
          <th scope="row">개인정보 확인</th>
          <td>
            <label class="check-line">
              <input type="checkbox" name="consent" checked>
              관리자 등록 시 개인정보 확인이 완료된 것으로 간주합니다.
            </label>
          </td>
        </tr>
      `;
    }

    return `
      <tr>
        <th scope="row">개인정보 동의</th>
        <td>
          <label class="check-line">
            <input type="checkbox" name="consent">
            개인정보 수집·이용 안내를 확인했으며 신청 정보 저장에 동의합니다.
          </label>
        </td>
      </tr>
    `;
  }

  function renderFormHtml(options = {}) {
    const context = options.context || 'public';
    const submitLabel = options.submitLabel || (context === 'admin' ? '저장' : '신청서 제출');
    const secondaryLabel = options.secondaryLabel || (context === 'admin' ? '목록으로' : '입력 초기화');
    const secondaryAction = options.secondaryAction || (context === 'admin' ? 'list' : 'reset');

    return `
      <div class="alert-box">
        <strong>안내</strong>
        <p>${window.APP_CONFIG.site.demoNotice}</p>
      </div>

      <form id="${context}-application-form" class="application-form" novalidate>
        <div class="table-scroll">
          <table class="tbl-form">
            <caption>${context === 'admin' ? '관리자 신규 등록 폼' : '교복 지원 신청 폼'}</caption>
            <colgroup>
              <col class="col-label">
              <col>
            </colgroup>
            <tbody>
              <tr>
                <th scope="row"><label for="${context}-region">지역</label></th>
                <td>
                  <div class="field-stack">
                    <select id="${context}-region" name="region">
                      ${window.AppSchools.regionOptions('', true)}
                    </select>
                    <p class="field-help">지역과 학교급은 어떤 항목을 먼저 선택해도 학교 목록이 함께 좁혀집니다.</p>
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-schoolLevel">학교급</label></th>
                <td>
                  <select id="${context}-schoolLevel" name="schoolLevel">
                    ${window.AppSchools.schoolLevelOptions('', true)}
                  </select>
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-schoolId">학교명</label></th>
                <td>
                  <div class="field-stack">
                    <select id="${context}-schoolId" name="schoolId">
                      <option value="">지역 또는 학교급을 선택하세요</option>
                    </select>
                    <div class="school-meta" id="${context}-schoolMeta">학교를 선택하면 주소와 포함 학교 정보를 표시합니다.</div>
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-grade">학년</label></th>
                <td>
                  <select id="${context}-grade" name="grade"></select>
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-className">반</label></th>
                <td>
                  <input id="${context}-className" name="className" type="text" placeholder="예: 1반, 해반, 달">
                  <p class="field-help">관리자 화면에서는 끝의 ‘반’ 글자를 제외한 값으로 표시됩니다.</p>
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-studentNo">번호</label></th>
                <td>
                  <input id="${context}-studentNo" name="studentNo" type="text" inputmode="numeric" placeholder="예: 11번, 3">
                  <p class="field-help">관리자 화면에서는 끝의 ‘번’ 글자를 제외한 숫자만 표시됩니다.</p>
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-studentName">학생 성명</label></th>
                <td>
                  <input id="${context}-studentName" name="studentName" type="text" placeholder="학생 성명을 입력해주세요.">
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-birthDate">생년월일</label></th>
                <td>
                  <div class="field-stack">
                    <input id="${context}-birthDate" name="birthDate" type="date" max="${window.AppUtil.todayIso()}">
                    <p class="field-help">달력에서 선택하거나 직접 YYYY-MM-DD 형식으로 입력할 수 있습니다.</p>
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-parentName">보호자 성명</label></th>
                <td>
                  <input id="${context}-parentName" name="parentName" type="text" placeholder="보호자 성명을 입력해주세요.">
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-parentPhone">보호자 연락처</label></th>
                <td>
                  <div class="field-stack">
                    <input id="${context}-parentPhone" name="parentPhone" data-phone type="text" inputmode="numeric" placeholder="010-0000-0000">
                    <p class="field-help">방향키로도 다음 입력 칸으로 이동할 수 있습니다.</p>
                  </div>
                </td>
              </tr>
              ${supportTypeRows()}
              ${context === 'admin' ? adminExtraRows() : ''}
              ${consentRow(context)}
            </tbody>
          </table>
        </div>

        <div class="button-row center">
          <button type="submit" class="btn btn-primary">${submitLabel}</button>
          <button type="${secondaryAction === 'reset' ? 'reset' : 'button'}" class="btn btn-secondary" data-secondary-action="${secondaryAction}">${secondaryLabel}</button>
        </div>
      </form>

      <div class="result-box" id="${context}-resultBox" hidden></div>
    `;
  }

  function refreshGradeOptions(form) {
    const school = window.AppSchools.findById(form.elements.schoolId.value);
    const schoolLevel = school?.levelKey || form.elements.schoolLevel.value || 'middle';
    const currentValue = form.elements.grade.value;
    form.elements.grade.innerHTML = window.AppSchools.gradeOptions(schoolLevel);
    if (currentValue && form.elements.grade.querySelector(`option[value="${currentValue}"]`)) {
      form.elements.grade.value = currentValue;
    }
  }

  function refreshSchoolMeta(form, context) {
    const school = window.AppSchools.findById(form.elements.schoolId.value);
    const box = document.getElementById(`${context}-schoolMeta`);
    if (!box) return;
    if (!school) {
      box.textContent = '학교를 선택하면 주소와 포함 학교 정보를 표시합니다.';
      return;
    }

    const aliasHtml = school.aliases.length
      ? `<span>포함 학교: ${window.AppUtil.escapeHtml(school.aliases.join(', '))}</span>`
      : '<span>포함 학교 없음</span>';

    box.innerHTML = `
      <strong>${window.AppUtil.escapeHtml(school.name)}</strong>
      <span>${window.AppUtil.escapeHtml(school.region)} · ${window.AppUtil.escapeHtml(school.levelLabel)}</span>
      <span>${window.AppUtil.escapeHtml(school.address || '주소 미등록')}</span>
      <span>${window.AppUtil.escapeHtml(school.phone || '전화번호 미등록')}</span>
      ${aliasHtml}
    `;
  }

  function refreshSchoolOptions(form, context) {
    const selectedId = form.elements.schoolId.value;
    const filters = {
      region: form.elements.region.value,
      schoolLevel: form.elements.schoolLevel.value
    };
    form.elements.schoolId.innerHTML = window.AppSchools.schoolOptions(filters, selectedId, true);

    if (selectedId && !window.AppSchools.findById(selectedId)) {
      form.elements.schoolId.value = '';
    }

    refreshSchoolMeta(form, context);
    refreshGradeOptions(form);
  }

  function toggleInKindRows(form) {
    const isInKind = currentMode() === 'choice' && form.elements.supportType?.value === 'inKind';
    form.querySelectorAll('.in-kind-row').forEach((row) => {
      row.classList.toggle('is-hidden', !isInKind);
    });
  }

  function serialize(form) {
    const school = window.AppSchools.findById(form.elements.schoolId.value);
    const supportType = currentMode() === 'voucher' ? 'voucher' : form.elements.supportType.value;

    return {
      region: form.elements.region.value,
      schoolLevel: school?.levelKey || form.elements.schoolLevel.value,
      schoolLevelLabel: school?.levelLabel || window.AppUtil.schoolLevelLabel(form.elements.schoolLevel.value),
      schoolId: form.elements.schoolId.value,
      schoolCode: school?.schoolCode || '',
      schoolName: school?.name || '',
      grade: form.elements.grade.value,
      rawClassName: form.elements.className.value.trim(),
      className: window.AppUtil.normalizeClassName(form.elements.className.value),
      rawStudentNo: form.elements.studentNo.value.trim(),
      studentNo: window.AppUtil.normalizeStudentNo(form.elements.studentNo.value),
      studentName: form.elements.studentName.value.trim(),
      birthDate: form.elements.birthDate.value,
      parentName: form.elements.parentName.value.trim(),
      parentPhone: window.AppUtil.formatPhone(form.elements.parentPhone.value),
      supportType,
      itemRequest: supportType === 'inKind' ? (form.elements.itemRequest?.value.trim() || '') : '',
      topSize: supportType === 'inKind' ? (form.elements.topSize?.value.trim() || '') : '',
      bottomSize: supportType === 'inKind' ? (form.elements.bottomSize?.value.trim() || '') : '',
      consent: Boolean(form.elements.consent?.checked),
      status: form.elements.status?.value || '신청 접수',
      adminMemo: form.elements.adminMemo?.value.trim() || ''
    };
  }

  function validate(form, context = 'public') {
    const value = serialize(form);

    if (!value.region) return { ok: false, message: '지역을 선택해주세요.' };
    if (!value.schoolLevel) return { ok: false, message: '학교급을 선택해주세요.' };
    if (!value.schoolId) return { ok: false, message: '학교명을 선택해주세요.' };
    if (!value.grade) return { ok: false, message: '학년을 선택해주세요.' };
    if (!value.studentName) return { ok: false, message: '학생 성명을 입력해주세요.' };
    if (!window.AppUtil.validateBirthDate(value.birthDate)) return { ok: false, message: '생년월일을 정확히 입력해주세요.' };
    if (!value.parentName) return { ok: false, message: '보호자 성명을 입력해주세요.' };
    if (window.AppUtil.digits(value.parentPhone).length < 10) return { ok: false, message: '보호자 연락처를 정확히 입력해주세요.' };
    if (currentMode() === 'choice' && !value.supportType) return { ok: false, message: '지원 형태를 선택해주세요.' };
    if (value.supportType === 'inKind' && !value.itemRequest) return { ok: false, message: '현물 희망 품목을 입력해주세요.' };
    if (value.supportType === 'inKind' && !value.topSize) return { ok: false, message: '치수(상의)를 입력해주세요.' };
    if (value.supportType === 'inKind' && !value.bottomSize) return { ok: false, message: '치수(하의)를 입력해주세요.' };
    if (!value.consent) {
      return { ok: false, message: context === 'admin' ? '개인정보 확인 체크가 필요합니다.' : '개인정보 동의가 필요합니다.' };
    }

    return { ok: true, value };
  }

  function confirmationRows(value) {
    return [
      { label: '지역', value: value.region },
      { label: '학교급', value: window.AppUtil.schoolLevelLabel(value.schoolLevel) },
      { label: '학교명', value: value.schoolName },
      { label: '학년', value: `${value.grade}학년` },
      { label: '반', value: value.rawClassName || '-' },
      { label: '번호', value: value.rawStudentNo || '-' },
      { label: '학생 성명', value: value.studentName },
      { label: '생년월일', value: value.birthDate },
      { label: '보호자 성명', value: value.parentName },
      { label: '보호자 연락처', value: value.parentPhone },
      { label: '지원 형태', value: window.AppUtil.getSupportLabel(value.supportType) },
      { label: '현물 희망 품목', value: value.supportType === 'inKind' ? (value.itemRequest || '-') : '-' },
      { label: '치수(상의)', value: value.supportType === 'inKind' ? (value.topSize || '-') : '-' },
      { label: '치수(하의)', value: value.supportType === 'inKind' ? (value.bottomSize || '-') : '-' },
      { label: '개인정보 동의', value: value.consent ? '동의' : '미동의' }
    ];
  }

  function bind(form, context = 'public') {
    form.elements.region.addEventListener('change', () => refreshSchoolOptions(form, context));
    form.elements.schoolLevel.addEventListener('change', () => refreshSchoolOptions(form, context));
    form.elements.schoolId.addEventListener('change', () => {
      refreshSchoolMeta(form, context);
      refreshGradeOptions(form);
    });

    if (currentMode() === 'choice') {
      form.querySelectorAll('input[name="supportType"]').forEach((input) => {
        input.addEventListener('change', () => toggleInKindRows(form));
      });
    }

    window.AppUtil.bindPhoneFormatter(form);
    window.AppUtil.bindArrowNavigation(form);
  }

  function initForm(form, context = 'public') {
    if (form.dataset.formBound !== 'true') {
      bind(form, context);
      form.dataset.formBound = 'true';
    }
    refreshGradeOptions(form);
    refreshSchoolOptions(form, context);
    if (currentMode() === 'choice') {
      toggleInKindRows(form);
    }
  }

  window.AppForms = {
    renderFormHtml,
    serialize,
    validate,
    initForm,
    refreshSchoolOptions,
    refreshSchoolMeta,
    refreshGradeOptions,
    toggleInKindRows,
    confirmationRows
  };
})();
