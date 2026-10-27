import React, { useState } from 'react';
import {
  Save, Eye, ArrowLeft, Plus, Trash2, Film, Image, Shield, Sparkles,
  Music, HardDrive, ListOrdered, ChevronRight, CheckCircle2, AlertCircle,
  ShoppingBag, Upload
} from 'lucide-react';
import { ClientProject, FilmItem, VideoChapter, FilmDownloadOption, GalleryTheme, VideoSourceType, PrintLabProvider } from '../../types/cineflow';
import { parseVideoSource } from '../../utils/storageHelpers';
import { DirectVideoUploader } from './DirectVideoUploader';
import { PRINT_LAB_INFO, DEFAULT_PRINT_PRODUCTS } from '../../data/printCatalog';

interface ProjectEditorProps {
  project: ClientProject;
  onSave: (updated: ClientProject) => void;
  onPreviewClientView: () => void;
  onBack: () => void;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({
  project: initialProject,
  onSave,
  onPreviewClientView,
  onBack,
}) => {
  const [project, setProject] = useState<ClientProject>(initialProject);
  const [activeTab, setActiveTab] = useState<'details' | 'films' | 'photos' | 'store' | 'security' | 'branding'>('details');
  const [selectedFilmIndex, setSelectedFilmIndex] = useState<number>(0);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showUploaderModal, setShowUploaderModal] = useState(false);

  const activeFilm = project.films[selectedFilmIndex] || project.films[0];

