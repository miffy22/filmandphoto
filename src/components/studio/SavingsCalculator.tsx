import React, { useState } from 'react';
import { DollarSign, ShieldAlert, CheckCircle, Zap, HardDrive, ArrowRight, ExternalLink, HelpCircle } from 'lucide-react';
import { calculateVidflowSavings } from '../../utils/storageHelpers';

export const SavingsCalculator: React.FC = () => {
  const [projectsPerYear, setProjectsPerYear] = useState<number>(20);
  const [avgGbPerProject, setAvgGbPerProject] = useState<number>(50);

  const savings = calculateVidflowSavings(projectsPerYear, avgGbPerProject);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
            Financial Freedom Calculator
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mt-1">
            Why Vidflow Costs a Fortune (And How to Pay $0)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Vidflow charges heavy markups on storage and bandwidth ($60 for 50GB, $475 for 500GB, or $165/mo). CineFlow connects directly to your own free or near-free cloud storage.
          </p>
        </div>

        <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-4 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Your Annual Savings
          </span>
          <div className="font-cinzel text-3xl sm:text-4xl font-extrabold text-emerald-300">
            ${savings.annualSavings.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400/80 font-mono">
            ${savings.fiveYearSavings.toLocaleString()} over 5 years
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-semibold text-neutral-200">
              Weddings / Deliveries per Year
            </label>
            <span className="text-sm font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-lg">
              {projectsPerYear} clients
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="80"
            value={projectsPerYear}
            onChange={(e) => setProjectsPerYear(parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-800 accent-amber-500 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-neutral-500 mt-2 font-mono">
            <span>1 / yr</span>
            <span>20 / yr</span>
            <span>50 / yr</span>
            <span>80 / yr</span>
          </div>
        </div>

        <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-semibold text-neutral-200">
              Average Video Delivery Size per Client
            </label>
            <span className="text-sm font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-lg">
              {avgGbPerProject} GB / client
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="250"
            step="5"
            value={avgGbPerProject}
            onChange={(e) => setAvgGbPerProject(parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-800 accent-amber-500 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-neutral-500 mt-2 font-mono">
            <span>10 GB (Web)</span>
            <span>50 GB (UHD)</span>
            <span>100 GB (ProRes)</span>
            <span>250 GB (Raw)</span>
          </div>
        </div>
      </div>

      {/* Head-to-Head Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* VidFlow Card */}
        <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <h3 className="font-cinzel text-lg font-bold text-red-200">VidFlow.co</h3>
            </div>
            <span className="text-xs font-mono text-red-400 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded">
              Extortionate Pricing
            </span>
          </div>

          <div className="text-3xl font-extrabold text-red-300 font-cinzel mb-4">
            ~${savings.vidflowAnnualCost.toLocaleString()}
            <span className="text-xs font-sans font-normal text-red-400 ml-1.5">/ year</span>
          </div>

          <ul className="space-y-2.5 text-xs text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span><strong>$60 for only 50 GB</strong> or $165/mo ($1,980/year) high-tier subscription.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span><strong>Client links expire in 2 years</strong> unless you pay renewal fees.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span>Locked-in vendor dependency: if VidFlow closes, your client links vanish.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span>Charges you for every gigabyte of bandwidth your clients stream.</span>
            </li>
          </ul>
        </div>

        {/* CineFlow Card */}
        <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="font-cinzel text-lg font-bold text-emerald-200">CineFlow Studio</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              Zero-Cost BYOS
            </span>
          </div>

          <div className="text-3xl font-extrabold text-emerald-300 font-cinzel mb-4">
            $0.00
            <span className="text-xs font-sans font-normal text-emerald-400 ml-1.5">/ year forever</span>
          </div>

          <ul className="space-y-2.5 text-xs text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>$0 recurring cost</strong>: Connect your free Google Drive, Dropbox, or YouTube 4K.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Never expires</strong>: You own your files in your own cloud account forever.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Same luxury experience</strong>: 4K cinema player, scene chapters, downloads, Smart TV guide.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Standalone export</strong>: Export full HTML files to host on GitHub/Netlify or deliver via USB.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Free Storage Blueprint Guide */}
      <div className="border-t border-neutral-800 pt-6">
        <h4 className="font-cinzel text-base font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          The $0 Filmmaker Storage Blueprint (How to Host for Free)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              1. Google Drive (Free)
            </h5>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Every free Google account includes <strong>15 GB free</strong>. CineFlow automatically transforms standard Google Drive share links into clean stream & download portals.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              2. Cloudflare R2 ($0 Egress)
            </h5>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Cloudflare R2 provides <strong>10 GB 100% free forever</strong> and <strong>$0 egress bandwidth fees</strong> (unlike AWS). Additional storage is only $0.015/GB (100GB = $1.50/mo vs VidFlow's $110!).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-rose-400" />
              3. YouTube Unlisted (4K)
            </h5>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Upload unlisted videos to YouTube for <strong>100% free unlimited 4K 60fps streaming</strong>. CineFlow strips the ads and recommendations for a luxury cinema presentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
