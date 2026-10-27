import React, { useState } from 'react';
import {
  Film, Play, CheckCircle2, DollarSign, ShieldCheck, ArrowRight,
  Tv, Sparkles, Star, ChevronDown, HelpCircle, Layers, HardDrive, Eye,
  Lock, RefreshCw, Zap, Users, Globe, ShoppingBag, Check, X as CloseIcon
} from 'lucide-react';
import { calculateVidflowSavings } from '../../utils/storageHelpers';

interface LandingPageProps {
  onEnterStudio: () => void;
  onViewDemoGallery: () => void;
  onOpenCheckout: (planId: string) => void;
  onOpenMigration: () => void;
  onOpenLegal: () => void;
  onOpenOnboarding: (planId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterStudio,
  onViewDemoGallery,
  onOpenCheckout,
  onOpenMigration,
  onOpenLegal,
  onOpenOnboarding,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [currency, setCurrency] = useState<'GBP' | 'USD'>('GBP');
  const [calculatorWeddings, setCalculatorWeddings] = useState(25);
  const [calculatorGb, setCalculatorGb] = useState(60);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const savings = calculateVidflowSavings(calculatorWeddings, calculatorGb);

  const faqs = [
    {
      q: 'How does Film & Photo beat VidFlow and Pic-Time in pricing?',
      a: 'VidFlow charges up to $99/mo for 4K streaming plus $15/mo for extra 500GB storage packs, while locking client links after 24 months. Pic-Time charges $34–$50/mo and takes a 15% commission cut on all your print store sales. Film & Photo offers true uncompressed 4K 60fps streaming, 0% print commission, and high-capacity native cloud storage starting at just £10/mo ($13/mo).',
    },
    {
      q: 'Do client delivery links ever expire after 2 years like VidFlow?',
      a: 'Never. Unlike VidFlow, which deletes or locks client links after 24 months unless renewal ransoms are paid, Film & Photo links are archival and stay active for your couples for life.',
    },
    {
      q: 'How does the 0% print commission work with WHCC, Miller\'s, and Loxley Colour?',
      a: 'When your clients order heirloom albums, museum wall frames, or fine-art prints through your gallery, you pay only the wholesale lab cost. You keep 100% of your retail markup. Competitors take up to 15% of your gross sales—we take 0%.',
    },
    {
      q: 'Can couples watch their films on their Smart TVs?',
      a: 'Yes! Film & Photo includes built-in 4K AirPlay, Chromecast, and Smart TV browser playback with interactive chapter timelines so couples can experience their film on the biggest screen in their home.',
    },
    {
      q: 'Can I connect my own custom domain (e.g. films.mystudio.com)?',
      a: 'Yes. Studio Pro and Agency plans include custom domain CNAME routing with automated free SSL certificates. Your clients see your brand exclusively, with zero platform branding.',
    },
    {
      q: 'Can I migrate my existing galleries from VidFlow or Pic-Time?',
      a: 'Yes! Our 1-Click Migration Importer automatically transfers your films, chapter timestamps, and download packages in under 60 seconds. Our VIP concierge team is also available to migrate your full catalog for free on Studio Pro & Agency plans.',
    },
  ];

  const pricingTiers = [
    {
      id: 'solo',
      name: 'Filmmaker Solo',
      subtitle: 'For solo cinematographers delivering boutique weddings.',
      storage: '250 GB',
      storageNote: 'Ultra-fast cloud storage ($0 egress)',
      priceGBP: billingCycle === 'annual' ? 10 : 14,
      priceUSD: billingCycle === 'annual' ? 13 : 18,
      annualBilledGBP: '£120 / year',
      annualBilledUSD: '$156 / year',
      vsNote: 'Beats VidFlow Starter ($29/mo) by over 50%',
      deliveries: '15 Active 4K Client Galleries',
      features: [
        'True 4K 60fps HDR Cinema Player',
        'Interactive Scene Chapters & Timeline',
        '0% Print Commission (keep 100% of markups)',
        'Full HD & 4K ProRes Master Downloads',
        'Smart TV AirPlay & Chromecast Delivery',
        'Studio Subdomain (yourstudio.filmandphoto.uk)',
      ],
      ctaText: 'Start 14-Day Free Trial',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Studio Pro',
      subtitle: 'The ultimate Vidflow & Pic-Time replacement for busy studios.',
      storage: '1.5 TB (1,500 GB)',
      storageNote: 'Enough for 35+ full wedding seasons',
      priceGBP: billingCycle === 'annual' ? 20 : 28,
      priceUSD: billingCycle === 'annual' ? 25 : 35,
      annualBilledGBP: '£240 / year',
      annualBilledUSD: '$300 / year',
      vsNote: 'Saves £350+/yr vs VidFlow Plus & Pic-Time combo',
      deliveries: 'Unlimited 4K Client Galleries',
      features: [
        'Unlimited 4K 60fps Client Deliveries',
        '1,500 GB High-Speed Native Cloud Vault',
        'Full Custom Domain White-Labeling (films.yourstudio.com)',
        '0% Commission on WHCC, Miller\'s & Loxley Colour',
        'Client Timestamped Video Revisions & Notes',
        'Apple ProRes 422 & Multi-Cut Archival Downloads',
        '2 Team Seats & Private Studio Portal',
        'Client Password & PIN Passcode Vault',
      ],
      ctaText: 'Start 14-Day Free Trial',
      popular: true,
    },
    {
      id: 'elite',
      name: 'Cinema Agency',
      subtitle: 'For high-volume production houses & cinema collectives.',
      storage: '5 TB (5,000 GB)',
      storageNote: 'Ultra high-capacity master archive',
      priceGBP: billingCycle === 'annual' ? 36 : 48,
      priceUSD: billingCycle === 'annual' ? 45 : 59,
      annualBilledGBP: '£432 / year',
      annualBilledUSD: '$540 / year',
      vsNote: 'Saves over £600/yr vs VidFlow Pro ($99/mo)',
      deliveries: 'Unlimited Everything',
      features: [
        '5,000 GB Ultra Master Archive ($0 Egress)',
        'Multi-Brand Studio Portals & Dedicated Subdomains',
        'Priority 4K Cloud Transcoding Queue',
        '5 Team Seats with Granular Role Permissions',
        'Free VIP Migration Concierge from VidFlow & Pic-Time',
        'Custom Self-Fulfillment Lab & Local Print Routing',
        'Dedicated VIP Account Director',
      ],
      ctaText: 'Start 14-Day Free Trial',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Launch Offer Banner */}
      <div className="bg-gradient-to-r from-amber-950/90 via-neutral-900 to-amber-950/90 border-b border-amber-900/40 px-3 sm:px-4 py-2 text-center text-xs text-amber-200 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-center">
          <strong>Launch Season Offer:</strong> 14-day free trial on all plans. Switch from VidFlow or Pic-Time with 0% print commission.
        </span>
        <button
          type="button"
          onClick={() => onOpenOnboarding('pro')}
          className="underline font-bold text-amber-300 hover:text-white ml-1 shrink-0"
        >
          Claim Free Trial &rarr;
        </button>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 px-4 overflow-hidden text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">The New Gold Standard for Wedding Cinematographers & Photographers</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Deliver Luxury 4K Cinema. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              Without VidFlow & Pic-Time Taxes.
            </span>
          </h1>

          <p className="text-neutral-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Give couples boutique Netflix-style 4K 60fps portals, interactive scene chapters, and integrated fine-art print stores. Keep 100% of print markups with high-capacity cloud storage starting at £10/mo.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={() => onOpenOnboarding('pro')}
              className="py-3.5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-xl shadow-amber-500/25 hover:scale-105"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onViewDemoGallery}
              className="py-3.5 px-7 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current text-amber-400" />
              <span>Experience 4K Client Portal</span>
            </button>

            <button
              type="button"
              onClick={onOpenMigration}
              className="py-3.5 px-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-300 text-xs sm:text-sm flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Migrate from VidFlow / Pic-Time</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-neutral-400 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              0% Print Store Commission
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Native 4K 60fps HDR
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Links Never Expire (No 2-Yr Fees)
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Custom White-Label Domains
            </span>
          </div>
        </div>

        {/* Hero Preview Interactive Showcase Mockup */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto px-2">
          <div className="relative rounded-3xl border border-neutral-800 bg-neutral-900/80 p-2 sm:p-4 shadow-2xl overflow-hidden group">
            <div className="aspect-video w-full rounded-2xl overflow-hidden relative bg-black">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
                alt="Cinema Gallery Preview"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-black/40 flex flex-col justify-between p-6 sm:p-10">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-amber-300">
                    4K UHD · 60fps Cinema Stream
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                    Integrated WHCC / Miller's Store
                  </span>
                </div>

                <div className="text-left space-y-2">
                  <div className="text-xs uppercase tracking-widest text-amber-400 font-cinzel">
                    The Wedding Feature Film
                  </div>
                  <h3 className="font-cinzel text-2xl sm:text-4xl font-bold text-white">
                    Sophia & Alexander · Château de Villette
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 max-w-lg line-clamp-2">
                    Master 4K cinema cut with interactive chapters, lossless downloads, and fine-art album store.
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onViewDemoGallery}
                      className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch Full 4K Gallery</span>
                    </button>
                    <span className="text-xs text-neutral-400 hidden sm:inline">
                      Includes Smart TV mode, chapter markers, and client guestbook
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON SHOWDOWN SECTION */}
      <section id="comparison" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-neutral-800">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
            Side-By-Side Showdown
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mt-2">
            Why Professionals Are Leaving VidFlow & Pic-Time
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-2xl mx-auto">
            Traditional delivery platforms force you to compromise: either pay punishing monthly storage fees or forfeit your print sales profits. Film & Photo gives you both at a lower price.
          </p>
        </div>

