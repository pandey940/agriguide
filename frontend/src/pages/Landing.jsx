import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen bg-cream font-sans text-ink selection:bg-mint/30 flex flex-col bg-grain">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-moss/10 px-6 md:px-12 py-5 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="text-3xl font-bold font-serif text-night">
            Agri<span className="text-gold italic">Guide</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-moss/20 mx-2" />
          <span className="hidden sm:inline-block bg-moss text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-widest">
            v2.0 Beta
          </span>
        </motion.div>

        <nav className="flex items-center gap-6">
          <Link 
            to="/login" 
            className="text-forest font-bold text-sm hover:text-sage transition-all hover:scale-105"
          >
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className="bg-forest text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-forest/20 hover:bg-canopy hover:scale-105 transition-all"
          >
            Join the Platform
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 px-6 md:px-12 py-16 md:py-24 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-7xl bg-night rounded-[3rem] overflow-hidden relative min-h-[600px] flex flex-col shadow-[0_50px_100px_-20px_rgba(8,15,5,0.3)]"
        >
          {/* Advanced Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_80%_30%,rgba(75,168,78,0.2)_0%,transparent_60%),radial-gradient(ellipse_40%_50%_at_20%_80%,rgba(240,168,32,0.15)_0%,transparent_55%),linear-gradient(145deg,#080F05_0%,#0D2610_50%,#111A08_100%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
          
          {/* Header Badge */}
          <div className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 px-10 py-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-mint uppercase tracking-[0.2em]">Platform Live</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-[11px] text-white/40 font-medium tracking-wide">Accelerating Sustainable Agriculture</span>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 p-10 md:p-20 flex flex-col flex-1 justify-center items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-sage/10 rounded-full border border-sage/20 mb-8"
            >
              <span className="text-[11px] font-black text-mint uppercase tracking-widest">Next-Gen Agronomy</span>
              <div className="w-8 h-[1px] bg-sage/50" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-serif text-6xl md:text-8xl font-bold text-white leading-[1.1] mb-8 max-w-4xl"
            >
              Unified <span className="text-mint">Smart</span> <br />
              <span className="text-gold italic">Farmer</span> Platform
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 text-xl md:text-2xl max-w-2xl leading-relaxed mb-12 font-medium"
            >
              The digital heartbeat of your farm. Integrating AI-powered disease diagnosis and real-time soil intelligence into one seamless ecosystem.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6"
            >
              <Link to="/signup" className="group relative bg-mint text-night px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(124,207,127,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(124,207,127,0.5)] transition-all transform hover:-translate-y-1">
                Start Free Trial
                <span className="absolute inset-0 rounded-2xl bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </Link>
              <Link to="/login" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest backdrop-blur-xl transition-all border-white/20">
                Explore Demo
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="w-full max-w-7xl mt-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-forest mb-6">Built for the Modern Field</h2>
            <p className="text-stone text-xl max-w-2xl mx-auto leading-relaxed font-medium">Precision tools designed to increase yield while reducing environmental impact.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon="psychology"
              tag="AI Powered"
              tagClass="bg-mint/10 text-moss border border-mint/20"
              title="Disease Detection"
              desc="Snap a photo of any leaf. Our neural networks diagnose 40+ crop diseases in under 3 seconds."
              delay={0.1}
            />
            <FeatureCard 
              icon="science"
              tag="Real-Time"
              tagClass="bg-gold/10 text-amber border border-gold/20"
              title="Soil Advisory"
              desc="Unified insights on NPK, pH, and organic matter with tailored fertilizer action plans."
              delay={0.2}
            />
            <FeatureCard 
              icon="monitoring"
              tag="Unified"
              tagClass="bg-sky/10 text-sky border border-sky/20"
              title="Predictive Dashboard"
              desc="Monitor local weather patterns and disease risk levels for your specific micro-climate."
              delay={0.3}
            />
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-night text-white/40 py-20 px-6 md:px-12 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="text-2xl font-serif font-bold text-white mb-6">
              Agri<span className="text-gold italic">Guide</span>
            </div>
            <p className="max-w-sm leading-relaxed text-sm">
              Empowering global agriculture through accessible, intelligent technology. Join 50,000+ farmers making data-driven decisions.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">Modules</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/app" className="hover:text-mint transition-colors">Disease Engine</Link></li>
              <li><Link to="/app" className="hover:text-mint transition-colors">Soil Analyst</Link></li>
              <li><Link to="/app" className="hover:text-mint transition-colors">Market Intel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-mint transition-colors">Our Vision</a></li>
              <li><a href="#" className="hover:text-mint transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-mint transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest">© 2026 AgriGuide Intelligent Systems. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined hover:text-white cursor-pointer transition-colors">language</span>
            <span className="material-symbols-outlined hover:text-white cursor-pointer transition-colors">share</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, tag, tagClass, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white border border-moss/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 h-full"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-foam rounded-bl-[5rem] group-hover:bg-mint/5 transition-colors duration-500" />
    <span className="material-symbols-outlined text-5xl text-forest mb-8 group-hover:scale-110 group-hover:text-sage transition-all duration-500" style={{ fontVariationSettings: "'wght' 300" }}>{icon}</span>
    <div className="mb-4">
      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-[0.1em] ${tagClass}`}>{tag}</span>
    </div>
    <h3 className="text-2xl font-serif font-bold text-forest mb-4">{title}</h3>
    <p className="text-stone leading-relaxed font-medium">{desc}</p>
    <div className="mt-8 flex items-center gap-2 text-forest font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
    </div>
  </motion.div>
);

export default Landing;
