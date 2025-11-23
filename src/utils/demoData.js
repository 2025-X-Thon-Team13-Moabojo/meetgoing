import { db } from '../firebase';
import { doc, setDoc, collection, addDoc, serverTimestamp, getDocs, query, where, writeBatch } from 'firebase/firestore';

const DEMO_USERS = [
    {
        id: 'user_leader',
        name: '김팀장',
        email: 'leader@example.com',
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Leader',
        roles: ['Leader', 'PM'],
        categories: ['기획'],
        reputation: 50,
        reputationKeywords: {}
    },
    {
        id: 'user_dev1',
        name: '이개발',
        email: 'dev1@example.com',
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Dev1',
        roles: ['Frontend'],
        categories: ['개발'],
        reputation: 50,
        reputationKeywords: {}
    },
    {
        id: 'user_dev2',
        name: '박백엔드',
        email: 'dev2@example.com',
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Dev2',
        roles: ['Backend'],
        categories: ['개발'],
        reputation: 50,
        reputationKeywords: {}
    },
    {
        id: 'user_design',
        name: '최디자',
        email: 'design@example.com',
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Design',
        roles: ['Designer'],
        categories: ['디자인'],
        reputation: 50,
        reputationKeywords: {}
    }
];

const SAMSUNG_CONTEST = {
    id: 'contest_samsung_2024',
    title: '제5회 삼성전자 대학생 프로그래밍 경진대회',
    organizer: '삼성전자',
    dday: 'D-Day',
    viewCount: 1234,
    imageUrl: 'https://images.unsplash.com/photo-1610915402677-a574e9c0430b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
};

export const injectDemoData = async (currentUserId) => {
    try {
        const batch = writeBatch(db);

        // 1. Create Users
        for (const user of DEMO_USERS) {
            const userRef = doc(db, 'users', user.id);
            batch.set(userRef, {
                ...user,
                createdAt: new Date().toISOString()
            }, { merge: true });
        }

        // 2. Create Contest (if needed, but we can just link to it)
        // For simplicity, we assume the contest exists or we just use the ID.

        // 3. Create Team
        const teamId = 'team_samsung_demo';
        const teamRef = doc(db, 'teams', teamId);

        // Include current user in members
        const teamMembers = [...DEMO_USERS.map(u => u.id)];
        if (currentUserId && !teamMembers.includes(currentUserId)) {
            teamMembers.push(currentUserId);
        }

        const teamData = {
            name: '삼성전자 공모전 1등팀',
            contestId: SAMSUNG_CONTEST.id,
            contestName: SAMSUNG_CONTEST.title,
            creatorId: DEMO_USERS[0].id,
            creatorName: DEMO_USERS[0].name,
            creatorAvatar: DEMO_USERS[0].avatar,
            members: teamMembers,
            status: 'recruiting', // or 'completed'
            description: '삼성전자 공모전 대상을 목표로 하는 팀입니다.',
            createdAt: serverTimestamp()
        };
        batch.set(teamRef, teamData, { merge: true });

        // 4. Create Group Chat
        // Check if exists first to avoid duplicates if run multiple times
        const conversationsRef = collection(db, 'conversations');
        const q = query(conversationsRef, where('teamId', '==', teamId));
        const querySnapshot = await getDocs(q);

        let conversationId;

        if (querySnapshot.empty) {
            const newConvRef = doc(collection(db, 'conversations'));
            conversationId = newConvRef.id;

            const participantDetails = {};
            DEMO_USERS.forEach(u => {
                participantDetails[u.id] = {
                    name: u.name,
                    avatar: u.avatar,
                    role: u.roles[0]
                };
            });

            // Add current user details if available (we might not have them here, but we can add the ID to participants)
            // Ideally we would fetch current user data, but for now let's just ensure ID is in participants.
            // The ChatPage handles missing participantDetails gracefully.

            const participants = [...DEMO_USERS.map(u => u.id)];
            if (currentUserId && !participants.includes(currentUserId)) {
                participants.push(currentUserId);
            }

            batch.set(newConvRef, {
                isGroup: true,
                teamId: teamId,
                name: teamData.name,
                participants: participants,
                participantDetails: participantDetails,
                lastMessage: {
                    text: '팀 채팅방이 생성되었습니다.',
                    senderId: 'system',
                    timestamp: serverTimestamp()
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        } else {
            conversationId = querySnapshot.docs[0].id;

            // If conversation exists, ensure current user is in it
            const convDoc = querySnapshot.docs[0];
            const convData = convDoc.data();
            if (currentUserId && !convData.participants.includes(currentUserId)) {
                batch.update(convDoc.ref, {
                    participants: [...convData.participants, currentUserId]
                });
            }
        }

        await batch.commit();
        console.log("Demo data injected successfully!");
        return { success: true, teamId, conversationId, users: DEMO_USERS };

    } catch (error) {
        console.error("Error injecting demo data:", error);
        return { success: false, error };
    }
};
