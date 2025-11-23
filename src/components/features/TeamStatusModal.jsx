import React, { useState, useEffect } from 'react';
import { X, User, Code } from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const TeamStatusModal = ({ isOpen, onClose, team }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!isOpen || !team || !team.members) return;

            setLoading(true);
            try {
                const memberPromises = team.members.map(async (memberId) => {
                    const userDoc = await getDoc(doc(db, 'users', memberId));
                    if (userDoc.exists()) {
                        return { id: userDoc.id, ...userDoc.data() };
                    }
                    return null;
                });

                const memberData = await Promise.all(memberPromises);
                setMembers(memberData.filter(member => member !== null));
            } catch (error) {
                console.error('Error fetching team members:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [isOpen, team]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                팀 현황 확인
                            </h3>
                            <button
                                onClick={onClose}
                                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-4">
                                현재 팀원 목록 ({members.length}명)
                            </p>

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                    <p className="mt-2 text-sm text-gray-500">멤버 정보를 불러오는 중...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {members.map((member) => (
                                        <div key={member.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                                            <img
                                                src={member.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(member.name || 'User')}`}
                                                alt={member.name}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                            />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                                                    {member.id === team.creatorId && (
                                                        <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                                            팀장
                                                        </span>
                                                    )}
                                                </div>

                                                {member.roles && member.roles.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {member.roles.map((role, idx) => (
                                                            <span key={idx} className="text-xs text-gray-600 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                                                {role}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {member.techStack && member.techStack.length > 0 && (
                                                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                                        <Code className="w-3 h-3" />
                                                        <span>{member.techStack.slice(0, 3).join(', ')}</span>
                                                        {member.techStack.length > 3 && <span>+{member.techStack.length - 3}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {members.length === 0 && (
                                        <p className="text-center text-gray-500 py-4">팀원이 없습니다.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamStatusModal;
