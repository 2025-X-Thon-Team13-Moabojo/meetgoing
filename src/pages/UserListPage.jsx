import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import TeamRecruitCard from '../components/features/TeamRecruitCard';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

const UserListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTech, setSelectedTech] = useState('');
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch teams from Firebase
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const q = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const teamsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTeams(teamsData);
            } catch (error) {
                console.error('Error fetching teams:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    // Extract all unique tech stacks for filter
    const allTechStacks = Array.from(
        new Set(teams.flatMap(team => team.techStack || []))
    ).sort();

    const filteredTeams = teams.filter(team => {
        const matchesSearch =
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (team.rolesNeeded && team.rolesNeeded.some(role => role.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesTech = selectedTech ?
            (team.techStack && team.techStack.includes(selectedTech)) : true;

        return matchesSearch && matchesTech;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">팀원 찾기</h1>
                        <p className="mt-2 text-gray-600">프로젝트를 함께할 팀을 찾아보세요.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="팀명, 설명, 역할로 검색..."
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

                {/* Content */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">로딩 중...</p>
                    </div>
                ) : (
                    filteredTeams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTeams.map(team => (
                                <TeamRecruitCard key={team.id} team={team} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">모집 중인 팀이 없습니다.</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedTech('');
                                }}
                                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                필터 초기화
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default UserListPage;
