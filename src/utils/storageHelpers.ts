import { VideoSourceType } from '../types/cineflow';

export interface ParsedVideoSource {
  type: VideoSourceType;
  streamUrl: string;
  isIframe: boolean;
  embedUrl?: string;
  directDownloadUrl?: string;
  rawId?: string;
}

/**
 * Automatically parses any video URL and determines whether it can be streamed via HTML5 video,
 * converted to a direct stream link (Dropbox, R2, S3), or embedded distraction-free (YouTube unlisted, Google Drive, Vimeo).
 */
export function parseVideoSource(url: string, explicitType?: VideoSourceType): ParsedVideoSource {
  if (!url || !url.trim()) {
    return {
      type: 'direct',
      streamUrl: '',
      isIframe: false,
    };
  }

  const trimmed = url.trim();

  // YouTube detection
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      streamUrl: trimmed,
      isIframe: true,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3`,
      rawId: videoId,
    };
  }

  // Google Drive detection
  const gdriveMatch = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/);
  if (gdriveMatch) {
    const fileId = gdriveMatch[1];
    return {
      type: 'googledrive',
      streamUrl: trimmed,
      isIframe: true,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      directDownloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      rawId: fileId,
    };
  }

  // Dropbox detection
  if (trimmed.includes('dropbox.com')) {
    let directStreamUrl = trimmed;
    if (trimmed.includes('dl=0')) {
      directStreamUrl = trimmed.replace('dl=0', 'raw=1');
    } else if (!trimmed.includes('raw=1')) {
      directStreamUrl = `${trimmed}${trimmed.includes('?') ? '&' : '?'}raw=1`;
    }
    return {
      type: 'dropbox',
      streamUrl: directStreamUrl,
      isIframe: false,
      directDownloadUrl: trimmed.replace('dl=0', 'dl=1'),
    };
  }

  // Vimeo detection
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:[\/?]?([\w-]+))?/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[2];
    const unlistedHash = vimeoMatch[3] ? `?h=${vimeoMatch[3]}&` : '?';
    return {
      type: 'vimeo',
      streamUrl: trimmed,
      isIframe: true,
      embedUrl: `https://player.vimeo.com/video/${videoId}${unlistedHash}autoplay=1&title=0&byline=0&portrait=0`,
      rawId: videoId,
    };
  }

  // Cloudflare R2 / AWS S3 / Direct MP4/WebM
  if (trimmed.includes('r2.cloudflarestorage.com') || trimmed.includes('.r2.dev')) {
    return {
      type: 'cloudflare-r2',
      streamUrl: trimmed,
      isIframe: false,
      directDownloadUrl: trimmed,
    };
  }

  // Direct video file (HTML5 video)
  return {
    type: explicitType || 'direct',
    streamUrl: trimmed,
    isIframe: false,
    directDownloadUrl: trimmed,
  };
}

/**
 * Calculate financial savings vs VidFlow
 */
export function calculateVidflowSavings(projectsPerYear: number, avgGbPerProject: number) {
  const totalGbPerYear = projectsPerYear * avgGbPerProject;

  // VidFlow cost calculations:
  // Pack cost is ~$1.10 per GB (50GB=$60, 100GB=$110, 500GB=$475)
  // Or annual plan: 1TB = $79/mo ($948/yr), 5TB = $165/mo ($1,980/yr)
  let vidflowAnnualCost = 0;
  if (totalGbPerYear <= 35) {
    vidflowAnnualCost = 19 * 12; // $228/yr
  } else if (totalGbPerYear <= 1000) {
    vidflowAnnualCost = 79 * 12; // $948/yr
  } else if (totalGbPerYear <= 5000) {
    vidflowAnnualCost = 165 * 12; // $1,980/yr
  } else {
    vidflowAnnualCost = (165 + Math.ceil((totalGbPerYear - 5000) / 1000) * 35) * 12;
  }

  // Pack-based cost alternative:
  const vidflowPackCost = totalGbPerYear * 1.1;

  // CineFlow Cost:
  // Using Free Google Drive (15GB free per account) or YouTube 4K unlisted = $0.00
  // Or Cloudflare R2: 10GB free, then $0.015/GB = pennies
  const cineflowCost = 0;
  const cloudflareR2Cost = totalGbPerYear > 120 ? ((totalGbPerYear - 120) * 0.015).toFixed(2) : '0.00';

  return {
    totalGbPerYear,
    vidflowAnnualCost: Math.round(vidflowAnnualCost),
    vidflowPackCost: Math.round(vidflowPackCost),
    cineflowCost,
    cloudflareR2Cost,
    annualSavings: Math.round(Math.max(vidflowAnnualCost, vidflowPackCost)),
    fiveYearSavings: Math.round(Math.max(vidflowAnnualCost, vidflowPackCost) * 5),
  };
}
