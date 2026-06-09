import { Car } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-brand-600 text-white p-2 rounded-lg">
                <Car size={24} />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">CARBOOKING</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              O'zbekistonda ishonchli va xavfsiz avtomobil ijarasi platformasi. O'z avtomobilingizni ijaraga bering yoki xohlagan avtomobilingizni oson bron qiling.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Havolalar</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Katalog</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Qanday ishlaydi?</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Xavfsizlik</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Aloqa</h3>
            <ul className="space-y-2 text-slate-400">
              <li>Toshkent sh, Chilonzor</li>
              <li>+998 90 123 45 67</li>
              <li>info@carbooking.uz</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} CARBOOKING. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
