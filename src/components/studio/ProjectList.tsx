import React, { useState } from 'react';
import {
  Film, Plus, Eye, Edit3, Share2, Copy, Trash2, DollarSign,
  TrendingUp, Download, ShieldCheck, CheckCircle2, Search, ExternalLink,
  ShoppingBag, Sparkles, HardDrive, Building2, Cloud, RefreshCw, AlertCircle
} from 'lucide-react';
import { ClientProject } from '../../types/cineflow';

interface ProjectListProps {
  projects: ClientProject[];
  onSelectProject: (project: ClientProject) => void;
  onEditProject: (project: ClientProject) => void;
  onShareProject: (project: ClientProject) => void;
  onNewProject: () => void;
  onCloneProject: (project: ClientProject) => void;
  onDeleteProject: (projectId: string) => void;
  onClearAllTestData?: () => void;
  onLoadDemoProject?: () => void;
  onOpenSavingsCalculator: () => void;
  onOpenLaunchModal: () => void;
  onOpenPrintLabs: () => void;
  onOpenGoogleDrive?: () => void;
  onOpenPrivateStudio?: () => void;
  onOpenStorageVault?: () => void;
  onOpenSharePlatform?: () => void;
  onOpenCustomDomain?: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelectProject,
  onEditProject,
  onShareProject,
  onNewProject,
  onCloneProject,
  onDeleteProject,
  onClearAllTestData,
  onLoadDemoProject,
  onOpenSavingsCalculator,
  onOpenLaunchModal,
  onOpenPrintLabs,
  onOpenGoogleDrive,
  onOpenPrivateStudio,
  onOpenStorageVault,
  onOpenSharePlatform,
  onOpenCustomDomain,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'delivered' | 'draft'>('all');

  // Calculate real, authentic aggregated stats (NO hardcoded fake numbers)
  const totalViews = projects.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalDownloads = projects.reduce((acc, p) => acc + (p.downloadsCount || 0), 0);
  const totalStoreSales = projects.reduce((acc, p) => acc + (p.storeSalesTotal || 0), 0);
  const totalStoreProfit = projects.reduce((acc, p) => acc + (p.storeProfitTotal || 0), 0);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Refined Header & Unified Studio Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400 font-cinzel">
                Filmmaker Studio Workspace
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 0% Platform Fee
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-xs text-neutral-400 font-mono">
                Native 4K 60fps
              </span>
            </div>
            <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Client Film Deliveries
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              Deliver luxury 4K cinema portals, interactive scene chapters, and fine-art prints under your studio brand.
            </p>
          </div>

          {/* Unified, Sleek Action Tools (Eliminated the Clunky Pill Row) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenPrintLabs && (
              <button
                type="button"
                onClick={onOpenPrintLabs}
                className="py-2.5 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-2 transition-colors"
                title="Configure WHCC, Miller's & Loxley Colour print markups"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Print Labs (0% Cut)</span>
              </button>
            )}

            {onOpenCustomDomain && (
              <button
                type="button"
                onClick={onOpenCustomDomain}
                className="py-2.5 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-2 transition-colors"
                title="Connect films.yourstudio.com"
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Custom Domains</span>
              </button>
            )}

            {onOpenStorageVault && (
              <button
                type="button"
                onClick={onOpenStorageVault}
                className="py-2.5 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-2 transition-colors"
                title="Storage Vault ($0 Egress)"
              >
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span>Cloud Vault</span>
              </button>
            )}

            {onOpenSharePlatform && (
              <button
                type="button"
                onClick={onOpenSharePlatform}
                className="py-2.5 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-2 transition-colors"
                title="Share link with colleagues"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Share Platform</span>
              </button>
            )}

            {projects.length > 0 && onClearAllTestData && (
              <button
                type="button"
                onClick={onClearAllTestData}
                className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-rose-950/40 border border-neutral-800 hover:border-rose-800/60 text-xs font-medium text-neutral-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
                title="Clear test/demo projects for a pristine empty studio"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Test Data</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNewProject}
              className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>New Client Gallery</span>
            </button>
          </div>
        </div>

        {/* Studio Real Metrics Bar (Clean, Minimalist, No Hardcoded Fake Stats) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-medium">Active Deliveries</span>
              <Film className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              {projects.length}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Unlimited galleries on Pro</p>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-medium">Total Stream Views</span>
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              {totalViews}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Desktop, mobile & Smart TV</p>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-medium">Master Downloads</span>
              <Download className="w-4 h-4 text-purple-400" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              {totalDownloads}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">ProRes 422 & 4K MP4 cuts</p>
          </div>

          <div
            onClick={onOpenPrintLabs}
            className="bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-medium">Print Store Revenue</span>
              <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              £{totalStoreSales.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">
              100% Studio Profit · 0% Platform Fee
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by couple, venue, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {(['all', 'delivered', 'draft'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterStatus === status
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Project Gallery Cards or Pristine Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <Film className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                {projects.length === 0
                  ? 'Your Studio Is Clean & Ready'
                  : 'No Matching Deliveries Found'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-md mx-auto">
                {projects.length === 0
                  ? 'Create your first 4K cinema client gallery, configure chapter timestamps, and monetize fine-art prints.'
                  : 'Try clearing your search query or switching your status filter.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onNewProject}
                className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Client Gallery</span>
              </button>

              {projects.length === 0 && onLoadDemoProject && (
                <button
                  type="button"
                  onClick={onLoadDemoProject}
                  className="py-3 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Load Sample 4K Gallery</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const filmCount = project.films?.length || 0;
              const photoCount = project.photos?.length || 0;

              return (
                <div
                  key={project.id}
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-xl"
                >
                  <div>
                    {/* Cover Hero with Subtle Zoom */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                      <img
                        src={project.heroCoverImageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />

                      {/* Status & Lab Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          project.status === 'delivered'
                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 backdrop-blur-md'
                            : 'bg-neutral-950/80 border border-neutral-700 text-neutral-300 backdrop-blur-md'
                        }`}>
                          {project.status}
                        </span>

                        {project.enableStore && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-amber-500/20 border border-amber-500/30 text-amber-300 backdrop-blur-md flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" />
                            <span>Store Active</span>
                          </span>
                        )}
                      </div>

                      {project.isPasswordProtected && (
                        <div className="absolute top-3 right-3 p-1.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-neutral-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      )}
                    </div>

                    {/* Meta Details */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {project.eventDate || 'Date Not Set'}
                        </span>
                        <h3 className="font-cinzel text-xl font-bold text-white tracking-wide mt-0.5 group-hover:text-amber-300 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-neutral-400 truncate mt-0.5">
                          {project.location || project.subtitle}
                        </p>
                      </div>

                      {/* Quick Specs */}
                      <div className="flex items-center gap-4 text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
                        <span className="flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-amber-400" />
                          <span>{filmCount} {filmCount === 1 ? 'Film' : 'Films'}</span>
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{project.viewsCount || 0} views</span>
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{project.downloadsCount || 0} dl</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Action Bar (Replaced Giant Yellow Button) */}
                  <div className="p-4 pt-0 border-t border-neutral-800/50 mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Gallery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditProject(project)}
                      className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white transition-colors"
                      title="Edit Gallery Details & Films"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onShareProject(project)}
                      className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white transition-colors"
                      title="Share Client Link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onCloneProject(project)}
                      className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white transition-colors"
                      title="Duplicate Gallery Template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteProject(project.id)}
                      className="p-2.5 rounded-xl bg-neutral-800 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 transition-colors"
                      title="Delete Gallery"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
