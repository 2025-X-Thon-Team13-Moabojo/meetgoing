import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Trophy, Briefcase, ArrowRight, CheckCircle, Search } from 'lucide-react';
import ContestCard from '../components/features/ContestCard';
import { contests } from '../data/contests';

const LandingPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/contests?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Hero Section */}
            <div className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.4]"></div>
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 blur-3xl opacity-20">
                        <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Find your perfect <span className="text-indigo-600">hackathon team</span>
                        <br className="hidden sm:block" /> in minutes.
                    </h1>
                    <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 mb-8">
                        Connect with talented developers, designers, and PMs. Build amazing projects and win competitions together.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                        <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search for contests, hackathons, or keywords..."
                                    className="w-full py-3 pl-12 pr-4 text-base bg-white border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 px-4 py-1.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors text-sm"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Popular Contests Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Popular Contests</h2>
                            <p className="mt-4 text-lg text-gray-600">Join the hottest competitions right now</p>
                        </div>
                        <Link to="/contests" className="hidden sm:flex items-center text-indigo-600 font-medium hover:text-indigo-700">
                            View all contests <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {contests.slice(0, 3).map(contest => (
                            <ContestCard key={contest.id} contest={contest} />
                        ))}
                    </div>

                    <div className="mt-12 text-center sm:hidden">
                        <Link to="/contests" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700">
                            View all contests <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
