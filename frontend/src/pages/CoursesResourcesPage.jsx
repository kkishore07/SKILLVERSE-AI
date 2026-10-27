import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ExternalLink, 
  Sparkles, 
  Star, 
  Clock, 
  Play, 
  Layers, 
  Code, 
  FileText,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import YoutubeIcon from '../components/YoutubeIcon';
import { learningService, skillsService } from '../services/api';
import { formatRupeesCompact } from '../utils/currency';
import SkillResourceModal from '../components/SkillResourceModal';


export default function CoursesResourcesPage() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSkillModal, setActiveSkillModal] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [resList, catList] = await Promise.all([
          learningService.getAllResources(),
          skillsService.getCategories()
        ]);
        setResources(resList || []);
        setCategories(['All', ...(catList || [])]);
      } catch (err) {
        console.error('Failed to load learning catalog', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredResources = resources.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      item.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Learning Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-400" />
            <span>Courses, Video Masterclasses & Study Materials</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Curated repository of free and certified courses, high-yield YouTube tutorials, official cheat sheets, and capstone project architectures for all 45 platform technologies.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill, library, or framework (e.g. PyTorch, Docker, MLOps, SQL)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-200">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Loading comprehensive learning materials...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const topVideo = res.youtube_videos?.[0];
            const topCourse = res.courses?.[0];

            return (
              <div
                key={res.skill_name}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                        {res.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {res.skill_name}
                      </h3>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      res.demand_tier === 'High' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {res.demand_tier} Demand
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    Avg Base: <strong className="text-slate-700">{formatRupeesCompact(res.average_salary)}</strong>
                  </div>

                  {/* YouTube Snippet */}
                  {topVideo && (
                    <div className="p-3 rounded-xl bg-red-50/60 border border-red-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-900">
                        <YoutubeIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{topVideo.channel}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">
                        {topVideo.title}
                      </p>
                      <div className="text-[10px] text-slate-400">
                        Duration: {topVideo.duration} • {topVideo.views}
                      </div>
                    </div>
                  )}

                  {/* Course Snippet */}
                  {topCourse && (
                    <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-900 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{topCourse.platform}</span>
                        </span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {topCourse.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">
                        {topCourse.title}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer Button */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {res.youtube_videos?.length || 0} Videos • {res.courses?.length || 0} Courses
                  </span>

                  <button
                    onClick={() => setActiveSkillModal(res.skill_name)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>View All Resources</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resource Modal */}
      <SkillResourceModal
        skillName={activeSkillModal}
        isOpen={Boolean(activeSkillModal)}
        onClose={() => setActiveSkillModal(null)}
      />
    </div>
  );
}
