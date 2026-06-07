import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './api/config';

const soilCropMapping = [
  {
    type: 'Alluvial Soil',
    description: 'Rich in potash but poor in phosphorus. Most fertile and widely distributed soil.',
    crops: ['Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Jute', 'Oilseeds'],
    color: 'from-[#DEB887] to-[#F5DEB3]',
    icon: 'water_drop'
  },
  {
    type: 'Black Soil (Regur)',
    description: 'High water retaining capacity. Rich in calcium, potassium, and magnesium.',
    crops: ['Cotton', 'Soybean', 'Wheat', 'Jowar', 'Linseed', 'Tobacco'],
    color: 'from-[#2A1506] to-[#5C2E0A]',
    icon: 'grass'
  },
  {
    type: 'Red & Yellow Soil',
    description: 'Rich in iron content but deficient in nitrogen, phosphorus, and humus.',
    crops: ['Groundnut', 'Potato', 'Maize', 'Millets', 'Ragi', 'Pulses'],
    color: 'from-[#8B4513] to-[#CD853F]',
    icon: 'landscape'
  },
  {
    type: 'Laterite Soil',
    description: 'Formed under conditions of high temperature and heavy rainfall.',
    crops: ['Tea', 'Coffee', 'Rubber', 'Coconut', 'Cashew', 'Tapioca'],
    color: 'from-[#8B0000] to-[#A52A2A]',
    icon: 'local_florist'
  },
  {
    type: 'Arid/Desert Soil',
    description: 'Sandy texture and saline in nature. Lacks moisture and humus.',
    crops: ['Barley', 'Millet', 'Maize', 'Pulses', 'Guar', 'Fodder'],
    color: 'from-[#F4A460] to-[#D2B48C]',
    icon: 'wb_sunny'
  },
  {
    type: 'Mountain/Forest Soil',
    description: 'Rich in humus but deficient in potash, phosphorus, and lime.',
    crops: ['Tea', 'Coffee', 'Spices', 'Fruits', 'Apples', 'Maize'],
    color: 'from-[#1B4D3E] to-[#2E8B57]',
    icon: 'park'
  }
];

