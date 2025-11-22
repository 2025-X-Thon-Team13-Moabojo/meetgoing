import React, { useState } from 'react';
import { Users, MapPin, Code, Briefcase, MessageCircle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrCreateConversation, sendMessage } from '../../utils/messageService';

const TeamRecruitCard = ({ team, defaultOpenApply = false }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(defaultOpenApply);
    const [selectedRole, setSelectedRole] = useState('');
    const [applyMessage, setApplyMessage] = useState('');

    const handleButtonClick = () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        // If the logged-in user is the team creator, show status
        if (user.uid === team.creatorId) {
            const memberCount = (team.members && Array.isArray(team.members)) ? team.members.length : 0;
            alert(`현황 확인:\n팀 인원: ${memberCount}명`);
            return;
        }

        // Check if already a member
        if (team.members && team.members.includes(user.uid)) {
            alert('이미 이 팀의 멤버입니다.');
            return;
        }

        // Open Apply Modal
        setShowApplyModal(true);
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            alert('역할을 선택해주세요.');
            return;
        }

        setLoading(true);
        try {
            // 1. Get or create conversation
            const userName = user.name || user.displayName || 'Unknown User';
            const userAvatar = user.avatar || '';
            const creatorName = team.creatorName || 'Unknown Leader';
            const creatorAvatar = team.creatorAvatar || '';

            const conversation = await getOrCreateConversation(
                user.uid,
                { name: userName, avatar: userAvatar },
                team.creatorId,
                { name: creatorName, avatar: creatorAvatar }
            );

            // 2. Send application message
            await sendMessage(
                conversation.id,
                user.uid,
                team.creatorId,
                applyMessage || `${selectedRole} 역할에 지원합니다.`,
                'application',
                {
                    role: selectedRole,
                    teamId: team.id,
                    teamName: team.name,
                    status: 'pending'
                }
            );

            alert('지원 메시지를 보냈습니다!');
            setShowApplyModal(false);
            setApplyMessage('');
            setSelectedRole('');
        } catch (error) {
            console.error('Error applying:', error);
            alert(`지원 중 오류가 발생했습니다: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{team.description}</p>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    {/* Roles Needed */}
                    {team.rolesNeeded && team.rolesNeeded.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Briefcase className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">찾는 역할</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {team.rolesNeeded.map((role) => (
                                    <span key={role} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tech Stack */}
                    {team.techStack && team.techStack.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Code className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">기술 스택</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {team.techStack.map((tech) => (
                                    <span key={tech} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Region */}
                    {team.region && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{team.region}</span>
                        </div>
                    )}

                    {/* Creator */}
                    <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                            팀장: <span className="font-medium text-gray-700">{team.creatorName}</span>
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleButtonClick}
                    disabled={loading}
                    className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {user && user.uid === team.creatorId ? (
                        <>
                            <Users className="w-4 h-4" />
                            현황 확인
                        </>
                    ) : (
                        <>
                            <MessageCircle className="w-4 h-4" />
                            지원하기
                        </>
                    )}
                </button>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">팀 지원하기</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            '{team.name}' 팀에 지원합니다. 역할을 선택하고 메시지를 남겨주세요.
                        </p>

                        <form onSubmit={handleApply}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    지원 역할 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {team.rolesNeeded && team.rolesNeeded.map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setSelectedRole(role)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedRole === role
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    메시지 (선택)
                                </label>
                                <textarea
                                    rows={3}
                                    value={applyMessage}
                                    onChange={(e) => setApplyMessage(e.target.value)}
                                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                    placeholder="간단한 자기소개나 각오를 적어주세요."
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowApplyModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !selectedRole}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                                >
                                    {loading ? '전송 중...' : '지원하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeamRecruitCard;


