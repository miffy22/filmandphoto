import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Tv, RotateCcw, FastForward, Film, AlertCircle, Sparkles } from 'lucide-react';
import { FilmItem, VideoChapter } from '../../types/cineflow';
import { parseVideoSource } from '../../utils/storageHelpers';

interface CinematicPlayerProps {
  film: FilmItem;
  activeChapter?: VideoChapter | null;
  onChapterSelect?: (chapter: VideoChapter) => void;
  isTheaterMode: boolean;
  onToggleTheaterMode: () => void;
  onOpenLoadFilmModal?: () => void;
}

export const CinematicPlayer: React.FC<CinematicPlayerProps> = ({
  film,
  activeChapter,
  onChapterSelect,
  isTheaterMode,
  onToggleTheaterMode,
  onOpenLoadFilmModal,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(film.durationSeconds || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);

  const parsedSource = parseVideoSource(film.videoUrl, film.sourceType);

  // Reset error when film changes
  useEffect(() => {
    setVideoError(false);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [film.videoUrl]);

  // If active chapter changed from outside, seek to chapter timestamp
  useEffect(() => {
    if (activeChapter && videoRef.current && !parsedSource.isIframe) {
      videoRef.current.currentTime = activeChapter.timeInSeconds;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [activeChapter]);

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: any;
    const handleActivity = () => {
      setShowControls(true);
      clearTimeout(timeout);
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        onToggleTheaterMode();
      } else if (e.code === 'ArrowRight' && videoRef.current) {
        e.preventDefault();
        videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
      } else if (e.code === 'ArrowLeft' && videoRef.current) {
        e.preventDefault();
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);
  };

  const handleProgressMouseLeave = () => {
    setHoverPosition(null);
    setHoverTime(null);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleRateChange = () => {
    const rates = [1, 1.25, 1.5, 0.75];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const h = Math.floor(m / 60);
    if (h > 0) {
      const remainingM = m % 60;
      return `${h}:${remainingM.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Find current chapter
  const currentChapter = film.chapters?.slice().reverse().find(c => currentTime >= c.timeInSeconds);

  return (
    <div
      ref={containerRef}
      className={`relative bg-black select-none overflow-hidden rounded-xl border border-neutral-800 transition-all duration-500 shadow-2xl ${
        isTheaterMode ? 'w-full max-w-[1400px] mx-auto ring-1 ring-amber-500/20' : 'w-full aspect-video'
      }`}
    >
      {parsedSource.isIframe ? (
        // Iframe Player for YouTube, Google Drive, or Vimeo
        <div className="w-full h-full aspect-video bg-neutral-950 flex flex-col items-center justify-center">
          {parsedSource.embedUrl ? (
            <iframe
              src={parsedSource.embedUrl}
              title={film.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-8 text-neutral-400">
              <Film className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
              <p className="text-sm">Video stream configured via {parsedSource.type}</p>
            </div>
          )}
        </div>
      ) : (
        // Native HTML5 Cinema Video Player
        <div className="relative w-full h-full aspect-video group cursor-pointer" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={parsedSource.streamUrl}
            poster={film.coverImage}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => {
              setIsPlaying(true);
              setVideoError(false);
            }}
            onPause={() => setIsPlaying(false)}
            onError={(e) => {
              console.warn('Video failed to stream:', film.videoUrl, e);
              setVideoError(true);
              setIsPlaying(false);
            }}
            className="w-full h-full object-contain bg-black"
            playsInline
          />

          {/* Stream Error Graceful Fallback Card */}
          {videoError && (
            <div className="absolute inset-0 bg-neutral-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-white mb-1">
                Direct Stream Unreachable
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mb-4 leading-relaxed">
                This media provider returned a playback or network restriction. You can load a film directly from your company's Google Drive, Vimeo, or YouTube link to experience playback immediately.
              </p>
              {onOpenLoadFilmModal && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLoadFilmModal();
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Load Your Company Film (Google Drive / Link)</span>
                </button>
              )}
            </div>
          )}

          {/* Central Play/Pause Pulse Button (when paused and not error) */}
          {!isPlaying && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px] transition-all">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-20 h-20 rounded-full bg-amber-500/90 text-neutral-950 hover:bg-amber-400 hover:scale-110 flex items-center justify-center shadow-2xl transition-all"
                title="Play Film (Space)"
              >
                <Play className="w-9 h-9 fill-current ml-1" />
              </button>
            </div>
          )}

          {/* Top Info Bar (Film Title, Active Chapter Badge, & Load Film Shortcut) */}
          <div
            className={`absolute top-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-b from-black/85 via-black/45 to-transparent flex items-center justify-between gap-3 transition-opacity duration-300 pointer-events-none ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="min-w-0 pr-2">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
                {film.category}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white drop-shadow truncate">
                {film.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0 pointer-events-auto">
              {onOpenLoadFilmModal && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLoadFilmModal();
                  }}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 border border-amber-500/40 text-amber-300 text-xs font-semibold backdrop-blur-md transition-all shadow-md hover:scale-105 flex items-center gap-1.5"
                  title="Load your own company film to test playback"
                >
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Load Company Film</span>
                  <span className="sm:hidden">Load Film</span>
                </button>
              )}

              {currentChapter && (
                <div className="hidden md:flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md border border-neutral-850 px-3 py-1.5 rounded-lg text-xs text-neutral-200">
                  <span className="font-medium text-amber-300">Chapter ·</span>
                  <span className="truncate max-w-[180px] text-white font-medium">{currentChapter.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Scrubber & Chapter Markers */}
            <div
              className="relative w-full h-3 cursor-pointer flex items-center group/scrub mb-3"
              onClick={handleSeek}
              onMouseMove={handleProgressMouseMove}
              onMouseLeave={handleProgressMouseLeave}
            >
              {/* Track Background */}
              <div className="w-full h-1 group-hover/scrub:h-2 bg-neutral-700/60 rounded-full overflow-hidden transition-all relative">
                {/* Progress bar */}
                <div
                  className="h-full bg-amber-500 rounded-full relative"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
              </div>

              {/* Chapter ticks along the timeline */}
              {film.chapters &&
                film.chapters.map((chap) => {
                  const pct = (chap.timeInSeconds / (duration || 1)) * 100;
                  return (
                    <div
                      key={chap.id}
                      style={{ left: `${pct}%` }}
                      className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-amber-300 rounded-sm shadow z-10 hover:scale-150 transition-transform"
                      title={`${chap.title} (${formatTime(chap.timeInSeconds)})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onChapterSelect) onChapterSelect(chap);
                      }}
                    />
                  );
                })}

              {/* Hover Tooltip showing timestamp & title */}
              {hoverPosition !== null && hoverTime !== null && (
                <div
                  className="absolute bottom-5 -translate-x-1/2 bg-neutral-900/95 border border-neutral-700 px-2 py-1 rounded text-[11px] font-mono text-white pointer-events-none shadow-xl z-20 whitespace-nowrap"
                  style={{ left: `${hoverPosition}%` }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}
            </div>

            {/* Playback Controls Row */}
            <div className="flex items-center justify-between text-neutral-200">
              {/* Left: Play/Pause, Rewind, Volume, Time */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1.5 hover:text-amber-400 transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                    }
                  }}
                  className="p-1.5 hover:text-white text-neutral-400 transition-colors"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
                    }
                  }}
                  className="p-1.5 hover:text-white text-neutral-400 transition-colors"
                  title="Forward 10s"
                >
                  <FastForward className="w-4 h-4" />
                </button>

                {/* Volume slider */}
                <div className="flex items-center gap-2 group/vol">
                  <button type="button" onClick={toggleMute} className="p-1.5 hover:text-white transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-neutral-700 accent-amber-500 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Time Display */}
                <span className="text-xs font-mono text-neutral-400 ml-2">
                  <span className="text-white">{formatTime(currentTime)}</span> / {formatTime(duration)}
                </span>
              </div>

              {/* Right: Rate, Theater Mode, 4K Badge, Fullscreen */}
              <div className="flex items-center gap-3 text-xs">
                {/* 4K UHD badge */}
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
                  4K UHD
                </span>

                {/* Speed toggle */}
                <button
                  type="button"
                  onClick={handleRateChange}
                  className="px-2 py-1 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 font-mono font-medium transition-colors"
                  title="Playback Speed"
                >
                  {playbackRate}x
                </button>

                {/* Theater mode button */}
                <button
                  type="button"
                  onClick={onToggleTheaterMode}
                  className={`p-1.5 rounded transition-colors ${isTheaterMode ? 'text-amber-400' : 'text-neutral-400 hover:text-white'}`}
                  title={isTheaterMode ? 'Standard Mode (T)' : 'Cinema Theater Mode (T)'}
                >
                  <Tv className="w-4 h-4" />
                </button>

                {/* Fullscreen */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                  title="Fullscreen (F)"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
