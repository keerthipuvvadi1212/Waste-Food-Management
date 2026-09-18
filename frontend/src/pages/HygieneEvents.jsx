import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import HygieneCard from '../components/hygiene/HygieneCard';
import HygieneFilter from '../components/hygiene/HygieneFilter';
import { useAuth } from '../context/AuthContext';
import { Sparkles, PlusCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const HygieneEvents = () => {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'upcoming',
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.type !== 'all') queryParams.append('type', filters.type);
      if (filters.status !== 'all') queryParams.append('status', filters.status);

      const res = await api.get(`/hygiene?${queryParams.toString()}`);
      setEvents(res?.data || []);
    } catch (error) {
      toast.error('Failed to load hygiene events');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      status: 'upcoming',
    });
  };

  const handleJoinEvent = async (event) => {
    if (!isAuthenticated) {
      toast.error('Please log in or use Demo Switcher to join events!');
      return;
    }
    try {
      await api.post(`/hygiene/${event._id}/join`);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      toast.success(`You joined ${event.title}!`);
      fetchEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to join event');
    }
  };

  const handleLeaveEvent = async (event) => {
    try {
      await api.post(`/hygiene/${event._id}/leave`);
      toast.success('Registration cancelled.');
      fetchEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to leave event');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Community Cleanliness &amp; Hygiene
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Community Hygiene &amp; Sanitation Drives
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Join lake cleanups, waste segregation campaigns, and neighborhood hygiene drives
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchEvents}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Refresh Drives"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/hygiene/create"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-900/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Host Hygiene Drive
          </Link>
        </div>
      </div>

      {/* Filters */}
      <HygieneFilter
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />

      {/* Grid of Events */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="glass-card rounded-2xl h-80 animate-pulse bg-slate-800/40 p-4 flex flex-col justify-between"
            >
              <div className="h-40 bg-slate-700/30 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-700/40 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700/30 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-slate-700/40 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isEnrolled = event.volunteers?.some(
              (v) => (v._id || v).toString() === user?._id?.toString()
            );
            return (
              <HygieneCard
                key={event._id}
                event={event}
                isUserEnrolled={isEnrolled}
                onJoinClick={handleJoinEvent}
                onLeaveClick={handleLeaveEvent}
              />
            );
          })}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No drives found</h3>
          <p className="text-xs text-slate-400">
            No hygiene drives match your selected filters. Try changing filter parameters or organize a new drive!
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default HygieneEvents;
