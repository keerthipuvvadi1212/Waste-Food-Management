import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

const FoodCard = ({ food, onClaimClick }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(food.expiryDate) - new Date();
      if (difference <= 0) {
        setTimeLeft('Expired');
        setIsUrgent(false);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (hours < 4) {
        setIsUrgent(true);
      } else {
        setIsUrgent(false);
      }

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h left`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m left`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [food.expiryDate]);

  const dietaryColors = {
    veg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'non-veg': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    vegan: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    halal: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    all: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };

  const categoryLabels = {
    cooked: '🍲 Cooked Meal',
    bakery: '🍞 Bakery & Bread',
    fruits_veggies: '🥦 Farm Fresh / Veggies',
    packaged: '📦 Packaged Goods',
    raw: '🥩 Raw Ingredients',
    beverages: '🧃 Drinks & Beverages',
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-emerald-950/40 transition duration-300">
      {/* Food Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={food.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'}
          alt={food.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
            {categoryLabels[food.category] || food.category}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md ${dietaryColors[food.dietary] || dietaryColors.veg}`}>
            ● {food.dietary}
          </span>
        </div>

        {/* Expiry Countdown Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold backdrop-blur-md border ${
            isUrgent
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-slate-900/80 text-emerald-300 border-emerald-500/30'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            {timeLeft}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-200 border border-white/10 font-semibold">
            {food.quantity}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link to={`/food/${food._id}`}>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition line-clamp-1">
              {food.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Details snippet */}
        <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-400 truncate max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {food.location?.address || food.location?.city}
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Users className="w-3.5 h-3.5" />
              ~{food.servings} meals
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">Donor: {food.donor?.organization || food.donor?.name || 'Anonymous'}</span>
            <span className="font-mono text-slate-400">Window: {food.pickupWindow?.from} - {food.pickupWindow?.to}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {food.status === 'available' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onClaimClick?.(food)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/30 transition transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Claim Food Pickup
              </button>
              <Link
                to={`/food/${food._id}`}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="View Full Details"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Claimed by {food.claimedBy?.organization || food.claimedBy?.name || 'NGO Partner'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
