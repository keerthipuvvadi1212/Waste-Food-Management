import React from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

const FoodFilter = ({ filters, setFilters, onReset }) => {
  const categories = [
    { id: 'all', label: 'All Foods' },
    { id: 'cooked', label: '🍲 Cooked Meals' },
    { id: 'bakery', label: '🍞 Bakery' },
    { id: 'fruits_veggies', label: '🥦 Produce' },
    { id: 'packaged', label: '📦 Packaged' },
    { id: 'beverages', label: '🧃 Beverages' },
  ];

  const dietaryOptions = [
    { id: 'all', label: 'All Diets' },
    { id: 'veg', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'non-veg', label: 'Non-Veg' },
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by food name, ingredients, or neighborhood..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Dietary Selector */}
        <div className="w-full md:w-48">
          <select
            value={filters.dietary}
            onChange={(e) => setFilters({ ...filters, dietary: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition"
          >
            {dietaryOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="available">🟢 Available Only</option>
            <option value="all">All (Inc. Claimed)</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>

        {/* Reset button */}
        <button
          onClick={onReset}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center shrink-0"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Category Pill Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0 mr-1 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilters({ ...filters, category: cat.id })}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${
              filters.category === cat.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-900/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodFilter;
