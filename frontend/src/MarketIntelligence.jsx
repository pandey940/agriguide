import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE_URL } from './api/config';

const MarketIntelligence = ({ onModuleSwitch }) => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('All');

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/market/prices`);
      setPrices(res.data);
    } catch (err) {
      console.error('Failed to fetch market prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrices = selectedCrop === 'All' ? prices : prices.filter(p => p.commodity === selectedCrop);
  
  // Group by crop to show best mandi
  const grouped = filteredPrices.reduce((acc, curr) => {
    if (!acc[curr.commodity]) acc[curr.commodity] = [];
    acc[curr.commodity].push(curr);
    return acc;
  }, {});

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
          <a onClick={() => onModuleSwitch?.('weather')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer">
            <span className="material-symbols-outlined">cloud</span> Weather Updates
          </a>
          <a onClick={() => onModuleSwitch?.('disease')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer">
            <span className="material-symbols-outlined">psychology</span> Disease Detection
          </a>
          <a onClick={() => onModuleSwitch?.('soil')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer" >
            <span className="material-symbols-outlined">science</span> Soil Advisory
          </a>
          <a className="bg-sage/15 text-mint border-l-2 border-mint px-4 py-3 flex items-center gap-3 font-medium text-sm cursor-pointer">
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
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-2">Market Intelligence</h2>
            <p className="text-stone max-w-lg leading-relaxed text-lg">Real-time mandi prices and market trends to help you sell at the right time.</p>
          </motion.div>
          <div className="flex gap-2 mr-40">
            {['All', 'Wheat', 'Rice', 'Onion', 'Cotton', 'Soybean'].map(c => (
              <button 
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCrop === c ? 'bg-forest text-white' : 'bg-foam text-stone hover:bg-mist'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.keys(grouped).map(crop => {
              const cropPrices = grouped[crop].sort((a,b) => b.price - a.price); // sort highest to lowest
              const highest = cropPrices[0];
              return (
                <div key={crop} className="bg-white rounded-[2rem] border border-moss/10 shadow-sm overflow-hidden">
                  <div className="p-6 md:p-8 flex justify-between items-center bg-foam border-b border-moss/5">
                    <h3 className="text-2xl font-bold text-forest">{crop}</h3>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-stone tracking-widest mb-1">Best Price Found</p>
                      <p className="text-2xl font-serif font-bold text-sage">₹{highest.price} <span className="text-sm font-sans text-stone font-medium">/ Quintal</span></p>
                      <p className="text-xs font-bold text-forest flex items-center justify-end gap-1"><span className="material-symbols-outlined text-sm">location_on</span> {highest.mandi}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <h4 className="text-xs font-bold text-stone uppercase tracking-widest mb-4">Mandi Comparison</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cropPrices.map((p, i) => (
                        <div key={i} className="p-4 rounded-2xl border border-moss/10 flex justify-between items-center hover:shadow-md transition-shadow cursor-default">
                          <div>
                            <p className="font-bold text-forest">{p.mandi}</p>
                            <p className="text-xs text-stone mt-1">Today</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-ink">₹{p.price}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center justify-end gap-1 ${p.trend === 'up' ? 'text-sage bg-sage/10' : 'text-danger bg-danger/10'}`}>
                              <span className="material-symbols-outlined text-[10px]">{p.trend === 'up' ? 'trending_up' : 'trending_down'}</span>
                              {p.trend === 'up' ? '+2.4%' : '-1.2%'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {Object.keys(grouped).length === 0 && (
              <div className="text-center py-20 text-stone">
                <span className="material-symbols-outlined text-4xl mb-4 opacity-50">search_off</span>
                <p>No market data available for this selection.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-cream/95 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex justify-around items-center z-50 border-t border-moss/10">
        <button onClick={() => onModuleSwitch?.('weather')} className="flex flex-col items-center gap-0.5 text-stone">
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
        <button className="flex flex-col items-center gap-0.5 text-forest">
          <span className="material-symbols-outlined">trending_up</span>
          <span className="text-[9px] font-bold">Market</span>
        </button>
      </nav>
    </div>
  );
};

export default MarketIntelligence;
