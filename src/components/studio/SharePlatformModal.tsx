import React, { useState } from 'react';
import {
  X, Copy, CheckCircle2, Share2, Sparkles, Film, ShoppingBag, ShieldCheck,
  ExternalLink, Users, ArrowRight, MessageSquare, Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SharePlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SharePlatformModal: React.FC<SharePlatformModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInviteText, setCopiedInviteText] = useState(false);

  const [urlMode, setUrlMode] = useState<'custom' | 'cloud'>('custom');

  // Platform live URL: default to your brand domain filmandphoto.uk
  const platformUrl = urlMode === 'custom'
    ? 'https://filmandphoto.uk'
    : (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://filmandphoto.uk');

  const invitePitch = `Hey! Check out Film & Photo — it's a new 4K wedding film delivery & fine-art print store platform built specifically to replace VidFlow and Pic-Time:

✨ 4K 60fps Cinema Player with chapter markers (no 1080p compression)
🛍️ Integrated WHCC, Miller's & Loxley Colour print store with 0% platform commission (keep 100% of markups)
⚡ Built-in high-speed native storage with $0 egress fees — no need to create Cloudflare or AWS accounts
🎬 Private white-label studio workspaces with custom subdomains

Try it out here: ${platformUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(platformUrl);
    setCopiedLink(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyInviteText = () => {
    navigator.clipboard.writeText(invitePitch);
    setCopiedInviteText(true);
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    setTimeout(() => setCopiedInviteText(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 bg-neutral-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-neutral-800 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  Share Platform with Professionals
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready to Share
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Direct live link for wedding cinematographers and photographers to test and onboard
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
        <div className="p-6 space-y-6">
          {/* Domain Type Switcher */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
            <span className="text-xs font-semibold text-neutral-300">Choose URL to Share:</span>
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => setUrlMode('custom')}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-all ${
                  urlMode === 'custom'
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                filmandphoto.uk
              </button>
              <button
                type="button"
                onClick={() => setUrlMode('cloud')}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all ${
                  urlMode === 'cloud'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Direct Cloud Run
              </button>
            </div>
          </div>

          {/* Direct Live Link Box */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Active Link ({urlMode === 'custom' ? 'Custom Domain' : 'Direct Cloud'})</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Publicly Accessible
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-mono text-amber-300 truncate select-all">
                {platformUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 shrink-0"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Turnkey Assurance: Zero External Setup */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-neutral-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Turnkey for Visiting Professionals</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Anyone opening this link can immediately test galleries, upload 4K films, and build private studio portals. They do <strong>not</strong> need to sign up for Cloudflare, AWS, or any external storage accounts — native zero-egress cloud storage is pre-configured out of the box.
            </p>
          </div>

          {/* Ready-to-Send Invitation Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Ready-to-Send Message (WhatsApp / Email / DM)</span>
              </label>
              <button
                type="button"
                onClick={handleCopyInviteText}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
              >
                {copiedInviteText ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Message Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Full Message</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {invitePitch}
            </div>
          </div>

          {/* Key Differentiators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>Vs. VidFlow</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Delivers 4K 60fps streaming with interactive chapter timelines and client revision timestamps — no $99/mo storage penalty.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vs. Pic-Time</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Zero commission on print lab sales (Pic-Time takes up to 15%). Keeps 100% of profit markups from WHCC, Miller's, and Loxley.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">
            Platform ID: filmandphoto-v1
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
