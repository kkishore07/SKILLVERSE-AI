import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Calendar, 
  Building2, 
  TrendingUp, 
  IndianRupee, 
  BookOpen, 
  ArrowRight, 
  Sliders, 
  HelpCircle, 
  FileCheck, 
  Layers, 
  Play, 
  ArrowUpRight,
  Compass,
  Check,
  Award
} from 'lucide-react';
import YoutubeIcon from '../components/YoutubeIcon';

import { 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar, 
  PolarAngleAxis, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { authService, learningService, recommendationService } from '../services/api';
import { formatRupees, formatRupeesCompact, formatLPA } from '../utils/currency';
import GoalSettingsModal from '../components/GoalSettingsModal';
import SkillResourceModal from '../components/SkillResourceModal';
import InterviewPrepModal from '../components/InterviewPrepModal';
import ATSResumeOptimizerModal from '../components/ATSResumeOptimizerModal';

export default function PersonalizedDashboardPage() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [roadmap, setRoadmap] = useState(null);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [salaryEstimate, setSalaryEstimate] = useState(null);
  const [potentialSalary, setPotentialSalary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSkillModal, setActiveSkillModal] = useState(null);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [atsOpen, setAtsOpen] = useState(false);

  // Skill filter
  const [skillFilter, setSkillFilter] = useState('All');

  useEffect(() => {
    loadPersonalizedData();
  }, []);

  const loadPersonalizedData = async () => {
    setLoading(true);
    try {
      // Refresh profile
      let currentUser = authService.getCurrentUser();
      if (localStorage.getItem('skillverse_token')) {
        try {
          const fresh = await authService.getProfile();
          currentUser = fresh;
          setUser(fresh);
        } catch (e) {
          console.warn('Could not refresh live profile, using cached user');
        }
      }

      const currentSkills = currentUser?.current_skills 
        ? currentUser.current_skills.split(',').map(s => s.trim()).filter(Boolean)
        : ['Python', 'SQL'];
      
      const targetRole = currentUser?.target_role || 'Data Scientist';
      const weeklyHours = currentUser?.weekly_hours || 10;
      const timelineWeeks = currentUser?.target_timeline_weeks || 12;

      let userProgress = {};
      try {
        userProgress = JSON.parse(currentUser?.learning_progress || '{}');
      } catch (err) {
        userProgress = {};
      }

      // Parallel fetches
      const [rmData, gapData, curSal, potSal] = await Promise.all([
        learningService.getRoadmap({
          target_role: targetRole,
          current_skills: currentSkills,
          user_progress: userProgress,
          timeline_weeks: timelineWeeks,
          weekly_hours: weeklyHours
        }),
        recommendationService.analyzeGap(targetRole, currentSkills),
        recommendationService.estimateSalary({
          job_title: targetRole,
          experience_level: currentUser?.experience_level || 'Mid-level',
          location: 'San Francisco, CA',
          industry: 'Tech / Software',
          skills: currentSkills
        }),
        recommendationService.estimateSalary({
          job_title: targetRole,
          experience_level: currentUser?.experience_level || 'Mid-level',
          location: 'San Francisco, CA',
          industry: 'Tech / Software',
          skills: [...currentSkills, 'PyTorch', 'Docker', 'AWS', 'Machine Learning', 'FastAPI']
        })
      ]);

      setRoadmap(rmData);
      setGapAnalysis(gapData);
      setSalaryEstimate(curSal);
      setPotentialSalary(potSal);
    } catch (err) {
      console.error('Failed to load personalized dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSaved = (updatedUser) => {
    setUser(updatedUser);
    loadPersonalizedData();
  };

  const handleProgressUpdated = (skillName, newStatus) => {
    // Refresh roadmap & state
    loadPersonalizedData();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600">Synthesizing Your Personalized Career Hub...</p>
        </div>
      </div>
    );
  }

  // Identify Highest-ROI Focus Skill
  const topFocusRecommendation = gapAnalysis?.learning_recommendations?.[0] || null;

  // Filter skills for matrix
  const allRoleSkills = roadmap?.phases?.flatMap(p => p.skills) || [];
  const uniqueSkillsMap = new Map();
  allRoleSkills.forEach(s => {
    if (!uniqueSkillsMap.has(s.skill)) uniqueSkillsMap.set(s.skill, s);
  });
  const uniqueSkills = Array.from(uniqueSkillsMap.values());

  const filteredSkills = uniqueSkills.filter(s => {
    if (skillFilter === 'All') return true;
    if (skillFilter === 'Mastered') return s.status === 'Mastered';
    if (skillFilter === 'In Progress') return s.status === 'In Progress';
    if (skillFilter === 'Needs Focus') return s.status === 'To Learn';
    return true;
  });

  const salaryBump = (potentialSalary?.predicted_salary || 0) - (salaryEstimate?.predicted_salary || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Personalized Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personal Career Hub</span>
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold border border-amber-400/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{user?.study_streak_days || 5}-Day Learning Streak</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-200 bg-clip-text text-transparent">{user?.name || 'Aspiring Technologist'}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 pt-1">
              <span>Target Role: <strong className="text-white">{user?.target_role || 'Data Scientist'}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                {user?.target_company_tier || 'Top Tech / Product Unicorns'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Target: {user?.target_timeline_weeks || 12} Weeks ({user?.weekly_hours || 10}h/wk)
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all flex items-center gap-2 shadow-sm"
            >
              <Sliders className="w-4 h-4" />
              <span>Edit Career Goal</span>
            </button>

            <Link
              to="/roadmap"
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-500/25 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Interactive Mindmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Readiness Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Role Readiness
            </span>
            <div className="text-3xl font-black text-slate-900">
              {roadmap?.readiness_score || 0}%
            </div>
            <p className="text-[11px] text-slate-400">
              {roadmap?.mastered_skills_count || 0} of {uniqueSkills.length} competencies verified
            </p>
          </div>
          <div className="w-16 h-16 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600"
                strokeDasharray={`${roadmap?.readiness_score || 0}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Target className="w-6 h-6 text-indigo-600 absolute" />
          </div>
        </div>

        {/* Metric 2: Estimated Study Hours */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Remaining Effort
            </span>
            <div className="text-3xl font-black text-slate-900">
              {roadmap?.total_estimated_hours || 0} <span className="text-sm font-semibold text-slate-500">hrs</span>
            </div>
            <p className="text-[11px] text-indigo-600 font-semibold">
              ~{Math.ceil((roadmap?.total_estimated_hours || 10) / (user?.weekly_hours || 10))} weeks at current pace
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Current Market Compensation */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Market Value
            </span>
            <div className="text-2xl font-black text-slate-900">
              {formatLPA(salaryEstimate?.predicted_salary, { decimals: 2 })}
            </div>
            <p className="text-[11px] text-slate-400">
              ML Regressor (R² = 0.976)
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Goal Unlock Potential */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Full Roadmap Value
            </span>
            <div className="text-2xl font-black text-indigo-600">
              {formatLPA(potentialSalary?.predicted_salary, { decimals: 2 })}
            </div>
            <p className="text-[11px] text-emerald-600 font-bold">
              +{formatLPA(salaryBump, { decimals: 1 })} upside potential
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Action Mission + Quick Tooling Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Today's High-ROI Action Focus */}
        <div className="lg:col-span-2 space-y-6">
          {topFocusRecommendation ? (
            <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-sm relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                      Today's Highest-ROI Study Mission
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      Master Competency: {topFocusRecommendation.skill}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {topFocusRecommendation.current_demand} Demand Tier
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {topFocusRecommendation.future_trend} Trend
                  </span>
                </div>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {topFocusRecommendation.reasoning}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span>Category: <strong className="text-slate-700">{topFocusRecommendation.category}</strong></span>
                  <span>•</span>
                  <span>Market Value: <strong className="text-slate-700">{formatRupees(topFocusRecommendation.average_salary)}</strong></span>
                  <span>•</span>
                  <span>Est. Study Time: <strong className="text-slate-700">~20 hours</strong></span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setActiveSkillModal(topFocusRecommendation.skill)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-indigo-200 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Learning: Videos & Courses</span>
                </button>

                <button
                  onClick={() => handleProgressUpdated(topFocusRecommendation.skill, 'In Progress')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark as In Progress</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-900 flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold">Outstanding! Zero Critical Skill Gaps Found</h3>
                <p className="text-xs text-emerald-800 mt-1">
                  You possess all expected core competencies for <strong>{user?.target_role}</strong>. Proceed to FAANG interview drills and ATS resume optimization!
                </p>
              </div>
            </div>
          )}

          {/* Skill Competency Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Competency Matrix</h3>
                <p className="text-xs text-slate-500">
                  Click any skill chip to open YouTube tutorials, courses, and documentation or update your learning status.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {['All', 'Mastered', 'In Progress', 'Needs Focus'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSkillFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      skillFilter === f
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Chips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {filteredSkills.map((s) => (
                <div
                  key={s.skill}
                  onClick={() => setActiveSkillModal(s.skill)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {s.skill}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">({s.category})</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Posting Freq: <strong className="text-slate-700">{s.frequency_pct}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      s.status === 'Mastered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : s.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {s.status}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Career Tooling Hub */}
        <div className="space-y-6">
          {/* Quick Tool 1: Interactive Roadmap */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300 border border-white/10">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Personalized Visual Mindmap</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Explore an interactive node-graph visual tree of required competencies and prerequisites.
              </p>
            </div>
            <Link
              to="/roadmap"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm"
            >
              <span>Explore Mindmap & Phases</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Tool 2: Technical Interview Prep */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4 hover:border-purple-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                FAANG Drills
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Technical Interview Flashcards</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Practice 5-8 verified interview questions asked for {user?.target_role || 'Data Scientist'} roles.
              </p>
            </div>
            <button
              onClick={() => setInterviewOpen(true)}
              className="w-full px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-between"
            >
              <span>Practice Technical Drills</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Tool 3: ATS Resume Optimizer */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4 hover:border-emerald-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                ATS Scanner
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">ATS Resume Optimizer</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Scan your profile keywords against real posting frequencies to bypass automated recruiter rejection filters.
              </p>
            </div>
            <button
              onClick={() => setAtsOpen(true)}
              className="w-full px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-between"
            >
              <span>Scan & Optimize Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Tool 4: Verified Course Directory */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Full Course & Resource Catalog</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Browse verified courses, YouTube tutorials, and cheat sheets across all 45 platform technologies.
              </p>
            </div>
            <Link
              to="/resources"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors"
            >
              <span>Browse Resource Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <GoalSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSaved={handleProfileSaved}
        currentUser={user}
      />

      <SkillResourceModal
        skillName={activeSkillModal}
        isOpen={Boolean(activeSkillModal)}
        onClose={() => setActiveSkillModal(null)}
        onProgressUpdated={handleProgressUpdated}
        currentStatus={uniqueSkills.find(s => s.skill === activeSkillModal)?.status || 'To Learn'}
      />

      <InterviewPrepModal
        role={user?.target_role || 'Data Scientist'}
        isOpen={interviewOpen}
        onClose={() => setInterviewOpen(false)}
      />

      <ATSResumeOptimizerModal
        targetRole={user?.target_role || 'Data Scientist'}
        userSkills={user?.current_skills ? user.current_skills.split(',').map(s => s.trim()) : ['Python', 'SQL']}
        isOpen={atsOpen}
        onClose={() => setAtsOpen(false)}
      />
    </div>
  );
}
