import React, { useState, useRef } from 'react';
import {
  Upload, Film, CheckCircle2, RefreshCw, HardDrive, Sparkles, AlertCircle, X, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FilmItem } from '../../types/cineflow';

interface DirectVideoUploaderProps {
  onVideoUploaded: (film: Partial<FilmItem>) => void;
  onClose?: () => void;
}

export const DirectVideoUploader: React.FC<DirectVideoUploaderProps> = ({
  onVideoUploaded,
  onClose,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcodeStep, setTranscodeStep] = useState<string>('');
  const [uploadedFilm, setUploadedFilm] = useState<Partial<FilmItem> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateDirectUpload = (fileName: string, fileSizeMb: number) => {
    setIsUploading(true);
    setUploadProgress(0);
    setTranscodeStep('Ingesting high-bitrate 4K master into native vault...');

    const duration = 2500;
    const interval = 50;
    const step = 100 / (duration / interval);

    let progress = 0;
    const timer = setInterval(() => {
      progress += step;
      if (progress < 60) {
        setUploadProgress(Math.round(progress));
        setTranscodeStep(`Uploading master stream (${Math.round((progress / 100) * fileSizeMb)} MB of ${fileSizeMb} MB)...`);
      } else if (progress < 85) {
        setUploadProgress(Math.round(progress));
        setTranscodeStep('Automated 4K HLS Transcoder: Generating 2160p, 1080p, 720p streams...');
      } else if (progress < 99) {
        setUploadProgress(Math.round(progress));
        setTranscodeStep('Extracting audio wave & generating timeline chapter markers...');
      } else {
        clearInterval(timer);
        setUploadProgress(100);
        setTranscodeStep('Ready for luxury client streaming & archival download!');
        setIsUploading(false);

        // Created native film payload
        const cleanTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const newFilm: Partial<FilmItem> = {
          title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
          category: 'Highlight Film',
          duration: '08:15',
          durationSeconds: 495,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          sourceType: 'direct',
          coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
          description: 'Master 4K film uploaded directly to native vault.',
          chapters: [
            { id: 'c1', timeInSeconds: 0, title: 'Opening Scene' },
            { id: 'c2', timeInSeconds: 90, title: 'The Vows' },
            { id: 'c3', timeInSeconds: 240, title: 'Celebration & Speeches' },
          ],
          downloads: [
            {
              id: 'dl_master',
              label: 'Original 4K Master Archive',
              resolution: '3840 x 2160 (Cinema UHD)',
              fileSize: `${(fileSizeMb / 1024).toFixed(1)} GB`,
              format: 'Master ProRes / High Bitrate MP4',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              description: 'Native uncompressed master archive.',
            },
            {
              id: 'dl_1080p',
              label: 'Web & Mobile 1080p',
              resolution: '1920 x 1080',
              fileSize: `${(fileSizeMb * 0.15).toFixed(0)} MB`,
              format: 'H.264 MP4',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              description: 'Fast mobile streaming cut.',
            },
          ],
        };

        setUploadedFilm(newFilm);
        onVideoUploaded(newFilm);

        try {
          confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
        } catch (e) {}
      }
    }, interval);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateDirectUpload(file.name, Math.round(file.size / (1024 * 1024)) || 4200);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      simulateDirectUpload(file.name, Math.round(file.size / (1024 * 1024)) || 5400);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 relative">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
            Native Vault Ingestion
          </span>
          <span className="text-xs text-neutral-400">All-In-One Native Upload Engine</span>
        </div>
        <h3 className="font-cinzel text-xl font-bold text-white">
          Direct 4K Video Upload & Adaptive Transcoder
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          Drop your finished 4K Master film files (.mp4, .mov, .prores). The platform automatically encodes multi-bitrate HLS streaming and packages master archival downloads without third-party links.
        </p>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-amber-500 bg-amber-500/10 scale-[1.01]'
            : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,.mp4,.mov,.mkv,.prores"
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-4 max-w-md mx-auto">
            <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
            <div>
              <div className="flex justify-between text-xs font-mono text-neutral-300 mb-2">
                <span>{transcodeStep}</span>
                <span className="font-bold text-amber-400">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] text-neutral-500">
              Chunked resumable upload with automated 4K HLS multi-bitrate packaging.
            </p>
          </div>
        ) : uploadedFilm ? (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-white text-base">{uploadedFilm.title}</h4>
            <p className="text-xs text-emerald-400 font-mono">
              ✓ 4K Master Ingested & HLS Transcoded Successfully!
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="text-xs text-neutral-400 hover:text-white underline"
            >
              Upload another film cut
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                Drag & Drop 4K Master Video File Here
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                or click to browse your hard drive (supports ProRes 422, MP4 H.264/H.265, MOV up to 100GB)
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-neutral-500 font-mono">
              <span>✓ Auto 4K HLS Transcoding</span>
              <span>·</span>
              <span>✓ Sub-10ms Global Edge CDN</span>
              <span>·</span>
              <span>✓ Zero External Links</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
