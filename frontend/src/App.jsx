import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PersonalizedDashboardPage from './pages/PersonalizedDashboardPage';
import RoadmapMindmapPage from './pages/RoadmapMindmapPage';
import CoursesResourcesPage from './pages/CoursesResourcesPage';
import SkillExplorerPage from './pages/SkillExplorerPage';
import CareerAnalysisPage from './pages/CareerAnalysisPage';
import WorkforceTrendsPage from './pages/WorkforceTrendsPage';
import ForecastPage from './pages/ForecastPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/my-dashboard" element={<PersonalizedDashboardPage />} />
            <Route path="/roadmap" element={<RoadmapMindmapPage />} />
            <Route path="/resources" element={<CoursesResourcesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/skills" element={<SkillExplorerPage />} />
            <Route path="/career" element={<CareerAnalysisPage />} />
            <Route path="/workforce-trends" element={<WorkforceTrendsPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

