import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { doc, updateDoc, increment, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const REPUTATION_KEYWORDS = [
    '실력이 좋아요',
    '매너가 좋아요',
    '약속을 잘 지켜요',
    '싫어요'
];

const ReputationModal = ({ isOpen, onClose, targetUser, currentUser, onComplete }) => {
    const [score, setScore] = useState(0);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state when targetUser changes
    React.useEffect(() => {
        setScore(0);
        setSelectedKeywords([]);
        setIsSubmitting(false);
    }, [targetUser]);

    if (!isOpen || !targetUser) return null;

    const handleKeywordToggle = (keyword) => {
        if (selectedKeywords.includes(keyword)) {
            setSelectedKeywords(prev => prev.filter(k => k !== keyword));
        } else {
            setSelectedKeywords(prev => [...prev, keyword]);
        }
    };

    const handleSubmit = async () => {
        if (score === 0 && selectedKeywords.length === 0) {
            alert('평가 내용을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const userRef = doc(db, 'users', targetUser.id);

            // 1. Update Reputation Score
            const updates = {
                reputation: increment(score)
            };

            // 2. Update Keywords (using a map/object structure in Firestore)
            // Firestore doesn't support incrementing map keys easily without knowing the key in advance in a single update call if the map field itself is the target.
            // But we can use dot notation for nested fields if we know they exist, or we have to read-modify-write for safety or use a subcollection.
            // For simplicity in this prototype, let's read-modify-write or assume a 'reputationKeywords' map field exists.
            // Actually, `increment` works on nested fields too: "reputationKeywords.keyword": increment(1)

            selectedKeywords.forEach(keyword => {
                updates[`reputationKeywords.${keyword}`] = increment(1);
            });

            // Also record that currentUser evaluated targetUser to prevent double voting (optional for this demo but good practice)
            // We'll skip that check for the hardcoded demo to allow repeated testing.

            await updateDoc(userRef, updates);

            onComplete();
            onClose();
        } catch (error) {
            console.error("Error submitting reputation:", error);
            alert("평가 제출 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">팀원 평가</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                <span className="font-semibold text-indigo-600">{targetUser.name}</span>님과 함께한 경험은 어떠셨나요?
                            </p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Score Section */}
                    <div className="mb-8 text-center">
                        <p className="text-sm font-medium text-gray-700 mb-4">평판 점수</p>
                        <div className="flex items-center justify-center gap-6">
                            <button
                                onClick={() => setScore(-1)}
                                className={`p-4 rounded-full transition-all ${score === -1
                                    ? 'bg-red-100 text-red-600 ring-2 ring-red-500 ring-offset-2'
                                    : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
                                    }`}
                            >
                                <ThumbsDown className="w-8 h-8" />
                            </button>
                            <span className={`text-2xl font-bold w-12 text-center ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-400'
                                }`}>
                                {score > 0 ? '+1' : score < 0 ? '-1' : '0'}
                            </span>
                            <button
                                onClick={() => setScore(1)}
                                className={`p-4 rounded-full transition-all ${score === 1
                                    ? 'bg-green-100 text-green-600 ring-2 ring-green-500 ring-offset-2'
                                    : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500'
                                    }`}
                            >
                                <ThumbsUp className="w-8 h-8" />
                            </button>
                        </div>
                    </div>

                    {/* Keywords Section */}
                    <div className="mb-8">
                        <p className="text-sm font-medium text-gray-700 mb-3">키워드 선택 (중복 가능)</p>
                        <div className="grid grid-cols-2 gap-3">
                            {REPUTATION_KEYWORDS.map(keyword => (
                                <button
                                    key={keyword}
                                    onClick={() => handleKeywordToggle(keyword)}
                                    className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${selectedKeywords.includes(keyword)
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-500'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                        } flex justify-between items-center`}
                                >
                                    {keyword}
                                    {selectedKeywords.includes(keyword) && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                    >
                        {isSubmitting ? '제출 중...' : '평가 제출하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReputationModal;
