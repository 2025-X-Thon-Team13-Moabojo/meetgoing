import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToConversations } from '../utils/messageService';
import ConversationView from '../components/features/ConversationView';

const ChatPage = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);

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
        return conversation.participantDetails[otherParticipantId];
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)]">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex">
                {/* Conversation List */}
                <div className="w-80 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">메시지</h2>
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
                                const otherParticipant = getOtherParticipant(conversation);
                                return (
                                    <button
                                        key={conversation.id}
                                        onClick={() => setSelectedConversation(conversation)}
                                        className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors text-left ${selectedConversation?.id === conversation.id ? 'bg-indigo-50 hover:bg-indigo-50' : ''
                                            }`}
                                    >
                                        <img
                                            src={otherParticipant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}&background=random`}
                                            alt={otherParticipant.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                    {otherParticipant.name}
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
                        <ConversationView conversation={selectedConversation} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            대화를 선택해주세요
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

