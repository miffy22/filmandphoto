import React from 'react';
import { X, TrendingUp, Eye, Download, Tv, Smartphone, Monitor, Globe, HardDrive } from 'lucide-react';
import { ClientProject } from '../../types/cineflow';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ClientProject[];
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  projects,
}) => {
  if (!isOpen) return null;

  const totalViews = projects.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalDownloads = projects.reduce((acc, p) => acc + (p.downloadsCount || 0), 0);
  const totalBandwidthGb = Math.round(totalDownloads * 8.5 + totalViews * 1.2);
  const dollarsSaved = Math.round(totalBandwidthGb * 0.95);

  const recentEvents = [
    {
      id: 'ev1',
      client: 'Elena & Julian',
      action: '4K Film Stream Started',
      device: 'Apple TV 4K (AirPlay)',
      location: 'Milan, Italy',
      time: '22 minutes ago',
    },
    {
      id: 'ev2',
      client: 'Elena & Julian',
      action: 'Downloaded Master 4K ProRes (16.8 GB)',
      device: 'MacBook Pro · Safari',
      location: 'Ravello, Italy',
      time: '2 hours ago',
    },
    {
      id: 'ev3',
      client: 'Aria & Liam',
      action: 'Viewed Chapter "The Vows Under Canopies"',
      device: 'iPhone 16 Pro · iOS',
      location: 'San Francisco, CA',
      time: '5 hours ago',
    },
    {
      id: 'ev4',
      client: 'Vanguard Motors',
      action: 'Commercial Master 4444 XQ Downloaded',
      device: 'Desktop Workstation',
      location: 'Paris, France',
      time: 'Yesterday',
    },
    {
      id: 'ev5',
      client: 'Elena & Julian',
      action: 'Love Note posted by Claudia Vance (Mother)',
      device: 'iPad Air',
      location: 'New York, NY',
      time: '2 days ago',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                Client Stream & Delivery Analytics
              </h3>
              <p className="text-xs text-neutral-400">
                Live engagement telemetry across all active client galleries.
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Views</span>
            <div className="font-cinzel text-2xl font-bold text-white mt-1">{totalViews}</div>
            <span className="text-[10px] text-neutral-500">Across all films</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">4K Downloads</span>
            <div className="font-cinzel text-2xl font-bold text-white mt-1">{totalDownloads}</div>
            <span className="text-[10px] text-neutral-500">Master archives</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Traffic Streamed</span>
            <div className="font-cinzel text-2xl font-bold text-amber-400 mt-1">{totalBandwidthGb} GB</div>
            <span className="text-[10px] text-neutral-500">$0 egress fee paid</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Vidflow Saved</span>
            <div className="font-cinzel text-2xl font-bold text-emerald-300 mt-1">${dollarsSaved}</div>
            <span className="text-[10px] text-emerald-400/80">In bandwidth markups</span>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 mb-6">
          <span className="text-xs font-semibold text-neutral-300 mb-3 block">
            Client Viewing Device Breakdown
          </span>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-850">
              <Tv className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-white">44% Smart TV</span>
                <p className="text-[10px] text-neutral-400">Apple TV & AirPlay</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-850">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <div>
                <span className="font-bold text-white">38% Mobile</span>
                <p className="text-[10px] text-neutral-400">iOS & Android</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-850">
              <Monitor className="w-5 h-5 text-purple-400" />
              <div>
                <span className="font-bold text-white">18% Desktop</span>
                <p className="text-[10px] text-neutral-400">Mac & PC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div>
          <span className="text-xs font-semibold text-neutral-300 mb-3 block">
            Recent Client Activity Log
          </span>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {recentEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white">{ev.client}</strong>
                    <span className="text-neutral-500">·</span>
                    <span className="text-amber-400">{ev.action}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-2">
                    <span>{ev.device}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {ev.location}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 shrink-0">{ev.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
