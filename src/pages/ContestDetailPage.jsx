import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Trophy, ExternalLink, Share2, Flag } from 'lucide-react';
import { contests } from '../data/contests';
import { useAuth } from '../context/AuthContext';

const ContestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const contest = contests.find(c => c.id === parseInt(id));
    const [activeTab, setActiveTab] = useState('overview');

    const handleFindTeammates = (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert('Please log in to find teammates.');
            setTimeout(() => {
                navigate('/login');
            }, 0);
            return;
        }
        navigate(`/teams/new?contestId=${contest.id}`);
    };

    if (!contest) {
        return <div className="text-center py-20">Contest not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/3">
                            <div className="rounded-2xl overflow-hidden shadow-lg">
                                <img src={contest.image} alt={contest.title} className="w-full h-auto" />
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-indigo-600">
                                        {contest.dday}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                        {contest.category}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{contest.title}</h1>
                                <p className="text-lg text-gray-600 mb-6">{contest.description}</p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Host</div>
                                        <div className="font-medium text-gray-900">{contest.host}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Period</div>
                                        <div className="font-medium text-gray-900">{contest.period}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Target</div>
                                        <div className="font-medium text-gray-900">{contest.target}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Status</div>
                                        <div className="font-medium text-indigo-600">{contest.status}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={handleFindTeammates}
                                    className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                                >
                                    <Users className="w-5 h-5 mr-2" />
                                    Find Teammates
                                </button>
                                <a
                                    href={contest.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all"
                                >
                                    <ExternalLink className="w-5 h-5 mr-2" />
                                    Official Site
                                </a>
                                <button className="p-3 border border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex space-x-8 border-b border-gray-200 mb-8">
                    {['overview', 'teams', 'participants'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-medium capitalize transition-colors relative ${activeTab === tab
                                ? 'text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
                    {activeTab === 'overview' && (
                        <div className="prose max-w-none">
                            <h3>Detailed Information</h3>
                            <div className="whitespace-pre-wrap text-gray-600 leading-relaxed">
                                {contest.details || "No detailed information available."}
                            </div>
                            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                                <h4 className="flex items-center text-gray-900 font-bold mb-4">
                                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                                    Awards & Prizes
                                </h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li>Grand Prize: {contest.prize}</li>
                                    <li>Total Prize Pool: {contest.prize}</li>
                                </ul>
                            </div>
                        </div>
                    )}
                    {activeTab === 'teams' && (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No teams yet</h3>
                            <p className="text-gray-500 mb-6">Be the first to create a team for this contest!</p>
                            <Link
                                to={`/teams/new?contestId=${contest.id}`}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Create Team
                            </Link>
                        </div>
                    )}
                    {activeTab === 'participants' && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                                <Users className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Looking for participants?</h3>
                            <p className="text-gray-500">Join a team or create one to start collaborating.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContestDetailPage;
