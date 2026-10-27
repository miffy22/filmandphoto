import React, { useState, useEffect } from 'react';
import {
  X,
  HardDrive,
  Folder,
  Film,
  Image as ImageIcon,
  Search,
  Check,
  CheckSquare,
  Square,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  LogOut,
  SlidersHorizontal,
  FolderOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from 'firebase/auth';
import {
  googleSignIn,
  googleLogout,
  initAuth,
  fetchDriveFiles,
  DriveFileItem,
  formatFileSize,
  createProjectFromDriveAssets,
  getCachedAccessToken,
} from '../../utils/googleDrive';
import { ClientProject } from '../../types/cineflow';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProject: (project: ClientProject) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  onImportProject,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getCachedAccessToken());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Folder navigation state
  const [folderHistory, setFolderHistory] = useState<{ id: string; name: string }[]>([
    { id: 'root', name: 'My Drive' },
  ]);
  const currentFolder = folderHistory[folderHistory.length - 1];

  // Files & filtering state
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'photo' | 'folder'>('all');
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [importedProject, setImportedProject] = useState<ClientProject | null>(null);

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser, token) => {
        setUser(authedUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Fetch files when accessToken or currentFolder or activeFilter changes
  useEffect(() => {
    if (!accessToken) return;
    loadFiles(currentFolder.id, searchQuery, activeFilter);
  }, [accessToken, currentFolder.id, activeFilter]);

  const loadFiles = async (
    folderId: string,
    query: string = '',
    filter: 'all' | 'video' | 'photo' | 'folder' = 'all'
  ) => {
    if (!accessToken) return;
    setIsLoadingFiles(true);
    setAuthError(null);
    try {
      const items = await fetchDriveFiles(accessToken, folderId, query, filter);
      setFiles(items);
      setSelectedFileIds(new Set());
    } catch (err: any) {
      console.error('Failed to load drive files:', err);
      setAuthError(err.message || 'Failed to communicate with Google Drive API.');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google authentication was cancelled or encountered an error.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await googleLogout();
    setUser(null);
    setAccessToken(null);
    setFiles([]);
    setSelectedFileIds(new Set());
  };

  const handleFolderClick = (folder: DriveFileItem) => {
    setFolderHistory((prev) => [...prev, { id: folder.id, name: folder.name }]);
    setSearchQuery('');
  };

  const handleNavigateToBreadcrumb = (index: number) => {
    setFolderHistory((prev) => prev.slice(0, index + 1));
    setSearchQuery('');
  };

  const toggleSelectFile = (fileId: string) => {
    setSelectedFileIds((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    const nonFolderFiles = files.filter(
      (f) => f.mimeType !== 'application/vnd.google-apps.folder'
    );
    if (selectedFileIds.size === nonFolderFiles.length) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(nonFolderFiles.map((f) => f.id)));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    loadFiles(currentFolder.id, searchQuery, activeFilter);
  };

  const handleImportSelected = () => {
    if (!accessToken) return;
    const selectedItems = files.filter((f) => selectedFileIds.has(f.id));
    if (selectedItems.length === 0) return;

    const project = createProjectFromDriveAssets(
      currentFolder.name === 'My Drive' ? 'Wedding Films & Gallery' : currentFolder.name,
      selectedItems,
      accessToken
    );

    setImportedProject(project);
    onImportProject(project);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  if (!isOpen) return null;

  const selectableFiles = files.filter(
    (f) => f.mimeType !== 'application/vnd.google-apps.folder'
  );
  const selectedVideoCount = files.filter(
    (f) => selectedFileIds.has(f.id) && f.mimeType.startsWith('video/')
  ).length;
  const selectedPhotoCount = files.filter(
    (f) => selectedFileIds.has(f.id) && f.mimeType.startsWith('image/')
  ).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-neutral-800 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  Google Drive Studio Vault
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Direct Ingest
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Browse company wedding footage & photo suites directly from your Google Drive
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-neutral-800/60 border border-neutral-700/60 text-xs">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center text-[10px]">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-neutral-200 font-medium max-w-[150px] truncate">
                  {user.displayName || user.email}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-neutral-400 hover:text-rose-400 p-0.5 transition-colors"
                  title="Sign out of Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Auth State: Not signed in */}
          {!accessToken && (
            <div className="py-12 px-4 max-w-lg mx-auto text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400 shadow-xl">
                <HardDrive className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="font-cinzel text-xl font-bold text-white">
                  Connect Company Google Drive
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Sign in to browse your company's wedding folders. Select 4K video masters, highlight
                  films, and wedding photo galleries to automatically populate a luxury client delivery
                  suite with zero storage egress fees.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-left">
                  {authError}
                </div>
              )}

              {/* Official Google Sign-in Styled Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-neutral-900 font-medium text-sm hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isAuthenticating ? 'Connecting to Drive...' : 'Sign in with Google'}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-500">
                Uses official Google OAuth with read-only scope (<span className="font-mono text-neutral-400">drive.readonly</span>). Your files remain private and secure.
              </div>
            </div>
          )}

          {/* Auth State: Signed In */}
          {accessToken && (
            <div className="space-y-4">
              {/* Navigation Bar & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-neutral-950/40 p-3 rounded-xl border border-neutral-800">
                {/* Breadcrumb Path */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 overflow-x-auto py-1">
                  {folderHistory.map((folder, index) => {
                    const isLast = index === folderHistory.length - 1;
                    return (
                      <React.Fragment key={folder.id}>
                        {index > 0 && <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />}
                        <button
                          type="button"
                          onClick={() => handleNavigateToBreadcrumb(index)}
                          className={`hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-1 ${
                            isLast ? 'text-white font-semibold' : 'text-neutral-400'
                          }`}
                        >
                          {index === 0 ? <HardDrive className="w-3.5 h-3.5 text-amber-400" /> : <Folder className="w-3.5 h-3.5 text-neutral-400" />}
                          <span>{folder.name}</span>
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Search & Refresh */}
                <div className="flex items-center gap-2">
                  <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search wedding films..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </form>

                  <button
                    type="button"
                    onClick={() => loadFiles(currentFolder.id, searchQuery, activeFilter)}
                    className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white"
                    title="Refresh folder"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Quick Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  {(['all', 'video', 'photo', 'folder'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                        activeFilter === filter
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                      }`}
                    >
                      {filter === 'all'
                        ? 'All Files'
                        : filter === 'video'
                        ? 'Wedding Films'
                        : filter === 'photo'
                        ? 'Photo Suites'
                        : 'Folders'}
                    </button>
                  ))}
                </div>

                {selectableFiles.length > 0 && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      {selectedFileIds.size === selectableFiles.length ? (
                        <CheckSquare className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-500" />
                      )}
                      <span>
                        {selectedFileIds.size === selectableFiles.length
                          ? 'Deselect All'
                          : `Select All (${selectableFiles.length})`}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Files / Folder Grid */}
              {isLoadingFiles ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 mx-auto text-amber-400 animate-spin" />
                  <p className="text-xs text-neutral-400">Loading files from Google Drive...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-neutral-950/40 rounded-xl border border-dashed border-neutral-800">
                  <FolderOpen className="w-10 h-10 mx-auto text-neutral-600" />
                  <p className="text-sm text-neutral-300 font-medium">No matching files found</p>
                  <p className="text-xs text-neutral-500">
                    Try searching for your couple's name or navigating to your wedding media folder.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {files.map((file) => {
                    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                    const isVideo = file.mimeType.startsWith('video/');
                    const isPhoto = file.mimeType.startsWith('image/');
                    const isSelected = selectedFileIds.has(file.id);

                    if (isFolder) {
                      return (
                        <div
                          key={file.id}
                          onClick={() => handleFolderClick(file)}
                          className="group p-3.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Folder className="w-5 h-5 fill-amber-500/20" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-neutral-200 group-hover:text-amber-300 truncate">
                                {file.name}
                              </p>
                              <span className="text-[10px] text-neutral-500">Folder</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors shrink-0" />
                        </div>
                      );
                    }

                    return (
                      <div
                        key={file.id}
                        onClick={() => toggleSelectFile(file.id)}
                        className={`group relative p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/50'
                            : 'bg-neutral-800/40 hover:bg-neutral-800/80 border-neutral-700/60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Thumbnail / Icon */}
                          <div className="relative w-14 h-14 rounded-lg bg-neutral-900 border border-neutral-700/60 overflow-hidden shrink-0 flex items-center justify-center">
                            {file.thumbnailLink ? (
                              <img
                                src={file.thumbnailLink}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : isVideo ? (
                              <Film className="w-6 h-6 text-amber-400" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-neutral-400" />
                            )}
                            {isVideo && (
                              <div className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-[8px] font-mono text-amber-400 font-bold">
                                4K
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-200 group-hover:text-white truncate">
                              {file.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400 font-mono">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span className="capitalize">{isVideo ? 'Video Master' : 'Photo'}</span>
                            </div>
                          </div>

                          {/* Selection Checkbox */}
                          <div className="shrink-0 mt-0.5">
                            {isSelected ? (
                              <div className="w-5 h-5 rounded bg-amber-500 text-neutral-950 flex items-center justify-center shadow-md">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded border border-neutral-600 group-hover:border-neutral-400" />
                            )}
                          </div>
                        </div>

                        {/* File Meta footer */}
                        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-700/40">
                          <span>
                            {file.modifiedTime
                              ? new Date(file.modifiedTime).toLocaleDateString()
                              : ''}
                          </span>
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-amber-300 flex items-center gap-0.5"
                            >
                              <span>Drive</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Success Banner if Project Imported */}
          {importedProject && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-neutral-900 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Delivery Project Created</span>
                </div>
                <h4 className="font-cinzel text-base font-bold text-white">
                  {importedProject.title}
                </h4>
                <p className="text-xs text-neutral-300">
                  {importedProject.films.length} Wedding Film(s) • {importedProject.photos.length} Photo Suite assets imported.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg transition-transform hover:scale-105 shrink-0"
              >
                Go to Delivery Suite
              </button>
            </div>
          )}
        </div>

        {/* Footer with Import Action */}
        {accessToken && (
          <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-neutral-400">
              {selectedFileIds.size === 0 ? (
                <span>Select wedding videos or photos above to import</span>
              ) : (
                <span className="text-neutral-200">
                  <strong className="text-amber-400">{selectedFileIds.size}</strong> item(s) selected
                  ({selectedVideoCount} film(s), {selectedPhotoCount} photo(s))
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleImportSelected}
                disabled={selectedFileIds.size === 0}
                className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Import into Film & Photo Studio</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
