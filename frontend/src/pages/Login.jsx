import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, UtensilsCrossed, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemo = async (role) => {
    setSubmitting(true);
    const result = await loginAsDemo(role);
    setSubmitting(false);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
          <UtensilsCrossed className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-black text-white">Welcome Back</h1>
        <p className="text-xs text-slate-400">
          Sign in to coordinate food redistribution &amp; community hygiene
        </p>
      </div>

      {/* 1-Click Demo Login Box */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 glow-emerald space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 1-Click Quick Demo Login
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Instant Access</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemo('donor')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-xs font-bold text-slate-200 hover:text-emerald-300 border border-slate-700/80 transition text-left"
          >
            🍱 Demo Donor
            <span className="block text-[10px] text-slate-500 font-normal">Restaurant / Banquet</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemo('volunteer')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-teal-500/20 text-xs font-bold text-slate-200 hover:text-teal-300 border border-slate-700/80 transition text-left"
          >
            🤝 Demo Volunteer
            <span className="block text-[10px] text-slate-500 font-normal">Pickups &amp; Drives</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemo('ngo')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-500/20 text-xs font-bold text-slate-200 hover:text-blue-300 border border-slate-700/80 transition text-left"
          >
            🏢 Demo NGO
            <span className="block text-[10px] text-slate-500 font-normal">Shelter &amp; Feeding</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemo('admin')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-purple-500/20 text-xs font-bold text-slate-200 hover:text-purple-300 border border-slate-700/80 transition text-left"
          >
            ⚡ Demo Admin
            <span className="block text-[10px] text-slate-500 font-normal">Platform Lead</span>
          </button>
        </div>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-800"></div>
        <span className="flex-shrink mx-4 text-xs font-bold uppercase text-slate-500">
          Or Log In with Email
        </span>
        <div className="flex-grow border-t border-slate-800"></div>
      </div>

      {/* Manual Email Login Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
          </label>
          <input
            type="email"
            required
            placeholder="e.g. donor@zerowaste.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-slate-400" /> Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          <LogIn className="w-4 h-4" />
          {submitting ? 'Authenticating...' : 'Sign In'}
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-emerald-400 hover:underline font-bold">
            Create an Account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
