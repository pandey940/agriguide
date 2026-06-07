import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE_URL } from './api/config';
import { useAuth } from './context/AuthContext';

const Community = ({ onModuleSwitch }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/community`);
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch community posts:', err);
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
          <a onClick={() => onModuleSwitch?.('weather')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer">
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
          <a className="bg-sage/15 text-mint border-l-2 border-mint px-4 py-3 flex items-center gap-3 font-medium text-sm cursor-pointer">
            <span className="material-symbols-outlined">forum</span> Community
          </a>
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-white/5 pt-6">
          <div className="flex items-center gap-3 px-4 py-4 mt-2">
            <img className="w-10 h-10 rounded-full object-cover border border-white/10" alt="Farmer Portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7hIbptporCZhDJWo_5R64q-Mdz_xd00E6wF_bi-3fb7phofEXbsPlMAs61Dl7JFmOe4pwQaPvEOKn4uCH1MmFs_FJhHMc3oRS-2Cpoi87jrv_tHWTsm38nOsXo_Y0gzp17w028HKT8dIa4qne_aZ6vbq4pzGkoaMuoGauY9SuOsBPfGEskLn4f98LWGxQfk26cwhB7rbqbJ-FOjOAR_vCQs_wkxJSKkLAgY0obFUEPaVtRhVhcWJzHoZ4sP0xdWXt5TLODMBXvMvR" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Farmer User'}</p>
              <p className="text-xs text-white/40 truncate tracking-wide uppercase font-mono">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-72 flex-1 p-6 md:p-12 pb-24 md:pb-12 pt-20 md:pt-12 min-h-screen">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-2">Farmer Community</h2>
            <p className="text-stone max-w-lg leading-relaxed text-lg">Share experiences, ask questions, and get expert advice on farming techniques.</p>
          </motion.div>
          <button className="bg-forest text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-forest/20 flex items-center gap-2 hover:scale-105 transition-all mr-40">
            <span className="material-symbols-outlined">add</span> Create Post
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              {posts.length > 0 ? (
                posts.map(post => (
                  <div key={post._id} className="bg-white rounded-[2rem] p-6 md:p-8 border border-moss/10 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-mist text-moss flex items-center justify-center font-bold">
                          {post.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-forest text-sm">{post.author}</p>
                          <p className="text-[10px] text-stone">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-foam text-stone px-2 py-1 rounded-md uppercase font-bold tracking-wider">{post.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-ink mb-2">{post.title}</h3>
                    <p className="text-stone mb-4 leading-relaxed">{post.content}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 mb-6">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-sage bg-sage/10 px-2 py-1 rounded-full font-bold">#{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between items-center border-t border-moss/5 pt-4">
                      <button className="flex items-center gap-2 text-stone hover:text-sage transition-colors">
                        <span className="material-symbols-outlined text-xl">thumb_up</span>
                        <span className="text-xs font-bold">{post.upvotes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-stone hover:text-forest transition-colors">
                        <span className="material-symbols-outlined text-xl">chat_bubble</span>
                        <span className="text-xs font-bold">{post.replies.length} Replies</span>
                      </button>
                    </div>
                    
                    {/* Replies */}
                    {post.replies.length > 0 && (
                      <div className="mt-6 bg-foam rounded-2xl p-4 flex flex-col gap-4">
                        {post.replies.map((reply, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-sage text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {reply.author.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-sm text-forest">{reply.author}</p>
                                {reply.isExpert && (
                                  <span className="text-[9px] bg-mint text-forest px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[10px]">verified</span> Expert
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-stone">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-moss/10">
                  <span className="material-symbols-outlined text-4xl mb-4 text-sage">forum</span>
                  <p className="text-stone">No posts yet. Be the first to start a discussion!</p>
                </div>
              )}
            </div>

            {/* Post-Harvest Guidelines Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-forest text-white rounded-[2.5rem] p-8 border border-moss/10 shadow-xl sticky top-8">
                <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-gold">inventory_2</span>
                  Post-Harvest Preservation
                </h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  Reduce losses by following expert guidelines for storing your harvested crops.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                    <h4 className="font-bold text-mint mb-1">Onion Storage</h4>
                    <p className="text-xs text-white/70 mb-2">Maintain temperature at 0-2°C with 65-70% humidity. Ensure good ventilation to prevent rot.</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                    <h4 className="font-bold text-mint mb-1">Wheat Storage</h4>
                    <p className="text-xs text-white/70 mb-2">Dry seeds to below 10% moisture before storing in airtight metal or plastic bins. Use neem leaves as natural pesticide.</p>
                  </div>
                </div>
                <button className="w-full mt-6 bg-gold text-forest py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-straw transition-colors">
                  <span className="material-symbols-outlined text-sm">search</span> Locate Cold Storage
                </button>
              </div>
            </div>
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
          <span className="material-symbols-outlined">forum</span>
          <span className="text-[9px] font-bold">Community</span>
        </button>
      </nav>
    </div>
  );
};

export default Community;
