import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Zap, ShieldCheck, Search, CheckCircle, 
  Sparkles, RefreshCw, Star, MapPin, Gauge 
} from 'lucide-react';

export const HeroVisualHub: React.FC = () => {
  const [selectedKeyword, setSelectedKeyword] = useState('Local Clinic Noida');
  const [isScanning, setIsScanning] = useState(false);
  const [scanScore, setScanScore] = useState(99);

  const keywords = [
    { key: 'Local Clinic Noida', rank: '#1', volume: '3.4k/mo', category: 'Local SEO' },
    { key: 'eCommerce Store Design', rank: '#1', volume: '8.2k/mo', category: 'WooCommerce' },
    { key: 'Enterprise Laravel App', rank: '#2', volume: '5.1k/mo', category: 'Web Engineering' },
  ];

  const handleRetestSpeed = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanScore(Math.floor(Math.random() * 2) + 98); // 98-99
      setIsScanning(false);
    }, 800);
  };

  const activeKw = keywords.find(k => k.key === selectedKeyword) || keywords[0];

  return (
    <div className="relative mx-auto max-w-lg lg:max-w-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-violet-500/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition duration-1000" />

      {/* Main Glass Studio Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-2xl">
        
        {/* Top Studio Image */}
        <div className="relative h-64 sm:h-72 overflow-hidden">
          <img
            src="/src/assets/images/hero_tech_digital_1793853537850.jpg"
            alt="Genmax IT Solution digital command center"
            className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Floating Live Indicator Badge */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-900 dark:text-cyan-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Genmax Technical Engine Active</span>
          </div>

          {/* Speed Dial Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-white shadow-md">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>0.9s FCP</span>
          </div>

          {/* Interactive SERP Rank Preview Floating Over Image */}
          <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 shadow-xl">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                Live Google 3-Pack Telemetry
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono">
                {activeKw.rank} SERP Position
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                G
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {activeKw.key}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-current" />
                  <span>4.9 (500+ Verified Client Reviews)</span>
                </div>
              </div>
            </div>

            {/* Keyword Switcher Pill Controls */}
            <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
              {keywords.map((kw) => (
                <button
                  key={kw.key}
                  onClick={() => setSelectedKeyword(kw.key)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                    selectedKeyword === kw.key
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {kw.category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Interactive HUD Bar */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <span>Google PageSpeed:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{scanScore}/100</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Zero Cumulative Layout Shift</div>
            </div>
          </div>

          <button
            onClick={handleRetestSpeed}
            disabled={isScanning}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isScanning ? 'Auditing...' : 'Live Test'}</span>
          </button>
        </div>

      </div>

      {/* Floating Decorative Perk Card */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-3 p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between text-xs"
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-medium text-slate-800 dark:text-slate-200">
            Free Custom Domain (₹999) + 1-Year Full Technical Warranty
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase font-mono">
          Included
        </span>
      </motion.div>
    </div>
  );
};
