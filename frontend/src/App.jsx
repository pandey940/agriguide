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
      <div className="fixed top-4 right-4 z-[100] flex items-center gap-3 bg-white/90 backdrop-blur-md border border-moss/10 px-4 py-2 rounded-full shadow-lg">
        <span className="text-sm font-medium text-forest hidden sm:inline">
          {user?.name}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs font-bold text-sage hover:text-fern uppercase tracking-widest transition-colors"
        >
          Logout
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
