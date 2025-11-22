import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import TeamRecruitCard from '../components/features/TeamRecruitCard';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const TeamListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const applyTeamId = searchParams.get('applyTeam');

    // Fetch teams from Firebase
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'teams'));
                const teamsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Sort by createdAt in JavaScript instead of Firestore
                teamsData.sort((a, b) => {
                    const aTime = a.createdAt?.seconds || 0;
                    const bTime = b.createdAt?.seconds || 0;
                    return bTime - aTime;
                });
                setTeams(teamsData);
            } catch (error) {
                console.error('Error fetching teams:', error);
                setTeams([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const filteredTeams = teams.filter(team => {
        const matchesSearch =
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (team.rolesNeeded && team.rolesNeeded.some(role => role.toLowerCase().includes(searchTerm.toLowerCase())));

        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">팀 찾기</h1>
                        <p className="mt-2 text-gray-600">프로젝트를 함께할 팀을 찾아보세요.</p>
                    </div>
                    <Link
                        to="/teams/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        팀 만들기
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="팀 이름, 설명, 필요 역할로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Teams Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">로딩 중...</p>
                    </div>
                ) : filteredTeams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTeams.map(team => (
                            <TeamRecruitCard
                                key={team.id}
                                team={team}
                                defaultOpenApply={team.id === applyTeamId}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {searchTerm ? '검색 결과가 없습니다.' : '아직 생성된 팀이 없습니다.'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                검색 초기화
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamListPage;
