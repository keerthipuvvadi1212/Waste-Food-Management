import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import FoodCard from '../components/food/FoodCard';
import HygieneCard from '../components/hygiene/HygieneCard';
import ClaimModal from '../components/food/ClaimModal';
import ImpactCalculator from '../components/common/ImpactCalculator';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Users,
  Leaf,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [featuredFood, setFeaturedFood] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [selectedFoodForClaim, setSelectedFoodForClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, foodRes, eventsRes] = await Promise.all([
        api.get('/stats').catch(() => ({ data: {} })),
        api.get('/food?limit=3&status=available').catch(() => ({ data: [] })),
        api.get('/hygiene?limit=3&status=upcoming').catch(() => ({ data: [] })),
      ]);

      setStats(statsRes?.data || {});
      setFeaturedFood(foodRes?.data || []);
      setUpcomingEvents(eventsRes?.data || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJoinEvent = async (event) => {
    if (!isAuthenticated) {
      toast.error('Please log in or use Demo Switcher to join events!');
      return;
    }
    try {
      await api.post(`/hygiene/${event._id}/join`);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      toast.success(`Registered for ${event.title}!`);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to join event');
    }
  };

  const handleLeaveEvent = async (event) => {
    try {
      await api.post(`/hygiene/${event._id}/leave`);
      toast.success('Registration cancelled.');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to leave event');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        {/* Glow backdrop circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Zero Food Waste • Cleaner Communities • Verified Logistics
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Rescue Surplus Food.{' '}
            <span className="text-gradient">Restore Community Hygiene.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A unified platform connecting restaurants, caterers, and households with verified NGOs to eliminate surplus food waste, while empowering citizen volunteers in neighborhood sanitation and lake cleanup drives.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/food"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition transform hover:-translate-y-0.5"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Explore Surplus Food Feeds
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/hygiene"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-teal-300 font-extrabold text-sm flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              Join Hygiene Drives
            </Link>
          </div>
        </div>

        {/* Live Impact Counters Bar */}
        <div className="max-w-6xl mx-auto mt-12 px-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">
                {stats?.mealsRedistributed ? stats.mealsRedistributed.toLocaleString() : '4,280'}+
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Meals Redistributed
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-teal-400 font-mono">
                {stats?.foodRescuedKg ? stats.foodRescuedKg.toLocaleString() : '1,850'} kg
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Surplus Food Rescued
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-cyan-400 font-mono">
                {stats?.co2AvertedKg ? stats.co2AvertedKg.toLocaleString() : '4,625'} kg
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                CO2 Emissions Prevented
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-amber-400 font-mono">
                {stats?.hygieneDrivesHeld || 38}+
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Hygiene Drives Conducted
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* "How It Works" 3-Pillar Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            How The Platform Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Effortless Coordination for Real Impact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Donors */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden border-t-2 border-t-emerald-500">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Donors List Surplus</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restaurants, caterers, and households post surplus food in under 60 seconds with food type, servings, expiry countdown, and pickup coordinates.
            </p>
          </div>

          {/* Card 2: NGOs & Volunteers */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden border-t-2 border-t-teal-500">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">NGOs Claim &amp; Transport</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Shelters and volunteer drivers instantly claim food batches, track pickup windows, and deliver directly to underprivileged communities and night shelters.
            </p>
          </div>

          {/* Card 3: Hygiene Drives */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden border-t-2 border-t-cyan-500">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Community Hygiene Drives</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organize and RSVP for neighborhood cleanups, lake plastic segregation, sanitation campaigns, and waste segregation awareness rallies.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Urgent Surplus Food */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Live Surplus Feeds
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Urgent Food Available for Pickup
            </h2>
          </div>
          <Link
            to="/food"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
          >
            View All Food Listings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredFood.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFood.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                onClaimClick={(item) => setSelectedFoodForClaim(item)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 rounded-2xl text-center">
            <UtensilsCrossed className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No surplus food currently awaiting pickup.</p>
            <Link
              to="/food/create"
              className="mt-3 inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Post First Food Donation
            </Link>
          </div>
        )}
      </section>

      {/* Upcoming Community Hygiene Drives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Community Action
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Upcoming Cleanliness &amp; Sanitation Drives
            </h2>
          </div>
          <Link
            to="/hygiene"
            className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition"
          >
            Explore All Drives <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => {
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
          <div className="glass-card p-12 rounded-2xl text-center">
            <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No upcoming events scheduled at this moment.</p>
            <Link
              to="/hygiene/create"
              className="mt-3 inline-block px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
            >
              Organize a Drive
            </Link>
          </div>
        )}
      </section>

      {/* Environmental Impact Simulator Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ImpactCalculator />
      </section>

      {/* Claim Modal */}
      {selectedFoodForClaim && (
        <ClaimModal
          food={selectedFoodForClaim}
          onClose={() => setSelectedFoodForClaim(null)}
          onSuccess={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default Home;
