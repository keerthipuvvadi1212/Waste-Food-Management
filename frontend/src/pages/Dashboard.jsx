import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Sparkles,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  PlusCircle,
  TrendingUp,
  HeartHandshake,
  Users,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const { user, loginAsDemo } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [myListings, setMyListings] = useState([]);
  const [myPickups, setMyPickups] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [listingsRes, pickupsRes, eventsRes, statsRes] = await Promise.all([
        api.get('/food/user/my-listings').catch(() => ({ data: [] })),
        api.get('/pickups').catch(() => ({ data: [] })),
        api.get('/hygiene/user/my-events').catch(() => ({ data: [] })),
        api.get('/stats').catch(() => ({ data: {} })),
      ]);

      setMyListings(listingsRes?.data || []);
      setMyPickups(pickupsRes?.data || []);
      setMyEvents(eventsRes?.data || []);
      setStats(statsRes?.data || {});
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleUpdatePickupStatus = async (pickupId, nextStatus) => {
    try {
      await api.put(`/pickups/${pickupId}/status`, { status: nextStatus });
      if (nextStatus === 'delivered') {
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
        toast.success('🎉 Food marked as successfully delivered to beneficiaries!');
      } else {
        toast.success(`Pickup status updated to ${nextStatus}`);
      }
      fetchDashboardData();
    } catch (error) {
      toast.error(error.message || 'Failed to update pickup status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'accepted':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'in_transit':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {user?.organization || 'Zero Waste Community Contributor'} • {user?.address?.city || 'Bengaluru'}
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2">
          {user?.role === 'donor' || user?.role === 'admin' ? (
            <Link
              to="/food/create"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Post Surplus Food
            </Link>
          ) : (
            <Link
              to="/food"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Claim Available Food
            </Link>
          )}

          <Link
            to="/hygiene/create"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            Host Hygiene Drive
          </Link>
        </div>
      </div>

      {/* Role Switcher Hint */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Test different platform roles quickly:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loginAsDemo('donor')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${user?.role === 'donor' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
          >
            🍱 Donor View
          </button>
          <button
            onClick={() => loginAsDemo('volunteer')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${user?.role === 'volunteer' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
          >
            🤝 Volunteer View
          </button>
          <button
            onClick={() => loginAsDemo('ngo')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${user?.role === 'ngo' ? 'bg-blue-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
          >
            🏢 NGO View
          </button>
          <button
            onClick={() => loginAsDemo('admin')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${user?.role === 'admin' ? 'bg-purple-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
          >
            ⚡ Admin View
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {user?.role === 'donor' ? 'Meals Donated' : 'Meals Rescued / Claimed'}
          </span>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-2">
            {user?.role === 'donor' ? user?.stats?.mealsDonated || 1420 : user?.stats?.foodClaimedKg ? Math.round(user.stats.foodClaimedKg * 2.5) : 450}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Hygiene Drives Joined
          </span>
          <div className="text-3xl font-black text-teal-400 font-mono mt-2">
            {user?.stats?.drivesParticipated || myEvents.length || 4}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Pickups
          </span>
          <div className="text-3xl font-black text-cyan-400 font-mono mt-2">
            {myPickups.filter((p) => p.status !== 'delivered').length}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            CO2 Saved (kg)
          </span>
          <div className="text-3xl font-black text-amber-400 font-mono mt-2">
            {Math.round((user?.stats?.mealsDonated || 600) * 1.2)} kg
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'overview'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🚚 Active Food Pickups &amp; Logistics ({myPickups.length})
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'listings'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🍱 My Food Donations ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'events'
              ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ✨ My Hygiene Drives ({myEvents.length})
        </button>
      </div>

      {/* Tab 1: Pickups Workflow */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Food Pickup Coordination</h3>
            <span className="text-xs text-slate-400">Track and advance transport stages</span>
          </div>

          {myPickups.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {myPickups.map((pickup) => (
                <div
                  key={pickup._id}
                  className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">
                          {pickup.foodListing?.title || 'Surplus Food Batch'}
                        </h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(pickup.status)}`}>
                          ● {pickup.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1">
                        <strong>Target:</strong> {pickup.deliveryTarget} • <strong>ETA:</strong> {pickup.scheduledPickupTime}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                        <span>Donor: {pickup.donor?.organization || pickup.donor?.name}</span>
                        <span>Claimed by: {pickup.claimedBy?.name}</span>
                        <span className="font-mono text-emerald-400">PIN: {pickup.verificationPin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Status Stepper Controls */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full md:w-auto">
                    {pickup.status === 'pending' && (
                      <button
                        onClick={() => handleUpdatePickupStatus(pickup._id, 'accepted')}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                      >
                        Accept Pickup Dispatch
                      </button>
                    )}

                    {pickup.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdatePickupStatus(pickup._id, 'in_transit')}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Mark "In Transit"
                      </button>
                    )}

                    {pickup.status === 'in_transit' && (
                      <button
                        onClick={() => handleUpdatePickupStatus(pickup._id, 'delivered')}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/40"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Delivered
                      </button>
                    )}

                    {pickup.status === 'delivered' && (
                      <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Completed &amp; Distributed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 rounded-2xl text-center">
              <Truck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No active pickup requests right now.</p>
              <Link
                to="/food"
                className="mt-3 inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Browse Surplus Food to Claim
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Your Posted Food Listings</h3>
            <Link
              to="/food/create"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              + Post New Item
            </Link>
          </div>

          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myListings.map((food) => (
                <div key={food._id} className="glass-panel p-5 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{food.title}</h4>
                      <p className="text-xs text-slate-400">{food.quantity} (~{food.servings} Servings)</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        food.status === 'available'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}
                    >
                      ● {food.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{food.description}</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Window: {food.pickupWindow?.from} - {food.pickupWindow?.to}
                    </span>
                    <Link
                      to={`/food/${food._id}`}
                      className="text-emerald-400 hover:text-emerald-300 font-bold"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 rounded-2xl text-center">
              <UtensilsCrossed className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">You haven't posted any food donations yet.</p>
              <Link
                to="/food/create"
                className="mt-3 inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Post Surplus Food
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Events */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Your Hygiene Drives</h3>
            <Link
              to="/hygiene/create"
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
            >
              + Host Drive
            </Link>
          </div>

          {myEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myEvents.map((event) => (
                <div key={event._id} className="glass-panel p-5 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{event.title}</h4>
                      <p className="text-xs text-teal-400 font-medium">{event.time}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-500/20 text-teal-400 border border-teal-500/40">
                      {event.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{event.description}</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{event.location?.address}</span>
                    <Link
                      to={`/hygiene/${event._id}`}
                      className="text-teal-400 hover:text-teal-300 font-bold"
                    >
                      View Drive →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 rounded-2xl text-center">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">You haven't joined any hygiene drives yet.</p>
              <Link
                to="/hygiene"
                className="mt-3 inline-block px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
              >
                Browse &amp; Join Drives
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
