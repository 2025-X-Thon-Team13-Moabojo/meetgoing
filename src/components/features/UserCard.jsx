<<<<<<< HEAD
import React from 'react';
import { MapPin, Clock, MessageCircle, UserPlus } from 'lucide-react';

const UserCard = ({ user }) => {
=======
import React, { useState } from 'react';
import { MapPin, MessageCircle, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrCreateConversation } from '../../utils/messageService';

const UserCard = ({ user }) => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    // Safely access array-based fields
    const roles = user.roles || [];
    const categories = user.categories || [];
    const techStack = user.techStack || [];

    const handleSendMessage = async () => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (currentUser.uid === user.id) {
            alert('자신에게는 메시지를 보낼 수 없습니다.');
            return;
        }

        setLoading(true);
        try {
            const conversation = await getOrCreateConversation(
                currentUser.uid,
                { name: currentUser.name || currentUser.displayName, avatar: currentUser.avatar },
                user.id,
                { name: user.name, avatar: user.avatar || '' }
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

>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                        <img
<<<<<<< HEAD
                            src={user.avatar}
=======
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`}
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
                            alt={user.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
<<<<<<< HEAD
                            <p className="text-sm text-indigo-600 font-medium">{user.role}</p>
                            <p className="text-xs text-gray-500">{user.category} &bull; {user.subCategory}</p>
=======
                            {roles.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {roles.slice(0, 2).map((role, index) => (
                                        <span key={index} className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                                            {role}
                                        </span>
                                    ))}
                                    {roles.length > 2 && (
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                                            +{roles.length - 2}
                                        </span>
                                    )}
                                </div>
                            )}
                            {categories.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">{categories.slice(0, 2).join(' • ')}</p>
                            )}
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
<<<<<<< HEAD
                    {user.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-4 h-16 overflow-hidden content-start">
                    {user.techStack.slice(0, 4).map((tech, index) => (
=======
                    {user.bio || '소개가 없습니다.'}
                </p>

                <div className="flex flex-wrap gap-2 mb-4 h-16 overflow-hidden content-start">
                    {techStack.slice(0, 4).map((tech, index) => (
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                            {tech}
                        </span>
                    ))}
<<<<<<< HEAD
                    {user.techStack.length > 4 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded-md font-medium">
                            +{user.techStack.length - 4}
=======
                    {techStack.length > 4 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded-md font-medium">
                            +{techStack.length - 4}
                        </span>
                    )}
                    {techStack.length === 0 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded-md font-medium">
                            기술 스택 없음
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
<<<<<<< HEAD
                        {user.region}
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {user.availableTime}
=======
                        {user.region || '미정'}
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
<<<<<<< HEAD
                <button className="flex-1 mr-2 py-2 flex items-center justify-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                </button>
                <button className="flex-1 ml-2 py-2 flex items-center justify-center text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite
=======
                <button
                    onClick={handleSendMessage}
                    disabled={loading}
                    className="flex-1 mr-2 py-2 flex items-center justify-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {loading ? '로딩 중...' : '메시지'}
                </button>
                <button className="flex-1 ml-2 py-2 flex items-center justify-center text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                    <UserPlus className="w-4 h-4 mr-2" />
                    초대
>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
                </button>
            </div>
        </div>
    );
};

export default UserCard;
<<<<<<< HEAD
=======

>>>>>>> 0befbef76cfcc4c50d8a8bd4fbe3ac93ce05880a
