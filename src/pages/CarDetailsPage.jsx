import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCars } from '../contexts/CarContext';
import { useBookings } from '../contexts/BookingContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Star, Settings2, Fuel, Users, ShieldCheck, ShieldAlert, MapPin, Calendar, CheckCircle2, Info, Car, UserPlus, Clock, Sparkles, Wrench, HeadphonesIcon, Pencil, ThumbsUp, CreditCard, Gauge, Shield, Heart, Share2, Mail, Copy, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function CarDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isDocumentsVerified } = useAuth();
  const { cars } = useCars();
  const { bookings } = useBookings();
  
  const car = cars.find(c => c.id === parseInt(id) && c.status === 'ACTIVE');

  // Booking states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:00');
  const [pickupLocation, setPickupLocation] = useState('On-site at Daniel K. Inouye International Airport');
  const [isFavorite, setIsFavorite] = useState(false);
  const [daysCount, setDaysCount] = useState(3);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // Set default dates: today and today + 3 days
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 3);
    
    setStartDate(today);
    setEndDate(future);
  }, []);

  const carBookings = bookings ? bookings.filter(b => b.carId === car?.id && b.status !== 'REJECTED' && b.status !== 'CANCELLED') : [];
  
  const getExcludedDates = () => {
    let dates = [];
    carBookings.forEach(booking => {
      if (!booking.startDate || booking.startDate.includes('Ertaga')) return;
      let current = new Date(booking.startDate.split(',')[0]); 
      const end = new Date(booking.endDate.split(',')[0]);
      if (isNaN(current.getTime()) || isNaN(end.getTime())) return;
      
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  };
  
  const excludedDates = getExcludedDates();

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Minimum 1 day
      const calculatedDays = diffDays > 0 ? diffDays : 1;
      setDaysCount(calculatedDays);
      
      const getBasePrice = () => {
        if (!car) return 75000; // default in UZS
        if (car.price) return car.price.daily || (car.price.weekly ? car.price.weekly / 7 : 0) || (car.price.monthly ? car.price.monthly / 30 : 0) || (car.price.hourly ? car.price.hourly * 24 : 0) || 75000;
        return car.pricePerDay || (car.pricePerWeek ? car.pricePerWeek / 7 : 0) || (car.pricePerMonth ? car.pricePerMonth / 30 : 0) || 75000;
      };
      const basePrice = getBasePrice();
      
      let calcTotal = calculatedDays * basePrice;
      let calcDiscount = 0; // Discount is condition-based, not auto-calculated here
      
      setDiscount(calcDiscount);
      setTotalPrice(calcTotal);
    }
  }, [startDate, endDate, car]);

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      toast.error('Iltimos, bron qilish uchun tizimga kiring');
      navigate('/login');
      return;
    }
    navigate(`/booking/${car.id}`, { state: { 
      startDate: startDate?.toISOString().split('T')[0], 
      endDate: endDate?.toISOString().split('T')[0], 
      startTime, endTime, pickupLocation: car?.pickupLocation || 'Toshkent shahar', totalPrice 
    } });
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Avtomobil topilmadi</h2>
          <Link to="/catalog" className="text-brand-600 hover:underline">Katalogga qaytish</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-brand-600">Bosh sahifa</Link>
          <span className="mx-2">/</span>
          <Link to="/catalog" className="hover:text-brand-600">Katalog</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium">{car.brand} {car.model}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Images & Details) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
              <div className="h-[400px] rounded-xl overflow-hidden relative">
                <img src={car.image || (car.photos && car.photos.length > 0 ? car.photos[0] : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800')} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'; }} alt={car.model} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Title & Basics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{car.brand} {car.model}</h1>
                  <p className="text-slate-500">{car.year} yil • Toshkent</p>
                </div>

              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100 mb-6">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl">
                  <Settings2 size={24} className="text-brand-600 mb-2" />
                  <span className="text-sm font-medium text-slate-900">{car.transmission}</span>
                  <span className="text-xs text-slate-500">Uzatma</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl">
                  <Fuel size={24} className="text-brand-600 mb-2" />
                  <span className="text-sm font-medium text-slate-900">{car.fuel}</span>
                  <span className="text-xs text-slate-500">Yoqilg'i</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl">
                  <Users size={24} className="text-brand-600 mb-2" />
                  <span className="text-sm font-medium text-slate-900">{car.seats} kishi</span>
                  <span className="text-xs text-slate-500">O'rindiqlar</span>
                </div>
                <div className={`flex flex-col items-center justify-center p-4 rounded-xl ${car.insurance === 'Mavjud emas' ? 'bg-red-50' : 'bg-slate-50'}`}>
                  {car.insurance === 'Mavjud emas' ? (
                    <ShieldAlert size={24} className="text-red-600 mb-2" />
                  ) : (
                    <ShieldCheck size={24} className="text-brand-600 mb-2" />
                  )}
                  <span className="text-sm font-medium text-slate-900">Sug'urta</span>
                  <span className={`text-xs ${car.insurance === 'Mavjud emas' ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                    {car.insurance || 'KASKO'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Avtomobil haqida</h3>
                <p className="text-slate-600 leading-relaxed">
                  Ajoyib va qulay avtomobil. Barcha texnik xizmatlaridan o'z vaqtida o'tgan. Salon toza, chekilmagan. Oila bilan dam olishga yoki biznes uchrashuvlariga juda mos keladi. Iltimos, faqat toza va ehtiyotkorona foydalanadigan insonlar murojaat qilsin.
                </p>
              </div>
            </div>

            {/* Owner Info */}
            {/* Hosted By */}
            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">E'lon egasi</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link to={`/host-profile/${car.ownerId || 1}`} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 -ml-2 rounded-xl transition-colors">
                  <div className="relative">
                    <div className="w-16 h-16 bg-[#e0f7f4] rounded-full flex items-center justify-center text-[#117a6b] text-2xl font-bold flex-shrink-0 overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                      {car.owner?.name?.charAt(0) || 'H'}
                    </div>
                    {car.owner?.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 size={18} className="text-[#593cfb] fill-[#e6e2fe]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#593cfb] transition-colors">
                      {car.owner?.name || 'Avto egasi'}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                      {cars.filter(c => c.ownerId === car.ownerId && c.status === 'ACTIVE').length} ta avtomobil ijaraga qo'yilgan
                    </p>
                  </div>
                </Link>
                <button 
                  onClick={() => navigate('/messages', { state: { targetHost: car.owner, targetCar: car } })} 
                  className="text-[#593cfb] font-bold hover:bg-[#f3f0ff] px-5 py-2.5 rounded-xl transition-colors w-full sm:w-auto"
                >
                  Bog'lanish
                </button>
              </div>
            </div>

            {/* Vehicle Features */}
            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Avtomobil xususiyatlari</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 text-base">Xavfsizlik</h4>
                  <ul className="space-y-3 text-slate-600 text-sm">
                    {car.features?.safety?.length > 0 ? (
                      car.features.safety.map(f => <li key={f} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600"/> {f}</li>)
                    ) : (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600"/> To'liq uzatma</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600"/> Orqa kamera</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600"/> Ko'rinmas zonalar nazorati</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600"/> Tormoz yordamchisi</li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 text-base">Qurilmalar bilan aloqa</h4>
                  <ul className="space-y-3 text-slate-600 text-sm">
                    {car.features?.connectivity?.length > 0 ? (
                      car.features.connectivity.map(f => <li key={f} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600"/> {f}</li>)
                    ) : (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600"/> Android Auto</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600"/> Apple CarPlay</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600"/> AUX ulanish</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600"/> Bluetooth</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Included in the price */}
            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Narxga kiritilgan xizmatlar</h3>
              
              <h4 className="font-bold text-slate-900 mb-4 text-base">Qulayliklar</h4>
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <Car className="text-slate-700 mt-1 flex-shrink-0" size={22} />
                  <div>
                    <p className="text-slate-900 text-[15px]">Navbatsiz ijaraga olish</p>
                    <p className="text-slate-500 text-sm">Avtomobilni olish va qaytarish bo'yicha ko'rsatmalar uchun ilovadan foydalaning</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <UserPlus className="text-slate-700 mt-1 flex-shrink-0" size={22} />
                  <div>
                    <p className="text-slate-900 text-[15px]">Qo'shimcha haydovchilarni bepul qo'shish</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="text-slate-700 mt-1 flex-shrink-0" size={22} />
                  <div>
                    <p className="text-slate-900 text-[15px]">Qaytarish uchun 30 daqiqalik imtiyoz</p>
                    <p className="text-slate-500 text-sm">Agar 30 daqiqadan ko'p kechikmasangiz, ijara muddatini uzaytirish shart emas</p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 mb-4 text-base">Xotirjamlik</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Sparkles className="text-slate-700 mt-1 flex-shrink-0" size={22} />
                  <div>
                    <p className="text-slate-900 text-[15px]">Mashinani yuvish shart emas, lekin toza saqlang</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Wrench className="text-slate-700 mt-1 flex-shrink-0" size={22} />
                  <div>
                    <p className="text-slate-900 text-[15px]">24/7 yo'l yordam xizmati bepul</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <HeadphonesIcon className="text-slate-700 mt-1 flex-shrink-0" size={22} />
                  <div>
                    <p className="text-slate-900 text-[15px]">24/7 mijozlarni qo'llab-quvvatlash xizmati</p>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Sidebar (Booking Form) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 sticky top-24">
              
              <div className="mb-6">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-2xl font-bold text-slate-900">
                    {car.price?.hourly ? (
                      <>{(car.price.hourly).toLocaleString()} UZS <span className="text-base font-normal text-slate-500">soatiga</span></>
                    ) : car.price?.daily || car.pricePerDay ? (
                      <>{(car.price?.daily || car.pricePerDay).toLocaleString()} UZS <span className="text-base font-normal text-slate-500">kuniga</span></>
                    ) : car.price?.weekly || car.pricePerWeek ? (
                      <>{(car.price?.weekly || car.pricePerWeek).toLocaleString()} UZS <span className="text-base font-normal text-slate-500">haftasiga</span></>
                    ) : car.price?.monthly || car.pricePerMonth ? (
                      <>{(car.price?.monthly || car.pricePerMonth).toLocaleString()} UZS <span className="text-base font-normal text-slate-500">oyiga</span></>
                    ) : (
                      <>Narx belgilanmagan</>
                    )}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-slate-900 mb-3 text-lg">Sayohat vaqti</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Boshlanishi</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          minDate={new Date()}
                          excludeDates={excludedDates}
                          dateFormat="yyyy-MM-dd"
                          className="w-full border border-slate-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-sm font-medium text-slate-700"
                        />
                      </div>
                      <div className="relative w-[110px]">
                        <select 
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none bg-white text-sm font-medium text-slate-700"
                        >
                          <option value="08:00">08:00</option>
                          <option value="09:00">09:00</option>
                          <option value="10:00">10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="12:00">12:00</option>
                          <option value="13:00">13:00</option>
                          <option value="14:00">14:00</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Tugashi</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate || new Date()}
                          excludeDates={excludedDates}
                          dateFormat="yyyy-MM-dd"
                          className="w-full border border-slate-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-sm font-medium text-slate-700"
                        />
                      </div>
                      <div className="relative w-[110px]">
                        <select 
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none bg-white text-sm font-medium text-slate-700"
                        >
                          <option value="08:00">08:00</option>
                          <option value="09:00">09:00</option>
                          <option value="10:00">10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="12:00">12:00</option>
                          <option value="13:00">13:00</option>
                          <option value="14:00">14:00</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900 text-[15px]">Olish va qaytarish manzili</h4>
                </div>
                <p className="text-slate-700 text-sm mb-1 leading-relaxed">{car?.pickupLocation || 'Toshkent shahar'}</p>
              </div>

              {car?.discount?.percentage > 0 && (
                <div className="mb-6 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">Chegirma imkoniyati</h4>
                  <div className="flex justify-between items-center text-[15px] bg-green-50 p-3 rounded-lg border border-green-100">
                    <span className="text-green-800 font-medium">Shart: {car.discount.condition}</span>
                    <span className="text-[#0fa464] font-bold">-{car.discount.percentage}%</span>
                  </div>
                </div>
              )}

              <button 
                onClick={handleBookingClick} 
                className="w-full bg-[#593cfb] hover:bg-[#4828ec] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center text-lg mb-8"
              >
                Davom etish
              </button>

              {/* Extra Info Sections */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">Bekor qilish qoidalari</h4>
                  <div className="flex gap-4">
                    <ThumbsUp className="text-slate-700 mt-0.5 flex-shrink-0" size={22} />
                    <div>
                      <p className="text-slate-900 text-[15px] mb-1">{car.policies?.cancellation || 'Bepul bekor qilish'}</p>
                      <p className="text-slate-500 text-[13px] leading-relaxed">
                        {car.policies?.cancellation === "Qat'iy bekor qilish" 
                          ? "Bekor qilingan taqdirda pul qaytarilmaydi yoki jarima ushlab qolinadi."
                          : car.policies?.cancellation === "Bekor qilish mumkin emas"
                          ? "Ushbu buyurtmani bekor qilib bo'lmaydi."
                          : car.policies?.cancellation === "Bepul bekor qilish"
                          ? "Bron qilingandan so'ng 24 soat ichida to'liq pul qaytariladi."
                          : "Avto egasining shaxsiy bekor qilish qoidasi qo'llaniladi."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">To'lov usullari</h4>
                  <div className="flex gap-4">
                    <CreditCard className="text-slate-700 mt-0.5 flex-shrink-0" size={22} />
                    <div>
                      <p className="text-slate-900 text-[15px] mb-1">Moslashuvchan to'lov</p>
                      <p className="text-slate-500 text-[13px] leading-relaxed">Keyingi bosqichda qaytariladigan to'lov turini tanlasangiz, hozir pul yechilmaydi.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">Kiritilgan masofa</h4>
                  <div className="flex items-center gap-4">
                    <Gauge className="text-slate-700 flex-shrink-0" size={22} />
                    <p className="text-slate-900 text-[15px]">{car?.distanceLimit || 'Cheklanmagan'}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">Garov puli (Zalog)</h4>
                  <div className="flex items-center gap-4">
                    <ShieldAlert className="text-slate-700 flex-shrink-0" size={22} />
                    <div>
                      <p className="text-slate-900 text-[15px] mb-1">
                        {car?.securityDeposit ? `${car.securityDeposit.toLocaleString()} UZS` : 'Olinmaydi'}
                      </p>
                      <p className="text-slate-500 text-[13px] leading-relaxed">Ijaradan oldin ehtimoliy jarimalar va zararlar uchun muzlatiladi.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">Sug'urta va Himoya</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Shield className="text-slate-700 flex-shrink-0" size={22} />
                      <p className="text-slate-900 text-[15px]">Travelers orqali sug'urtalangan</p>
                    </div>
                    <Info className="text-slate-400" size={18} />
                  </div>
                </div>
              </div>



            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
