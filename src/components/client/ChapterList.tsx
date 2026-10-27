import React from 'react';
import { Play, Clock } from 'lucide-react';
import { VideoChapter } from '../../types/cineflow';

interface ChapterListProps {
  chapters: VideoChapter[];
  activeChapter?: VideoChapter | null;
  onSelectChapter: (chapter: VideoChapter) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  activeChapter,
  onSelectChapter,
}) => {
  if (!chapters || chapters.length === 0) {
    return null;
  }

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const h = Math.floor(m / 60);
    if (h > 0) {
      const remainingM = m % 60;
      return `${h}:${remainingM.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
            Scene Chapters
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Jump directly to any key moment in this film
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-400">
          {chapters.length} Key Moments
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {chapters.map((chapter, index) => {
          const isActive = activeChapter?.id === chapter.id;

          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onSelectChapter(chapter)}
              className={`group text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-neutral-900 border-amber-500/80 ring-1 ring-amber-500/40 shadow-lg shadow-amber-950/20'
                  : 'bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-medium text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatSeconds(chapter.timeInSeconds)}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  #{String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-white line-clamp-1 transition-colors">
                  {chapter.title}
                </h4>
                {chapter.description && (
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                    {chapter.description}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400 group-hover:text-amber-400 transition-colors">
                <span className="text-[11px]">Play from timestamp</span>
                <Play className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
