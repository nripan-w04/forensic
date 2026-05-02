import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, LogOut, Menu } from 'lucide-react';
import { useUI } from './UIContext';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showConfirm, showToast, toggleMobileMenu } = useUI();
  const { user, logout, dashboardPath } = useAuth();

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: 'Deactivate Session',
      message: 'Are you sure you want to terminate the current secure session? All unsaved data will be lost.',
      confirmText: 'Terminate',
      cancelText: 'Stay Active'
    });

    if (confirmed) {
      logout();
      showToast('Secure session terminated', 'info');
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full glass-morphism py-4 px-4 md:px-8 flex justify-between items-center border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md" style={{ zIndex: 10000 }}>
      <div className="flex items-center gap-2 md:gap-4">
        {user && (
          <button
            onClick={toggleMobileMenu}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-zinc-400 bg-white/5 hover:text-white"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 md:w-10 md:h-10 crimson-gradient rounded-lg flex items-center justify-center crimson-glow bg-gradient-to-br from-red-600 to-red-900 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <Shield className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-white font-['Barlow_Condensed'] uppercase m-0 leading-none">FORENSIC<span className="text-red-500">CASE</span></h1>
            <p className="hidden md:block text-[14px] text-white uppercase tracking-widest font-['Share_Tech_Mono'] m-0 mt-1 font-bold">Investigation Hub</p>
          </div>
        </div>
      </div>



      <div className="flex items-center gap-3 md:gap-6">
        {user ? (
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex flex-col items-end mr-3">
              <span className="text-base font-extrabold text-white font-['Barlow'] tracking-wide">{user.name}</span>
              <span className="text-[13px] text-red-500 uppercase tracking-widest font-['Share_Tech_Mono'] font-bold">{user.role}</span>
            </div>

            {dashboardPath && (
              <Link
                to={dashboardPath}
                title="Go to Dashboard"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all cursor-pointer no-underline"
              >
                <User size={16} />
              </Link>
            )}

            <div className="hidden md:block w-[1px] h-6 bg-white/10 mx-1"></div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:text-white hover:border-red-500 hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 md:gap-6">
            {location.pathname !== '/login' && (
              <Link to="/login" className="text-xs md:text-sm md:pr-4 font-bold text-white hover:text-red-500 transition-all uppercase tracking-[0.2em] no-underline font-['Barlow']">
                Sign In
              </Link>
            )}
            {location.pathname !== '/register' && (
              <Link to="/register" className="relative group no-underline">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-900 rounded-sm blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative px-4 py-2 md:px-8 md:py-3 bg-black border border-red-600/50 rounded-sm flex items-center gap-2 md:gap-3">
                  <span className="text-white text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] font-['Barlow']">Join Unit</span>
                  <span className="hidden md:block w-[1px] h-5 bg-red-600/50"></span>
                  <span className="text-red-500 group-hover:text-white transition duration-200">
                    <Shield size={16} />
                  </span>
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
