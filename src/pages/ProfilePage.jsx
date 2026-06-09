import { useState, useEffect } from 'react';
import { User, CheckCircle, Clock, FileText, ChevronRight, AlertTriangle, Upload, XCircle, ScanFace, Loader2, Camera, Car, UserCircle, HelpCircle, Shield, Edit2, Save, Trash2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingContext';
import toast from 'react-hot-toast';
import AdminPanelContent from '../components/admin/AdminPanelContent';

export default function ProfilePage() {
  const { user, isDocumentsVerified, verifyDocuments, logout, isAdminAuthenticated, isHost, hostStatus, requestHostRole, updateUser, guestStatus, requestGuestRole, deleteAccount } = useAuth();
  const { getBookingsByRenter } = useBookings();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') === 'applications' ? 'applications' : (isAdminAuthenticated ? 'admin' : 'rentals');
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  const myRentals = getBookingsByRenter(user?.id || 99);
  const activeRentals = myRentals.filter(r => r.status === 'PENDING' || r.status === 'APPROVED' || r.status === 'ACTIVE');
  const pastRentals = myRentals.filter(r => r.status === 'COMPLETED' || r.status === 'REJECTED' || r.status === 'CANCELLED');
  const [isScanningFace, setIsScanningFace] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [passwordStep, setPasswordStep] = useState('initial');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileSave = () => {
    updateUser(profileData);
    setIsEditingProfile(false);
    toast.success("Ma'lumotlar muvaffaqiyatli saqlandi!");
  };

  const handleVerifyOldPassword = () => {
    if (oldPassword.length < 6) {
      toast.error("Joriy parol noto'g'ri (kamida 6 ta belgi bo'lishi kerak)");
      return;
    }
    // Mocking successful password check
    setPasswordStep('enter_new');
  };

  const handleUpdatePassword = () => {
    if (newPassword.length < 6) {
      toast.error("Yangi parol kamida 6 ta belgi bo'lishi kerak");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Parollar mos kelmadi');
      return;
    }
    
    // Simulating API call to update password
    toast.success("Parol muvaffaqiyatli o'zgartirildi!", { icon: '🔐' });
    setPasswordStep('initial');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const startFaceScan = () => {
    setIsScanningFace(true);
    setScanStep('Kamera ochilmoqda...');
    setScanProgress(10);
    
    setTimeout(() => {
      setScanStep('Yuz aniqlanmoqda...');
      setScanProgress(40);
    }, 1500);

    setTimeout(() => {
      setScanStep('Hujjat bilan solishtirilmoqda...');
      setScanProgress(75);
    }, 3000);

    setTimeout(() => {
      setScanStep('Muvaffaqiyatli tasdiqlandi!');
      setScanProgress(100);
    }, 4500);

    setTimeout(() => {
      setIsScanningFace(false);
      verifyDocuments();
      toast.success('Hujjatlar muvaffaqiyatli yuklandi va tasdiqlandi!', { icon: '✅' });
    }, 5500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Hisobingizni butunlay o'chirib tashlashni xohlaysizmi? Bu amalni ortga qaytarib bo'lmaydi!")) {
      deleteAccount();
      navigate('/');
      toast.success("Hisobingiz muvaffaqiyatli o'chirildi.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Foydalanuvchi'}</h2>
              <p className="text-slate-500 mb-4">{user?.phone || '+998 90 000 00 00'}</p>
              
              {isDocumentsVerified ? (
                <div className="bg-green-50 text-green-700 p-3 rounded-xl flex items-center justify-center gap-2 mb-6">
                  <CheckCircle size={20} />
                  <span className="font-medium">Hujjatlar tasdiqlangan</span>
                </div>
              ) : (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl flex items-center justify-center gap-2 mb-6 text-sm">
                  <AlertTriangle size={18} />
                  <span className="font-medium">Hujjatlar kiritilmagan!</span>
                </div>
              )}
              
              <nav className="space-y-2 text-left">
                {isAdminAuthenticated && (
                  <button 
                    onClick={() => setActiveTab('admin')}
                    className={`block w-full text-left px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'admin' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    Boshqaruv paneli (Admin)
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('rentals')}
                  className={`block w-full text-left px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'rentals' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Mening ijaralarim
                </button>
                <button 
                  onClick={() => setActiveTab('documents')}
                  className={`block w-full text-left px-4 py-3 font-medium rounded-xl transition-colors flex items-center justify-between ${activeTab === 'documents' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>Hujjatlarim</span>
                  {!isDocumentsVerified && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab('applications')}
                  className={`block w-full text-left px-4 py-3 font-medium rounded-xl transition-colors flex items-center justify-between ${activeTab === 'applications' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>Arizalar</span>
                  {(hostStatus === 'PENDING' || guestStatus === 'PENDING') && <div className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Kutmoqda</div>}
                </button>
                
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <button 
                    onClick={() => setActiveTab('about-me')}
                    className={`block w-full text-left px-4 py-3 font-medium rounded-xl transition-colors flex items-center gap-3 ${activeTab === 'about-me' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <UserCircle size={18} /> Men haqimda
                  </button>
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={`block w-full text-left px-4 py-3 font-medium rounded-xl transition-colors flex items-center gap-3 ${activeTab === 'security' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Shield size={18} /> Xavfsizlik
                  </button>
                  <button 
                    onClick={() => setActiveTab('help')}
                    className={`block w-full text-left px-4 py-3 font-medium rounded-xl transition-colors flex items-center gap-3 ${activeTab === 'help' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <HelpCircle size={18} /> Yordam
                  </button>
                </div>

                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-4">Tizimdan chiqish</button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            
            {activeTab === 'admin' && isAdminAuthenticated && (
               <AdminPanelContent />
            )}

            {activeTab === 'applications' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-200 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <FileText size={40} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Arizalar</h1>
                
                {!isHost ? (
                  <>
                    <p className="text-slate-600 max-w-lg mb-8 leading-relaxed">
                      Bo'sh turgan avtomobilingizni kunlik, haftalik yoki oylik ijaraga berib, qo'shimcha daromad toping. Host bo'lish uchun ariza qoldiring.
                    </p>
                    
                    {hostStatus === 'PENDING' ? (
                      <div className="bg-amber-50 border border-amber-200 text-amber-700 p-6 rounded-2xl w-full max-w-md">
                        <AlertTriangle className="mx-auto mb-3 text-amber-500" size={32} />
                        <h3 className="font-bold text-lg mb-2">Host arizangiz ko'rib chiqilmoqda!</h3>
                        <p className="text-sm">Adminlarimiz ma'lumotlaringizni tekshirmoqda. Tez orada sizga xabar beramiz.</p>
                      </div>
                    ) : (
                      <button 
                        onClick={requestHostRole}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand-500/30 hover:-translate-y-1"
                      >
                        Host bo'lishga ariza yuborish
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-slate-600 max-w-lg mb-8 leading-relaxed">
                      Avtomobillaringizni ijaraga berishni to'xtatmoqchimisiz? Ijarachilikdan chiqish va oddiy mijoz (Guest) bo'lish uchun ariza qoldiring.
                    </p>
                    
                    {guestStatus === 'PENDING' ? (
                      <div className="bg-amber-50 border border-amber-200 text-amber-700 p-6 rounded-2xl w-full max-w-md">
                        <AlertTriangle className="mx-auto mb-3 text-amber-500" size={32} />
                        <h3 className="font-bold text-lg mb-2">Guest arizangiz ko'rib chiqilmoqda!</h3>
                        <p className="text-sm">Adminlarimiz tez orada tasdiqlashadi.</p>
                      </div>
                    ) : (
                      <button 
                        onClick={requestGuestRole}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-500/30 hover:-translate-y-1"
                      >
                        Ijarachilikdan chiqish (Guest bo'lish)
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'rentals' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-900">Mening ijaralarim</h1>
                
                {activeRentals.length === 0 && pastRentals.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl text-center border border-slate-100">
                    <p className="text-slate-500 mb-4">Sizda hozircha hech qanday ijara tarixi yo'q.</p>
                    <Link to="/catalog" className="text-brand-600 font-bold hover:underline">Katalogga o'tish va avtomobil tanlash</Link>
                  </div>
                ) : (
                  <>
                    {activeRentals.map(rental => (
                      <Link key={rental.id} to={`/rental/${rental.id}`} className="block bg-white p-6 rounded-2xl shadow-sm border border-brand-200 relative overflow-hidden hover:shadow-md transition-shadow group">
                        <div className={`absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-xl ${rental.status === 'PENDING' ? 'bg-orange-500' : 'bg-brand-500'}`}>
                          {rental.status === 'PENDING' ? 'Kutilmoqda' : 'Faol'}
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          <img src={rental.carImage || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'; }} alt="Car" className="w-32 h-24 object-cover rounded-xl" />
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-slate-900 group-hover:text-brand-600 transition-colors">{rental.carBrand} {rental.carModel}</h3>
                            <p className="text-slate-500 text-sm mb-4">{rental.startDate} - {rental.endDate}</p>
                            <div className="flex flex-wrap gap-4 text-sm font-medium">
                              <span className="text-brand-600 flex items-center gap-1"><FileText size={16}/> Shartnoma</span>
                              <span className="text-amber-500 flex items-center gap-1"><Clock size={16}/> {rental.totalDays} kun</span>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div>
                              <p className="text-sm text-slate-500">Boshqarish</p>
                              <p className="text-sm font-bold text-brand-600 mb-2">Panelni ochish</p>
                            </div>
                            <ChevronRight className="text-brand-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}

                    {pastRentals.length > 0 && (
                      <>
                        <h2 className="text-xl font-bold text-slate-900 pt-4">Tarix</h2>
                        <div className="space-y-4">
                          {pastRentals.map(rental => (
                            <div key={rental.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden">
                                  <img src={rental.carImage || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'; }} alt="Car" className="w-full h-full object-cover grayscale opacity-70" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900">{rental.carBrand} {rental.carModel}</h4>
                                  <p className="text-xs text-slate-500">{rental.startDate} - {rental.endDate}</p>
                                </div>
                              </div>
                              <div className="text-right flex items-center gap-4">
                                <div>
                                  <p className="text-xs text-slate-500">{rental.status === 'REJECTED' ? 'Rad etilgan' : rental.status === 'CANCELLED' ? 'Bekor qilingan' : 'Yakunlangan'}</p>
                                  <p className="font-medium text-slate-900">{(rental.totalPrice / 1000).toLocaleString()} ming UZS</p>
                                </div>
                                <ChevronRight className="text-slate-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <>
                <h1 className="text-2xl font-bold text-slate-900">Shaxsiy Hujjatlar</h1>
                
                {isDocumentsVerified ? (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-200 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Hujjatlaringiz tasdiqlangan!</h2>
                    <p className="text-slate-500 max-w-md">Endi siz platformamizdagi barcha mashinalarni hech qanday cheklovsiz bron qilishingiz mumkin.</p>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-200">
                    <div className="bg-red-50 p-4 rounded-xl flex items-start gap-3 mb-6">
                      <AlertTriangle className="text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-900">Diqqat, hujjatlar to'liq emas!</h4>
                        <p className="text-red-700 text-sm mt-1">Avtomobil bron qilish xizmatidan foydalanish uchun pasportingiz va haydovchilik guvohnomangiz (prava) rasmini yuklashingiz shart.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                          <Upload size={24} />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">Pasport (yoki ID karta)</h4>
                        <p className="text-xs text-slate-500">Asosiy sahifasi rasmi</p>
                      </div>
                      
                      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                          <Upload size={24} />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">Prava</h4>
                        <p className="text-xs text-slate-500">Ikkala tomoni rasmi</p>
                      </div>
                    </div>

                    {isScanningFace ? (
                      <div className="mt-8 p-8 border-2 border-brand-100 bg-brand-50 rounded-2xl flex flex-col items-center justify-center animate-in fade-in zoom-in">
                        <div className="relative mb-6">
                          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-brand-200">
                            {scanProgress === 100 ? (
                              <CheckCircle size={40} className="text-green-500" />
                            ) : scanProgress > 10 ? (
                              <ScanFace size={40} className="text-brand-600 animate-pulse" />
                            ) : (
                              <Camera size={40} className="text-slate-400" />
                            )}
                          </div>
                          {scanProgress < 100 && (
                            <div className="absolute inset-0 rounded-full border-t-4 border-brand-600 animate-spin"></div>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{scanStep}</h3>
                        <div className="w-full max-w-xs bg-slate-200 rounded-full h-2.5 mb-2 overflow-hidden">
                          <div className="bg-brand-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${scanProgress}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500 text-center">Iltimos, kameraga to'g'ri qarab turing...</p>
                      </div>
                    ) : (
                      <div className="mt-8 flex justify-end">
                        <button 
                          onClick={startFaceScan}
                          className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg shadow-brand-500/30"
                        >
                          <ScanFace size={20} />
                          Tasdiqqa yuborish
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === 'about-me' && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <UserCircle className="text-brand-600" /> Men haqimda
                  </h2>
                  {!isEditingProfile ? (
                    <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2 text-brand-600 font-medium hover:bg-brand-50 px-4 py-2 rounded-xl transition-colors border border-brand-100">
                      <Edit2 size={18} /> Tahrirlash
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors font-medium">
                        Bekor qilish
                      </button>
                      <button onClick={handleProfileSave} className="flex items-center gap-2 bg-brand-600 text-white font-medium hover:bg-brand-700 px-4 py-2 rounded-xl transition-colors shadow-lg shadow-brand-500/30">
                        <Save size={18} /> Saqlash
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ism va Familiya</label>
                      {isEditingProfile ? (
                        <input 
                          type="text" 
                          value={profileData.name} 
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors bg-white"
                        />
                      ) : (
                        <div className="w-full py-3 px-4 bg-slate-50 text-slate-900 rounded-xl font-medium border border-transparent">
                          {profileData.name || 'Kiritilmagan'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Telefon raqam</label>
                      {isEditingProfile ? (
                        <input 
                          type="text" 
                          value={profileData.phone} 
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors bg-white"
                        />
                      ) : (
                        <div className="w-full py-3 px-4 bg-slate-50 text-slate-900 rounded-xl font-medium border border-transparent">
                          {profileData.phone || 'Kiritilmagan'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-red-600 mb-2">Xavfli hudud</h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Hisobingizni o'chirish barcha ma'lumotlaringiz, ijara tarixingiz va joriy arizalaringiz yo'qolishiga olib keladi. Bu amalni ortga qaytarib bo'lmaydi.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-xl font-medium transition-colors border border-red-200"
                  >
                    <Trash2 size={18} />
                    Hisobni butunlay o'chirish
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Shield className="text-brand-600" /> Xavfsizlik
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Parolni o'zgartirish</h3>
                    
                    {passwordStep === 'initial' && (
                      <div className="animate-in fade-in">
                        <p className="text-slate-500 text-sm mb-4">Hisobingiz xavfsizligini ta'minlash uchun parolingizni vaqtida yangilab turing.</p>
                        <button 
                          onClick={() => setPasswordStep('verify_old')}
                          className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-5 py-2.5 rounded-xl font-medium transition-colors"
                        >
                          Parolni yangilash
                        </button>
                      </div>
                    )}

                    {passwordStep === 'verify_old' && (
                      <div className="animate-in slide-in-from-right-4 max-w-md">
                        <p className="text-slate-500 text-sm mb-4">Iltimos, avval joriy parolingizni kiriting.</p>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Joriy parol</label>
                            <input 
                              type="password" 
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setPasswordStep('initial'); setOldPassword(''); }}
                              className="px-5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                            >
                              Bekor qilish
                            </button>
                            <button 
                              onClick={handleVerifyOldPassword}
                              className="bg-brand-600 text-white hover:bg-brand-700 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-brand-500/30"
                            >
                              Keyingisi
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {passwordStep === 'enter_new' && (
                      <div className="animate-in slide-in-from-right-4 max-w-md">
                        <p className="text-slate-500 text-sm mb-4">Yangi parolni kiriting va uni tasdiqlang.</p>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Yangi parol</label>
                            <input 
                              type="password" 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Yangi parolni tasdiqlang</label>
                            <input 
                              type="password" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                            />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button 
                              onClick={() => { 
                                setPasswordStep('initial'); 
                                setOldPassword(''); 
                                setNewPassword(''); 
                                setConfirmPassword(''); 
                              }}
                              className="px-5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                            >
                              Bekor qilish
                            </button>
                            <button 
                              onClick={handleUpdatePassword}
                              className="bg-brand-600 text-white hover:bg-brand-700 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-brand-500/30"
                            >
                              O'zgartirish
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <HelpCircle className="text-brand-600" /> Yordam va Qo'llab-quvvatlash
                </h2>
                <div className="space-y-4">
                  <div className="p-5 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                    <h3 className="font-bold text-slate-800 mb-2">Avtomobilni qanday bron qilaman?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Katalog sahifasiga o'ting, o'zingizga yoqqan avtomobilni tanlang va "Band qilish" tugmasini bosing. Kerakli sanalarni tanlab, to'lovni amalga oshiring.</p>
                  </div>
                  <div className="p-5 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                    <h3 className="font-bold text-slate-800 mb-2">Hujjatlarni qanday tasdiqlayman?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">"Hujjatlarim" bo'limiga o'tib, pasport va haydovchilik guvohnomangiz rasmlarini yuklang hamda yuzingizni skaner qiling. Tasdiqlash jarayoni bir necha daqiqa vaqt oladi.</p>
                  </div>
                  <div className="p-5 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                    <h3 className="font-bold text-slate-800 mb-2">Qo'llab-quvvatlash xizmati bilan qanday bog'lanaman?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Biz bilan bog'lanish uchun telegram botimiz <strong>@carbooking_support</strong> orqali yozishingiz yoki <strong>+998 71 200-00-00</strong> raqamiga qo'ng'iroq qilishingiz mumkin.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
