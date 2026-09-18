import React from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

const HygieneFilter = ({ filters, setFilters, onReset }) => {
  const types = [
    { id: 'all', label: 'All Drives' },
    { id: 'cleanup', label: '🧹 Cleanups' },
    { id: 'sanitation', label: '🧼 Sanitation' },
    { id: 'waste_segregation', label: '♻️ Segregation' },
    { id: 'awareness', label: '📢 Awareness' },
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search drives by name, landmark, or meeting point..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 transition"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-teal-500 transition"
          >
            <option value="upcoming">🗓️ Upcoming Drives</option>
            <option value="all">All (Inc. Past &amp; Completed)</option>
            <option value="completed">Completed Only</option>
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

      {/* Type Pill Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0 mr-1 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" /> Drive Type:
        </span>
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilters({ ...filters, type: t.id })}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${
              filters.type === t.id
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-900/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HygieneFilter;
