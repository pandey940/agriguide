import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signupUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await signupUser({ name, email, password });
      login(response.user, response.token);
      navigate('/app');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cream text-ink font-sans selection:bg-mint/30 overflow-hidden">
      {/* Left side - Form Container */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 md:p-12 relative bg-cream">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2D7A30_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Header */}
          <div className="mb-12">
            <Link to="/" className="text-3xl font-serif font-bold text-forest flex items-center gap-2 mb-8">
              Agri<span className="text-gold italic">Guide</span>
            </Link>
            <h1 className="text-4xl font-serif font-bold text-forest mb-3">Create Account</h1>
            <p className="text-stone font-medium">Join the unified platform for the modern farmer.</p>
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

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-forest uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone group-focus-within:text-sage transition-colors">person</span>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-moss/15 rounded-2xl pl-12 pr-4 py-4 text-ink focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/5 transition-all shadow-sm placeholder:text-stone/40"
                  placeholder="Ramesh Kumar"
                  required
                />
              </div>
            </div>

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
              <label className="text-xs font-bold text-forest uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone group-focus-within:text-sage transition-colors">lock</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-moss/15 rounded-2xl pl-12 pr-4 py-4 text-ink focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/5 transition-all shadow-sm placeholder:text-stone/40"
                  placeholder="Create a strong password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-forest uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone group-focus-within:text-sage transition-colors">lock_reset</span>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-moss/15 rounded-2xl pl-12 pr-4 py-4 text-ink focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/5 transition-all shadow-sm placeholder:text-stone/40"
                  placeholder="Re-enter your password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3 ml-1">
              <input type="checkbox" id="terms" className="w-4 h-4 accent-sage rounded mt-0.5" required />
              <label htmlFor="terms" className="text-xs text-stone font-medium leading-relaxed">
                I agree to the <a href="#" className="text-sage font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-sage font-bold hover:underline">Privacy Policy</a>.
              </label>
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
                  Create Account
                  <span className="material-symbols-outlined">person_add</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-stone font-medium text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-sage font-bold hover:text-fern hover:underline transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Visual Content */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-night">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Modern sustainable farming"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-night/80 via-night/30 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-end p-20 h-full w-full text-right">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl inline-block max-w-lg ml-auto"
          >
            <div className="flex justify-end gap-2 mb-6">
              <span className="material-symbols-outlined text-gold">star</span>
              <span className="material-symbols-outlined text-gold">star</span>
              <span className="material-symbols-outlined text-gold">star</span>
              <span className="material-symbols-outlined text-gold">star</span>
              <span className="material-symbols-outlined text-gold">star</span>
            </div>
            <h3 className="text-white font-serif text-3xl font-bold mb-4">"The best tool in my tractor."</h3>
            <p className="text-white/70 text-lg leading-relaxed italic mb-8">
              "Joining AgriGuide was the smartest move for my family farm. The disease detection alone saved us 20% on crop loss this season."
            </p>
            <div>
              <p className="text-white font-bold text-xl">Arjun Singh</p>
              <p className="text-mint font-bold text-xs uppercase tracking-widest">Master Farmer, Punjab</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
