export const chats = [
    {
        id: 1,
        partner: {
            id: 101,
            name: "Sarah Lee",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
            role: "Designer"
        },
        lastMessage: "I've sent my portfolio for the Pizza Lovers team!",
        unread: 1,
        messages: [
            {
                id: 1,
                sender: "Sarah Lee",
                text: "Hi! I'm interested in joining your team 'Pizza Lovers'.",
                type: "text",
                timestamp: "10:30 AM"
            },
            {
                id: 2,
                sender: "Sarah Lee",
                type: "application",
                timestamp: "10:31 AM",
                applicationData: {
                    teamName: "Pizza Lovers",
                    applicantName: "Sarah Lee",
                    role: "UI/UX Designer",
                    message: "I have 3 years of experience in Figma and I love pizza! Here is my portfolio.",
                    resumeLink: "#",
                    status: "pending" // pending, accepted, rejected
                }
            }
        ]
    },
    {
        id: 2,
        partner: {
            id: 102,
            name: "David Kim",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
            role: "Backend Dev"
        },
        lastMessage: "When is the next meeting?",
        unread: 0,
        messages: [
            {
                id: 1,
                sender: "Me",
                text: "Hey David, welcome to the team!",
                type: "text",
                timestamp: "Yesterday"
            },
            {
                id: 2,
                sender: "David Kim",
                text: "Thanks! Excited to work with you. When is the next meeting?",
                type: "text",
                timestamp: "Yesterday"
            }
        ]
    }
];
