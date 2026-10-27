import React, { useState } from 'react';
import { X, Shield, FileText, Lock, Music, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const [activeDoc, setActiveDoc] = useState<'terms' | 'privacy' | 'music' | 'dmca'>('terms');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative flex flex-col max-h-[85vh]">
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
              Legal Compliance Center
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
              Platform Terms, Privacy & Licensing Policies
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Switcher Tabs */}
        <div className="grid grid-cols-4 gap-2 my-4 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveDoc('terms')}
            className={`py-2 px-3 rounded-lg font-semibold transition-colors ${
              activeDoc === 'terms' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => setActiveDoc('privacy')}
            className={`py-2 px-3 rounded-lg font-semibold transition-colors ${
              activeDoc === 'privacy' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setActiveDoc('music')}
            className={`py-2 px-3 rounded-lg font-semibold transition-colors ${
              activeDoc === 'music' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Music Licensing
          </button>
          <button
            type="button"
            onClick={() => setActiveDoc('dmca')}
            className={`py-2 px-3 rounded-lg font-semibold transition-colors ${
              activeDoc === 'dmca' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            DMCA Policy
          </button>
        </div>

        {/* Scrollable Text Body */}
        <div className="flex-1 overflow-y-auto text-xs text-neutral-300 space-y-4 pr-3 leading-relaxed">
          {activeDoc === 'terms' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white">1. Master Subscription & Services Agreement</h4>
              <p>
                By using CineFlow Studio ("Service"), you agree to these Terms. You represent that you are a video producer, filmmaker, studio owner, or authorized client accessing delivery portals.
              </p>
              <h4 className="font-bold text-sm text-white">2. Storage & Bandwidth Responsibilities</h4>
              <p>
                Under the Bring Your Own Storage (BYOS) model, you are solely responsible for media stored in your third-party cloud accounts (Google Drive, Dropbox, Cloudflare R2). CineFlow acts as an interface layer and client presentation framework.
              </p>
              <h4 className="font-bold text-sm text-white">3. Acceptable Use</h4>
              <p>
                You may not upload, transmit, or deliver adult content, malicious software, defamatory material, or content that infringes on third-party intellectual property rights.
              </p>
            </div>
          )}

          {activeDoc === 'privacy' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white">GDPR & CCPA Data Privacy</h4>
              <p>
                CineFlow processes client names, wedding dates, and video metadata solely for the purpose of rendering private heirloom film galleries.
              </p>
              <h4 className="font-bold text-sm text-white">Zero Sale of Client Data</h4>
              <p>
                We never sell, rent, or monetize client email addresses or couple identities to advertising networks. Your clients' data remains strictly private to your studio account.
              </p>
            </div>
          )}

          {activeDoc === 'music' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white">Music Synchronization Compliance</h4>
              <p>
                Filmmakers are solely responsible for obtaining valid synchronization and mechanical licenses for all audio tracks included in video deliverables.
              </p>
              <p>
                CineFlow provides built-in metadata badges to document licenses from platforms such as <strong>Musicbed</strong>, <strong>Artlist</strong>, <strong>Epidemic Sound</strong>, and <strong>Soundstripe</strong>. Displaying license information helps couples and broadcasters verify legitimate licensing rights.
              </p>
            </div>
          )}

          {activeDoc === 'dmca' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white">DMCA Copyright Takedown Procedure</h4>
              <p>
                If you believe content hosted on a CineFlow client gallery infringes upon your copyright, you may submit a formal Notice of Copyright Infringement to our designated agent at <span className="text-amber-400 font-mono">dmca@cineflow.app</span>.
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
          >
            I Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
