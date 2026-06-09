import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    const success = adminLogin(username, password);
    if (success) {
      toast.success('Admin paneliga muvaffaqiyatli kirdingiz!', { icon: '🔐' });
      navigate('/admin');
    } else {
      toast.error('Login yoki parol noto\'g\'ri!');
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Kirish</h2>
          <p className="text-slate-500 mt-2">Platforma boshqaruv paneliga xush kelibsiz</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Admin Login</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                placeholder="admin"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Parol</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all"
          >
            Kirish
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-500">
          * Faqat tasdiqlangan adminlar uchun
        </div>
      </div>
    </div>
  );
}
