import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, CreditCard, Sparkles, ExternalLink, AlertCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  onUpgradeSuccess: (planId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  planId,
  onUpgradeSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [studioName, setStudioName] = useState('');
  const [customPaymentLink, setCustomPaymentLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sandboxNotice, setSandboxNotice] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const planDetails: Record<string, { title: string; price: string; period: string; features: string[] }> = {
    solo: {
      title: 'Filmmaker Solo (250 GB)',
      price: '£10',
      period: 'per month (annual)',
      features: ['250 GB Ultra Cloud Vault', '15 Active 4K Client Galleries', '0% Print Store Commission', '4K 60fps HDR Cinema Player'],
    },
    pro: {
      title: 'Studio Pro (1.5 TB)',
      price: '£20',
      period: 'per month (annual)',
      features: ['1,500 GB High-Speed Cloud Storage', 'Unlimited 4K Client Deliveries', 'Custom Domain (films.yourstudio.com)', '0% Commission (WHCC, Miller\'s, Loxley)'],
    },
    elite: {
      title: 'Cinema Agency (5 TB)',
      price: '£36',
      period: 'per month (annual)',
      features: ['5,000 GB Ultra Master Storage Archive', 'Unlimited Everything + Multi-Brand Portals', 'Priority 4K Cloud Transcoding Queue', '5 Team Seats & Migration Concierge'],
    },
    studio: {
      title: 'Studio Pro (1.5 TB)',
      price: '£20',
      period: 'per month (annual)',
      features: ['1,500 GB High-Speed Cloud Storage', 'Unlimited 4K Client Deliveries', 'Custom Domain (films.yourstudio.com)', '0% Commission (WHCC, Miller\'s, Loxley)'],
    },
    lifetime: {
      title: 'Founders Lifetime Pass',
      price: '£179',
      period: 'one-time payment',
      features: ['Lifetime Pro Access Forever', 'Unlimited Client Galleries', 'Never Pay Another Monthly Subscription', 'Founders Badge & Direct Founder Support'],
    },
  };

  const currentPlan = planDetails[planId] || planDetails.pro;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setSandboxNotice(null);

    try {
      const res = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          email,
          filmmakerName: studioName,
          customPaymentLink: customPaymentLink.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (data.checkoutUrl) {
        // Real checkout URL or Payment Link -> Redirect user
        window.location.href = data.checkoutUrl;
        return;
      }

      // If in sandbox mode without configured live Stripe keys
      setIsProcessing(false);
      setSandboxNotice(
        data.message || 'Stripe keys not configured. You can test the studio upgrade flow in Sandbox Test Mode below.'
      );
    } catch (err: any) {
      setIsProcessing(false);
      setSandboxNotice(`Billing endpoint notice: ${err.message}`);
    }
  };

  const handleTestModeProvision = () => {
    setIsCompleted(true);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}
    onUpgradeSuccess(planId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
              Verified Stripe Billing
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
              {currentPlan.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCompleted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-cinzel text-2xl font-bold text-white">
              Studio Tier Activated: {currentPlan.title}
            </h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Your studio configuration has been provisioned with expanded capacity.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 py-3 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
            >
              Enter Studio Workspace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plan Price Banner */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400">Subscription Tier</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-cinzel text-3xl font-extrabold text-white">{currentPlan.price}</span>
                  <span className="text-xs text-neutral-400">/{currentPlan.period}</span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                Direct Stripe Gateway
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Studio Email Address
              </label>
              <input
                type="email"
                required
                placeholder="filmmaker@yourstudio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Filmmaker Studio Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lumina Cinema Co."
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Sandbox Notice Banner */}
            {sandboxNotice && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-amber-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Stripe Sandbox Environment</span>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{sandboxNotice}</p>
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={handleTestModeProvision}
                    className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
                  >
                    Provision Test Mode Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setSandboxNotice(null)}
                    className="py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {!sandboxNotice && (
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Connecting to Stripe Gateway...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Proceed to Stripe Checkout</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 256-bit Encrypted · Verified Stripe Gateway</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