        {/* Feature Matrix Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/80">
                  <th className="py-4 px-6 text-xs font-cinzel font-bold text-neutral-400 uppercase">
                    Feature & Standard
                  </th>
                  <th className="py-4 px-6 text-xs font-cinzel font-extrabold text-amber-400 uppercase bg-amber-500/10 border-x border-amber-500/20">
                    Film & Photo (Us)
                  </th>
                  <th className="py-4 px-6 text-xs font-cinzel font-bold text-neutral-400 uppercase">
                    VidFlow
                  </th>
                  <th className="py-4 px-6 text-xs font-cinzel font-bold text-neutral-400 uppercase">
                    Pic-Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-xs">
                <tr>
                  <td className="py-4 px-6 font-semibold text-white">
                    Starting Monthly Price
                  </td>
                  <td className="py-4 px-6 bg-amber-500/5 border-x border-amber-500/20 font-bold text-emerald-400 font-mono">
                    £10 / mo ($13/mo)
                  </td>
                  <td className="py-4 px-6 text-neutral-400 font-mono">
                    $29 / mo (1080p limit)
                  </td>
                  <td className="py-4 px-6 text-neutral-400 font-mono">
                    $34 / mo + $18 video add-on
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-semibold text-white">
                    Print Lab Sales Commission
                  </td>
                  <td className="py-4 px-6 bg-amber-500/5 border-x border-amber-500/20 font-bold text-emerald-400">
                    0% Commission (Keep 100%)
                  </td>
                  <td className="py-4 px-6 text-neutral-400">
                    No integrated print store
                  </td>
                  <td className="py-4 px-6 text-rose-400 font-semibold">
                    Takes up to 15% commission
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-semibold text-white">
                    True 4K 60fps HDR Streaming
                  </td>
                  <td className="py-4 px-6 bg-amber-500/5 border-x border-amber-500/20 font-bold text-emerald-400">
                    Included on all plans
                  </td>
                  <td className="py-4 px-6 text-neutral-400">
                    Only 3/yr or requires $99/mo Pro
                  </td>
                  <td className="py-4 px-6 text-neutral-400">
                    Basic 1080p video player
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-semibold text-white">
                    Client Gallery Expiration
                  </td>
                  <td className="py-4 px-6 bg-amber-500/5 border-x border-amber-500/20 font-bold text-emerald-400">
                    Never expires (Lifetime access)
                  </td>
                  <td className="py-4 px-6 text-rose-400 font-semibold">
                    Expires after 24 months ($60 renewal)
                  </td>
                  <td className="py-4 px-6 text-neutral-400">
                    Storage locked if inactive
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-semibold text-white">
                    Custom Domain White-Labeling
                  </td>
                  <td className="py-4 px-6 bg-amber-500/5 border-x border-amber-500/20 font-bold text-white">
                    Included (films.yourstudio.com)
                  </td>
                  <td className="py-4 px-6 text-neutral-400">
                    Requires higher tiers
                  </td>
                  <td className="py-4 px-6 text-neutral-400">
                    Subdomain only on standard
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-semibold text-white">
                    Integrated Labs
                  </td>
                  <td className="py-4 px-6 bg-amber-500/5 border-x border-amber-500/20 font-bold text-amber-300">
                    WHCC, Miller's & Loxley Colour
                  </td>
                  <td className="py-4 px-6 text-neutral-400">
                    None
                  </td>
                  <td className="py-4 px-6 text-neutral-400">
                    Lab network (with 15% cut)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING PLANS SECTION (MONTHLY / ANNUAL TOGGLE) */}
      <section id="pricing" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-neutral-800">
        <div className="text-center mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
            Unbeatable Pricing
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mt-1">
            Choose Your Storage & Studio Plan
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
            Transparent pricing with zero hidden upload fees or expiration ransoms.
          </p>

