<<<<<<< HEAD
import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { users } from '../data/users';
import { jobCategories } from '../data/jobCategories';
import UserCard from '../components/features/UserCard';

const UserListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTech, setSelectedTech] = useState('');

    // Extract all unique tech stacks for filter
    const allTechStacks = Array.from(new Set(users.flatMap(user => user.techStack))).sort();

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? user.category === selectedCategory : true;
        const matchesTech = selectedTech ? user.techStack.includes(selectedTech) : true;
=======
import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import UserCard from '../components/features/UserCard';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { jobCategories } from '../data/jobCategories';
import { useAuth } from '../context/AuthContext';

const UserListPage = () => {
    const { user: currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTech, setSelectedTech] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch users from Firebase
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Sort by createdAt in JavaScript instead of Firestore
                usersData.sort((a, b) => {
                    const aTime = a.createdAt?.seconds || 0;
                    const bTime = b.createdAt?.seconds || 0;
                    return bTime - aTime;
                });
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Extract all unique tech stacks for filter
    const allTechStacks = Array.from(
        new Set(users.flatMap(user => user.techStack || []))
    ).sort();

    const filteredUsers = users.filter(user => {
        // Exclude current user from the list
        if (user.id === currentUser.uid) return false;

        const matchesSearch =
            (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.roles && user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesCategory = selectedCategory ?
            (user.categories && user.categories.includes(selectedCategory)) : true;

        const matchesTech = selectedTech ?
            (user.techStack && user.techStack.includes(selectedTech)) : true;
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a

        return matchesSearch && matchesCategory && matchesTech;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">팀원 찾기</h1>
                        <p className="mt-2 text-gray-600">프로젝트를 함께할 팀원을 찾아보세요.</p>
                    </div>
<<<<<<< HEAD
                    <div className="mt-4 md:mt-0">
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            상세 필터
                        </button>
                    </div>
=======
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
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

<<<<<<< HEAD
                {/* User Grid */}
                {filteredUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map(user => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">조건에 맞는 사용자가 없습니다.</p>
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
                    </div>
=======
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
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
                )}
            </div>
        </div>
    );
};

export default UserListPage;
