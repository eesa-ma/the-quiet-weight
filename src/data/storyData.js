export const storyData = {
    "ch1_after_school_text": {
        text: "Friend: 'omg same. we're going to jaden's later... u should come!!'",
        character: "Text Message",
        choices: [
            {
                text: "yeah maybe! (Internally: I won't go.)",
                nextScene: "ch1_avoidance",
                connChange: -5,
                awareChange: 0
            },
            {
                text: "I can't, I have stuff.",
                nextScene: "ch1_reflection_afraid",
                connChange: -10,
                awareChange: +5
            },
            {
                text: "who else is going?",
                nextScene: "ch1_conversation_builder",
                connChange: +5,
                awareChange: +10
            }
        ]
    },
    "ch1_avoidance": {
        text: "You put your phone face down. The depletion increases, but it feels safer than going out.",
        character: "Inner Monologue",
        choices: [
            {
                text: "Go to school the next day.",
                nextScene: "ch1_group_project",
                connChange: 0,
                awareChange: 0
            }
        ]
    },
    "ch1_reflection_afraid": {
        text: "Reflection: Sometimes saying 'I have stuff' is just a shield for feeling afraid of not fitting in.",
        character: "System Insight",
        choices: [
            {
                text: "Review Maya's Profile.",
                nextScene: "ch1_instagram_minigame",
                connChange: 0,
                awareChange: 0
            }
        ]
    },
    "ch1_conversation_builder": {
        text: "Friend: 'just me, jaden, and sarah. it'll be super chill.'",
        character: "Text Message",
        choices: [{ text: "End of prototype.", nextScene: null, connChange: 0, awareChange: 0 }]
    },
    "ch1_group_project": {
        text: "The next day in class. The teacher assigns group projects. You are grouped with three people you don't really know. They start chatting, but you're sitting on the edge of the circle.",
        character: "Classroom",
        choices: [
            {
                text: "Offer to just take notes and format the document. (Safer role, less exposure)",
                nextScene: "ch1_ending_small_step",
                connChange: +2,
                awareChange: +5
            },
            {
                text: "Suggest meeting at the library to work on it together. (Connection attempt)",
                nextScene: "ch1_ending_connection",
                connChange: +15,
                awareChange: +10
            },
            {
                text: "Say you'll work on your part alone at home and email it to them. (Full avoidance)",
                nextScene: "ch1_ending_retreat",
                connChange: -15,
                awareChange: 0
            }
        ]
    },

    "ch1_ending_small_step": {
        text: "You take the notes. You stay mostly quiet, but you do text one of the group members later to ask a question. It's a small step, but it's something.",
        character: "Chapter 1 Outcome",
        choices: [
            { text: "View Chapter Reflection", nextScene: "ch1_reflection_summary", connChange: 0, awareChange: 0 }
        ]
    },

    "ch1_ending_connection": {
        text: "You all meet at the library. It's awkward at first, but someone makes a joke about the assignment, and you actually laugh. You have your first real conversation all week.",
        character: "Chapter 1 Outcome",
        choices: [
            { text: "View Chapter Reflection", nextScene: "ch1_reflection_summary", connChange: 0, awareChange: 0 }
        ]
    },

    "ch1_ending_retreat": {
        text: "You do your part perfectly and email it in. That night, you post a sad-ish story on Instagram at midnight. No one replies.",
        character: "Chapter 1 Outcome",
        choices: [
            { text: "View Chapter Reflection", nextScene: "ch1_reflection_summary", connChange: 0, awareChange: 0 }
        ]
    },

    "ch1_reflection_summary": {
        text: "'1 in 3 teens report feeling left out often. Many never say it out loud — not because they don't feel it, but because they've learned to hide it well.'",
        character: "Reflection Note",
        choices: [
            { text: "End of Chapter 1 Prototype", nextScene: null, connChange: 0, awareChange: 0 }
        ]
    }
};