import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sparkles, 
  Target, 
  Briefcase, 
  ArrowRight, 
  Download, 
  Printer, 
  HelpCircle, 
  BookOpen, 
  Code2, 
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Play
} from 'lucide-react';
import { learningService, recommendationService, authService } from '../services/api';
import { formatRupees } from '../utils/currency';
import SkillResourceModal from '../components/SkillResourceModal';

export default function RoadmapMindmapPage() {
  const currentUser = authService.getCurrentUser();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(currentUser?.target_role || 'Machine Learning Engineer');
  const [viewMode, setViewMode] = useState('mindmap'); // 'mindmap' or 'phases'
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSkillModal, setActiveSkillModal] = useState(null);
  const [timelineWeeks, setTimelineWeeks] = useState(currentUser?.target_timeline_weeks || 12);

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

  useEffect(() => {
    if (selectedRole) {
      loadRoadmapData();
    }
  }, [selectedRole, timelineWeeks]);

  const loadRoadmapData = async () => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      const currentSkills = user?.current_skills 
        ? user.current_skills.split(',').map(s => s.trim()).filter(Boolean)
        : ['Python', 'SQL'];

      let userProgress = {};
      try {
        userProgress = JSON.parse(user?.learning_progress || '{}');
      } catch (err) {
        userProgress = {};
      }

      const data = await learningService.getRoadmap({
        target_role: selectedRole,
        current_skills: currentSkills,
        user_progress: userProgress,
        timeline_weeks: timelineWeeks,
        weekly_hours: user?.weekly_hours || 10
      });

      setRoadmap(data);
    } catch (err) {
      console.error('Failed to load career roadmap', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!roadmap) return;
    const blob = new Blob([JSON.stringify(roadmap, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedRole.toLowerCase().replace(/\s+/g, '_')}_career_roadmap.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs font-semibold mb-2 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Goal Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Compass className="w-7 h-7 text-indigo-400" />
            <span>Career Mindmap & Phased Roadmap</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            A milestone-driven curriculum mapped directly from employer requirements. Click any node to access video tutorials, certified courses, official documentation, and capstone project blueprints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all flex items-center gap-1.5"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all flex items-center gap-1.5"
            title="Download JSON roadmap"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Control Toolbar: Role Selector + View Toggle */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Target Role:</span>
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <span className="hidden sm:inline text-slate-300">|</span>

          {/* Timeline Selector */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Horizon:</span>
            <select
              value={timelineWeeks}
              onChange={(e) => setTimelineWeeks(parseInt(e.target.value))}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value="8">8 Weeks (Accelerated)</option>
              <option value="12">12 Weeks (Standard)</option>
              <option value="16">16 Weeks (Comprehensive)</option>
              <option value="24">24 Weeks (Mastery)</option>
            </select>
          </div>
        </div>

        {/* View Switcher: Mindmap vs Phased Roadmap */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setViewMode('mindmap')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'mindmap'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Visual Mindmap</span>
          </button>

          <button
            onClick={() => setViewMode('phases')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'phases'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Phased Curriculum</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:grid-cols-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Readiness Score</span>
          <div className="text-2xl font-black text-indigo-600 mt-0.5">{roadmap?.readiness_score || 0}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Mastered Skills</span>
          <div className="text-2xl font-black text-emerald-600 mt-0.5">{roadmap?.mastered_skills_count || 0} Skills</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">In Progress</span>
          <div className="text-2xl font-black text-amber-500 mt-0.5">{roadmap?.in_progress_count || 0} Skills</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Pending Focus Gaps</span>
          <div className="text-2xl font-black text-slate-700 mt-0.5">{roadmap?.pending_skills_count || 0} Skills</div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-200">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Generating graph nodes and structured timeline...</p>
        </div>
      ) : (
        <>
          {/* VIEW 1: VISUAL INTERACTIVE MINDMAP */}
          {viewMode === 'mindmap' && (
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800 text-white">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h2 className="text-lg font-bold text-white">Visual Career Skill Tree</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any skill bubble to inspect verified YouTube masterclasses, courses, and documentation.
                  </p>
                </div>

                {/* Status Legend */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                    <span className="text-slate-300">Mastered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
                    <span className="text-slate-300">In Progress</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-500"></span>
                    <span className="text-slate-400">To Learn</span>
                  </div>
                </div>
              </div>

              {/* Central Goal Root Node */}
              <div className="flex flex-col items-center justify-center my-6">
                <div className="px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/20 border-2 border-indigo-300/40 text-center max-w-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                    Primary Goal Objective
                  </span>
                  <h3 className="text-xl font-extrabold mt-0.5">{roadmap?.target_role}</h3>
                  <div className="text-xs text-indigo-100 mt-1">
                    {roadmap?.readiness_score}% Readiness • {roadmap?.total_estimated_hours}h Remaining
                  </div>
                </div>
                {/* Connector vertical stem */}
                <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-500 to-slate-700"></div>
              </div>

              {/* Domain Branches & Leaf Nodes */}
              {(() => {
                // Group mindmap nodes by category
                const catNodes = (roadmap?.mindmap_nodes || []).filter(n => n.type === 'category');
                const skillNodes = (roadmap?.mindmap_nodes || []).filter(n => n.type === 'skill');

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                    {catNodes.map((cat) => {
                      const children = skillNodes.filter(s => s.category === cat.category);
                      return (
                        <div
                          key={cat.id}
                          className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-indigo-500/60 transition-colors space-y-4"
                        >
                          {/* Branch Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                                Domain Branch
                              </span>
                              <h4 className="text-sm font-bold text-white">{cat.label}</h4>
                            </div>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-semibold">
                              {children.length} Skills
                            </span>
                          </div>

                          {/* Skill Leaf Nodes */}
                          <div className="space-y-2.5">
                            {children.map((s) => {
                              const isMastered = s.status === 'Mastered';
                              const isInProg = s.status === 'In Progress';
                              return (
                                <div
                                  key={s.id}
                                  onClick={() => setActiveSkillModal(s.label)}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                                    isMastered 
                                      ? 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-400' 
                                      : isInProg
                                      ? 'bg-amber-950/30 border-amber-500/40 hover:border-amber-400'
                                      : 'bg-slate-900/60 border-slate-700/70 hover:border-indigo-400 hover:bg-slate-900'
                                  }`}
                                >
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${
                                        isMastered ? 'bg-emerald-400' : isInProg ? 'bg-amber-400' : 'bg-slate-500'
                                      }`}></span>
                                      <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                                        {s.label}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 pl-4">
                                      Demand: <strong className="text-slate-300">{s.frequency_pct}%</strong> • {s.estimated_hours}h
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-indigo-300">
                                    <span>Resources</span>
                                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* VIEW 2: PHASED STRUCTURED ROADMAP */}
          {viewMode === 'phases' && (
            <div className="space-y-6">
              {roadmap?.phases?.map((phase) => (
                <div
                  key={phase.phase_number}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5 hover:border-indigo-200 transition-all"
                >
                  {/* Phase Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm flex items-center justify-center flex-shrink-0">
                        {phase.phase_number}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{phase.phase_title}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {phase.estimated_weeks}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{phase.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-semibold">Phase Progress</div>
                        <div className="text-base font-extrabold text-slate-900">{phase.completion_percentage}%</div>
                      </div>
                      <div className="w-20 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${phase.completion_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Grid for this Phase */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {phase.skills?.map((s) => (
                      <div
                        key={s.skill}
                        onClick={() => setActiveSkillModal(s.skill)}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {s.skill}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {s.priority} Priority • Est. {s.estimated_hours}h
                          </div>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          s.status === 'Mastered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : s.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Milestone Capstone Project for this Phase */}
                  {phase.milestone_project && (
                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Phase Milestone Capstone Deliverable:</span>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-semibold">
                          {phase.milestone_project.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {phase.milestone_project.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {phase.milestone_project.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-medium">Stack:</span>
                        {phase.milestone_project.tech_stack?.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal Dossier */}
      <SkillResourceModal
        skillName={activeSkillModal}
        isOpen={Boolean(activeSkillModal)}
        onClose={() => setActiveSkillModal(null)}
        onProgressUpdated={() => loadRoadmapData()}
      />
    </div>
  );
}
