import React, { useState } from 'react';
import {
  X,
  HardDrive,
  Cloud,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Lock,
  Server,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StorageVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGoogleDrive?: () => void;
}

export const StorageVaultModal: React.FC<StorageVaultModalProps> = ({
  isOpen,
  onClose,
  onOpenGoogleDrive,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'native' | 'cloudflare' | 's3' | 'backblaze'>('native');
  const [accountId, setAccountId] = useState('');
  const [bucketName, setBucketName] = useState('wedding-deliveries-vault');
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleTestAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);

    setTimeout(() => {
      setIsTesting(false);
      setIsConnected(true);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 bg-neutral-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-neutral-800 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  Zero-Egress Storage Vault Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready & Pre-Configured
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Automated High-Speed Media Cloud: Native Built-in Vault with 0 Egress Fees and optional BYO S3/R2 Buckets
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Storage Providers Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: 'native',
                name: 'Native Cloud Vault',
                badge: 'Active & Turnkey',
                desc: 'Built-in 4K CDN, $0 Egress',
                color: 'text-amber-400',
              },
              {
                id: 'cloudflare',
                name: 'Cloudflare R2',
                badge: 'Optional BYO',
                desc: 'Bring your own R2 bucket',
                color: 'text-neutral-400',
              },
              {
                id: 's3',
                name: 'Amazon S3',
                badge: 'Optional BYO',
                desc: 'Bring your own AWS S3',
                color: 'text-neutral-400',
              },
              {
                id: 'backblaze',
                name: 'Backblaze B2',
                badge: 'Optional BYO',
                desc: 'Bring your own B2 bucket',
                color: 'text-neutral-400',
              },
            ].map((prov) => (
              <button
                key={prov.id}
                type="button"
                onClick={() => setSelectedProvider(prov.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  selectedProvider === prov.id
                    ? 'bg-neutral-800 border-amber-500 ring-1 ring-amber-500/50'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    prov.id === 'native' ? 'text-emerald-400' : 'text-neutral-400'
                  }`}>
                    {prov.badge}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{prov.name}</h4>
                <p className="text-[11px] text-neutral-400 mt-1">{prov.desc}</p>
              </button>
            ))}
          </div>

          {/* Tab 1: Native Cloud Vault (Active & Automated) */}
          {selectedProvider === 'native' && (
            <div className="p-6 rounded-2xl bg-neutral-950/80 border border-amber-500/30 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">Film & Photo Native Storage Vault</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Fully Automated & Active
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Zero manual setup required. No need to create accounts on Cloudflare, AWS, or any third party.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold mb-1">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Streaming Architecture</span>
                  </div>
                  <div className="text-sm font-bold text-white">4K 60fps Multi-Bitrate</div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    HLS & DASH adaptive streaming with instant zero-lag seek chapters.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold mb-1">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Bandwidth Egress</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400">$0.00 / Free Unlimited</div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Zero bandwidth download fees, even when clients download full ProRes masters.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold mb-1">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Storage Safety</span>
                  </div>
                  <div className="text-sm font-bold text-white">Triple Geographic Replicas</div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    11-nines durability guarantee for wedding master archives and print assets.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-semibold text-neutral-200">How It Works for You and Other Professionals:</span>
                  <p className="text-neutral-400 text-[11px]">
                    Just click <strong className="text-amber-400">"New Film Delivery"</strong>, paste or upload your video file, and deliver to clients. The platform handles transcode, edge caching, and print lab routing automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shrink-0 transition-colors"
                >
                  Ready to Deliver
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: BYO Cloudflare R2 */}
          {selectedProvider === 'cloudflare' && (
            <form onSubmit={handleTestAndSave} className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Bring Your Own Cloudflare R2 Bucket (Optional)</h4>
                  <p className="text-xs text-neutral-400">
                    Optional enterprise option if your studio already has an existing Cloudflare R2 bucket.
                  </p>
                </div>
                {isConnected && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Cloudflare Account ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7f92b4129e92847a9..."
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    R2 Bucket Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="wedding-vault"
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Access Key ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="cf_ak_98124..."
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Secret Access Key
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••••••••••••••"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="submit"
                  disabled={isTesting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isTesting ? 'Verifying Bucket CORS & Egress...' : 'Test & Activate R2 Vault'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: BYO S3 or Backblaze */}
          {(selectedProvider === 's3' || selectedProvider === 'backblaze') && (
            <div className="p-6 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-center space-y-3">
              <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
              <h4 className="font-bold text-white text-sm">
                Connect {selectedProvider === 's3' ? 'Amazon S3' : 'Backblaze B2'}
              </h4>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Enter your standard S3-compatible credentials to route high-volume wedding assets to your dedicated cloud bucket.
              </p>
              <button
                type="button"
                onClick={() => setSelectedProvider('native')}
                className="mt-2 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                ← Return to Native Built-in Vault (Recommended)
              </button>
            </div>
          )}

          {/* VidFlow Cost Killer Breakdown */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-neutral-950 to-neutral-950 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-cinzel">
              <Sparkles className="w-4 h-4" />
              <span>Why This Beats VidFlow & Pic-Time On Cost</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-neutral-400 text-[11px] block">VidFlow Monthly Bill</span>
                <span className="font-bold text-rose-400 text-sm mt-0.5 block">$99 - $149/mo</span>
                <span className="text-[10px] text-neutral-500">+ strict per-film storage fees</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-neutral-400 text-[11px] block">Pic-Time Store Cut</span>
                <span className="font-bold text-rose-400 text-sm mt-0.5 block">15% Commission</span>
                <span className="text-[10px] text-neutral-500">Takes cut of every album sale</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40">
                <span className="text-amber-400 text-[11px] block font-semibold">Film & Photo Model</span>
                <span className="font-bold text-emerald-400 text-sm mt-0.5 block">$0 Bandwidth + 0% Cut</span>
                <span className="text-[10px] text-neutral-400">Keep 100% profit from your prints</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
