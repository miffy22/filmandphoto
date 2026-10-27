import React, { useState, useEffect } from 'react';
import { INITIAL_PROJECTS, DEMO_SHOWCASE_PROJECT } from './data/sampleProjects';
import { ClientProject, PrintLabProvider } from './types/cineflow';
import { Navbar } from './components/Navbar';
import { ProjectList } from './components/studio/ProjectList';
import { ProjectEditor } from './components/studio/ProjectEditor';
import { ClientGalleryView } from './components/client/ClientGalleryView';
import { SavingsCalculator } from './components/studio/SavingsCalculator';
import { ShareModal } from './components/studio/ShareModal';
import { LaunchPlatformModal } from './components/studio/LaunchPlatformModal';
import { PrintLabManager } from './components/studio/PrintLabManager';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingModal } from './components/landing/OnboardingModal';
import { MigrationModal } from './components/studio/MigrationModal';
import { CustomDomainModal } from './components/studio/CustomDomainModal';
import { AnalyticsModal } from './components/studio/AnalyticsModal';
import { CheckoutModal } from './components/billing/CheckoutModal';
import { LegalModal } from './components/legal/LegalModal';
import { GoogleDriveModal } from './components/studio/GoogleDriveModal';
import { PrivateStudioModal } from './components/studio/PrivateStudioModal';
import { StorageVaultModal } from './components/studio/StorageVaultModal';
import { ProfessionalStudio } from './types/cineflow';
import { X, Cloud, CloudCheck, RefreshCw } from 'lucide-react';
import {
  fetchProjectsFromCloud,
  saveProjectToCloud,
  deleteProjectFromCloud,
  fetchProjectByIdFromCloud,
  testConnection,
} from './firebase';

const STORAGE_KEY = 'cineflow_projects_v1';
const STUDIOS_STORAGE_KEY = 'cineflow_studios_v1';

