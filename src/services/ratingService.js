import { doc, runTransaction, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Updates a user's rating based on a new review.
 * 
 * Logic:
 * 1. Accumulate the raw score (internalRating).
 * 2. Normalize using the user-defined formula:
 *    normalized = tanh(internal * |internal| / 40) / 1.5
 *    - This creates a specific curve for rating progression.
 */
export const updateUserRating = async (targetUserId, score, comment, reviewerId) => {
    try {
        await runTransaction(db, async (transaction) => {
            const userRef = doc(db, "users", targetUserId);
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists()) {
                throw "User does not exist!";
            }

            const userData = userDoc.data();
            const currentInternalRating = userData.internalRating || 0;
            const currentCount = userData.ratingCount || 0;

            // 1. Update Internal Rating (Raw Score)
            const newInternalRating = currentInternalRating + score;
            const newCount = currentCount + 1;

            // 2. Calculate Normalized Rating (0-100 scale based on formula)
            // normalized = tanh(internal * |internal| / 40) / 1.5
            let normalized = Math.tanh((newInternalRating * Math.abs(newInternalRating)) / 40) / 1.5;

            // Clamp to -1..1 range just in case, though tanh is already -1..1
            // The division by 1.5 keeps it within -0.66..0.66 roughly, 
            // but we map it to 0-100 assuming the effective range is what we want.
            // Let's map -1..1 to 0..100 for the final display.
            const ratingAverage = Math.round(((normalized + 1) / 2) * 100);

            transaction.update(userRef, {
                internalRating: newInternalRating,
                ratingCount: newCount,
                ratingAverage: ratingAverage
            });

            // Add review
            const reviewRef = doc(collection(db, "users", targetUserId, "reviews"));
            transaction.set(reviewRef, {
                reviewerId: reviewerId,
                score: score,
                comment: comment,
                createdAt: serverTimestamp()
            });
        });
    } catch (error) {
        console.error("Error updating user rating:", error);
        throw error;
    }
};

/**
 * Helper to get color for a rating score (0-100)
 * @param {number} score 
 * @returns {string} Tailwind color class
 */
export const getRatingColor = (score) => {
    if (score >= 80) return "text-blue-600";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-yellow-500";
    if (score >= 20) return "text-orange-500";
    return "text-red-500";
};
