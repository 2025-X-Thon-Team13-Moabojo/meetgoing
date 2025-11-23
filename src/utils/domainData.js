export const CATEGORIES = [
    "Development",
    "Design",
    "Planning"
];

export const SUBCATEGORIES = [
    "Web Development",
    "Server Backend",
    "UX/UI Design",
    "Service Planning"
];

export const TECH_STACKS = [
    "React", "TypeScript", "Tailwind CSS",
    "Node.js", "Express", "MongoDB", "Python",
    "Figma", "Adobe XD", "Sketch",
    "Jira", "Notion", "Slack",
    "Next.js", "Supabase", "Flutter"
];

export const VECTOR_DIMENSION = CATEGORIES.length + SUBCATEGORIES.length + TECH_STACKS.length;

export const INDEX_OFFSETS = {
    CATEGORY: 0,
    SUBCATEGORY: CATEGORIES.length,
    TECH_STACK: CATEGORIES.length + SUBCATEGORIES.length
};

export const WEIGHTS = {
    CATEGORY: 25,
    SUBCATEGORY: 7,
    TECH_STACK: 5
};

export const REGIONS = [
    { value: 'Seoul', label: '서울' },
    { value: 'Busan', label: '부산' },
    { value: 'Incheon', label: '인천' },
    { value: 'Daegu', label: '대구' },
    { value: 'Gwangju', label: '광주' },
    { value: 'Daejeon', label: '대전' },
    { value: 'Ulsan', label: '울산' },
    { value: 'Gyeonggi', label: '경기도' },
    { value: 'Gangwon', label: '강원도' },
    { value: 'Chungnam', label: '충청남도' },
    { value: 'Chungbuk', label: '충청북도' },
    { value: 'Jeonnam', label: '전라남도' },
    { value: 'Jeonbuk', label: '전라북도' },
    { value: 'Gyeongnam', label: '경상남도' },
    { value: 'Gyeongbuk', label: '경상북도' },
    { value: 'Jeju', label: '제주도' }
];

export const EVALUATION_CRITERIA = {
    POSITIVE: [
        { id: 'skill_good', label: '실력이 좋아요', score: 2 },
        { id: 'manner_good', label: '매너가 좋아요', score: 2 },
        { id: 'punctual', label: '약속을 잘 지켜요', score: 2 },
        { id: 'communication_good', label: '소통이 원활해요', score: 2 },
        { id: 'passionate', label: '열정적이에요', score: 2 }
    ],
    NEGATIVE: [
        { id: 'skill_bad', label: '실력이 부족해요', score: -2 },
        { id: 'manner_bad', label: '매너가 부족해요', score: -2 },
        { id: 'late', label: '약속을 어겨요', score: -2 },
        { id: 'communication_bad', label: '소통이 어려워요', score: -2 },
        { id: 'passive', label: '참여가 저조해요', score: -2 }
    ],
    RUNAWAY: { id: 'runaway', label: '중도 탈주', score: -2, title: '중도 탈주' }
};
