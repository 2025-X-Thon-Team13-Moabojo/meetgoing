import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, MapPin, Code } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TeamCard = ({ team }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleApply = () => {
        if (!isAuthenticated) {
            alert('Please log in to apply for a team.');
            setTimeout(() => {
                navigate('/login');
            }, 0);
            return;
        }
        alert(`Application sent to ${team.name}!`);
    };




    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium mt-1">{team.contestName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${team.status === 'Recruiting' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {team.status}
                </span>
            </div>

            <p className="text-gray-600 text-sm mb-6 line-clamp-2">{team.description}</p>

            <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Looking for: {team.rolesNeeded.join(', ')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <Code className="w-4 h-4 mr-2" />
                    <span>Stack: {team.stack.join(', ')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{team.region}</span>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex gap-3">
                <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Apply
                </button>
                <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Details
                </button>
            </div>
        </div>
    );
};

export default TeamCard;
