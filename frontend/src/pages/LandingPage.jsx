import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  BrainCircuit, 
  Target, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  BarChart, 
  Sparkles,
  Award,
  Layers,
  Search
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Data-Driven Workforce Intelligence & Skill Forecasting</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Navigate Tomorrow’s Job Market with <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Predictive AI</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              SkillVerse AI mines thousands of multi-year job postings, extracts technical competencies, and forecasts 12-month demand trajectories using rigorous time-series machine learning models.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:gap-3"
              >
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/career"
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Run Skill-Gap Analysis</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-blue-600">11,980</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-medium">Job Postings Mined</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-indigo-600">54 Mo.</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-medium">Historical Timeline</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-purple-600">97.6%</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-medium">Salary Model R²</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-emerald-600">12 Mo.</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-medium">Forward Forecast</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Workforce Forecasting Matters */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Why Workforce Skill Forecasting Matters
            </h2>
            <p className="text-slate-600">
              The technology landscape shifts exponentially. Static curriculum and guesswork leave students and professionals behind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Predict Tech Disruption</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Anticipate the explosive rise of generative AI, LLMs, and cloud-native frameworks before they become universal requirements.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Personalized Career Mapping</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Compare your current skill profile against actual market demand for specific target roles like Data Scientist or Cloud Architect.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data-Driven Compensation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Understand the direct salary value in rupees (₹) of specific tech competencies using Random Forest regression models trained on market data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Core Data Science Platform Modules
          </h2>
          <p className="text-slate-600">
            A complete, verifiable end-to-end Data Science pipeline from raw data parsing to interactive visualizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Module 05</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">Time-Series Skill Demand Forecasting</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Autoregressive lagged time-series models trained across 54 consecutive monthly historical intervals. Produces 12-month forward projections with 95% confidence intervals and MAE/RMSE/MAPE benchmarks.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Autoregressive Ridge Regression with trend/seasonality</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Benchmarked against 3-month Simple Moving Average</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Upper & lower confidence error bounds</li>
              </ul>
            </div>
            <Link to="/forecast" className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
              Test Forecasting Models &rarr;
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Module 06</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">Skill-Gap Analysis & Salary Regressor</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Input your existing competencies and target role to instantly discover your skill match score, missing skills, and prioritized learning roadmap with demand justifications.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Algorithmic skill-match percentage scoring</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Random Forest salary prediction (R² = 0.976)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Learning prioritization based on forward market demand</li>
              </ul>
            </div>
            <Link to="/career" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1">
              Start Career Analysis &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to Explore the Future of Tech Skills?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            Access live dashboards, run forecasts across 25+ top technologies, and benchmark salary potential.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
          >
            <span>Launch Dashboard Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
