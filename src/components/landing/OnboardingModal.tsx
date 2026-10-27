import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Film, Building2, ArrowRight, Zap, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
  onComplete: (data: {
    studioName: string;
    subdomain: string;
    filmmakerName: string;
    email: string;
    planId: string;
    billingCycle: 'monthly' | 'annual';
  }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  initialPlanId = 'pro',
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [studioName, setStudioName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [filmmakerName, setFilmmakerName] = useState('');
  const [email, setEmail] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlanId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStudioNameChange = (name: string) => {
    setStudioName(name);
    if (!subdomain || subdomain === slugify(studioName)) {
      setSubdomain(slugify(name));
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 24);
  };

  const plans = [
    {
      id: 'solo',
      name: 'Filmmaker Solo',
      storage: '250 GB',
      storageNote: 'High-speed cloud vault',
      monthlyPrice: '£14',
      annualPrice: '£10',
      annualBilled: '£120/yr',
      vsCompetitor: 'Save 55% vs VidFlow Starter ($29/mo)',
      deliveries: '15 Active 4K Client Galleries',
      features: [
        '4K 60fps HDR Cinema Player',
        '0% Print Commission (keep 100% of profit)',
        'Interactive Scene Chapters & Timeline',
        'Direct 4K ProRes & MP4 Master Downloads',
        'Smart TV AirPlay & Chromecast Support',
      ],
    },
    {
      id: 'pro',
      name: 'Studio Pro',
      popular: true,
      storage: '1.5 TB (1,500 GB)',
      storageNote: 'Enough for 35+ full wedding seasons',
      monthlyPrice: '£28',
      annualPrice: '£20',
      annualBilled: '£240/yr',
      vsCompetitor: 'VidFlow charges $49/mo; Pic-Time charges $68/mo',
      deliveries: 'Unlimited 4K Client Galleries',
      features: [
        'Unlimited 4K 60fps Client Deliveries',
        'Full Custom Domain White-Labeling (films.yourbrand.com)',
        '0% Commission on WHCC, Miller\'s & Loxley Colour',
        'Client Timestamped Video Revisions & Notes',
        'Master ProRes & Multi-Resolution Downloads',
        '2 Team Seats & Dedicated Studio Portal',
      ],
    },
    {
      id: 'elite',
      name: 'Cinema Agency',
      storage: '5 TB (5,000 GB)',
      storageNote: 'Ultra high-capacity studio archive',
      monthlyPrice: '£48',
      annualPrice: '£36',
      annualBilled: '£432/yr',
      vsCompetitor: 'VidFlow Pro charges $99/mo ($1,188/yr)',
      deliveries: 'Unlimited Everything',
      features: [
        '5,000 GB Ultra Cloud Archive ($0 Egress)',
        'Multi-Brand Portals & Custom Subdomains',
        'Priority 4K Cloud Transcoding Queue',
        '5 Team Member Seats & Role Permissions',
        '1-Click VidFlow / Pic-Time Migration Concierge',
        'Dedicated VIP Account Director',
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!studioName.trim() || !email.trim()) return;
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}
      onComplete({
        studioName: studioName || 'My Cinema Studio',
        subdomain: subdomain || 'studio',
        filmmakerName: filmmakerName || 'Lead Cinematographer',
        email,
        planId: selectedPlan,
        billingCycle,
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 bg-neutral-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-neutral-800 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  {step === 1 ? 'Create Your Studio Portal' : 'Select Your Storage & Plan'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Step {step} of 2
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {step === 1
                  ? 'Join leading wedding cinematographers delivering 4K HDR client galleries.'
                  : '14-day full-access trial · Zero risk · No credit card required to start.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Studio or Brand Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luminary Wedding Cinema"
                  value={studioName}
                  onChange={(e) => handleStudioNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Your Studio Subdomain (Free SSL Included)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-neutral-800 border border-r-0 border-neutral-700 rounded-l-xl text-xs text-neutral-400 font-mono">
                    https://
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="luminary"
                    value={subdomain}
                    onChange={(e) => setSubdomain(slugify(e.target.value))}
                    className="flex-1 px-3 py-2.5 bg-neutral-950 border-y border-neutral-700 text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                  <span className="px-3 py-2.5 bg-neutral-800 border border-l-0 border-neutral-700 rounded-r-xl text-xs text-neutral-400 font-mono">
                    .filmandphoto.uk
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  You can also connect your own custom domain (e.g. <span className="text-neutral-300 font-mono">films.yourbrand.com</span>) in your studio dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Lead Filmmaker / Photographer Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Julian Hayes"
                    value={filmmakerName}
                    onChange={(e) => setFilmmakerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Studio Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="julian@luminaryfilms.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Trust Box */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-3 text-xs text-neutral-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">
                    Instant White-Label Workspace
                  </strong>
                  Your clients will never see third-party ads, VidFlow logos, or upload watermarks. You retain 100% ownership of all media and print store markups.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Billing Route Switcher */}
              <div className="flex items-center justify-center">
                <div className="p-1 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-neutral-800 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Monthly Subscription
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      billingCycle === 'annual'
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>Annual Pay</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-950 text-amber-300 font-mono">
                      Save 25% + 2 Mo Free
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {plans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-neutral-950 border-amber-500/80 shadow-lg shadow-amber-500/10'
                          : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-bold text-[9px] font-mono uppercase tracking-wider">
                          Best Value
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-cinzel text-sm font-bold text-white">{plan.name}</h4>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-amber-400 bg-amber-400' : 'border-neutral-600'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-neutral-950" />}
                          </div>
                        </div>

                        <div className="mt-2 mb-3">
                          <div className="flex items-baseline gap-1">
                            <span className="font-cinzel text-2xl font-bold text-white">{price}</span>
                            <span className="text-[11px] text-neutral-400 font-sans">/mo</span>
                          </div>
                          {billingCycle === 'annual' && (
                            <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                              Billed {plan.annualBilled}
                            </span>
                          )}
                        </div>

                        <div className="py-2 px-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 mb-3">
                          <div className="text-xs font-bold text-amber-300 font-mono">{plan.storage}</div>
                          <div className="text-[10px] text-neutral-400 leading-tight">{plan.storageNote}</div>
                        </div>

                        <div className="text-[11px] font-medium text-emerald-400 mb-2">
                          {plan.vsCompetitor}
                        </div>

                        <ul className="space-y-1.5 text-[11px] text-neutral-300">
                          {plan.features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                              <span className="leading-tight">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Free Trial Guarantee */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-neutral-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>14-Day Free Trial included.</strong> No charge today. Start uploading immediately.
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">
                  £0.00 Due Today
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                &larr; Back to Details
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-7 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25 ml-auto"
            >
              {isSubmitting ? (
                <span>Launching Studio...</span>
              ) : step === 1 ? (
                <>
                  <span>Continue to Plan Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Start 14-Day Free Trial → Launch Studio</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
