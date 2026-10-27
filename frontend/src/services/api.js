import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillverse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.access_token) {
      localStorage.setItem('skillverse_token', res.data.access_token);
      localStorage.setItem('skillverse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data?.access_token) {
      localStorage.setItem('skillverse_token', res.data.access_token);
      localStorage.setItem('skillverse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/users/profile', data);
    if (res.data) {
      localStorage.setItem('skillverse_user', JSON.stringify(res.data));
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('skillverse_token');
    localStorage.removeItem('skillverse_user');
  },
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('skillverse_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
};


export const analyticsService = {
  getOverview: async () => {
    const res = await api.get('/analytics/overview');
    return res.data;
  },
  getIndustry: async () => {
    const res = await api.get('/analytics/industry');
    return res.data;
  },
  getLocation: async () => {
    const res = await api.get('/analytics/location');
    return res.data;
  },
  getSalaryBySkill: async () => {
    const res = await api.get('/analytics/salary');
    return res.data;
  }
};

export const skillsService = {
  getAll: async (params = {}) => {
    const res = await api.get('/skills', { params });
    return res.data;
  },
  getTop: async (limit = 10) => {
    const res = await api.get('/skills/top', { params: { limit } });
    return res.data;
  },
  getSkillByName: async (name) => {
    const res = await api.get(`/skills/${encodeURIComponent(name)}`);
    return res.data;
  },
  getCategories: async () => {
    const res = await api.get('/skills/categories');
    return res.data?.categories || [];
  }
};

export const forecastService = {
  getSkills: async () => {
    const res = await api.get('/forecast/skills');
    return res.data;
  },
  getForecast: async (skillName) => {
    const res = await api.get(`/forecast/${encodeURIComponent(skillName)}`);
    return res.data;
  },
  getTrending: async () => {
    const res = await api.get('/forecast/trending/all');
    return res.data;
  },
  getEvaluationReport: async () => {
    const res = await api.get('/forecast/metrics/report');
    return res.data;
  }
};

export const recommendationService = {
  getRoles: async () => {
    const res = await api.get('/recommendations/roles');
    return res.data?.roles || [];
  },
  analyzeGap: async (targetRole, currentSkills) => {
    const res = await api.post('/recommendations/gap-analysis', {
      target_role: targetRole,
      current_skills: currentSkills
    });
    return res.data;
  },
  estimateSalary: async (data) => {
    const res = await api.post('/recommendations/salary-estimate', data);
    return res.data;
  }
};

export const jobsService = {
  getJobs: async (params = {}) => {
    const res = await api.get('/jobs', { params });
    return res.data;
  },
  getRoles: async () => {
    const res = await api.get('/jobs/roles');
    return res.data?.roles || [];
  },
  getJobById: async (id) => {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  }
};

export const learningService = {
  getSkillResources: async (skillName) => {
    const res = await api.get(`/learning/resources/${encodeURIComponent(skillName)}`);
    return res.data;
  },
  getAllResources: async (params = {}) => {
    const res = await api.get('/learning/resources', { params });
    return res.data;
  },
  getRoadmap: async (data) => {
    const res = await api.post('/learning/roadmap', data);
    return res.data;
  },
  getInterviewPrep: async (role) => {
    const res = await api.get(`/learning/interview-prep/${encodeURIComponent(role)}`);
    return res.data;
  },
  analyzeATS: async (data) => {
    const res = await api.post('/learning/ats-optimizer', data);
    return res.data;
  },
  updateSkillProgress: async (skillName, status) => {
    const res = await api.put('/users/progress', { skill_name: skillName, status });
    if (res.data) {
      localStorage.setItem('skillverse_user', JSON.stringify(res.data));
    }
    return res.data;
  }
};

export default api;