const INITIAL_STUDIOS: ProfessionalStudio[] = [
  {
    id: 'studio_main',
    name: 'Film & Photo Studios',
    subdomain: 'app',
    customDomain: 'app.filmandphoto.uk',
    tagline: 'Luxury 4K Wedding Films & Fine Art Prints',
    filmmakerName: 'Lead Cinematographer',
    email: 'studio@filmandphoto.uk',
    website: 'https://filmandphoto.uk',
    instagram: '@filmandphoto.uk',
    primaryColor: '#d97706',
    theme: 'luxury-gold',
    defaultPrintLab: 'whcc',
    defaultMarkupPercent: 350,
    currency: 'GBP',
    storageProvider: 'native-vault',
    activeProjectsCount: 11,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'studio_belgravia',
    name: 'Belgravia Cinema Collective',
    subdomain: 'belgravia',
    customDomain: 'gallery.filmandphoto.uk',
    tagline: 'High-Art Cinematic Heirloom Films',
    filmmakerName: 'Julian Sterling',
    email: 'julian@belgraviafilms.com',
    website: 'https://belgravia.filmandphoto.uk',
    instagram: '@belgraviacinema',
    primaryColor: '#dc2626',
    theme: 'noir-cinema',
    defaultPrintLab: 'loxley',
    defaultMarkupPercent: 400,
    currency: 'GBP',
    storageProvider: 'native-vault',
    activeProjectsCount: 4,
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  const [projects, setProjects] = useState<ClientProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Auto-upgrade any legacy 403 Google Cloud Storage sample URLs to verified streams
          const sanitized = parsed.map((p: ClientProject) => {
            const hasBlockedUrl = p.heroCoverVideoUrl?.includes('commondatastorage.googleapis.com') ||
              p.films?.some((f) => f.videoUrl?.includes('commondatastorage.googleapis.com'));

            if (!hasBlockedUrl) return p;

            return {
              ...p,
              heroCoverVideoUrl: p.heroCoverVideoUrl?.includes('commondatastorage.googleapis.com')
                ? 'https://vjs.zencdn.net/v/oceans.mp4'
                : p.heroCoverVideoUrl,
              films: p.films?.map((f, idx) => ({
                ...f,
                videoUrl: f.videoUrl?.includes('commondatastorage.googleapis.com')
                  ? idx === 0 ? 'https://vjs.zencdn.net/v/oceans.mp4' : 'https://media.w3.org/2010/05/sintel/trailer.mp4'
                  : f.videoUrl,
                downloads: f.downloads?.map((d) => ({
                  ...d,
                  url: d.url?.includes('commondatastorage.googleapis.com')
                    ? idx === 0 ? 'https://vjs.zencdn.net/v/oceans.mp4' : 'https://media.w3.org/2010/05/sintel/trailer.mp4'
                    : d.url,
                })),
              })),
            };
          });
          return sanitized;
        }
      }
    } catch (e) {
      console.error('Failed to load saved projects', e);
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || '');
  const [currentView, setCurrentView] = useState<'landing' | 'studio' | 'editor' | 'client'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#studio') {
      return 'studio';
    }
    return 'landing';
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [onboardingPlanId, setOnboardingPlanId] = useState<string>('pro');
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState<boolean>(false);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState<boolean>(false);
  const [isPrintLabModalOpen, setIsPrintLabModalOpen] = useState<boolean>(false);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState<boolean>(false);
  const [isCustomDomainModalOpen, setIsCustomDomainModalOpen] = useState<boolean>(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState<boolean>(false);
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [isGoogleDriveModalOpen, setIsGoogleDriveModalOpen] = useState<boolean>(false);
  const [isPrivateStudioModalOpen, setIsPrivateStudioModalOpen] = useState<boolean>(false);
  const [isStorageVaultModalOpen, setIsStorageVaultModalOpen] = useState<boolean>(false);
  const [isSharePlatformModalOpen, setIsSharePlatformModalOpen] = useState<boolean>(false);
  const [shareProject, setShareProject] = useState<ClientProject | null>(null);

  const [studios, setStudios] = useState<ProfessionalStudio[]>(() => {
    try {
      const saved = localStorage.getItem(STUDIOS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: ProfessionalStudio) => ({
            ...s,
            storageProvider: s.storageProvider === 'google-drive' ? 'native-vault' : (s.storageProvider || 'native-vault'),
          }));
        }
      }
    } catch (e) {}
    return INITIAL_STUDIOS;
  });
  const [activeStudioId, setActiveStudioId] = useState<string>(studios[0]?.id || 'studio_main');
  const activeStudio = studios.find((s) => s.id === activeStudioId) || studios[0];

  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'syncing' | 'offline'>('connected');

  // Cloud Persistence: On mount, load projects from Firebase Firestore
  useEffect(() => {
    let isMounted = true;
    async function loadCloudProjects() {
      setIsCloudSyncing(true);
      try {
        await testConnection();
        const cloudProjects = await fetchProjectsFromCloud();
        if (isMounted) {
          if (cloudProjects && cloudProjects.length > 0) {
            setProjects(cloudProjects);
            setCloudStatus('connected');
          } else {
            setCloudStatus('syncing');
            for (const proj of INITIAL_PROJECTS) {
              await saveProjectToCloud(proj);
            }
            setCloudStatus('connected');
          }
        }
      } catch (err) {
        console.warn('Operating in local-first cache mode:', err);
        setCloudStatus('offline');
      } finally {
        if (isMounted) setIsCloudSyncing(false);
      }
    }
    loadCloudProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STUDIOS_STORAGE_KEY, JSON.stringify(studios));
    } catch (e) {}
  }, [studios]);

  // Sync projects to localStorage as local fallback
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to persist projects', e);
    }
  }, [projects]);

  // Handle URL hash and query params on initial load
  useEffect(() => {
    const handleUrlRouting = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      let targetSlug = '';

      if (hash.startsWith('#gallery/')) {
        targetSlug = hash.replace('#gallery/', '');
      } else if (params.get('gallery')) {
        targetSlug = params.get('gallery')!;
      } else if (params.get('id')) {
        targetSlug = params.get('id')!;
      } else if (params.get('portal')) {
        targetSlug = params.get('portal')!;
      }

      if (targetSlug) {
        const found = projects.find((p) => p.slug === targetSlug || p.id === targetSlug);
        if (found) {
          setActiveProjectId(found.id);
          setCurrentView('client');
          return;
        }

        try {
          const cloudFound = await fetchProjectByIdFromCloud(targetSlug);
          if (cloudFound) {
            setProjects((prev) => {
              if (prev.some((p) => p.id === cloudFound.id)) return prev;
              return [cloudFound, ...prev];
            });
            setActiveProjectId(cloudFound.id);
            setCurrentView('client');
          }
        } catch (e) {
          console.error('Failed to resolve cloud gallery:', e);
        }
      }
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, [projects]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleUpdateProject = (updated: ClientProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    saveProjectToCloud(updated).catch((err) => console.warn('Cloud sync error:', err));
  };

  const handleUpdateProjectLabSettings = (projectId: string, lab: PrintLabProvider, markup: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updated = { ...p, printLab: lab, customMarkupPercent: markup };
          saveProjectToCloud(updated).catch((err) => console.warn('Cloud sync error:', err));
          return updated;
        }
        return p;
      })
    );
  };

  const handleNewProject = () => {
    const newId = `proj_${Date.now()}`;
    const newProject: ClientProject = {
      id: newId,
      slug: `new-client-${Date.now().toString().slice(-4)}`,
      title: 'Sophia & Alexander',
      subtitle: 'The Estate Celebration',
      eventDate: 'June 20, 2026',
      location: 'Château de Villette · Paris, France',
      heroCoverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85',
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
      status: 'draft',
      viewsCount: 0,
      downloadsCount: 0,
      storeSalesTotal: 0,
      storeProfitTotal: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      customNotes: 'A magnificent weekend of celebration and quiet moments in the French countryside.',
      branding: {
        studioName: 'L\'Aura Cinema Studios',
        tagline: 'Artisanal Cinematic Films & Heirlooms',
        filmmakerName: 'Marco Bellini',
        websiteUrl: 'https://lauracinema.example.com',
        instagramHandle: '@lauracinemafilms',
        contactEmail: 'marco@lauracinema.example.com',
        primaryColor: '#d97706',
        showWatermark: false,
      },
      films: [
        {
          id: `f_${Date.now()}_1`,
          title: 'The Highlight Film (4K)',
          category: 'Highlight Film',
          duration: '07:30',
          durationSeconds: 450,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          sourceType: 'direct',
          coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
          description: 'The complete cinematic narrative of Sophia and Alexander’s wedding day.',
          musicTrack: 'Forever Bound',
          musicArtist: 'The Light Within',
          licensePlatform: 'Musicbed',
          chapters: [
            { id: `c_${Date.now()}_1`, timeInSeconds: 0, title: 'Morning Preparations' },
            { id: `c_${Date.now()}_2`, timeInSeconds: 95, title: 'Garden First Look' },
            { id: `c_${Date.now()}_3`, timeInSeconds: 180, title: 'The Vows' },
            { id: `c_${Date.now()}_4`, timeInSeconds: 290, title: 'Reception & First Dance' },
          ],
          downloads: [
            {
              id: `dl_${Date.now()}_1`,
              label: 'Master 4K UHD Film',
              resolution: '3840 x 2160',
              fileSize: '14.8 GB',
              format: 'Apple ProRes 422',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              description: 'Archival quality master film.',
            },
            {
              id: `dl_${Date.now()}_2`,
              label: 'Web & Mobile 1080p',
              resolution: '1920 x 1080',
              fileSize: '1.8 GB',
              format: 'H.264 MP4',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              description: 'Optimized for mobile viewing and family sharing.',
            },
          ],
        },
      ],
      photos: [
        {
          id: `p_${Date.now()}_1`,
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
          caption: 'Château terrace portrait at sunset',
          category: 'Portraits',
        },
      ],
      guestbook: [],
    };

    setProjects([newProject, ...projects]);
    setActiveProjectId(newId);
    setCurrentView('editor');
    saveProjectToCloud(newProject).catch((err) => console.warn('Cloud save error:', err));
  };

  const handleCloneProject = (source: ClientProject) => {
    const cloneId = `proj_${Date.now()}`;
    const cloned: ClientProject = {
      ...source,
      id: cloneId,
      slug: `${source.slug}-copy`,
      title: `${source.title} (Copy)`,
      viewsCount: 0,
      downloadsCount: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      guestbook: [],
    };

    setProjects([cloned, ...projects]);
    setActiveProjectId(cloneId);
    setCurrentView('editor');
    saveProjectToCloud(cloned).catch((err) => console.warn('Cloud save error:', err));
  };

  const handleDeleteProject = (projectId: string) => {
    const remaining = projects.filter((p) => p.id !== projectId);
    setProjects(remaining);
    if (activeProjectId === projectId) {
      setActiveProjectId(remaining[0]?.id || '');
    }
    deleteProjectFromCloud(projectId).catch((err) => console.warn('Cloud delete error:', err));
  };

  const handleClearAllTestData = () => {
    setProjects([]);
    setActiveProjectId('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const handleLoadDemoProject = () => {
    setProjects([DEMO_SHOWCASE_PROJECT]);
    setActiveProjectId(DEMO_SHOWCASE_PROJECT.id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([DEMO_SHOWCASE_PROJECT]));
    } catch (e) {}
  };

  const handleOpenOnboarding = (planId?: string) => {
    if (planId) setOnboardingPlanId(planId);
    setIsOnboardingOpen(true);
  };

  const handleCompleteOnboarding = (data: {
    studioName: string;
    subdomain: string;
    filmmakerName: string;
    email: string;
    planId: string;
    billingCycle: 'monthly' | 'annual';
  }) => {
    const newStudio: ProfessionalStudio = {
      id: `studio_${Date.now()}`,
      name: data.studioName,
      subdomain: data.subdomain,
      customDomain: `${data.subdomain}.filmandphoto.uk`,
      tagline: 'Luxury 4K Wedding Cinema & Fine Art Prints',
      filmmakerName: data.filmmakerName,
      email: data.email,
      website: `https://${data.subdomain}.filmandphoto.uk`,
      instagram: '',
      primaryColor: '#d97706',
      theme: 'luxury-gold',
      defaultPrintLab: 'whcc',
      defaultMarkupPercent: 350,
      currency: 'GBP',
      storageProvider: 'native-vault',
      activeProjectsCount: 0,
      createdAt: new Date().toISOString(),
    };

    setStudios([newStudio, ...studios]);
    setActiveStudioId(newStudio.id);
    setIsOnboardingOpen(false);
    setCurrentView('studio');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Global Navbar */}
      <Navbar
        currentView={currentView}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(p) => {
          setActiveProjectId(p.id);
        }}
        onSwitchView={(v) => setCurrentView(v)}
        onOpenSavings={() => setIsSavingsModalOpen(true)}
        onOpenLaunchModal={() => setIsLaunchModalOpen(true)}
        onOpenPrintLabs={() => setIsPrintLabModalOpen(true)}
        onOpenMigration={() => setIsMigrationModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        onOpenCustomDomain={() => setIsCustomDomainModalOpen(true)}
        onOpenGoogleDrive={() => setIsGoogleDriveModalOpen(true)}
        onOpenPrivateStudio={() => setIsPrivateStudioModalOpen(true)}
        onOpenStorageVault={() => setIsStorageVaultModalOpen(true)}
        onOpenSharePlatform={() => setIsSharePlatformModalOpen(true)}
        onOpenOnboarding={handleOpenOnboarding}
        onNewProject={handleNewProject}
      />

      {/* Main Views */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onEnterStudio={() => setCurrentView('studio')}
            onViewDemoGallery={() => {
              if (projects.length === 0) {
                setProjects([DEMO_SHOWCASE_PROJECT]);
                setActiveProjectId(DEMO_SHOWCASE_PROJECT.id);
              } else {
                setActiveProjectId(projects[0]?.id || '');
              }
              setCurrentView('client');
            }}
            onOpenCheckout={(planId) => setCheckoutPlanId(planId)}
            onOpenMigration={() => setIsMigrationModalOpen(true)}
            onOpenLegal={() => setIsLegalModalOpen(true)}
            onOpenOnboarding={handleOpenOnboarding}
          />
        )}

        {currentView === 'client' && (
          <ClientGalleryView
            project={activeProject || DEMO_SHOWCASE_PROJECT}
            onUpdateProject={handleUpdateProject}
            onBackToStudio={() => setCurrentView('studio')}
          />
        )}

        {currentView === 'studio' && (
          <ProjectList
            projects={projects}
            onSelectProject={(p) => {
              setActiveProjectId(p.id);
              setCurrentView('client');
            }}
            onEditProject={(p) => {
              setActiveProjectId(p.id);
              setCurrentView('editor');
            }}
            onShareProject={(p) => setShareProject(p)}
            onNewProject={handleNewProject}
            onCloneProject={handleCloneProject}
            onDeleteProject={handleDeleteProject}
            onClearAllTestData={handleClearAllTestData}
            onLoadDemoProject={handleLoadDemoProject}
            onOpenSavingsCalculator={() => setIsSavingsModalOpen(true)}
            onOpenLaunchModal={() => setIsLaunchModalOpen(true)}
            onOpenPrintLabs={() => setIsPrintLabModalOpen(true)}
            onOpenGoogleDrive={() => setIsGoogleDriveModalOpen(true)}
            onOpenPrivateStudio={() => setIsPrivateStudioModalOpen(true)}
            onOpenStorageVault={() => setIsStorageVaultModalOpen(true)}
            onOpenSharePlatform={() => setIsSharePlatformModalOpen(true)}
            onOpenCustomDomain={() => setIsCustomDomainModalOpen(true)}
          />
        )}

        {currentView === 'editor' && (
          <ProjectEditor
            project={activeProject || DEMO_SHOWCASE_PROJECT}
            onSave={handleUpdateProject}
            onPreviewClientView={() => setCurrentView('client')}
            onBack={() => setCurrentView('studio')}
          />
        )}
      </main>

      {/* VidFlow Savings & $0 Free Hosting Blueprint Modal */}
      {isSavingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8">
            <button
              type="button"
              onClick={() => setIsSavingsModalOpen(false)}
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors shadow-xl"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <SavingsCalculator />
          </div>
        </div>
      )}

      {/* Share / Deliver Modal */}
      {shareProject && (
        <ShareModal
          project={shareProject}
          isOpen={true}
          onClose={() => setShareProject(null)}
          onPreviewClientView={() => {
            setActiveProjectId(shareProject.id);
            setShareProject(null);
            setCurrentView('client');
          }}
        />
      )}

      {/* Commercial SaaS Launch & Domain Strategy Modal */}
      <LaunchPlatformModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
      />

      {/* Print Lab Fulfillment & Profit Markup Manager (WHCC, Miller's, Loxley) */}
      <PrintLabManager
        isOpen={isPrintLabModalOpen}
        onClose={() => setIsPrintLabModalOpen(false)}
        projects={projects}
        onUpdateProjectLabSettings={handleUpdateProjectLabSettings}
      />

      {/* 1-Click Migration Modal */}
      <MigrationModal
        isOpen={isMigrationModalOpen}
        onClose={() => setIsMigrationModalOpen(false)}
        onImportComplete={(migratedProject) => {
          setProjects([migratedProject, ...projects]);
          setActiveProjectId(migratedProject.id);
          setCurrentView('editor');
        }}
      />

      {/* Custom Domain & White-Labeling Modal */}
      <CustomDomainModal
        isOpen={isCustomDomainModalOpen}
        onClose={() => setIsCustomDomainModalOpen(false)}
        studioName={activeProject?.branding?.studioName || 'Studio'}
      />

      {/* Client Streaming Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        projects={projects}
      />

      {/* Checkout Modal (Stripe / LemonSqueezy) */}
      {checkoutPlanId && (
        <CheckoutModal
          isOpen={true}
          planId={checkoutPlanId}
          onClose={() => setCheckoutPlanId(null)}
          onUpgradeSuccess={(upgradedPlan) => {
            setCheckoutPlanId(null);
            setCurrentView('studio');
          }}
        />
      )}

      {/* Legal & Compliance Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />

      {/* Google Drive Studio Vault Modal */}
      <GoogleDriveModal
        isOpen={isGoogleDriveModalOpen}
        onClose={() => setIsGoogleDriveModalOpen(false)}
        onImportProject={(project) => {
          setProjects([project, ...projects]);
          setActiveProjectId(project.id);
          setCurrentView('client');
          setIsGoogleDriveModalOpen(false);
        }}
      />

      {/* Private Studio Creation & White-Label Management */}
      <PrivateStudioModal
        isOpen={isPrivateStudioModalOpen}
        onClose={() => setIsPrivateStudioModalOpen(false)}
        studios={studios}
        activeStudio={activeStudio}
        onSelectStudio={(s) => setActiveStudioId(s.id)}
        onCreateStudio={(newStudio) => setStudios([newStudio, ...studios])}
        onUpdateStudio={(upd) => setStudios(studios.map((s) => (s.id === upd.id ? upd : s)))}
      />

      {/* Multi-Cloud Zero-Egress Storage Vault Modal */}
      <StorageVaultModal
        isOpen={isStorageVaultModalOpen}
        onClose={() => setIsStorageVaultModalOpen(false)}
        onOpenGoogleDrive={() => setIsGoogleDriveModalOpen(true)}
      />

      {/* Professional Instant Studio Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialPlanId={onboardingPlanId}
        onComplete={handleCompleteOnboarding}
      />

      {/* Share Platform with Colleagues & Professionals Modal */}
      <SharePlatformModal
        isOpen={isSharePlatformModalOpen}
        onClose={() => setIsSharePlatformModalOpen(false)}
      />
    </div>
  );
}
