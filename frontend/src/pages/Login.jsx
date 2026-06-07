import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      login(response.user, response.token);
      const redirectTo = location.state?.from?.pathname || '/app';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cream text-ink font-sans selection:bg-mint/30 overflow-hidden">
      {/* Left side - Stunning Visual Context */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1200" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Lush green agriculture field at sunrise"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night/60 via-night/20 to-transparent" />
        
        {/* Glassmorphism Content Card */}
        <div className="relative z-10 flex flex-col justify-between p-16 h-full w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/" className="text-4xl font-serif font-bold text-white flex items-center gap-2 drop-shadow-lg">
              Agri<span className="text-gold italic">Guide</span>
            </Link>
            <div className="mt-2 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-[10px] font-bold text-mint uppercase tracking-widest">
              Unified Platform v2.0
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl"
          >
            <span className="material-symbols-outlined text-gold text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
            <p className="text-white text-2xl font-serif leading-relaxed italic mb-6">
              "Technology is the new fertilizer. AgriGuide helps us see what our eyes miss, ensuring a healthier harvest for the next generation."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sage/30 border border-white/20 flex items-center justify-center text-white font-bold">RK</div>
              <div>
                <p className="text-white font-bold">Rajesh Kumar</p>
                <p className="text-white/60 text-xs">Progressive Farmer, Haryana</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form Container */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 md:p-12 relative bg-cream">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2D7A30_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Header */}
          <div className="lg:hidden mb-12 flex flex-col items-center">
            <Link to="/" className="text-3xl font-serif font-bold text-forest mb-2">
              Agri<span className="text-gold italic">Guide</span>
            </Link>
            <div className="h-1 w-12 bg-sage rounded-full" />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-serif font-bold text-forest mb-3">Welcome Back</h1>
            <p className="text-stone font-medium">Continue your journey towards smart agriculture.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 rounded-2xl bg-danger/5 border border-danger/10 text-danger text-sm flex items-center gap-3 font-medium"
              >
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-forest uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone group-focus-within:text-sage transition-colors">mail</span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-moss/15 rounded-2xl pl-12 pr-4 py-4 text-ink focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/5 transition-all shadow-sm placeholder:text-stone/40"
                  placeholder="farmer@agriguide.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-forest uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-bold text-sage hover:text-fern transition-colors uppercase tracking-widest">Forgot Password?</a>
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone group-focus-within:text-sage transition-colors">lock</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-moss/15 rounded-2xl pl-12 pr-12 py-4 text-ink focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/5 transition-all shadow-sm placeholder:text-stone/40"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone hover:text-sage transition-colors"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-1">
              <input type="checkbox" id="remember" className="w-4 h-4 accent-sage rounded" />
              <label htmlFor="remember" className="text-sm text-stone font-medium cursor-pointer">Remember me for 30 days</label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-forest/20 hover:bg-canopy hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Dashboard
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-stone font-medium">
              New to AgriGuide?{' '}
              <Link to="/signup" className="text-sage font-bold hover:text-fern hover:underline transition-all">
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Floating bottom info */}
        <div className="absolute bottom-8 text-[10px] text-stone/40 font-bold uppercase tracking-widest">
          © 2026 AgriGuide Intelligent Systems
        </div>
      </div>
    </div>
  );
};

export default Login;
