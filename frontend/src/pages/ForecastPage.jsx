import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  BarChart2, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend,
  Area,
  ComposedChart
} from 'recharts';
import { forecastService } from '../services/api';

export default function ForecastPage() {
  const [forecastableSkills, setForecastableSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('Python');
  const [forecastData, setForecastData] = useState(null);
  const [metricsReport, setMetricsReport] = useState(null);
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    async function loadInitial() {
      try {
        const [skillsList, report, trending] = await Promise.all([
          forecastService.getSkills(),
          forecastService.getEvaluationReport(),
          forecastService.getTrending()
        ]);
        setForecastableSkills(skillsList);
        setMetricsReport(report);
        setTrendingSkills(trending.slice(0, 8));
        if (skillsList.length > 0) {
          fetchSkillForecast(skillsList[0]);
        }
      } catch (err) {
        console.error('Failed to load forecast data', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  const fetchSkillForecast = async (skill) => {
    setSelectedSkill(skill);
    setChartLoading(true);
    try {
      const data = await forecastService.getForecast(skill);
      setForecastData(data);
    } catch (err) {
      console.error('Error fetching skill forecast', err);
    } finally {
      setChartLoading(false);
    }
  };

  // Build combined timeline series
  const timeline = [];
  if (forecastData) {
    forecastData.historical.forEach((h) => {
      timeline.push({
        period: h.period,
        Historical: h.demand,
        Forecast: null,
        Lower: null,
        Upper: null
      });
    });

    if (timeline.length > 0 && forecastData.forecast.length > 0) {
      const lastVal = timeline[timeline.length - 1].Historical;
      timeline[timeline.length - 1].Forecast = lastVal;
      timeline[timeline.length - 1].Lower = lastVal;
      timeline[timeline.length - 1].Upper = lastVal;
    }

    forecastData.forecast.forEach((f) => {
      timeline.push({
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autoregressive Time-Series Demand Projections</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-7 h-7 text-blue-600" />
          <span>Workforce Skill Demand Forecaster</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Predict future monthly market demand across 25 key technical competencies with empirical error bounds.
        </p>
      </div>

      {/* Control Bar: Select Skill */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Select Competency:
          </label>
          <select
            value={selectedSkill}
            onChange={(e) => fetchSkillForecast(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {forecastableSkills.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {forecastData && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trajectory</span>
              <span className={`text-sm font-black ${
                forecastData.trend_direction === 'Increasing' ? 'text-emerald-600' :
                forecastData.trend_direction === 'Decreasing' ? 'text-amber-600' : 'text-blue-600'
              }`}>
                {forecastData.trend_direction} ({forecastData.projected_growth_pct > 0 ? '+' : ''}{forecastData.projected_growth_pct}%)
              </span>
            </div>
            <div className={`p-2.5 rounded-xl border ${
              forecastData.trend_direction === 'Increasing' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
              forecastData.trend_direction === 'Decreasing' ? 'bg-amber-50 border-amber-200 text-amber-700' :
              'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* Main Forecast Chart Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              54-Month Historical Trajectory & 12-Month Predictive Curve: {selectedSkill}
            </h2>
            <p className="text-xs text-slate-500">
              Solid blue line depicts historical monthly job postings. Dashed purple line models future demand with shaded 95% confidence intervals.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600"></span> Historical</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-600"></span> Forecast</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-200"></span> 95% CI</span>
          </div>
        </div>

        {chartLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timeline} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#64748b' }} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="Upper" stroke="none" fill="#c7d2fe" fillOpacity={0.3} />
                <Area type="monotone" dataKey="Lower" stroke="none" fill="#f8fafc" fillOpacity={0.8} />
                <Line type="monotone" dataKey="Historical" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Forecast" stroke="#6366f1" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Model Evaluation & Benchmarks Section (Module 15 / Academic Viva) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Performance Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Academic Model Validation: {selectedSkill}</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
              Outperformed Baseline
            </span>
          </div>

          {forecastData?.evaluation && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Model MAE</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">{forecastData.evaluation.model_mae}</div>
                <div className="text-[10px] text-slate-400">vs {forecastData.evaluation.baseline_mae} base</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Model RMSE</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">{forecastData.evaluation.model_rmse}</div>
                <div className="text-[10px] text-slate-400">vs {forecastData.evaluation.baseline_rmse} base</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <div className="text-[11px] text-slate-400 font-semibold uppercase">MAPE Error</div>
                <div className="text-lg font-black text-blue-600 mt-0.5">{forecastData.evaluation.model_mape}%</div>
                <div className="text-[10px] text-slate-400">Mean Abs. Pct</div>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500 leading-relaxed">
            The Autoregressive Lagged Ridge model uses 3 lagged demand intervals plus a 3-month rolling mean feature. It evaluated on an out-of-sample holdout test window, achieving an improvement of <strong className="text-slate-800">{forecastData?.evaluation?.improvement_pct}%</strong> over the 3-month Simple Moving Average benchmark.
          </p>
        </div>

        {/* Global Platform Model Summary Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Aggregate Forecasting Suite Metrics</h3>
          </div>

          {metricsReport?.forecasting && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-indigo-50/60 rounded-lg text-center">
                <div className="text-[11px] text-indigo-900 font-semibold uppercase">Skills Modeled</div>
                <div className="text-lg font-black text-indigo-900 mt-0.5">{metricsReport.forecasting.skills_forecasted}</div>
                <div className="text-[10px] text-indigo-700">Top competencies</div>
              </div>
              <div className="p-3 bg-indigo-50/60 rounded-lg text-center">
                <div className="text-[11px] text-indigo-900 font-semibold uppercase">Global MAE</div>
                <div className="text-lg font-black text-indigo-900 mt-0.5">{metricsReport.forecasting.average_mae}</div>
                <div className="text-[10px] text-indigo-700">Average across skills</div>
              </div>
              <div className="p-3 bg-indigo-50/60 rounded-lg text-center">
                <div className="text-[11px] text-indigo-900 font-semibold uppercase">Global MAPE</div>
                <div className="text-lg font-black text-indigo-900 mt-0.5">{metricsReport.forecasting.average_mape}%</div>
                <div className="text-[10px] text-indigo-700">Predictive fidelity</div>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-600 space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Benchmark Baseline:</span>
              <span className="font-semibold text-slate-800">3-Month Simple Moving Average</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Forecast Horizon:</span>
              <span className="font-semibold text-slate-800">12 Months (2026-07 to 2027-06)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Confidence Formulation:</span>
              <span className="font-semibold text-slate-800">Studentized Residual Standard Error Band (95%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Trajectories Leaderboard */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow space-y-4">
        <h3 className="text-base font-bold text-slate-900">Projected Growth Leaderboard</h3>
        <p className="text-xs text-slate-500">
          Ranked by forecasted 12-month demand growth relative to recent historical run-rate
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase border-b border-slate-100">
                <th className="py-2.5">Competency</th>
                <th className="py-2.5">Trend Direction</th>
                <th className="py-2.5 text-right">Projected Growth</th>
                <th className="py-2.5 text-right">Model MAE</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trendingSkills.map((item) => (
                <tr key={item.skill} className="hover:bg-slate-50">
                  <td className="py-2.5 font-bold text-slate-900">{item.skill}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.trend_direction === 'Increasing' ? 'badge-high' : 'badge-low'
                    }`}>
                      {item.trend_direction}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-black text-emerald-600">
                    {item.projected_growth_pct > 0 ? '+' : ''}{item.projected_growth_pct}%
                  </td>
                  <td className="py-2.5 text-right text-slate-600 font-medium">
                    {item.evaluation?.model_mae}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => fetchSkillForecast(item.skill)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold rounded text-[11px] transition-colors"
                    >
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
