import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  FileText, 
  Code, 
  ExternalLink, 
  Star, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers,
  Award,
  ChevronRight,
  Play
} from 'lucide-react';
import YoutubeIcon from './YoutubeIcon';
import { learningService } from '../services/api';
import { formatRupees } from '../utils/currency';



export default function SkillResourceModal({ skillName, isOpen, onClose, onProgressUpdated, currentStatus }) {
  const [activeTab, setActiveTab] = useState('youtube');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus || 'To Learn');
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (isOpen && skillName) {
      loadResources();
      setStatus(currentStatus || 'To Learn');
    }
  }, [isOpen, skillName, currentStatus]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const res = await learningService.getSkillResources(skillName);
      setData(res);
    } catch (err) {
      console.error('Failed to load resources for skill:', skillName, err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setSavingStatus(true);
    try {
      await learningService.updateSkillProgress(skillName, newStatus);
      setStatus(newStatus);
      if (onProgressUpdated) {
        onProgressUpdated(skillName, newStatus);
      }
    } catch (err) {
      console.error('Failed to update progress', err);
    } finally {
      setSavingStatus(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              {data?.category || 'Technical Competency'}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              data?.demand_tier === 'High' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
            }`}>
              {data?.demand_tier || 'High'} Demand
            </span>
            <span className="text-xs text-slate-400">
              Avg Market Value: <strong className="text-white">{formatRupees(data?.average_salary || 150000)}</strong>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
                <span>{skillName}</span>
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Verified courses, YouTube video masterclasses, official guides, and capstone project templates.
              </p>
            </div>

            {/* Quick Status Pill Toggle */}
            <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl border border-white/15">
              {['To Learn', 'In Progress', 'Mastered'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  disabled={savingStatus}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    status === st
                      ? st === 'Mastered'
                        ? 'bg-emerald-500 text-white shadow'
                        : st === 'In Progress'
                        ? 'bg-amber-500 text-white shadow'
                        : 'bg-indigo-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-white/10 pb-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('youtube')}
              className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'youtube'
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <YoutubeIcon className="w-4 h-4" />
              <span>YouTube Video Tutorials ({data?.youtube_videos?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'courses'
                  ? 'border-indigo-400 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Top Online Courses ({data?.courses?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'docs'
                  ? 'border-blue-400 text-blue-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Docs & Cheat Sheets ({data?.documentation?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Capstone Projects ({data?.project_ideas?.length || 0})</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-semibold text-slate-500">Curating verified learning materials...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: YOUTUBE VIDEOS */}
              {activeTab === 'youtube' && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-3">
                    <YoutubeIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-950 uppercase tracking-wider">
                        High-Yield Video Masterclasses
                      </h4>
                      <p className="text-xs text-red-800 mt-0.5">
                        Selected by data science educators for exceptional visual pedagogy, zero fluff, and up-to-date best practices.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {data?.youtube_videos?.map((vid, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl border border-slate-200 p-4 hover:border-red-300 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-md bg-red-100 text-red-600 group-hover:scale-110 transition-transform">
                              <Play className="w-3.5 h-3.5 fill-red-600" />
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                              {vid.title}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">{vid.channel}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {vid.duration}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[11px]">
                              {vid.views}
                            </span>
                          </div>

                          {vid.topics && vid.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {vid.topics.map((t, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <a
                          href={vid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-red-200 flex-shrink-0"
                        >
                          <span>Watch on YouTube</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: COURSES */}
              {activeTab === 'courses' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                        Industry-Accredited Curriculum & Certificates
                      </h4>
                      <p className="text-xs text-indigo-800 mt-0.5">
                        Deep conceptual tracks from Stanford, Harvard, Coursera, and top industry practitioners.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {data?.courses?.map((course, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{course.rating}</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {course.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500">
                            <span className="font-semibold text-indigo-600">{course.platform}</span>
                            <span>•</span>
                            <span>Instructor: <strong>{course.instructor}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {course.duration}
                            </span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                              course.is_free ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {course.is_free ? 'Free Audit Available' : 'Paid / Certificate'}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-medium">
                            Level: <strong>{course.level}</strong>
                          </span>
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-200"
                          >
                            <span>Enroll / Explore Course</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DOCUMENTATION & CHEAT SHEETS */}
              {activeTab === 'docs' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                        Official Docs & Rapid Syntax Reference
                      </h4>
                      <p className="text-xs text-blue-800 mt-0.5">
                        Bookmark these authoritative references for day-to-day coding, syntax lookups, and API contracts.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data?.documentation?.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                            {doc.type}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-1">
                            {doc.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Published by: {doc.provider}
                          </p>
                        </div>

                        <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                          <span>Open Resource</span>
                          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CAPSTONE PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
                    <Code className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                        Resume-Ready Capstone Project Architecture
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Employers evaluate practical engineering execution. Implement this deliverable to validate your competency on GitHub.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {data?.project_ideas?.map((proj, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-slate-900">
                            {proj.title}
                          </h3>
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                            {proj.difficulty}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="bg-slate-50 p-3 rounded-lg space-y-1.5 border border-slate-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Key Deliverables:
                          </span>
                          <ul className="space-y-1">
                            {proj.deliverables?.map((del, dIdx) => (
                              <li key={dIdx} className="text-xs text-slate-700 flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span>{del}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          <span className="text-xs text-slate-400 font-medium mr-1">Stack:</span>
                          {proj.tech_stack?.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md text-xs font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Status:</span>
            <span className={`font-bold ${
              status === 'Mastered' ? 'text-emerald-600' : status === 'In Progress' ? 'text-amber-600' : 'text-slate-600'
            }`}>
              {status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
