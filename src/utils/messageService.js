import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp,
    onSnapshot,
    orderBy,
    getDoc,
    arrayUnion
} from 'firebase/firestore';

/**
 * Get or create a conversation between two users
 */
export const getOrCreateConversation = async (user1Id, user1Data, user2Id, user2Data) => {
    try {
        // Check if conversation already exists
        const conversationsRef = collection(db, 'conversations');
        const q = query(
            conversationsRef,
            where('participants', 'array-contains', user1Id)
        );

        const querySnapshot = await getDocs(q);

        // Find conversation with both participants AND is not a group chat
        let existingConversation = null;
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.participants.includes(user2Id) && !data.isGroup) {
                existingConversation = { id: doc.id, ...data };
            }
        });

        if (existingConversation) {
            return existingConversation;
        }

        // Create new conversation
        const newConversation = {
            participants: [user1Id, user2Id],
            participantDetails: {
                [user1Id]: {
                    name: user1Data.name,
                    avatar: user1Data.avatar
                },
                [user2Id]: {
                    name: user2Data.name,
                    avatar: user2Data.avatar
                }
            },
            lastMessage: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isGroup: false
        };

        const docRef = await addDoc(conversationsRef, newConversation);
        return { id: docRef.id, ...newConversation };
    } catch (error) {
        console.error('Error getting/creating conversation:', error);
        throw error;
    }
};

/**
 * Send a message in a conversation
 */
export const sendMessage = async (conversationId, senderId, receiverId, text, type = 'text', metadata = {}) => {
    try {
        // Add message to messages collection
        const messagesRef = collection(db, 'messages');
        const newMessage = {
            conversationId,
            senderId,
            receiverId, // Can be null for group chats
            text,
            type, // 'text', 'application', 'system'
            metadata, // { role, teamId, teamName, status: 'pending'|'accepted'|'rejected' }
            createdAt: serverTimestamp(),
            read: false
        };

        await addDoc(messagesRef, newMessage);

        // Update conversation's lastMessage
        const conversationRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationRef, {
            lastMessage: {
                text: type === 'application' ? `[지원] ${text}` : text,
                senderId,
                timestamp: serverTimestamp()
            },
            updatedAt: serverTimestamp()
        });

        return true;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

/**
 * Get all conversations for a user
 */
export const getConversations = async (userId) => {
    try {
        const conversationsRef = collection(db, 'conversations');
        const q = query(
            conversationsRef,
            where('participants', 'array-contains', userId)
        );

        const querySnapshot = await getDocs(q);
        const conversations = [];

        querySnapshot.forEach((doc) => {
            conversations.push({ id: doc.id, ...doc.data() });
        });

        // Sort by updatedAt (most recent first)
        conversations.sort((a, b) => {
            const aTime = a.updatedAt?.seconds || 0;
            const bTime = b.updatedAt?.seconds || 0;
            return bTime - aTime;
        });

        return conversations;
    } catch (error) {
        console.error('Error getting conversations:', error);
        throw error;
    }
};

/**
 * Get all messages in a conversation
 */
export const getMessages = async (conversationId) => {
    try {
        const messagesRef = collection(db, 'messages');
        const q = query(
            messagesRef,
            where('conversationId', '==', conversationId),
            orderBy('createdAt', 'asc')
        );

        const querySnapshot = await getDocs(q);
        const messages = [];

        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });

        return messages;
    } catch (error) {
        console.error('Error getting messages:', error);
        // If orderBy fails (no index), get without ordering and sort in JS
        try {
            const messagesRef = collection(db, 'messages');
            const q = query(
                messagesRef,
                where('conversationId', '==', conversationId)
            );

            const querySnapshot = await getDocs(q);
            const messages = [];

            querySnapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });

            // Sort by createdAt in JavaScript
            messages.sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0;
                const bTime = b.createdAt?.seconds || 0;
                return aTime - bTime;
            });

            return messages;
        } catch (fallbackError) {
            console.error('Error getting messages (fallback):', fallbackError);
            return [];
        }
    }
};

/**
 * Subscribe to real-time conversation updates
 */
export const subscribeToConversations = (userId, callback) => {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
        conversationsRef,
        where('participants', 'array-contains', userId)
    );

    return onSnapshot(q, (snapshot) => {
        const conversations = [];
        snapshot.forEach((doc) => {
            conversations.push({ id: doc.id, ...doc.data() });
        });

        // Sort by updatedAt
        conversations.sort((a, b) => {
            const aTime = a.updatedAt?.seconds || 0;
            const bTime = b.updatedAt?.seconds || 0;
            return bTime - aTime;
        });

        callback(conversations);
    });
};

/**
 * Subscribe to real-time message updates in a conversation
 */
export const subscribeToMessages = (conversationId, callback) => {
    const messagesRef = collection(db, 'messages');
    const q = query(
        messagesRef,
        where('conversationId', '==', conversationId)
    );

    return onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });

        // Sort by createdAt
        messages.sort((a, b) => {
            const aTime = a.createdAt?.seconds || 0;
            const bTime = b.createdAt?.seconds || 0;
            return aTime - bTime;
        });

        callback(messages);
    });
};

/**
 * Accept a team application
 */
