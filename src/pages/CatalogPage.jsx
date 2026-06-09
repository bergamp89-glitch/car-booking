import { useState, useMemo } from 'react';
import { useCars } from '../contexts/CarContext';
import { Filter, Settings2, Fuel, Users, CheckCircle2, Map, List, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CatalogPage() {
  const { cars: allCars } = useCars();
  const cars = allCars.filter(c => c.status === 'ACTIVE');
  
  // Filters State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Barchasi');
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [transmission, setTransmission] = useState('Barchasi');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchKeyword = searchKeyword === '' || 
        car.brand.toLowerCase().includes(searchKeyword.toLowerCase()) || 
        car.model.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchBrand = selectedBrand === 'Barchasi' || car.brand === selectedBrand;
      const getPrice = (c) => {
        if (c.price) return c.price.daily || (c.price.weekly ? c.price.weekly / 7 : (c.price.monthly ? c.price.monthly / 30 : (c.price.hourly ? c.price.hourly * 24 : Infinity)));
        return c.pricePerDay || (c.pricePerWeek ? c.pricePerWeek / 7 : (c.pricePerMonth ? c.pricePerMonth / 30 : Infinity));
      };
      const dailyEq = getPrice(car);
      const matchPrice = dailyEq <= maxPrice;
      const matchTransmission = transmission === 'Barchasi' || car.transmission === transmission;
      
      return matchKeyword && matchBrand && matchPrice && matchTransmission;
    });
  }, [cars, searchKeyword, selectedBrand, maxPrice, transmission]);

  const brands = ['Barchasi', 'Chevrolet', 'Hyundai', 'Kia', 'Toyota'];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <Filter size={20} className="text-brand-600" />
                <h2 className="font-bold text-lg text-slate-900">Filtrlar</h2>
              </div>
              
              {/* Qidiruv */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Qidiruv</h3>
                <input 
                  type="text" 
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Avtomobil modeli..." 
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              {/* Brend */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Brend</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="brand"
                        value={brand}
                        checked={selectedBrand === brand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300" 
                      />
                      <span className={`text-sm ${selectedBrand === brand ? 'font-medium text-brand-600' : 'text-slate-600 group-hover:text-brand-600'} transition-colors`}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Uzatma qutisi</h3>
                <div className="space-y-2">
                  {['Barchasi', 'Avtomat', 'Mexanika'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="transmission"
                        value={type}
                        checked={transmission === type}
                        onChange={(e) => setTransmission(e.target.value)}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300" 
                      />
                      <span className={`text-sm ${transmission === type ? 'font-medium text-brand-600' : 'text-slate-600 group-hover:text-brand-600'} transition-colors`}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Narx */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Maksimal narx (kuniga)</h3>
                <p className="font-bold text-brand-600 mb-2 text-center">{(maxPrice / 1000).toLocaleString()} ming UZS</p>
                <input 
                  type="range" 
                  className="w-full accent-brand-600" 
                  min="200000" 
                  max="2000000" 
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>200k</span>
                  <span>2M</span>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setSearchKeyword('');
                  setSelectedBrand('Barchasi');
                  setMaxPrice(1000000);
                  setTransmission('Barchasi');
                }}
                className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                Filtrlarni tozalash
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                Avtomobillar <span className="text-slate-500 text-lg font-normal">({filteredCars.length} ta natija)</span>
              </h1>
              
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <List size={16} /> Ro'yxat
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Map size={16} /> Xarita
                </button>
              </div>
            </div>

            {viewMode === 'map' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-[600px] flex items-center justify-center relative overflow-hidden">
                {/* Mock Map Background */}
                <div className="absolute inset-0 bg-slate-100 z-0 opacity-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                
                {/* Map Interface Overlay */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <button className="bg-white p-2 rounded-lg shadow-md hover:bg-slate-50">+</button>
                  <button className="bg-white p-2 rounded-lg shadow-md hover:bg-slate-50">-</button>
                </div>

                {/* Mock Pins */}
                {filteredCars.slice(0, 5).map((car, idx) => (
                  <div key={car.id} className="absolute z-10 group" style={{ 
                    top: `${20 + (idx * 15)}%`, 
                    left: `${20 + (idx * 10) + (idx % 2 === 0 ? 20 : 0)}%` 
                  }}>
                    <div className="relative">
                      <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-500/40 cursor-pointer animate-bounce relative z-10">
                        <MapPin size={20} />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <img src={car.image} alt={car.brand} className="w-full h-24 object-cover rounded-lg mb-2" />
                        <p className="font-bold text-slate-900 text-sm truncate">{car.brand} {car.model}</p>
                        <p className="text-brand-600 font-bold text-xs">{car.price?.daily || car.pricePerDay} UZS/kun</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-slate-100 text-slate-600 font-medium text-sm flex items-center gap-2">
                  <MapPin size={16} className="text-brand-500" />
                  Xaritada qidiruv faqat "Mock" sifatida ishlamoqda
                </div>
              </div>
            ) : (
              filteredCars.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Hech narsa topilmadi</h3>
                <p className="text-slate-500 mb-6">Ushbu filtrlar bo'yicha mashina mavjud emas. Filtrlarni o'zgartirib ko'ring.</p>
                <button 
                  onClick={() => { setSelectedBrand('Barchasi'); setTransmission('Barchasi'); setMaxPrice(1000000); }}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <div key={car.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={car.image || (car.photos && car.photos.length > 0 ? car.photos[0] : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800')} 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'; }}
                        alt={car.model} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
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
                        <div className="flex items-center gap-1" title="Uzatma qutisi"><Settings2 size={16} className="text-slate-400" /> {car.transmission}</div>
                        <div className="flex items-center gap-1" title="Yoqilg'i"><Fuel size={16} className="text-slate-400" /> {car.fuel}</div>
                        <div className="flex items-center gap-1" title="O'rindiqlar"><Users size={16} className="text-slate-400" /> {car.seats}</div>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          {car.price?.hourly ? (
                            <>
                              <p className="text-xs text-slate-500">Soatlik ijara</p>
                              <p className="font-bold text-lg text-brand-600">{(car.price.hourly / 1000).toLocaleString()} ming {car.currency}</p>
                            </>
                          ) : car.price?.daily || car.pricePerDay ? (
                            <>
                              <p className="text-xs text-slate-500">Kunlik ijara</p>
                              <p className="font-bold text-lg text-brand-600">{((car.price?.daily || car.pricePerDay) / 1000).toLocaleString()} ming {car.currency}</p>
                            </>
                          ) : car.price?.weekly || car.pricePerWeek ? (
                            <>
                              <p className="text-xs text-slate-500">Haftalik ijara</p>
                              <p className="font-bold text-lg text-brand-600">{((car.price?.weekly || car.pricePerWeek) / 1000).toLocaleString()} ming {car.currency}</p>
                            </>
                          ) : car.price?.monthly || car.pricePerMonth ? (
                            <>
                              <p className="text-xs text-slate-500">Oylik ijara</p>
                              <p className="font-bold text-lg text-brand-600">{((car.price?.monthly || car.pricePerMonth) / 1000).toLocaleString()} ming {car.currency}</p>
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
            )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
