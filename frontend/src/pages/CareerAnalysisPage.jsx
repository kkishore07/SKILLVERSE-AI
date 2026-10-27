import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  IndianRupee, 
  Plus, 
  X, 
  TrendingUp, 
  ArrowRight,
  Calculator,
  Compass,
  BookOpen,
  FileCheck,
  HelpCircle,
  Play
} from 'lucide-react';
import { recommendationService, authService } from '../services/api';
import { formatRupees, formatLPA } from '../utils/currency';
import SkillResourceModal from '../components/SkillResourceModal';
import InterviewPrepModal from '../components/InterviewPrepModal';
import ATSResumeOptimizerModal from '../components/ATSResumeOptimizerModal';

export default function CareerAnalysisPage() {
  const currentUser = authService.getCurrentUser();
  const [roles, setRoles] = useState([]);
  const [targetRole, setTargetRole] = useState(currentUser?.target_role || 'Data Scientist');
  const [skillsList, setSkillsList] = useState(
    currentUser?.current_skills ? currentUser.current_skills.split(',').map(s => s.trim()) : ['Python', 'SQL', 'Git']
  );
  const [activeSkillModal, setActiveSkillModal] = useState(null);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [atsOpen, setAtsOpen] = useState(false);

  const [newSkillInput, setNewSkillInput] = useState('');
  
  // Gap analysis state
  const [gapResult, setGapResult] = useState(null);
  const [loadingGap, setLoadingGap] = useState(false);

  // Salary Prediction state
  const [expLevel, setExpLevel] = useState('Mid-level');
  const [loc, setLoc] = useState('San Francisco, CA');
  const [industry, setIndustry] = useState('Tech / Software');
  const [salaryResult, setSalaryResult] = useState(null);
  const [loadingSalary, setLoadingSalary] = useState(false);

  useEffect(() => {
    async function loadRoles() {
      try {
        const availableRoles = await recommendationService.getRoles();
        setRoles(availableRoles);
      } catch (err) {
        console.error('Failed to load roles', err);
      }
    }
    loadRoles();
  }, []);

  // Run gap analysis whenever targetRole or skillsList change
  useEffect(() => {
    if (targetRole && skillsList.length >= 0) {
      runGapAnalysis();
    }
  }, [targetRole, skillsList]);

  const runGapAnalysis = async () => {
    setLoadingGap(true);
    try {
      const res = await recommendationService.analyzeGap(targetRole, skillsList);
      setGapResult(res);
    } catch (err) {
      console.error('Error analyzing skill gap', err);
    } finally {
      setLoadingGap(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const clean = newSkillInput.trim();
    if (clean && !skillsList.some(s => s.toLowerCase() === clean.toLowerCase())) {
      setSkillsList([...skillsList, clean]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleEstimateSalary = async () => {
    setLoadingSalary(true);
    try {
      const res = await recommendationService.estimateSalary({
        job_title: targetRole,
        experience_level: expLevel,
        location: loc,
        industry: industry,
        skills: skillsList
      });
      setSalaryResult(res);
    } catch (err) {
      console.error('Error predicting salary', err);
    } finally {
      setLoadingSalary(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithmic Skill Matching & Gap Synthesis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Target className="w-7 h-7 text-indigo-600" />
            <span>Career Skill-Gap Analysis & Roadmap</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Benchmark your skillset against expected market requirements for your target role and get data-justified learning recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/roadmap"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Visual Mindmap</span>
          </Link>
          <button
            onClick={() => setInterviewOpen(true)}
            className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold border border-purple-200 transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interview Prep</span>
          </button>
          <button
            onClick={() => setAtsOpen(true)}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>ATS Optimizer</span>
          </button>
        </div>
      </div>


      {/* Input Controls: Role & User Skills */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Role Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">
              Select Your Target Career Role
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Select any role to compare requirements mined from thousands of real job postings.
            </p>
          </div>

          {/* Add Skill Tag */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">
              Your Current Technical Skills
            </label>
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Type skill & press Enter (e.g. PyTorch, Docker)..."
                className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Current Skills Chips */}
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-2">
            Active Profile Skills ({skillsList.length}):
          </span>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-xs font-medium"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {skillsList.length === 0 && (
              <span className="text-xs text-slate-400 italic">No skills added yet. Add your skills above.</span>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Output Section */}
      {gapResult && (
        <div className="space-y-6">
          {/* Match Overview Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="text-center sm:text-left">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Role Readiness Index
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                  Target: <span className="text-indigo-600">{gapResult.target_role}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Market Benchmark: {formatRupees(gapResult.target_role_avg_salary)} average compensation
                </p>
              </div>

              {/* Match Score Gauge / Badge */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-black text-slate-900 tracking-tight">
                    {gapResult.skill_match_percentage}%
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                    Skill Match Score
                  </div>
                </div>

                <div className="w-28 bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      gapResult.skill_match_percentage >= 70
                        ? 'bg-emerald-500'
                        : gapResult.skill_match_percentage >= 40
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${gapResult.skill_match_percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Matched vs Missing Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Matched Skills */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Existing Competencies ({gapResult.matched_skills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {gapResult.matched_skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-md text-xs font-medium shadow-2xs">
                      {s}
                    </span>
                  ))}
                  {gapResult.matched_skills.length === 0 && (
                    <span className="text-xs text-slate-400">None of your current skills matched role core requirements.</span>
                  )}
                </div>
              </div>

              {/* Missing Gaps */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                <div className="flex items-center gap-2 mb-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Missing Skill Gaps ({gapResult.missing_skills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {gapResult.missing_skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-white border border-amber-200 text-amber-800 rounded-md text-xs font-medium shadow-2xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Prioritized Learning Roadmap */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Prioritized Learning Roadmap</h3>
                <p className="text-xs text-slate-500">
                  Ranked algorithmically by market demand density, projected growth trajectory, and compensation premium
                </p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-full">
                {gapResult.learning_recommendations.length} Recommended Actions
              </span>
            </div>

            <div className="space-y-3">
              {gapResult.learning_recommendations.map((item, idx) => (
                <div
                  key={item.skill}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-base font-bold text-slate-900">{item.skill}</span>
                      <span className="text-xs text-slate-400 font-medium">({item.category})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.priority === 'High' ? 'badge-high' : 'badge-medium'
                      }`}>
                        {item.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                      {item.reasoning}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-700">
                        Demand: <span className="text-indigo-600 font-bold">{item.current_demand}</span> • Trend: <span className="text-emerald-600 font-bold">{item.future_trend}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Avg Market: {formatRupees(item.average_salary)}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveSkillModal(item.skill)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-indigo-200 shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-red-600 text-red-600" />
                      <span>Videos & Courses</span>
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Salary Prediction Calculator (Random Forest Regressor) */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">Market Salary Estimator (ML Regressor)</h3>
                <p className="text-xs text-slate-500">
                  Trained Random Forest Regressor (R² = 0.976, MAE = {formatLPA(6938, { decimals: 2 })}) modeling role, skills, experience, and geography
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Experience Tier</label>
                <select
                  value={expLevel}
                  onChange={(e) => setExpLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="Entry-level">Entry-level (0-2 yrs)</option>
                  <option value="Mid-level">Mid-level (3-5 yrs)</option>
                  <option value="Senior">Senior (5-8 yrs)</option>
                  <option value="Lead / Principal">Lead / Principal (8+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Job Location</label>
                <select
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="San Francisco, CA">San Francisco, CA</option>
                  <option value="New York, NY">New York, NY</option>
                  <option value="Seattle, WA">Seattle, WA</option>
                  <option value="Austin, TX">Austin, TX</option>
                  <option value="Boston, MA">Boston, MA</option>
                  <option value="Remote">Remote</option>
                  <option value="London, UK">London, UK</option>
                  <option value="Bangalore, India">Bangalore, India</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Target Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="Tech / Software">Tech / Software</option>
                  <option value="Finance / FinTech">Finance / FinTech</option>
                  <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Aerospace">Aerospace</option>
                  <option value="Consulting">Consulting</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleEstimateSalary}
                disabled={loadingSalary}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <IndianRupee className="w-4 h-4" />
                <span>{loadingSalary ? 'Evaluating Regressor...' : 'Calculate Market Value'}</span>
              </button>

              {salaryResult && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-right">
                  <div className="text-xs text-slate-500 uppercase font-semibold">Predicted Compensation</div>
                  <div className="text-2xl font-black text-blue-900">
                    {formatLPA(salaryResult.predicted_salary, { decimals: 2 })}
                  </div>
                  <div className="text-[11px] text-blue-700 font-medium">
                    Range: {formatLPA(salaryResult.salary_range_min, { decimals: 1 })} – {formatLPA(salaryResult.salary_range_max, { decimals: 1 })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <SkillResourceModal
        skillName={activeSkillModal}
        isOpen={Boolean(activeSkillModal)}
        onClose={() => setActiveSkillModal(null)}
        onProgressUpdated={() => runGapAnalysis()}
      />

      <InterviewPrepModal
        role={targetRole}
        isOpen={interviewOpen}
        onClose={() => setInterviewOpen(false)}
      />

      <ATSResumeOptimizerModal
        targetRole={targetRole}
        userSkills={skillsList}
        isOpen={atsOpen}
        onClose={() => setAtsOpen(false)}
      />
    </div>
  );
}

