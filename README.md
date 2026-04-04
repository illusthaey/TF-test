# TF-test single-html folder version

강원특별자치도교육청 교복 지원 TF 테스트 페이지를 다음 기준으로 재구성한 버전입니다.

- 각 상세 페이지를 `/페이지명/index.html` 구조로 변경
- 루트 홈은 `/index.html` 유지
- 공통 정적 자산 폴더를 `assets`에서 `static`으로 변경
- CSS는 `/static/style.css` 하나로 유지
- 기존 외부 JS 파일은 모두 각 페이지의 `index.html` 내부로 인라인 통합
- 학교 데이터(`SCHOOLS_DATA`)도 각 페이지 내부 스크립트에 포함
- 브라우저 `localStorage` 기반 데모 동작은 유지

## 주요 경로
- `/index.html`
- `/info/index.html`
- `/apply/index.html`
- `/usage/index.html`
- `/faq/index.html`
- `/admin-list/index.html`
- `/admin-create/index.html`
- `/static/style.css`

## 참고
`tools/build_school_data.py`는 학교 데이터 원본을 다시 생성할 때 참고용으로 남겨둔 스크립트입니다.
현재 배포 구조에서는 학교 데이터가 각 페이지 `index.html` 안에 인라인으로 포함됩니다.
