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
