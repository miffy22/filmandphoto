import { ClientProject } from '../types/cineflow';

/**
 * Clean baseline demo gallery for filmmakers to test 4K streaming & print store preview.
 * All fake orders and fake analytics have been cleared to $0 / 0 views.
 */
export const DEMO_SHOWCASE_PROJECT: ClientProject = {
  id: 'proj_sophia_alexander',
  slug: 'sophia-alexander-estate',
  title: 'Sophia & Alexander',
  subtitle: 'The Estate Celebration · Château de Villette',
  eventDate: 'June 20, 2026',
  location: 'Château de Villette · Paris, France',
  heroCoverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85',
  heroCoverVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
  theme: 'luxury-gold',
  isPasswordProtected: false,
  passcode: '2026',
  allowClientDownloads: true,
  allowGuestbook: true,
  enableStore: true,
  printLab: 'whcc',
  customMarkupPercent: 350,
  storeSalesTotal: 0,
  storeProfitTotal: 0,
  status: 'delivered',
  viewsCount: 0,
  downloadsCount: 0,
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  customNotes: 'A celebration of timeless love captured in cinematic 4K 60fps at Château de Villette.',
  orders: [],
  branding: {
    studioName: 'Film & Photo Studios',
    tagline: 'Luxury 4K Wedding Films & Fine Art Prints',
    filmmakerName: 'Lead Cinematographer',
    websiteUrl: 'https://filmandphoto.uk',
    instagramHandle: '@filmandphoto.uk',
    contactEmail: 'studio@filmandphoto.uk',
    primaryColor: '#d97706',
    showWatermark: false,
  },
  films: [
    {
      id: 'film_sa_1',
      title: 'The Cinematic Wedding Feature Film (4K)',
      category: 'Highlight Film',
      duration: '08:45',
      durationSeconds: 525,
      videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
      sourceType: 'direct',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
      description: 'Master 4K cinema feature film graded in Kodak Vision3 500T color science with sound design.',
      musicTrack: 'Bloom & Echoes',
      musicArtist: 'The Light Collective',
      licensePlatform: 'Musicbed',
      chapters: [
        { id: 'sa_c1', timeInSeconds: 0, title: 'Morning Preparations & Vow Books' },
        { id: 'sa_c2', timeInSeconds: 15, title: 'First Look in Versailles Orangery' },
        { id: 'sa_c3', timeInSeconds: 28, title: 'Bespoke Ceremony & Exchange of Rings' },
        { id: 'sa_c4', timeInSeconds: 42, title: 'Château Courtyard Reception & First Dance' },
      ],
      downloads: [
        {
          id: 'd_sa_1',
          label: 'Master 4K UHD Film',
          resolution: '3840 x 2160 (60fps)',
          fileSize: '16.8 GB',
          format: 'ProRes 422 HQ',
          url: 'https://vjs.zencdn.net/v/oceans.mp4',
          description: 'Uncompressed archival master for home cinema and Smart TVs.',
        },
        {
          id: 'd_sa_2',
          label: 'Web & Smart TV MP4',
          resolution: '3840 x 2160 (H.265 / HEVC)',
          fileSize: '3.4 GB',
          format: 'MP4 (4K HDR)',
          url: 'https://vjs.zencdn.net/v/oceans.mp4',
          description: 'Optimized for high-speed streaming and instant playback.',
        },
      ],
    },
    {
      id: 'film_sa_2',
      title: 'The Teaser Trailer',
      category: 'Teaser',
      duration: '01:15',
      durationSeconds: 75,
      videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      sourceType: 'direct',
      coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
      description: 'High-energy 60-second social edit formatted for Instagram Reels and 4K playback.',
      musicTrack: 'Pure Euphoria',
      musicArtist: 'Soundscape Echoes',
      licensePlatform: 'Musicbed',
      chapters: [
        { id: 'sa_t1', timeInSeconds: 0, title: 'Teaser Intro' },
      ],
      downloads: [
        {
          id: 'd_sa_teaser',
          label: '4K Teaser Cut',
          resolution: '3840 x 2160',
          fileSize: '950 MB',
          format: 'MP4 H.264',
          url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
          description: 'Fast mobile and social delivery cut.',
        },
      ],
    },
  ],
  photos: [
    {
      id: 'p_sa_1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
      caption: 'The Bride in Château French lace gown.',
      category: 'Portraits',
    },
    {
      id: 'p_sa_2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
      caption: 'Sunlight breaking through centuries-old estate gardens.',
      category: 'Ceremony',
    },
    {
      id: 'p_sa_3',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=85',
      caption: 'Fine art table florals and hand-calligraphed menu.',
      category: 'Details',
    },
  ],
  guestbook: [
    {
      id: 'gb_sa_1',
      author: 'Sophia & Alexander',
      relationship: 'The Couple',
      message: 'Watching this film brought us right back to our vows in Paris. Absolutely breathtaking!',
      timestamp: 'June 25, 2026',
      likes: 12,
    },
  ],
};

/**
 * Initial project list starts with the pristine demo showcase gallery,
 * with 0 mock sales and 0 fake orders. Professionals can wipe it in 1 click to start completely fresh.
 */
export const INITIAL_PROJECTS: ClientProject[] = [DEMO_SHOWCASE_PROJECT];
