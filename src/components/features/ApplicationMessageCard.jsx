import React, { useState } from 'react';
import { Check, X, FileText, User } from 'lucide-react';
import { db } from '../../firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { sendMessage } from '../../utils/messageService';

const ApplicationMessageCard = ({ message, isMe, onUpdate }) => {
    const { metadata = {}, id: messageId } = message;
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(metadata?.status || 'pending');

    if (!metadata || Object.keys(metadata).length === 0) {
        return (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-sm">
                Invalid application message
            </div>
        );
    }

    const handleAdmit = async () => {
        if (loading) return;
        if (!confirm('이 지원자를 팀원으로 승인하시겠습니까?')) return;

        setLoading(true);
        try {
            // 1. Add user to team members
            const teamRef = doc(db, 'teams', metadata.teamId);
            await updateDoc(teamRef, {
                members: arrayUnion(message.senderId)
            });

            // 2. Update message status
            const messageRef = doc(db, 'messages', messageId);
            await updateDoc(messageRef, {
                'metadata.status': 'accepted'
            });

            // 3. Send acceptance message
            await sendMessage(
                message.conversationId,
                message.receiverId, // I am the receiver of the application, so I send to the sender
                message.senderId,
                `[자동 메시지] 축하합니다! '${metadata.teamName}' 팀 합류가 승인되었습니다.`
            );

            setStatus('accepted');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error admitting applicant:', error);
            alert('승인 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = async () => {
        if (loading) return;
        if (!confirm('이 지원을 거절하시겠습니까?')) return;

        setLoading(true);
        try {
            // 1. Update message status
            const messageRef = doc(db, 'messages', messageId);
            await updateDoc(messageRef, {
                'metadata.status': 'rejected'
            });

            // 2. Send rejection message
            await sendMessage(
                message.conversationId,
                message.receiverId,
                message.senderId,
                `[자동 메시지] 아쉽게도 '${metadata.teamName}' 팀 합류가 거절되었습니다.`
            );

            setStatus('rejected');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error declining applicant:', error);
            alert('거절 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-sm w-full">
            {/* Header */}
            <div className="bg-indigo-50 px-4 py-3 flex justify-between items-center border-b border-indigo-100">
                <h3 className="font-semibold text-indigo-900">Team Application</h3>
                <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${status === 'accepted' ? 'bg-green-100 text-green-800' :
                    status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {status}
                </span>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                        {metadata.applicantAvatar ? (
                            <img src={metadata.applicantAvatar} alt="Avatar" className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                            <User className="w-6 h-6" />
                        )}
                    </div>
                    <div className="ml-3">
                        <h4 className="text-lg font-bold text-gray-900">{metadata.applicantName}</h4>
                        <p className="text-sm text-gray-500">Applying for <span className="font-medium text-gray-900">{metadata.role || 'Team Member'}</span></p>
                        <p className="text-xs text-gray-400">Team: {metadata.teamName}</p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 italic">
                        "{metadata.message || '지원합니다.'}"
                    </p>
                    {/* Placeholder for portfolio link if we had one */}
                    {/* <div className="mt-3 flex items-center text-indigo-600 text-sm font-medium cursor-pointer hover:underline">
                        <FileText className="w-4 h-4 mr-1" />
                        View Resume / Portfolio
                    </div> */}
                </div>

                {/* Actions - Only show for the receiver (team creator) and if pending */}
                {!isMe && status === 'pending' && (
                    <div className="flex gap-3">
                        <button
                            onClick={handleAdmit}
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:bg-indigo-400"
                        >
                            <Check className="w-4 h-4" />
                            Admit
                        </button>
                        <button
                            onClick={handleDecline}
                            disabled={loading}
                            className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-100"
                        >
                            <X className="w-4 h-4" />
                            Decline
                        </button>
                    </div>
                )}

                {/* Status Message for Sender or after action */}
                {(isMe || status !== 'pending') && (
                    <div className="text-center py-2 text-sm text-gray-500">
                        {status === 'accepted' ? '승인되었습니다.' :
                            status === 'rejected' ? '거절되었습니다.' :
                                '팀장의 응답을 기다리는 중입니다.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationMessageCard;
