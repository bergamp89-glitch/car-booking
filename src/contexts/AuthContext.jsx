import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check local storage for user on mount
    const storedUser = localStorage.getItem('carbooking_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const storedAdmin = localStorage.getItem('carbooking_admin');
    if (storedAdmin === 'true') {
      setIsAdminAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const newUser = { ...userData, documentsVerified: false };
    setUser(newUser);
    localStorage.setItem('carbooking_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carbooking_user');
    setIsAdminAuthenticated(false);
    localStorage.removeItem('carbooking_admin');
  };

  const requestHostRole = () => {
    if (!user) return;
    const updatedUser = { ...user, hostStatus: 'PENDING' };
    setUser(updatedUser);
    localStorage.setItem('carbooking_user', JSON.stringify(updatedUser));

    // Mock Admin Approval after 3 seconds
    setTimeout(() => {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.success('Tabriklaymiz! Admin arizangizni tasdiqladi. Siz endi HOSTsiz!', { icon: '🎉', duration: 5000 });
      });
      const approvedUser = { ...updatedUser, hostStatus: 'APPROVED', role: 'HOST' };
      setUser(approvedUser);
      localStorage.setItem('carbooking_user', JSON.stringify(approvedUser));
    }, 3000);
  };

  const approveHostRole = () => {
    if (!user) return;
    const updatedUser = { ...user, hostStatus: 'APPROVED', role: 'HOST' };
    setUser(updatedUser);
    localStorage.setItem('carbooking_user', JSON.stringify(updatedUser));
  };

  const verifyDocuments = () => {
    if (!user) return;
    const updatedUser = { ...user, documentsVerified: true };
    setUser(updatedUser);
    localStorage.setItem('carbooking_user', JSON.stringify(updatedUser));
  };

  const updateUser = (data) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('carbooking_user', JSON.stringify(updatedUser));
  };

  const adminLogin = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('carbooking_admin', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('carbooking_admin');
  };

  const value = {
    user,
    login,
    logout,
    requestHostRole,
    approveHostRole,
    verifyDocuments,
    updateUser,
    adminLogin,
    adminLogout,
    isAuthenticated: !!user,
    isAdminAuthenticated,
    isHost: user?.role === 'HOST' || user?.role === 'ADMIN',
    hostStatus: user?.hostStatus || null,
    isDocumentsVerified: user?.documentsVerified || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
