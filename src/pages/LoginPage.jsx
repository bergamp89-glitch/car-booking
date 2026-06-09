import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Phone, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (phone === 'admin' && password === 'admin123') {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.success('Admin paneliga muvaffaqiyatli kirdingiz!', { icon: '🔐' });
      });
      adminLogin(phone, password);
      login({ id: 'admin-1', name: 'Super Admin', phone: 'admin', role: 'ADMIN', documentsVerified: true });
      navigate('/admin');
      return;
    }

    login({ id: 1, name: 'Foydalanuvchi', phone, role: 'GUEST', documentsVerified: false });
    navigate('/profile');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-600 text-white p-3 rounded-2xl shadow-lg shadow-brand-500/30">
            <Car size={36} />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 mb-2">
          Tizimga kirish
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Davom etish uchun ma'lumotlaringizni kiriting
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl border border-slate-100 sm:px-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-1.5">
                Telefon raqam (yoki admin)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Phone size={20} />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1.5">
                Parol
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-brand-600 focus:ring-brand-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-700 cursor-pointer">
                  Meni eslab qol
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
                  Parolni unutdingizmi?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-md shadow-brand-500/20 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all active:scale-[0.98]"
              >
                Kirish
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Akkauntingiz yo'qmi?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
