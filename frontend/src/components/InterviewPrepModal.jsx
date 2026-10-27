import React, { useState, useEffect } from 'react';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  Code2, 
  Lightbulb, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Filter
} from 'lucide-react';
import { learningService } from '../services/api';

export default function InterviewPrepModal({ role, isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (isOpen && role) {
      loadQuestions();
    }
  }, [isOpen, role]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await learningService.getInterviewPrep(role);
      setData(res);
      if (res.questions && res.questions.length > 0) {
        setExpandedId(res.questions[0].id);
      }
    } catch (err) {
      console.error('Failed to load interview questions', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = ['All', ...new Set((data?.questions || []).map(q => q.category))];
  const filteredQuestions = (data?.questions || []).filter(q => 
    selectedCategory === 'All' ? true : q.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FAANG & Unicorn Technical Interview Drills</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">
            Technical Interview Preparation: {role}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Real questions asked by hiring panels at top tier tech companies, complete with conceptual deep-dives, code snippets, and grading criteria.
          </p>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-2 border-t border-white/10">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-semibold text-slate-500">Synthesizing interview questions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q) => {
                const isExpanded = expandedId === q.id;
                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:border-purple-300 transition-colors"
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                            {q.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                            {q.skill}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            q.difficulty === 'Advanced' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {q.question}
                        </h3>
                      </div>

                      <div className="p-1 rounded-md bg-slate-100 text-slate-500 flex-shrink-0 mt-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-100 text-xs bg-slate-50/40">
                        {/* Model Answer */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                            <span>Recommended Technical Answer:</span>
                          </span>
                          <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                            {q.answer}
                          </p>
                        </div>

                        {/* Code Example if applicable */}
                        {q.code_example && (
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Code Implementation / Demonstration:</span>
                            </span>
                            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto font-mono text-[11px] leading-relaxed">
                              {q.code_example}
                            </pre>
                          </div>
                        )}

                        {/* Interview Tips */}
                        <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-amber-900">
                          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-bold text-[11px] uppercase tracking-wider text-amber-800">
                              What Interviewers Look For:
                            </span>
                            <p className="text-xs text-amber-900/90 leading-relaxed">
                              {q.interview_tips}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredQuestions.length} technical interview scenarios
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Drills
          </button>
        </div>
      </div>
    </div>
  );
}
