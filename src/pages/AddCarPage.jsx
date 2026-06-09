import { useState, useEffect } from 'react';
import { Camera, MapPin, Settings2, Info, ArrowRight, CheckCircle2, FileText, ListChecks } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCars } from '../contexts/CarContext';
import { useAuth } from '../contexts/AuthContext';

export default function AddCarPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { addCar, updateCar, cars } = useCars();
  const { user, isDocumentsVerified } = useAuth();

  // Form states
  const [brand, setBrand] = useState('Chevrolet');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  // Pricing states
  const [hasDaily, setHasDaily] = useState(true);
  const [hasWeekly, setHasWeekly] = useState(false);
  const [hasMonthly, setHasMonthly] = useState(false);
  const [pricePerDay, setPricePerDay] = useState('');
  const [pricePerWeek, setPricePerWeek] = useState('');
  const [pricePerMonth, setPricePerMonth] = useState('');
  const [fuelType, setFuelType] = useState('Benzin');
  const [transmission, setTransmission] = useState('Avtomat');
  const [seats, setSeats] = useState('5');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceName, setInsuranceName] = useState('');
  const [isInsuranceVerified, setIsInsuranceVerified] = useState(false);
  
  // Features states
  const [safetyFeatures, setSafetyFeatures] = useState([]);
  const [connectivityFeatures, setConnectivityFeatures] = useState([]);
  const [extraEquipments, setExtraEquipments] = useState([]);
  const [customEquipmentInput, setCustomEquipmentInput] = useState('');
  const [customEquipmentsList, setCustomEquipmentsList] = useState([]);
  
  const [amenityFeatures, setAmenityFeatures] = useState(["Navbatsiz ijaraga olish", "Qo'shimcha haydovchilarni bepul qo'shish", "Qaytarish uchun 30 daqiqalik imtiyoz"]);
  const [customAmenityInput, setCustomAmenityInput] = useState('');
  const [customAmenitiesList, setCustomAmenitiesList] = useState([]);

  const [peaceOfMindFeatures, setPeaceOfMindFeatures] = useState(["Mashinani yuvish shart emas, lekin toza saqlang", "24/7 yo'l yordam xizmati bepul", "24/7 mijozlarni qo'llab-quvvatlash xizmati"]);
  const [customPeaceOfMindInput, setCustomPeaceOfMindInput] = useState('');
  const [customPeaceOfMindList, setCustomPeaceOfMindList] = useState([]);

  const [customSafetyInput, setCustomSafetyInput] = useState('');
  const [customSafetyList, setCustomSafetyList] = useState([]);

  const [customConnectivityInput, setCustomConnectivityInput] = useState('');
  const [customConnectivityList, setCustomConnectivityList] = useState([]);


  const [cancellationPolicy, setCancellationPolicy] = useState("Bepul bekor qilish");
  const [paymentMethod, setPaymentMethod] = useState("Karta yoki Naqd pulda");
  
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    if (isEditing) {
      const carToEdit = cars.find(c => c.id === parseInt(id));
      if (carToEdit) {
        setBrand(carToEdit.brand || '');
        setModel(carToEdit.model || '');
        setYear(carToEdit.year?.toString() || '');
        setDescription(carToEdit.description || '');
        setFuelType(carToEdit.fuelType || carToEdit.fuel || 'Benzin');
        setTransmission(carToEdit.transmission || 'Avtomat');
        setSeats(carToEdit.seats?.toString() || '5');
        
        if (carToEdit.price) {
          if (carToEdit.price.daily) { setHasDaily(true); setPricePerDay(carToEdit.price.daily.toString()); }
          if (carToEdit.price.weekly) { setHasWeekly(true); setPricePerWeek(carToEdit.price.weekly.toString()); }
          if (carToEdit.price.monthly) { setHasMonthly(true); setPricePerMonth(carToEdit.price.monthly.toString()); }
        } else {
          if (carToEdit.pricePerDay) { setHasDaily(true); setPricePerDay(carToEdit.pricePerDay.toString()); }
          if (carToEdit.pricePerWeek) { setHasWeekly(true); setPricePerWeek(carToEdit.pricePerWeek.toString()); }
          if (carToEdit.pricePerMonth) { setHasMonthly(true); setPricePerMonth(carToEdit.pricePerMonth.toString()); }
        }

        if (carToEdit.features) {
          setSafetyFeatures(carToEdit.features.safety || []);
          setConnectivityFeatures(carToEdit.features.connectivity || []);
          setExtraEquipments(carToEdit.features.extras || []);
          setAmenityFeatures(carToEdit.features.amenities || []);
          setPeaceOfMindFeatures(carToEdit.features.peaceOfMind || []);
        }

        if (carToEdit.policies) {
          setCancellationPolicy(carToEdit.policies.cancellation || "Bepul bekor qilish");
          setPaymentMethod(carToEdit.policies.payment || "Karta yoki Naqd pulda");
        }

        if (carToEdit.photos && carToEdit.photos.length > 0) {
          setPreviewUrls(carToEdit.photos);
        } else if (carToEdit.image) {
          setPreviewUrls([carToEdit.image]);
        }
      }
    }
  }, [id, cars, isEditing]);

  const SAFETY_OPTIONS = ["To'liq uzatma", "Orqa kamera", "Ko'rinmas zonalar nazorati", "Tormoz yordamchisi", "Kruiz nazorati", "Avtoturargoh datchiklari"];
  const CONNECTIVITY_OPTIONS = ["Android Auto", "Apple CarPlay", "AUX ulanish", "Bluetooth", "USB port", "GPS navigatsiya"];
  const EXTRA_EQUIPMENT_OPTIONS = ["Radar-detektor", "Videoregistrator", "Tonirovka (Ruxsatnomasi bilan)", "Bolalar o'rindig'i", "Tomda bagaj"];
  const AMENITY_OPTIONS = ["Navbatsiz ijaraga olish", "Qo'shimcha haydovchilarni bepul qo'shish", "Qaytarish uchun 30 daqiqalik imtiyoz"];
  const PEACE_OF_MIND_OPTIONS = ["Mashinani yuvish shart emas, lekin toza saqlang", "24/7 yo'l yordam xizmati bepul", "24/7 mijozlarni qo'llab-quvvatlash xizmati"];

  const toggleSafetyFeature = (feature) => {
    setSafetyFeatures(prev => prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]);
  };

  const toggleConnectivityFeature = (feature) => {
    setConnectivityFeatures(prev => prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]);
  };

  const toggleExtraEquipment = (feature) => {
    setExtraEquipments(prev => prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]);
  };

  const handleAddCustomEquipment = () => {
    if (customEquipmentInput.trim() !== '') {
      const newFeature = customEquipmentInput.trim();
      if (!customEquipmentsList.includes(newFeature) && !EXTRA_EQUIPMENT_OPTIONS.includes(newFeature)) {
        setCustomEquipmentsList([...customEquipmentsList, newFeature]);
        setExtraEquipments([...extraEquipments, newFeature]);
      } else if (!extraEquipments.includes(newFeature)) {
        setExtraEquipments([...extraEquipments, newFeature]);
      }
      setCustomEquipmentInput('');
    }
  };

  const toggleAmenityFeature = (feature) => {
    setAmenityFeatures(prev => prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]);
  };

  const handleAddCustomAmenity = () => {
    if (customAmenityInput.trim() !== '') {
      const newFeature = customAmenityInput.trim();
      if (!customAmenitiesList.includes(newFeature) && !AMENITY_OPTIONS.includes(newFeature)) {
        setCustomAmenitiesList([...customAmenitiesList, newFeature]);
        setAmenityFeatures([...amenityFeatures, newFeature]);
      } else if (!amenityFeatures.includes(newFeature)) {
        setAmenityFeatures([...amenityFeatures, newFeature]);
      }
      setCustomAmenityInput('');
    }
  };

  const togglePeaceOfMindFeature = (feature) => {
    setPeaceOfMindFeatures(prev => prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]);
  };

  const handleAddCustomPeaceOfMind = () => {
    if (customPeaceOfMindInput.trim() !== '') {
      const newFeature = customPeaceOfMindInput.trim();
      if (!customPeaceOfMindList.includes(newFeature) && !PEACE_OF_MIND_OPTIONS.includes(newFeature)) {
        setCustomPeaceOfMindList([...customPeaceOfMindList, newFeature]);
        setPeaceOfMindFeatures([...peaceOfMindFeatures, newFeature]);
      } else if (!peaceOfMindFeatures.includes(newFeature)) {
        setPeaceOfMindFeatures([...peaceOfMindFeatures, newFeature]);
      }
      setCustomPeaceOfMindInput('');
    }
  };

  const handleAddCustomSafety = () => {
    if (customSafetyInput.trim() !== '') {
      const newFeature = customSafetyInput.trim();
      if (!customSafetyList.includes(newFeature) && !SAFETY_OPTIONS.includes(newFeature)) {
        setCustomSafetyList([...customSafetyList, newFeature]);
        setSafetyFeatures([...safetyFeatures, newFeature]);
      } else if (!safetyFeatures.includes(newFeature)) {
        setSafetyFeatures([...safetyFeatures, newFeature]);
      }
      setCustomSafetyInput('');
    }
  };

  const handleAddCustomConnectivity = () => {
    if (customConnectivityInput.trim() !== '') {
      const newFeature = customConnectivityInput.trim();
      if (!customConnectivityList.includes(newFeature) && !CONNECTIVITY_OPTIONS.includes(newFeature)) {
        setCustomConnectivityList([...customConnectivityList, newFeature]);
        setConnectivityFeatures([...connectivityFeatures, newFeature]);
      } else if (!connectivityFeatures.includes(newFeature)) {
        setConnectivityFeatures([...connectivityFeatures, newFeature]);
      }
      setCustomConnectivityInput('');
    }
  };

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleInsuranceUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const toastId = toast.loading("Sug'urta hujjati tekshirilmoqda...");
      setTimeout(() => {
        setIsInsuranceVerified(true);
        toast.success("Sug'urta haqiqiyligi tasdiqlandi!", { id: toastId });
      }, 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasDaily && !hasWeekly && !hasMonthly) {
      toast.error("Kamida bitta tarif turini tanlang!");
      return;
    }
    if (hasInsurance && (!insuranceName || !isInsuranceVerified)) {
      toast.error("Iltimos, sug'urta nomini kiriting va hujjatini tasdiqlang!");
      return;
    }

    const newCar = {
      brand,
      model,
      year: parseInt(year),
      description,
      fuelType,
      transmission,
      seats: parseInt(seats),
      insurance: hasInsurance ? insuranceName : 'Mavjud emas',
      rating: 5.0,
      reviews: 0,
      currency: 'UZS',
      ownerId: user?.id || 1,
      owner: {
        name: user?.name || 'Avto egasi',
        phone: user?.phone || '+998 90 000 00 00',
        verified: isDocumentsVerified || false
      },
      features: {
        safety: safetyFeatures,
        connectivity: connectivityFeatures,
        extras: extraEquipments,
        amenities: amenityFeatures,
        peaceOfMind: peaceOfMindFeatures,
      },
      policies: {
        cancellation: cancellationPolicy,
        payment: paymentMethod
      },
      photos: previewUrls,
      image: previewUrls.length > 0 ? previewUrls[0] : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      price: {
        daily: hasDaily ? parseInt(pricePerDay) : null,
        weekly: hasWeekly ? parseInt(pricePerWeek) : null,
        monthly: hasMonthly ? parseInt(pricePerMonth) : null
      }
    };

    if (isEditing) {
      updateCar(parseInt(id), newCar);
      toast.success("Avtomobil ma'lumotlari yangilandi!", { icon: '✅' });
    } else {
      addCar(newCar);
      toast.success("Avtomobil muvaffaqiyatli qo'shildi!", { icon: '🎉' });
    }
    navigate('/host/dashboard');
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{isEditing ? "Avtomobil ma'lumotlarini tahrirlash" : "Yangi avtomobil qo'shish"}</h1>
          <p className="text-slate-500">{isEditing ? "Avtomobil ma'lumotlarini o'zgartiring va saqlang." : "Ijaraga berish uchun avtomobilingiz ma'lumotlarini kiriting."}</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-bold text-sm md:text-base ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
          <div className={`flex-1 h-1 mx-1 md:mx-2 ${step >= 2 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-bold text-sm md:text-base ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
          <div className={`flex-1 h-1 mx-1 md:mx-2 ${step >= 3 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-bold text-sm md:text-base ${step >= 3 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
          <div className={`flex-1 h-1 mx-1 md:mx-2 ${step >= 4 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-bold text-sm md:text-base ${step >= 4 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>4</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            
            {/* Step 1: Asosiy ma'lumotlar */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Info className="text-brand-600" /> Asosiy ma'lumotlar
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Marka</label>
                    <select required value={brand} onChange={e => setBrand(e.target.value)} className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500">
                      <option value="">Tanlang...</option>
                      <option value="Chevrolet">Chevrolet</option>
                      <option value="Kia">Kia</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Toyota">Toyota</option>
                      <option value="BMW">BMW</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                    <input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder="Masalan: Malibu 2" required className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ishlab chiqarilgan yil</label>
                    <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="2023" required className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Davlat raqami</label>
                    <input type="text" placeholder="01 A 777 AA" required className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Avtomobil haqida</label>
                    <textarea 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      placeholder="Avtomobil haqida batafsil ma'lumot (holati, qulayliklari, shartlari...)" 
                      required 
                      className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[120px] resize-y" 
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Texnik & Narx */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Settings2 className="text-brand-600" /> Texnik va Narx
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Uzatma qutisi</label>
                    <select required value={transmission} onChange={e => setTransmission(e.target.value)} className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500">
                      <option value="Avtomat">Avtomat</option>
                      <option value="Mexanika">Mexanika</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Yoqilg'i turi</label>
                    <select required value={fuelType} onChange={e => setFuelType(e.target.value)} className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500">
                      <option value="Benzin">Benzin</option>
                      <option value="Metan">Metan</option>
                      <option value="Propan">Propan</option>
                      <option value="Elektro">Elektro</option>
                      <option value="Gibrid">Gibrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">O'rindiqlar soni</label>
                    <input type="number" value={seats} onChange={e => setSeats(e.target.value)} min="2" max="15" required className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                  <div className="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input type="checkbox" checked={hasInsurance} onChange={e => setHasInsurance(e.target.checked)} className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500" />
                      <span className="font-bold text-slate-900">Mashina sug'urtalanganmi?</span>
                    </label>
                    
                    {hasInsurance && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Sug'urta nomi</label>
                          <input type="text" value={insuranceName} onChange={e => setInsuranceName(e.target.value)} placeholder="Masalan: KASKO - O'zbekinvest" className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Sug'urta PDF hujjati</label>
                          <div className="relative">
                            <input type="file" accept=".pdf" onChange={handleInsuranceUpload} className="hidden" id="insurance-pdf" />
                            <label htmlFor="insurance-pdf" className={`w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 px-4 cursor-pointer transition-colors ${isInsuranceVerified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>
                              {isInsuranceVerified ? <CheckCircle2 size={20} /> : <FileText size={20} />}
                              {isInsuranceVerified ? 'Tasdiqlangan' : 'PDF yuklash'}
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Tariflarni sozlash</label>
                    
                    {/* Daily */}
                    <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                      <input type="checkbox" id="hasDaily" checked={hasDaily} onChange={(e) => setHasDaily(e.target.checked)} className="mt-1 w-5 h-5 text-brand-600 focus:ring-brand-500 rounded border-slate-300" />
                      <div className="flex-1">
                        <label htmlFor="hasDaily" className="block text-sm font-bold text-slate-900 mb-1 cursor-pointer">Kunlik tarif</label>
                        {hasDaily && (
                          <div className="relative mt-2">
                            <input type="number" value={pricePerDay} onChange={e => setPricePerDay(e.target.value)} placeholder="400000" required className="w-full border border-slate-200 rounded-xl py-3 px-4 pr-16 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xl font-bold text-slate-900 bg-white" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">UZS</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Weekly */}
                    <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                      <input type="checkbox" id="hasWeekly" checked={hasWeekly} onChange={(e) => setHasWeekly(e.target.checked)} className="mt-1 w-5 h-5 text-brand-600 focus:ring-brand-500 rounded border-slate-300" />
                      <div className="flex-1">
                        <label htmlFor="hasWeekly" className="block text-sm font-bold text-slate-900 mb-1 cursor-pointer">Haftalik tarif</label>
                        {hasWeekly && (
                          <div className="relative mt-2">
                            <input type="number" value={pricePerWeek} onChange={e => setPricePerWeek(e.target.value)} placeholder="2500000" required className="w-full border border-slate-200 rounded-xl py-3 px-4 pr-16 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xl font-bold text-slate-900 bg-white" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">UZS</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Monthly */}
                    <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                      <input type="checkbox" id="hasMonthly" checked={hasMonthly} onChange={(e) => setHasMonthly(e.target.checked)} className="mt-1 w-5 h-5 text-brand-600 focus:ring-brand-500 rounded border-slate-300" />
                      <div className="flex-1">
                        <label htmlFor="hasMonthly" className="block text-sm font-bold text-slate-900 mb-1 cursor-pointer">Oylik tarif</label>
                        {hasMonthly && (
                          <div className="relative mt-2">
                            <input type="number" value={pricePerMonth} onChange={e => setPricePerMonth(e.target.value)} placeholder="9000000" required className="w-full border border-slate-200 rounded-xl py-3 px-4 pr-16 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xl font-bold text-slate-900 bg-white" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">UZS</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Avtomobil turar joyi (Manzil)</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input type="text" placeholder="Toshkent sh, Chilonzor tumani..." required className="w-full border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Xususiyatlar */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <ListChecks className="text-brand-600" /> Avtomobil xususiyatlari
                </h3>
                
                <div>
                  <h4 className="font-bold text-slate-900 mb-3">Xavfsizlik tizimlari</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {[...SAFETY_OPTIONS, ...customSafetyList].map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${safetyFeatures.includes(opt) ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                        <input 
                          type="checkbox" 
                          checked={safetyFeatures.includes(opt)} 
                          onChange={() => toggleSafetyFeature(opt)}
                          className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                        />
                        <span className={`text-sm font-medium ${safetyFeatures.includes(opt) ? 'text-brand-900' : 'text-slate-700'}`}>{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 max-w-md">
                    <input 
                      type="text" 
                      value={customSafetyInput}
                      onChange={(e) => setCustomSafetyInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSafety())}
                      placeholder="Boshqa xavfsizlik tizimi qo'shish..." 
                      className="flex-1 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddCustomSafety}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
                    >
                      Qo'shish
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3">Qurilmalar bilan aloqa va multimedia</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {[...CONNECTIVITY_OPTIONS, ...customConnectivityList].map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${connectivityFeatures.includes(opt) ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                        <input 
                          type="checkbox" 
                          checked={connectivityFeatures.includes(opt)} 
                          onChange={() => toggleConnectivityFeature(opt)}
                          className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                        />
                        <span className={`text-sm font-medium ${connectivityFeatures.includes(opt) ? 'text-brand-900' : 'text-slate-700'}`}>{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 max-w-md">
                    <input 
                      type="text" 
                      value={customConnectivityInput}
                      onChange={(e) => setCustomConnectivityInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomConnectivity())}
                      placeholder="Boshqa qurilma qo'shish..." 
                      className="flex-1 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddCustomConnectivity}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
                    >
                      Qo'shish
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3">Qo'shimcha uskunalar</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {[...EXTRA_EQUIPMENT_OPTIONS, ...customEquipmentsList].map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${extraEquipments.includes(opt) ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                        <input 
                          type="checkbox" 
                          checked={extraEquipments.includes(opt)} 
                          onChange={() => toggleExtraEquipment(opt)}
                          className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                        />
                        <span className={`text-sm font-medium ${extraEquipments.includes(opt) ? 'text-brand-900' : 'text-slate-700'}`}>{opt}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 max-w-md">
                    <input 
                      type="text" 
                      value={customEquipmentInput}
                      onChange={(e) => setCustomEquipmentInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomEquipment())}
                      placeholder="Boshqa uskuna qo'shish..." 
                      className="flex-1 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddCustomEquipment}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
                    >
                      Qo'shish
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3">Narxga kiritilgan xizmatlar (Qulayliklar)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {[...AMENITY_OPTIONS, ...customAmenitiesList].map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${amenityFeatures.includes(opt) ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                        <input 
                          type="checkbox" 
                          checked={amenityFeatures.includes(opt)} 
                          onChange={() => toggleAmenityFeature(opt)}
                          className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                        />
                        <span className={`text-sm font-medium ${amenityFeatures.includes(opt) ? 'text-brand-900' : 'text-slate-700'}`}>{opt}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-2 max-w-md">
                    <input 
                      type="text" 
                      value={customAmenityInput}
                      onChange={(e) => setCustomAmenityInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomAmenity())}
                      placeholder="Yangi qulaylik qo'shish..." 
                      className="flex-1 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddCustomAmenity}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
                    >
                      Qo'shish
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3">Xotirjamlik</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {[...PEACE_OF_MIND_OPTIONS, ...customPeaceOfMindList].map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${peaceOfMindFeatures.includes(opt) ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                        <input 
                          type="checkbox" 
                          checked={peaceOfMindFeatures.includes(opt)} 
                          onChange={() => togglePeaceOfMindFeature(opt)}
                          className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                        />
                        <span className={`text-sm font-medium ${peaceOfMindFeatures.includes(opt) ? 'text-brand-900' : 'text-slate-700'}`}>{opt}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-2 max-w-md">
                    <input 
                      type="text" 
                      value={customPeaceOfMindInput}
                      onChange={(e) => setCustomPeaceOfMindInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomPeaceOfMind())}
                      placeholder="Yangi xotirjamlik xizmati qo'shish..." 
                      className="flex-1 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddCustomPeaceOfMind}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
                    >
                      Qo'shish
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3">Avtomobil haqida qo'shimcha ma'lumot (Ixtiyoriy)</h4>
                  <p className="text-sm text-slate-500 mb-3">Avtomobilingizning o'ziga xos tomonlari, holati yoki ijarachilar bilishi kerak bo'lgan boshqa muhim ma'lumotlarni yozing.</p>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Masalan: Mashina juda toza va yaxshi saqlangan. Faqat ai-95 benzin quyiladi..."
                    className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[120px] resize-y"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Bekor qilish qoidalari</h4>
                    <select value={cancellationPolicy} onChange={e => setCancellationPolicy(e.target.value)} className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500">
                      <option value="Bepul bekor qilish">Bepul bekor qilish</option>
                      <option value="Qat'iy bekor qilish">Qat'iy bekor qilish</option>
                    </select>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">To'lov usullari</h4>
                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500">
                      <option value="Karta yoki Naqd pulda">Karta yoki Naqd pulda</option>
                      <option value="Faqat Karta orqali">Faqat Karta orqali</option>
                      <option value="Faqat Naqd pulda">Faqat Naqd pulda</option>
                    </select>
                  </div>
                </div>

              </div>
            )}

            {/* Step 4: Rasmlar */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Camera className="text-brand-600" /> Avtomobil rasmlari
                </h3>
                
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group relative">
                  <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Camera size={32} />
                  </div>
                  <p className="font-medium text-slate-900 mb-1">Rasmlarni shu yerga tashlang yoki bosing</p>
                  <p className="text-sm text-slate-500">Kamida 3 ta sifatli rasm (Old, orqa, salon)</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={(e) => {
                      if (e.target.files) {
                        const newUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
                        setPreviewUrls(prev => [...prev, ...newUrls]);
                      }
                    }}
                  />
                </div>
                
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group">
                        <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setPreviewUrls(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex gap-3 text-sm border border-blue-100">
                  <Info className="shrink-0" />
                  <p>Yaxshi yoritilgan va sifatli rasmlar avtomobilingiz ijaraga ketish imkoniyatini 70% ga oshiradi.</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
              {step > 1 ? (
                <button type="button" onClick={handlePrev} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                  Orqaga
                </button>
              ) : <div></div>}

              {step < 4 ? (
                <button type="submit" className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                  Keyingisi <ArrowRight size={18} />
                </button>
              ) : (
                <button type="submit" className="px-8 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-lg shadow-brand-500/30">
                  <CheckCircle2 size={20} /> Yakunlash va Qo'shish
                </button>
              )}
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}
