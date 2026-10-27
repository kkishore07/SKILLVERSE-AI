import React, { useState, useEffect } from 'react';
import { 
  X, 
  Target, 
  Briefcase, 
  Clock, 
  Calendar, 
  Building2, 
  Plus, 
  Check, 
  Sparkles,
  Layers,
  Save
} from 'lucide-react';
import { recommendationService, authService } from '../services/api';

export default function GoalSettingsModal({ isOpen, onClose, onSaved, currentUser }) {
  const [roles, setRoles] = useState([]);
  const [targetRole, setTargetRole] = useState(currentUser?.target_role || 'Data Scientist');
  const [experienceLevel, setExperienceLevel] = useState(currentUser?.experience_level || 'Mid-level');
  const [companyTier, setCompanyTier] = useState(currentUser?.target_company_tier || 'Top Tech / Product Unicorns');
  const [weeklyHours, setWeeklyHours] = useState(currentUser?.weekly_hours || 10);
  const [timelineWeeks, setTimelineWeeks] = useState(currentUser?.target_timeline_weeks || 12);
  const [skillsList, setSkillsList] = useState(
    currentUser?.current_skills ? currentUser.current_skills.split(',').map(s => s.trim()) : ['Python', 'SQL']
  );
  const [newSkillInput, setNewSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

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
    if (currentUser) {
      setTargetRole(currentUser.target_role || 'Data Scientist');
      setExperienceLevel(currentUser.experience_level || 'Mid-level');
      setCompanyTier(currentUser.target_company_tier || 'Top Tech / Product Unicorns');
      setWeeklyHours(currentUser.weekly_hours || 10);
      setTimelineWeeks(currentUser.target_timeline_weeks || 12);
      if (currentUser.current_skills) {
        setSkillsList(currentUser.current_skills.split(',').map(s => s.trim()).filter(Boolean));
      }
    }
  }, [currentUser, isOpen]);

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

  const handleQuickAdd = (s) => {
    if (!skillsList.some(item => item.toLowerCase() === s.toLowerCase())) {
      setSkillsList([...skillsList, s]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        target_role: targetRole,
        experience_level: experienceLevel,
        target_company_tier: companyTier,
        weekly_hours: parseInt(weeklyHours),
        target_timeline_weeks: parseInt(timelineWeeks),
        current_skills: skillsList.join(', ')
      };

      const updated = await authService.updateProfile(updateData);
      if (onSaved) {
        onSaved(updated);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update goal settings', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const popularSkills = ['Python', 'SQL', 'Docker', 'AWS', 'PyTorch', 'Machine Learning', 'FastAPI', 'Kubernetes', 'React', 'Git'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Career Engine</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">Configure Your Career Goal</h2>
          <p className="text-xs text-slate-300 mt-1">
            Tailor your learning roadmap, skill gap thresholds, and salary projections to your exact career ambitions.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Target Role */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Target Professional Role</span>
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Experience Level & Target Company Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Experience Level</span>
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Entry-level">Entry-level (0 - 2 yrs)</option>
                <option value="Mid-level">Mid-level (3 - 5 yrs)</option>
                <option value="Senior">Senior (5 - 8 yrs)</option>
                <option value="Lead / Principal">Lead / Principal (8+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Target Employer Tier</span>
              </label>
              <select
                value={companyTier}
                onChange={(e) => setCompanyTier(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Top Tech / Product Unicorns">Top Tech / Tier-1 Product Unicorns</option>
                <option value="High-Growth AI Startups">High-Growth AI Startups</option>
                <option value="FinTech & Quant Firms">FinTech & Quantitative Finance</option>
                <option value="Global Enterprises & Consulting">Global Enterprises & Consulting</option>
              </select>
            </div>
          </div>

          {/* Study Commitment: Weekly Hours & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Weekly Study Commitment</span>
                </span>
                <span className="text-indigo-600 font-extrabold">{weeklyHours} hrs/week</span>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(e.target.value)}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>5 hrs (Casual)</span>
                <span>15 hrs (Moderate)</span>
                <span>30 hrs (Bootcamp)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Target Readiness Horizon</span>
                </span>
                <span className="text-indigo-600 font-extrabold">{timelineWeeks} Weeks</span>
              </label>
              <input
                type="range"
                min="6"
                max="24"
                step="2"
                value={timelineWeeks}
                onChange={(e) => setTimelineWeeks(e.target.value)}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>6 Wks (Sprint)</span>
                <span>12 Wks (Quarter)</span>
                <span>24 Wks (Deep Master)</span>
              </div>
            </div>
          </div>

          {/* Current Skills Chips & Input */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Your Current Verified Skills ({skillsList.length})
            </label>

            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Type skill & press Enter (e.g. Scikit-learn, MLOps, AWS)..."
                className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* Quick Add Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Quick Add:</span>
              {popularSkills.map((ps) => {
                const isAdded = skillsList.some(s => s.toLowerCase() === ps.toLowerCase());
                return (
                  <button
                    key={ps}
                    type="button"
                    onClick={() => handleQuickAdd(ps)}
                    disabled={isAdded}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border transition-colors flex items-center gap-1 ${
                      isAdded 
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                  >
                    {isAdded && <Check className="w-3 h-3 text-emerald-600" />}
                    <span>{ps}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Skills List */}
            <div className="flex flex-wrap gap-2 pt-2 max-h-32 overflow-y-auto">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg text-xs font-semibold shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {skillsList.length === 0 && (
                <span className="text-xs text-slate-400 italic">No skills listed yet. Add competencies above.</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-200 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Engine...' : 'Save & Recalculate Roadmap'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
