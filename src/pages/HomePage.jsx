import { Search, MapPin, Calendar, ArrowRight, ShieldCheck, Clock, Settings2, Fuel, Users, ChevronRight, PlayCircle, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCars } from '../contexts/CarContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { cars } = useCars();
  const activeCars = cars.filter(c => c.status === 'ACTIVE');

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="relative overflow-hidden pt-32 pb-32 md:pt-40 md:pb-40">
        {/* Full background image of BMW */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat"></div>
        
        {/* Dark Navy Blue overlay with gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/40"></div>
        
        {/* Decorative Gold Glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl animate-in slide-in-from-bottom-8 duration-700">
            {/* Gold bordered badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-amber-500/30 text-amber-400 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-sm font-medium tracking-wide">Yangi Toshkentda ish boshladik</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.15]">
              Orzuingizdagi <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-600 drop-shadow-sm">
                Avtomobilni
              </span><br />
              Ijaraga Oling
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl font-light">
              Ishonchli egalaridan to'g'ridan-to'g'ri, yashirin to'lovlarsiz avtomobillarni ijaraga oling. O'zbekiston bo'ylab 1000+ tasdiqlangan mashinalar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/catalog')} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 hover:-translate-y-1">
                Mashina qidirish <ArrowRight size={20} />
              </button>
              <button className="bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md border border-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                <PlayCircle size={20} className="text-amber-400" /> Qanday ishlaydi?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cars Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Ommabop avtomobillar</h2>
              <p className="text-slate-500 text-lg">Mijozlarimiz tomonidan eng ko'p ijaraga olingan mashinalar</p>
            </div>
            <Link to="/catalog" className="hidden md:flex items-center gap-1 text-brand-600 font-bold hover:text-brand-700 transition-colors group">
              Barchasini ko'rish <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCars.slice(0, 3).map((car) => (
              <div key={car.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                <div className="h-48 overflow-hidden relative">
                  <img src={car.image || (car.photos && car.photos.length > 0 ? car.photos[0] : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800')} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'; }} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {car.owner && car.owner.verified && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-green-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <ShieldCheck size={12} /> Ishonchli
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
                    <div className="flex items-center gap-1" title="Uzatma qutisi"><Settings2 size={16} className="text-slate-400" /> {car.transmission}</div>
                    <div className="flex items-center gap-1" title="Yoqilg'i"><Fuel size={16} className="text-slate-400" /> {car.fuelType || car.fuel}</div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {car.pricePerDay ? (
                        <>
                          <p className="text-xs text-slate-500">Kunlik ijara</p>
                          <p className="font-bold text-lg text-brand-600">{(car.pricePerDay / 1000).toLocaleString()} ming {car.currency}</p>
                        </>
                      ) : car.pricePerWeek ? (
                        <>
                          <p className="text-xs text-slate-500">Haftalik ijara</p>
                          <p className="font-bold text-lg text-brand-600">{(car.pricePerWeek / 1000).toLocaleString()} ming {car.currency}</p>
                        </>
                      ) : car.pricePerMonth ? (
                        <>
                          <p className="text-xs text-slate-500">Oylik ijara</p>
                          <p className="font-bold text-lg text-brand-600">{(car.pricePerMonth / 1000).toLocaleString()} ming {car.currency}</p>
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
          
          <div className="mt-8 sm:hidden flex justify-center">
            <Link to="/catalog" className="flex items-center gap-2 text-brand-600 font-medium bg-brand-50 px-6 py-3 rounded-xl hover:bg-brand-100 transition-colors w-full justify-center">
              Barchasini ko'rish <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
