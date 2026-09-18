import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Truck, MapPin, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ClaimModal = ({ food, onClose, onSuccess }) => {
  const [scheduledPickupTime, setScheduledPickupTime] = useState('Within 2 hours');
  const [deliveryTarget, setDeliveryTarget] = useState('Local Community Shelter & Slum Outreach');
  const [transportType, setTransportType] = useState('van');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!food) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post(`/food/${food._id}/claim`, {
        scheduledPickupTime,
        deliveryTarget,
        transportType,
        notes,
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#14b8a6', '#3b82f6', '#f59e0b'],
      });

      toast.success('Food claimed successfully! Pickup dispatched.');
      onSuccess?.(res.data);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to claim food listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Claim Surplus Food</h3>
              <p className="text-xs text-slate-400">Coordinate pickup &amp; redistribution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Food summary box */}
        <div className="p-5 bg-slate-950/50 border-b border-slate-800 flex items-center gap-3">
          <img
            src={food.images?.[0]}
            alt={food.title}
            className="w-16 h-16 rounded-xl object-cover border border-slate-700"
          />
          <div>
            <h4 className="text-sm font-bold text-white line-clamp-1">{food.title}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>{food.quantity}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">~{food.servings} Meals</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-500" />
              {food.location?.address}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> Estimated Pickup ETA
            </label>
            <select
              value={scheduledPickupTime}
              onChange={(e) => setScheduledPickupTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="Within 1 hour">Immediate (Within 1 hour)</option>
              <option value="Within 2 hours">Within 2 hours</option>
              <option value="Within 4 hours">Within 4 hours</option>
              <option value="This Evening">This Evening (Before 08:00 PM)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-teal-400" /> Transport Vehicle
            </label>
            <select
              value={transportType}
              onChange={(e) => setTransportType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
            >
              <option value="van">🚐 NGO Delivery Van / Utility Vehicle</option>
              <option value="auto">🛺 Auto / Cargo 3-Wheeler</option>
              <option value="two_wheeler">🛵 Two-Wheeler with Delivery Box</option>
              <option value="walking">🚶 Walking / Nearby Outreach Team</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Distribution Destination / Beneficiaries
            </label>
            <input
              type="text"
              required
              value={deliveryTarget}
              onChange={(e) => setDeliveryTarget(e.target.value)}
              placeholder="e.g. Shanti Nagar Orphanage, Night Shelter, Slum Feeding Drive"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Volunteer Notes for Donor (Optional)
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions, contact of driver, packaging boxes..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          {/* Safety Notice */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <p>
              Food Safety Reminder: Verify quality and temperature upon pickup. Ensure distribution before food safety window expires.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? 'Confirming...' : 'Confirm Pickup Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimModal;
