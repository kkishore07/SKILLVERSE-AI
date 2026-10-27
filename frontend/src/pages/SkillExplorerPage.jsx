import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  TrendingUp, 
  Layers, 
  Briefcase, 
  Sparkles, 
  ArrowUpRight, 
  BarChart2 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { skillsService, forecastService } from '../services/api';
import { formatRupees, formatRupeesCompact } from '../utils/currency';

export default function SkillExplorerPage() {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [allSkills, cats] = await Promise.all([
          skillsService.getAll(),
          skillsService.getCategories()
        ]);
        setSkills(allSkills);
        setCategories(['All', ...cats]);
        if (allSkills.length > 0) {
          selectSkill(allSkills[0].name);
        }
      } catch (err) {
        console.error('Error fetching skills catalog', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const selectSkill = async (skillName) => {
    setChartLoading(true);
    try {
      const [skillInfo, fc] = await Promise.all([
        skillsService.getSkillByName(skillName),
        forecastService.getForecast(skillName).catch(() => null)
      ]);
      setSelectedSkill(skillInfo);
      setForecastData(fc);
    } catch (err) {
      console.error('Error fetching skill details', err);
    } finally {
      setChartLoading(false);
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Prepare chart data combining historical & forecast
  const chartData = [];
  if (forecastData) {
    forecastData.historical?.slice(-24).forEach((h) => {
      chartData.push({
        period: h.period,
        Historical: h.demand,
        Forecast: null
      });
    });
    if (chartData.length > 0 && forecastData.forecast?.length > 0) {
      chartData[chartData.length - 1].Forecast = chartData[chartData.length - 1].Historical;
    }
    forecastData.forecast?.forEach((f) => {
      chartData.push({
        period: f.period,
        Historical: null,
        Forecast: Math.round(f.forecast),
        Lower: Math.round(f.lower_bound),
        Upper: Math.round(f.upper_bound)
      });
    });
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Compass className="w-7 h-7 text-blue-600" />
          <span>Skill Explorer & Knowledge Graph</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Inspect technical competencies, compensation impact, co-occurring tools, and demand projections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill Directory / Selector */}
        <div className="bg-white rounded-xl border border-slate-200 card-shadow p-4 flex flex-col h-[700px]">
          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search skill (e.g. PyTorch, Docker)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skill List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredSkills.map((s) => {
              const isSelected = selectedSkill?.name === s.name;
              return (
                <button
                  key={s.name}
                  onClick={() => selectSkill(s.name)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-300 shadow-sm'
                      : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div>
                    <div className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                      {s.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{s.category}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      s.demand_tier === 'High' ? 'badge-high' : s.demand_tier === 'Medium' ? 'badge-medium' : 'badge-low'
                    }`}>
                      {s.demand_tier}
                    </span>
                    <div className="text-[11px] font-medium text-slate-500 mt-1">
                      {formatRupeesCompact(s.average_salary)}
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredSkills.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-400">
                No skills match your filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Skill Drilldown & Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSkill && (
            <>
              {/* Skill Profile Header */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {selectedSkill.category}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-0.5">{selectedSkill.name}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      selectedSkill.demand_tier === 'High' ? 'badge-high' : selectedSkill.demand_tier === 'Medium' ? 'badge-medium' : 'badge-low'
                    }`}>
                      {selectedSkill.demand_tier} Market Demand
                    </span>
                    {selectedSkill.recent_growth_pct > 0 && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        +{selectedSkill.recent_growth_pct}% Growth
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500">Average Salary</div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">
                      {formatRupees(selectedSkill.average_salary)}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500">Postings Found</div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">
                      {selectedSkill.total_postings.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500">Market Share</div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">
                      {selectedSkill.percentage_of_jobs}% of jobs
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500">Projected Trend</div>
                    <div className="text-lg font-bold text-indigo-600 mt-0.5">
                      {forecastData?.trend_direction || 'Stable'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Historical Trajectory & 12-Month Forecast */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Demand Trajectory & Forecast ({selectedSkill.name})
                    </h3>
                    <p className="text-xs text-slate-500">
                      24 months historical demand followed by 12-month forward autoregressive projection
                    </p>
                  </div>
                  {forecastData?.evaluation && (
                    <div className="text-right text-xs">
                      <span className="font-semibold text-slate-700">Model MAE: </span>
                      <span className="text-blue-600 font-bold">{forecastData.evaluation.model_mae}</span>
                    </div>
                  )}
                </div>

                {chartLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : chartData.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Line type="monotone" dataKey="Historical" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 2 }} />
                        <Line type="monotone" dataKey="Forecast" stroke="#8b5cf6" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                    No time-series forecast model fitted for this skill yet.
                  </div>
                )}
              </div>

              {/* Related Co-Occurring Skills */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow">
                <h3 className="text-base font-bold text-slate-900 mb-2">Frequently Co-Occurring Competencies</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Skills that frequently appear alongside <span className="font-semibold text-slate-700">{selectedSkill.name}</span> in job descriptions
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedSkill.related_skills?.map((rel) => (
                    <button
                      key={rel}
                      onClick={() => selectSkill(rel)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <span>{rel}</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                  {(!selectedSkill.related_skills || selectedSkill.related_skills.length === 0) && (
                    <span className="text-xs text-slate-400">No co-occurring skills registered.</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
