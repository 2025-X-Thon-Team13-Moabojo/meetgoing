import React, { useState } from 'react';
import { Users, MapPin, Code, Briefcase, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrCreateConversation } from '../../utils/messageService';

const TeamRecruitCard = ({ team }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (user.uid === team.creatorId) {
            alert('자신에게는 메시지를 보낼 수 없습니다.');
            return;
        }

        setLoading(true);
        try {
            const conversation = await getOrCreateConversation(
                user.uid,
                { name: user.name || user.displayName, avatar: user.avatar },
                team.creatorId,
                { name: team.creatorName, avatar: team.creatorAvatar || '' }
            );

            // Navigate to chat page with conversation
            navigate(`/chat?conversationId=${conversation.id}`);
        } catch (error) {
            console.error('Error starting conversation:', error);
            alert('메시지를 보내는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
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
                onClick={handleSendMessage}
                disabled={loading}
                className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <MessageCircle className="w-4 h-4" />
                {loading ? '로딩 중...' :
                    user && user.uid === team.creatorId ? '현황 확인' : '메시지 보내기'}
            </button>
        </div>
    );
};


