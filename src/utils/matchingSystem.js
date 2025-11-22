// Domain data imports removed as they are not currently used in this utility
// import { CATEGORIES, SUBCATEGORIES, TECH_STACKS } from './domainData.js';

// Helper: Data Normalization
const getList = (val) => Array.isArray(val) ? val : (val ? [val] : []);

/**
 * Calculates the suitability score between two users.
 * Logic:
 * - Filter: Must be in the same Category.
 * - SubCategory: Match/Overlap -> Bonus.
 * - Tech Stack: Different -> Bonus, Same -> Penalty.
 * - Normalization: -100 to 100.
 * @param {Object} userA - The target user (current user).
 * @param {Object} userB - The candidate user.
 * @returns {number} - The normalized score (0 to 100).
 */
export function calculateSuitability(userA, userB) {
    const catsA = getList(userA.category || userA.categories);
    const catsB = getList(userB.category || userB.categories);

    const subCatsA = getList(userA.subCategory || userA.subCategories);
    const subCatsB = getList(userB.subCategory || userB.subCategories);

    // 1. Main Category Match (Fixed 40 points)
    const hasCategoryMatch = catsA.some(c => catsB.includes(c));
    if (!hasCategoryMatch) return 0; // No match -> 0 score

    const scoreCategory = 40;

    // 2. Sub Category Match (Variable up to 30 points) - Similarity is better
    // Using Jaccard Index (Intersection / Union)
    const subIntersection = subCatsA.filter(s => subCatsB.includes(s));
    const subUnion = new Set([...subCatsA, ...subCatsB]);

    let scoreSub = 0;
    if (subUnion.size > 0) {
        const matchRatio = subIntersection.length / subUnion.size;
        scoreSub = matchRatio * 30;
    }

    // 3. Tech Stack Match (Variable up to 30 points) - Difference is better
    // Using Jaccard Distance (1 - Jaccard Index)
    const techA = getList(userA.techStack);
    const techB = getList(userB.techStack);

    const techIntersection = techA.filter(t => techB.includes(t));
    const techUnion = new Set([...techA, ...techB]);

    let scoreTech = 0;
    if (techUnion.size > 0) {
        const similarityRatio = techIntersection.length / techUnion.size;
        // We want difference, so 1 - similarity
        scoreTech = (1 - similarityRatio) * 30;
    } else {
        scoreTech = 0;
    }

    // 4. Total Score (0 - 100)
    return Math.round(scoreCategory + scoreSub + scoreTech);
}

/**
 * Finds the best matches for a target user.
 * @param {Object} targetUser 
 * @param {Array<Object>} allUsers 
 * @returns {Array<Object>} - Sorted list of matches with score.
 */
export function findBestMatch(targetUser, allUsers) {
    const targetCats = getList(targetUser.category || targetUser.categories);

    const results = allUsers
        .filter(user => user.id !== targetUser.id) // Exclude self
        .filter(user => {
            // Filter by Same Main Category
            const userCats = getList(user.category || user.categories);
            return targetCats.some(c => userCats.includes(c));
        })
        .map(user => {
            const score = calculateSuitability(targetUser, user);
            return {
                ...user,
                score: score
            };
        });

    // Sort by Score (High to Low)
    return results.sort((a, b) => b.score - a.score);
}
