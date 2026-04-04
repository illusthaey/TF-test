(function () {
  const regionOrder = window.APP_CONFIG.regionOrder;
  const schoolList = window.SCHOOLS_DATA.slice();

  function regions() {
    return regionOrder.filter((region) => schoolList.some((school) => school.region === region));
  }

  function schoolById(id) {
    return schoolList.find((school) => school.id === id) || null;
  }

  function schoolsByRegion(region, keyword = "") {
    const term = String(keyword || "").trim().toLowerCase();
    return schoolList
      .filter((school) => (!region || school.region === region))
      .filter((school) => {
        if (!term) return true;
        const source = `${school.name} ${school.address} ${school.level} ${school.region}`.toLowerCase();
        return source.includes(term);
      })
      .sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }

  function regionOptions(selected = "", includeBlank = true) {
    const list = regions().map((region) => `
      <option value="${region}" ${selected === region ? "selected" : ""}>${region}</option>
    `).join("");
    return `${includeBlank ? '<option value="">선택하세요</option>' : ""}${list}`;
  }

  function schoolOptions(region, selectedId = "", keyword = "") {
    const list = schoolsByRegion(region, keyword).map((school) => `
      <option value="${school.id}" ${selectedId === school.id ? "selected" : ""}>${school.name}</option>
    `).join("");
    return `<option value="">학교를 선택하세요</option>${list}`;
  }

  function currentMode() {
    return window.APP_CONFIG.policy.mode;
  }

  function supportTypeRow() {
    if (currentMode() === "voucher") {
      return `
        <tr>
          <th scope="row">지원형태</th>
          <td>
            <div class="static-field">
              <strong>바우처 단일</strong>
              <span class="field-help">config.js의 policy.mode 값을 "choice"로 바꾸면 현물 / 바우처 선택형 UI가 나타납니다.</span>
            </div>
            <input type="hidden" name="supportType" value="voucher">
          </td>
        </tr>
      `;
    }

    return `
      <tr>
        <th scope="row">지원형태</th>
        <td>
          <div class="radio-group" role="radiogroup" aria-label="지원형태">
            <label><input type="radio" name="supportType" value="voucher" checked> ${window.APP_CONFIG.policy.labels.voucher}</label>
            <label><input type="radio" name="supportType" value="inKind"> ${window.APP_CONFIG.policy.labels.inKind}</label>
          </div>
          <p class="field-help">정책 검토용 예시입니다. 선택형이 아니면 config.js에서 바우처 단일로 바꿔주세요.</p>
        </td>
      </tr>
      <tr class="in-kind-row is-hidden">
        <th scope="row">현물 희망 품목</th>
        <td>
          <input type="text" name="itemRequest" placeholder="예: 동복 상·하의, 체육복 세트">
        </td>
      </tr>
      <tr class="in-kind-row is-hidden">
        <th scope="row">사이즈</th>
        <td>
          <div class="inline-inputs">
            <label>상의 <input type="text" name="topSize" placeholder="예: 95"></label>
            <label>하의 <input type="text" name="bottomSize" placeholder="예: 74"></label>
          </div>
        </td>
      </tr>
      <tr class="in-kind-row is-hidden">
        <th scope="row">추가 요청사항</th>
        <td>
          <textarea name="remarks" rows="3" placeholder="예: 치수 재확인 필요, 하복은 추후 신청 등"></textarea>
        </td>
      </tr>
    `;
  }

  function adminFieldsRow() {
    return `
      <tr>
        <th scope="row">처리상태</th>
        <td>
          <select name="status">
            ${window.APP_CONFIG.statuses.map((status) => `<option value="${status}" ${status === "접수" ? "selected" : ""}>${status}</option>`).join("")}
          </select>
        </td>
      </tr>
      <tr>
        <th scope="row">관리자 메모</th>
        <td>
          <textarea name="adminMemo" rows="3" placeholder="접수 메모나 확인 사항을 입력하세요."></textarea>
        </td>
      </tr>
    `;
  }

  function consentRow(context) {
    if (context === "admin") {
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
          <p class="field-help">정적 데모이므로 데이터는 브라우저 localStorage에만 저장됩니다.</p>
        </td>
      </tr>
    `;
  }

  function renderFormHtml(options = {}) {
    const context = options.context || "public";
    const submitLabel = options.submitLabel || (context === "admin" ? "추가" : "신청서 제출");
    const secondaryLabel = options.secondaryLabel || (context === "admin" ? "목록으로" : "초기화");
    const secondaryAction = options.secondaryAction || "reset";

    return `
      <div class="alert-box">
        <strong>TF 검토용 안내</strong>
        <p>${window.APP_CONFIG.site.demoNotice}</p>
      </div>

      <form id="${context}-application-form" class="application-form" novalidate>
        <div class="table-scroll">
          <table class="tbl-form">
            <caption>${context === "admin" ? "관리자 신규 등록 폼" : "교복 지원 신청 폼"}</caption>
            <colgroup>
              <col class="col-label">
              <col>
            </colgroup>
            <tbody>
              <tr>
                <th scope="row"><label for="${context}-region">지역</label></th>
                <td>
                  <select id="${context}-region" name="region">
                    ${regionOptions()}
                  </select>
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-schoolId">학교명</label></th>
                <td>
                  <div class="field-stack">
                    <input type="search" id="${context}-schoolSearch" name="schoolSearch" placeholder="학교명을 검색하세요.">
                    <select id="${context}-schoolId" name="schoolId">
                      <option value="">지역을 먼저 선택하세요</option>
                    </select>
                    <div class="school-meta" id="${context}-schoolMeta">
                      학교를 선택하면 주소와 학교급 정보를 표시합니다.
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-grade">학년</label></th>
                <td>
                  <select id="${context}-grade" name="grade">
                    <option value="1" selected>1학년</option>
                    <option value="2">2학년</option>
                    <option value="3">3학년</option>
                  </select>
                  <p class="field-help">신입생 중심 사업을 가정했지만, 화면 검토를 위해 2·3학년도 선택 가능하게 두었습니다.</p>
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-className">반</label></th>
                <td>
                  <input id="${context}-className" name="className" type="text" placeholder="미정이면 비워둘 수 있습니다.">
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-studentNo">번호</label></th>
                <td>
                  <input id="${context}-studentNo" name="studentNo" type="text" inputmode="numeric" placeholder="미정이면 비워둘 수 있습니다.">
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
                  <input id="${context}-birthDate" name="birthDate" type="date" max="${window.AppUtil.todayIso()}">
                </td>
              </tr>
              <tr>
                <th scope="row"><label for="${context}-studentPhone">학생 연락처</label></th>
                <td>
                  <input id="${context}-studentPhone" name="studentPhone" data-phone type="text" placeholder="010-0000-0000">
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
                  <input id="${context}-parentPhone" name="parentPhone" data-phone type="text" placeholder="010-0000-0000">
                </td>
              </tr>
              ${supportTypeRow()}
              ${context === "admin" ? adminFieldsRow() : ""}
              ${consentRow(context)}
            </tbody>
          </table>
        </div>

        <div class="button-row center">
          <button type="submit" class="btn btn-primary">${submitLabel}</button>
          <button type="${secondaryAction === "reset" ? "reset" : "button"}" class="btn btn-secondary" data-secondary-action="${secondaryAction}">${secondaryLabel}</button>
        </div>
      </form>

      <div class="result-box" id="${context}-resultBox" hidden></div>
    `;
  }

  function refreshSchoolMeta(form, context) {
    const school = schoolById(form.elements.schoolId.value);
    const box = document.getElementById(`${context}-schoolMeta`);
    if (!box) return;
    if (!school) {
      box.textContent = "학교를 선택하면 주소와 학교급 정보를 표시합니다.";
      return;
    }
    box.innerHTML = `
      <strong>${window.AppUtil.escapeHtml(school.name)}</strong>
      <span>${window.AppUtil.escapeHtml(school.region)} · ${window.AppUtil.escapeHtml(school.level)}</span>
      <span>${window.AppUtil.escapeHtml(school.address || "주소 미등록")}</span>
      <span>${window.AppUtil.escapeHtml(school.phone || "전화번호 미등록")}</span>
    `;
  }

  function refreshSchoolOptions(form, context) {
    const region = form.elements.region.value;
    const schoolSelect = form.elements.schoolId;
    const keyword = form.elements.schoolSearch.value;
    const selected = schoolSelect.value;
    schoolSelect.innerHTML = schoolOptions(region, selected, keyword);
    if (selected && !schoolById(selected)) {
      schoolSelect.value = "";
    }
    refreshSchoolMeta(form, context);
  }

  function toggleInKindRows(form) {
    const isInKind = currentMode() === "choice" && form.elements.supportType?.value === "inKind";
    form.querySelectorAll(".in-kind-row").forEach((row) => {
      row.classList.toggle("is-hidden", !isInKind);
    });
  }

  function serialize(form) {
    const school = schoolById(form.elements.schoolId.value);
    const supportType = currentMode() === "voucher" ? "voucher" : form.elements.supportType.value;
    return {
      region: form.elements.region.value,
      schoolId: form.elements.schoolId.value,
      schoolCode: school?.schoolCode || "",
      schoolName: school?.name || "",
      schoolLevel: school?.level || "",
      grade: form.elements.grade.value,
      className: form.elements.className.value.trim(),
      studentNo: form.elements.studentNo.value.trim(),
      studentName: form.elements.studentName.value.trim(),
      birthDate: form.elements.birthDate.value,
      studentPhone: window.AppUtil.formatPhone(form.elements.studentPhone.value),
      parentName: form.elements.parentName.value.trim(),
      parentPhone: window.AppUtil.formatPhone(form.elements.parentPhone.value),
      supportType,
      itemRequest: supportType === "inKind" ? form.elements.itemRequest?.value.trim() || "" : "",
      topSize: supportType === "inKind" ? form.elements.topSize?.value.trim() || "" : "",
      bottomSize: supportType === "inKind" ? form.elements.bottomSize?.value.trim() || "" : "",
      remarks: supportType === "inKind" ? form.elements.remarks?.value.trim() || "" : form.elements.remarks?.value.trim() || "",
      consent: Boolean(form.elements.consent?.checked),
      status: form.elements.status?.value || "접수",
      adminMemo: form.elements.adminMemo?.value.trim() || ""
    };
  }

  function validate(form, context = "public") {
    const value = serialize(form);

    if (!value.region) return { ok: false, message: "지역을 선택해주세요." };
    if (!value.schoolId) return { ok: false, message: "학교명을 선택해주세요." };
    if (!value.grade) return { ok: false, message: "학년을 선택해주세요." };
    if (!value.studentName) return { ok: false, message: "학생 성명을 입력해주세요." };
    if (!value.birthDate) return { ok: false, message: "생년월일을 입력해주세요." };
    if (!value.studentPhone || window.AppUtil.digits(value.studentPhone).length < 10) return { ok: false, message: "학생 연락처를 정확히 입력해주세요." };
    if (!value.parentName) return { ok: false, message: "보호자 성명을 입력해주세요." };
    if (!value.parentPhone || window.AppUtil.digits(value.parentPhone).length < 10) return { ok: false, message: "보호자 연락처를 정확히 입력해주세요." };
    if (currentMode() === "choice" && !value.supportType) return { ok: false, message: "지원형태를 선택해주세요." };
    if (value.supportType === "inKind" && !value.itemRequest) return { ok: false, message: "현물 희망 품목을 입력해주세요." };
    if (!value.consent) {
      return { ok: false, message: context === "admin" ? "개인정보 확인 체크가 필요합니다." : "개인정보 동의가 필요합니다." };
    }
    return { ok: true, value };
  }

  function bind(form, context = "public") {
    form.elements.region.addEventListener("change", () => {
      form.elements.schoolSearch.value = "";
      refreshSchoolOptions(form, context);
    });

    form.elements.schoolSearch.addEventListener("input", () => {
      refreshSchoolOptions(form, context);
    });

    form.elements.schoolId.addEventListener("change", () => {
      refreshSchoolMeta(form, context);
    });

    form.elements.studentNo.addEventListener("input", () => {
      form.elements.studentNo.value = form.elements.studentNo.value.replace(/\D/g, "");
    });

    if (currentMode() === "choice") {
      form.querySelectorAll('input[name="supportType"]').forEach((input) => {
        input.addEventListener("change", () => toggleInKindRows(form));
      });
      toggleInKindRows(form);
    }

    window.AppUtil.bindPhoneFormatter(form);
  }

  function initForm(form, context = "public") {
    bind(form, context);
    refreshSchoolOptions(form, context);
  }

  window.AppForms = {
    regions,
    schoolById,
    schoolsByRegion,
    regionOptions,
    schoolOptions,
    renderFormHtml,
    serialize,
    validate,
    initForm,
    toggleInKindRows
  };
})();
