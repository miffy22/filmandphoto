import React, { useState } from 'react';
import {
  Film, Eye, Plus, Globe, ShoppingBag, Sparkles, LayoutDashboard,
  Menu, X, ArrowUpRight, HardDrive, Building2, Cloud, Share2, ArrowRight
} from 'lucide-react';
import { ClientProject } from '../types/cineflow';

interface NavbarProps {
  currentView: 'landing' | 'studio' | 'editor' | 'client';
  projects: ClientProject[];
  activeProject?: ClientProject;
  onSelectProject: (project: ClientProject) => void;
  onSwitchView: (view: 'landing' | 'studio' | 'editor' | 'client') => void;
  onOpenSavings: () => void;
  onOpenLaunchModal: () => void;
  onOpenPrintLabs: () => void;
  onOpenMigration: () => void;
  onOpenAnalytics: () => void;
  onOpenCustomDomain: () => void;
  onOpenGoogleDrive?: () => void;
  onOpenPrivateStudio?: () => void;
  onOpenStorageVault?: () => void;
  onOpenSharePlatform?: () => void;
  onOpenOnboarding?: () => void;
  onNewProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  projects,
  activeProject,
  onSelectProject,
  onSwitchView,
  onOpenSavings,
  onOpenLaunchModal,
  onOpenPrintLabs,
  onOpenMigration,
  onOpenAnalytics,
  onOpenCustomDomain,
  onOpenGoogleDrive,
  onOpenPrivateStudio,
  onOpenStorageVault,
  onOpenSharePlatform,
  onOpenOnboarding,
  onNewProject,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSwitchView('landing')}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-neutral-900 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shadow-md shadow-amber-500/10">
            <Film className="w-4 h-4" />
          </div>
          <span className="font-cinzel text-base sm:text-lg font-extrabold tracking-wider text-white group-hover:text-amber-300 transition-colors">
            FILM & PHOTO
          </span>
        </button>

        {/* Desktop Contextual Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-300">
          {currentView === 'landing' ? (
            <>
              <a href="#why-us" className="hover:text-amber-300 transition-colors">Why Us</a>
              <a href="#comparison" className="hover:text-amber-300 transition-colors">Vs. Competitors</a>
              <a href="#pricing" className="hover:text-amber-300 transition-colors">Storage & Pricing</a>
              <a href="#calculator" className="hover:text-amber-300 transition-colors">ROI Calculator</a>
              <button
                type="button"
                onClick={() => onSwitchView('client')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 text-neutral-300"
              >
                <span>Live 4K Demo</span>
                <Eye className="w-3 h-3 text-amber-400" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onSwitchView('studio')}
                className={`transition-colors hover:text-white ${
                  currentView === 'studio' || currentView === 'editor' ? 'text-amber-400 font-bold' : ''
                }`}
              >
                Galleries
              </button>

              <button
                type="button"
                onClick={() => onSwitchView('client')}
                className={`transition-colors hover:text-white flex items-center gap-1 ${
                  currentView === 'client' ? 'text-amber-400 font-bold' : ''
                }`}
              >
                <span>Client View</span>
                <Eye className="w-3 h-3 text-neutral-400" />
              </button>

              <button
                type="button"
                onClick={onOpenPrintLabs}
                className="transition-colors hover:text-amber-300 flex items-center gap-1.5"
              >
                <span>Print Labs (0%)</span>
              </button>

              <button
                type="button"
                onClick={onOpenCustomDomain}
                className="transition-colors hover:text-white"
              >
                Domains
              </button>

              {onOpenStorageVault && (
                <button
                  type="button"
                  onClick={onOpenStorageVault}
                  className="transition-colors hover:text-white"
                >
                  Cloud Vault
                </button>
              )}

              {onOpenSharePlatform && (
                <button
                  type="button"
                  onClick={onOpenSharePlatform}
                  className="transition-colors hover:text-amber-300 flex items-center gap-1 text-amber-400/90"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Platform</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onSwitchView('landing')}
                className="transition-colors hover:text-white text-neutral-400"
              >
                Marketing Site
              </button>
            </>
          )}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {currentView === 'landing' ? (
            <>
              <button
                type="button"
                onClick={() => onSwitchView('studio')}
                className="py-2 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-medium text-xs transition-colors border border-neutral-800"
              >
                Studio Sign In
              </button>

              <button
                type="button"
                onClick={onOpenOnboarding ? onOpenOnboarding : () => onSwitchView('studio')}
                className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 hover:scale-105"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onNewProject}
                className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Gallery</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Refined Mobile Drawer Menu (Structured & Grouped) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950/98 px-5 py-5 space-y-5 shadow-2xl">
          {/* Main Views */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold px-2">
              Workspace & Views
            </span>
            <div className="space-y-1 pt-1">
              <button
                type="button"
                onClick={() => {
                  onSwitchView('studio');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                  currentView === 'studio' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  Galleries & Deliveries
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">Studio</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSwitchView('client');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                  currentView === 'client' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  Live 4K Client Gallery Demo
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">Client</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSwitchView('landing');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                  currentView === 'landing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                  Public Landing & Pricing
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">Home</span>
              </button>
            </div>
          </div>

          {/* Studio Tools */}
          <div className="space-y-1 pt-2 border-t border-neutral-900">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold px-2">
              Studio Operations
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  onOpenPrintLabs();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-left text-neutral-300 hover:text-white"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400 mb-1" />
                <div className="font-semibold text-xs">Print Labs</div>
                <div className="text-[10px] text-emerald-400">0% Commission</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenCustomDomain();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-left text-neutral-300 hover:text-white"
              >
                <Globe className="w-4 h-4 text-amber-400 mb-1" />
                <div className="font-semibold text-xs">Domains & DNS</div>
                <div className="text-[10px] text-neutral-400">White-label</div>
              </button>

              {onOpenStorageVault && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenStorageVault();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-left text-neutral-300 hover:text-white"
                >
                  <Cloud className="w-4 h-4 text-emerald-400 mb-1" />
                  <div className="font-semibold text-xs">Cloud Vault</div>
                  <div className="text-[10px] text-neutral-400">$0 Egress Fees</div>
                </button>
              )}

              {onOpenSharePlatform && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenSharePlatform();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-left text-neutral-300 hover:text-white"
                >
                  <Share2 className="w-4 h-4 text-amber-400 mb-1" />
                  <div className="font-semibold text-xs">Share Link</div>
                  <div className="text-[10px] text-neutral-400">Invite Colleagues</div>
                </button>
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 border-t border-neutral-900">
            <button
              type="button"
              onClick={() => {
                onNewProject();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Client Gallery</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
