import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Eye } from 'lucide-react';

const ContestCard = ({ contest }) => {
    return (
        <Link to={`/contests/${contest.id}`} className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={contest.image}
                    alt={contest.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${contest.dday === 'D-0' ? 'bg-red-500' : 'bg-indigo-600'
                        }`}>
                        {contest.dday}
                    </span>
                </div>
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
                        {contest.category}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {contest.title}
                    </h3>
                    <p className="text-sm text-gray-500">{contest.host}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-50">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            <span>{contest.period}</span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1.5" />
                        <span>{contest.views}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ContestCard;
