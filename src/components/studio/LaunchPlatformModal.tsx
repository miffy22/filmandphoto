import React, { useState } from 'react';
import {
  X, Rocket, Globe, Server, DollarSign, ShieldCheck, CheckCircle2,
  ExternalLink, ArrowRight, Layers, Database, Lock, Users, Sparkles, AlertTriangle,
  Copy, Award, Check
} from 'lucide-react';

interface LaunchPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchPlatformModal: React.FC<LaunchPlatformModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'domains' | 'architecture' | 'pricing' | 'competitors' | 'checklist'>('domains');
  const [selectedDnsDomain, setSelectedDnsDomain] = useState<'filmandphoto.uk' | 'filmandphotowedding.com' | 'filmweddings.co.uk'>('filmandphoto.uk');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-5xl w-full my-6 p-6 sm:p-8 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
                Commercial SaaS Launch Blueprint
              </span>
              <span className="text-xs bg-amber-950/80 border border-amber-800/80 text-amber-300 font-mono px-2 py-0.5 rounded">
                VidFlow Competitor Edition
              </span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              Launch Your Own Video Client Delivery SaaS
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              Everything required to launch, market, price, and scale this platform commercially to capture market share from VidFlow, Pixally, and MediaZilla.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-6 p-1 bg-neutral-950 rounded-2xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab('domains')}
            className={`py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'domains'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Domain Names</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'architecture'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Tech Stack</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'pricing'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Disruptive Pricing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('competitors')}
            className={`py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'competitors'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Competitor Teardown</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors col-span-2 sm:col-span-1 ${
              activeTab === 'checklist'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Launch Checklist</span>
          </button>
        </div>

        {/* TAB 1: DOMAIN NAMES */}
        {activeTab === 'domains' && (
          <div className="space-y-6">
            {/* Active Portfolio Banner */}
            <div className="bg-gradient-to-r from-amber-500/15 via-neutral-900 to-emerald-500/15 border border-amber-500/40 rounded-3xl p-6 sm:p-7 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono">
                      Portfolio Analysis & Launch Strategy
                    </span>
                    <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                      Your 3 Active Owned Domains (Sep 2027)
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    3 Domains Active & Verified
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
                You already own three domains that position you to take market share from both <strong className="text-white">VidFlow</strong> (video delivery only) and <strong className="text-white">Pic-Time</strong> (photo & store only). Combining video delivery with integrated print lab revenue under these brand names gives you an immediate competitive edge.
              </p>
            </div>

            {/* The 3 Owned Domains Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Domain 1: filmandphoto.uk */}
              <div className="bg-neutral-950 border-2 border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between relative shadow-lg shadow-amber-950/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80 font-mono">
                      Primary Master SaaS Flagship
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">Exp: Sep 22, 2027</span>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                      filmandphoto.uk
                    </h4>
                    <p className="text-xs text-amber-300/90 font-medium mt-0.5">
                      The "All-In-One" VidFlow + Pic-Time Killer
                    </p>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    <strong>Why this is your main platform brand:</strong> VidFlow only delivers video; Pic-Time only specializes in photo. <strong className="text-white">Film & Photo</strong> communicates that your platform unifies 4K films, photo galleries, and print lab revenue in a single client portal.
                  </p>

                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2 text-xs">
                    <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block font-mono">
                      Recommended DNS Blueprint:
                    </span>
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between items-center text-neutral-300">
                        <span>Marketing Lander:</span>
                        <strong className="text-amber-300">filmandphoto.uk</strong>
                      </div>
                      <div className="flex justify-between items-center text-neutral-300">
                        <span>Studio Dashboard:</span>
                        <strong className="text-amber-300">app.filmandphoto.uk</strong>
                      </div>
                      <div className="flex justify-between items-center text-neutral-300">
                        <span>Client Galleries:</span>
                        <strong className="text-emerald-400">*.filmandphoto.uk</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Recommended SaaS Hub
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('cname.filmandphoto.uk', 'filmandphoto.uk DNS')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] font-mono text-neutral-200 flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedText === 'filmandphoto.uk DNS' ? 'Copied!' : 'Copy DNS'}
                  </button>
                </div>
              </div>

              {/* Domain 2: filmandphotowedding.com */}
              <div className="bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between relative transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 font-mono">
                      Global .COM High-Ticket Portal
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">Exp: Sep 21, 2027</span>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                      filmandphotowedding.com
                    </h4>
                    <p className="text-xs text-emerald-300/90 font-medium mt-0.5">
                      Global Wedding Filmmaker & Couple Hub
                    </p>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    <strong>Why this is a revenue generator:</strong> Wedding filmmakers & photographers charge the highest fees in the industry ($3,500–$15,000/event). The <strong className="text-white">.com</strong> TLD gives international credibility across North America, Europe, Australia, and destination wedding markets.
                  </p>

                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2 text-xs">
                    <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block font-mono">
                      Recommended DNS Blueprint:
                    </span>
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between items-center text-neutral-300">
                        <span>Global SEO Portal:</span>
                        <strong className="text-amber-300">filmandphotowedding.com</strong>
                      </div>
                      <div className="flex justify-between items-center text-neutral-300">
                        <span>Couple Gallery App:</span>
                        <strong className="text-emerald-400">view.filmandphotowedding.com</strong>
                      </div>
                      <div className="flex justify-between items-center text-neutral-300">
                        <span>Print Storefront:</span>
                        <strong className="text-amber-300">store.filmandphotowedding.com</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-semibold flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" /> High SEO Authority
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('cname.filmandphotowedding.com', 'wedding .com DNS')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] font-mono text-neutral-200 flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedText === 'wedding .com DNS' ? 'Copied!' : 'Copy DNS'}
                  </button>
                </div>
              </div>

              {/* Domain 3: filmweddings.co.uk */}
              <div className="bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between relative transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/80 font-mono">
                      UK Cinema & Videography Niche
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">Exp: Sep 22, 2027</span>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                      filmweddings.co.uk
                    </h4>
                    <p className="text-xs text-blue-300/90 font-medium mt-0.5">
                      UK Wedding Videographer Delivery Portal
                    </p>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    <strong>Why this dominates locally:</strong> High search intent for couples looking to view wedding films. Perfect for a curated UK filmmaker directory, or for UK studios wanting local, trusted delivery URLs (e.g. <span className="font-mono text-neutral-200">watch.filmweddings.co.uk/smith</span>).
                  </p>

                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2 text-xs">
                    <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block font-mono">
                      Recommended DNS Blueprint:
                    </span>
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between items-center text-neutral-300">
                        <span>UK Directory / Hub:</span>
                        <strong className="text-amber-300">filmweddings.co.uk</strong>
                      </div>
                      <div className="flex justify-between items-center text-neutral-300">
                        <span>Direct Video Stream:</span>
                        <strong className="text-blue-300">watch.filmweddings.co.uk</strong>
                      </div>
                      <div className="flex justify-between items-center text-neutral-300">
                        <span>Redirect to Master:</span>
                        <span className="text-neutral-400">301 Redirect to app</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> UK Regional Trust
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('cname.filmweddings.co.uk', 'filmweddings DNS')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] font-mono text-neutral-200 flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedText === 'filmweddings DNS' ? 'Copied!' : 'Copy DNS'}
                  </button>
                </div>
              </div>
            </div>

            {/* Registrar DNS Deployment Table */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-amber-400" />
                    Production DNS Records for Your Registrar
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Select which domain you are currently configuring in GoDaddy, 123 Reg, or Cloudflare:
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-1 rounded-lg">
                  Free Automatic SSL Enabled
                </span>
              </div>

              {/* Domain Switcher for DNS */}
              <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                {[
                  { id: 'filmandphoto.uk', label: 'filmandphoto.uk', role: 'Primary SaaS & Store Platform' },
                  { id: 'filmandphotowedding.com', label: 'filmandphotowedding.com', role: 'Global .COM Wedding Niche' },
                  { id: 'filmweddings.co.uk', label: 'filmweddings.co.uk', role: 'UK Filmmaker Delivery' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedDnsDomain(item.id as any)}
                    className={`flex-1 min-w-[200px] py-2 px-3 rounded-lg text-left transition-all ${
                      selectedDnsDomain === item.id
                        ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <div className="font-mono text-xs">{item.label}</div>
                    <div className={`text-[10px] ${selectedDnsDomain === item.id ? 'text-neutral-900' : 'text-neutral-500'}`}>
                      {item.role}
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="text-neutral-400">DNS Zone currently selected: </span>
                  <strong className="font-mono text-amber-400 font-bold">{selectedDnsDomain}</strong>
                </div>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {selectedDnsDomain === 'filmandphoto.uk' ? '⭐ Recommended Main Flagship' : 'Secondary Hub'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px]">
                      <th className="pb-2.5 px-3">Type</th>
                      <th className="pb-2.5 px-3">Name / Host</th>
                      <th className="pb-2.5 px-3">Resolves To URL</th>
                      <th className="pb-2.5 px-3">Target / Value</th>
                      <th className="pb-2.5 px-3">Proxy / SSL</th>
                      <th className="pb-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-neutral-300">
                    <tr className="hover:bg-neutral-900/50">
                      <td className="py-2.5 px-3 text-amber-400 font-bold">CNAME</td>
                      <td className="py-2.5 px-3 text-white font-bold">app</td>
                      <td className="py-2.5 px-3 text-neutral-400 font-sans text-[11px]">app.{selectedDnsDomain}</td>
                      <td className="py-2.5 px-3 text-neutral-300">cname.filmdelivery.network</td>
                      <td className="py-2.5 px-3 text-emerald-400">Proxied / Free SSL</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleCopy('cname.filmdelivery.network', `${selectedDnsDomain} app`)}
                          className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                        >
                          {copiedText === `${selectedDnsDomain} app` ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-900/50">
                      <td className="py-2.5 px-3 text-amber-400 font-bold">CNAME</td>
                      <td className="py-2.5 px-3 text-white font-bold">gallery</td>
                      <td className="py-2.5 px-3 text-neutral-400 font-sans text-[11px]">gallery.{selectedDnsDomain}</td>
                      <td className="py-2.5 px-3 text-neutral-300">cname.filmdelivery.network</td>
                      <td className="py-2.5 px-3 text-emerald-400">Proxied / Free SSL</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleCopy('cname.filmdelivery.network', `${selectedDnsDomain} gallery`)}
                          className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                        >
                          {copiedText === `${selectedDnsDomain} gallery` ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-900/50">
                      <td className="py-2.5 px-3 text-blue-400 font-bold">A Record</td>
                      <td className="py-2.5 px-3 text-white font-bold">@ (Root)</td>
                      <td className="py-2.5 px-3 text-neutral-400 font-sans text-[11px]">https://{selectedDnsDomain}</td>
                      <td className="py-2.5 px-3 text-neutral-300">76.76.21.21</td>
                      <td className="py-2.5 px-3 text-emerald-400">Auto SSL Certificate</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleCopy('76.76.21.21', `${selectedDnsDomain} root`)}
                          className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                        >
                          {copiedText === `${selectedDnsDomain} root` ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-900/50">
                      <td className="py-2.5 px-3 text-purple-400 font-bold">CNAME</td>
                      <td className="py-2.5 px-3 text-white font-bold">* (Wildcard)</td>
                      <td className="py-2.5 px-3 text-neutral-400 font-sans text-[11px]">*.{selectedDnsDomain}</td>
                      <td className="py-2.5 px-3 text-neutral-300">cname.filmdelivery.network</td>
                      <td className="py-2.5 px-3 text-emerald-400">White-Label Subdomains</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleCopy('cname.filmdelivery.network', `${selectedDnsDomain} wildcard`)}
                          className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                        >
                          {copiedText === `${selectedDnsDomain} wildcard` ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategic Summary Box */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Architect Recommendation:</strong> Use <strong className="text-white">filmandphoto.uk</strong> as your flagship SaaS app & brand, route wedding traffic via <strong className="text-white">filmandphotowedding.com</strong>, and use <strong className="text-white">filmweddings.co.uk</strong> for UK videographer vanity delivery.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('filmandphoto.uk', 'Recommended Domain')}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
              >
                {copiedText === 'Recommended Domain' ? 'Copied!' : 'Select filmandphoto.uk'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: TECH STACK ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-5">
              <h3 className="font-cinzel text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                How to Deliver 4K Video at 95% Profit Margins
              </h3>
              <p className="text-xs text-neutral-400">
                VidFlow's weakness is charging users high prices because they use standard AWS S3 egress. Here is the modern high-margin cloud blueprint:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-orange-400">
                  <Database className="w-4 h-4" />
                  <h4 className="text-sm font-bold text-white">Storage Layer: Cloudflare R2</h4>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Unlike Amazon S3 which charges $0.09/GB for downloads, <strong>Cloudflare R2 has ZERO egress bandwidth fees</strong>.
                </p>
                <div className="bg-neutral-900 p-3 rounded-xl text-[11px] text-neutral-400 space-y-1">
                  <p>• 10 GB 100% Free Forever</p>
                  <p>• Only $0.015 / GB-month for additional storage</p>
                  <p>• 1 Terabyte of 4K films costs only <strong>$15/month</strong> (VidFlow charges $79/mo!)</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <Layers className="w-4 h-4" />
                  <h4 className="text-sm font-bold text-white">Streaming CDN: Bunny.net / Cloudflare Stream</h4>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Fastest edge delivery to Smart TVs and iPhones worldwide with sub-10ms latency.
                </p>
                <div className="bg-neutral-900 p-3 rounded-xl text-[11px] text-neutral-400 space-y-1">
                  <p>• Bunny Stream encodes 4K, 1080p, 720p HLS automatically</p>
                  <p>• Costs just $0.005 / GB bandwidth</p>
                  <p>• Built-in token authentication & DRM to prevent video piracy</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Users className="w-4 h-4" />
                  <h4 className="text-sm font-bold text-white">Frontend & Edge Routing</h4>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Host the React SPA on Cloudflare Pages or Vercel. Custom domains for videographers (e.g. <span className="font-mono text-neutral-200">films.yourstudio.com</span>) via Cloudflare for SaaS (SSL for SaaS).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-purple-400">
                  <Lock className="w-4 h-4" />
                  <h4 className="text-sm font-bold text-white">Auth & Payments</h4>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Use <strong>Stripe Billing</strong> or <strong>LemonSqueezy</strong> (as Merchant of Record) to handle EU VAT, global sales tax, and automated subscriptions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRICING STRATEGY */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-5">
              <h3 className="font-cinzel text-lg font-bold text-white mb-1 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                The 3 Pricing Models That Destroy Vidflow
              </h3>
              <p className="text-xs text-neutral-400">
                VidFlow users despise the "pay-per-GB" pack trap and 2-year expiration clocks. Here are the 3 models you can launch:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Plan 1 */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="border-b border-neutral-800/80 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-700">
                    Model 1: The "BYOS" Disruptor
                  </span>
                  <div className="text-2xl font-bold font-cinzel text-white mt-2">
                    $19<span className="text-xs font-sans text-neutral-400 font-normal"> / month</span>
                  </div>
                  <p className="text-xs text-amber-400 font-semibold mt-1">Unlimited Client Galleries</p>
                </div>

                <ul className="space-y-2 text-xs text-neutral-300">
                  <li>• Videographers connect their own Google Drive, Dropbox, or YouTube 4K.</li>
                  <li>• <strong>Zero storage liability for you!</strong> 99% gross margins.</li>
                  <li>• Unlimited client galleries & zero 2-year expiration clocks.</li>
                  <li>• White-label custom domains & branding.</li>
                </ul>
              </div>

              {/* Plan 2 */}
              <div className="bg-neutral-950 border border-amber-500/50 ring-1 ring-amber-500/30 rounded-2xl p-5 space-y-4 relative">
                <span className="absolute -top-2.5 right-4 text-[9px] font-bold uppercase tracking-widest bg-amber-500 text-neutral-950 px-2 py-0.5 rounded-full font-mono">
                  Recommended
                </span>

                <div className="border-b border-neutral-800/80 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                    Model 2: Hosted Hybrid Tier
                  </span>
                  <div className="text-2xl font-bold font-cinzel text-white mt-2">
                    $39<span className="text-xs font-sans text-neutral-400 font-normal"> / month</span>
                  </div>
                  <p className="text-xs text-amber-400 font-semibold mt-1">500 GB Included + 4K HLS</p>
                </div>

                <ul className="space-y-2 text-xs text-neutral-300">
                  <li>• 500GB high-speed 4K streaming via Cloudflare R2 (costs you only $7.50).</li>
                  <li>• You pocket <strong>$31.50 profit/month per subscriber</strong>.</li>
                  <li>• Still 50% cheaper than VidFlow's $79/mo plan!</li>
                  <li>• True 10-year client guarantee.</li>
                </ul>
              </div>

              {/* Plan 3 */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="border-b border-neutral-800/80 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    Model 3: The Viral Lifetime Deal
                  </span>
                  <div className="text-2xl font-bold font-cinzel text-white mt-2">
                    $199<span className="text-xs font-sans text-neutral-400 font-normal"> one-time</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">Founders Lifetime Pass</p>
                </div>

                <ul className="space-y-2 text-xs text-neutral-300">
                  <li>• Offer 100 Early-Bird Lifetime passes to the wedding filmmaker community.</li>
                  <li>• Generates <strong>$20,000 instant cash flow</strong> in week 1.</li>
                  <li>• BYOS or includes 50GB storage.</li>
                  <li>• Creates 100 vocal brand evangelists on Reddit and Facebook.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPETITOR TEARDOWN */}
        {activeTab === 'competitors' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase font-mono text-[10px]">
                    <th className="p-3">Platform</th>
                    <th className="p-3">Pricing Model</th>
                    <th className="p-3">Client Expiry</th>
                    <th className="p-3">Filmmaker Complaints</th>
                    <th className="p-3">How You Win</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                  <tr className="bg-neutral-900/40">
                    <td className="p-3 font-bold text-white">VidFlow.co</td>
                    <td className="p-3 font-mono text-red-400">$60/50GB or $79-$165/mo</td>
                    <td className="p-3 text-red-400">2-Year Expiration Trap</td>
                    <td className="p-3">Extremely expensive per gigabyte; couples lose access after 2 yrs</td>
                    <td className="p-3 text-emerald-400 font-semibold">Zero-cost BYOS or flat $19/mo; permanent lifetime links</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Pixally</td>
                    <td className="p-3 font-mono text-neutral-400">$50/50GB, $95/100GB</td>
                    <td className="p-3 text-neutral-400">2-Year Packs</td>
                    <td className="p-3">Same expensive pack model as VidFlow</td>
                    <td className="p-3 text-emerald-400 font-semibold">Unlimited galleries without buying packs</td>
                  </tr>
                  <tr className="bg-neutral-900/40">
                    <td className="p-3 font-bold text-white">MediaZilla</td>
                    <td className="p-3 font-mono text-neutral-400">$20 - $70/mo</td>
                    <td className="p-3 text-neutral-300">Lifetime (high cost)</td>
                    <td className="p-3">Dated player UI; slow mobile experience</td>
                    <td className="p-3 text-emerald-400 font-semibold">Ultra-sleek modern Netflix UI & interactive chapters</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Vimeo Showcase</td>
                    <td className="p-3 font-mono text-neutral-400">$20 - $65/mo</td>
                    <td className="p-3 text-neutral-300">Ongoing sub</td>
                    <td className="p-3">Not built for weddings; no chapter cues or photo galleries</td>
                    <td className="p-3 text-emerald-400 font-semibold">Custom wedding heirlooms, TV guide, guestbook love notes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: LAUNCH CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-5">
              <h3 className="font-cinzel text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-amber-400" />
                The 7-Step Commercial Launch Plan
              </h3>
              <p className="text-xs text-neutral-400">
                Follow this exact sequence to go from code to paying subscribers:
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  step: '01',
                  title: 'Connect Your Owned Domains (filmandphoto.uk & filmandphotowedding.com)',
                  desc: 'Add DNS CNAME and A records at your registrar for filmandphoto.uk and filmandphotowedding.com to route client galleries and studio dashboard with free automatic SSL.',
                  status: '3 Domains Secured til 2027',
                },
                {
                  step: '02',
                  title: 'Connect Stripe / LemonSqueezy Billing',
                  desc: 'Create monthly subscription products ($19/mo BYOS and $39/mo Hosted). Set up webhook to unlock accounts.',
                  status: 'Config ready',
                },
                {
                  step: '03',
                  title: 'Deploy to Cloudflare Pages / Vercel',
                  desc: 'Run `npm run build` and point your domain DNS. 100% free hosting for the web app.',
                  status: 'Tested & passing build',
                },
                {
                  step: '04',
                  title: 'Create the "Vidflow vs Us" Comparison Landing Page',
                  desc: 'Highlight the $1,600/year savings calculator and lack of 2-year expiration clocks.',
                  status: 'Built in codebase',
                },
                {
                  step: '05',
                  title: 'Reddit & Facebook Group Stealth Launch',
                  desc: 'Post in r/weddingvideography and Facebook groups: "Tired of VidFlow\'s $60 packs? I built a free/flat alternative for filmmakers."',
                  status: 'High engagement playbook',
                },
                {
                  step: '06',
                  title: 'Launch a 100-Seat Founders Lifetime Deal ($199)',
                  desc: 'Generate $20,000 in immediate cash flow to validate product-market fit and fund any marketing.',
                  status: 'Recommended growth hack',
                },
                {
                  step: '07',
                  title: 'Partner with Wedding Filmmaker YouTubers',
                  desc: 'Reach out to wedding filmmaking channels (e.g., Matt WhoisMatt, Tom Harmon, WhoisMatt Johnson) for sponsored comparisons vs VidFlow.',
                  status: 'Scale phase',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-4"
                >
                  <span className="font-mono text-base font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 rounded-xl shrink-0">
                    {item.step}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-neutral-400">
            Current codebase contains the complete video player, client portal, chapter markers, and project customizer.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
          >
            Close Command Center
          </button>
        </div>
      </div>
    </div>
  );
};
