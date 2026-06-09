import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Car, AlertTriangle, CheckCircle, ShieldCheck, DollarSign, Search, Filter, LogOut, LayoutDashboard, Settings, FileText, Home, X, TrendingUp, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboardPage() {
  const { user, hostStatus, approveHostRole, guestStatus, approveGuestRole, isAdminAuthenticated, adminLogout } = useAuth();
  const [activeTab, setActiveTab] = useState('cars'); // 'cars', 'users', 'disputes'
  const [activeReport, setActiveReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) return null; // Avoid flicker

  const handleApproveCar = () => {
    toast.success('Avtomobil muvaffaqiyatli tasdiqlandi!', { icon: '✅' });
  };

  const handleRejectCar = () => {
    toast.success('Avtomobil rad etildi', { icon: '❌' });
  };

  const handleApproveHost = () => {
    approveHostRole();
    toast.success('Foydalanuvchi "Host" etib tasdiqlandi!', { icon: '✅' });
  };

  const handleApproveGuest = () => {
    approveGuestRole();
    toast.success('Foydalanuvchi "Guest" etib tasdiqlandi!', { icon: '✅' });
  };

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-64px)]">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 p-6 fixed h-[calc(100vh-64px)]">
        <div className="flex items-center gap-3 text-slate-900 mb-8">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Admin</h2>
            <p className="text-xs text-slate-500">Boshqaruv Paneli</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('cars')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'cars' ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Car size={20} />
            Moderatsiya
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'users' ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users size={20} />
            Foydalanuvchilar
          </button>
          <button 
            onClick={() => setActiveTab('disputes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'disputes' ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <AlertTriangle size={20} />
            Nizolar
          </button>
          
          <div className="pt-6 mt-6 border-t border-slate-100">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Umumiy Tizim</p>
            <Link 
              to="/catalog"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              <LayoutDashboard size={20} />
              Katalogga o'tish
            </Link>
            <Link 
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Home size={20} />
              Bosh sahifa
            </Link>
            <button 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Settings size={20} />
              Sozlamalar
            </button>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button 
            onClick={() => { adminLogout(); navigate('/admin/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            Tizimdan chiqish
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Umumiy ko'rsatkichlar</h1>
            <p className="text-slate-500 mt-1">Platformaning bugungi kundagi faoliyati</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <FileText size={18} />
              Hisobotlar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button onClick={() => setActiveReport('finance')} className="text-left bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
              <DollarSign size={64} className="text-green-600" />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Jami daromad</p>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">45.2M <span className="text-lg text-slate-400">UZS</span></h3>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <span className="bg-green-100 px-2 py-0.5 rounded-md">+12%</span> o'tgan oydan
            </div>
          </button>
          
          <button onClick={() => setActiveReport('users')} className="text-left bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
              <Users size={64} className="text-blue-600" />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Faol Foydalanuvchilar</p>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">1,248</h3>
            <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
              <span className="bg-blue-100 px-2 py-0.5 rounded-md">+45</span> yangi
            </div>
          </button>

          <button onClick={() => setActiveReport('cars')} className="text-left bg-gradient-to-br from-brand-600 to-brand-800 p-6 rounded-2xl shadow-lg shadow-brand-500/20 text-white hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
              <Car size={64} className="text-white" />
            </div>
            <p className="text-brand-100 text-sm font-medium mb-1">Kutayotgan Avtomobillar</p>
            <h3 className="text-3xl font-bold mb-2">12</h3>
            <div className="flex items-center gap-1 text-brand-100 text-sm font-medium">
              zudlik bilan ko'rib chiqish kerak
            </div>
          </button>

          <button onClick={() => setActiveReport('disputes')} className="text-left bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
              <AlertTriangle size={64} className="text-red-600" />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Ochiq Nizolar</p>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">3</h3>
            <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
              <span className="bg-red-100 px-2 py-0.5 rounded-md">Muhim</span>
            </div>
          </button>
        </div>

        {/* Dynamic Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* Mobile Tabs (only visible on mobile since desktop has sidebar) */}
          <div className="flex md:hidden border-b border-slate-100 px-4 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('cars')}
              className={`px-4 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'cars' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`}
            >
              Mashinalar
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'users' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`}
            >
              Foydalanuvchilar
            </button>
            <button 
              onClick={() => setActiveTab('disputes')}
              className={`px-4 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'disputes' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`}
            >
              Nizolar
            </button>
          </div>

          {/* Filters */}
          <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 hidden md:block">
              {activeTab === 'cars' && 'Avtomobillar moderatsiyasi'}
              {activeTab === 'users' && 'Foydalanuvchilar va arizalar'}
              {activeTab === 'disputes' && 'Nizolar va Shikoyatlar'}
            </h2>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Qidirish..." 
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm shadow-sm transition-shadow"
                />
              </div>
              <button className="flex items-center gap-2 text-slate-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors">
                <Filter size={18} /> <span className="hidden sm:inline">Filtrlar</span>
              </button>
            </div>
          </div>

          {/* Content: Moderation */}
          {activeTab === 'cars' && (
            <div className="divide-y divide-slate-100">
              {/* Item 1 */}
              <div className="p-6 flex flex-col xl:flex-row gap-6 items-start xl:items-center hover:bg-slate-50/50 transition-colors">
                <div className="w-full xl:w-48 h-32 rounded-xl overflow-hidden relative shadow-sm shrink-0">
                  <img src="https://images.unsplash.com/photo-1550443621-e0c80b62e49c?auto=format&fit=crop&q=80&w=400" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'; }} alt="Car" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">#1024</div>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Chevrolet Tracker 2023</h3>
                      <p className="text-slate-500 text-sm mt-1">Egasi: Odiljonov T. (+998 90 111 22 33)</p>
                    </div>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                      Kutmoqda
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Narx (kuniga)</p>
                      <p className="font-bold text-slate-900">350,000 UZS</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Davlat raqami</p>
                      <p className="font-bold text-slate-900">01 A 123 AB</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Manzil</p>
                      <p className="font-bold text-slate-900 truncate">Chilonzor tumani</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Yurgan masofasi</p>
                      <p className="font-bold text-slate-900">45,000 km</p>
                    </div>
                  </div>
                </div>
                <div className="w-full xl:w-auto flex flex-row xl:flex-col gap-3 mt-4 xl:mt-0 shrink-0">
                  <button onClick={handleApproveCar} className="flex-1 xl:flex-none bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-brand-500/30 text-sm flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> Tasdiqlash
                  </button>
                  <button onClick={handleRejectCar} className="flex-1 xl:flex-none bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
                    Rad etish
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-6 flex flex-col xl:flex-row gap-6 items-start xl:items-center hover:bg-slate-50/50 transition-colors">
                <div className="w-full xl:w-48 h-32 rounded-xl overflow-hidden relative shadow-sm shrink-0">
                  <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'; }} alt="Car" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">#1025</div>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Kia K5 2022</h3>
                      <p className="text-slate-500 text-sm mt-1">Egasi: Rustamov A. (+998 99 999 88 77)</p>
                    </div>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                      Kutmoqda
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Narx (kuniga)</p>
                      <p className="font-bold text-slate-900">500,000 UZS</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Davlat raqami</p>
                      <p className="font-bold text-slate-900">01 X 777 XX</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Manzil</p>
                      <p className="font-bold text-slate-900 truncate">Yunusobod tumani</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Yurgan masofasi</p>
                      <p className="font-bold text-slate-900">12,000 km</p>
                    </div>
                  </div>
                </div>
                <div className="w-full xl:w-auto flex flex-row-reverse xl:flex-col gap-3 mt-4 xl:mt-0 shrink-0">
                  <button onClick={handleApproveCar} className="flex-1 xl:flex-none bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-brand-500/30 text-sm flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> Tasdiqlash
                  </button>
                  <button onClick={handleRejectCar} className="flex-1 xl:flex-none bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
                    Rad etish
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="divide-y divide-slate-100">
              {/* Show current user's pending request if they applied */}
              {hostStatus === 'PENDING' && (
                <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-slate-50/50 transition-colors">
                  <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-inner">
                    {user?.name?.[0] || 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{user?.name || 'Aziz'}</h3>
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-200">Ariza kutmoqda</span>
                    </div>
                    <p className="text-slate-500 text-sm">{user?.phone || '+998 90 123 45 67'} • Ijarachi</p>
                    <div className="mt-3 text-sm text-slate-700 bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <strong className="text-amber-900 block mb-1">Host bo'lish uchun ariza:</strong> 
                      "O'z avtomobilimni ijaraga bermoqchiman. Barcha hujjatlarim joyida, ishonchli insonman."
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex flex-row-reverse md:flex-col gap-2 mt-4 md:mt-0">
                    <button onClick={handleApproveHost} className="flex-1 md:flex-none bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm flex justify-center items-center gap-2">
                      <CheckCircle size={16} /> Tasdiqlash
                    </button>
                    <button className="flex-1 md:flex-none bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
                      Rad etish
                    </button>
                  </div>
                </div>
              )}
              
              {guestStatus === 'PENDING' && (
                <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-slate-50/50 transition-colors">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-inner">
                    {user?.name?.[0] || 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{user?.name || 'Aziz'}</h3>
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-200">Ariza kutmoqda</span>
                    </div>
                    <p className="text-slate-500 text-sm">{user?.phone || '+998 90 123 45 67'} • Host</p>
                    <div className="mt-3 text-sm text-slate-700 bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <strong className="text-amber-900 block mb-1">Guest bo'lish uchun ariza (Ijarachilikdan chiqish):</strong> 
                      "Avtomobilimni ijaraga berishni to'xtatmoqchiman. Meni oddiy mijoz (Guest) roliga o'tkazing."
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex flex-row-reverse md:flex-col gap-2 mt-4 md:mt-0">
                    <button onClick={handleApproveGuest} className="flex-1 md:flex-none bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm flex justify-center items-center gap-2">
                      <CheckCircle size={16} /> Tasdiqlash
                    </button>
                    <button className="flex-1 md:flex-none bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
                      Rad etish
                    </button>
                  </div>
                </div>
              )}

              {hostStatus !== 'PENDING' && guestStatus !== 'PENDING' && (
                <div className="p-16 flex flex-col items-center justify-center text-slate-500">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-1">Barchasi toza</h3>
                  <p className="text-sm">Hozircha ko'rib chiqilishi kerak bo'lgan yangi arizalar yo'q.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'disputes' && (
            <div className="p-16 flex flex-col items-center justify-center text-slate-500">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle size={40} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">Nizolar yo'q</h3>
                <p className="text-sm">Hozircha tizimda hech qanday ochiq nizo qayd etilmagan.</p>
            </div>
          )}

        </div>
      </main>

      {/* Report Modal */}
      {activeReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setActiveReport(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">
                {activeReport === 'finance' && 'Moliyaviy Hisobot (Daromadlar)'}
                {activeReport === 'users' && 'Foydalanuvchilar Statistikasi'}
                {activeReport === 'cars' && 'Avtomobillar Holati'}
                {activeReport === 'disputes' && 'Nizolar Analitikasi'}
              </h2>
              <button onClick={() => setActiveReport(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 rounded-full transition-colors shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {activeReport === 'finance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-sm text-slate-500 mb-1">Oylik tushum</p>
                       <p className="text-2xl font-bold text-slate-900">12.4M UZS</p>
                     </div>
                     <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
                       <p className="text-sm text-green-700 mb-1">Sof daromad (10%)</p>
                       <p className="text-2xl font-bold text-green-700">1.24M UZS</p>
                     </div>
                     <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-sm text-slate-500 mb-1">Kutilayotgan tushum</p>
                       <p className="text-2xl font-bold text-slate-900">3.1M UZS</p>
                     </div>
                  </div>
                  <div className="h-64 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center flex-col text-slate-400 relative overflow-hidden">
                     <TrendingUp size={48} className="mb-3 opacity-20" />
                     <p className="font-medium text-slate-500">Daromadlar o'sish grafigi</p>
                     <p className="text-sm mt-1 text-slate-400">Joriy oy ko'rsatkichlari bo'yicha vizualizatsiya</p>
                  </div>
                </div>
              )}
              
              {activeReport === 'users' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                       <div>
                         <p className="text-sm text-blue-700 mb-1">Yangi foydalanuvchilar (7 kun)</p>
                         <p className="text-2xl font-bold text-blue-700">+45 ta</p>
                       </div>
                       <Users size={32} className="text-blue-200" />
                     </div>
                     <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                       <div>
                         <p className="text-sm text-slate-500 mb-1">Tasdiqlangan ijarachilar (Host)</p>
                         <p className="text-2xl font-bold text-slate-900">342 ta</p>
                       </div>
                       <ShieldCheck size={32} className="text-slate-200" />
                     </div>
                   </div>
                   <div className="h-64 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center flex-col text-slate-400">
                     <Users size={48} className="mb-3 opacity-20" />
                     <p className="font-medium text-slate-500">Demografik ma'lumotlar grafigi</p>
                   </div>
                </div>
              )}

              {activeReport === 'cars' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-sm text-slate-500 mb-1">Jami tizimdagi mashinalar</p>
                       <p className="text-2xl font-bold text-slate-900">856 ta</p>
                     </div>
                     <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100">
                       <p className="text-sm text-brand-700 mb-1">Ayni vaqt ijarada</p>
                       <p className="text-2xl font-bold text-brand-700">124 ta</p>
                     </div>
                     <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                       <p className="text-sm text-orange-700 mb-1">Moderatsiya kutmoqda</p>
                       <p className="text-2xl font-bold text-orange-700">12 ta</p>
                     </div>
                   </div>
                   <div className="h-64 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center flex-col text-slate-400">
                     <Car size={48} className="mb-3 opacity-20" />
                     <p className="font-medium text-slate-500">Mashinalar bandligi vizualizatsiyasi</p>
                   </div>
                </div>
              )}

              {activeReport === 'disputes' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                       <p className="text-sm text-red-600 mb-1">Ochiq qolgan nizolar</p>
                       <p className="text-2xl font-bold text-red-700">3 ta</p>
                     </div>
                     <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
                       <p className="text-sm text-green-700 mb-1">Haftalik hal qilinganlar</p>
                       <p className="text-2xl font-bold text-green-700">14 ta</p>
                     </div>
                   </div>
                   <div className="space-y-3 mt-4">
                     <p className="font-bold text-slate-800">So'nggi nizolar ro'yxati</p>
                     <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm flex justify-between items-center hover:bg-slate-50 transition-colors cursor-pointer">
                       <div className="flex items-center gap-3">
                         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                         <span className="font-medium text-slate-700">#D-092: Mashina chizilgan holatda qaytarilgan</span>
                       </div>
                       <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">Ochiq</span>
                     </div>
                     <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm flex justify-between items-center hover:bg-slate-50 transition-colors cursor-pointer">
                       <div className="flex items-center gap-3">
                         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                         <span className="font-medium text-slate-700">#D-091: Mijoz kechikib qaytardi, to'lov muammosi</span>
                       </div>
                       <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">Ochiq</span>
                     </div>
                   </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-brand-600 font-medium transition-colors shadow-sm">
                <Download size={18} /> PDF yuklab olish
              </button>
              <button onClick={() => setActiveReport(null)} className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 shadow-sm shadow-brand-500/30 transition-colors">
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
