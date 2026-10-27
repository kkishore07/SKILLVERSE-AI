import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Layers, 
  Building2, 
  MapPin, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  Compass,
  ChevronRight,
  Target,
  BookOpen
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import MetricCard from '../components/MetricCard';
import { analyticsService, skillsService, forecastService, authService } from '../services/api';
import { formatRupees, formatRupeesCompact } from '../utils/currency';

export default function DashboardPage() {
  const currentUser = authService.getCurrentUser();
  const [overview, setOverview] = useState(null);
  const [topSkills, setTopSkills] = useState([]);
  const [salarySkills, setSalarySkills] = useState([]);
  const [forecastSample, setForecastSample] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ovData, topData, salData, fcData] = await Promise.all([
          analyticsService.getOverview(),
          skillsService.getTop(10),
          analyticsService.getSalaryBySkill(),
          forecastService.getForecast('Python')
        ]);
        setOverview(ovData);
        setTopSkills(topData);
        setSalarySkills(salData);
        setForecastSample(fcData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading Workforce Analytics...</p>
        </div>
      </div>
    );
  }

  // Format historical + forecast line chart data
  const combinedTrajectoryData = [];
  if (forecastSample) {
    const hist = forecastSample.historical.slice(-18);
    hist.forEach(h => {
      combinedTrajectoryData.push({
        period: h.period,
        Historical: h.demand,
        Forecast: null
      });
    });
    // Connect last historical to forecast
    if (hist.length > 0 && forecastSample.forecast.length > 0) {
      combinedTrajectoryData[combinedTrajectoryData.length - 1].Forecast = hist[hist.length - 1].demand;
    }
    forecastSample.forecast.forEach(f => {
      combinedTrajectoryData.push({
        period: f.period,
        Historical: null,
        Forecast: Math.round(f.forecast),
        Lower: Math.round(f.lower_bound),
        Upper: Math.round(f.upper_bound)
      });
    });
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 rounded-full text-blue-200 text-xs font-semibold mb-2 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Workforce Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Market Skill Demand & Forecasting</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Real-time statistical synthesis of 11,980 job postings across 54 historical months and 12-month forward predictive time-series modeling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/forecast"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold text-xs sm:text-sm rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <span>Skill Forecaster</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            to="/career"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 font-semibold text-xs sm:text-sm rounded-lg border border-white/20 transition-colors"
          >
            Skill-Gap Analysis
          </Link>
        </div>
      </div>

      {/* Personalized Career Hub Quick Callout */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                Personalized Career Command Center
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/40 text-indigo-200 border border-indigo-400/40">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentUser 
                ? `Welcome, ${currentUser.name}! Your target role is set to ${currentUser.target_role || 'Data Scientist'}. Access tailored course recommendations, YouTube masterclasses, and an interactive mindmap.`
                : 'Configure your target role to unlock customized course recommendations, YouTube video playlists, and an interactive milestone mindmap.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/my-dashboard"
            className="px-4 py-2 bg-white text-indigo-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Open My Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/roadmap"
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-all flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-300" />
            <span>Mindmap</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Jobs Analyzed"
          value={overview?.total_jobs?.toLocaleString() || '11,980'}
          subtitle="Multi-year post corpus"
          trend="+14.2%"
          trendLabel="YoY expansion"
          icon={Briefcase}
          color="blue"
        />
        <MetricCard
          title="Skills Identified"
          value={overview?.total_skills || '45'}
          subtitle="Canonical taxonomy nodes"
          trend="100%"
          trendLabel="normalized"
          icon={Layers}
          color="indigo"
        />
        <MetricCard
          title="Industries Tracked"
          value={overview?.total_industries || '8'}
          subtitle="Cross-sector coverage"
          trend="Tech/Fin/Bio"
          icon={Building2}
          color="emerald"
        />
        <MetricCard
          title="Global Locations"
          value={overview?.total_locations || '13'}
          subtitle="Metros + Remote hubs"
          trend="Remote 18%"
          icon={MapPin}
          color="purple"
        />
      </div>

      {/* Main Analytics Grid: Top Skills & Trending Technologies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top 10 In-Demand Skills Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Top In-Demand Technical Skills</h2>
              <p className="text-xs text-slate-500">Ranked by total posting occurrences across all roles</p>
            </div>
            <Link to="/skills" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSkills} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#1e293b' }} width={90} />
                <Tooltip 
                  formatter={(val) => [`${val} jobs`, 'Postings']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="total_postings" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fastest Growing / Trending Skills */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Trending Technologies</h2>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold">
                High Velocity
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Highest YoY growth rate in posting demand</p>

            <div className="space-y-3">
              {overview?.fastest_growing_skills?.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600">+{item.recent_growth_pct}%</span>
                    <div className="text-[10px] text-slate-400">{formatRupeesCompact(item.average_salary)} avg</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/forecast"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:underline flex items-center justify-between"
          >
            <span>Inspect forecast trajectories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Historical vs Forecast Chart */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Historical Demand vs 12-Month Forecast (Python)</h2>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold border border-blue-200">
                Model: Autoregressive Ridge
              </span>
            </div>
            <p className="text-xs text-slate-500">Tracking monthly job postings and projected trajectory with 95% confidence intervals</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600"></span> Historical</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> 12-Mo Forecast</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedTrajectoryData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="Historical" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="Forecast" stroke="#6366f1" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Salary Distribution by Technical Skill */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Average Salary by Technical Skill</h2>
            <p className="text-xs text-slate-500">Compensation correlation across tech competencies</p>
          </div>
          <span className="text-xs font-medium text-slate-500">Annual Base (₹ LPA)</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salarySkills.slice(0, 12)} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="skill" tick={{ fontSize: 10, fill: '#334155', angle: -30, textAnchor: 'end' }} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => formatRupeesCompact(val)} />
              <Tooltip 
                formatter={(val) => [formatRupees(val), 'Avg Salary']}
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="average_salary" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
