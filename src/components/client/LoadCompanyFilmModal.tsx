import React, { useState } from 'react';
import { X, Film, HardDrive, CheckCircle2, Play, ExternalLink, Sparkles, AlertCircle, Info } from 'lucide-react';
import { FilmItem, VideoSourceType } from '../../types/cineflow';
import { parseVideoSource } from '../../utils/storageHelpers';

interface LoadCompanyFilmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadFilm: (newFilm: FilmItem) => void;
  existingFilmsCount: number;
}

export const LoadCompanyFilmModal: React.FC<LoadCompanyFilmModalProps> = ({
  isOpen,
  onClose,
  onLoadFilm,
  existingFilmsCount,
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [filmTitle, setFilmTitle] = useState('');
  const [category, setCategory] = useState<FilmItem['category']>('Highlight Film');
  const [duration, setDuration] = useState('06:30');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestPreset = (presetType: 'ocean' | 'sintel') => {
    if (presetType === 'ocean') {
      setVideoUrl('https://vjs.zencdn.net/v/oceans.mp4');
      setFilmTitle('High-Art Cinema 4K Feature Film');
      setCategory('Feature Film');
      setDuration('08:45');
      setCoverImageUrl('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85');
    } else {
      setVideoUrl('https://media.w3.org/2010/05/sintel/trailer.mp4');
      setFilmTitle('Official Teaser Trailer Cut');
      setCategory('Teaser');
      setDuration('01:15');
      setCoverImageUrl('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85');
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      setError('Please provide a Google Drive link, direct MP4 URL, or video stream link.');
      return;
    }

    const trimmed = videoUrl.trim();
    const parsed = parseVideoSource(trimmed);

    const titleToUse = filmTitle.trim() || (parsed.type === 'googledrive' ? 'Company Google Drive Film' : 'Cinematic Highlight Film');
    const coverToUse = coverImageUrl.trim() || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85';

    const newFilm: FilmItem = {
      id: `film_custom_${Date.now()}`,
      title: titleToUse,
      category,
      duration: duration || '05:00',
      durationSeconds: 300,
      videoUrl: trimmed,
      sourceType: parsed.type,
      coverImage: coverToUse,
      description: `Client delivery film streamed via ${parsed.type === 'googledrive' ? 'Google Drive Cinema Engine' : parsed.type.toUpperCase() + ' Direct Stream'}.`,
      musicTrack: 'Bespoke Cinema Score',
      musicArtist: 'Film & Photo Studios',
      licensePlatform: 'Licensed Direct',
      chapters: [
        { id: `c_init_1`, timeInSeconds: 0, title: 'Opening Scene' },
        { id: `c_init_2`, timeInSeconds: 30, title: 'Main Highlights' },
      ],
      downloads: [
        {
          id: `dl_${Date.now()}_1`,
          label: 'Master 4K Video',
          resolution: '3840 x 2160',
          fileSize: '4.2 GB',
          format: 'MP4 4K',
          url: parsed.directDownloadUrl || trimmed,
          description: 'Full resolution client archival download.',
        },
      ],
    };

    onLoadFilm(newFilm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Load Your Company Film
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Stream any video from your Google Drive, Vimeo, YouTube, or direct MP4 storage.
            </p>
          </div>
        </div>

        {/* Step-by-Step Google Drive Instruction Box */}
        <div className="p-4 rounded-2xl bg-neutral-950/80 border border-amber-500/25 mb-6 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <span>Using a video from your Google Drive?</span>
          </div>
          <ol className="list-decimal list-inside text-neutral-300 space-y-1.5 pl-1 leading-relaxed">
            <li>Open your video in <strong className="text-white">Google Drive</strong>.</li>
            <li>Click the <strong className="text-white">Share</strong> button in the top right.</li>
            <li>Under <span className="text-amber-200">"General access"</span>, change from <span className="text-neutral-400">"Restricted"</span> to <strong className="text-emerald-400">"Anyone with the link"</strong> (Viewer).</li>
            <li>Click <strong className="text-white">Copy link</strong> and paste it directly into the URL input below.</li>
          </ol>
          <p className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-850 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Our cinema engine automatically renders it in high quality with zero distracting YouTube/Drive clutter.</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Video URL (Google Drive / Direct MP4 / Vimeo / YouTube) *
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setError(null);
              }}
              placeholder="e.g. https://drive.google.com/file/d/1X-example-id/view or https://.../film.mp4"
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-mono"
            />
            {error && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Film Title
              </label>
              <input
                type="text"
                value={filmTitle}
                onChange={(e) => setFilmTitle(e.target.value)}
                placeholder="e.g. Official Company Master Film"
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Film Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Highlight Film">Highlight Film</option>
                <option value="Feature Film">Feature Film</option>
                <option value="Teaser">Teaser Trailer</option>
                <option value="Full Ceremony">Full Ceremony</option>
                <option value="Speeches">Speeches & Toasts</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Display Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 08:30"
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Poster Cover Image URL (Optional)
              </label>
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://... (defaults to luxury wedding cover)"
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Quick Presets for 1-Click Verification */}
          <div className="pt-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block mb-2">
              Or test with instant verified 4K demo streams:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleTestPreset('ocean')}
                className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3 h-3 text-amber-400" />
                <span>4K Ocean Cinema Master</span>
              </button>
              <button
                type="button"
                onClick={() => handleTestPreset('sintel')}
                className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>High-Energy Trailer Cut</span>
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Stream in 4K Player</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
