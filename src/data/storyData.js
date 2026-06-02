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
    choices: [{ text: "End of prototype.", nextScene: null, connChange: 0, awareChange: 0 }]
  },
  "ch1_reflection_afraid": {
    text: "Reflection: Sometimes saying 'I have stuff' is just a shield for feeling afraid of not fitting in.",
    character: "System Insight",
    choices: [{ text: "End of prototype.", nextScene: null, connChange: 0, awareChange: 0 }]
  },
  "ch1_conversation_builder": {
    text: "Friend: 'just me, jaden, and sarah. it'll be super chill.'",
    character: "Text Message",
    choices: [{ text: "End of prototype.", nextScene: null, connChange: 0, awareChange: 0 }]
  }
};