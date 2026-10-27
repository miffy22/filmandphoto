import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { ClientProject, FilmItem, GalleryPhoto } from '../types/cineflow';

// Initialize Firebase App safely (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Scope minimization principle: read-only access to browse and import wedding assets
export const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account',
});

// In-memory token cache (NEVER in localStorage/sessionStorage per security protocol)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (!isSigningIn) {
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No access token returned from Google Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const googleLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  thumbnailLink?: string;
  iconLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  modifiedTime?: string;
  videoMediaMetadata?: {
    width?: number;
    height?: number;
    durationMillis?: string;
  };
  imageMediaMetadata?: {
    width?: number;
    height?: number;
  };
}

export interface DriveFolderItem {
  id: string;
  name: string;
}

export const fetchDriveFiles = async (
  accessToken: string,
  folderId?: string,
  searchQuery?: string,
  filterType?: 'all' | 'video' | 'photo' | 'folder'
): Promise<DriveFileItem[]> => {
  try {
    const queryParts: string[] = ['trashed = false'];

    if (folderId && folderId !== 'root') {
      queryParts.push(`'${folderId}' in parents`);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const sanitized = searchQuery.trim().replace(/'/g, "\\'");
      queryParts.push(`name contains '${sanitized}'`);
    }

    if (filterType === 'video') {
      queryParts.push(`(mimeType contains 'video/' or mimeType = 'application/vnd.google-apps.folder')`);
    } else if (filterType === 'photo') {
      queryParts.push(`(mimeType contains 'image/' or mimeType = 'application/vnd.google-apps.folder')`);
    } else if (filterType === 'folder') {
      queryParts.push(`mimeType = 'application/vnd.google-apps.folder'`);
    }

    const q = queryParts.join(' and ');
    const fields =
      'files(id, name, mimeType, size, thumbnailLink, iconLink, webViewLink, webContentLink, modifiedTime, videoMediaMetadata, imageMediaMetadata)';
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      q
    )}&fields=${encodeURIComponent(fields)}&pageSize=100&orderBy=folder,name`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Google Drive API error: ${res.status}`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (error) {
    console.error('Failed to fetch Google Drive files:', error);
    throw error;
  }
};

/**
 * Format raw byte size into human readable string
 */
export const formatFileSize = (bytes?: string | number): string => {
  if (!bytes) return '—';
  const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(num) || num <= 0) return '—';
  if (num >= 1024 * 1024 * 1024) {
    return `${(num / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
  if (num >= 1024 * 1024) {
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(num / 1024).toFixed(0)} KB`;
};

/**
 * Converts selected Google Drive assets into a new wedding client project
 */
