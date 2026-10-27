import React, { useState } from 'react';
import {
  X, ShoppingBag, DollarSign, TrendingUp, Sliders, CheckCircle2,
  Package, Truck, ArrowUpRight, ShieldCheck, RefreshCw, Sparkles, Building2
} from 'lucide-react';
import { ClientProject, PrintLabProvider, StoreOrder } from '../../types/cineflow';
import { DEFAULT_PRINT_PRODUCTS, PRINT_LAB_INFO } from '../../data/printCatalog';

interface PrintLabManagerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ClientProject[];
  onUpdateProjectLabSettings: (projectId: string, lab: PrintLabProvider, markup: number) => void;
}

export const PrintLabManager: React.FC<PrintLabManagerProps> = ({
  isOpen,
  onClose,
  projects,
  onUpdateProjectLabSettings,
}) => {
  const [selectedLab, setSelectedLab] = useState<PrintLabProvider>('whcc');
  const [globalMarkup, setGlobalMarkup] = useState<number>(350); // 350% markup
  const [activeTab, setActiveTab] = useState<'labs' | 'pricesheet' | 'orders' | 'payouts'>('pricesheet');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // Aggregate all orders across projects
  const allOrders: StoreOrder[] = projects.flatMap((p) => p.orders || []);
  const totalStoreSales = allOrders.reduce((acc, o) => acc + o.total, 0);
  const totalLabCosts = allOrders.reduce((acc, o) => acc + o.labCostTotal, 0);
  const totalNetProfit = totalStoreSales - totalLabCosts;

  const handleSaveSettings = () => {
    projects.forEach((p) => {
      onUpdateProjectLabSettings(p.id, selectedLab, globalMarkup);
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-5xl w-full my-6 p-6 sm:p-8 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
                Filmmaker Revenue Engine
              </span>
              <span className="text-xs bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-mono px-2 py-0.5 rounded">
                Integrated Print Labs & Pic-Time Parity
              </span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              Print Lab Fulfillment & E-Commerce Store
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              Monetize every wedding and commercial film gallery. Clients order luxury leather albums, framed fine art, and 4K USB boxes directly from WHCC and Miller's while you pocket 75%+ profit margins.
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

        {/* Revenue Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>Gross Client Store Sales</span>
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-cinzel text-3xl font-bold text-white">
              ${totalStoreSales.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Direct from couples & wedding guests</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>Lab Production Costs</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="font-cinzel text-3xl font-bold text-neutral-300">
              ${totalLabCosts.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Automated fulfillment via {PRINT_LAB_INFO[selectedLab].name}</p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60">
            <div className="flex items-center justify-between text-emerald-400 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider">Your Net Profit Payout</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-cinzel text-3xl font-extrabold text-emerald-300">
              ${totalNetProfit.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-1">Paid directly to your bank via Stripe Connect</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-2 mb-6 p-1 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('pricesheet')}
            className={`py-2 px-3 rounded-xl transition-colors ${
              activeTab === 'pricesheet' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Price Sheet & Profit Markup
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('labs')}
            className={`py-2 px-3 rounded-xl transition-colors ${
              activeTab === 'labs' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Connected Print Labs
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-3 rounded-xl transition-colors ${
              activeTab === 'orders' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Client Orders ({allOrders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payouts')}
            className={`py-2 px-3 rounded-xl transition-colors ${
              activeTab === 'payouts' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Stripe Payouts
          </button>
        </div>

        {/* TAB 1: PRICE SHEET & MARKUP ENGINE */}
        {activeTab === 'pricesheet' && (
          <div className="space-y-6">
            {/* Global Markup Slider */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">Global Retail Markup Multiplier</h4>
                  <p className="text-xs text-neutral-400">
                    Automatically scales your retail pricing across all albums, frames, and fine art prints.
                  </p>
                </div>
                <span className="text-base font-mono font-bold text-amber-400 bg-amber-950 border border-amber-800 px-3 py-1 rounded-xl shrink-0">
                  +{globalMarkup}% Markup
                </span>
              </div>

              <input
                type="range"
                min="100"
                max="600"
                step="25"
                value={globalMarkup}
                onChange={(e) => setGlobalMarkup(parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-800 accent-amber-500 rounded-lg cursor-pointer"
              />

              <div className="flex gap-2">
                {[150, 250, 350, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setGlobalMarkup(preset)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      globalMarkup === preset ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    +{preset}%
                  </button>
                ))}
              </div>
            </div>

            {/* Live Pricing Breakdown Table */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-neutral-800 flex justify-between items-center text-xs">
                <span className="font-semibold text-white">Catalog Products & Profit Margins</span>
                <span className="text-neutral-400 font-mono">Wholesale Lab: {PRINT_LAB_INFO[selectedLab].name}</span>
              </div>

              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 uppercase font-mono text-[10px] bg-neutral-900/60 sticky top-0">
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Size</th>
                      <th className="p-3 text-neutral-400">Lab Cost</th>
                      <th className="p-3 text-white">Retail Client Price</th>
                      <th className="p-3 text-emerald-400 font-bold">Your Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850 text-neutral-300">
                    {DEFAULT_PRINT_PRODUCTS.map((prod) => {
                      const calculatedRetail = Math.round(prod.labCost * (1 + globalMarkup / 100));
                      const profit = calculatedRetail - prod.labCost;

                      return (
                        <tr key={prod.id} className="hover:bg-neutral-900/40">
                          <td className="p-3 font-semibold text-white">{prod.name}</td>
                          <td className="p-3 font-mono text-neutral-400">{prod.size}</td>
                          <td className="p-3 font-mono text-neutral-400">${prod.labCost.toFixed(2)}</td>
                          <td className="p-3 font-mono font-bold text-white">${calculatedRetail.toFixed(2)}</td>
                          <td className="p-3 font-mono font-bold text-emerald-400">
                            +${profit.toFixed(2)} ({globalMarkup}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                {saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                <span>{saveSuccess ? 'Price Sheets Updated!' : 'Apply Markups to All Client Galleries'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CONNECTED PRINT LABS */}
        {activeTab === 'labs' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.keys(PRINT_LAB_INFO) as PrintLabProvider[]).map((labKey) => {
                const lab = PRINT_LAB_INFO[labKey];
                const isSelected = selectedLab === labKey;

                return (
                  <div
                    key={labKey}
                    onClick={() => setSelectedLab(labKey)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-neutral-950 border-amber-500 ring-1 ring-amber-500/50'
                        : 'bg-neutral-950/60 border-neutral-800 hover:bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                          {lab.region}
                        </span>
                        {isSelected && (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active Lab
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white">{lab.name}</h4>
                      <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{lab.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
                      <span>Turnaround: <strong>{lab.turnAround}</strong></span>
                      <span className="text-amber-400 font-medium">100% White-Label Drop Ship</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CLIENT ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-neutral-800 flex justify-between items-center text-xs">
                <span className="font-semibold text-white">Live Client Print Orders</span>
                <span className="text-neutral-400">Automated Lab Dispatch Enabled</span>
              </div>

              <div className="divide-y divide-neutral-850 max-h-80 overflow-y-auto">
                {allOrders.map((ord) => (
                  <div key={ord.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">{ord.orderNumber}</span>
                        <span className="text-xs font-semibold text-white">{ord.clientName}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>
                      <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
                        Carrier Tracking: {ord.trackingNumber} · Fulfilled by {PRINT_LAB_INFO[ord.labProvider].name}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-mono font-bold text-white">${ord.total.toFixed(2)}</div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        +${ord.photographerProfit.toFixed(2)} Net Profit
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Stripe Connect Direct Payouts</h4>
                  <p className="text-xs text-neutral-400">
                    Your print lab markup revenue is automatically transferred to your bank account weekly.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-lg">
                Connected & Active
              </span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-neutral-400 block">Next Scheduled Payout</span>
                <strong className="text-white font-mono text-sm">${totalNetProfit.toLocaleString()}</strong>
              </div>
              <span className="text-neutral-400 font-mono">Transfer Date: Friday, October 24</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
          >
            Close Store Manager
          </button>
        </div>
      </div>
    </div>
  );
};
