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
