import { CATEGORIES, SUBCATEGORIES, TECH_STACKS, VECTOR_DIMENSION, INDEX_OFFSETS, WEIGHTS } from './domainData.js';

/**
 * Converts a user object into a numerical vector based on their profile data.
 * @param {Object} user - The user object containing category, subCategory, and techStack.
 * @returns {Array<number>} - The vector representation of the user.
 */
export function userToVector(user) {
    const vector = new Array(VECTOR_DIMENSION).fill(0);

    // 1. Category
    const catIndex = CATEGORIES.indexOf(user.category);
    if (catIndex !== -1) {
        vector[INDEX_OFFSETS.CATEGORY + catIndex] = WEIGHTS.CATEGORY;
    }

    // 2. SubCategory
    const subCatIndex = SUBCATEGORIES.indexOf(user.subCategory);
    if (subCatIndex !== -1) {
        vector[INDEX_OFFSETS.SUBCATEGORY + subCatIndex] = WEIGHTS.SUBCATEGORY;
    }

    // 3. Tech Stack
    if (Array.isArray(user.techStack)) {
        user.techStack.forEach(tech => {
            const techIndex = TECH_STACKS.indexOf(tech);
            if (techIndex !== -1) {
                vector[INDEX_OFFSETS.TECH_STACK + techIndex] = WEIGHTS.TECH_STACK;
            }
        });
    }

    return vector;
}

/**
 * Calculates the suitability score between two user vectors.
 * Logic:
 * - Category Match: Adds to score (Dot Product)
 * - SubCategory Match: Adds to score (Dot Product)
 * - Tech Stack: Adds to score if DIFFERENT (XOR-like behavior)
 * @param {Array<number>} vecA 
 * @param {Array<number>} vecB 
 * @returns {number} - The calculated score.
 */
export function calculateSuitability(vecA, vecB) {
    let score = 0;

    // Category & SubCategory: Standard Dot Product (Reward Similarity)
    const techStart = INDEX_OFFSETS.TECH_STACK;

    for (let i = 0; i < techStart; i++) {
        // If both have values (e.g. 25 and 25), we add 25 (or product?). 
        // Example used product in cosine, but for raw score, let's just add the weight if both match.
        // If we use product: 25*25 = 625. That's huge.
        // Let's normalize or just check for match.
        // Since vector has weights, if vecA[i] > 0 and vecB[i] > 0, it's a match.
        if (vecA[i] > 0 && vecB[i] > 0) {
            score += vecA[i]; // Add the weight once (e.g. +25)
        }
    }

    // Tech Stack: Reward Difference
    // Iterate through tech stack part
    for (let i = techStart; i < vecA.length; i++) {
        const hasA = vecA[i] > 0;
        const hasB = vecB[i] > 0;

        // If one has it and the other doesn't, it's a "difference" -> Add weight
        if (hasA !== hasB) {
            score += WEIGHTS.TECH_STACK;
        }
        // If both have it (Same), we do nothing (or penalize? Prompt says "Different -> Higher", implies Same -> Lower or 0)
    }

    return score;
}

/**
 * Finds the best matches for a target user.
 * Sorting Criteria:
 * 1. Region Match (Priority)
 * 2. Suitability Score (High to Low)
 * @param {Object} targetUser 
 * @param {Array<Object>} allUsers 
 * @returns {Array<Object>} - Sorted list of matches with score.
 */
export function findBestMatch(targetUser, allUsers) {
    const targetVector = userToVector(targetUser);

    const results = allUsers
        .filter(user => user.id !== targetUser.id)
        .map(user => {
            const userVector = userToVector(user);
            const score = calculateSuitability(targetVector, userVector);
            const isRegionSame = user.region === targetUser.region;

            return {
                ...user,
                score: score,
                isRegionSame: isRegionSame,
                matchDetails: {
                    regionMatch: isRegionSame,
                    score: score
                }
            };
        });

    // Sort
    return results.sort((a, b) => {
        // 1. Region Priority
        if (a.isRegionSame && !b.isRegionSame) return -1;
        if (!a.isRegionSame && b.isRegionSame) return 1;

        // 2. Score Priority
        return b.score - a.score;
    });
}
