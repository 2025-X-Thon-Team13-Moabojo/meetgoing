import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToConversations, sendMessage } from '../utils/messageService';
import ConversationView from '../components/features/ConversationView';
import ReputationModal from '../components/features/ReputationModal';

const ChatPage = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReputationModal, setShowReputationModal] = useState(false);
    const [reputationTarget, setReputationTarget] = useState(null);
    const [demoTeamId, setDemoTeamId] = useState(null);

    // Get conversation ID from URL if exists
    const conversationIdFromUrl = searchParams.get('conversationId');

    // Subscribe to conversations
    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToConversations(user.uid, (updatedConversations) => {
            setConversations(updatedConversations);

            // Auto-select conversation from URL or first conversation
            if (conversationIdFromUrl && !selectedConversation) {
                const conv = updatedConversations.find(c => c.id === conversationIdFromUrl);
                if (conv) setSelectedConversation(conv);
            } else if (updatedConversations.length > 0 && !selectedConversation) {
                setSelectedConversation(updatedConversations[0]);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, conversationIdFromUrl, selectedConversation]);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    };

    const getOtherParticipant = (conversation) => {
        const otherParticipantId = conversation.participants.find(id => id !== user.uid);
        return conversation.participantDetails?.[otherParticipantId] || {};
    };

    const handleInjectDemo = async () => {
        const { injectDemoData } = await import('../utils/demoData');
        const result = await injectDemoData(user?.uid);
        if (result.success) {
            alert('Demo data injected! Check the new group chat.');
            setDemoTeamId(result.teamId);
            // Optionally switch to the new conversation
            if (result.conversationId) {
                const newConv = conversations.find(c => c.id === result.conversationId);
                if (newConv) setSelectedConversation(newConv);
            }
        } else {
            alert('Failed to inject demo data.');
        }
    };

    const handleTriggerContestEnd = async () => {
        if (!selectedConversation || !selectedConversation.isGroup) {
            alert('Please select a group chat first.');
            return;
        }

        // Send system message
        await sendMessage(
            selectedConversation.id,
            'system',
            null,
            '🏆 공모전이 종료되었습니다! 고생한 팀원들을 평가해주세요.',
            'system'
        );

        // Simulate opening the modal for a teammate (not self)
        const teammates = selectedConversation.participants.filter(p => p !== user.uid);
        if (teammates.length > 0) {
            const targetId = teammates[0];
            const targetData = selectedConversation.participantDetails?.[targetId] || { name: 'Teammate', id: targetId };
            setReputationTarget({ id: targetId, ...targetData });
            setShowReputationModal(true);
        }
    };

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)]">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500 text-lg">로그인이 필요합니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)]">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex">
                {/* Conversation List */}
                <div className="w-80 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">메시지</h2>
                        <button
                            onClick={handleInjectDemo}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200"
                        >
                            Demo Data
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">로딩 중...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                대화가 없습니다
                            </div>
                        ) : (
                            conversations.map(conversation => {
                                let name, avatar;

                                if (conversation.isGroup) {
                                    name = conversation.name;
                                    avatar = null;
                                } else {
                                    const otherParticipant = getOtherParticipant(conversation);
                                    name = otherParticipant.name || 'Unknown';
                                    avatar = otherParticipant.avatar;
                                }

                                return (
                                    <button
                                        key={conversation.id}
                                        onClick={() => setSelectedConversation(conversation)}
                                        className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors text-left ${selectedConversation?.id === conversation.id ? 'bg-indigo-50 hover:bg-indigo-50' : ''
                                            }`}
                                    >
                                        {conversation.isGroup ? (
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                                                {name?.[0] || 'G'}
                                            </div>
                                        ) : (
                                            <img
                                                src={avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(name)}`}
                                                alt={name}
                                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                            />
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                    {name}
                                                </h3>
                                                {conversation.lastMessage && (
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(conversation.lastMessage.timestamp)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm truncate text-gray-500">
                                                {conversation.lastMessage?.text || '메시지 없음'}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Room */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    {selectedConversation ? (
                        <>
                            {/* Messages */}
                            <ConversationView
                                conversation={selectedConversation}
                                currentUser={user}
                                headerActions={
                                    <button
                                        onClick={handleTriggerContestEnd}
                                        className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs rounded hover:bg-indigo-200 font-bold whitespace-nowrap"
                                    >
                                        Simulate Contest End
                                    </button>
                                }
                            />
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            대화를 선택해주세요
                        </div>
                    )}
                </div>
            </div>

            {/* Reputation Modal */}
            {showReputationModal && reputationTarget && (
                <ReputationModal
                    isOpen={showReputationModal}
                    onClose={() => setShowReputationModal(false)}
                    targetUser={reputationTarget}
                    currentUser={user}
                    onComplete={() => {
                        alert('평가가 완료되었습니다!');
                    }}
                />
            )}
        </div>
    );
};

export default ChatPage;