const SoilAdvisor = ({ onModuleSwitch }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [soilData, setSoilData] = useState({
    n: 280,
    p: 18,
    k: 220,
    ph: 6.8,
    ec: 0.4,
    soilType: 'Loamy',
    state: 'Maharashtra',
    district: 'Pune'
  });

  const [recommendations, setRecommendations] = useState([
    { cropName: 'Wheat', suitability: 92, season: 'Rabi', sowWindow: 'Nov - Dec', image: '/images/wheat.png' },
    { cropName: 'Rice', suitability: 88, season: 'Kharif', sowWindow: 'Jun - Jul', image: '/images/rice.png' },
    { cropName: 'Cotton', suitability: 85, season: 'Kharif', sowWindow: 'May - Jun', image: '/images/cotton.png' },
    { cropName: 'Maize', suitability: 82, season: 'Kharif', sowWindow: 'Jun - Jul', image: '/images/maize.png' },
    { cropName: 'Soybean', suitability: 78, season: 'Kharif', sowWindow: 'Jun - Jul', image: '/images/soybean.png' },
  ]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/soil/history`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleOcrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOcrLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/soil/ocr-extract`, {
        method: 'POST'
      });
      const extractedData = await res.json();
      setSoilData({ ...soilData, ...extractedData });
    } catch (err) {
      console.error("OCR Extraction failed:", err);
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        n: Number(soilData.n),
        p: Number(soilData.p),
        k: Number(soilData.k),
        ph: Number(soilData.ph),
        ec: Number(soilData.ec),
        soilType: soilData.soilType,
        location: { state: soilData.state, district: soilData.district }
      };
      const res = await fetch(`${API_BASE_URL}/soil/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setRecommendations(data.recommendations || recommendations);
      fetchHistory();
      setActiveTab('recommendations');
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const nutrientStatus = (val, type) => {
    const v = Number(val);
    if (type === 'n') return v > 280 ? 'High' : v < 200 ? 'Low' : 'Optimal';
    if (type === 'p') return v > 22 ? 'High' : v < 10 ? 'Low' : 'Optimal';
    if (type === 'k') return v > 280 ? 'High' : v < 110 ? 'Low' : 'Optimal';
    return 'Optimal';
  };

  const nutrientPercent = (val, type) => {
    const v = Number(val);
    if (type === 'n') return Math.min(100, Math.round((v / 560) * 100));
    if (type === 'p') return Math.min(100, Math.round((v / 25) * 100));
    if (type === 'k') return Math.min(100, Math.round((v / 280) * 100));
    return 50;
  };

  const cropImages = {
    'Wheat': '/images/wheat.png',
    'Rice': '/images/rice.png',
    'Cotton': '/images/cotton.png',
    'Maize': '/images/maize.png',
    'Soybean': '/images/soybean.png'
  };

  return (
    <div className="flex min-h-screen bg-cream font-sans">
      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-moss/10 px-4 h-14 flex items-center justify-between">
        <span className="font-serif text-xl font-bold text-forest">Agri<span className="text-gold italic">Guide</span></span>
        <div className="flex items-center gap-3 pr-28">
          <span className="text-[9px] font-mono font-bold bg-moss text-white px-2 py-0.5 rounded-full uppercase">v2.0</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[290px] bg-night fixed top-0 left-0 h-full overflow-y-auto z-20 border-r border-sage/15 flex-col">
        <div className="p-8 border-b border-white/5 relative">
          <div className="font-serif text-2xl font-bold text-white">Agri<span className="text-gold italic">Guide</span></div>
          <div className="text-[10px] text-white/30 uppercase tracking-[1.5px] mt-1">Unified Smart Farming</div>
        </div>

        <div className="p-4 pt-6">
          <div className="text-[9px] font-bold text-white/20 uppercase tracking-[2px] px-2 mb-2">Modules</div>
          <button onClick={() => onModuleSwitch?.('weather')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-1 text-white/50 hover:bg-white/5">
            <span className="material-symbols-outlined text-base">cloud</span> Weather Updates
          </button>
          <button onClick={() => onModuleSwitch?.('disease')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-1 text-white/50 hover:bg-white/5">
            <span className="material-symbols-outlined text-base">psychology</span> Disease Detection
          </button>
          <button onClick={() => onModuleSwitch?.('market')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-1 text-white/50 hover:bg-white/5">
            <span className="material-symbols-outlined text-base">trending_up</span> Market Intelligence
          </button>
          <button onClick={() => onModuleSwitch?.('community')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-1 text-white/50 hover:bg-white/5">
            <span className="material-symbols-outlined text-base">forum</span> Community
          </button>
          <div className="text-[9px] font-bold text-white/20 uppercase tracking-[2px] px-2 mb-2 mt-4">Soil Advisory</div>
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-1 ${activeTab === 'overview' ? 'bg-sage/15 text-mint border-l-2 border-mint' : 'text-white/50 hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined text-base">dashboard</span> Overview
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-1 ${activeTab === 'analysis' ? 'bg-sage/15 text-mint border-l-2 border-mint' : 'text-white/50 hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined text-base">science</span> Soil Analysis
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-1 ${activeTab === 'recommendations' ? 'bg-sage/15 text-mint border-l-2 border-mint' : 'text-white/50 hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined text-base">psychology</span> Crop Engine
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-1 ${activeTab === 'dictionary' ? 'bg-sage/15 text-mint border-l-2 border-mint' : 'text-white/50 hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined text-base">menu_book</span> Soil Dictionary
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-1 ${activeTab === 'history' ? 'bg-sage/15 text-mint border-l-2 border-mint' : 'text-white/50 hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined text-base">history</span> History
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-[290px] flex-1 pt-14 md:pt-0 pb-20 md:pb-0">
        {/* Top Bar (Desktop) */}
        <header className="hidden md:flex sticky top-0 bg-cream/95 backdrop-blur-xl border-b border-moss/10 px-6 lg:px-12 h-[60px] items-center justify-between z-10">
          <div className="text-xs text-stone flex items-center gap-2">
            AgriGuide <span className="text-fog">›</span> <b className="text-moss">Soil Advisory Module</b>
          </div>
          <div className="flex items-center gap-3 pr-40">
            <span className="text-[10px] font-mono font-bold bg-moss text-white px-3 py-1 rounded-full uppercase">v2.0 Beta</span>
            <button className="text-xs font-bold text-moss border border-moss/25 px-4 py-1.5 rounded-lg hover:bg-mist transition-all flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">download</span> Export PDF
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 max-w-[1200px] mx-auto">
          {activeTab === 'analysis' ? (
            <div className="bg-white rounded-3xl border border-moss/10 p-10 shadow-sm max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-forest mb-6">Analyze Your Soil</h2>
              <div className="mb-8 p-6 bg-foam border-2 border-dashed border-sage/30 rounded-2xl text-center relative overflow-hidden group hover:border-sage transition-colors">
                <input type="file" onChange={handleOcrUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*,.pdf" />
                <div className="flex flex-col items-center gap-3">
                  {ocrLoading ? (
                    <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-sage text-2xl">document_scanner</span>
                      </div>
                      <div>
                        <p className="font-bold text-forest">Upload Soil Report (OCR)</p>
                        <p className="text-xs text-stone mt-1">Drag & drop or click to auto-fill NPK/pH values</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone uppercase">Nitrogen (kg/ha)</label>
                    <input
                      type="number"
                      value={soilData.n}
                      onChange={(e) => setSoilData({ ...soilData, n: e.target.value })}
                      className="w-full bg-foam border border-moss/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone uppercase">Phosphorus (kg/ha)</label>
                    <input
                      type="number"
                      value={soilData.p}
                      onChange={(e) => setSoilData({ ...soilData, p: e.target.value })}
                      className="w-full bg-foam border border-moss/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone uppercase">Potassium (kg/ha)</label>
                    <input
                      type="number"
                      value={soilData.k}
                      onChange={(e) => setSoilData({ ...soilData, k: e.target.value })}
                      className="w-full bg-foam border border-moss/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone uppercase">pH Level</label>
                    <input
                      type="number" step="0.1"
                      value={soilData.ph}
                      onChange={(e) => setSoilData({ ...soilData, ph: e.target.value })}
                      className="w-full bg-foam border border-moss/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-forest text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-forest/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? 'Analyzing...' : (
                    <>
                      <span className="material-symbols-outlined">bolt</span> Run Analysis
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : activeTab === 'history' ? (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-bold text-forest mb-6">Soil Health History</h2>
              <div className="bg-white rounded-3xl border border-moss/10 overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-night text-white text-[10px] font-mono uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">NPK Levels</th>
                      <th className="px-6 py-4">pH</th>
                      <th className="px-6 py-4">Top Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-moss/5">
                    {history.map((report, idx) => (
                      <tr key={idx} className="hover:bg-foam transition-all">
                        <td className="px-6 py-4 text-xs text-stone font-medium">{new Date(report.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <span className="text-[10px] bg-moss/10 text-moss px-2 py-0.5 rounded font-bold">N:{report.n}</span>
                            <span className="text-[10px] bg-clay/10 text-clay px-2 py-0.5 rounded font-bold">P:{report.p}</span>
                            <span className="text-[10px] bg-sky/10 text-sky px-2 py-0.5 rounded font-bold">K:{report.k}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-soil">{report.ph}</td>
                        <td className="px-6 py-4 text-xs font-bold text-forest">{report.recommendations?.[0]?.cropName || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'dictionary' ? (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="font-serif text-3xl font-bold text-forest mb-4">Comprehensive Soil & Crop Guide</h2>
                <p className="text-stone text-lg max-w-2xl">
                  Reference all major soil types and discover which crops are best suited for each environment.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {soilCropMapping.map((soil, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-moss/10 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${soil.color} flex items-center justify-center text-white shadow-inner`}>
                        <span className="material-symbols-outlined">{soil.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-forest text-lg">{soil.type}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-stone leading-relaxed mb-6 min-h-[48px]">
                      {soil.description}
                    </p>
                    <div>
                      <div className="text-[10px] font-bold text-moss uppercase tracking-widest mb-3">Suitable Crops</div>
                      <div className="flex flex-wrap gap-2">
                        {soil.crops.map((crop, cidx) => (
                          <span key={cidx} className="bg-foam text-soil border border-moss/10 px-3 py-1 rounded-full text-xs font-medium">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'recommendations' ? (
            <div className="space-y-12">
              {/* Header Section */}
              <div className="flex flex-col gap-2">
                <h2 className="font-serif text-[42px] font-bold text-forest leading-tight">Your AI Recommendations</h2>
                <p className="text-stone text-lg">Based on your recent soil analysis.</p>
              </div>

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {recommendations.map((crop, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-[2.5rem] overflow-hidden border border-moss/10 shadow-[0_10px_30px_-15px_rgba(30,82,32,0.1)] hover:shadow-[0_20px_40px_-20px_rgba(30,82,32,0.15)] transition-all duration-500 group flex flex-col h-full"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden m-1 rounded-[2.2rem]">
                      <img
                        src={cropImages[crop.cropName] || 'https://images.unsplash.com/photo-1501430654243-c93f8679fc72?auto=format&fit=crop&q=80&w=400'}
                        alt={crop.cropName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-4 py-1.5 text-[11px] font-bold text-forest shadow-sm">
                        {crop.suitability}% Match
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-7 pt-5 flex flex-col flex-1">
                      <h4 className="font-bold text-forest text-2xl mb-3">{crop.cropName}</h4>

                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-6">
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider ${crop.season === 'Rabi' ? 'bg-[#EBF5FF] text-[#1D6FA4]' : 'bg-[#F0FDF4] text-[#166534]'
                          }`}>
                          {crop.season}
                        </span>
                        <span className="text-[10px] font-extrabold bg-[#FFF7E6] text-[#C05621] px-3 py-1 rounded-md uppercase tracking-wider">
                          High Yield
                        </span>
                      </div>

                      {/* Info Row */}
                      <div className="text-[13px] text-stone font-medium flex items-center gap-2.5 mb-8">
                        <span className="material-symbols-outlined text-lg text-stone/60">calendar_today</span>
                        Sow: {crop.sowWindow}
                      </div>

                      {/* CTA Button */}
                      <button className="w-full mt-auto bg-transparent text-forest border-[1.5px] border-moss/20 py-3.5 rounded-2xl text-[13px] font-bold hover:bg-forest hover:text-white hover:border-forest transition-all duration-300 shadow-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Header Section */}
              <div className="mb-10">
                <div className="flex items-center gap-2 text-sage font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span className="w-8 h-[1px] bg-sage/50"></span> New Module
                </div>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest mb-4">Soil Advisory Engine</h1>
                <p className="text-stone text-lg max-w-2xl">
                  Get data-driven crop recommendations based on your soil test report. Optimize your yield with scientific precision.
                </p>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Input & Nutrient Card */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-moss/10 p-4 md:p-8 shadow-sm order-1">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-serif text-2xl font-bold text-forest flex items-center gap-2">
                      <span className="material-symbols-outlined text-sage">analytics</span> Nutrient Profile
                    </h3>
                    <button
                      onClick={() => setActiveTab('analysis')}
                      className="text-xs font-bold text-mint bg-forest px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-forest/20"
                    >
                      <span className="material-symbols-outlined text-base">edit</span> Update Data
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Nitrogen */}
                    <div className="bg-foam p-5 rounded-2xl border border-moss/5">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm font-bold text-soil flex items-center gap-2">
                          Nitrogen (N) <span className="text-[10px] font-normal text-stone tracking-wide">PRIMARY MACRO</span>
                        </div>
                        <div className="font-mono text-sm font-medium text-soil">{soilData.n} kg/ha</div>
                      </div>
                      <div className="h-2 w-full bg-slate/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-moss to-sage rounded-full transition-all duration-500" style={{ width: `${nutrientPercent(soilData.n, 'n')}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-stone uppercase font-bold">{nutrientStatus(soilData.n, 'n')}</span>
                        <span className="text-[10px] text-stone font-mono">Target: 280-560 kg/ha</span>
                      </div>
                    </div>

                    {/* Phosphorus */}
                    <div className="bg-foam p-5 rounded-2xl border border-moss/5">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm font-bold text-soil flex items-center gap-2">
                          Phosphorus (P) <span className="text-[10px] font-normal text-stone tracking-wide">ROOT GROWTH</span>
                        </div>
                        <div className="font-mono text-sm font-medium text-soil">{soilData.p} kg/ha</div>
                      </div>
                      <div className="h-2 w-full bg-slate/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-clay to-tan rounded-full transition-all duration-500" style={{ width: `${nutrientPercent(soilData.p, 'p')}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-stone uppercase font-bold">{nutrientStatus(soilData.p, 'p')}</span>
                        <span className="text-[10px] text-stone font-mono">Target: 10-25 kg/ha</span>
                      </div>
                    </div>

                    {/* Potassium */}
                    <div className="bg-foam p-5 rounded-2xl border border-moss/5">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm font-bold text-soil flex items-center gap-2">
                          Potassium (K) <span className="text-[10px] font-normal text-stone tracking-wide">RESISTANCE</span>
                        </div>
                        <div className="font-mono text-sm font-medium text-soil">{soilData.k} kg/ha</div>
                      </div>
                      <div className="h-2 w-full bg-slate/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sky to-[#6BAED6] rounded-full transition-all duration-500" style={{ width: `${nutrientPercent(soilData.k, 'k')}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-stone uppercase font-bold">{nutrientStatus(soilData.k, 'k')}</span>
                        <span className="text-[10px] text-stone font-mono">Target: 110-280 kg/ha</span>
                      </div>
                    </div>

                    {/* pH and EC */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-parchment p-5 rounded-2xl border border-amber/10">
                        <div className="text-xs font-bold text-clay uppercase mb-2">pH Level</div>
                        <div className="text-3xl font-serif font-bold text-soil">{soilData.ph}</div>
                        <div className="text-[10px] text-amber font-bold mt-1 uppercase tracking-wide">Slightly Acidic</div>
                      </div>
                      <div className="bg-mist p-5 rounded-2xl border border-sage/10">
                        <div className="text-xs font-bold text-moss uppercase mb-2">Conductivity</div>
                        <div className="text-3xl font-serif font-bold text-forest">{soilData.ec} <span className="text-sm font-sans font-normal opacity-50">dS/m</span></div>
                        <div className="text-[10px] text-sage font-bold mt-1 uppercase tracking-wide">Normal Salinity</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side Sidebar - Stats & Soil Info */}
                <div className="lg:col-span-4 flex flex-col gap-6 order-2">
                  <div className="bg-night rounded-3xl p-6 text-white overflow-hidden relative group">
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-all"></div>
                    <div className="relative z-10">
                      <div className="text-[10px] font-bold text-mint uppercase tracking-widest mb-4">Detected Soil Type</div>
                      <div className="text-4xl font-serif font-bold mb-2">Loamy Soil</div>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Ideal balance of sand, silt, and clay. Best all-purpose soil that supports wide variety of cereals and vegetables.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        <span className="text-[9px] bg-white/10 px-3 py-1 rounded-full uppercase font-bold tracking-wider">High Fertility</span>
                        <span className="text-[9px] bg-white/10 px-3 py-1 rounded-full uppercase font-bold tracking-wider">Well Drained</span>
                      </div>
                    </div>
                  </div>

                  {/* Seasonal Info */}
                  <div className="bg-white rounded-3xl border border-moss/10 p-6">
                    <h4 className="text-sm font-bold text-forest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber">calendar_month</span> Seasonal Window
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-moss flex items-center justify-center text-white font-mono text-xs font-bold">K</div>
                        <div>
                          <div className="text-xs font-bold text-forest">Kharif Season</div>
                          <div className="text-[10px] text-stone">Jun - Oct (Monsoon)</div>
                        </div>
                        <div className="ml-auto text-[9px] font-bold text-sage bg-sage/10 px-2 py-0.5 rounded uppercase">Current</div>
                      </div>
                      <div className="flex items-center gap-3 opacity-40">
                        <div className="w-10 h-10 rounded-xl bg-sky flex items-center justify-center text-white font-mono text-xs font-bold">R</div>
                        <div>
                          <div className="text-xs font-bold text-forest">Rabi Season</div>
                          <div className="text-[10px] text-stone">Nov - Mar (Winter)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amendment Box */}
                  <div className="bg-amber/5 rounded-3xl border border-amber/20 p-6 border-l-8 border-l-amber">
                    <h4 className="text-sm font-bold text-clay mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber">error</span> Deficiency Alert
                    </h4>
                    <p className="text-xs text-clay/70 leading-relaxed mb-4">
                      Low Phosphorus detected. This may inhibit root development in the early stages of growth.
                    </p>
                    <div className="bg-white/50 p-3 rounded-xl">
                      <div className="text-[10px] font-bold text-clay uppercase mb-1">Recommended Fix</div>
                      <div className="text-xs font-medium text-soil">Apply 15kg Single Super Phosphate per acre.</div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Row */}
                <div className="lg:col-span-12 order-3">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-forest">Top Recommended Crops</h3>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-stone px-3 py-1 rounded-full border border-stone/20">Region: {soilData.state}</span>
                      <span className="text-[10px] font-bold text-stone px-3 py-1 rounded-full border border-stone/20">Season: Kharif</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {recommendations.map((crop, idx) => (
                      <div key={idx} className="bg-white rounded-[2rem] overflow-hidden border border-moss/10 group hover:shadow-xl hover:shadow-moss/10 transition-all cursor-pointer">
                        <div className="relative h-32 overflow-hidden">
                          <img src={cropImages[crop.cropName] || 'https://images.unsplash.com/photo-1501430654243-c93f8679fc72?auto=format&fit=crop&q=80&w=200'} alt={crop.cropName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-bold text-forest">
                            {crop.suitability}% Match
                          </div>
                        </div>
                        <div className="p-5">
                          <h4 className="font-bold text-forest text-lg mb-1">{crop.cropName}</h4>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${crop.season === 'Kharif' ? 'bg-moss/10 text-moss' : 'bg-sky/10 text-sky'}`}>
                              {crop.season}
                            </span>
                            <span className="text-[9px] font-bold bg-gold/10 text-amber px-2 py-0.5 rounded uppercase">High Yield</span>
                          </div>
                          <div className="text-[10px] text-stone flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span> Sow: {crop.sowWindow}
                          </div>
                          <button className="w-full mt-4 bg-cream text-forest border border-moss/20 py-2 rounded-xl text-xs font-bold hover:bg-forest hover:text-white transition-all">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-cream/95 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex justify-around items-center z-50 border-t border-moss/10">
        <button onClick={() => setActiveTab('overview')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'overview' ? 'text-forest' : 'text-stone'}`}>
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span className="text-[9px] font-bold">Overview</span>
        </button>
        <button onClick={() => setActiveTab('analysis')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'analysis' ? 'text-forest' : 'text-stone'}`}>
          <span className="material-symbols-outlined text-xl">science</span>
          <span className="text-[9px] font-bold">Analyze</span>
        </button>
        <button onClick={() => setActiveTab('recommendations')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'recommendations' ? 'text-forest' : 'text-stone'}`}>
          <span className="material-symbols-outlined text-xl">psychology</span>
          <span className="text-[9px] font-bold">Crops</span>
        </button>
        <button onClick={() => setActiveTab('dictionary')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'dictionary' ? 'text-forest' : 'text-stone'}`}>
          <span className="material-symbols-outlined text-xl">menu_book</span>
          <span className="text-[9px] font-bold">Guide</span>
        </button>
      </nav>
    </div>
  );
};

export default SoilAdvisor;
