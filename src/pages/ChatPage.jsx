import React, { useState } from 'react';
import { Send, Check, X, FileText, User } from 'lucide-react';
import { chats } from '../data/chats';

const ApplicationMessage = ({ application, onAdmit, onDecline }) => {
    const [status, setStatus] = useState(application.status);

    const handleAdmit = () => {
        setStatus('accepted');
        onAdmit();
    };

    const handleDecline = () => {
        setStatus('rejected');
        onDecline();
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden my-4">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
                <span className="text-indigo-800 font-semibold text-sm">Team Application</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${status === 'accepted' ? 'bg-green-100 text-green-700' :
                        status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                    }`}>
                    {status}
                </span>
            </div>
            <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{application.applicantName}</h3>
                        <p className="text-sm text-gray-500">Applying for <span className="font-medium text-gray-900">{application.role}</span></p>
                        <p className="text-xs text-gray-400 mt-1">Team: {application.teamName}</p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">"{application.message}"</p>
                    <a href={application.resumeLink} className="inline-flex items-center text-indigo-600 text-sm font-medium hover:underline">
                        <FileText className="w-4 h-4 mr-1" /> View Resume / Portfolio
                    </a>
                </div>

                {status === 'pending' && (
                    <div className="flex space-x-3">
                        <button
                            onClick={handleAdmit}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Check className="w-4 h-4 mr-2" /> Admit
                        </button>
                        <button
                            onClick={handleDecline}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <X className="w-4 h-4 mr-2" /> Decline
                        </button>
                    </div>
                )}

                {status === 'accepted' && (
                    <div className="text-center p-2 bg-green-50 rounded-lg text-green-700 text-sm font-medium">
                        Application Accepted
                    </div>
                )}

                {status === 'rejected' && (
                    <div className="text-center p-2 bg-red-50 rounded-lg text-red-700 text-sm font-medium">
                        Application Declined
                    </div>
                )}
            </div>
        </div>
    );
};

const ChatPage = () => {
    const [selectedChatId, setSelectedChatId] = useState(1);
    const [messageInput, setMessageInput] = useState('');

    // In a real app, this would be managed by a global store or context
    const [conversations, setConversations] = useState(chats);

    const selectedChat = conversations.find(c => c.id === selectedChatId);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: "Me",
            text: messageInput,
            type: "text",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prev => prev.map(chat => {
            if (chat.id === selectedChatId) {
                return {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    lastMessage: messageInput
                };
            }
            return chat;
        }));

        setMessageInput('');
    };

    const handleAdmit = (chatId) => {
        console.log(`Admitted applicant in chat ${chatId}`);
        // Logic to update team member status would go here
    };

    const handleDecline = (chatId) => {
        console.log(`Declined applicant in chat ${chatId}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)]">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex">
                {/* Chat List */}
                <div className="w-80 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors text-left ${selectedChatId === chat.id ? 'bg-indigo-50 hover:bg-indigo-50' : ''
                                    }`}
                            >
                                <img src={chat.partner.avatar} alt={chat.partner.name} className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">{chat.partner.name}</h3>
                                        <span className="text-xs text-gray-500">{chat.messages[chat.messages.length - 1].timestamp}</span>
                                    </div>
                                    <p className={`text-sm truncate ${chat.unread > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Room */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    {selectedChat ? (
                        <>
                            {/* Header */}
                            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src={selectedChat.partner.avatar} alt={selectedChat.partner.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{selectedChat.partner.name}</h3>
                                        <p className="text-xs text-gray-500">{selectedChat.partner.role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {selectedChat.messages.map((msg) => (
                                    <div key={msg.id}>
                                        {msg.type === 'application' ? (
                                            <ApplicationMessage
                                                application={msg.applicationData}
                                                onAdmit={() => handleAdmit(selectedChat.id)}
                                                onDecline={() => handleDecline(selectedChat.id)}
                                            />
                                        ) : (
                                            <div className={`flex ${msg.sender === 'Me' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${msg.sender === 'Me'
                                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                                        : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none'
                                                    }`}>
                                                    <p className="text-sm">{msg.text}</p>
                                                    <p className={`text-[10px] mt-1 ${msg.sender === 'Me' ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                        {msg.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-white border-t border-gray-200">
                                <form onSubmit={handleSendMessage} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim()}
                                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
