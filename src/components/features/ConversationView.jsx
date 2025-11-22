import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendMessage, subscribeToMessages } from '../../utils/messageService';

const ConversationView = ({ conversation }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Get the other participant's ID
    const otherParticipantId = conversation.participants.find(id => id !== user.uid);
    const otherParticipant = conversation.participantDetails[otherParticipantId];

    // Subscribe to messages
    useEffect(() => {
        if (!conversation.id) return;

        const unsubscribe = subscribeToMessages(conversation.id, (updatedMessages) => {
            setMessages(updatedMessages);
        });

        return () => unsubscribe();
    }, [conversation.id]);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await sendMessage(
                conversation.id,
                user.uid,
                otherParticipantId,
                newMessage.trim()
            );
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('메시지 전송에 실패했습니다.');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                    <img
                        src={otherParticipant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}&background=random`}
                        alt={otherParticipant.name}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900">{otherParticipant.name}</h3>
                        <p className="text-xs text-gray-500">온라인</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">메시지를 보내서 대화를 시작하세요!</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isMe = message.senderId === user.uid;
                        return (
                            <div
                                key={message.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-xs lg:max-w-md ${isMe ? 'order-2' : 'order-1'}`}>
                                    <div
                                        className={`px-4 py-2 rounded-2xl ${isMe
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-white text-gray-900 border border-gray-200'
                                            }`}
                                    >
                                        <p className="text-sm break-words">{message.text}</p>
                                    </div>
                                    <p className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                        {formatTime(message.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        {sending ? '전송 중...' : '전송'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConversationView;
