import React from 'react';
import { Cpu, GitBranch, BookOpen, Layers } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <span>SKILLVERSE AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md mb-4 leading-relaxed">
              SkillVerse AI is a Data Science research and workforce intelligence platform that analyzes multi-year job market trends, forecasts future tech skill trajectories, and models salary ranges.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Final-Year DS Project</span>
              <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">80% Milestone</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wider uppercase">Platform Modules</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard" className="hover:text-blue-400 transition-colors">Executive Dashboard</a></li>
              <li><a href="/forecast" className="hover:text-blue-400 transition-colors">Skill Demand Forecasting</a></li>
              <li><a href="/skills" className="hover:text-blue-400 transition-colors">Skill Explorer & Salaries</a></li>
              <li><a href="/career" className="hover:text-blue-400 transition-colors">Career Gap Analysis</a></li>
              <li><a href="/workforce-trends" className="hover:text-blue-400 transition-colors">Industry & Locations</a></li>
            </ul>
          </div>

          {/* Academic Tech Stack */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wider uppercase">Technology Stack</h4>
            <ul className="space-y-1.5 text-xs">
              <li><strong className="text-slate-300">Data Science:</strong> Pandas, NumPy, Scikit-learn</li>
              <li><strong className="text-slate-300">Forecasting:</strong> Autoregressive Time-Series</li>
              <li><strong className="text-slate-300">Backend:</strong> FastAPI, SQLAlchemy, JWT</li>
              <li><strong className="text-slate-300">Frontend:</strong> React 18, Vite, Tailwind CSS, Recharts</li>
              <li><strong className="text-slate-300">Database:</strong> PostgreSQL / SQLite</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SkillVerse AI. Academic Capstone Project.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> 8 Notebooks Executed</span>
            <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> 11,980 Postings Analyzed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