export const createProjectFromDriveAssets = (
  folderName: string,
  selectedFiles: DriveFileItem[],
  accessToken: string
): ClientProject => {
  const timestamp = Date.now();
  const cleanTitle = folderName
    .replace(/[-_]/g, ' ')
    .replace(/\b(wedding|film|raw|footage|delivery|photos|masters)\b/gi, '')
    .trim();

  const projectTitle = cleanTitle.length > 2 ? cleanTitle : 'Wedding Film & Photo Collection';

  // Partition files into videos and photos
  const videoFiles = selectedFiles.filter(
    (f) =>
      f.mimeType.startsWith('video/') ||
      f.name.match(/\.(mp4|mov|mkv|prores|m4v|avi)$/i)
  );

  const photoFiles = selectedFiles.filter(
    (f) =>
      f.mimeType.startsWith('image/') ||
      f.name.match(/\.(jpg|jpeg|png|webp|cr2|arw|nef|dng|tiff)$/i)
  );

  // Build films
  const films: FilmItem[] =
    videoFiles.length > 0
      ? videoFiles.map((vf, index) => {
          const durationSeconds = vf.videoMediaMetadata?.durationMillis
            ? Math.round(parseInt(vf.videoMediaMetadata.durationMillis, 10) / 1000)
            : 360 + index * 60;
          const mins = Math.floor(durationSeconds / 60);
          const secs = durationSeconds % 60;
          const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

          const isMain = index === 0;
          const category = isMain
            ? 'Feature Film'
            : vf.name.toLowerCase().includes('teaser')
            ? 'Teaser'
            : vf.name.toLowerCase().includes('speech')
            ? 'Speeches'
            : vf.name.toLowerCase().includes('ceremony')
            ? 'Full Ceremony'
            : 'Highlight Film';

          // Direct Google Drive stream or webContentLink
          const streamUrl =
            vf.webContentLink ||
            `https://www.googleapis.com/drive/v3/files/${vf.id}?alt=media`;

          return {
            id: `film_drive_${vf.id}`,
            title: vf.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            category,
            duration: durationStr,
            durationSeconds,
            videoUrl: streamUrl,
            sourceType: 'direct',
            coverImage:
              vf.thumbnailLink?.replace(/=s\d+/, '=s1600') ||
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
            description: `Imported from Google Drive: ${vf.name}`,
            chapters: [
              { id: `c_${vf.id}_1`, timeInSeconds: 0, title: 'Opening & Preparations' },
              { id: `c_${vf.id}_2`, timeInSeconds: Math.floor(durationSeconds * 0.3), title: 'Ceremony Vows' },
              { id: `c_${vf.id}_3`, timeInSeconds: Math.floor(durationSeconds * 0.65), title: 'Reception & Speeches' },
              { id: `c_${vf.id}_4`, timeInSeconds: Math.floor(durationSeconds * 0.85), title: 'Evening Celebration' },
            ],
            downloads: [
              {
                id: `dl_drive_master_${vf.id}`,
                label: 'Original 4K Master Video',
                resolution: '3840 x 2160 UHD',
                fileSize: formatFileSize(vf.size),
                format: 'ProRes / Native MP4',
                url: vf.webViewLink || vf.webContentLink || streamUrl,
                description: 'Full uncompressed master archive file directly from Google Drive.',
              },
              {
                id: `dl_drive_web_${vf.id}`,
                label: 'Web & Mobile 1080p',
                resolution: '1920 x 1080',
                fileSize: formatFileSize(parseInt(vf.size || '10000000', 10) * 0.2),
                format: 'H.264 High-Profile',
                url: vf.webViewLink || vf.webContentLink || streamUrl,
                description: 'Optimized for mobile playback & family sharing.',
              },
            ],
          };
        })
      : [
          {
            id: `f_default_${timestamp}`,
            title: 'Wedding Highlights (4K Master)',
            category: 'Highlight Film',
            duration: '08:45',
            durationSeconds: 525,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            sourceType: 'direct',
            coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
            description: 'Cinema highlight master film ready for client streaming.',
            chapters: [
              { id: 'c1', timeInSeconds: 0, title: 'Morning Elegance' },
              { id: 'c2', timeInSeconds: 120, title: 'The Exchange of Vows' },
              { id: 'c3', timeInSeconds: 310, title: 'Golden Hour Sunset' },
              { id: 'c4', timeInSeconds: 420, title: 'First Dance & Toast' },
            ],
            downloads: [
              {
                id: 'dl_1',
                label: 'Cinema 4K Master Film',
                resolution: '3840 x 2160',
                fileSize: '16.4 GB',
                format: 'Apple ProRes 422',
                url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                description: 'Original studio master archival file.',
              },
            ],
          },
        ];

  // Build photos
  const photos: GalleryPhoto[] =
    photoFiles.length > 0
      ? photoFiles.map((pf, idx) => ({
          id: `photo_drive_${pf.id}`,
          url:
            pf.thumbnailLink?.replace(/=s\d+/, '=s1920') ||
            pf.webContentLink ||
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
          caption: pf.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          category: idx % 3 === 0 ? 'Ceremony' : idx % 3 === 1 ? 'Portraits' : 'Reception',
        }))
      : [
          {
            id: `p_drive_sample_${timestamp}`,
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
            caption: 'Couple portrait at the manor',
            category: 'Portraits',
          },
          {
            id: `p_drive_sample_2_${timestamp}`,
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
            caption: 'Ceremony walk down the aisle',
            category: 'Ceremony',
          },
        ];

  const heroCoverImageUrl =
    photos[0]?.url ||
    films[0]?.coverImage ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85';

  return {
    id: `drive_proj_${timestamp}`,
    slug: `wedding-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'collection'}-${timestamp.toString().slice(-4)}`,
    title: projectTitle,
    subtitle: 'Cinema Collection & Fine Art Suite',
    eventDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    location: 'Private Estate',
    heroCoverImageUrl,
    theme: 'luxury-gold',
    isPasswordProtected: false,
    passcode: '2026',
    allowClientDownloads: true,
    allowGuestbook: true,
    enableStore: true,
    printLab: 'whcc',
    customMarkupPercent: 350,
    earlyBirdDiscountActive: true,
    earlyBirdPercent: 20,
    status: 'delivered',
    viewsCount: 1,
    downloadsCount: 0,
    storeSalesTotal: 0,
    storeProfitTotal: 0,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    customNotes: 'Imported seamlessly from Google Drive. Ready for client delivery and print store sales.',
    branding: {
      studioName: 'Film & Photo Studios',
      tagline: 'Luxury 4K Wedding Films & Fine Art Prints',
      filmmakerName: 'Cinematography Director',
      websiteUrl: 'https://filmandphoto.uk',
      instagramHandle: '@filmandphoto.uk',
      contactEmail: 'studio@filmandphoto.uk',
      primaryColor: '#d97706',
      showWatermark: false,
    },
    films,
    photos,
    guestbook: [],
  };
};
