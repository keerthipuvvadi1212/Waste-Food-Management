import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

const HygieneCard = ({ event, onJoinClick, onLeaveClick, isUserEnrolled }) => {
  const volunteerCount = event.volunteers?.length || 0;
  const maxCapacity = event.maxVolunteers || 30;
  const percentage = Math.min(Math.round((volunteerCount / maxCapacity) * 100), 100);
  const isFull = volunteerCount >= maxCapacity;

  const typeConfig = {
    cleanup: { label: '🧹 Lake & Neighborhood Cleanup', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
    sanitation: { label: '🧼 Community Sanitization Drive', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    waste_segregation: { label: '♻️ Waste Segregation Workshop', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    awareness: { label: '📢 Hygiene Awareness Rally', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    tree_plantation: { label: '🌱 Eco-Plantation Drive', color: 'bg-lime-500/10 text-lime-400 border-lime-500/30' },
  };

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : 'Upcoming';

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-teal-950/40 transition duration-300">
      {/* Event Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={event.images?.[0] || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=800'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border ${typeConfig[event.type]?.color || typeConfig.cleanup.color}`}>
            {typeConfig[event.type]?.label || event.type}
          </span>
        </div>

        {/* Date & Time pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-teal-300 border border-teal-500/30 font-bold">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 border border-white/10 font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {event.time}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link to={`/hygiene/${event._id}`}>
            <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition line-clamp-1">
              {event.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Location & Meeting point */}
        <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-1 text-slate-400 truncate">
            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="truncate">{event.location?.address}</span>
          </div>

          {/* Volunteer Capacity Meter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                Volunteers Registered
              </span>
              <span className="font-bold text-teal-300">
                {volunteerCount} / {maxCapacity} ({percentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Equipment Badges */}
        <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
          <span className="text-slate-500 font-semibold uppercase">Gear Provided:</span>
          {event.equipmentProvided?.slice(0, 3).map((item, idx) => (
            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/60">
              ✓ {item}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isUserEnrolled ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 py-2 px-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                You're Registered!
              </div>
              <button
                onClick={() => onLeaveClick?.(event)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-semibold transition"
                title="Cancel registration"
              >
                Leave
              </button>
            </div>
          ) : isFull ? (
            <div className="w-full py-2 px-4 rounded-xl bg-slate-800/80 text-center text-xs font-semibold text-slate-400">
              Capacity Full ({volunteerCount}/{maxCapacity})
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onJoinClick?.(event)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-900/30 transition transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                RSVP &amp; Join Drive
              </button>
              <Link
                to={`/hygiene/${event._id}`}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="View Full Details"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HygieneCard;
