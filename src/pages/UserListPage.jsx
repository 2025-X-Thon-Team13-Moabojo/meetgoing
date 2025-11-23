import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Sparkles } from 'lucide-react';
import UserCard from '../components/features/UserCard';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { jobCategories } from '../data/jobCategories';
import { users as dummyUsers } from '../data/users';
import { useAuth } from '../context/AuthContext';

const UserListPage = () => {
    const { user: currentUser, isLoading } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTech, setSelectedTech] = useState('');
    const [users, setUsers] = useState([]);
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 0. Priority: Check Authentication
    useEffect(() => {
        if (!isLoading && !currentUser) {
            navigate('/login');
        }
    }, [currentUser, isLoading, navigate]);

    // Fetch users from Firebase
    useEffect(() => {
        if (!currentUser) return; // Don't fetch if not logged in

        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                let usersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Combine Firestore users and dummy users
                // Ensure no duplicates by ID (handle string vs number IDs)
                const combinedUsers = [...usersData, ...dummyUsers.filter(d => !usersData.some(u => String(u.id) === String(d.id)))];

                // If current user is logged in and has profile data, use matching system
                if (currentUser && (currentUser.category || currentUser.categories)) {
                    const { findBestMatch } = await import('../utils/matchingSystem');
                    // Get all matches sorted by score
                    const allMatches = findBestMatch(currentUser, combinedUsers);

                    // Set main list (can be same as allMatches or just raw data, but let's keep it sorted)
                    setUsers(allMatches);

                    // Extract top recommendations (score > 60)
                    const recommendations = allMatches
                        .filter(u => u.score >= 60)
                        .slice(0, 4);
                    setRecommendedUsers(recommendations);
                } else {
                    // Default sort by createdAt (mock users might not have it, so handle gracefully)
                    combinedUsers.sort((a, b) => {
                        const aTime = a.createdAt?.seconds || 0;
                        const bTime = b.createdAt?.seconds || 0;
                        return bTime - aTime;
                    });
                    setUsers(combinedUsers);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentUser]); // Add currentUser as dependency

    // Extract all unique tech stacks for filter
    const allTechStacks = Array.from(
        new Set((users || []).flatMap(user => user.techStack || []))
    ).sort();

    const filteredUsers = users.filter(user => {
        // Exclude current user from the list
        if (user.id === currentUser.uid) return false;

        const matchesSearch =
            (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.roles && user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase())));

        // Logic:
        // 1. If selectedCategory is set -> Show users in that category.
        // 2. If selectedCategory is NOT set -> Show users in MY category (default).
        let matchesCategory = true;
        if (selectedCategory) {
            matchesCategory = user.categories && user.categories.includes(selectedCategory);
        } else {
            // Default: Show all users if no category is selected
            matchesCategory = true;
        }

        const matchesTech = selectedTech ?
            (user.techStack && user.techStack.includes(selectedTech)) : true;

        return matchesSearch && matchesCategory && matchesTech;
    });



    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">팀원 찾기</h1>
                        <p className="mt-2 text-gray-600">프로젝트를 함께할 팀원을 찾아보세요.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="이름, 역할, 소개로 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">전체 카테고리</option>
                                {jobCategories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
                                value={selectedTech}
                                onChange={(e) => setSelectedTech(e.target.value)}
                            >
                                <option value="">전체 기술 스택</option>
                                {allTechStacks.map((tech, index) => (
                                    <option key={index} value={tech}>{tech}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations */}
                {currentUser && recommendedUsers.length > 0 && !searchTerm && !selectedCategory && !selectedTech && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-6 h-6 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                {currentUser.name}님을 위한 AI 맞춤 추천 팀원
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedUsers.map(user => (
                                <div key={`rec-${user.id}`} className="relative">
                                    <div className="absolute -top-3 -right-3 z-10 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        AI 추천
                                    </div>
                                    <UserCard user={user} />
                                </div>
                            ))}
                        </div>
                        <div className="my-8 border-b border-gray-200"></div>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">로딩 중...</p>
                    </div>
                ) : (
                    filteredUsers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUsers.map(user => (
                                <UserCard key={user.id} user={user} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchTerm || selectedCategory || selectedTech
                                    ? '조건에 맞는 사용자가 없습니다.'
                                    : '등록된 사용자가 없습니다.'}
                            </p>
                            {(searchTerm || selectedCategory || selectedTech) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('');
                                        setSelectedTech('');
                                    }}
                                    className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    필터 초기화
                                </button>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default UserListPage;
