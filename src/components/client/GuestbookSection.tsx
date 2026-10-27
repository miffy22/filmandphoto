import React, { useState } from 'react';
import { Heart, Send, MessageSquareQuote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GuestbookEntry } from '../../types/cineflow';

interface GuestbookSectionProps {
  entries: GuestbookEntry[];
  onAddEntry: (entry: Omit<GuestbookEntry, 'id' | 'timestamp' | 'likes'>) => void;
  coupleNames: string;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  entries,
  onAddEntry,
  coupleNames,
}) => {
  const [author, setAuthor] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [message, setMessage] = useState('');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    onAddEntry({
      author: author.trim(),
      relationship: relationship.trim(),
      message: message.trim(),
    });

    try {
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.8 },
      });
    } catch (err) {}

    setAuthor('');
    setMessage('');
  };

  const handleToggleLike = (id: string, initialLikes: number) => {
    const isLiked = likedMap[id];
    const currentLikes = likeCountMap[id] !== undefined ? likeCountMap[id] : initialLikes;

    setLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    setLikeCountMap((prev) => ({
      ...prev,
      [id]: isLiked ? currentLikes - 1 : currentLikes + 1,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
          Memories & Reactions
        </span>
        <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mt-1">
          Love Notes & Guestbook
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto mt-2">
          Leave a message for {coupleNames} and share your favorite scene from their film.
        </p>
      </div>

      {/* Write Note Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 mb-8 shadow-xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aunt Sarah or David (Best Man)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Relationship / Role
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="The Couple">The Couple</option>
              <option value="Family">Family / Parents</option>
              <option value="Wedding Party">Wedding Party / Groomsman / Bridesmaid</option>
              <option value="Close Friend">Close Friend</option>
              <option value="Colleague">Colleague / Guest</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Your Note or Favorite Moment
          </label>
          <textarea
            required
            rows={3}
            placeholder="What brought tears to your eyes? Share your reaction after watching the film..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
            <span>Post Love Note</span>
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-4">
        {entries.map((entry) => {
          const isLiked = likedMap[entry.id];
          const likesCount = likeCountMap[entry.id] !== undefined ? likeCountMap[entry.id] : entry.likes;

          return (
            <div
              key={entry.id}
              className="bg-neutral-900/60 border border-neutral-850 hover:border-neutral-700/80 rounded-2xl p-5 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{entry.author}</h4>
                    <span className="text-[10px] uppercase font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-md">
                      {entry.relationship}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500">{entry.timestamp}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleLike(entry.id, entry.likes)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    isLiked
                      ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                  title="Like Note"
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount}</span>
                </button>
              </div>

              <div className="relative pl-3 border-l-2 border-amber-500/30 text-sm text-neutral-300 italic">
                <MessageSquareQuote className="w-4 h-4 text-neutral-600 absolute -top-1 -left-2" />
                <p className="pl-2">{entry.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
