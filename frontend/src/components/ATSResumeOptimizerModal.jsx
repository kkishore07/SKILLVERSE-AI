import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { learningService } from '../services/api';

export default function ATSResumeOptimizerModal({ targetRole, userSkills, isOpen, onClose }) {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  useEffect(() => {
    if (isOpen && targetRole) {
      runATSAnalysis();
    }
  }, [isOpen, targetRole, userSkills]);

  const runATSAnalysis = async () => {
    setLoading(true);
    try {
      const res = await learningService.analyzeATS({
        target_role: targetRole,
        user_skills: userSkills || [],
        resume_summary: resumeText
      });
      setResult(res);
    } catch (err) {
      console.error('Failed to run ATS analysis', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Applicant Tracking System (ATS) Parser</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">
            ATS Resume & Keyword Optimizer
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Over 75% of applications are filtered by automated ATS algorithms before a human recruiter reviews them. Benchmark your profile against real job posting frequencies for <strong>{targetRole}</strong>.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {/* Paste Resume Snippet */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Optional: Paste Your Resume Summary or Experience Bullets
              </label>
              <button
                onClick={runATSAnalysis}
                disabled={loading}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Re-Analyze</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="e.g. Developed distributed machine learning pipelines with Python and PyTorch. Containerized inference workloads using Docker and deployed on AWS ECS..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Result Score Card */}
          {result && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    ATS Keyword Match Index
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                      {result.ats_score}%
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      result.ats_score >= 70 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : result.ats_score >= 45 
                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                      {result.system_readiness_tier}
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-48 bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.ats_score >= 70 ? 'bg-emerald-500' : result.ats_score >= 45 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.ats_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Matched vs Missing Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Found Keywords */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Keywords Found ({result.matched_keywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched_keywords.map((kw) => (
                      <span key={kw} className="px-2.5 py-0.5 bg-white border border-emerald-200 text-emerald-800 rounded-md text-xs font-medium">
                        {kw}
                      </span>
                    ))}
                    {result.matched_keywords.length === 0 && (
                      <span className="text-xs text-slate-400 italic">No exact target keywords matched yet.</span>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-800">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Missing Critical ATS Filter Words ({result.missing_critical_keywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_critical_keywords.map((kw) => (
                      <span key={kw.skill} className="px-2.5 py-0.5 bg-white border border-red-200 text-red-800 rounded-md text-xs font-medium flex items-center gap-1">
                        <span>{kw.skill}</span>
                        <span className="text-[10px] text-red-500 font-bold">({kw.frequency_pct}%)</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tailored Resume Bullet Recommendations */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Actionable High-Impact Resume Bullet Recommendations</span>
                </span>

                <div className="space-y-2.5">
                  {result.resume_bullet_recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 text-xs text-slate-700 leading-relaxed hover:bg-white hover:border-emerald-300 transition-colors group"
                    >
                      <div className="flex items-start gap-2 flex-1">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>

                      <button
                        onClick={() => handleCopy(rec, idx)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Calculated from 11,980 real job postings
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Optimizer
          </button>
        </div>
      </div>
    </div>
  );
}
