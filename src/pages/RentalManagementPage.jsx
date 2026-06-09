import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCars } from '../contexts/CarContext';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Key, CheckCircle2, ShieldAlert, ArrowRight, Activity, Wallet, AlertCircle } from 'lucide-react';

const RENTAL_STATES = {
  BOOKED: 'BOOKED',
  ACTIVE: 'ACTIVE',
  IN_USE: 'IN_USE',
  RETURN_REQUESTED: 'RETURN_REQUESTED',
  RETURNED: 'RETURNED',
  CLOSED: 'CLOSED'
};

export default function RentalManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cars } = useCars();
  
  const car = cars.find(c => c.id === parseInt(id)) || cars[0];
  
  const [rentalState, setRentalState] = useState(RENTAL_STATES.BOOKED);
  const [elapsedHours, setElapsedHours] = useState(0);
  const [role, setRole] = useState('GUEST'); // 'GUEST' or 'HOST' for testing

  const pricePerHour = Math.round(car.pricePerDay / 24);
  const deposit = 3000000;

  // Auto Timer Simulation: 1 real second = 1 hour of rental
  useEffect(() => {
    let timer;
    if (rentalState === RENTAL_STATES.IN_USE) {
      timer = setInterval(() => {
        setElapsedHours(prev => prev + 1);
      }, 1000); // 1 real second = 1 hour elapsed
    }
    return () => clearInterval(timer);
  }, [rentalState]);

  // Host Actions
  const hostHandover = () => {
    setRentalState(RENTAL_STATES.ACTIVE);
    toast.success('Siz "Ijaraga berdim" ni tasdiqladingiz', { icon: '🔑' });
    toast('Guest-ga bildirishnoma yuborildi: Mashina tayyor', { icon: '🔔' });
  };

  const hostConfirmReturn = () => {
    setRentalState(RENTAL_STATES.RETURNED);
    toast.success('Mashinani qabul qildingiz', { icon: '✅' });
  };

  const hostCloseRental = (damage = false) => {
    setRentalState(RENTAL_STATES.CLOSED);
    if (damage) {
      toast.error('Zarar qayd etildi! Depozit ushlab qolindi.', { icon: '💥' });
    } else {
      toast.success('Ijara muvaffaqiyatli yopildi! Depozit qaytarildi.', { icon: '💰' });
    }
  };

  // Guest Actions
  const guestConfirmPickup = () => {
    if (rentalState === RENTAL_STATES.ACTIVE) {
      setRentalState(RENTAL_STATES.IN_USE);
      toast.success('Siz "Mashinani oldim" ni tasdiqladingiz', { icon: '🚗' });
      toast('Host-ga bildirishnoma yuborildi: Ijara boshlandi!', { icon: '🔔' });
    } else {
      toast.error('Avval Host mashinani ijaraga berganini tasdiqlashi kerak!');
    }
  };

  const guestInitiateReturn = () => {
    setRentalState(RENTAL_STATES.RETURN_REQUESTED);
    toast.success('Siz "Mashinani topshirdim" ni bosdingiz', { icon: '↩️' });
    toast('Host-ga bildirishnoma yuborildi: Mashinani qabul qiling', { icon: '🔔' });
  };

  // Billing Calculations
  const rentalCost = elapsedHours * pricePerHour;
  let totalCost = rentalCost;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Test Control Panel - Just to easily switch roles for demonstration */}
        <div className="bg-indigo-100 border border-indigo-200 rounded-xl p-4 mb-8 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-indigo-800 font-bold text-sm mb-1 flex items-center gap-2"><Activity size={16}/> TEST PANEL (Faqat demo uchun)</p>
            <p className="text-indigo-600 text-xs">Jarayonni ikki tomonlama tasdiqlash (Double confirmation) ni tekshirish uchun rollarni almashtiring.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setRole('HOST')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${role === 'HOST' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
            >
              Host ro'li
            </button>
            <button 
              onClick={() => setRole('GUEST')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${role === 'GUEST' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
            >
              Ijarachi ro'li
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Ijara Boshqaruvi #842</h1>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500">Avtomobil</p>
            <p className="font-bold text-brand-600 text-lg">{car.brand} {car.model}</p>
          </div>
        </div>

        {/* State Tracker Visual */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 hidden md:block rounded-full translate-y-[-50%]"></div>
            
            {/* Progress Bar Active */}
            <div 
              className="absolute top-1/2 left-0 h-1 bg-brand-500 -z-10 hidden md:block rounded-full translate-y-[-50%] transition-all duration-500" 
              style={{
                width: 
                  rentalState === RENTAL_STATES.BOOKED ? '0%' :
                  rentalState === RENTAL_STATES.ACTIVE ? '25%' :
                  rentalState === RENTAL_STATES.IN_USE ? '50%' :
                  rentalState === RENTAL_STATES.RETURN_REQUESTED ? '75%' :
                  '100%'
              }}
            ></div>

            {[
              { id: RENTAL_STATES.BOOKED, label: "Bron", icon: <Clock size={20}/> },
              { id: RENTAL_STATES.ACTIVE, label: "Host tayyor", icon: <Key size={20}/> },
              { id: RENTAL_STATES.IN_USE, label: "Ijarada", icon: <Activity size={20}/> },
              { id: RENTAL_STATES.RETURN_REQUESTED, label: "Topshirildi", icon: <ArrowRight size={20}/> },
              { id: RENTAL_STATES.CLOSED, label: "Yopildi", icon: <CheckCircle2 size={20}/> }
            ].map((step, idx) => {
              const statesOrder = [RENTAL_STATES.BOOKED, RENTAL_STATES.ACTIVE, RENTAL_STATES.IN_USE, RENTAL_STATES.RETURN_REQUESTED, RENTAL_STATES.RETURNED, RENTAL_STATES.CLOSED];
              const currentIndex = statesOrder.indexOf(rentalState);
              const stepIndex = statesOrder.indexOf(step.id);
              let statusClass = "bg-white text-slate-400 border-slate-200";
              
              if (stepIndex < currentIndex || (step.id === RENTAL_STATES.CLOSED && rentalState === RENTAL_STATES.CLOSED)) {
                statusClass = "bg-brand-500 text-white border-brand-500";
              } else if (stepIndex === currentIndex) {
                statusClass = "bg-white text-brand-600 border-brand-500 ring-4 ring-brand-50";
              }

              return (
                <div key={step.id} className="flex flex-col items-center bg-white z-10 px-2">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${statusClass}`}>
                    {step.icon}
                  </div>
                  <span className={`text-sm font-bold ${stepIndex <= currentIndex ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Action Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Dynamic UI based on role and state */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center min-h-[300px] flex flex-col justify-center items-center">
              
              {/* STATUS: BOOKED */}
              {rentalState === RENTAL_STATES.BOOKED && (
                <>
                  <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
                    <Clock size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Ijara tasdiqlangan</h2>
                  <p className="text-slate-600 mb-8 max-w-md">Mashinani olib ketish vaqti kelganda, Host mashinani tayyorlaganini bildiradi.</p>
                  
                  {role === 'HOST' ? (
                    <button onClick={hostHandover} className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2">
                      <Key /> Men ijaraga berdim (Handover)
                    </button>
                  ) : (
                    <div className="bg-slate-50 text-slate-500 py-3 px-6 rounded-xl border border-slate-200">
                      Host'ning tasdiqlashini kutmoqdasiz...
                    </div>
                  )}
                </>
              )}

              {/* STATUS: ACTIVE (Host gave it, waiting for guest) */}
              {rentalState === RENTAL_STATES.ACTIVE && (
                <>
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Key size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Mashina tayyor!</h2>
                  <p className="text-slate-600 mb-8 max-w-md">Host mashinani ijaraga berishga tayyor. Ijarachi mashinani o'z qo'liga olganini tasdiqlashi (Double Confirmation) kutilmoqda.</p>
                  
                  {role === 'GUEST' ? (
                    <button onClick={guestConfirmPickup} className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2 text-lg">
                      <CheckCircle2 /> Mashinani qabul qildim
                    </button>
                  ) : (
                    <div className="bg-slate-50 text-slate-500 py-3 px-6 rounded-xl border border-slate-200">
                      Ijarachining "Mashinani oldim" degan tasdig'ini kutyapsiz...
                    </div>
                  )}
                </>
              )}

              {/* STATUS: IN_USE (Timer running) */}
              {rentalState === RENTAL_STATES.IN_USE && (
                <>
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-brand-50 border-4 border-brand-500 text-brand-600 rounded-full flex flex-col items-center justify-center shadow-inner relative z-10">
                      <span className="text-4xl font-black">{elapsedHours}</span>
                      <span className="text-xs font-bold uppercase tracking-widest mt-1">soat</span>
                    </div>
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-20 -z-10"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Ijara faol!</h2>
                  <p className="text-slate-600 mb-8">Auto-timer orqali ijaraga olingan vaqt hisoblanmoqda (Test tizimi: 1 soniya = 1 soat).</p>
                  
                  {role === 'GUEST' ? (
                    <button onClick={guestInitiateReturn} className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2">
                      <ArrowRight /> Men mashinani topshirdim
                    </button>
                  ) : (
                    <div className="bg-slate-50 text-slate-500 py-3 px-6 rounded-xl border border-slate-200">
                      Ijarachi mashinani o'zida saqlamoqda.
                    </div>
                  )}
                </>
              )}

              {/* STATUS: RETURN_REQUESTED (Guest returned, Host needs to confirm) */}
              {rentalState === RENTAL_STATES.RETURN_REQUESTED && (
                <>
                  <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Qaytarish kutilmoqda</h2>
                  <p className="text-slate-600 mb-8 max-w-md">Ijarachi mashinani topshirdi. Host mashinani ko'zdan kechirib, qabul qilganini tasdiqlashi (Double Confirmation) zarur.</p>
                  
                  {role === 'HOST' ? (
                    <button onClick={hostConfirmReturn} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2">
                      <CheckCircle2 /> Mashinani qabul qilib oldim
                    </button>
                  ) : (
                    <div className="bg-slate-50 text-slate-500 py-3 px-6 rounded-xl border border-slate-200">
                      Host mashinani tekshirmoqda...
                    </div>
                  )}
                </>
              )}

              {/* STATUS: RETURNED (Ready to close and bill) */}
              {rentalState === RENTAL_STATES.RETURNED && (
                <>
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Wallet size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Hisob-kitob qismi</h2>
                  <p className="text-slate-600 mb-8 max-w-md">Mashina eson-omon qaytarildi. To'lov va depozit masalasini yechib, ijarani yoping.</p>
                  
                  {role === 'HOST' ? (
                    <div className="flex gap-4 w-full justify-center">
                      <button onClick={() => hostCloseRental(false)} className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2">
                        Hammasi joyida, Yopish
                      </button>
                      <button onClick={() => hostCloseRental(true)} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2">
                        <ShieldAlert size={18}/> Zarar bor
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 text-slate-500 py-3 px-6 rounded-xl border border-slate-200">
                      Host chekni yakunlamoqda...
                    </div>
                  )}
                </>
              )}

              {/* STATUS: CLOSED */}
              {rentalState === RENTAL_STATES.CLOSED && (
                <>
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Yopilgan</h2>
                  <p className="text-slate-600 mb-8">Ushbu ijara muvaffaqiyatli yakuniga yetdi.</p>
                  <Link to="/" className="text-brand-600 font-medium hover:underline flex items-center gap-1">
                    Bosh sahifaga qaytish <ArrowRight size={16}/>
                  </Link>
                </>
              )}

            </div>
          </div>

          {/* Sidebar: Auto Billing Engine */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl sticky top-8">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                <Wallet className="text-brand-400" />
                <h3 className="text-lg font-bold">Auto Billing Engine</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Holat</span>
                  <span className={`font-bold px-2 py-1 rounded text-xs ${
                    rentalState === RENTAL_STATES.IN_USE ? 'bg-brand-500/20 text-brand-400' : 
                    rentalState === RENTAL_STATES.CLOSED ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {rentalState}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Tarif ({car.currency})</span>
                  <span className="font-medium text-white">{pricePerHour.toLocaleString()} / soat</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Hisoblangan vaqt</span>
                  <span className="font-bold text-brand-400 text-base">{elapsedHours} soat</span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Ijara summasi</span>
                  <span className="font-medium">{rentalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Depozit (Pending)</span>
                  <span className="font-medium">{deposit.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-4">
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Jami To'lov (Ijara)</p>
                <p className="text-3xl font-black text-white">{totalCost.toLocaleString()} <span className="text-lg font-medium text-slate-400">UZS</span></p>
              </div>

              <p className="text-xs text-slate-500 text-center mt-6">
                Tizim real vaqtda ijara davomiyligini hisoblaydi. Qo'lda kiritilmaydi.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
