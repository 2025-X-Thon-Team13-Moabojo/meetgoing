// Contest Categories and Associated Roles
export const CONTEST_CATEGORIES = {
    IT_SOFTWARE: {
        id: 'IT_SOFTWARE',
        label: 'IT / 소프트웨어 / 게임',
        roles: [
            'PM (기획자)',
            'UI/UX 디자이너',
            '프론트엔드 개발자',
            '백엔드 개발자',
            'AI/데이터 엔지니어',
            '게임 클라이언트/서버'
        ]
    },
    MEDIA_CONTENT: {
        id: ' MEDIA_CONTENT',
        label: '영상 / 미디어 / 콘텐츠',
        roles: [
            'PD (연출/감독)',
            '작가 (시나리오)',
            '촬영 감독',
            '편집자 (에디터)',
            '음향/사운드',
            '배우/출연자',
            '모션 디자이너'
        ]
    },
    SCIENCE_ENGINEERING: {
        id: 'SCIENCE_ENGINEERING',
        label: '순수 과학 / 공학 / 탐구',
        roles: [
            '수석 연구원 (리더)',
            '자료 조사 (리서처)',
            '실험/제작',
            '데이터 분석가',
            '테크니컬 라이터'
        ]
    },
    MATH_FINANCE: {
        id: 'MATH_FINANCE',
        label: '수학 / 통계 / 금융',
        roles: [
            '모델러 (수식 설계)',
            '알고리즘 구현 (코더)',
            '데이터 분석가',
            '보고서 작성자'
        ]
    },
    MARKETING_STARTUP: {
        id: 'MARKETING_STARTUP',
        label: '마케팅 / 아이디어 / 창업',
        roles: [
            '기획/마케터',
            'PPT 디자이너',
            '발표자 (프리젠터)',
            '재무/회계'
        ]
    }
};

// Helper function to get all category labels
export const getCategoryLabels = () => {
    return Object.values(CONTEST_CATEGORIES).map(cat => cat.label);
};

// Helper function to get category by label
export const getCategoryByLabel = (label) => {
    return Object.values(CONTEST_CATEGORIES).find(cat => cat.label === label);
};

// Helper function to assign contest to most relevant category
export const assignContestCategory = (contestTitle, contestCategory) => {
    const title = (contestTitle || '').toLowerCase();
    const category = (contestCategory || '').toLowerCase();
    const combined = `${title} ${category}`;

    // IT/Software/Game keywords
    if (combined.match(/(앱|웹|소프트웨어|프로그래밍|코딩|개발|ai|인공지능|데이터|게임|유니티|언리얼|iot|sw|디지털|tech|해커톤|아이디어톤|앱잼)/)) {
        return CONTEST_CATEGORIES.IT_SOFTWARE.label;
    }

    // Media/Video/Content keywords
    if (combined.match(/(영상|미디어|영화|드라마|광고|방송|유튜브|콘텐츠|촬영|편집|영화제|시나리오|다큐|애니|웹툰|웹소설|음악|사운드)/)) {
        return CONTEST_CATEGORIES.MEDIA_CONTENT.label;
    }

    // Science/Engineering keywords
    if (combined.match(/(과학|공학|실험|연구|논문|탐구|로봇|드론|전자|기계|화학|생명|물리|수학올림피아드)/)) {
        return CONTEST_CATEGORIES.SCIENCE_ENGINEERING.label;
    }

    // Math/Statistics/Finance keywords
    if (combined.match(/(수학|금융|통계|경제|투자|재무|회계|모델링|알고리즘|quant|финанс)/)) {
        return CONTEST_CATEGORIES.MATH_FINANCE.label;
    }

    // Marketing/Startup keywords (also default fallback)
    if (combined.match(/(마케팅|광고|브랜딩|창업|아이디어|사업|비즈니스|스타트업|기획|전략|ppt|발표|프레젠테이션|사회|정책|공모)/)) {
        return CONTEST_CATEGORIES.MARKETING_STARTUP.label;
    }

    // Default fallback
    return CONTEST_CATEGORIES.MARKETING_STARTUP.label;
};
