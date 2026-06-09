import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCars } from '../contexts/CarContext';
import { CheckCircle2, MessageSquare, Phone, Settings2, Fuel, Users } from 'lucide-react';

export default function HostProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars: allCars } = useCars();
  
  const hostId = parseInt(id);
  const hostCars = allCars.filter(c => c.ownerId === hostId && c.status === 'ACTIVE');
  
  if (!hostCars || hostCars.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Host topilmadi</h2>
          <p className="text-slate-500 mb-6">Bunday e'lon egasi mavjud emas yoki uning faol e'lonlari yo'q.</p>
          <button onClick={() => navigate(-1)} className="bg-brand-600 text-white px-6 py-2 rounded-xl font-medium">Orqaga qaytish</button>
        </div>
      </div>
    );
  }

  const host = hostCars[0].owner;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Host Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative">
                <div className="w-24 h-24 bg-[#e0f7f4] rounded-full flex items-center justify-center text-[#117a6b] text-4xl font-bold flex-shrink-0 border-4 border-white shadow-sm">
                  {host?.name?.charAt(0) || 'H'}
                </div>
                {host?.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                    <CheckCircle2 size={24} className="text-[#593cfb] fill-[#e6e2fe]" />
                  </div>
                )}
              </div>
              
              <div className="mt-2">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{host?.name || 'Avto egasi'}</h1>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-slate-600 mb-4">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Phone size={18} className="text-slate-400" />
                    <span>{host?.phone || '+998 90 000 00 00'}</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                  {hostCars.length} ta avtomobil ijaraga qo'yilgan
                </p>
              </div>
            </div>

            <div className="flex w-full md:w-auto mt-4 md:mt-0">
              <button 
                onClick={() => navigate('/messages', { state: { targetHost: host, targetCar: hostCars[0] } })} 
                className="w-full md:w-auto bg-[#593cfb] hover:bg-[#4828ec] text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare size={20} />
                Chatga o'tish
              </button>
            </div>
          </div>
        </div>

        {/* Host's Cars */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{host?.name}ning avtomobillari ({hostCars.length})</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostCars.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                <div className="h-48 overflow-hidden relative">
                  <img src={car.image || (car.photos && car.photos.length > 0 ? car.photos[0] : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800')} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'; }} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {car.owner?.verified && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-green-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <CheckCircle2 size={12} /> Ishonchli
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-xl text-slate-900">{car.brand} {car.model}</h3>
                      <p className="text-slate-500 text-sm">{car.year} yil</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 mt-2 bg-slate-50 p-2 rounded-lg">
                    <div className="flex items-center gap-1" title="Uzatma qutisi"><Settings2 size={16} className="text-slate-400" /> {car.transmission || 'Avtomat'}</div>
                    <div className="flex items-center gap-1" title="Yoqilg'i"><Fuel size={16} className="text-slate-400" /> {car.fuel || 'Benzin'}</div>
                    <div className="flex items-center gap-1" title="O'rindiqlar"><Users size={16} className="text-slate-400" /> {car.seats || 5}</div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {car.pricePerDay ? (
                        <>
                          <p className="text-xs text-slate-500">Kunlik ijara</p>
                          <p className="font-bold text-lg text-brand-600">{(car.pricePerDay / 1000).toLocaleString()} ming {car.currency || 'UZS'}</p>
                        </>
                      ) : car.pricePerWeek ? (
                        <>
                          <p className="text-xs text-slate-500">Haftalik ijara</p>
                          <p className="font-bold text-lg text-brand-600">{(car.pricePerWeek / 1000).toLocaleString()} ming {car.currency || 'UZS'}</p>
                        </>
                      ) : car.pricePerMonth ? (
                        <>
                          <p className="text-xs text-slate-500">Oylik ijara</p>
                          <p className="font-bold text-lg text-brand-600">{(car.pricePerMonth / 1000).toLocaleString()} ming {car.currency || 'UZS'}</p>
                        </>
                      ) : (
                        <p className="text-xs text-slate-500">Narx belgilanmagan</p>
                      )}
                    </div>
                    <Link to={`/car/${car.id}`} className="bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold px-5 py-2.5 rounded-xl transition-colors">
                      Batafsil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
