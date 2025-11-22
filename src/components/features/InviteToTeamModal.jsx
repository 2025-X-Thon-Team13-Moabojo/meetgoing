import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const InviteToTeamModal = ({ isOpen, onClose, targetUser, onInvite }) => {
    const { user } = useAuth();
    const [myTeams, setMyTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);

    useEffect(() => {
        const fetchMyTeams = async () => {
            if (!isOpen || !user) return;

            setLoading(true);
            try {
                const q = query(collection(db, 'teams'), where('creatorId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const teams = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMyTeams(teams);
            } catch (error) {
                console.error('Error fetching my teams:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTeams();
    }, [isOpen, user]);

    const handleInvite = () => {
        if (!selectedTeamId) return;
        const team = myTeams.find(t => t.id === selectedTeamId);
        onInvite(team);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                팀으로 초대하기
                            </h3>
                            <button onClick={onClose} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-4">
                                <strong>{targetUser?.name}</strong>님을 초대할 팀을 선택해주세요.
                            </p>

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                </div>
                            ) : myTeams.length > 0 ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {myTeams.map(team => (
                                        <div
                                            key={team.id}
                                            onClick={() => setSelectedTeamId(team.id)}
                                            className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${selectedTeamId === team.id
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">{team.name}</h4>
                                                <p className="text-xs text-gray-500 truncate">{team.description}</p>
                                            </div>
                                            {selectedTeamId === team.id && (
                                                <Check className="w-5 h-5 text-indigo-600" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-4">
                                    생성한 팀이 없습니다. 먼저 팀을 만들어주세요.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={handleInvite}
                            disabled={!selectedTeamId}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            초대 메시지 보내기
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteToTeamModal;
