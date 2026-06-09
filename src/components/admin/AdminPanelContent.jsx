import { useState } from 'react';
import { Users, Car, AlertTriangle, CheckCircle, ShieldCheck, DollarSign, Search, Filter, X, TrendingUp, XCircle, FileText, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCars } from '../../contexts/CarContext';

export default function AdminPanelContent() {
  const [adminTab, setAdminTab] = useState('cars');
  const [activeReport, setActiveReport] = useState(null);

  const { cars, toggleStatus, deleteCar } = useCars();

  // MOCK DATA: USERS
  const [users, setUsers] = useState([
    { id: 1, name: 'Sardor Ibrohimov', phone: '+998 90 123 45 67', role: 'HOST', docStatus: 'VERIFIED', status: 'ACTIVE' },
    { id: 2, name: 'Aziz R.', phone: '+998 99 987 65 43', role: 'HOST', docStatus: 'VERIFIED', status: 'ACTIVE' },
    { id: 3, name: 'Javohir T.', phone: '+998 93 111 22 33', role: 'GUEST', docStatus: 'NONE', status: 'ACTIVE' },
    { id: 4, name: 'Nodira K.', phone: '+998 97 777 88 99', role: 'HOST', docStatus: 'VERIFIED', status: 'BLOCKED' },
  ]);

  // MOCK DATA: BOOKINGS
  const [bookings, setBookings] = useState([
    { id: 101, carName: 'Hyundai Sonata', user: 'Javohir T.', dates: '10 Iyun - 12 Iyun', amount: '900,000 UZS', status: 'ACTIVE' },
    { id: 102, carName: 'Chevrolet Tracker', user: 'Aziz Rakhimov', dates: '15 Iyun - 16 Iyun', amount: '350,000 UZS', status: 'COMPLETED' },
    { id: 103, carName: 'Kia K5', user: 'Rustam M.', dates: '20 Iyun - 25 Iyun', amount: '2,000,000 UZS', status: 'CANCELLED' }
  ]);

  // ACTIONS FOR USERS
  const updateUserStatus = (id, newStatus) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    toast.success(`Foydalanuvchi holati o'zgartirildi: ${newStatus}`);
  };

  const verifyUserDocs = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, docStatus: 'VERIFIED', role: 'HOST' } : u));
    toast.success('Hujjatlar tasdiqlandi va foydalanuvchi HOST roliga o\'tdi!', { icon: '✅' });
  };

  // ACTIONS FOR BOOKINGS
  const cancelBooking = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    toast.success('Ijara bekor qilindi', { icon: '⚠️' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-brand-600" /> To'liq Boshqaruv (100%)
          </h1>
          <p className="text-slate-500 text-sm mt-1">Platformadagi barcha ma'lumotlarni cheklovlarsiz boshqarish.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => setActiveReport('finance')} className="text-left bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group cursor-pointer">
          <DollarSign size={48} className="absolute top-4 right-4 text-green-600 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all" />
          <p className="text-slate-500 text-xs font-medium mb-1">Jami daromad</p>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">45.2M <span className="text-sm text-slate-400">UZS</span></h3>
          <div className="text-green-600 text-xs font-medium bg-green-50 inline-block px-2 py-0.5 rounded-md">+12% joriy oy</div>
        </button>
        
        <button onClick={() => setActiveReport('users')} className="text-left bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group cursor-pointer">
          <Users size={48} className="absolute top-4 right-4 text-blue-600 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all" />
          <p className="text-slate-500 text-xs font-medium mb-1">Jami Foydalanuvchilar</p>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{users.length}</h3>
          <div className="text-blue-600 text-xs font-medium bg-blue-50 inline-block px-2 py-0.5 rounded-md">Barchasi</div>
        </button>

        <button onClick={() => setActiveReport('cars')} className="text-left bg-gradient-to-br from-brand-600 to-brand-800 p-5 rounded-2xl shadow-sm text-white hover:shadow-md transition-all relative overflow-hidden group cursor-pointer">
          <Car size={48} className="absolute top-4 right-4 text-white opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all" />
          <p className="text-brand-100 text-xs font-medium mb-1">Jami Avtomobillar</p>
          <h3 className="text-2xl font-bold mb-1">{cars.length}</h3>
          <div className="text-brand-100 text-xs font-medium">Barchasi</div>
        </button>

        <button onClick={() => setActiveReport('disputes')} className="text-left bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group cursor-pointer">
          <Calendar size={48} className="absolute top-4 right-4 text-purple-600 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all" />
          <p className="text-slate-500 text-xs font-medium mb-1">Jami Ijaralar</p>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{bookings.length}</h3>
          <div className="text-purple-600 text-xs font-medium bg-purple-50 inline-block px-2 py-0.5 rounded-md">Tarix</div>
        </button>
      </div>

      {/* Admin Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 px-4 overflow-x-auto">
          <button onClick={() => setAdminTab('cars')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${adminTab === 'cars' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`}><Car size={16}/> Avtomobillar</button>
          <button onClick={() => setAdminTab('users')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${adminTab === 'users' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`}><Users size={16}/> Foydalanuvchilar</button>
          <button onClick={() => setAdminTab('bookings')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${adminTab === 'bookings' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`}><Calendar size={16}/> Ijaralar tarixi</button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Qidirish..." className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <button className="flex items-center gap-2 text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Filter size={16} /> <span className="hidden sm:inline">Filtr</span>
          </button>
        </div>

        {adminTab === 'cars' && (
          <div className="divide-y divide-slate-100">
            {cars.map(car => (
              <div key={car.id} className={`p-4 flex flex-col xl:flex-row gap-4 items-start xl:items-center hover:bg-slate-50/50 transition-colors ${car.status === 'BLOCKED' ? 'opacity-60 grayscale' : ''}`}>
                <img src={car.image || 'https://images.unsplash.com/photo-1550443621-e0c80b62e49c?auto=format&fit=crop&q=80&w=200'} alt={car.brand} className="w-full xl:w-32 h-24 object-cover rounded-xl shadow-sm" />
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900">{car.brand} {car.model} ({car.year})</h3>
                      <p className="text-slate-500 text-xs">Egasi: ID-{car.ownerId}</p>
                    </div>
                    {car.status === 'PENDING' && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold border border-orange-200">Kutmoqda</span>}
                    {car.status === 'ACTIVE' && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold border border-green-200">Faol</span>}
                    {car.status === 'BLOCKED' && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold border border-red-200">Bloklangan</span>}
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="font-medium">{(car.pricePerDay / 1000).toLocaleString()} ming/kun</span>
                    <span className="text-slate-500">{car.fuelType}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full xl:w-auto mt-2 xl:mt-0">
                  {car.status === 'ACTIVE' && (
                    <button onClick={() => { toggleStatus(car.id, 'BLOCKED'); toast.success('Mashina bloklandi'); }} className="flex-1 xl:flex-none bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-200">Bloklash</button>
                  )}
                  {car.status === 'BLOCKED' && (
                    <button onClick={() => { toggleStatus(car.id, 'ACTIVE'); toast.success('Mashina faollashtirildi'); }} className="flex-1 xl:flex-none bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-900">Tiklash</button>
                  )}
                  <button onClick={() => { deleteCar(car.id); toast.success('Mashina o\'chirildi'); }} className="flex-none bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-100" title="O'chirish"><XCircle size={20} /></button>
                </div>
              </div>
            )).filter(c => c.status !== 'DELETED')}
          </div>
        )}

        {adminTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-sm font-medium text-slate-500">Foydalanuvchi</th>
                  <th className="p-4 text-sm font-medium text-slate-500">Hujjatlar</th>
                  <th className="p-4 text-sm font-medium text-slate-500">Rol</th>
                  <th className="p-4 text-sm font-medium text-slate-500">Holat</th>
                  <th className="p-4 text-sm font-medium text-slate-500 text-right">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className={`hover:bg-slate-50/50 transition-colors ${u.status === 'BLOCKED' ? 'bg-red-50/30' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">{u.name[0]}</div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {u.docStatus === 'VERIFIED' && <span className="text-green-600 flex items-center gap-1 text-xs font-bold"><CheckCircle size={14}/> Tasdiqlangan</span>}
                      {u.docStatus === 'PENDING' && <span className="text-orange-600 flex items-center gap-1 text-xs font-bold"><FileText size={14}/> Kutmoqda</span>}
                      {u.docStatus === 'NONE' && <span className="text-red-500 flex items-center gap-1 text-xs font-bold"><AlertTriangle size={14}/> Yo'q</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${u.role === 'HOST' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>{u.role}</span>
                    </td>
                    <td className="p-4">
                      {u.status === 'ACTIVE' ? <span className="text-green-600 text-xs font-bold">Faol</span> : <span className="text-red-600 text-xs font-bold">Bloklangan</span>}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      {u.docStatus === 'PENDING' && (
                        <button onClick={() => verifyUserDocs(u.id)} className="px-3 py-1 bg-brand-600 text-white rounded-lg text-xs font-medium hover:bg-brand-700">Tasdiqlash</button>
                      )}
                      {u.status === 'ACTIVE' ? (
                        <button onClick={() => updateUserStatus(u.id, 'BLOCKED')} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">Bloklash</button>
                      ) : (
                        <button onClick={() => updateUserStatus(u.id, 'ACTIVE')} className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100">Tiklash</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === 'bookings' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-sm font-medium text-slate-500">ID</th>
                  <th className="p-4 text-sm font-medium text-slate-500">Avtomobil</th>
                  <th className="p-4 text-sm font-medium text-slate-500">Mijoz</th>
                  <th className="p-4 text-sm font-medium text-slate-500">Sanalar</th>
                  <th className="p-4 text-sm font-medium text-slate-500">Holat</th>
                  <th className="p-4 text-sm font-medium text-slate-500 text-right">Harakat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-900">#{b.id}</td>
                    <td className="p-4 text-sm font-bold text-brand-600">{b.carName}</td>
                    <td className="p-4 text-sm text-slate-700">{b.user}</td>
                    <td className="p-4 text-xs text-slate-500">{b.dates}</td>
                    <td className="p-4">
                      {b.status === 'ACTIVE' && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">Jarayonda</span>}
                      {b.status === 'COMPLETED' && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">Yakunlangan</span>}
                      {b.status === 'CANCELLED' && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">Bekor qilingan</span>}
                    </td>
                    <td className="p-4 text-right">
                      {b.status === 'ACTIVE' && (
                        <button onClick={() => cancelBooking(b.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">To'xtatish</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal remains the same */}
      {activeReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setActiveReport(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Hisobot Detallari</h2>
              <button onClick={() => setActiveReport(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 text-center text-slate-500">
              <TrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
              <p>Siz <b>{activeReport}</b> bo'yicha to'liq hisobotni ko'ryapsiz.</p>
              <p className="text-sm mt-2">Bu yerda jami ma'lumotlar vizual grafiklar bilan taqdim etiladi.</p>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button onClick={() => setActiveReport(null)} className="px-5 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700">Yopish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
