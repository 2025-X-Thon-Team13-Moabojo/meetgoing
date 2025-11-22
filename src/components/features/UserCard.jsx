import React from 'react';
import { MapPin, Clock, MessageCircle, UserPlus } from 'lucide-react';

const UserCard = ({ user }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-indigo-600 font-medium">{user.role}</p>
                            <p className="text-xs text-gray-500">{user.category} &bull; {user.subCategory}</p>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                    {user.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-4 h-16 overflow-hidden content-start">
                    {user.techStack.slice(0, 4).map((tech, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                            {tech}
                        </span>
                    ))}
                    {user.techStack.length > 4 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded-md font-medium">
                            +{user.techStack.length - 4}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {user.region}
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {user.availableTime}
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <button className="flex-1 mr-2 py-2 flex items-center justify-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                </button>
                <button className="flex-1 ml-2 py-2 flex items-center justify-center text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite
                </button>
            </div>
        </div>
    );
};

export default UserCard;
