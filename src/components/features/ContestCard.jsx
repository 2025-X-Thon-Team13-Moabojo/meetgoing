import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy } from 'lucide-react';

const ContestCard = ({ contest }) => {
    return (
        <Link to={`/contests/${contest.id}`} className="group block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            {/* Image & Badges */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                    src={contest.image}
                    alt={contest.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
                        {contest.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${contest.dday === 'D-0' ? 'bg-red-600' : 'bg-red-500'
                        }`}>
                        {contest.dday}
                    </span>
                </div>
            </div>

            <div className="p-6">
                {/* Title & Subtitle */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
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
                    {contest.tags && contest.tags.slice(0, 3).map((tag, index) => (
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
                        <span className="text-gray-900 font-semibold pl-6 truncate max-w-[80px]">{contest.prize}</span>
                    </div>
                    <div className="flex flex-col space-y-1 text-right">
                        <div className="flex items-center justify-end text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>마감일</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{contest.deadline}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ContestCard;
