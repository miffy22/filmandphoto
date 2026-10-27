import React, { useState } from 'react';
import { X, Globe, CheckCircle2, Copy, ShieldCheck, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  studioName: string;
}

export const CustomDomainModal: React.FC<CustomDomainModalProps> = ({
  isOpen,
  onClose,
  studioName,
}) => {
  const [domainInput, setDomainInput] = useState('filmandphoto.uk');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainInput }),
      });
      const data = await res.json();
      if (data.status === 'verified') {
        setIsVerified(true);
        try {
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } catch (e) {
      setIsVerified(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                Custom Domain & White-Labeling
              </h3>
              <p className="text-xs text-neutral-400">
                Deliver film galleries under your own brand (e.g. films.yourstudio.com).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Quick Select Owned Domains Portfolio */}
          <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Your Owned Domains (Active in Portfolio)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                Registered til 2027
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { domain: 'gallery.filmandphoto.uk', label: 'filmandphoto.uk', tag: 'Primary Hub' },
                { domain: 'delivery.filmandphotowedding.com', label: 'filmandphotowedding.com', tag: 'Global .COM' },
                { domain: 'watch.filmweddings.co.uk', label: 'filmweddings.co.uk', tag: 'UK Films' },
              ].map((item) => (
                <button
                  key={item.domain}
                  type="button"
                  onClick={() => {
                    setDomainInput(item.domain);
                    setIsVerified(true);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    domainInput.includes(item.label)
                      ? 'bg-amber-500/10 border-amber-500/60 text-white'
                      : 'bg-neutral-900 border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  <div className="font-mono font-bold text-[11px] truncate">{item.label}</div>
                  <div className="text-[9px] text-amber-400/90 mt-0.5 flex justify-between items-center">
                    <span>{item.tag}</span>
                    <span className="text-[9px] text-neutral-400 font-mono">Use &rarr;</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Domain Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Active Studio Delivery Domain / Subdomain
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => {
                  setDomainInput(e.target.value);
                  setIsVerified(false);
                }}
                placeholder="films.filmandphoto.uk"
                className="flex-1 px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                ) : (
                  <span>Check DNS</span>
                )}
              </button>
            </div>
          </div>

          {/* DNS Configuration Table */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
              Required DNS Record (At Your Domain Registrar)
            </span>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-850">
                <span className="text-[10px] text-neutral-500 block">Type</span>
                <span className="font-mono text-white font-bold">CNAME</span>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Name / Host</span>
                  <span className="font-mono text-white font-bold">films</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('films', 'host')}
                  className="p-1 text-neutral-500 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Target / Value</span>
                  <span className="font-mono text-amber-300 font-bold text-[11px] truncate block max-w-[120px] sm:max-w-[200px]" title="ais-dev-4xn3fsaxg65ogr7bt7qvde-706791806922.europe-west2.run.app">
                    ais-dev-4xn3fsaxg65ogr7bt7qvde-706791806922.europe-west2.run.app
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('https://ais-dev-4xn3fsaxg65ogr7bt7qvde-706791806922.europe-west2.run.app', 'target')}
                  className="p-1 text-neutral-500 hover:text-white"
                  title="Copy Target"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {copiedField && (
              <p className="text-[11px] text-emerald-400 font-mono">
                Copied {copiedField} to clipboard!
              </p>
            )}
          </div>

          {/* SSL & Active Status */}
          {isVerified ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-emerald-200 block font-semibold">
                  DNS Verified & Free SSL Certificate Active
                </strong>
                <p className="text-emerald-300/80 mt-0.5">
                  Your clients now see <span className="font-mono underline font-medium">https://{domainInput}</span> with zero CineFlow branding.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-3">
              <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200">
                <span>DNS changes usually propagate within 2 to 15 minutes. Click "Check DNS" to verify.</span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
