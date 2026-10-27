import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Building2, 
  MapPin, 
  TrendingUp, 
  Cpu, 
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { analyticsService } from '../services/api';
import { formatRupees } from '../utils/currency';

export default function WorkforceTrendsPage() {
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrends() {
      try {
        const [indData, locData] = await Promise.all([
          analyticsService.getIndustry(),
          analyticsService.getLocation()
        ]);
        setIndustries(indData);
        setLocations(locData);
      } catch (err) {
        console.error('Failed to load trends', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrends();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-purple-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Macro-Economic Job Market Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Activity className="w-7 h-7 text-purple-600" />
          <span>Workforce Industry & Geographic Trends</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Examine cross-sector hiring volume, geographic tech epicenters, and regional salary distributions.
        </p>
      </div>

      {/* Industry Analytics Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Hiring Demand by Industry Sector</h2>
              <p className="text-xs text-slate-500">Distribution of tech roles across vertical industries</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">Total Postings</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={industries} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="industry" tick={{ fontSize: 10, fill: '#334155', angle: -20, textAnchor: 'end' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                formatter={(val, name) => [name === 'total_jobs' ? `${val} postings` : formatRupees(val), name === 'total_jobs' ? 'Jobs' : 'Avg Salary']}
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="total_jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} name="total_jobs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Industry Table summary */}
        <div className="overflow-x-auto border-t border-slate-100 pt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase border-b border-slate-100">
                <th className="py-2">Industry Sector</th>
                <th className="py-2 text-right">Job Postings</th>
                <th className="py-2 text-right">Average Base Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {industries.map((ind) => (
                <tr key={ind.industry} className="hover:bg-slate-50">
                  <td className="py-2.5 font-semibold text-slate-900">{ind.industry}</td>
                  <td className="py-2.5 text-right font-medium text-slate-700">{ind.total_jobs?.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-bold text-blue-600">{formatRupees(ind.average_salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Location Analytics Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Geographic & Remote Job Concentration</h2>
              <p className="text-xs text-slate-500">Hiring hotspots and regional salary benchmarks</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">Regional Postings</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locations} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis dataKey="location" type="category" tick={{ fontSize: 10, fill: '#1e293b' }} width={120} />
              <Tooltip 
                formatter={(val) => [`${val} jobs`, 'Postings']}
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="total_jobs" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emerging Technologies Spotlight */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white card-shadow">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Macro Disruption Forecast</span>
        </div>
        <h3 className="text-2xl font-black mb-2">Emerging Technology Shift (2024–2027)</h3>
        <p className="text-slate-300 text-sm max-w-2xl mb-6">
          Our longitudinal analysis demonstrates a rapid structural re-weighting towards AI-native development, decentralized infrastructure, and automated MLOps lifecycles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="text-xs text-indigo-300 font-semibold uppercase">Generative AI & LLMs</div>
            <div className="text-2xl font-black text-white mt-1">+142%</div>
            <p className="text-xs text-slate-300 mt-1">Surpassing traditional NLP in posting requirements.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="text-xs text-indigo-300 font-semibold uppercase">MLOps & Pipelines</div>
            <div className="text-2xl font-black text-white mt-1">+85%</div>
            <p className="text-xs text-slate-300 mt-1">High demand for operationalizing model inference.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="text-xs text-indigo-300 font-semibold uppercase">Cloud-Native K8s</div>
            <div className="text-2xl font-black text-white mt-1">+48%</div>
            <p className="text-xs text-slate-300 mt-1">Standardized runtime for modern distributed microservices.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
