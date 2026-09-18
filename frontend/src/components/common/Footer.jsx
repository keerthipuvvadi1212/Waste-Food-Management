import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Sparkles, Heart, ShieldCheck, Globe, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
                <UtensilsCrossed className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                ZeroWaste <span className="text-emerald-400">&amp;</span> Clean
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Bridging the gap between food abundance and food insecurity while fostering community-led hygiene, lake cleanups, and waste segregation drives.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Leaf className="w-3.5 h-3.5" /> SDG #2: Zero Hunger
              </span>
              <span className="flex items-center gap-1 text-teal-400">
                <Sparkles className="w-3.5 h-3.5" /> SDG #6: Clean Water &amp; Sanitation
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/food" className="hover:text-emerald-400 transition">
                  Browse Surplus Food
                </Link>
              </li>
              <li>
                <Link to="/food/create" className="hover:text-emerald-400 transition">
                  Donate Food (Restaurants/Events)
                </Link>
              </li>
              <li>
                <Link to="/hygiene" className="hover:text-teal-400 transition">
                  Join Hygiene Drives
                </Link>
              </li>
              <li>
                <Link to="/hygiene/create" className="hover:text-teal-400 transition">
                  Organize Community Cleanliness
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Community &amp; Safety
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                FSSAI Food Hygiene Best Practices
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-teal-400" />
                Zero Landfill Waste Segregation
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                NGO Partner Verification
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Zero Waste &amp; Community Hygiene Initiative. Open Source &amp; Community Driven.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for a healthier, cleaner planet
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
