import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Camera, Maximize2, ShoppingBag } from 'lucide-react';
import { GalleryPhoto } from '../../types/cineflow';

interface PhotoGalleryModalProps {
  photos: GalleryPhoto[];
  isOpen: boolean;
  onClose: () => void;
  clientTitle: string;
  onOrderPrint?: (photo: GalleryPhoto) => void;
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  photos,
  isOpen,
  onClose,
  clientTitle,
  onOrderPrint,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Categories present in photos
  const categories = ['All', ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean))) as string[]];

  const filteredPhotos = activeCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (selectedPhotoIndex !== null) {
          setSelectedPhotoIndex(null);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && selectedPhotoIndex !== null) {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
      } else if (e.key === 'ArrowLeft' && selectedPhotoIndex !== null) {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedPhotoIndex, filteredPhotos.length]);

  if (!isOpen) return null;

  const currentPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <div>
          <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            Curated Film Stills & Portraits
          </h3>
          <p className="text-xs text-neutral-400">{clientTitle} · {photos.length} Selected Frames</p>
        </div>

        {/* Categories Tab Bar */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setSelectedPhotoIndex(null);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeCategory === cat
                  ? 'bg-amber-500 text-neutral-950 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 transition-all cursor-pointer shadow-lg"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider">
                  {photo.category}
                </span>
                <p className="text-xs text-white font-medium line-clamp-1">{photo.caption}</p>
                <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal (When a photo is clicked) */}
      {currentPhoto && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Lightbox Header */}
          <div className="w-full max-w-6xl flex items-center justify-between text-neutral-300">
            <span className="text-xs font-mono">
              Frame {selectedPhotoIndex! + 1} of {filteredPhotos.length}
            </span>

            <div className="flex items-center gap-3">
              {onOrderPrint && (
                <button
                  type="button"
                  onClick={() => {
                    onOrderPrint(currentPhoto);
                    setSelectedPhotoIndex(null);
                    onClose();
                  }}
                  className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order Print / Frame</span>
                </button>
              )}

              <a
                href={currentPhoto.url}
                download={`frame-${currentPhoto.id}.jpg`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
                title="Download High-Res Frame"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Save Frame</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Image with Arrows */}
          <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center my-4 overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setSelectedPhotoIndex(
                  (selectedPhotoIndex! - 1 + filteredPhotos.length) % filteredPhotos.length
                )
              }
              className="absolute left-2 p-3 rounded-full bg-neutral-900/80 hover:bg-amber-500 hover:text-neutral-950 text-white transition-colors z-10"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            <button
              type="button"
              onClick={() =>
                setSelectedPhotoIndex((selectedPhotoIndex! + 1) % filteredPhotos.length)
              }
              className="absolute right-2 p-3 rounded-full bg-neutral-900/80 hover:bg-amber-500 hover:text-neutral-950 text-white transition-colors z-10"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Caption */}
          <div className="text-center max-w-xl pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              {currentPhoto.category}
            </span>
            <p className="text-sm text-neutral-200 mt-1">{currentPhoto.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
};
