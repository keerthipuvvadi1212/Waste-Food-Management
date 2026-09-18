import React, { useState } from 'react';
import { Leaf, Flame, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ImpactCalculator = () => {
  const [foodKg, setFoodKg] = useState(25);

  const meals = Math.round(foodKg * 2.5);
  const co2SavedKg = (foodKg * 2.5).toFixed(1);
  const waterSavedLiters = Math.round(foodKg * 85);
  const moneySavedInr = Math.round(foodKg * 140);

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 glow-emerald relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Environmental &amp; Social Impact Simulator
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            See the Power of <span className="text-gradient">Redistributing Surplus Food</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
            Every kilogram of untouched food kept out of landfills prevents methane emissions and directly nourishes families.
          </p>
        </div>

        {/* Interactive Slider */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">
              Surplus Food Amount (kg):
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {foodKg} kg
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="500"
            step="5"
            value={foodKg}
            onChange={(e) => setFoodKg(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
          />

          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>5 kg (Small Cafe)</span>
            <span>100 kg (Banquet)</span>
            <span>500 kg (Large Expo / Wedding)</span>
          </div>
        </div>

        {/* Results 4-card Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {meals.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Nutritious Meals
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">
                {co2SavedKg} kg
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                CO2 Emissions Averted
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                {waterSavedLiters.toLocaleString()} L
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Virtual Water Preserved
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                ₹{moneySavedInr.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Community Food Value
              </div>
            </div>
          </div>
        </div>

        {/* CTA banner inside simulator */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            Have surplus food today from a party, restaurant, or household?
          </p>
          <Link
            to="/food/create"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition shrink-0"
          >
            Donate Your Surplus Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ImpactCalculator;
