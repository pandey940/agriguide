import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const WeatherDashboard = ({ onModuleSwitch }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await axios.get('/api/weather?lat=18.5204&lon=73.8567');
      setWeatherData(res.data);
    } catch (err) {
      console.error('Failed to fetch weather:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream text-ink font-sans min-h-screen overflow-x-hidden flex">
      {/* Mobile Header */}
      <header className="md:hidden w-full h-16 fixed top-0 z-50 bg-cream/80 backdrop-blur-md flex justify-between items-center px-6 border-b border-moss/10">
        <span className="text-2xl font-serif font-bold text-forest">AgriGuide</span>
      </header>

      {/* SideNavBar Anchor */}
      <aside className="hidden md:flex h-screen w-72 fixed left-0 top-0 bg-night flex-col py-8 px-4 gap-2 z-40 border-r border-sage/15">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-serif text-white font-bold">Agri<span className="text-gold italic">Guide</span></h1>
          <p className="text-[10px] text-white/30 font-medium tracking-widest uppercase">The Digital Agronomist</p>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <a className="bg-sage/15 text-mint border-l-2 border-mint px-4 py-3 flex items-center gap-3 font-medium text-sm cursor-pointer">
            <span className="material-symbols-outlined">cloud</span> Weather Updates
          </a>
          <a onClick={() => onModuleSwitch?.('disease')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer">
            <span className="material-symbols-outlined">psychology</span> Disease Detection
          </a>
          <a onClick={() => onModuleSwitch?.('soil')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer" >
            <span className="material-symbols-outlined">science</span> Soil Advisory
          </a>
          <a onClick={() => onModuleSwitch?.('market')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer">
            <span className="material-symbols-outlined">trending_up</span> Market Intelligence
          </a>
          <a onClick={() => onModuleSwitch?.('community')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer">
            <span className="material-symbols-outlined">forum</span> Community
          </a>
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-white/5 pt-6">
          <div className="flex items-center gap-3 px-4 py-4 mt-2">
            <img className="w-10 h-10 rounded-full object-cover border border-white/10" alt="Farmer Portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7hIbptporCZhDJWo_5R64q-Mdz_xd00E6wF_bi-3fb7phofEXbsPlMAs61Dl7JFmOe4pwQaPvEOKn4uCH1MmFs_FJhHMc3oRS-2Cpoi87jrv_tHWTsm38nOsXo_Y0gzp17w028HKT8dIa4qne_aZ6vbq4pzGkoaMuoGauY9SuOsBPfGEskLn4f98LWGxQfk26cwhB7rbqbJ-FOjOAR_vCQs_wkxJSKkLAgY0obFUEPaVtRhVhcWJzHoZ4sP0xdWXt5TLODMBXvMvR" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Ramesh Kumar</p>
              <p className="text-xs text-white/40 truncate tracking-wide uppercase font-mono">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-72 flex-1 p-6 md:p-12 pb-24 md:pb-12 pt-20 md:pt-12 min-h-screen">
        <header className="mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-2">Weather & Alerts</h2>
            <p className="text-stone max-w-lg leading-relaxed text-lg">Real-time agricultural weather intelligence and crop-specific alerts based on your location.</p>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : weatherData ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Current & Alerts */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Current Weather Card */}
              <div className="bg-gradient-to-br from-forest to-night rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <p className="text-sm font-bold text-mint uppercase tracking-widest mb-1">Today in Pune, MH</p>
                    <h3 className="text-7xl font-serif font-bold mb-4">{weatherData.current.tempMax}°<span className="text-4xl text-white/60">C</span></h3>
                    <p className="text-xl font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined">wb_sunny</span> {weatherData.current.condition}
                    </p>
                  </div>
                  <div className="mt-8 md:mt-0 flex flex-row md:flex-col gap-6 md:gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-mint">water_drop</span>
                      <div>
                        <p className="text-xs text-white/60 uppercase font-bold">Humidity</p>
                        <p className="font-mono text-lg">{weatherData.current.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-mint">rainy</span>
                      <div>
                        <p className="text-xs text-white/60 uppercase font-bold">Rain Chance</p>
                        <p className="font-mono text-lg">{weatherData.current.precipitation}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts Section */}
              <div>
                <h3 className="text-2xl font-serif font-bold text-forest mb-4">Active Farm Alerts</h3>
                {weatherData.alerts.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {weatherData.alerts.map((alert, idx) => (
                      <div key={idx} className={`p-6 rounded-2xl border-l-8 flex items-start gap-4 shadow-sm ${alert.severity === 'Critical' ? 'bg-[#FFF7E6] border-danger' : 'bg-[#EBF5FF] border-sky'}`}>
                        <span className={`material-symbols-outlined text-2xl ${alert.severity === 'Critical' ? 'text-danger' : 'text-sky'}`}>
                          {alert.severity === 'Critical' ? 'warning' : 'info'}
                        </span>
                        <div>
                          <h4 className={`font-bold text-lg mb-1 ${alert.severity === 'Critical' ? 'text-danger' : 'text-sky'}`}>{alert.type}</h4>
                          <p className="text-sm text-stone">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-foam border border-moss/10 rounded-2xl p-6 text-center text-stone font-medium">
                    <span className="material-symbols-outlined text-3xl mb-2 text-sage">check_circle</span>
                    <p>No active weather alerts for your crops today.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: 7 Day Forecast */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[2.5rem] p-8 border border-moss/10 shadow-sm h-full">
                <h3 className="text-2xl font-serif font-bold text-forest mb-6">7-Day Forecast</h3>
                <div className="flex flex-col gap-4">
                  {weatherData.forecast.map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-foam transition-colors cursor-default border border-transparent hover:border-moss/5">
                      <div className="w-16">
                        <p className="font-bold text-forest">{day.day}</p>
                        <p className="text-xs text-stone font-mono">{day.date.substring(5)}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined text-sage">
                          {day.condition === 'Sunny' ? 'wb_sunny' : day.condition === 'Rain' ? 'rainy' : 'cloud'}
                        </span>
                        <span className="text-[10px] text-stone font-medium mt-1">{day.precipitation}% rain</span>
                      </div>
                      <div className="flex items-center gap-3 w-20 justify-end">
                        <span className="font-bold text-forest">{day.tempMax}°</span>
                        <span className="text-stone text-sm">{day.tempMin}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center text-danger">Failed to load weather data.</div>
        )}
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-cream/95 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex justify-around items-center z-50 border-t border-moss/10">
        <button className="flex flex-col items-center gap-0.5 text-forest">
          <span className="material-symbols-outlined">cloud</span>
          <span className="text-[9px] font-bold">Weather</span>
        </button>
        <button onClick={() => onModuleSwitch?.('disease')} className="flex flex-col items-center gap-0.5 text-stone">
          <span className="material-symbols-outlined">psychology</span>
          <span className="text-[9px] font-bold">Detect</span>
        </button>
        <button onClick={() => onModuleSwitch?.('soil')} className="flex flex-col items-center gap-0.5 text-stone">
          <span className="material-symbols-outlined">science</span>
          <span className="text-[9px] font-bold">Soil</span>
        </button>
        <button onClick={() => onModuleSwitch?.('market')} className="flex flex-col items-center gap-0.5 text-stone">
          <span className="material-symbols-outlined">trending_up</span>
          <span className="text-[9px] font-bold">Market</span>
        </button>
      </nav>
    </div>
  );
};

export default WeatherDashboard;
