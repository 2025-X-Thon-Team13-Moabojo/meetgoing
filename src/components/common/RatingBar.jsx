import React from 'react';

const RatingBar = ({ score = 50, size = 'md', showLabel = true }) => {
    // Clamp score between 0 and 100
    const clampedScore = Math.min(100, Math.max(0, score));

    // Determine color based on score
    const getColor = (s) => {
        if (s >= 80) return 'bg-blue-500';
        if (s >= 60) return 'bg-blue-400';
        if (s >= 40) return 'bg-yellow-400';
        if (s >= 20) return 'bg-orange-400';
        return 'bg-red-500';
    };

    const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
    const textSizeClass = size === 'sm' ? 'text-xs' : 'text-sm';

    return (
        <div className="w-full">
            {showLabel && (
                <div className={`flex justify-between items-center mb-1 ${textSizeClass}`}>
                    <span className="text-gray-600 font-medium">매너 점수</span>
                    <span className="font-bold text-gray-900">{clampedScore}점</span>
                </div>
            )}
            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClass}`}>
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${getColor(clampedScore)}`}
                    style={{ width: `${clampedScore}%` }}
                />
            </div>
        </div>
    );
};

export default RatingBar;