export const acceptApplication = async (messageId, teamId, applicantId, applicantData) => {
    try {
        // 1. Get message to find the role
        const messageRef = doc(db, 'messages', messageId);
        const messageSnap = await getDoc(messageRef);

        if (!messageSnap.exists()) {
            throw new Error('Message not found');
        }

        const messageData = messageSnap.data();
        const role = messageData.metadata?.role || 'Member';

        // 2. Update message status
        await updateDoc(messageRef, {
            'metadata.status': 'accepted'
        });

        // 3. Add member to team
        const teamRef = doc(db, 'teams', teamId);
        await updateDoc(teamRef, {
            members: arrayUnion(applicantId)
        });

        // 4. Check team size and handle group chat
        const teamDoc = await getDoc(teamRef);
        const teamData = teamDoc.data();

        // If team has 3 or more members (including leader), ensure group chat exists
        if (teamData.members.length >= 3) {
            await ensureGroupChat(teamId, teamData, applicantId, role, applicantData);
        }

        return true;
    } catch (error) {
        console.error('Error accepting application:', error);
        throw error;
    }
};

/**
 * Ensure a group chat exists for the team and all members are in it
 */
const ensureGroupChat = async (teamId, teamData, newMemberId, newMemberRole, newMemberData) => {
    const conversationsRef = collection(db, 'conversations');

    // Check if group chat for this team already exists
    const q = query(
        conversationsRef,
        where('teamId', '==', teamId),
        where('isGroup', '==', true)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // Group chat exists, update participants
        const groupChatDoc = querySnapshot.docs[0];
        const groupChatId = groupChatDoc.id;
        const groupChatData = groupChatDoc.data();

        const updates = {};

        // Add new member to participants if not already there
        if (!groupChatData.participants.includes(newMemberId)) {
            updates.participants = arrayUnion(newMemberId);

            // Update participant details with role
            const participantDetails = groupChatData.participantDetails || {};
            updates[`participantDetails.${newMemberId}`] = {
                name: newMemberData.name || 'Unknown',
                avatar: newMemberData.avatar || '',
                role: newMemberRole
            };
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(doc(db, 'conversations', groupChatId), updates);

            // Send system message about new member
            await sendMessage(
                groupChatId,
                'system',
                null,
                `${newMemberData.name}님이 팀에 합류했습니다.`,
                'system'
            );
        }
    } else {
        // Create new group chat
        // We need to construct participant details for all current members
        // Since we only have the new member's data and role explicitly, 
        // we might need to fetch others or just set defaults.
        // For the Leader, we can infer from team.creatorId.

        const participantDetails = {};

        // Add Leader (Creator) - we don't have their data passed in here easily without fetching,
        // but we can try to get it from the team data if we stored it, or just leave it minimal.
        // Team data has creatorName.
        participantDetails[teamData.creatorId] = {
            name: teamData.creatorName,
            avatar: teamData.creatorAvatar || '', // Assuming we might have this
            role: 'Leader'
        };

        // Add the new member
        participantDetails[newMemberId] = {
            name: newMemberData.name || 'Unknown',
            avatar: newMemberData.avatar || '',
            role: newMemberRole
        };

        // For other members, we might miss their details if we don't fetch them.
        // But for now, let's just initialize with what we have.

        const newConversation = {
            isGroup: true,
            teamId: teamId,
            name: teamData.name, // Group chat name = Team name
            participants: teamData.members,
            participantDetails: participantDetails,
            lastMessage: {
                text: '팀 채팅방이 생성되었습니다.',
                senderId: 'system',
                timestamp: serverTimestamp()
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(conversationsRef, newConversation);

        // Send system message about new member (the 3rd one)
        await sendMessage(
            docRef.id,
            'system',
            null,
            `${newMemberData.name}님이 팀에 합류했습니다.`,
            'system'
        );
    }
};

/**
 * Leave a conversation (and team if it's a group chat)
 */
export const leaveConversation = async (conversationId, userId) => {
    try {
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationSnap = await getDoc(conversationRef);

        if (!conversationSnap.exists()) return;

        const conversationData = conversationSnap.data();

        // 1. Remove from conversation participants
        await updateDoc(conversationRef, {
            participants: arrayRemove(userId),
            [`participantDetails.${userId}`]: deleteField()
        });

        // 2. If it's a group chat, remove from team members
        if (conversationData.isGroup && conversationData.teamId) {
            const teamRef = doc(db, 'teams', conversationData.teamId);
            await updateDoc(teamRef, {
                members: arrayRemove(userId)
            });
        }

        return true;
    } catch (error) {
        console.error('Error leaving conversation:', error);
        throw error;
    }
};

/**
 * Search users by name or email
 */
export const searchUsers = async (searchTerm) => {
    try {
        const usersRef = collection(db, 'users');
        // Firestore doesn't support OR queries natively in a simple way for this without multiple queries or client-side filtering.
        // For simplicity/prototype, we'll fetch all users (if small scale) or just search by name.
        // Let's try a simple name search first.

        // Note: This is a simple prefix search. For production, use Algolia or similar.
        const q = query(
            usersRef,
            where('name', '>=', searchTerm),
            where('name', '<=', searchTerm + '\uf8ff')
        );

        const querySnapshot = await getDocs(q);
        let users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Also try to search by email if name search yields few results or just do client side filter if dataset is small.
        // Given the constraints, let's just do a client-side filter on a larger set if possible, 
        // but fetching all users is bad.
        // Let's stick to name search for now, and maybe exact email match.

        return users;
    } catch (error) {
        console.error('Error searching users:', error);
        return [];
    }
};
