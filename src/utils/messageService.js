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
    orderBy
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

        // Find conversation with both participants
        let existingConversation = null;
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.participants.includes(user2Id)) {
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
            updatedAt: serverTimestamp()
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
export const sendMessage = async (conversationId, senderId, receiverId, text) => {
    try {
        // Add message to messages collection
        const messagesRef = collection(db, 'messages');
        const newMessage = {
            conversationId,
            senderId,
            receiverId,
            text,
            createdAt: serverTimestamp(),
            read: false
        };

        await addDoc(messagesRef, newMessage);

        // Update conversation's lastMessage
        const conversationRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationRef, {
            lastMessage: {
                text,
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
