export const storyData = {
  // --- SCENE 2: HALLWAY ---
  "ch1_after_school_text": {
    text: "PREETHI: 'we're going to jaden's later. u should come!!'\n\nPLAYER: That's a pretty normal invitation. So why's she staring at it like it's a maths exam?\n\nAVERY: Maybe because saying yes is easy. Going is the hard part.",
    character: "Hallway",
    choices: [
      { 
        text: "'yeah maybe!'", 
        nextScene: "ch1_text_maybe", 
        connChange: -5, 
        awareChange: +2 
      },
      { 
        text: "'i can't, got stuff'", 
        nextScene: "ch1_text_stuff", 
        connChange: -10, 
        awareChange: +5 
      },
      { 
        text: "'who else is going?'", 
        nextScene: "ch1_text_who", 
        connChange: +5, 
        awareChange: +10 
      }
    ]
  },

  // --- TEXT BRANCH OUTCOMES ---
  "ch1_text_maybe": {
    text: "MAYA: 'yeah maybe!'\nPREETHI: 'okayyy let me know!!'\n\nPLAYER: Well that was quick.\n\nAVERY: Notice she didn't actually say yes.\n\nPLAYER: She didn't say no either.\n\nAVERY: That's usually why people say maybe.",
    character: "Avery & Player",
    choices: [
      { text: "Follow Maya home.", nextScene: "ch1_mayas_room", connChange: 0, awareChange: 0 }
    ]
  },

  "ch1_text_stuff": {
    text: "MAYA: 'i can't, got stuff'\nPREETHI: 'aww okay:('\n\nPLAYER: That felt easy.\n\nAVERY: Too easy. I think she answered a little too quickly.",
    character: "Avery & Player",
    choices: [
      { text: "Follow Maya home.", nextScene: "ch1_mayas_room", connChange: 0, awareChange: 0 }
    ]
  },

  "ch1_text_who": {
    text: "MAYA: 'who else is going?'\nPREETHI: 'pretty much everyone lol'\n\nPLAYER: Ouch. That sounded like it hurt.\n\nAVERY: Because suddenly it's not a hangout anymore. It's everybody.",
    character: "Avery & Player",
    // Note: This still routes to your Conversation Builder mini-game so you don't lose that feature!
    choices: [
      { text: "Help Maya construct a reply.", nextScene: "ch1_conversation_builder", connChange: 0, awareChange: 0 }
    ]
  },

  // --- SCENE 3: MAYA'S ROOM ---
  "ch1_mayas_room": {
    text: "Maya arrives home. The room is tidy but unfinished. A moving box sits beside her desk. She drops onto her bed and opens Instagram. \n\nScroll. Scroll. Birthday party. Beach trip. Group selfie.",
    character: "Maya's Room",
    choices: [
      { text: "Keep watching.", nextScene: "ch1_mayas_room_2", connChange: 0, awareChange: 0 }
    ]
  },

  "ch1_mayas_room_2": {
    text: "PLAYER: She isn't doing anything. No comments. No messages. She's just... Watching?\n\nAVERY: Exactly. The photo could've meant nothing. The lunch could've meant nothing. The way she sat could've meant nothing. But all together...\n\nPLAYER: They're starting to look like a pattern.",
    character: "Avery & Player",
    choices: [
      { text: "Let's take a closer look.", nextScene: "ch1_instagram_minigame", connChange: 0, awareChange: 0 }
    ]
  },

  // --- BRANCHING EVENT (Kept from previous steps to maintain a working loop) ---
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
      { text: "End of Prototype.", nextScene: null, connChange: 0, awareChange: 0 }
    ]
  },

  "ch1_ending_connection": {
    text: "You all meet at the library. It's awkward at first, but someone makes a joke about the assignment, and you actually laugh. You have your first real conversation all week.",
    character: "Chapter 1 Outcome",
    choices: [
      { text: "End of Prototype.", nextScene: null, connChange: 0, awareChange: 0 }
    ]
  },

  "ch1_ending_retreat": {
    text: "You do your part perfectly and email it in. That night, you post a sad-ish story on Instagram at midnight. No one replies.",
    character: "Chapter 1 Outcome",
    choices: [
      { text: "End of Prototype.", nextScene: null, connChange: 0, awareChange: 0 }
    ]
  }
};