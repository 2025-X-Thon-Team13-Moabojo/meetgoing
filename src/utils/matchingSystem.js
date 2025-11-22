import { CATEGORIES, SUBCATEGORIES, TECH_STACKS } from './domainData.js';

/**
 * Calculates the suitability score between two users.
 * Logic:
 * - Filter: Must be in the same Category.
 * - SubCategory: Match/Overlap -> Bonus.
 * - Tech Stack: Different -> Bonus, Same -> Penalty.
 * - Normalization: -100 to 100.
 * 
 * @param {Object} userA - The target user (current user).
 * @param {Object} userB - The candidate user.
 * @returns {number} - The normalized score (-100 to 100).
 */
export function calculateSuitability(userA, userB) {
    // 0. Data Normalization (Handle string vs array)
    const getList = (val) => Array.isArray(val) ? val : (val ? [val] : []);

    const catsA = getList(userA.category || userA.categories);
    const catsB = getList(userB.category || userB.categories);

    const subCatsA = getList(userA.subCategory || userA.subCategories);
    const subCatsB = getList(userB.subCategory || userB.subCategories);

    const techA = getList(userA.techStack);
    const techB = getList(userB.techStack);

    // 1. Category Filter (Pre-check, though findBestMatch should handle this)
    // We assume at least one category overlaps
    const hasCategoryMatch = catsA.some(c => catsB.includes(c));
    if (!hasCategoryMatch) return -100;

    // 2. SubCategory Score (More overlap = Higher score)
    // Intersection count
    const subCatMatches = subCatsA.filter(s => subCatsB.includes(s)).length;
    const WEIGHT_SUBCAT = 20;
    const subCatScore = subCatMatches * WEIGHT_SUBCAT;

    // 3. Tech Stack Score
    // Same -> Penalty, Different -> Bonus
    const intersection = techA.filter(t => techB.includes(t));
    const sameCount = intersection.length;

    // Symmetric Difference: (A - B) U (B - A)
    // = (A union B) - (A intersection B)
    // or just count items in A not in B + items in B not in A
    const diffCount = (techA.length - sameCount) + (techB.length - sameCount);

    const WEIGHT_DIFF = 5; // Bonus for difference
    const WEIGHT_SAME = 5; // Penalty for same

    const techScore = (diffCount * WEIGHT_DIFF) - (sameCount * WEIGHT_SAME);

    const rawScore = subCatScore + techScore;

    // 4. Normalization (-100 to 100)
    // Calculate Theoretical Max and Min for this pair's configuration
    // Max: All subcats match (min len), All techs different (sum len)
    const maxSubMatches = Math.min(subCatsA.length, subCatsB.length); // Max possible overlap
    // Actually, user said "more overlap = bonus". 
    // If lists are different lengths, max overlap is min length.

    const maxPossibleScore = (maxSubMatches * WEIGHT_SUBCAT) + ((techA.length + techB.length) * WEIGHT_DIFF);

    // Min: No subcat match, All techs same (min len)
    // If all techs same, diffCount = (lenA-min) + (lenB-min). 
    // Wait, if A=['a'], B=['a'], same=1, diff=0. Score = -5.
    // If A=['a','b'], B=['a'], same=1, diff=1. Score = 5 - 5 = 0.
    // Min score occurs when overlap is maximized (penalty) and difference is minimized.
    // Max overlap is min(lenA, lenB).
    // In that case, sameCount = min(lenA, lenB).
    // diffCount = max(lenA, lenB) - min(lenA, lenB) = abs(lenA - lenB).
    const minTechSameCount = Math.min(techA.length, techB.length);
    const minTechDiffCount = Math.abs(techA.length - techB.length);

    const minPossibleScore = 0 + (minTechDiffCount * WEIGHT_DIFF) - (minTechSameCount * WEIGHT_SAME);

    // Avoid division by zero
    if (maxPossibleScore === minPossibleScore) return 0;

    // Normalize
    let normalized = ((rawScore - minPossibleScore) / (maxPossibleScore - minPossibleScore)) * 200 - 100;

    // Clamp just in case
    return Math.max(-100, Math.min(100, Math.round(normalized)));
}

/**
 * Finds the best matches for a target user.
 * @param {Object} targetUser 
 * @param {Array<Object>} allUsers 
 * @returns {Array<Object>} - Sorted list of matches with score.
 */
export function findBestMatch(targetUser, allUsers) {
    const getList = (val) => Array.isArray(val) ? val : (val ? [val] : []);
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
