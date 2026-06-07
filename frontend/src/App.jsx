import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import DiseaseDetection from './DiseaseDetection';
import SoilAdvisor from './SoilAdvisor';
import WeatherDashboard from './WeatherDashboard';
import MarketIntelligence from './MarketIntelligence';
import Community from './Community';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const HomeRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user ? '/app' : '/login'} replace />;
};

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/app" replace />;
  return children;
};

const Dashboard = () => {
  const [currentModule, setCurrentModule] = useState('soil');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative">
      {/* Premium User Profile & Logout Widget */}
      <div className="fixed top-3 right-4 z-[100] flex items-center gap-2.5 bg-white/80 backdrop-blur-md border border-moss/10 pl-2 pr-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
        <div className="w-7 h-7 rounded-full bg-forest text-mint flex items-center justify-center font-bold text-xs uppercase shadow-inner">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <span className="text-xs font-bold text-forest hidden sm:inline">
          {user?.name}
        </span>
        <span className="h-4 w-[1px] bg-moss/20 hidden sm:inline"></span>
        <button
          onClick={handleLogout}
          className="text-[11px] font-extrabold text-sage hover:text-danger uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span className="hidden xs:inline">Logout</span>
        </button>
      </div>

      {currentModule === 'disease' && <DiseaseDetection onModuleSwitch={setCurrentModule} />}
      {currentModule === 'soil' && <SoilAdvisor onModuleSwitch={setCurrentModule} />}
      {currentModule === 'weather' && <WeatherDashboard onModuleSwitch={setCurrentModule} />}
      {currentModule === 'market' && <MarketIntelligence onModuleSwitch={setCurrentModule} />}
      {currentModule === 'community' && <Community onModuleSwitch={setCurrentModule} />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
