import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Check if it's admin
    if (phone === 'admin' && password === 'admin123') {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.success('Admin paneliga muvaffaqiyatli kirdingiz!', { icon: '🔐' });
      });
      adminLogin(phone, password);
      // Give admin full user capabilities
      login({ id: 'admin-1', name: 'Super Admin', phone: 'admin', role: 'ADMIN', documentsVerified: true });
      navigate('/admin');
      return;
    }

    // Mock normal user login logic
    login({ id: 1, name: 'Foydalanuvchi', phone, role: 'GUEST', documentsVerified: false });
    navigate('/profile');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-600 text-white p-3 rounded-xl shadow-lg shadow-brand-500/30">
            <Car size={32} />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
          Tizimga kirish
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Yoki{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500">
            yangi akkaunt ochish
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                Telefon raqam (yoki admin login)
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="+998 / admin"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Parol
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Meni eslab qol
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                  Parolni unutdingizmi?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              >
                Kirish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
