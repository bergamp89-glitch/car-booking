import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCars } from '../contexts/CarContext';
import { useBookings } from '../contexts/BookingContext';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isDocumentsVerified } = useAuth();
  const { cars } = useCars();
  const { addBooking } = useBookings();
  const car = cars.find(c => c.id === parseInt(id)) || cars[0];
  
  const { startDate, endDate, startTime, endTime, pickupLocation, totalPrice: baseTotalPrice } = location.state || {};
  
  const [deliveryOption, setDeliveryOption] = useState('pickup'); // 'pickup' or 'delivery'
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  if (!car) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Yuklanmoqda...</div>;
  }

  const finalTotalPrice = (baseTotalPrice || ((car.price?.daily || car.pricePerDay || 400000) * 3)) + (deliveryOption === 'delivery' ? 150000 : 0);
  const securityDeposit = car?.securityDeposit || 0;

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Iltimos, oldin tizimga kiring!");
      navigate('/login');
    } else if (!isDocumentsVerified) {
      toast.error("Avtomobil bron qilish uchun avval profilingizda hujjatlarni tasdiqlang!");
      navigate('/profile');
    }
  }, [isAuthenticated, isDocumentsVerified, navigate]);

  const handleConfirmBooking = () => {
    if (deliveryOption === 'delivery' && !deliveryAddress.trim()) {
      toast.error('Iltimos, yetkazib berish manzilini kiriting');
      return;
    }
    
    navigate(`/payment`, { 
      state: { 
        bookingData: {
          carId: car.id,
          carBrand: car.brand,
          carModel: car.model,
          carImage: car.image,
          ownerId: car.ownerId,
          renterId: user?.id || 99,
          renterName: user?.name || 'Foydalanuvchi',
          renterPhone: user?.phone || '+998 90 000 00 00',
          startDate: startDate ? `${startDate}, ${startTime}` : "Ertaga, 10:00",
          endDate: endDate ? `${endDate}, ${endTime}` : "3 kundan so'ng, 10:00",
          totalDays: 3,
          totalPrice: finalTotalPrice,
          securityDeposit,
          deliveryOption,
          pickupLocation: deliveryOption === 'delivery' ? deliveryAddress : (pickupLocation || car.pickupLocation || 'Toshkent')
        }
      } 
    });
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-center text-slate-900 mb-2">Bronni tasdiqlash</h1>
          <p className="text-center text-slate-500 mb-8">Siz tanlagan avtomobil band qilinishga tayyor.</p>
          
          <div className="bg-slate-50 rounded-xl p-4 mb-6 flex items-center gap-4 border border-slate-100">
            <img src={car.image || (car.photos && car.photos.length > 0 ? car.photos[0] : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800')} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'; }} alt={car.model} className="w-24 h-16 object-cover rounded-lg shadow-sm" />
            <div>
              <h3 className="font-bold text-slate-900">{car.brand} {car.model}</h3>
              <p className="text-sm text-slate-500">{car.year} yil</p>
            </div>
          </div>

          <div className="space-y-4 mb-8 text-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-slate-500">Olish sanasi:</span>
              <span className="font-medium text-slate-900">{startDate ? `${startDate}, ${startTime}` : "Ertaga, 10:00"}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-slate-500">Qaytarish sanasi:</span>
              <span className="font-medium text-slate-900">{endDate ? `${endDate}, ${endTime}` : "3 kundan so'ng, 10:00"}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-slate-500">Olish va qaytarish manzili:</span>
              <span className="font-medium text-slate-900 max-w-[200px] text-right truncate" title={pickupLocation || car.pickupLocation || 'Toshkent'}>{pickupLocation || car.pickupLocation || 'Toshkent'}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Mashinani qabul qilish usuli</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setDeliveryOption('pickup')}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${deliveryOption === 'pickup' ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-slate-200 hover:border-brand-300'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${deliveryOption === 'pickup' ? 'border-brand-500' : 'border-slate-300'}`}>
                    {deliveryOption === 'pickup' && <div className="w-2.5 h-2.5 bg-brand-500 rounded-full" />}
                  </div>
                  <span className="font-bold text-slate-900">O'zim borib olaman</span>
                </div>
                <p className="text-sm text-slate-500 ml-8">Avtomobil egasi ko'rsatgan manzilga borib olasiz. Bepul.</p>
              </div>
              
              <div 
                onClick={() => setDeliveryOption('delivery')}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${deliveryOption === 'delivery' ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-slate-200 hover:border-brand-300'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${deliveryOption === 'delivery' ? 'border-brand-500' : 'border-slate-300'}`}>
                    {deliveryOption === 'delivery' && <div className="w-2.5 h-2.5 bg-brand-500 rounded-full" />}
                  </div>
                  <span className="font-bold text-slate-900">Yetkazib berish</span>
                </div>
                <p className="text-sm text-slate-500 ml-8">+150,000 UZS. Xost mashinani siz aytgan manzilga olib boradi.</p>
              </div>
            </div>

            {deliveryOption === 'delivery' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Manzilingizni kiriting</label>
                <input 
                  type="text" 
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Masalan: Toshkent sh., Chilonzor 1-mavze, 45-uy" 
                  className="w-full border border-slate-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-8 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-slate-600">Ijara summasi:</span>
              <span className="font-medium text-slate-900">{(baseTotalPrice || ((car.price?.daily || car.pricePerDay || 400000) * 3)).toLocaleString()} UZS</span>
            </div>
            {deliveryOption === 'delivery' && (
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-600">Yetkazib berish xizmati:</span>
                <span className="font-medium text-slate-900">150,000 UZS</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 pb-3 border-b border-slate-200">
              <span className="text-slate-900 font-bold">Umumiy ijara summasi:</span>
              <span className="font-bold text-brand-600 text-lg">{finalTotalPrice.toLocaleString()} UZS</span>
            </div>
            {securityDeposit > 0 && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Oldindan to'lov (Garov puli) - Mashinani olganda:</span>
                  <span className="font-medium text-slate-900">{securityDeposit.toLocaleString()} UZS</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>Mashinani topshirganda qolgan qism:</span>
                  <span>{Math.max(0, finalTotalPrice - securityDeposit).toLocaleString()} UZS</span>
                </div>
              </>
            )}
          </div>

          <div className="bg-green-50 text-green-800 p-4 rounded-xl mb-8 flex gap-3 text-sm border border-green-100">
            <ShieldCheck className="shrink-0" />
            <p>Sizning brongingiz avtomatik tarzda Ijarani boshqarish sahifasiga o'tkaziladi. O'sha yerda taymer va hisob-kitob jarayonini kuzatishingiz mumkin.</p>
          </div>

          <button 
            onClick={handleConfirmBooking}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 text-lg"
          >
            To'lovga o'tish <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
