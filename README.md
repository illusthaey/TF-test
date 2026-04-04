# TF-test refactor version

강원특별자치도교육청 교복 지원 TF 테스트 페이지를 유지보수하기 쉽게 다시 정리한 버전입니다.

## 이번 리팩터링 핵심

- 각 HTML에서 반복되던 설정, 학교 데이터, 유틸, 폼, 관리자 로직을 `/static/*.js`로 분리
- 학교 목록을 **분교 본교 통합 / 병설유치원 유치원 급 분리** 규칙으로 재정리
- 신청 현황 화면을 다음 두 개의 HTML로 분리
  - `/admin-school/index.html` : 신청 현황 (학교 담당자)
  - `/admin-office/index.html` : 신청 현황 (도교육청 관리자)
- 기존 `/admin-list/index.html`은 역할 선택 허브 화면으로 변경
- 신청 화면에 **지역 + 학교급 독립 필터링**, **제출 전 확인 팝업**, **방향키 이동**, **반/번호 정규화** 반영

## 주요 경로

- `/index.html`
- `/info/index.html`
- `/apply/index.html`
- `/usage/index.html`
- `/faq/index.html`
- `/admin-list/index.html`
- `/admin-school/index.html`
- `/admin-office/index.html`
- `/admin-create/index.html`
- `/static/style.css`

## 공통 스크립트

- `/static/app-config.js`
- `/static/schools-data.js`
- `/static/app-util.js`
- `/static/app-shell.js`
- `/static/app-schools.js`
- `/static/app-db.js`
- `/static/app-forms.js`
- `/static/app-admin-common.js`

## 참고

- 데이터 저장은 브라우저 `localStorage`만 사용합니다.
- `tools/build_school_data.py`는 학교 데이터 재생성용 참고 스크립트로 유지했습니다.
- 학교 담당자 화면은 데모 기준으로 `춘천고등학교` 권한에 맞춰 보여주도록 구성했습니다.
