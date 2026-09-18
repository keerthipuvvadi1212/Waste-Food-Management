import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, PlusCircle, Calendar, Clock, MapPin, Users, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'cleanup',
    date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
    time: '07:30 AM - 10:30 AM',
    address: 'Hebbal Lake Perimeter Walkway',
    city: 'Bengaluru',
    meetingPoint: 'Main Lake Entry Arch & Parking',
    maxVolunteers: 35,
    equipmentProvided: 'Heavy Duty Gloves, Compostable Sacks, Metal Pickers, Hand Sanitizer, Water Station',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=800',
  });

  const [submitting, setSubmitting] = useState(false);

  const sampleImagePresets = [
    { label: '🧹 Lake & Park Cleanup', url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=800' },
    { label: '♻️ Waste Segregation', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800' },
    { label: '🧼 Public Sanitization', url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&q=80&w=800' },
    { label: '🌱 Community Planting', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const gearArray = formData.equipmentProvided
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: new Date(formData.date),
        time: formData.time,
        location: {
          address: formData.address,
          city: formData.city,
          meetingPoint: formData.meetingPoint,
        },
        maxVolunteers: Number(formData.maxVolunteers),
        equipmentProvided: gearArray,
        images: [formData.imageUrl],
      };

      const res = await api.post('/hygiene', payload);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success('Community hygiene drive published!');
      navigate(`/hygiene/${res.data._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create hygiene drive');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/15 text-teal-400 border border-teal-500/30">
          <Sparkles className="w-3.5 h-3.5" /> Community Organizer Hub
        </span>
        <h1 className="text-3xl font-extrabold text-white">
          Host a Community Hygiene &amp; Cleanliness Drive
        </h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Gather neighbors, volunteers, and students to clean public spaces, segregate waste, and promote public sanitation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-700/80">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">
            1. Drive Overview
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Drive Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bellandur Lake Perimeter Single-Use Plastic Cleanup Drive"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Drive Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
              >
                <option value="cleanup">🧹 Lake / Park Cleanup</option>
                <option value="waste_segregation">♻️ Waste Segregation</option>
                <option value="sanitation">🧼 Community Sanitization</option>
                <option value="awareness">📢 Hygiene Awareness Rally</option>
                <option value="tree_plantation">🌱 Eco Tree Plantation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Volunteer Capacity *
              </label>
              <input
                type="number"
                min="5"
                max="200"
                required
                value={formData.maxVolunteers}
                onChange={(e) => setFormData({ ...formData, maxVolunteers: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Timing *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 07:00 AM - 10:30 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Equipment Provided (Comma separated)
              </label>
              <input
                type="text"
                value={formData.equipmentProvided}
                onChange={(e) => setFormData({ ...formData, equipmentProvided: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Detailed Drive Description *
            </label>
            <textarea
              required
              rows="3"
              placeholder="Explain the goal, area to be covered, what volunteers should bring (water bottle, shoes)..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
            ></textarea>
          </div>
        </div>

        {/* Location & Assembly */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">
            2. Meeting Point &amp; Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Drive Area / Park / Lake Landmark *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
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
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Precise Assembly / Meeting Spot *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Near Gazebo at Gate 2, look for Green Corps Banner"
              value={formData.meetingPoint}
              onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Photo selection presets */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Cover Photo Selection
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sampleImagePresets.map((preset, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition ${
                  formData.imageUrl === preset.url
                    ? 'border-teal-500 bg-teal-500/10'
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

        {/* Submit */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-teal-950/40 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            {submitting ? 'Creating Drive...' : 'Publish Community Hygiene Drive'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
