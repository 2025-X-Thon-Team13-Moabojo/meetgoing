import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { getCategoryLabels, assignContestCategory } from '../constants/contestCategories';
import { useAuth } from '../context/AuthContext';

const ContestListPage = () => {
    const { user } = useAuth();
    const [contests, setContests] = useState([]);
    const [filteredContests, setFilteredContests] = useState([]);
    const [recommendedContests, setRecommendedContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const q = query(collection(db, 'contests'), orderBy('scrapedAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const contestList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        // Auto-assign smart category if not already assigned
                        smartCategory: assignContestCategory(data.title, data.category)
                    };
                });
                setContests(contestList);
                setFilteredContests(contestList);

                // AI Recommendation Logic
                if (user) {
                    const userCategories = user.categories || [];
                    const userInterests = (user.interests || []).map(i => i.toLowerCase());
                    const userTechStack = (user.techStack || []).map(t => t.toLowerCase());

                    const scoredContests = contestList.map(contest => {
                        let score = 0;
                        const titleLower = contest.title.toLowerCase();
                        const categoryLower = contest.category ? contest.category.toLowerCase() : '';
                        const smartCategory = contest.smartCategory;

                        // 1. Category Match (+10)
                        if (userCategories.includes(smartCategory)) {
                            score += 10;
                        }

                        // 2. Interest Match (+5)
                        userInterests.forEach(interest => {
                            if (titleLower.includes(interest) || categoryLower.includes(interest)) {
                                score += 5;
                            }
                        });

                        // 3. Tech Stack Match (+5)
                        userTechStack.forEach(tech => {
                            if (titleLower.includes(tech)) {
                                score += 5;
                            }
                        });

                        return { ...contest, score };
                    });

                    // Filter contests with score > 0 and sort by score
                    const recommendations = scoredContests
                        .filter(c => c.score > 0)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 5); // Top 5

                    setRecommendedContests(recommendations);
                }

            } catch (error) {
                console.error("Error fetching contests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
    }, [user]);

    useEffect(() => {
        let filtered = contests;

        if (searchName) {
            filtered = filtered.filter(contest =>
                contest.title?.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        if (searchCategory) {
            filtered = filtered.filter(contest =>
                contest.smartCategory === searchCategory
            );
        }

        setFilteredContests(filtered);
    }, [searchName, searchCategory, contests]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">공모전 리스트</h1>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="공모전 이름으로 검색..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="">모든 카테고리</option>
                            {getCategoryLabels().map((label) => (
                                <option key={label} value={label}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    총 {filteredContests.length}개의 공모전
                </p>
            </div>

            {/* AI Recommendations */}
            {user && recommendedContests.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-bold text-gray-900">
                            {user.name}님을 위한 AI 맞춤 추천 공모전
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {recommendedContests.map((contest) => (
                            <div
                                key={`rec-${contest.id}`}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 border-indigo-100 transform hover:-translate-y-1"
                                onClick={() => navigate(`/contests/${contest.id}`)}
                            >
                                <div className="relative w-full pt-[141.4%] bg-gray-200">
                                    {contest.posterUrl ? (
                                        <img
                                            src={contest.posterUrl}
                                            alt={contest.title}
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute top-1 right-1 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                        추천
                                    </div>
                                </div>
                                <div className="p-3">
                                    <div className="text-xs text-indigo-600 font-semibold mb-1 truncate">{contest.category}</div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{contest.title}</h3>
                                    <div className="text-xs text-gray-500">
                                        {contest.dDay}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contest Grid - Smaller Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredContests.map((contest) => (
                    <div
                        key={contest.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                        onClick={() => navigate(`/contests/${contest.id}`)}
                    >
                        <div className="relative w-full pt-[141.4%] bg-gray-200">
                            {contest.posterUrl ? (
                                <img
                                    src={contest.posterUrl}
                                    alt={contest.title}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                    No Image
                                </div>
                            )}
                            <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                {contest.dDay}
                            </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                            <div className="text-xs text-blue-600 font-semibold mb-1 truncate">{contest.category}</div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{contest.title}</h3>
                            <div className="mt-auto text-xs text-gray-600">
                                <p className="truncate">{contest.host}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContestListPage;
