import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, User, Menu, X, ArrowRightLeft, LogOut, MessageSquare, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isHost, hostStatus, requestHostRole, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <div className="bg-brand-600 text-white p-2 rounded-lg">
              <Car size={24} />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">CARBOOKING</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/catalog" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Katalog</Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Mening ijaralarim</Link>

                {isHost ? (
                  <>
                    <Link to="/host/dashboard" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Host Dashboard</Link>
                    <Link to="/add-car" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Avto qo'shish</Link>
                  </>
                ) : (
                  <>

                  </>
                )}

                <Link to="/messages" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">
                  <MessageSquare size={20} />
                </Link>

                <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                  <Link to="/profile" className="flex items-center gap-2 text-brand-600 font-medium bg-brand-50 px-4 py-2 rounded-full hover:bg-brand-100 transition-colors">
                    <User size={18} />
                    <span>Profil</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-brand-600 font-medium transition-colors">
                  <User size={20} />
                  <span>Kirish</span>
                </Link>
                <Link to="/register" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-full font-medium transition-colors">
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-slate-600 hover:text-brand-600 p-2"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeMenu}></div>

          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <span className="font-bold text-xl text-slate-900">Menyu</span>
              <button onClick={closeMenu} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              <Link to="/" onClick={closeMenu} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium">Bosh sahifa</Link>
              <Link to="/catalog" onClick={closeMenu} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium">Katalog</Link>

              {isAuthenticated ? (
                <>
                  <div className="h-px bg-slate-100 my-4"></div>

                  <Link to="/profile" onClick={closeMenu} className="block px-4 py-3 text-brand-700 bg-brand-50 rounded-xl font-medium flex items-center gap-2">
                    <User size={20} /> Profil / Ijaralarim
                  </Link>

                  {isHost && (
                    <>
                      <Link to="/host/dashboard" onClick={closeMenu} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium flex items-center gap-2 mt-2">
                        <LayoutDashboard size={20} /> Host Dashboard
                      </Link>
                      <Link to="/add-car" onClick={closeMenu} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium flex items-center gap-2">
                        <Car size={20} /> Avto qo'shish
                      </Link>
                    </>
                  )}

                  <Link to="/messages" onClick={closeMenu} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium flex items-center gap-2 mt-2">
                    <MessageSquare size={20} /> Xabarlar
                  </Link>

                  {!isHost && (
                    <Link to="/profile?tab=host" onClick={closeMenu} className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium flex items-center gap-2">
                      <ArrowRightLeft size={20} /> Host bo'lish arizasi
                    </Link>
                  )}

                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium flex items-center gap-2 mt-2">
                    <LogOut size={20} /> Tizimdan chiqish
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px bg-slate-100 my-4"></div>
                  <Link to="/login" onClick={closeMenu} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium flex items-center gap-2">
                    <User size={20} /> Kirish
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="block px-4 py-3 mt-2 text-center bg-brand-600 text-white rounded-xl font-medium shadow-lg shadow-brand-500/30">
                    Ro'yxatdan o'tish
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
