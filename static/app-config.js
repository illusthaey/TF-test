window.APP_CONFIG = {
  site: {
    shortTitle: "강원특별자치도교육청 교복 지원",
    fullTitle: "강원특별자치도교육청 교복 지원 TF 테스트 페이지",
    logoText: "강원특별자치도교육청",
    serviceTitle: "교복 지원",
    footerOrg: "강원특별자치도교육청 TF팀 테스트 페이지",
    helpPhone: "033-259-0881",
    helpNote: "정적 HTML 목업 페이지입니다. 실제 개인정보 저장·전송은 동작하지 않습니다.",
    searchPlaceholder: "검색어를 입력해주세요",
    subVisualTitle: "교복 지원 (테스트 페이지)",
    subVisualLead: "신청 화면과 관리자 화면 흐름을 함께 검토하기 위한 데모입니다.",
    demoNotice: "TF 검토용 정적 프로토타입입니다. 실제 운영 시에는 인증, 권한, 서버 저장, 결재선 연동이 별도로 구현되어야 합니다."
  },
  policy: {
    mode: "choice",
    labels: {
      voucher: "바우처",
      inKind: "현물"
    },
    sampleTarget: "유치원·초·중·고 및 특수학교 대상(예시)",
    sampleAmount: "정책 확정 전",
    sampleWindow: "신학기 전후(예시)",
    sampleUseCase: "지정 판매처 또는 제휴 사용처(예시)"
  },
  storageKey: "GW_UNIFORM_SUPPORT_PROTO_V2",
  regionOrder: ["강릉", "고성", "동해", "삼척", "속초", "양구", "양양", "영월", "원주", "인제", "정선", "철원", "춘천", "태백", "평창", "홍천", "화천", "횡성"],
  schoolLevels: [
    { value: "kindergarten", label: "유치원" },
    { value: "elementary", label: "초등학교" },
    { value: "middle", label: "중학교" },
    { value: "high", label: "고등학교" },
    { value: "special", label: "특수학교 및 기타" }
  ],
  statuses: [
    "신청 접수",
    "학교장 승인 대기",
    "담당자 반려",
    "학교장 승인",
    "학교장 반려",
    "도교육청 접수",
    "도교육청 승인",
    "지급 완료"
  ],
  rejectionReasons: [
    "학생 정보 오류",
    "중복 신청",
    "신청 대상자 아님",
    "기타"
  ],
  demoContext: {
    schoolManager: {
      region: "춘천",
      schoolName: "춘천고등학교"
    }
  }
};
