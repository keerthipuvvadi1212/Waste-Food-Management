import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ClaimModal from '../components/food/ClaimModal';
import {
  Clock,
  MapPin,
  Users,
  UtensilsCrossed,
  ShieldCheck,
  Phone,
  Building,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/food/${id}`);
        setFood(res.data);
      } catch (error) {
        toast.error('Food listing not found');
        navigate('/food');
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!food) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link */}
      <Link
        to="/food"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Food Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Hero Image */}
          <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden glass-panel border border-slate-700/80">
            <img
              src={food.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'}
              alt={food.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-900/90 text-white backdrop-blur-md border border-white/10">
                {food.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-500/40">
                ● {food.dietary}
              </span>
            </div>

            {/* Status indicator on image */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
              <span className="px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Best Before: {new Date(food.expiryDate).toLocaleString()}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white font-semibold border border-white/10">
                {food.quantity} (~{food.servings} Servings)
              </span>
            </div>
          </div>

          {/* Description & Guidelines */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {food.title}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {food.description}
            </p>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 uppercase font-semibold text-[10px] block mb-1">
                  Storage &amp; Handling Instructions
                </span>
                <p className="font-medium">{food.storageInstructions}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 uppercase font-semibold text-[10px] block mb-1">
                  Pickup Window
                </span>
                <p className="font-medium">
                  {food.pickupWindow?.from} to {food.pickupWindow?.to}
                </p>
              </div>
            </div>

            {/* Food Safety Commitment */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-200">Zero Waste Hygiene Standard:</span>
                <p className="mt-0.5 text-emerald-300/90">
                  Donor certifies food was cooked in sanitized kitchen, stored in clean food-grade containers, and kept within recommended temperatures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Donor Info & Actions */}
        <div className="space-y-6">
          {/* Claim Action Box */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-emerald-500/30 glow-emerald">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Listing Status
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  food.status === 'available'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                ● {food.status}
              </span>
            </div>

            {food.status === 'available' ? (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error('Please log in or use Demo Switcher to claim!');
                    return;
                  }
                  setClaimModalOpen(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition transform active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                Claim This Food Listing
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-slate-800 text-center text-xs text-slate-400">
                Claimed by {food.claimedBy?.organization || food.claimedBy?.name || 'Partner NGO'}
              </div>
            )}
          </div>

          {/* Donor Information */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              Donor Information
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={food.donor?.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=256'}
                alt={food.donor?.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{food.donor?.organization || food.donor?.name}</h4>
                <span className="text-xs text-emerald-400 font-semibold uppercase">
                  Verified Food Donor
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{food.location?.address}, {food.location?.city} - {food.location?.pincode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{food.contactPhone || food.donor?.phone || '+91 98451 22334'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {claimModalOpen && (
        <ClaimModal
          food={food}
          onClose={() => setClaimModalOpen(false)}
          onSuccess={(res) => {
            setFood({ ...food, status: 'claimed', claimedBy: user });
          }}
        />
      )}
    </div>
  );
};

export default FoodDetails;