          {/* Billing Controls: Monthly vs Annual + Currency */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <div className="p-1 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
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
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Annual Pay</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-950 text-amber-300 font-mono">
                  Save 25% + 2 Mo Free
                </span>
              </button>
            </div>

            <div className="p-1 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setCurrency('GBP')}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-colors ${
                  currency === 'GBP' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400'
                }`}
              >
                GBP (£)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-colors ${
                  currency === 'USD' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => {
            const price = currency === 'GBP' ? `£${tier.priceGBP}` : `$${tier.priceUSD}`;
            const annualBilled = currency === 'GBP' ? tier.annualBilledGBP : tier.annualBilledUSD;

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all ${
                  tier.popular
                    ? 'bg-neutral-900/90 border-amber-500/70 shadow-2xl shadow-amber-500/10'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-neutral-950 font-extrabold text-[10px] font-mono uppercase tracking-wider shadow-md">
                    Most Popular · Competitor Killer
                  </div>
                )}

                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1 min-h-[32px]">{tier.subtitle}</p>

                  {/* Price */}
                  <div className="my-5">
                    <div className="flex items-baseline gap-1">
                      <span className="font-cinzel text-4xl sm:text-5xl font-extrabold text-white">
                        {price}
                      </span>
                      <span className="text-xs text-neutral-400 font-sans">/ month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <span className="text-xs font-mono text-emerald-400 block mt-1">
                        Billed annually ({annualBilled})
                      </span>
                    )}
                  </div>

                  {/* Storage Pill */}
                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                        Storage Included
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {tier.storage}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">{tier.storageNote}</p>
                  </div>

                  <div className="text-[11px] font-semibold text-emerald-400 mb-4 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{tier.vsNote}</span>
                  </div>

                  <div className="text-xs font-bold text-neutral-200 mb-2">
                    {tier.deliveries}
                  </div>

                  <ul className="space-y-2.5 text-xs text-neutral-300">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => onOpenOnboarding(tier.id)}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                      tier.popular
                        ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/25 hover:scale-105'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center text-neutral-400 mt-2">
                    No credit card required to start
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ROI SAVINGS CALCULATOR */}
      <section id="calculator" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto border-t border-neutral-800">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 font-cinzel">
              Interactive ROI
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white mt-1">
              Calculate Your Yearly Vidflow & Pic-Time Savings
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              See how much pure profit stays in your production company each wedding season.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-neutral-300">
                  Weddings / Projects per Year
                </label>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                  {calculatorWeddings} Weddings
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={calculatorWeddings}
                onChange={(e) => setCalculatorWeddings(parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-800 accent-amber-500 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-neutral-300">
                  Average GB Uploaded per Wedding
                </label>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                  {calculatorGb} GB
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={calculatorGb}
                onChange={(e) => setCalculatorGb(parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-800 accent-amber-500 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-6 text-center">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Estimated 5-Year Capital Saved
            </span>
            <div className="font-cinzel text-4xl sm:text-6xl font-extrabold text-emerald-300 my-2">
              £{savings.fiveYearSavings.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-300">
              Enough to upgrade to a Sony FX6 cinema package or master prime lens kit without borrowing.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto border-t border-neutral-800">
        <div className="text-center mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
            Got Questions?
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-amber-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
              <Film className="w-3.5 h-3.5" />
            </div>
            <span className="font-cinzel font-bold text-white tracking-wide">
              FILM & PHOTO
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#why-us" className="hover:text-white transition-colors">Why Us</a>
            <a href="#comparison" className="hover:text-white transition-colors">Competitor Showdown</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing & Storage</a>
            <button type="button" onClick={onOpenLegal} className="hover:text-white transition-colors">
              Terms & Privacy
            </button>
            <button type="button" onClick={onEnterStudio} className="text-amber-400 font-semibold hover:underline">
              Enter Studio Portal &rarr;
            </button>
          </div>

          <p className="text-[11px] text-neutral-400">
            &copy; {new Date().getFullYear()} Film & Photo. Built for elite wedding filmmakers.
          </p>
        </div>
      </footer>
    </div>
  );
};
