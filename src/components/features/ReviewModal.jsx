import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { EVALUATION_CRITERIA } from '../../utils/domainData';
import { doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';

const ReviewModal = ({ isOpen, onClose, teamMembers, currentUser, onSubmit }) => {
    const [reviews, setReviews] = useState({}); // { userId: { positive: [], negative: [], runaway: false } }
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleToggleCriteria = (userId, type, criteriaId) => {
        setReviews(prev => {
            const userReview = prev[userId] || { positive: [], negative: [], runaway: false };
            const list = userReview[type];
            const newList = list.includes(criteriaId)
                ? list.filter(id => id !== criteriaId)
                : [...list, criteriaId];

            return {
                ...prev,
                [userId]: { ...userReview, [type]: newList }
            };
        });
    };

    const handleToggleRunaway = (userId) => {
        setReviews(prev => {
            const userReview = prev[userId] || { positive: [], negative: [], runaway: false };
            return {
                ...prev,
                [userId]: { ...userReview, runaway: !userReview.runaway }
            };
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const promises = Object.entries(reviews).map(async ([userId, review]) => {
                let scoreChange = 0;
                const titles = [];

                // Calculate score
                review.positive.forEach(pid => {
                    const criteria = EVALUATION_CRITERIA.POSITIVE.find(c => c.id === pid);
                    if (criteria) scoreChange += criteria.score;
                });
                review.negative.forEach(nid => {
                    const criteria = EVALUATION_CRITERIA.NEGATIVE.find(c => c.id === nid);
                    if (criteria) scoreChange += criteria.score;
                });

                if (review.runaway) {
                    const criteria = EVALUATION_CRITERIA.RUNAWAY;
                    scoreChange += criteria.score;
                    titles.push(criteria.title);
                }

                // Update user document
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    reputation: increment(scoreChange),
                    // Optionally add titles or history
                });
            });

            await Promise.all(promises);
            alert('평가가 완료되었습니다.');
            onSubmit();
            onClose();
        } catch (error) {
            console.error("Error submitting reviews:", error);
            alert("평가 제출 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    // Filter out current user
    const targets = teamMembers.filter(m => m.uid !== currentUser.uid);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">팀원 평가</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <p className="text-gray-600 mb-6">
                    함께 고생한 팀원들을 평가해주세요. 평가는 익명으로 진행되며, 상대방의 평판에 반영됩니다.
                </p>

                <div className="space-y-8">
                    {targets.map(member => (
                        <div key={member.uid} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {member.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{member.name}</h4>
                                    <p className="text-xs text-gray-500">{member.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Positive */}
                                <div>
                                    <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                                        <ThumbsUp className="w-4 h-4 mr-1" /> 칭찬해요
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {EVALUATION_CRITERIA.POSITIVE.map(criteria => (
                                            <button
                                                key={criteria.id}
                                                onClick={() => handleToggleCriteria(member.uid, 'positive', criteria.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${reviews[member.uid]?.positive?.includes(criteria.id)
                                                        ? 'bg-green-100 border-green-300 text-green-800'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {criteria.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Negative */}
                                <div>
                                    <h5 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                                        <ThumbsDown className="w-4 h-4 mr-1" /> 아쉬워요
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {EVALUATION_CRITERIA.NEGATIVE.map(criteria => (
                                            <button
                                                key={criteria.id}
                                                onClick={() => handleToggleCriteria(member.uid, 'negative', criteria.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${reviews[member.uid]?.negative?.includes(criteria.id)
                                                        ? 'bg-red-100 border-red-300 text-red-800'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {criteria.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Runaway */}
                                <div className="pt-4 border-t border-gray-200">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={reviews[member.uid]?.runaway || false}
                                            onChange={() => handleToggleRunaway(member.uid)}
                                            className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                        />
                                        <span className="text-sm font-medium text-red-600 flex items-center">
                                            <AlertTriangle className="w-4 h-4 mr-1" /> 중도 탈주 (심각한 패널티가 부여됩니다)
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium disabled:bg-gray-400"
                    >
                        {submitting ? '제출 중...' : '평가 제출하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
