import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('carbooking_chat');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        participants: [1, 2], // user IDs
        carId: 1,
        messages: [
          { id: 1, text: 'Assalomu alaykum!', senderId: 2, time: '10:28' },
          { id: 2, text: 'Mashinani soat nechida borib olsam bo\'ladi?', senderId: 2, time: '10:30' },
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('carbooking_chat', JSON.stringify(conversations));
  }, [conversations]);

  const getConversationsByUser = (userId) => {
    return conversations.filter(conv => conv.participants.includes(userId));
  };

  const sendMessage = (conversationId, senderId, text) => {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, { id: Date.now(), text, senderId, time }]
        };
      }
      return conv;
    }));
  };

  const createConversation = (user1Id, user2Id, carId) => {
    // Check if conversation already exists
    const existing = conversations.find(c => 
      c.participants.includes(user1Id) && 
      c.participants.includes(user2Id) && 
      c.carId === carId
    );

    if (existing) return existing;

    const newConv = {
      id: Date.now(),
      participants: [user1Id, user2Id],
      carId,
      messages: []
    };

    setConversations(prev => [newConv, ...prev]);
    return newConv;
  };

  const value = {
    conversations,
    getConversationsByUser,
    sendMessage,
    createConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
