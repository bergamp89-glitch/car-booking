import { useState, useEffect } from 'react';
import { Send, Phone, MoreVertical, Search, CheckCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useLocation } from 'react-router-dom';

export default function MessagesPage() {
  const { user } = useAuth();
  const { conversations, getConversationsByUser, sendMessage, createConversation } = useChat();
  const location = useLocation();

  const myConversations = getConversationsByUser(user?.id || 1);
  const [activeConvId, setActiveConvId] = useState(myConversations.length > 0 ? myConversations[0].id : null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.targetHost) {
      const { targetHost, targetCar } = location.state;
      const targetHostId = targetHost?.id || 2;
      const myId = user?.id || 1;
      const carId = targetCar?.id || 1;
      
      const newConv = createConversation(myId, targetHostId, carId);
      setActiveConvId(newConv.id);
    }
  }, [location.state, user]);

  const activeConv = myConversations.find(c => c.id === activeConvId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId) return;
    sendMessage(activeConvId, user?.id || 1, newMessage);
    setNewMessage('');
  };

  const getOtherParticipant = (conv) => {
    const isHost = user?.role === 'HOST'; // rough check
    return {
      name: isHost ? 'Ijarachi' : 'Avto egasi',
      avatar: isHost ? 'I' : 'A',
      phone: '+998 90 000 00 00',
      active: true,
      lastMessage: conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].text : 'Yangi suhbat...',
      time: conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].time : 'Hozir',
      unread: 0
    };
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-100px)]">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex h-full overflow-hidden">
          
          {/* Sidebar - Contacts */}
          <div className="w-full md:w-80 border-r border-slate-100 flex flex-col hidden md:flex">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Xabarlar</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Qidirish..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {myConversations.map(conv => {
                const other = getOtherParticipant(conv);
                return (
                  <button 
                    key={conv.id} 
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 flex items-start gap-3 ${activeConvId === conv.id ? 'bg-brand-50 hover:bg-brand-50' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg relative flex-shrink-0">
                      {other.avatar}
                      {other.active && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{other.name}</h4>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{other.time}</span>
                      </div>
                      {other.phone && (
                        <p className="text-xs text-brand-600 mb-1">{other.phone}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate pr-2 ${other.unread > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>{other.lastMessage}</p>
                        {other.unread > 0 && (
                          <span className="bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{other.unread}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col w-full">
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="h-16 border-b border-slate-100 flex justify-between items-center px-6 bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
                      {getOtherParticipant(activeConv).avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight flex items-center gap-2">
                        {getOtherParticipant(activeConv).name}
                        {getOtherParticipant(activeConv).phone && (
                          <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{getOtherParticipant(activeConv).phone}</span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500">Mashina ID: {activeConv.carId} - ijara bo'yicha</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <button className="hover:text-brand-600 transition-colors"><Phone size={20} /></button>
                    <button className="hover:text-brand-600 transition-colors"><MoreVertical size={20} /></button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
                  <div className="text-center text-xs text-slate-400 my-4">Suhbat boshlandi</div>
                  
                  {activeConv.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.senderId === user?.id ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <div className={`text-[10px] flex justify-end items-center gap-1 mt-1 ${msg.senderId === user?.id ? 'text-brand-200' : 'text-slate-400'}`}>
                          {msg.time}
                          {msg.senderId === user?.id && <CheckCheck size={12} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                Chatni boshlash uchun chap tomondan suhbatdoshni tanlang.
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Xabar yozing..." 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
