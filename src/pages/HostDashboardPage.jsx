import { TrendingUp, Car, CalendarCheck, Settings, Plus, Bell, ChevronRight, Edit, XCircle, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCars } from '../contexts/CarContext';
import { useBookings } from '../contexts/BookingContext';
import toast from 'react-hot-toast';

export default function HostDashboardPage() {
  const { user } = useAuth();
  const { cars, toggleStatus, deleteCar } = useCars();
  const { getBookingsByHost, updateBookingStatus } = useBookings();
  const navigate = useNavigate();

  const myCars = cars.filter(c => c.ownerId === user?.id && c.status !== 'DELETED');
  const myBookings = getBookingsByHost(user?.id || 0);
  const pendingRequests = myBookings.filter(b => b.status === 'PENDING');
  const activeBookings = myBookings.filter(b => b.status === 'APPROVED' || b.status === 'ACTIVE');
  const completedBookings = myBookings.filter(b => b.status === 'COMPLETED');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const handleEdit = (carId) => {
    navigate(`/edit-car/${carId}`);
  };

  const handleDeleteCar = (carId) => {
    if (window.confirm("Haqiqatan ham bu avtomobilni o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!")) {
      deleteCar(carId);
      toast.success("Mashina muvaffaqiyatli o'chirildi");
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Host Dashboard</h1>
            <p className="text-slate-500">Xush kelibsiz, {user?.name || 'Sardor'}!</p>
          </div>
          <Link to="/add-car" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors">
            <Plus size={20} />
            Avto qo'shish
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-slate-500 text-sm mb-1">Jami daromad</p>
            <h3 className="text-2xl font-bold text-slate-900">{(totalEarnings / 1000).toLocaleString()} ming UZS</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <CalendarCheck size={24} />
            </div>
            <p className="text-slate-500 text-sm mb-1">Faol bronlar</p>
            <h3 className="text-2xl font-bold text-slate-900">{activeBookings.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Car size={24} />
            </div>
            <p className="text-slate-500 text-sm mb-1">Avtomobillar</p>
            <h3 className="text-2xl font-bold text-slate-900">{myCars.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
              <Bell size={24} />
            </div>
            <p className="text-slate-500 text-sm mb-1">Yangi so'rovlar</p>
            <h3 className="text-2xl font-bold text-slate-900">{pendingRequests.length}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Cars */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">Mening avtomobillarim</h3>
                <span className="text-brand-600 text-sm font-medium">{myCars.length} ta</span>
              </div>
              <div className="divide-y divide-slate-100">
                {myCars.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">Sizda hali avtomobillar yo'q.</div>
                ) : myCars.map(car => (
                  <div key={car.id} className={`p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-slate-50 transition-colors ${car.status === 'BLOCKED' ? 'opacity-60 grayscale' : ''}`}>
                    <img src={car.image || (car.photos && car.photos.length > 0 ? car.photos[0] : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800')} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'; }} alt="Car" className="w-full sm:w-32 h-24 object-cover rounded-xl" />
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-bold text-slate-900 text-lg">{car.brand} {car.model}</h4>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                        {car.status === 'ACTIVE' ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">Faol</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">Bloklangan</span>
                        )}
                        <span className="text-slate-500 text-sm">{(car.pricePerDay / 1000).toLocaleString()} ming/kun</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-end mt-4 sm:mt-0 w-full sm:w-auto">
                      <button onClick={() => handleEdit(car.id)} className="p-2 text-slate-500 hover:text-brand-600 bg-slate-100 hover:bg-brand-50 rounded-lg transition-colors" title="Tahrirlash">
                        <Edit size={18} />
                      </button>
                      {car.status === 'ACTIVE' ? (
                        <button onClick={() => { toggleStatus(car.id, 'BLOCKED'); toast.success('Mashina bloklandi va katalogdan olindi'); }} className="p-2 text-slate-500 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 rounded-lg transition-colors" title="Vaqtinchalik yashirish">
                          Bloklash
                        </button>
                      ) : (
                        <button onClick={() => { toggleStatus(car.id, 'ACTIVE'); toast.success('Mashina faollashtirildi'); }} className="p-2 text-slate-500 hover:text-green-600 bg-slate-100 hover:bg-green-50 rounded-lg transition-colors" title="Faollashtirish">
                          Faollashtirish
                        </button>
                      )}
                      <button onClick={() => handleDeleteCar(car.id)} className="p-2 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-100 rounded-lg transition-colors shadow-sm" title="O'chirish">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900">Yangi so'rovlar</h3>
              </div>
              <div className="p-6 space-y-4">
                {pendingRequests.length === 0 ? (
                  <p className="text-center text-slate-500 py-4">Hozircha yangi so'rovlar yo'q</p>
                ) : (
                  pendingRequests.map(req => (
                    <div key={req.id} className="border border-orange-200 bg-orange-50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            {req.renterName}
                            <button onClick={() => navigate('/messages')} className="text-brand-600 hover:text-brand-700 bg-brand-100 p-1 rounded-md transition-colors" title="Chat yozish">
                              <MessageSquare size={14} />
                            </button>
                          </h4>
                          <p className="text-sm font-medium text-slate-700 mt-1 mb-1">{req.renterPhone}</p>
                          <p className="text-xs text-slate-500">{req.carBrand} {req.carModel} uchun</p>
                        </div>
                        <span className="font-bold text-brand-600">{(req.totalPrice / 1000).toLocaleString()} ming UZS</span>
                      </div>
                      <div className="text-sm text-slate-700 mb-4">
                        <p>{req.startDate} - {req.endDate} ({req.totalDays} kun)</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { updateBookingStatus(req.id, 'REJECTED'); toast.error('So\'rov rad etildi'); }} className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Rad etish</button>
                        <button onClick={() => { updateBookingStatus(req.id, 'APPROVED'); toast.success('So\'rov qabul qilindi'); }} className="flex-1 bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm">Qabul qilish</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
