import React, { useState } from 'react';
import { Play, Tv, Download, Camera, Music, Sparkles, Share2, Heart, Film, ShoppingBag, MessageSquare, Plus } from 'lucide-react';
import { ClientProject, FilmItem, VideoChapter, GuestbookEntry, StoreOrder, GalleryPhoto } from '../../types/cineflow';
import { CinematicPlayer } from './CinematicPlayer';
import { ChapterList } from './ChapterList';
import { DownloadVault } from './DownloadVault';
import { PhotoGalleryModal } from './PhotoGalleryModal';
import { GuestbookSection } from './GuestbookSection';
import { SmartTvGuideModal } from './SmartTvGuideModal';
import { ClientPrintStoreModal } from '../store/ClientPrintStoreModal';
import { ClientReviewProofingModal } from './ClientReviewProofingModal';
import { LoadCompanyFilmModal } from './LoadCompanyFilmModal';
import { saveOrderToCloud } from '../../firebase';

interface ClientGalleryViewProps {
  project: ClientProject;
  onUpdateProject?: (updated: ClientProject) => void;
  onBackToStudio?: () => void;
}

export const ClientGalleryView: React.FC<ClientGalleryViewProps> = ({
  project,
  onUpdateProject,
  onBackToStudio,
}) => {
  const [selectedFilmId, setSelectedFilmId] = useState<string>(project.films[0]?.id || '');
  const [activeChapter, setActiveChapter] = useState<VideoChapter | null>(null);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [isTvModalOpen, setIsTvModalOpen] = useState<boolean>(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState<boolean>(false);
  const [isReviewProofingModalOpen, setIsReviewProofingModalOpen] = useState<boolean>(false);
  const [isLoadFilmModalOpen, setIsLoadFilmModalOpen] = useState<boolean>(false);
  const [selectedStorePhoto, setSelectedStorePhoto] = useState<GalleryPhoto | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeFilm: FilmItem | undefined =
    project.films.find((f) => f.id === selectedFilmId) || project.films[0];

  const handleSelectFilm = (film: FilmItem) => {
    setSelectedFilmId(film.id);
    setActiveChapter(null);
  };

  const handleLoadCompanyFilm = (newFilm: FilmItem) => {
    const updatedFilms = [newFilm, ...project.films.filter((f) => f.id !== newFilm.id)];
    setSelectedFilmId(newFilm.id);
    setActiveChapter(null);
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        films: updatedFilms,
      });
    }
  };

  const handleSelectChapter = (chapter: VideoChapter) => {
    setActiveChapter(chapter);
  };

  const handleAddGuestbookEntry = (entry: Omit<GuestbookEntry, 'id' | 'timestamp' | 'likes'>) => {
    const newEntry: GuestbookEntry = {
      ...entry,
      id: `gb_${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      likes: 1,
    };

    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        guestbook: [newEntry, ...project.guestbook],
      });
    }
  };

  const handleOrderPlaced = (order: StoreOrder) => {
    saveOrderToCloud(order).catch((err) => console.warn('Order cloud save notice:', err));

    if (onUpdateProject) {
      const existingOrders = project.orders || [];
      const updatedOrders = [order, ...existingOrders];
      const newSales = (project.storeSalesTotal || 0) + order.total;
      const newProfit = (project.storeProfitTotal || 0) + order.photographerProfit;

      onUpdateProject({
        ...project,
        orders: updatedOrders,
        storeSalesTotal: newSales,
        storeProfitTotal: newProfit,
      });
    }
  };

  const handleIncrementDownloadCount = () => {
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        downloadsCount: (project.downloadsCount || 0) + 1,
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Get theme styles
  const getThemeClass = () => {
    switch (project.theme) {
      case 'luxury-gold':
        return 'theme-gold selection:bg-amber-500/30 selection:text-amber-200';
      case 'noir-cinema':
        return 'theme-noir selection:bg-red-500/30 selection:text-red-200';
      case 'velvet-champagne':
        return 'theme-velvet selection:bg-rose-500/30 selection:text-rose-200';
      case 'earthy-emerald':
        return 'theme-emerald selection:bg-emerald-500/30 selection:text-emerald-200';
      case 'modern-minimalist':
      default:
        return 'theme-minimal selection:bg-neutral-500/30 selection:text-neutral-200';
    }
  };

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-950 text-neutral-100 ${getThemeClass()} transition-colors`}>
      {/* Filmmaker Admin Banner (if previewing from Studio) */}
      {onBackToStudio && (
        <div className="bg-neutral-900 border-b border-neutral-800 px-3 sm:px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-30 sticky top-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="text-neutral-400 truncate">
              Client Portal Preview Mode · Viewing as <strong className="text-white">{project.title}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onBackToStudio}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-lg transition-colors text-xs shrink-0"
          >
            ← Return to Studio Editor
          </button>
        </div>
      )}

      {/* Early Bird Sales Campaign Banner (Pic-Time Parity) */}
      {project.enableStore !== false && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-neutral-950 px-3 sm:px-4 py-2 text-center text-xs font-semibold flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 fill-current shrink-0" />
          <span className="text-center">
            <strong>Early Bird Heirloom Gift:</strong> Enjoy 20% off all handcrafted albums & framed prints. Code <span className="font-mono underline font-bold">CELEBRATE20</span> auto-applied.
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedStorePhoto(project.photos[0] || null);
              setIsStoreModalOpen(true);
            }}
            className="underline font-bold text-neutral-950 hover:text-white ml-1 shrink-0"
          >
            Open Store →
          </button>
        </div>
      )}

      {/* Cinematic Hero Header */}
      <header className="relative w-full h-[60vh] sm:h-[65vh] min-h-[440px] max-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Cover Media */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('${project.heroCoverImageUrl}')`,
            filter: 'brightness(0.35) contrast(1.1)',
          }}
        />

        {/* Ambient Film Grain / Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-black/60 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center w-full">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-3">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400 font-cinzel">
              {project.subtitle}
            </span>
            <span className="text-neutral-500 text-xs">·</span>
            <span className="text-xs font-mono text-neutral-300">
              {project.eventDate}
            </span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-3 sm:mb-4 drop-shadow-2xl break-words max-w-full">
            {project.title}
          </h1>

          <p className="text-xs sm:text-base text-neutral-300 font-light tracking-wide mb-6 sm:mb-8">
            {project.location}
          </p>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-full">
            <a
              href="#cinema-player"
              className="py-2.5 px-4 sm:py-3 sm:px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all shadow-xl shadow-amber-500/25 hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Films</span>
            </a>

            <button
              type="button"
              onClick={() => setIsTvModalOpen(true)}
              className="py-2.5 px-3.5 sm:py-3 sm:px-5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 backdrop-blur-md border border-neutral-700/80 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all hover:scale-105"
            >
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart TV</span>
            </button>

            {project.photos && project.photos.length > 0 && (
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="py-2.5 px-3.5 sm:py-3 sm:px-5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 backdrop-blur-md border border-neutral-700/80 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all hover:scale-105"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Photos ({project.photos.length})</span>
              </button>
            )}

            {project.enableStore !== false && (
              <button
                type="button"
                onClick={() => {
                  setSelectedStorePhoto(project.photos[0] || null);
                  setIsStoreModalOpen(true);
                }}
                className="py-2.5 px-3.5 sm:py-3 sm:px-5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-amber-500/40 text-amber-300 font-semibold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all hover:scale-105 shadow-lg shadow-amber-950/40"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Order Prints</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsReviewProofingModalOpen(true)}
              className="py-2.5 px-3.5 sm:py-3 sm:px-5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 font-semibold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all hover:scale-105 shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Review & Proofing ({project.revisionComments?.length || 0})</span>
              <span className="sm:hidden">Proofing ({project.revisionComments?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="py-2.5 px-3 sm:py-3 sm:px-4 rounded-full bg-neutral-900/80 hover:bg-neutral-800 backdrop-blur-md border border-neutral-700/80 text-neutral-300 hover:text-white text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all"
              title="Share Gallery Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Filmmaker Welcome Note */}
        {project.customNotes && (
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <span className="text-amber-500/80 font-cinzel text-xs tracking-widest uppercase">
              A Note from {project.branding.studioName}
            </span>
            <p className="font-playfair italic text-lg sm:text-xl text-neutral-200 mt-2 leading-relaxed">
              "{project.customNotes}"
            </p>
          </div>
        )}

        {/* Film Playlist Selector Tabs & Company Film Connect */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                <span>Film Collection ({project.films.length} Cuts)</span>
              </h2>
              <span className="text-xs text-neutral-400">Select film or load your own video</span>
            </div>

            <button
              type="button"
              onClick={() => setIsLoadFilmModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Load Company Film (Google Drive)</span>
            </button>
          </div>

          {project.films.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {project.films.map((film) => {
                const isSelected = film.id === activeFilm?.id;

                return (
                  <button
                    key={film.id}
                    type="button"
                    onClick={() => handleSelectFilm(film)}
                    className={`group relative text-left p-2.5 sm:p-3 rounded-xl border transition-all overflow-hidden ${
                      isSelected
                        ? 'bg-neutral-900 border-amber-500 ring-1 ring-amber-500/50 shadow-lg'
                        : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700'
                    }`}
                  >
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-neutral-950 mb-2 relative">
                      <img
                        src={film.coverImage}
                        alt={film.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 right-1.5 bg-black/80 font-mono text-[10px] text-white px-1.5 py-0.5 rounded">
                        {film.duration}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold text-[9px] uppercase tracking-wider">
                          Now Playing
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] uppercase font-semibold text-amber-400">
                      {film.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 truncate">
                      {film.title}
                    </h3>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Video Player Section */}
        {activeFilm && (
          <section id="cinema-player" className="mb-14 scroll-mt-20">
            <CinematicPlayer
              film={activeFilm}
              activeChapter={activeChapter}
              onChapterSelect={handleSelectChapter}
              isTheaterMode={isTheaterMode}
              onToggleTheaterMode={() => setIsTheaterMode(!isTheaterMode)}
              onOpenLoadFilmModal={() => setIsLoadFilmModalOpen(true)}
            />

            {/* Film Meta Row & Soundtrack Licensing */}
            <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-cinzel">
                    {activeFilm.category}
                  </span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-xs font-mono text-neutral-400">{activeFilm.duration}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">{activeFilm.title}</h2>
                <p className="text-xs text-neutral-400 mt-1 max-w-2xl">{activeFilm.description}</p>
              </div>

              {/* Soundtrack Credit badge */}
              {activeFilm.musicTrack && (
                <div className="flex items-center gap-3 bg-neutral-950/80 border border-neutral-800 px-4 py-3 rounded-xl shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                      Original Soundtrack License
                    </span>
                    <p className="text-xs font-semibold text-white">
                      "{activeFilm.musicTrack}"
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      by {activeFilm.musicArtist}{' '}
                      <span className="text-amber-400">({activeFilm.licensePlatform})</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Chapters Grid */}
            {activeFilm.chapters && activeFilm.chapters.length > 0 && (
              <div className="mt-8">
                <ChapterList
                  chapters={activeFilm.chapters}
                  activeChapter={activeChapter}
                  onSelectChapter={handleSelectChapter}
                />
              </div>
            )}
          </section>
        )}

        {/* Curated Photo Gallery Teaser */}
        {project.photos && project.photos.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
                  Visual Archive
                </span>
                <h3 className="font-cinzel text-2xl font-bold text-white mt-1">
                  Curated Stills & Film Frames
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="py-2 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>View Full Gallery ({project.photos.length})</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.photos.slice(0, 4).map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer shadow-lg"
                >
                  <img
                    src={p.url}
                    alt={p.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-3 left-3 right-3 text-xs text-white font-medium line-clamp-1 drop-shadow">
                    {p.caption}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Archival Downloads Section */}
        <section id="downloads" className="mb-20 scroll-mt-20">
          <DownloadVault
            project={project}
            activeFilmDownloads={activeFilm?.downloads}
            onIncrementDownloadCount={handleIncrementDownloadCount}
          />
        </section>

        {/* Guestbook / Love Notes */}
        {project.allowGuestbook && (
          <section id="guestbook" className="mb-20 scroll-mt-20">
            <GuestbookSection
              entries={project.guestbook}
              onAddEntry={handleAddGuestbookEntry}
              coupleNames={project.title}
            />
          </section>
        )}
      </main>

      {/* Luxury Studio Branding Footer */}
      <footer className="border-t border-neutral-850 bg-neutral-950 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400 font-cinzel">
            Cinematic Heirlooms by
          </span>
          <h4 className="font-cinzel text-2xl font-bold text-white mt-1 mb-2">
            {project.branding.studioName}
          </h4>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
            {project.branding.tagline} · Directed by {project.branding.filmmakerName}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 mb-8">
            {project.branding.websiteUrl && (
              <a
                href={project.branding.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                Official Website
              </a>
            )}
            {project.branding.instagramHandle && (
              <span className="font-mono hover:text-amber-400 transition-colors">
                Instagram: {project.branding.instagramHandle}
              </span>
            )}
            {project.branding.contactEmail && (
              <a
                href={`mailto:${project.branding.contactEmail}`}
                className="hover:text-amber-400 transition-colors"
              >
                {project.branding.contactEmail}
              </a>
            )}
          </div>

          <div className="pt-8 border-t border-neutral-900 text-[11px] text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>Client Heirloom Gallery · {project.title}</span>
            <span className="flex items-center gap-1.5">
              <span>Powered by</span>
              <strong className="text-neutral-400 font-semibold">CineFlow Studio</strong>
              <span>· Zero-Cost Vidflow Replacement</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PhotoGalleryModal
        photos={project.photos}
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        clientTitle={project.title}
        onOrderPrint={(photo) => {
          setSelectedStorePhoto(photo);
          setIsStoreModalOpen(true);
        }}
      />

      <SmartTvGuideModal
        isOpen={isTvModalOpen}
        onClose={() => setIsTvModalOpen(false)}
        portalUrl={window.location.href}
      />

      {/* Print Lab Heirloom Store Modal */}
      <ClientPrintStoreModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        project={project}
        initialSelectedPhoto={selectedStorePhoto}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Client Review & Collaborative Proofing Hub */}
      <ClientReviewProofingModal
        isOpen={isReviewProofingModalOpen}
        onClose={() => setIsReviewProofingModalOpen(false)}
        project={project}
        activeFilm={activeFilm}
        onUpdateProject={onUpdateProject || (() => {})}
      />

      {/* Load Company Film & Google Drive Cinema Stream Modal */}
      <LoadCompanyFilmModal
        isOpen={isLoadFilmModalOpen}
        onClose={() => setIsLoadFilmModalOpen(false)}
        onLoadFilm={handleLoadCompanyFilm}
        existingFilmsCount={project.films.length}
      />
    </div>
  );
};
