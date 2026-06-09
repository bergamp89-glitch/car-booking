import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCars } from '../contexts/CarContext';
import { useBookings } from '../contexts/BookingContext';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isDocumentsVerified } = useAuth();
  const { cars } = useCars();
  const { addBooking } = useBookings();
  const car = cars.find(c => c.id === parseInt(id)) || cars[0];

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
    const bookingId = addBooking({
      carId: car.id,
      carBrand: car.brand,
      carModel: car.model,
      carImage: car.image,
      ownerId: car.ownerId,
      renterId: user?.id || 99,
      renterName: user?.name || 'Foydalanuvchi',
      renterPhone: user?.phone || '+998 90 000 00 00',
      startDate: "Ertaga, 10:00",
      endDate: "3 kundan so'ng, 10:00",
      totalDays: 3,
      totalPrice: (car.pricePerDay || 400000) * 3,
    });
    toast.success('Muvaffaqiyatli bron qilindi! Xost tasdiqlashi kutilmoqda.', { icon: '🎉' });
    navigate(`/rental/${bookingId}`);
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
              <span className="font-medium text-slate-900">Ertaga, 10:00</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-slate-500">Qaytarish sanasi:</span>
              <span className="font-medium text-slate-900">3 kundan so'ng, 10:00</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-slate-500">Umumiy hisoblangan narx:</span>
              <span className="font-bold text-brand-600 text-lg">{(car.pricePerDay / 1000 * 3).toLocaleString()} ming UZS</span>
            </div>
          </div>

          <div className="bg-green-50 text-green-800 p-4 rounded-xl mb-8 flex gap-3 text-sm border border-green-100">
            <ShieldCheck className="shrink-0" />
            <p>Sizning brongingiz avtomatik tarzda Ijarani boshqarish sahifasiga o'tkaziladi. O'sha yerda taymer va hisob-kitob jarayonini kuzatishingiz mumkin.</p>
          </div>

          <button 
            onClick={handleConfirmBooking}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 text-lg"
          >
            Tasdiqlash va Davom etish <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
