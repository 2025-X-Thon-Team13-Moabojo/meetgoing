import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy } from 'lucide-react';

const ContestCard = ({ contest }) => {
    return (
        <Link to={`/contests/${contest.id}`} className="group block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all p-6">
            {/* Top Badges */}
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                    {contest.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${contest.dday === 'D-0' ? 'bg-red-600' : 'bg-red-500'
                    }`}>
                    {contest.dday}
                </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {contest.title}
                </h3>
                <p className="text-sm font-medium text-indigo-600 mb-2">
                    {contest.host}
                </p>
                <p className="text-sm text-gray-500 line-clamp-2">
                    {contest.description}
                </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {contest.tags && contest.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs font-medium border border-gray-200 text-gray-600">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Bottom Info */}
            <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-yellow-600 font-medium">
                        <Trophy className="w-4 h-4 mr-2" />
                        <span>상금</span>
                    </div>
                    <span className="text-gray-900 font-semibold pl-6">{contest.prize}</span>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        <span>참가자</span>
                    </div>
                    <span className="text-gray-900 font-semibold pl-6">{contest.participants}명</span>
                </div>
                <div className="flex flex-col space-y-1 text-right">
                    <div className="flex items-center justify-end text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>마감일</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{contest.deadline}</span>
                </div>
            </div>
        </Link>
    );
};

export default ContestCard;
