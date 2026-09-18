import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import FoodCard from '../components/food/FoodCard';
import FoodFilter from '../components/food/FoodFilter';
import ClaimModal from '../components/food/ClaimModal';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FoodListings = () => {
  const { user, isAuthenticated } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFoodForClaim, setSelectedFoodForClaim] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'available',
    dietary: 'all',
  });

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.dietary !== 'all') queryParams.append('dietary', filters.dietary);

      const res = await api.get(`/food?${queryParams.toString()}`);
      setFoods(res?.data || []);
    } catch (error) {
      toast.error('Failed to load food listings');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'available',
      dietary: 'all',
    });
  };

  const handleClaimClick = (food) => {
    if (!isAuthenticated) {
      toast.error('Please log in or use Demo Switcher to claim food donations!');
      return;
    }
    setSelectedFoodForClaim(food);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Surplus Food Redistribution
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Available Surplus Food Feeds
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time surplus posts from verified restaurants, caterers, and food banks
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchFoods}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {(user?.role === 'donor' || user?.role === 'admin' || !isAuthenticated) && (
            <Link
              to="/food/create"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Post Surplus Food
            </Link>
          )}
        </div>
      </div>

      {/* Filter Component */}
      <FoodFilter
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />

      {/* Grid of Food Listings */}
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
      ) : foods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              onClaimClick={handleClaimClick}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No food listings found</h3>
          <p className="text-xs text-slate-400">
            No surplus food matches your current search/filter combination. Try adjusting or clearing your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Claim Modal */}
      {selectedFoodForClaim && (
        <ClaimModal
          food={selectedFoodForClaim}
          onClose={() => setSelectedFoodForClaim(null)}
          onSuccess={() => {
            fetchFoods();
          }}
        />
      )}
    </div>
  );
};

export default FoodListings;
