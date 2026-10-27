import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Clock,
  Heart,
  CheckCircle2,
  Send,
  Sparkles,
  BookOpen,
  Film,
  Camera,
  AlertCircle,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ClientProject,
  ClientRevisionComment,
  FilmItem,
  GalleryPhoto,
} from '../../types/cineflow';

interface ClientReviewProofingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ClientProject;
  activeFilm?: FilmItem;
  currentPlayTimeSeconds?: number;
  onUpdateProject: (updated: ClientProject) => void;
}

export const ClientReviewProofingModal: React.FC<ClientReviewProofingModalProps> = ({
  isOpen,
  onClose,
  project,
  activeFilm,
  currentPlayTimeSeconds = 0,
  onUpdateProject,
}) => {
  const [activeTab, setActiveTab] = useState<'film-notes' | 'album-proofing' | 'approval'>('film-notes');

  // Video revision comment state
  const [authorName, setAuthorName] = useState('Eleanor (Bride)');
  const [authorRole, setAuthorRole] = useState<'Bride' | 'Groom' | 'Client' | 'Planner'>('Bride');
  const [commentText, setCommentText] = useState('');
  const [timecode, setTimecode] = useState(currentPlayTimeSeconds || 0);

  const comments: ClientRevisionComment[] = project.revisionComments || [];
  const albumSelections: string[] = project.albumSelections || [];
  const selectedPhotos = project.photos.filter((p) => albumSelections.includes(p.id));

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeFilm) return;

    const newComment: ClientRevisionComment = {
      id: `rev_${Date.now()}`,
      filmId: activeFilm.id,
      timecodeSeconds: timecode,
      timecodeFormatted: formatSeconds(timecode),
      authorName,
      authorRole,
      text: commentText.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onUpdateProject({
      ...project,
      proofingStatus: 'changes_requested',
      revisionComments: [newComment, ...comments],
    });

    setCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    onUpdateProject({
      ...project,
      revisionComments: comments.filter((c) => c.id !== commentId),
    });
  };

  const handleToggleAlbumPhoto = (photoId: string) => {
    const nextSelections = albumSelections.includes(photoId)
      ? albumSelections.filter((id) => id !== photoId)
      : [...albumSelections, photoId];

    onUpdateProject({
      ...project,
      albumSelections: nextSelections,
    });
  };

  const handleApproveFinalDelivery = () => {
    onUpdateProject({
      ...project,
      proofingStatus: 'client_approved',
      status: 'delivered',
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 bg-neutral-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-neutral-800 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  Client Review & Proofing Hub
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    project.proofingStatus === 'client_approved'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : project.proofingStatus === 'changes_requested'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {project.proofingStatus === 'client_approved'
                    ? 'Gallery Approved'
                    : project.proofingStatus === 'changes_requested'
                    ? 'Revisions Submitted'
                    : 'In Client Review'}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Direct collaborative review: timecoded film revisions, album photo selections, and official approval
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-6 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('film-notes')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'film-notes'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Timecoded Film Revisions ({comments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('album-proofing')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'album-proofing'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Album Photo Selections ({albumSelections.length}/50)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approval')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'approval'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Final Approval & Download Unlock</span>
          </button>
        </div>

        {/* Tab 1: Film Revisions */}
        {activeTab === 'film-notes' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Add revision form */}
            <form onSubmit={handleAddComment} className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 font-cinzel">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Leave Timecoded Note on Film</span>
                </span>
                <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 px-2.5 py-1 rounded-lg">
                  <span className="text-[10px] text-neutral-400 uppercase">Timestamp:</span>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {formatSeconds(timecode)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Could we lengthen the father of the bride toast here?"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value as any)}
                    className="bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Bride">Bride</option>
                    <option value="Groom">Groom</option>
                    <option value="Client">Couple</option>
                    <option value="Planner">Wedding Planner</option>
                  </select>

                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Existing Comments List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Submitted Feedback & Revision Requests ({comments.length})
              </h4>

              {comments.length === 0 ? (
                <div className="py-12 text-center space-y-2 bg-neutral-950/40 rounded-2xl border border-dashed border-neutral-800">
                  <MessageSquare className="w-8 h-8 mx-auto text-neutral-600" />
                  <p className="text-xs text-neutral-300 font-medium">No revision requests yet</p>
                  <p className="text-[11px] text-neutral-500">
                    Pause your film at any timestamp and enter revision notes above.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[11px] font-bold">
                            {comment.timecodeFormatted}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {comment.authorName} ({comment.authorRole})
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 pl-1">{comment.text}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Album Proofing Selection */}
        {activeTab === 'album-proofing' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-cinzel text-sm font-bold text-white">
                  Heirloom Leather Album Photo Selection
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Click the heart icon on any photo in your gallery to curate your custom 50-photo album layout.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-cinzel text-xl font-bold text-amber-400">
                  {albumSelections.length} / 50
                </span>
                <span className="block text-[10px] text-neutral-500 uppercase">Photos Chosen</span>
              </div>
            </div>

            {/* Photo Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {project.photos.map((photo) => {
                const isSelected = albumSelections.includes(photo.id);

                return (
                  <div
                    key={photo.id}
                    onClick={() => handleToggleAlbumPhoto(photo.id)}
                    className={`relative rounded-xl overflow-hidden aspect-square border cursor-pointer group transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/60 scale-[1.02]'
                        : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-950 shadow-md scale-110'
                          : 'bg-black/60 text-white hover:text-amber-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-neutral-950' : ''}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Formal Approval */}
        {activeTab === 'approval' && (
          <div className="flex-1 overflow-y-auto p-8 max-w-lg mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="font-cinzel text-xl font-bold text-white">
                Final Delivery Approval
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Approve your complete wedding collection to lock the gallery cuts, send your album
                proof to the fine art lab, and unlock uncompressed 4K ProRes master downloads.
              </p>
            </div>

            {project.proofingStatus === 'client_approved' ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Gallery Officially Approved & Master Archival Downloads Active!</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApproveFinalDelivery}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Approve Wedding Film & Photo Delivery</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