  const handleSave = () => {
    onSave({
      ...project,
      lastUpdated: new Date().toISOString(),
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  // Film operations
  const handleAddFilm = () => {
    const newFilm: FilmItem = {
      id: `film_${Date.now()}`,
      title: 'New Cinematic Film',
      category: 'Highlight Film',
      duration: '05:00',
      durationSeconds: 300,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      sourceType: 'direct',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
      description: 'A cinematic summary of the celebration.',
      chapters: [
        { id: `c_${Date.now()}_1`, timeInSeconds: 0, title: 'Opening Scene' },
        { id: `c_${Date.now()}_2`, timeInSeconds: 90, title: 'The Exchange' },
      ],
      downloads: [
        {
          id: `d_${Date.now()}_1`,
          label: 'Master 4K Film',
          resolution: '3840 x 2160',
          fileSize: '4.5 GB',
          format: 'MP4 4K',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          description: 'High quality download for 4K TV and archival preservation.',
        },
      ],
    };

    setProject({
      ...project,
      films: [...project.films, newFilm],
    });
    setSelectedFilmIndex(project.films.length);
  };

  const handleUpdateActiveFilm = (updatedFields: Partial<FilmItem>) => {
    const updatedFilms = [...project.films];
    updatedFilms[selectedFilmIndex] = {
      ...updatedFilms[selectedFilmIndex],
      ...updatedFields,
    };
    setProject({ ...project, films: updatedFilms });
  };

  const handleDeleteFilm = (indexToDelete: number) => {
    if (project.films.length <= 1) {
      alert('A project must contain at least one film.');
      return;
    }
    const updatedFilms = project.films.filter((_, idx) => idx !== indexToDelete);
    setProject({ ...project, films: updatedFilms });
    setSelectedFilmIndex(Math.max(0, indexToDelete - 1));
  };

  // Chapter operations
  const handleAddChapter = () => {
    if (!activeFilm) return;
    const newChapter: VideoChapter = {
      id: `chap_${Date.now()}`,
      timeInSeconds: 0,
      title: 'New Scene Chapter',
      description: 'Key story moment',
    };
    handleUpdateActiveFilm({
      chapters: [...(activeFilm.chapters || []), newChapter],
    });
  };

  const handleUpdateChapter = (chapIndex: number, updatedFields: Partial<VideoChapter>) => {
    if (!activeFilm) return;
    const chapters = [...(activeFilm.chapters || [])];
    chapters[chapIndex] = { ...chapters[chapIndex], ...updatedFields };
    // Sort chapters by time
    chapters.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
    handleUpdateActiveFilm({ chapters });
  };

  const handleDeleteChapter = (chapIndex: number) => {
    if (!activeFilm) return;
    const chapters = activeFilm.chapters.filter((_, idx) => idx !== chapIndex);
    handleUpdateActiveFilm({ chapters });
  };

  // Download operations
  const handleAddDownload = () => {
    if (!activeFilm) return;
    const newDownload: FilmDownloadOption = {
      id: `dl_${Date.now()}`,
      label: '1080p Web Download',
      resolution: '1920 x 1080',
      fileSize: '1.2 GB',
      format: 'H.264 MP4',
      url: activeFilm.videoUrl,
      description: 'Quick download for phones and laptops.',
    };
    handleUpdateActiveFilm({
      downloads: [...(activeFilm.downloads || []), newDownload],
    });
  };

  const handleUpdateDownload = (dlIndex: number, updatedFields: Partial<FilmDownloadOption>) => {
    if (!activeFilm) return;
    const downloads = [...(activeFilm.downloads || [])];
    downloads[dlIndex] = { ...downloads[dlIndex], ...updatedFields };
    handleUpdateActiveFilm({ downloads });
  };

  const handleDeleteDownload = (dlIndex: number) => {
    if (!activeFilm) return;
    const downloads = activeFilm.downloads.filter((_, idx) => idx !== dlIndex);
    handleUpdateActiveFilm({ downloads });
  };

  // Photo operations
  const handleAddPhoto = () => {
    const newPhoto = {
      id: `photo_${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
      caption: 'Memorable golden hour moment',
      category: 'Portraits' as const,
    };
    setProject({
      ...project,
      photos: [...project.photos, newPhoto],
    });
  };

  const handleRemovePhoto = (id: string) => {
    setProject({
      ...project,
      photos: project.photos.filter((p) => p.id !== id),
    });
  };

  const parsedActiveSource = activeFilm ? parseVideoSource(activeFilm.videoUrl) : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-neutral-900 border-b border-neutral-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">All Projects</span>
          </button>

          <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
              Client Portal Customizer
            </span>
            <h1 className="text-base font-bold text-white truncate max-w-xs sm:max-w-md">
              {project.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPreviewClientView}
            className="py-2 px-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">View as Client</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Portal</span>
          </button>
        </div>
      </header>

      {/* Toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-800 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Client portal changes saved successfully!</span>
        </div>
      )}

      {/* Main Studio Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Navigation Tabs */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-2 space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'details'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <span>Project & Event Info</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('films')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'films'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <span>Films & Scene Chapters ({project.films.length})</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'photos'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <span>Photo Gallery ({project.photos.length})</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('store')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'store'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>Print Lab & Store</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                  WHCC
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'security'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <span>Security & Passcode PIN</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('branding')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'branding'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <span>Filmmaker Studio Branding</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>
          </div>

          {/* Quick Storage Status Card */}
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 text-xs text-neutral-400 space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Storage Architecture
            </span>
            <p className="text-[11px] leading-relaxed">
              Using zero-cost cloud streaming. No recurring VidFlow invoices or 2-year expiration clocks.
            </p>
          </div>
        </div>

        {/* Right Column: Tab Content */}
        <div className="lg:col-span-9">
          {/* TAB 1: Project Details */}
          {activeTab === 'details' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-white border-b border-neutral-800 pb-4">
                General Project Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Client / Couple Names (Primary Title)
                  </label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => setProject({ ...project, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Subtitle / Event Tagline
                  </label>
                  <input
                    type="text"
                    value={project.subtitle}
                    onChange={(e) => setProject({ ...project, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="text"
                    value={project.eventDate}
                    onChange={(e) => setProject({ ...project, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Location & Venue
                  </label>
                  <input
                    type="text"
                    value={project.location}
                    onChange={(e) => setProject({ ...project, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Theme Picker */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Client Portal Visual Aesthetic (Theme)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'luxury-gold', name: 'Luxury Gold', desc: 'Boutique Couture & Warm Amber' },
                    { id: 'noir-cinema', name: 'Noir Cinema', desc: 'Moody Dark Charcoal & Red' },
                    { id: 'velvet-champagne', name: 'Velvet Champagne', desc: 'Soft Rose & Warm Romance' },
                    { id: 'earthy-emerald', name: 'Earthy Emerald', desc: 'Sage & Forest Elopements' },
                    { id: 'modern-minimalist', name: 'Modern Minimal', desc: 'Monochrome Editorial' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setProject({ ...project, theme: theme.id as GalleryTheme })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        project.theme === theme.id
                          ? 'bg-neutral-800 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-white">{theme.name}</h4>
                      <p className="text-[10px] text-neutral-400 mt-1">{theme.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Media */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Hero Cover Image URL
                </label>
                <input
                  type="text"
                  value={project.heroCoverImageUrl}
                  onChange={(e) => setProject({ ...project, heroCoverImageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  High-res landscape photography used behind the title hero banner.
                </p>
              </div>

              {/* Filmmaker Love Note */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Filmmaker Welcome Note (Quote shown above films)
                </label>
                <textarea
                  rows={2}
                  value={project.customNotes || ''}
                  onChange={(e) => setProject({ ...project, customNotes: e.target.value })}
                  placeholder="Thank you for trusting us with your story..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Films & Scene Chapters */}
          {activeTab === 'films' && (
            <div className="space-y-6">
              {/* Film selector chips */}
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {project.films.map((f, idx) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFilmIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedFilmIndex === idx
                          ? 'bg-amber-500 text-neutral-950 shadow'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {f.title}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddFilm}
                  className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ml-2"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Film</span>
                </button>
              </div>

              {activeFilm && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
                        Film Details
                      </span>
                      <h3 className="font-cinzel text-xl font-bold text-white mt-0.5">
                        {activeFilm.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteFilm(selectedFilmIndex)}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-800 transition-colors text-xs flex items-center gap-1"
                      title="Delete Film"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete Film</span>
                    </button>
                  </div>

                  {/* Film metadata fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Film Title
                      </label>
                      <input
                        type="text"
                        value={activeFilm.title}
                        onChange={(e) => handleUpdateActiveFilm({ title: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Category
                      </label>
                      <select
                        value={activeFilm.category}
                        onChange={(e) => handleUpdateActiveFilm({ category: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Teaser">Teaser (60s Trailer)</option>
                        <option value="Highlight Film">Highlight Film</option>
                        <option value="Feature Film">Feature Documentary</option>
                        <option value="Full Ceremony">Full Ceremony</option>
                        <option value="Speeches">Speeches & Toasts</option>
                        <option value="Drone Reel">Drone Reel</option>
                        <option value="Social Reel">Social Reel (9:16)</option>
                        <option value="Commercial Cut">Commercial Cut</option>
                      </select>
                    </div>
                  </div>

                  {/* All-In-One Native 4K Video Pipeline (VidFlow Parity) */}
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                            Native 4K Cloud Vault
                          </span>
                          <span className="text-xs text-emerald-400 font-mono">
                            ✓ Auto HLS Multi-Bitrate Streaming
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">
                          Master 4K Video Stream & Transcoder
                        </h4>
                        <p className="text-xs text-neutral-400">
                          Direct high-speed upload into your native media vault. Transcodes 2160p, 1080p, and mobile streams automatically.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowUploaderModal(true)}
                        className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload 4K Master Video</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                        Master Video Stream Endpoint / Storage URL
                      </label>
                      <input
                        type="text"
                        value={activeFilm.videoUrl}
                        onChange={(e) => handleUpdateActiveFilm({ videoUrl: e.target.value })}
                        placeholder="https://commondatastorage.googleapis.com/... or native vault URL"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-neutral-400 font-mono">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Sub-10ms Global Edge CDN
                      </span>
                      <span>·</span>
                      <span>2160p 4K UHD Master Active</span>
                      <span>·</span>
                      <span>Zero Third-Party Player Ads</span>
                    </div>
                  </div>

                  {/* Thumbnail & Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Thumbnail Cover Image URL
                      </label>
                      <input
                        type="text"
                        value={activeFilm.coverImage}
                        onChange={(e) => handleUpdateActiveFilm({ coverImage: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Duration Display (e.g. 07:45)
                      </label>
                      <input
                        type="text"
                        value={activeFilm.duration}
                        onChange={(e) => handleUpdateActiveFilm({ duration: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Music Track License */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-950/60 border border-neutral-800 rounded-2xl">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Licensed Song Title
                      </label>
                      <input
                        type="text"
                        value={activeFilm.musicTrack || ''}
                        onChange={(e) => handleUpdateActiveFilm({ musicTrack: e.target.value })}
                        placeholder="e.g. Where the Light Bends"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Recording Artist
                      </label>
                      <input
                        type="text"
                        value={activeFilm.musicArtist || ''}
                        onChange={(e) => handleUpdateActiveFilm({ musicArtist: e.target.value })}
                        placeholder="e.g. SYML"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        License Platform
                      </label>
                      <select
                        value={activeFilm.licensePlatform || 'Musicbed'}
                        onChange={(e) => handleUpdateActiveFilm({ licensePlatform: e.target.value as any })}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                      >
                        <option value="Musicbed">Musicbed</option>
                        <option value="Artlist">Artlist</option>
                        <option value="Epidemic Sound">Epidemic Sound</option>
                        <option value="Licensed Direct">Licensed Direct</option>
                        <option value="Custom Score">Original Film Score</option>
                      </select>
                    </div>
                  </div>

                  {/* CHAPTERS SECTION */}
                  <div className="border-t border-neutral-800 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-cinzel text-base font-bold text-white">
                          Scene Chapters ({activeFilm.chapters?.length || 0})
                        </h4>
                        <p className="text-xs text-neutral-400">
                          Interactive timeline markers. Clicking jumps the player straight to that moment.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddChapter}
                        className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add Chapter</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activeFilm.chapters?.map((chap, cIdx) => (
                        <div
                          key={chap.id}
                          className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center gap-3"
                        >
                          <div className="w-24 shrink-0">
                            <label className="block text-[10px] text-neutral-500 mb-1">Time (Seconds)</label>
                            <input
                              type="number"
                              min={0}
                              value={chap.timeInSeconds}
                              onChange={(e) =>
                                handleUpdateChapter(cIdx, { timeInSeconds: parseInt(e.target.value) || 0 })
                              }
                              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs font-mono text-amber-400"
                            />
                          </div>

                          <div className="flex-1">
                            <label className="block text-[10px] text-neutral-500 mb-1">Chapter Title</label>
                            <input
                              type="text"
                              value={chap.title}
                              onChange={(e) => handleUpdateChapter(cIdx, { title: e.target.value })}
                              placeholder="e.g. First Look on the Terrace"
                              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                            />
                          </div>

                          <div className="flex-1">
                            <label className="block text-[10px] text-neutral-500 mb-1">Description (Optional)</label>
                            <input
                              type="text"
                              value={chap.description || ''}
                              onChange={(e) => handleUpdateChapter(cIdx, { description: e.target.value })}
                              placeholder="Brief scene note"
                              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-300"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteChapter(cIdx)}
                            className="p-2 text-neutral-500 hover:text-red-400 self-end sm:self-center"
                            title="Remove Chapter"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DOWNLOADS SECTION */}
                  <div className="border-t border-neutral-800 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-cinzel text-base font-bold text-white">
                          Download Vault Packages ({activeFilm.downloads?.length || 0})
                        </h4>
                        <p className="text-xs text-neutral-400">
                          Tiered download files available to the client (4K Master, Web 1080p, Social 9:16).
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddDownload}
                        className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add Package</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activeFilm.downloads?.map((dl, dIdx) => (
                        <div
                          key={dl.id}
                          className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] text-neutral-500 mb-1">Package Label</label>
                              <input
                                type="text"
                                value={dl.label}
                                onChange={(e) => handleUpdateDownload(dIdx, { label: e.target.value })}
                                className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-500 mb-1">Resolution & Format</label>
                              <input
                                type="text"
                                value={dl.resolution}
                                onChange={(e) => handleUpdateDownload(dIdx, { resolution: e.target.value })}
                                className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-500 mb-1">File Size</label>
                              <input
                                type="text"
                                value={dl.fileSize}
                                onChange={(e) => handleUpdateDownload(dIdx, { fileSize: e.target.value })}
                                className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-amber-400 font-mono"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={dl.url}
                              onChange={(e) => handleUpdateDownload(dIdx, { url: e.target.value })}
                              placeholder="Direct download link"
                              className="flex-1 px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs font-mono text-neutral-300"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteDownload(dIdx)}
                              className="p-2 text-neutral-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Photo Gallery */}
          {activeTab === 'photos' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-white">
                    Curated Photo Gallery ({project.photos.length} Stills)
                  </h3>
                  <p className="text-xs text-neutral-400">
                    High resolution photography frames integrated alongside films in the client portal.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {project.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2 relative group"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900 relative">
                      <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={photo.url}
                      onChange={(e) => {
                        const updated = project.photos.map((p) =>
                          p.id === photo.id ? { ...p, url: e.target.value } : p
                        );
                        setProject({ ...project, photos: updated });
                      }}
                      placeholder="Photo Image URL"
                      className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-xs text-neutral-300 font-mono"
                    />

                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => {
                        const updated = project.photos.map((p) =>
                          p.id === photo.id ? { ...p, caption: e.target.value } : p
                        );
                        setProject({ ...project, photos: updated });
                      }}
                      placeholder="Caption text"
                      className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Print Lab & Heirloom Store */}
          {activeTab === 'store' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
                      Pic-Time Parity
                    </span>
                    <span className="text-xs text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Wholesale Lab Integration
                    </span>
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-white mt-1">
                    Print Lab Fulfillment & Heirloom Store
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Generate automated passive revenue from every wedding gallery. Clients and guests purchase handcrafted leather albums, museum wall art, and 4K USB boxes.
                  </p>
                </div>
              </div>

              {/* Enable Store Toggle */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div>
                  <h4 className="text-sm font-bold text-white">Enable E-Commerce Store for this Gallery</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Shows the "Order Prints & Albums" button in the client portal and next to every film frame.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={project.enableStore !== false}
                  onChange={(e) => setProject({ ...project, enableStore: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 mt-1 cursor-pointer"
                />
              </div>

              {/* Lab Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Integrated Print Lab Partner
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'whcc', name: 'WHCC (White House Custom Colour)', region: 'USA & Global', desc: 'Handmade flush-mount albums, fine art printing, 100% white-label shipping.' },
                    { id: 'millers', name: 'Miller\'s Professional Imaging', region: 'North America', desc: 'Free overnight shipping, signature layflat foil albums.' },
                    { id: 'loxley', name: 'Loxley Colour', region: 'UK & Europe', desc: 'Premier European lab for destination weddings across Europe.' },
                  ].map((lab) => (
                    <button
                      key={lab.id}
                      type="button"
                      onClick={() => setProject({ ...project, printLab: lab.id as any })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        (project.printLab || 'whcc') === lab.id
                          ? 'bg-neutral-800 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase text-amber-400">{lab.region}</span>
                      <h4 className="text-xs font-bold text-white mt-1">{lab.name}</h4>
                      <p className="text-[11px] text-neutral-400 mt-1">{lab.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Markup Multiplier */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white">Photographer Retail Markup</h4>
                    <p className="text-[11px] text-neutral-400">Your profit margin on top of wholesale lab manufacturing costs.</p>
                  </div>
                  <span className="text-sm font-mono font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded-lg">
                    +{project.customMarkupPercent || 350}%
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="25"
                  value={project.customMarkupPercent || 350}
                  onChange={(e) => setProject({ ...project, customMarkupPercent: parseInt(e.target.value) })}
                  className="w-full h-2 bg-neutral-800 accent-amber-500 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sample Catalog Products with live calculation */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="p-3.5 border-b border-neutral-800 flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">Client Catalog Preview & Net Profit</span>
                  <span className="text-neutral-500 font-mono">Automatic dropship to client's address</span>
                </div>
                <div className="divide-y divide-neutral-850 text-xs">
                  {DEFAULT_PRINT_PRODUCTS.slice(0, 5).map((prod) => {
                    const markup = project.customMarkupPercent || 350;
                    const retail = Math.round(prod.labCost * (1 + markup / 100));
                    const profit = retail - prod.labCost;

                    return (
                      <div key={prod.id} className="p-3 flex items-center justify-between">
                        <div>
                          <strong className="text-white block">{prod.name}</strong>
                          <span className="text-[11px] text-neutral-500 font-mono">Wholesale Lab Cost: ${prod.labCost.toFixed(2)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-mono font-bold block">${retail.toFixed(2)}</span>
                          <span className="text-emerald-400 font-mono font-bold text-[11px]">+${profit.toFixed(2)} Profit</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Security & PIN */}
          {activeTab === 'security' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-white border-b border-neutral-800 pb-4">
                Security & Client Permissions
              </h3>

              {/* Password Protection Toggle */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div>
                  <h4 className="text-sm font-bold text-white">Password / PIN Protection</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Require clients and guests to enter a security PIN to unlock the gallery and master downloads.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={project.isPasswordProtected}
                  onChange={(e) => setProject({ ...project, isPasswordProtected: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 mt-1 cursor-pointer"
                />
              </div>

              {project.isPasswordProtected && (
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Gallery Access PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={project.passcode || ''}
                    onChange={(e) => setProject({ ...project, passcode: e.target.value })}
                    placeholder="e.g. 1809"
                    className="w-48 px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-lg font-mono font-bold text-amber-400 tracking-widest text-center"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Share this code in your client delivery email.
                  </p>
                </div>
              )}

              {/* Downloads Toggle */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div>
                  <h4 className="text-sm font-bold text-white">Allow Client Master Downloads</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Enable the Archival Vault section for clients to download 4K master files and web cuts.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={project.allowClientDownloads}
                  onChange={(e) => setProject({ ...project, allowClientDownloads: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 mt-1 cursor-pointer"
                />
              </div>

              {/* Guestbook Toggle */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div>
                  <h4 className="text-sm font-bold text-white">Allow Love Notes & Guestbook</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Allow the couple and family members to leave reactions and comments on the films.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={project.allowGuestbook}
                  onChange={(e) => setProject({ ...project, allowGuestbook: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 mt-1 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 5: Filmmaker Branding */}
          {activeTab === 'branding' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-white border-b border-neutral-800 pb-4">
                Filmmaker Studio Branding (White-Label)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Studio Name
                  </label>
                  <input
                    type="text"
                    value={project.branding.studioName}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        branding: { ...project.branding, studioName: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Lead Filmmaker / Director Name
                  </label>
                  <input
                    type="text"
                    value={project.branding.filmmakerName}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        branding: { ...project.branding, filmmakerName: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Studio Tagline
                  </label>
                  <input
                    type="text"
                    value={project.branding.tagline}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        branding: { ...project.branding, tagline: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={project.branding.instagramHandle}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        branding: { ...project.branding, instagramHandle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={project.branding.websiteUrl}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        branding: { ...project.branding, websiteUrl: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={project.branding.contactEmail}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        branding: { ...project.branding, contactEmail: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Native 4K Video Direct Uploader Modal */}
      {showUploaderModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl">
            <DirectVideoUploader
              onClose={() => setShowUploaderModal(false)}
              onVideoUploaded={(uploadedPartial) => {
                if (activeFilm) {
                  handleUpdateActiveFilm({
                    ...uploadedPartial,
                    videoUrl: uploadedPartial.videoUrl || activeFilm.videoUrl,
                  });
                }
                setShowUploaderModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
