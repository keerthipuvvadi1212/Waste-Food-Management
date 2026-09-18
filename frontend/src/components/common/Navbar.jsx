import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  UtensilsCrossed,
  Sparkles,
  LayoutDashboard,
  HeartHandshake,
  PlusCircle,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleDemoSwitch = async (role) => {
    setDemoDropdownOpen(false);
    setMobileMenuOpen(false);
    await loginAsDemo(role);
    navigate('/dashboard');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition duration-200">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                ZeroWaste <span className="text-emerald-400 font-extrabold">&amp;</span> Clean
              </span>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400 -mt-1">
                Food &amp; Hygiene Network
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/food"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition duration-150 flex items-center gap-2 ${
                isActive('/food')
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              Surplus Food
            </Link>

            <Link
              to="/hygiene"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition duration-150 flex items-center gap-2 ${
                isActive('/hygiene')
                  ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Hygiene Drives
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition duration-150 flex items-center gap-2 ${
                  isActive('/dashboard')
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Login Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
                title="Switch between test personas"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Demo Switcher</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('donor')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:bg-emerald-500/15 hover:text-emerald-300 flex items-center justify-between"
                  >
                    <span>🍱 Donor (Restaurant)</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('volunteer')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:bg-teal-500/15 hover:text-teal-300 flex items-center justify-between"
                  >
                    <span>🤝 Volunteer</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('ngo')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:bg-blue-500/15 hover:text-blue-300 flex items-center justify-between"
                  >
                    <span>🏢 NGO (Shelter)</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:bg-purple-500/15 hover:text-purple-300 flex items-center justify-between"
                  >
                    <span>⚡ Platform Admin</span>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Donate / Host CTA */}
                {user?.role === 'donor' || user?.role === 'admin' ? (
                  <Link
                    to="/food/create"
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition transform hover:-translate-y-0.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Food
                  </Link>
                ) : (
                  <Link
                    to="/hygiene/create"
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-teal-900/30 transition transform hover:-translate-y-0.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Host Drive
                  </Link>
                )}

                {/* Profile Pill & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800/80 transition"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
                    />
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-semibold text-white leading-none truncate max-w-[100px]">
                        {user?.name?.split(' ')[0]}
                      </div>
                      <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                        {user?.role}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={logout}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold text-xs transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md shadow-emerald-900/30"
                >
                  Join Movement
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            <button
              onClick={() => handleDemoSwitch('donor')}
              className="px-2 py-2 rounded bg-slate-800 text-xs font-semibold text-emerald-300"
            >
              🍱 Demo Donor
            </button>
            <button
              onClick={() => handleDemoSwitch('volunteer')}
              className="px-2 py-2 rounded bg-slate-800 text-xs font-semibold text-teal-300"
            >
              🤝 Demo Volunteer
            </button>
            <button
              onClick={() => handleDemoSwitch('ngo')}
              className="px-2 py-2 rounded bg-slate-800 text-xs font-semibold text-blue-300"
            >
              🏢 Demo NGO
            </button>
            <button
              onClick={() => handleDemoSwitch('admin')}
              className="px-2 py-2 rounded bg-slate-800 text-xs font-semibold text-purple-300"
            >
              ⚡ Demo Admin
            </button>
          </div>

          <Link
            to="/food"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            🍱 Surplus Food Listings
          </Link>
          <Link
            to="/hygiene"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            ✨ Community Hygiene Drives
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              📊 Role Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-semibold text-white">{user?.name}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-400 font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-lg bg-slate-800 text-white font-semibold text-sm"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-lg bg-emerald-600 text-white font-semibold text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
