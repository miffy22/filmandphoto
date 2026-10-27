export type GalleryTheme = 'luxury-gold' | 'noir-cinema' | 'velvet-champagne' | 'modern-minimalist' | 'earthy-emerald';

export type VideoSourceType = 'direct' | 'googledrive' | 'dropbox' | 'youtube' | 'vimeo' | 'cloudflare-r2' | 'local';

export interface VideoChapter {
  id: string;
  timeInSeconds: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface FilmDownloadOption {
  id: string;
  label: string;
  resolution: string; // e.g. "4K UHD (3840x2160)", "1080p Full HD", "9:16 Vertical Reel"
  fileSize: string; // e.g. "14.2 GB", "1.8 GB"
  format: string; // e.g. "ProRes 422", "MP4 H.264", "HEVC"
  url: string;
  description: string;
}

export interface FilmItem {
  id: string;
  title: string;
  category: 'Teaser' | 'Highlight Film' | 'Feature Film' | 'Full Ceremony' | 'Speeches' | 'Drone Reel' | 'Social Reel' | 'Commercial Cut';
  duration: string; // e.g. "01:05", "08:42", "42:15"
  durationSeconds: number;
  videoUrl: string;
  sourceType: VideoSourceType;
  coverImage: string;
  description: string;
  musicTrack?: string;
  musicArtist?: string;
  licensePlatform?: 'Musicbed' | 'Artlist' | 'Epidemic Sound' | 'Licensed Direct' | 'Custom Score';
  chapters: VideoChapter[];
  downloads: FilmDownloadOption[];
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category?: 'Ceremony' | 'Portraits' | 'Reception' | 'Details' | 'Behind The Scenes';
  width?: number;
  height?: number;
}

export interface GuestbookEntry {
  id: string;
  author: string;
  relationship: string; // e.g. "Mother of the Bride", "Best Friend", "Maid of Honor"
  message: string;
  timestamp: string;
  likes: number;
}

export interface StudioBranding {
  studioName: string;
  tagline: string;
  logoUrl?: string;
  filmmakerName: string;
  websiteUrl: string;
  instagramHandle: string;
  contactEmail: string;
  primaryColor: string;
  showWatermark: boolean;
}

export type PrintLabProvider = 'whcc' | 'millers' | 'loxley' | 'atkins' | 'prodpi';

export type ProductCategory = 'albums' | 'framed-prints' | 'paper-prints' | 'canvas' | 'usb-keepsake' | 'metal-acrylic';

export interface PrintProduct {
  id: string;
  category: ProductCategory;
  name: string;
  description: string;
  size: string;
  labCost: number; // Wholesale lab cost from WHCC/Millers
  retailPrice: number; // Retail price set by photographer
  labProvider: PrintLabProvider;
  previewMockupUrl: string;
  availableOptions?: {
    finishes?: string[];
    frames?: string[];
    coverMaterials?: string[];
  };
}

export interface StoreOrderItem {
  id: string;
  productId: string;
  productName: string;
  size: string;
  photoUrl: string;
  selectedOption?: string;
  quantity: number;
  unitPrice: number;
  unitLabCost: number;
}

export interface StoreOrder {
  id: string;
  orderNumber: string;
  projectId: string;
  clientName: string;
  clientEmail: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: StoreOrderItem[];
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  shipping: number;
  total: number;
  photographerProfit: number;
  labCostTotal: number;
  status: 'paid' | 'in_production' | 'shipped' | 'delivered';
  labProvider: PrintLabProvider;
  trackingNumber?: string;
  createdAt: string;
}

export interface ClientProject {
  id: string;
  slug: string;
  title: string; // e.g. "Elena & Julian"
  subtitle: string; // e.g. "The Italian Coastal Wedding"
  eventDate: string; // e.g. "September 18, 2025"
  location: string; // e.g. "Villa Cimbrone, Ravello, Italy"
  heroCoverVideoUrl?: string;
  heroCoverImageUrl: string;
  theme: GalleryTheme;
  isPasswordProtected: boolean;
  passcode?: string;
  allowClientDownloads: boolean;
  allowGuestbook: boolean;
  enableStore: boolean;
  printLab: PrintLabProvider;
  customMarkupPercent?: number;
  earlyBirdDiscountActive?: boolean;
  earlyBirdPercent?: number;
  films: FilmItem[];
  photos: GalleryPhoto[];
  guestbook: GuestbookEntry[];
  orders?: StoreOrder[];
  branding: StudioBranding;
  customNotes?: string;
  createdAt: string;
  lastUpdated: string;
  viewsCount: number;
  downloadsCount: number;
  storeSalesTotal?: number;
  storeProfitTotal?: number;
  status: 'draft' | 'delivered' | 'archived';
  proofingStatus?: 'in_review' | 'changes_requested' | 'client_approved' | 'delivered';
  revisionComments?: ClientRevisionComment[];
  selectedFavorites?: string[];
  albumSelections?: string[];
}

export interface ClientRevisionComment {
  id: string;
  filmId: string;
  timecodeSeconds: number;
  timecodeFormatted: string;
  authorName: string;
  authorRole: 'Bride' | 'Groom' | 'Client' | 'Planner';
  text: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

export interface ProfessionalStudio {
  id: string;
  name: string;
  subdomain: string; // e.g. "luxurystudio" -> "luxurystudio.filmandphoto.uk"
  customDomain?: string; // e.g. "gallery.luxurystudio.com"
  tagline: string;
  filmmakerName: string;
  email: string;
  phone?: string;
  website: string;
  instagram: string;
  primaryColor: string;
  logoUrl?: string;
  theme: GalleryTheme;
  defaultPrintLab: PrintLabProvider;
  defaultMarkupPercent: number;
  currency: 'GBP' | 'USD' | 'EUR' | 'AUD' | 'CAD';
  storageProvider: 'cloudflare-r2' | 'aws-s3' | 'google-drive' | 'bunny-cdn' | 'native-vault';
  activeProjectsCount: number;
  createdAt: string;
}

export interface StorageProviderConfig {
  provider: 'cloudflare-r2' | 'aws-s3' | 'google-drive' | 'bunny-cdn' | 'native-vault';
  bucketName: string;
  endpointUrl?: string;
  accessKeyId?: string;
  publicCdnUrl?: string;
  region?: string;
  connected: boolean;
  usedStorageBytes?: number;
}

