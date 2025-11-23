import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updateUserRating } from '../../services/ratingService';
import { useAuth } from '../../context/AuthContext';

const RatingModal = ({ isOpen, onClose, targetUser, onRateSuccess, currentUser }) => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [selectedScore, setSelectedScore] = useState(null);

    if (!isOpen) return null;

    const handleRate = async () => {
        if (loading || selectedScore === null) return;

        if (!confirm(`${targetUser.name}님을 평가하시겠습니까?`)) return;

        setLoading(true);
        try {
            // Pass comment to the service
            await updateUserRating(targetUser.id, selectedScore, comment, currentUser?.uid);
            alert('평가가 반영되었습니다!');
            onRateSuccess();
            onClose();
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('평가 제출 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const ratingOptions = [
        { score: -2, label: '매우 별로', color: 'bg-red-100 text-red-700', activeColor: 'ring-2 ring-red-500 bg-red-200', icon: '😫' },
        { score: -1, label: '별로', color: 'bg-orange-50 text-orange-600', activeColor: 'ring-2 ring-orange-500 bg-orange-100', icon: '😕' },
        { score: 0, label: '보통', color: 'bg-gray-100 text-gray-600', activeColor: 'ring-2 ring-gray-500 bg-gray-200', icon: '😐' },
        { score: 1, label: '좋음', color: 'bg-blue-50 text-blue-600', activeColor: 'ring-2 ring-blue-500 bg-blue-100', icon: '🙂' },
        { score: 2, label: '매우 좋음', color: 'bg-blue-100 text-blue-700', activeColor: 'ring-2 ring-blue-500 bg-blue-200', icon: '😍' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {targetUser.name}님 평가하기
                    </h3>
                    <p className="text-sm text-gray-500">
                        대화가 어떠셨나요? 솔직한 평가는<br />건전한 커뮤니티를 만드는데 도움이 됩니다.
                    </p>
                </div>

                {/* Horizontal Rating Selection */}
                <div className="flex justify-between gap-2 mb-6">
                    {ratingOptions.map((option) => (
                        <button
                            key={option.score}
                            onClick={() => setSelectedScore(option.score)}
                            disabled={loading}
                            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl transition-all ${selectedScore === option.score ? option.activeColor : option.color
                                } hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <span className="text-2xl mb-1">{option.icon}</span>
                            <span className="text-xs font-bold">{option.label}</span>
                        </button>
                    ))}
                </div>

                {/* Comment Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        의견 남기기 (선택)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="매너있는 피드백을 남겨주세요."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none text-sm"
                        rows="3"
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleRate}
                    disabled={loading || selectedScore === null}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {loading ? '제출 중...' : '평가 제출하기'}
                </button>
            </div>
        </div>
    );
};

export default RatingModal;
