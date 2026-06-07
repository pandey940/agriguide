import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import DiseaseDetection from './DiseaseDetection';
import SoilAdvisor from './SoilAdvisor';
import WeatherDashboard from './WeatherDashboard';
import MarketIntelligence from './MarketIntelligence';
import Community from './Community';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboard component that holds the existing app structure
const Dashboard = () => {
  const [currentModule, setCurrentModule] = useState('soil');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
