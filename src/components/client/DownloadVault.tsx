import React, { useState } from 'react';
import { Download, Lock, CheckCircle2, Copy, ShieldCheck, Film, HardDrive, Smartphone, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientProject, FilmDownloadOption } from '../../types/cineflow';

interface DownloadVaultProps {
  project: ClientProject;
  activeFilmDownloads?: FilmDownloadOption[];
  onIncrementDownloadCount?: () => void;
}

export const DownloadVault: React.FC<DownloadVaultProps> = ({
  project,
  activeFilmDownloads,
  onIncrementDownloadCount,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!project.isPasswordProtected);
  const [pinError, setPinError] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Combine film downloads or fallback to project default downloads
  const downloads: FilmDownloadOption[] = activeFilmDownloads && activeFilmDownloads.length > 0
    ? activeFilmDownloads
    : (project.films[0]?.downloads || []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === project.passcode?.trim()) {
      setIsUnlocked(true);
      setPinError(false);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch (err) {}
    } else {
      setPinError(true);
    }
  };

  const handleDownload = (option: FilmDownloadOption) => {
    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#d97706', '#fbbf24', '#ffffff'],
      });
    } catch (err) {}

    if (onIncrementDownloadCount) {
      onIncrementDownloadCount();
    }

    // Trigger download
    const link = document.createElement('a');
    link.href = option.url;
    link.download = `${project.slug}-${option.label.toLowerCase().replace(/\s+/g, '-')}.mp4`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = (option: FilmDownloadOption) => {
    navigator.clipboard.writeText(option.url);
    setCopiedId(option.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!project.allowClientDownloads) {
    return (
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 text-center max-w-2xl mx-auto">
        <Film className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
        <h3 className="font-cinzel text-lg font-bold text-white">Streaming Only Gallery</h3>
        <p className="text-xs text-neutral-400 mt-1">
          Direct downloads are restricted for this exhibition gallery. Please contact {project.branding.studioName} for physical media or custom archival masters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
          Archival Vault
        </span>
        <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mt-1">
          Master Downloads & Archives
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto mt-2">
          Download uncompressed 4K master films for long-term heirloom storage, or grab optimized web cuts for instant mobile sharing.
        </p>
      </div>

      {!isUnlocked ? (
        // PIN Protected Gate
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-8 max-w-md mx-auto text-center shadow-xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="font-cinzel text-lg font-bold text-white">Private Gallery Protected</h4>
          <p className="text-xs text-neutral-400 mt-1 mb-6">
            Enter the 4-digit PIN provided in your delivery email from {project.branding.studioName}.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="text"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter Access PIN"
                className={`w-full text-center tracking-[0.3em] font-mono text-lg font-bold py-3 px-4 bg-neutral-950 border rounded-xl text-white placeholder:tracking-normal placeholder:font-sans placeholder:text-sm focus:outline-none transition-colors ${
                  pinError
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-neutral-700 focus:border-amber-500'
                }`}
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2">Incorrect PIN code. Please check your delivery email.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              Unlock Downloads
            </button>
          </form>

          {project.passcode && (
            <p className="text-[11px] text-neutral-500 mt-4">
              Demo hint: The PIN for this client is <span className="font-mono text-amber-400">{project.passcode}</span>
            </p>
          )}
        </div>
      ) : (
        // Unlocked Downloads Grid
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              Verified Archival Access
            </span>
            <span>{downloads.length} Delivery Formats Available</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {downloads.map((opt) => {
              const is4k = opt.resolution.toLowerCase().includes('4k') || opt.resolution.includes('3840');
              const isVertical = opt.label.toLowerCase().includes('reel') || opt.resolution.includes('1920');

              return (
                <div
                  key={opt.id}
                  className="group bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 sm:p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        is4k
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                          : isVertical
                          ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                          : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                      }`}
                    >
                      {is4k ? (
                        <HardDrive className="w-5 h-5" />
                      ) : isVertical ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Film className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{opt.label}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                          {opt.format}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 max-w-lg">{opt.description}</p>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-2 font-mono">
                        <span>Resolution: {opt.resolution}</span>
                        <span>·</span>
                        <span className="text-amber-400 font-semibold">{opt.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(opt)}
                      className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
                      title="Copy Direct URL"
                    >
                      {copiedId === opt.id ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {copiedId === opt.id ? 'Copied' : 'Link'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(opt)}
                      className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/25"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download File</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-4 text-xs text-neutral-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Storage hosted via zero-cost cloud architecture. Permanent direct download access.</span>
            </span>
            <span className="text-neutral-500 hidden sm:inline">No expiry date</span>
          </div>
        </div>
      )}
    </div>
  );
};
