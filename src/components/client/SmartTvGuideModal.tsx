import React, { useState } from 'react';
import { X, Tv, Cast, Smartphone, MonitorPlay, Usb, CheckCircle2 } from 'lucide-react';

interface SmartTvGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalUrl: string;
}

export const SmartTvGuideModal: React.FC<SmartTvGuideModalProps> = ({
  isOpen,
  onClose,
  portalUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'airplay' | 'chromecast' | 'tv-browser' | 'usb'>('airplay');
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white">
                How to Watch on Your Big Screen TV
              </h3>
              <p className="text-xs text-neutral-400">
                Experience your films in 4K with cinema surround sound
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

        {/* Tab buttons */}
        <div className="grid grid-cols-4 gap-2 mb-6 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab('airplay')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'airplay'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Apple AirPlay</span>
            <span className="sm:hidden">AirPlay</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chromecast')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'chromecast'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Cast className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chromecast</span>
            <span className="sm:hidden">Cast</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tv-browser')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'tv-browser'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TV Browser</span>
            <span className="sm:hidden">Browser</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('usb')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'usb'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">USB Drive</span>
            <span className="sm:hidden">USB</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-5 mb-6 text-sm text-neutral-300">
          {activeTab === 'airplay' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                AirPlay from iPhone, iPad, or Mac
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-300 leading-relaxed">
                <li>Make sure your Apple TV or AirPlay 2-compatible Smart TV (Samsung, LG, Sony, Vizio) is on the same Wi-Fi network.</li>
                <li>Start playing your film in this gallery on your iPhone, iPad, or Mac.</li>
                <li>Tap the AirPlay icon <span className="font-mono bg-neutral-800 px-1.5 py-0.5 rounded text-amber-300">AirPlay</span> in the media player or swipe down your iOS Control Center.</li>
                <li>Select your living room TV. Sit back and enjoy in full 4K with cinematic audio!</li>
              </ol>
            </div>
          )}

          {activeTab === 'chromecast' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Cast className="w-4 h-4 text-amber-400" />
                Google Cast / Android TV
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-300 leading-relaxed">
                <li>Open this gallery link inside Google Chrome on your phone, tablet, or laptop.</li>
                <li>Click the three dots in Chrome and select <span className="font-medium text-amber-400">"Cast..."</span> (or tap the Cast badge on Android).</li>
                <li>Select your Chromecast, Sony Bravia, TCL, or Google TV.</li>
                <li>Choose "Cast tab" to mirror the film player directly in pristine resolution.</li>
              </ol>
            </div>
          )}

          {activeTab === 'tv-browser' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <MonitorPlay className="w-4 h-4 text-amber-400" />
                Open Directly in Smart TV Web Browser
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-300 leading-relaxed">
                <li>Grab your TV remote and open your Smart TV’s Web Browser (available on LG webOS, Samsung Tizen, Android TV).</li>
                <li>Type this portal URL into the TV address bar:</li>
              </ol>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  readOnly
                  value={portalUrl}
                  className="flex-1 font-mono text-xs bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-lg text-neutral-200 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white flex items-center gap-1"
                >
                  {copiedUrl ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'usb' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Usb className="w-4 h-4 text-amber-400" />
                Direct USB Hard Drive Playback (Highest 4K Quality)
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-300 leading-relaxed">
                <li>Go to the <span className="font-semibold text-amber-400">Master Downloads Vault</span> section below and download the 4K Master MP4 file to your computer.</li>
                <li>Copy the downloaded film file onto a high-speed USB flash drive or portable SSD.</li>
                <li>Plug the USB drive into the USB port on the back or side of your Smart TV.</li>
                <li>Open your TV’s built-in Media Player app. This yields 100% native uncompressed 4K bitrate without any Wi-Fi buffering!</li>
              </ol>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs transition-colors"
          >
            Ready to Watch
          </button>
        </div>
      </div>
    </div>
  );
};
