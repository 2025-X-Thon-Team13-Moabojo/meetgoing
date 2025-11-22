import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Send, Inbox } from 'lucide-react';

const MatchesPage = () => {
    const [activeTab, setActiveTab] = useState('sent'); // 'sent' or 'received'

    // Mock data
    const sentApplications = [
        { id: 1, team: "EcoTrack", role: "Frontend Developer", status: "pending", date: "2023-10-25" },
        { id: 2, team: "AI Study Group", role: "Member", status: "accepted", date: "2023-10-20" },
        { id: 3, team: "FinTech Hackathon", role: "Designer", status: "rejected", date: "2023-10-15" },
    ];

    const receivedInvitations = [
        { id: 1, team: "Game Dev Squad", role: "Unity Developer", status: "pending", date: "2023-10-26", message: "We liked your portfolio!" },
        { id: 2, team: "Web3 Project", role: "Smart Contract Dev", status: "rejected", date: "2023-10-22", message: "Join us to build the future." },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> 수락됨</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> 거절됨</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> 대기중</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">나의 매칭</h1>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`flex-1 py-4 text-sm font-medium text-center flex items-center justify-center ${activeTab === 'sent' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            보낸 신청
                        </button>
                        <button
                            onClick={() => setActiveTab('received')}
                            className={`flex-1 py-4 text-sm font-medium text-center flex items-center justify-center ${activeTab === 'received' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Inbox className="w-4 h-4 mr-2" />
                            받은 초대
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'sent' ? (
                            <div className="space-y-4">
                                {sentApplications.length > 0 ? sentApplications.map(app => (
                                    <div key={app.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{app.team}</h3>
                                            <p className="text-sm text-gray-600">지원 분야: <span className="font-medium text-indigo-600">{app.role}</span></p>
                                            <p className="text-xs text-gray-400 mt-1">지원일: {app.date}</p>
                                        </div>
                                        <div>
                                            {getStatusBadge(app.status)}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-500">보낸 신청이 없습니다.</div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {receivedInvitations.length > 0 ? receivedInvitations.map(invite => (
                                    <div key={invite.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{invite.team}</h3>
                                                <p className="text-sm text-gray-600">제안 분야: <span className="font-medium text-indigo-600">{invite.role}</span></p>
                                            </div>
                                            <div>
                                                {getStatusBadge(invite.status)}
                                            </div>
                                        </div>
                                        {invite.message && (
                                            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 italic mb-3">
                                                "{invite.message}"
                                            </div>
                                        )}
                                        {invite.status === 'pending' && (
                                            <div className="flex space-x-3 mt-3">
                                                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                                                    수락
                                                </button>
                                                <button className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                                    거절
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-500">받은 초대가 없습니다.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchesPage;
