import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/hygiene/${id}`);
      setEvent(res.data);
    } catch (error) {
      toast.error('Hygiene drive not found');
      navigate('/hygiene');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in or use Demo Switcher to join this drive!');
      return;
    }
    try {
      await api.post(`/hygiene/${id}/join`);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      toast.success('Successfully registered for this community drive!');
      fetchEvent();
    } catch (error) {
      toast.error(error.message || 'Failed to join');
    }
  };

  const handleLeave = async () => {
    try {
      await api.post(`/hygiene/${id}/leave`);
      toast.success('Registration cancelled.');
      fetchEvent();
    } catch (error) {
      toast.error(error.message || 'Failed to leave');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) return null;

  const isEnrolled = event.volunteers?.some(
    (v) => (v._id || v).toString() === user?._id?.toString()
  );
  const volunteerCount = event.volunteers?.length || 0;
  const maxCapacity = event.maxVolunteers || 30;
  const percentage = Math.min(Math.round((volunteerCount / maxCapacity) * 100), 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/hygiene"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Hygiene Drives
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden glass-panel border border-slate-700/80">
            <img
              src={event.images?.[0] || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=800'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-teal-500/20 text-teal-300 backdrop-blur-md border border-teal-500/40">
                {event.type}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
              <span className="px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-teal-300 font-bold border border-teal-500/30 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-400" />
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white font-semibold border border-white/10 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {event.time}
              </span>
            </div>
          </div>

          {/* Description & Equipment */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {event.title}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {event.description}
            </p>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Equipment &amp; Safety Gear Provided
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.equipmentProvided?.map((gear, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    {gear}
                  </span>
                ))}
              </div>
            </div>

            {/* Meeting point notice */}
            <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 flex items-start gap-3 text-xs text-teal-300">
              <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-teal-200">Meeting Point Instructions:</span>
                <p className="mt-0.5 text-teal-300/90">
                  {event.location?.meetingPoint || 'Assemble at main entrance gate'}. Please arrive 10 minutes before start time. Comfortable footwear recommended.
                </p>
              </div>
            </div>
          </div>

          {/* Volunteer Roster */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              Registered Community Volunteers ({volunteerCount})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.volunteers?.map((vol, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3"
                >
                  <img
                    src={vol.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                    alt={vol.name}
                    className="w-10 h-10 rounded-full object-cover border border-teal-500/30"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{vol.name}</div>
                    <div className="text-[10px] text-teal-400 font-semibold uppercase">
                      {vol.organization || vol.role || 'Volunteer'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: RSVP Box & Organizer */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-teal-500/30 glow-teal">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Drive Participation
            </h3>

            {/* Capacity Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Volunteers Needed:</span>
                <span className="font-bold text-teal-300">
                  {volunteerCount} / {maxCapacity} Spots
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            {isEnrolled ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-center font-bold text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  You're Enrolled as Volunteer
                </div>
                <button
                  onClick={handleLeave}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-semibold transition"
                >
                  Cancel Registration
                </button>
              </div>
            ) : (
              <button
                onClick={handleJoin}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40 transition transform active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                Join Community Drive
              </button>
            )}
          </div>

          {/* Organizer Info */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-400" />
              Drive Lead / Organizer
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={event.organizer?.avatar || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=256'}
                alt={event.organizer?.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
              />
              <div>
                <h4 className="text-sm font-bold text-white">
                  {event.organizer?.organization || event.organizer?.name}
                </h4>
                <span className="text-xs text-teal-400 font-semibold uppercase">
                  Community Organizer
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="text-slate-400">Location:</p>
              <p className="font-medium">{event.location?.address}, {event.location?.city}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
