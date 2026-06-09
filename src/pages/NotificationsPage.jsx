import { Bell, CheckCircle, Car, User, AlertTriangle, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Sizning 'Malibu 2' avtomobilingiz bron qilindi.", time: "10 daqiqa oldin", unread: true, type: 'booking' },
    { id: 2, text: "Host bo'lish arizangiz tasdiqlandi!", time: "1 soat oldin", unread: false, type: 'success' },
    { id: 3, text: "Yangi xabar: 'Assalomu alaykum, mashina bo'shmi?'", time: "2 kun oldin", unread: false, type: 'message' },
    { id: 4, text: "Xavfsizlik: Parolingiz muvaffaqiyatli o'zgartirildi.", time: "1 hafta oldin", unread: false, type: 'security' }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const clearAllNotifications = () => {
    if (window.confirm("Barcha bildirishnomalarni o'chirib tashlashni tasdiqlaysizmi?")) {
      setNotifications([]);
    }
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'booking': return <Car size={24} className="text-brand-600" />;
      case 'success': return <CheckCircle size={24} className="text-green-600" />;
      case 'message': return <User size={24} className="text-blue-600" />;
      case 'security': return <AlertTriangle size={24} className="text-orange-600" />;
      default: return <Bell size={24} className="text-slate-600" />;
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'booking': return 'bg-brand-100';
      case 'success': return 'bg-green-100';
      case 'message': return 'bg-blue-100';
      case 'security': return 'bg-orange-100';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Bell className="text-brand-600" /> Bildirishnomalar
            </h1>
            <p className="text-slate-500 mt-1">Sizning so'nggi xabarlar va yangiliklaringiz</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {notifications.some(n => n.unread) && (
              <button 
                onClick={markAllAsRead}
                className="text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-colors"
              >
                Barchasini o'qilgan deb belgilash
              </button>
            )}
            {notifications.length > 0 && (
              <button 
                onClick={clearAllNotifications}
                className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
              >
                <Trash2 size={16} /> Barchasini o'chirish
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <Bell size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium text-slate-700">Hozircha bildirishnomalar yo'q</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map(notif => (
                <div 
                  key={notif.id} 
                  onClick={() => markAsRead(notif.id)}
                  className={`group p-6 flex items-start gap-4 transition-colors cursor-pointer ${notif.unread ? 'bg-brand-50/20 hover:bg-brand-50/40' : 'hover:bg-slate-50'}`}
                >
                  <div className={`p-3 rounded-full shrink-0 ${getBgColor(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-base ${notif.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {notif.text}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{notif.time}</p>
                  </div>
                  {notif.unread && (
                    <div className="w-3 h-3 bg-brand-600 rounded-full mt-2 shrink-0"></div>
                  )}
                  <button 
                    onClick={(e) => deleteNotification(notif.id, e)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 shrink-0 opacity-0 group-hover:opacity-100"
                    title="O'chirish"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
