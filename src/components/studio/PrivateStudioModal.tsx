import React, { useState } from 'react';
import {
  X,
  Building2,
  Sparkles,
  Globe,
  HardDrive,
  ShoppingBag,
  Palette,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProfessionalStudio, GalleryTheme, PrintLabProvider } from '../../types/cineflow';

interface PrivateStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  studios: ProfessionalStudio[];
  activeStudio: ProfessionalStudio;
  onSelectStudio: (studio: ProfessionalStudio) => void;
  onCreateStudio: (studio: ProfessionalStudio) => void;
  onUpdateStudio: (studio: ProfessionalStudio) => void;
}

export const PrivateStudioModal: React.FC<PrivateStudioModalProps> = ({
  isOpen,
  onClose,
  studios,
  activeStudio,
  onSelectStudio,
  onCreateStudio,
  onUpdateStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'switch' | 'create' | 'settings'>('switch');
  const [copiedDomain, setCopiedDomain] = useState(false);

  // New studio form state
  const [studioName, setStudioName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [filmmakerName, setFilmmakerName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [tagline, setTagline] = useState('Artisanal Cinematic Films & Fine Art Keepsakes');
  const [primaryColor, setPrimaryColor] = useState('#d97706');
  const [theme, setTheme] = useState<GalleryTheme>('luxury-gold');
  const [defaultPrintLab, setDefaultPrintLab] = useState<PrintLabProvider>('whcc');
  const [defaultMarkupPercent, setDefaultMarkupPercent] = useState<number>(350);
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR' | 'AUD' | 'CAD'>('GBP');
  const [storageProvider, setStorageProvider] = useState<
    'cloudflare-r2' | 'aws-s3' | 'google-drive' | 'bunny-cdn' | 'native-vault'
  >('native-vault');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setStudioName(val);
    if (!subdomain || subdomain === studioName.toLowerCase().replace(/[^a-z0-9]/g, '')) {
      setSubdomain(val.toLowerCase().replace(/[^a-z0-9]/g, ''));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioName.trim() || !subdomain.trim()) return;

    const newStudio: ProfessionalStudio = {
      id: `studio_${Date.now()}`,
      name: studioName.trim(),
      subdomain: subdomain.trim().toLowerCase(),
      tagline,
      filmmakerName: filmmakerName.trim() || 'Cinematographer',
      email: email.trim() || 'studio@filmandphoto.uk',
      website: website.trim() || `https://${subdomain.trim().toLowerCase()}.filmandphoto.uk`,
      instagram: `@${subdomain.trim().toLowerCase()}`,
      primaryColor,
      theme,
      defaultPrintLab,
      defaultMarkupPercent,
      currency,
      storageProvider,
      activeProjectsCount: 1,
      createdAt: new Date().toISOString(),
    };

    onCreateStudio(newStudio);
    onSelectStudio(newStudio);
    setActiveTab('switch');

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleCopySubdomain = (domainStr: string) => {
    navigator.clipboard.writeText(domainStr);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 bg-neutral-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-neutral-800 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  Private Studio Workspaces
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Multi-Tenant White-Label
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Create & manage independent white-label studios with custom subdomains, print labs, and branding
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('switch')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'switch'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Active Studios ({studios.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'create'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Current Studio Branding</span>
          </button>
        </div>

        {/* Tab 1: Studio Switcher & Active Profiles */}
        {activeTab === 'switch' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studios.map((s) => {
                const isActive = s.id === activeStudio.id;
                const fullSubdomain = `${s.subdomain}.filmandphoto.uk`;

                return (
                  <div
                    key={s.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/40'
                        : 'bg-neutral-950/60 hover:bg-neutral-800/40 border-neutral-800'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-cinzel text-base font-bold text-white">{s.name}</h4>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-neutral-950">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">{s.tagline}</p>
                        </div>

                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: s.primaryColor }}
                        />
                      </div>

                      {/* Subdomain URL Badge */}
                      <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-neutral-300 font-mono text-[11px] truncate">
                          <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{fullSubdomain}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopySubdomain(fullSubdomain)}
                          className="p-1 text-neutral-400 hover:text-white transition-colors"
                          title="Copy subdomain URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80">
                        <div>
                          <span className="block text-[10px] text-neutral-500 uppercase">Print Lab</span>
                          <span className="font-semibold text-neutral-200 uppercase">{s.defaultPrintLab}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-neutral-500 uppercase">Markup</span>
                          <span className="font-semibold text-amber-400">+{s.defaultMarkupPercent}%</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-neutral-500 uppercase">Storage</span>
                          <span className="font-semibold text-neutral-200 capitalize">
                            {s.storageProvider.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => onSelectStudio(s)}
                          className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                        >
                          Switch to this Studio
                        </button>
                      ) : (
                        <div className="w-full py-2 text-center text-xs text-amber-400 font-semibold flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Currently Selected Workspace</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider font-cinzel">
                  Scale Your Filmmaking Agency
                </h5>
                <p className="text-xs text-neutral-400">
                  Every studio receives its own isolated white-label subdomain (<span className="font-mono text-amber-400">*.filmandphoto.uk</span>) with 0% platform print commission and unlimited 4K deliveries.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Studio</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Create New Studio Form */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Studio Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Studio / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Loxley Cinema Studios"
                  value={studioName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Subdomain */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Subdomain on filmandphoto.uk *
                </label>
                <div className="flex items-center bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 focus-within:border-amber-500">
                  <input
                    type="text"
                    required
                    placeholder="loxley"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="bg-transparent text-sm text-white focus:outline-none flex-1 font-mono"
                  />
                  <span className="text-xs text-neutral-500 font-mono">.filmandphoto.uk</span>
                </div>
              </div>

              {/* Filmmaker Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Lead Cinematographer / Owner Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marcus Vance"
                  value={filmmakerName}
                  onChange={(e) => setFilmmakerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Studio Inquiries Email
                </label>
                <input
                  type="email"
                  placeholder="hello@loxleycinema.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Print Lab & Storage Integration Defaults */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Default Print Lab
                </label>
                <select
                  value={defaultPrintLab}
                  onChange={(e) => setDefaultPrintLab(e.target.value as PrintLabProvider)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="whcc">WHCC (White House Custom Colour - US/Global)</option>
                  <option value="millers">Miller's Professional Imaging (US)</option>
                  <option value="loxley">Loxley Colour (UK & Europe)</option>
                  <option value="atkins">Atkins Pro Lab (Australia & Asia)</option>
                </select>
                <p className="text-[10px] text-neutral-500 mt-1">Automatic wholesale lab routing</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Wholesale Print Profit Markup
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="25"
                    value={defaultMarkupPercent}
                    onChange={(e) => setDefaultMarkupPercent(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs text-amber-400 font-bold">%</span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">You keep 100% of the profit margin</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Media Storage Engine
                </label>
                <select
                  value={storageProvider}
                  onChange={(e) => setStorageProvider(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="native-vault">Native Built-in Vault (Active & Pre-Configured — $0 Egress)</option>
                  <option value="cloudflare-r2">Cloudflare R2 (Optional BYO Bucket)</option>
                  <option value="aws-s3">Amazon Web Services S3 (Optional BYO)</option>
                  <option value="bunny-cdn">Bunny.net Stream CDN</option>
                  <option value="google-drive">Google Drive (Import Only)</option>
                </select>
                <p className="text-[10px] text-emerald-400 mt-1">Pre-configured out of the box — zero setup needed</p>
              </div>
            </div>

            {/* Visual Palette */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Brand Accent Color & Client Visual Theme
              </label>
              <div className="flex items-center gap-3">
                {['#d97706', '#dc2626', '#059669', '#2563eb', '#9333ea', '#e11d48'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPrimaryColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      primaryColor === c ? 'scale-110 border-white ring-2 ring-amber-400/50' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setActiveTab('switch')}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 hover:scale-105"
              >
                Provision Private Studio
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Current Studio Settings */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cinzel text-base font-bold text-white">{activeStudio.name}</h4>
                  <p className="text-xs text-neutral-400">{activeStudio.tagline}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>White-Label Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">Subdomain Endpoint</span>
                  <span className="font-mono text-amber-300 text-xs">
                    https://{activeStudio.subdomain}.filmandphoto.uk
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">Fulfillment Lab</span>
                  <span className="font-semibold text-white capitalize">{activeStudio.defaultPrintLab} Pro Lab</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
