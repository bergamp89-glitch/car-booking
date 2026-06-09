import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookings } from '../contexts/BookingContext';
import { ShieldCheck, CreditCard, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  
  const { bookingData } = location.state || {};
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD'); // 'CARD' or 'CASH'

  // If directly accessed without booking data, redirect to home
  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Xatolik: Ma'lumot topilmadi</h2>
          <button onClick={() => navigate('/')} className="text-brand-600 font-bold hover:underline">
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  const isVisaOrMasterCard = (num) => {
    if (!num) return false;
    // Visa starts with 4, Mastercard starts with 51-55, but 5614 is Uzcard!
    if (num.startsWith('4')) return true;
    if (num.startsWith('5') && !num.startsWith('5614')) return true;
    return false;
  };

  const handlePayment = (e) => {
    e.preventDefault();
    const isVisaOrMaster = isVisaOrMasterCard(cardNumber);
    
    if (paymentMethod === 'CARD') {
      if (cardNumber.length < 16 || expiry.length < 5) {
        toast.error("Karta ma'lumotlarini to'g'ri kiriting");
        return;
      }
      if (isVisaOrMaster && cvv.length < 3) {
        toast.error("CVV kodni kiriting");
        return;
      }
    }
    
    setIsProcessing(true);
    
    // Simulate API delay
    setTimeout(() => {
      // 1. Save the booking
      const bookingId = addBooking({ ...bookingData, paymentMethod });
      setIsProcessing(false);
      
      // 2. Show success & redirect to management
      toast.success(paymentMethod === 'CARD' ? "Karta muvaffaqiyatli ulandi!" : "To'lov usuli saqlandi!", { icon: paymentMethod === 'CARD' ? '💳' : '💵' });
      toast.success('Broningiz tasdiqlash uchun xostga yuborildi.', { icon: '🎉' });
      navigate(`/rental/${bookingId}`);
    }, 2000);
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Payment Form */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
              <Lock className="text-brand-600" /> To'lov usuli
            </h1>

            {/* Payment Method Selector */}
            <div className="flex gap-4 mb-8">
              <div 
                onClick={() => setPaymentMethod('CARD')}
                className={`flex-1 border rounded-xl p-4 cursor-pointer flex flex-col items-center gap-2 transition-all ${paymentMethod === 'CARD' ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <CreditCard size={24} />
                <span className="font-bold">Karta orqali</span>
              </div>
              <div 
                onClick={() => setPaymentMethod('CASH')}
                className={`flex-1 border rounded-xl p-4 cursor-pointer flex flex-col items-center gap-2 transition-all ${paymentMethod === 'CASH' ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <span className="text-2xl">💵</span>
                <span className="font-bold">Naqd pul</span>
              </div>
            </div>
            
            <form onSubmit={handlePayment} className="space-y-6">
              {paymentMethod === 'CARD' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Karta raqami</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        placeholder="8600 1234 5678 9012" 
                        className="w-full border border-slate-300 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 text-lg tracking-widest font-mono"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className={`grid ${isVisaOrMasterCard(cardNumber) ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Amal qilish muddati</label>
                      <input 
                        type="text" 
                        value={expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = val.slice(0,2) + '/' + val.slice(2,4);
                          setExpiry(val);
                        }}
                        placeholder="MM/YY" 
                        className="w-full border border-slate-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-lg text-center"
                        required
                      />
                    </div>
                    {isVisaOrMasterCard(cardNumber) && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                        <input 
                          type="password" 
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="123" 
                          className="w-full border border-slate-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-lg text-center tracking-widest"
                          required
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-6 text-center">
                  <span className="text-3xl mb-2 block">🤝</span>
                  <h3 className="font-bold text-lg mb-2">Naqd pulda to'lov</h3>
                  <p className="text-sm opacity-90">Siz to'lovlarni (Garov va Ijara puli) to'g'ridan-to'g'ri avtomobil egasiga naqd ko'rinishda berasiz.</p>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="text-green-600 mt-0.5 shrink-0" size={20} />
                <div className="text-sm text-slate-600">
                  <p className="font-bold text-slate-800 mb-1">{paymentMethod === 'CARD' ? "Hozir hisobingizdan mablag' yechilmaydi!" : "Tasdiqlash jarayoni xavfsiz"}</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Garov puli (Zalog) - <b>mashinani qabul qilib olganingizda</b> {paymentMethod === 'CARD' ? 'yechib olinadi (muzlatiladi)' : 'naqd to\'laysiz'}.</li>
                    <li>Ijara to'lovi - <b>mashinani qaytarganingizda</b> ijara soatlariga qarab {paymentMethod === 'CARD' ? 'avtomatik yechiladi' : 'naqd hisob-kitob qilasiz'}.</li>
                  </ul>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70"
              >
                {isProcessing ? 'Bajarilmoqda...' : (paymentMethod === 'CARD' ? `Kartani ulash va Tasdiqlash` : `Bron qilish (Naqd)`)}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-96 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <img src={bookingData.carImage} alt={bookingData.carBrand} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="font-bold text-xl text-slate-900 mb-1">{bookingData.carBrand} {bookingData.carModel}</h3>
              <p className="text-slate-500 text-sm mb-4">Safar: {bookingData.startDate} — {bookingData.endDate}</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Umumiy ijara ({bookingData.totalDays} kun)</span>
                  <span className="font-bold text-slate-900">{bookingData.totalPrice.toLocaleString()} UZS</span>
                </div>
                {bookingData.securityDeposit > 0 && (
                  <>
                    <div className="flex justify-between text-slate-600 text-sm">
                      <span>Oldindan to'lov (Garov puli)</span>
                      <span>{bookingData.securityDeposit.toLocaleString()} UZS</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 pt-3 border-t border-slate-100 text-lg">
                      <span>Mashinani topshirganda qolgan qism</span>
                      <span>{Math.max(0, bookingData.totalPrice - bookingData.securityDeposit).toLocaleString()} UZS</span>
                    </div>
                  </>
                )}
                {bookingData.securityDeposit === 0 && (
                  <div className="flex justify-between font-bold text-slate-900 pt-3 border-t border-slate-100 text-lg">
                    <span>Umumiy jami</span>
                    <span>{bookingData.totalPrice.toLocaleString()} UZS</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
