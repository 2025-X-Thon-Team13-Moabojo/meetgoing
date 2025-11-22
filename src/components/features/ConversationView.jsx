import React, { useState, useEffect, useRef } from 'react';
import { Send, Check, UserPlus, LogOut, Search, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendMessage, subscribeToMessages, acceptApplication, leaveConversation, searchUsers, getOrCreateConversation } from '../../utils/messageService';
import { useNavigate } from 'react-router-dom';

const ConversationView = ({ conversation }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [acceptingId, setAcceptingId] = useState(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const messagesEndRef = useRef(null);

    // Get the other participant's ID (for 1:1 chats)
    // For group chats, we might need different logic, but for now let's handle 1:1 application chats
    const otherParticipantId = conversation.participants.find(id => id !== user.uid);
    const otherParticipant = conversation.participantDetails?.[otherParticipantId] || { name: 'Unknown', avatar: '' };

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

    const handleAccept = async (message) => {
        if (!confirm(`${message.metadata.role} 역할로 지원을 수락하시겠습니까?`)) return;

        setAcceptingId(message.id);
        try {
            await acceptApplication(
                message.id,
                message.metadata.teamId,
                message.senderId,
                conversation.participantDetails[message.senderId]
            );
            alert('수락되었습니다! 팀원이 추가되었습니다.');
        } catch (error) {
            console.error('Error accepting application:', error);
            alert('수락 처리 중 오류가 발생했습니다.');
        } finally {
            setAcceptingId(null);
        }
    };

    const handleLeave = async () => {
        if (!confirm('정말 채팅방을 나가시겠습니까? 팀에서도 제외됩니다.')) return;

        try {
            await leaveConversation(conversation.id, user.uid);
            alert('채팅방을 나갔습니다.');
            navigate('/chat'); // Refresh or redirect
            window.location.reload(); // Force reload to update list
        } catch (error) {
            console.error('Error leaving conversation:', error);
            alert('나가기 처리 중 오류가 발생했습니다.');
        }
    };

    const handleSearchUsers = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setSearching(true);
        try {
            const results = await searchUsers(searchTerm);
            // Filter out existing participants
            const filtered = results.filter(u => !conversation.participants.includes(u.uid));
            setSearchResults(filtered);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleInvite = async (invitedUser) => {
        if (!confirm(`${invitedUser.name}님을 초대하시겠습니까?`)) return;

        try {
            // Send invitation message
            await sendMessage(
                conversation.id,
                user.uid,
                invitedUser.uid, // Not really used for group chat but required by function signature
                `${user.name}님이 ${invitedUser.name}님을 초대했습니다.`,
                'invitation',
                {
                    teamId: conversation.teamId,
                    teamName: conversation.name,
                    invitedUserId: invitedUser.uid,
                    invitedUserName: invitedUser.name
                }
            );

            // Also send a direct message to the user if possible, or just rely on this message 
            // if we want them to see it in THIS chat, they need to be added first?
            // Wait, the requirement says "When invited, the invited person should be redirected to the Apply section".
            // This implies they receive a notification.
            // If they are NOT in the chat, they won't see this message.
            // So we should probably start a 1:1 chat with them or add them to this chat?
            // "Invite" usually means adding them. But the requirement says "redirect to Apply".
            // This suggests they are NOT added immediately but invited to apply.
            // So I should send a DM to the invited user.

            const dmConversation = await getOrCreateConversation(
                user.uid,
                { name: user.name, avatar: user.avatar },
                invitedUser.uid,
                { name: invitedUser.name, avatar: invitedUser.avatar || '' }
            );

            await sendMessage(
                dmConversation.id,
                user.uid,
                invitedUser.uid,
                `'${conversation.name}' 팀에 초대되었습니다! 아래 링크를 통해 지원해보세요.`,
                'invitation_link',
                {
                    teamId: conversation.teamId,
                    teamName: conversation.name
                }
            );

            alert('초대 메시지를 보냈습니다!');
            setShowInviteModal(false);
        } catch (error) {
            console.error('Error inviting user:', error);
            alert('초대 중 오류가 발생했습니다.');
        }
    };

    // Helper to get or create conversation (imported from service but need to import it here if not already)
    // Actually I need to import getOrCreateConversation.
    // Let's assume it's imported or I'll add it to imports.

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {conversation.isGroup ? (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {conversation.name[0]}
                        </div>
                    ) : (
                        <img
                            src={otherParticipant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}&background=random`}
                            alt={otherParticipant.name}
                            className="w-10 h-10 rounded-full"
                        />
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {conversation.isGroup ? conversation.name : otherParticipant.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {conversation.isGroup ? `${conversation.participants.length}명 참여 중` : '온라인'}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {conversation.isGroup && (
                        <>
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                title="초대하기"
                            >
                                <UserPlus className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleLeave}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="나가기"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </>
                    )}
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
                        const isApplication = message.type === 'application';
                        const isInvitationLink = message.type === 'invitation_link';

                        const senderDetails = conversation.participantDetails?.[message.senderId];
                        const senderName = senderDetails?.name || 'Unknown';
                        const senderRole = senderDetails?.role;
                        const displayName = senderRole ? `${senderName}/${senderRole}` : senderName;

                        return (
                            <div
                                key={message.id}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                                {/* Show sender name in group chats for others */}
                                {conversation.isGroup && !isMe && (
                                    <span className="text-xs text-gray-500 mb-1 ml-1">
                                        {displayName}
                                    </span>
                                )}

                                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} max-w-xs lg:max-w-md`}>
                                    <div
                                        className={`px-4 py-2 rounded-2xl ${isMe
                                            ? 'bg-indigo-600 text-white'
                                            : isApplication || isInvitationLink
                                                ? 'bg-white border-2 border-indigo-100 shadow-sm'
                                                : 'bg-white text-gray-900 border border-gray-200'
                                            }`}
                                    >
                                        {isApplication && (
                                            <div className="mb-2 pb-2 border-b border-gray-100">
                                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                                    팀 지원 알림
                                                </span>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                                    {message.metadata.teamName} - {message.metadata.role}
                                                </p>
                                            </div>
                                        )}

                                        {isInvitationLink && (
                                            <div className="mb-2 pb-2 border-b border-gray-100">
                                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                                    팀 초대
                                                </span>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                                    {message.metadata.teamName}
                                                </p>
                                            </div>
                                        )}

                                        <p className={`text-sm break-words ${isApplication && !isMe ? 'text-gray-600' : ''}`}>
                                            {message.text}
                                        </p>

                                        {/* Accept Button for Team Leader */}
                                        {isApplication && !isMe && (
                                            <div className="mt-3 pt-2 border-t border-gray-100">
                                                {message.metadata.status === 'accepted' ? (
                                                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                                        <Check className="w-4 h-4" />
                                                        수락됨
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAccept(message)}
                                                        disabled={acceptingId === message.id}
                                                        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300"
                                                    >
                                                        <UserPlus className="w-4 h-4" />
                                                        {acceptingId === message.id ? '처리 중...' : '지원 수락하기'}
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Invitation Link Button */}
                                        {isInvitationLink && !isMe && (
                                            <div className="mt-3 pt-2 border-t border-gray-100">
                                                <button
                                                    onClick={() => navigate(`/teams?applyTeam=${message.metadata.teamId}`)}
                                                    className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                    팀 보러가기
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                    {formatTime(message.createdAt)}
                                </p>
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

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">팀원 초대하기</h3>
                            <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSearchUsers} className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="이름으로 검색..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                            <button
                                type="submit"
                                disabled={searching || !searchTerm.trim()}
                                className="w-full mt-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
                            >
                                {searching ? '검색 중...' : '검색'}
                            </button>
                        </form>

                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {searchResults.length > 0 ? (
                                searchResults.map(u => (
                                    <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                {u.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                                                <p className="text-xs text-gray-500">{u.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleInvite(u)}
                                            className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700"
                                        >
                                            초대
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 text-sm py-4">
                                    {searching ? '검색 중...' : '검색 결과가 없습니다.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConversationView;
