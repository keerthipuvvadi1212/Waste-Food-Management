import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  PlusCircle,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const PostFood = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'cooked',
    quantity: '',
    servings: 20,
    dietary: 'veg',
    expiryHours: '6',
    storageInstructions: 'Keep warm in insulated bags / Refrigerate before serving',
    address: user?.address?.street || 'Indiranagar 100 Feet Rd',
    city: user?.address?.city || 'Bengaluru',
    pincode: user?.address?.pincode || '560038',
    contactPhone: user?.phone || '+91 98451 22334',
    pickupFrom: '02:00 PM',
    pickupTo: '07:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
  });

  const [submitting, setSubmitting] = useState(false);

  const sampleImagePresets = [
    { label: '🍲 Cooked Buffet / Meals', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' },
    { label: '🍚 Biryani / Rice Dishes', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800' },
    { label: '🍞 Bakery & Sourdough', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
    { label: '🥦 Fresh Farm Produce', url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=800' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const expiryDate = new Date(Date.now() + Number(formData.expiryHours) * 3600 * 1000);

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        quantity: formData.quantity,
        servings: Number(formData.servings),
        dietary: formData.dietary,
        expiryDate,
        storageInstructions: formData.storageInstructions,
        location: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        contactPhone: formData.contactPhone,
        pickupWindow: {
          from: formData.pickupFrom,
          to: formData.pickupTo,
        },
        images: [formData.imageUrl],
      };

      const res = await api.post('/food', payload);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success('Surplus food posted successfully!');
      navigate(`/food/${res.data._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to post food donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <UtensilsCrossed className="w-3.5 h-3.5" /> Food Donor Portal
        </span>
        <h1 className="text-3xl font-extrabold text-white">
          Post Surplus Food for Redistribution
        </h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Help feed families and prevent methane emissions. Verified NGOs &amp; volunteers will pick it up directly from your location.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-700/80">
        {/* Basic info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            1. Food Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Food Title / Description Summary *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 40 Packed Paneer Butter Masala Meals with Naan"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="cooked">🍲 Cooked Meals</option>
                <option value="bakery">🍞 Bakery &amp; Bread</option>
                <option value="fruits_veggies">🥦 Fresh Produce</option>
                <option value="packaged">📦 Packaged Foods</option>
                <option value="raw">🥩 Raw Ingredients</option>
                <option value="beverages">🧃 Beverages</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Dietary Type *
              </label>
              <select
                value={formData.dietary}
                onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="veg">Vegetarian</option>
                <option value="vegan">Vegan (100% Plant)</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="halal">Halal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Estimated Servings *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Total Quantity Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 15 kg in 3 thermal trays"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Safe Consumption Window *
              </label>
              <select
                value={formData.expiryHours}
                onChange={(e) => setFormData({ ...formData, expiryHours: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="3">Next 3 Hours (Immediate)</option>
                <option value="6">Next 6 Hours</option>
                <option value="12">Next 12 Hours</option>
                <option value="24">Within 24 Hours</option>
                <option value="48">Within 48 Hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description &amp; Preparation Details *
            </label>
            <textarea
              required
              rows="3"
              placeholder="Describe dishes, ingredients, when it was cooked, allergen notices..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>
        </div>

        {/* Location & Pickup */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            2. Pickup Coordinates &amp; Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Pickup Address / Landmark *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Contact Phone *
              </label>
              <input
                type="text"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Pickup Window From
              </label>
              <input
                type="text"
                value={formData.pickupFrom}
                onChange={(e) => setFormData({ ...formData, pickupFrom: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Pickup Window To
              </label>
              <input
                type="text"
                value={formData.pickupTo}
                onChange={(e) => setFormData({ ...formData, pickupTo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Photo Selection Presets */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <ImageIcon className="w-4 h-4 text-emerald-400" /> Photo Selection
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sampleImagePresets.map((preset, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition ${
                  formData.imageUrl === preset.url
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <img src={preset.url} alt={preset.label} className="w-full h-16 rounded-lg object-cover" />
                <span className="text-[11px] font-semibold text-slate-300 text-center line-clamp-1">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/40 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            {submitting ? 'Publishing Food Listing...' : 'Publish Surplus Food Donation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostFood;
