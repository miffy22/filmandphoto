import React, { useState } from 'react';
import { X, Copy, CheckCircle2, Mail, Download, Globe, FileCode, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientProject } from '../../types/cineflow';
import { generateClientEmail, generateStandaloneHtml } from '../../utils/exportHelpers';

interface ShareModalProps {
  project: ClientProject;
  isOpen: boolean;
  onClose: () => void;
  onPreviewClientView: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  project,
  isOpen,
  onClose,
  onPreviewClientView,
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'email' | 'export'>('link');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const clientPortalUrl = `${window.location.origin}${window.location.pathname}#gallery/${project.slug}`;
  const { subject, body } = generateClientEmail(project, clientPortalUrl);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(clientPortalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopiedEmail(true);
    try {
      confetti({ particleCount: 40, spread: 45, origin: { y: 0.7 } });
    } catch (e) {}
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleDownloadStandaloneHtml = () => {
    const html = generateStandaloneHtml(project);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.slug}-cinema-portal.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
              Client Delivery Center
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
              Deliver Films to {project.title}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Share the live portal, copy the client email, or download the standalone HTML archive.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'link'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Direct Link</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'email'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Delivery Email</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'export'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Standalone Export</span>
          </button>
        </div>

        {/* Tab 1: Direct Link */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Client Portal URL (Share with Couple)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={clientPortalUrl}
                  className="flex-1 font-mono text-xs bg-neutral-900 border border-neutral-700 px-3 py-2.5 rounded-xl text-neutral-200 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-neutral-950" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {project.isPasswordProtected && project.passcode && (
                <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                  <span>Gallery Protection PIN:</span>
                  <span className="font-mono text-amber-400 font-bold bg-neutral-900 px-2 py-0.5 rounded">
                    {project.passcode}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPreviewClientView();
                }}
                className="text-xs text-neutral-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
              >
                <span>Launch Client Experience in New View →</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Delivery Email */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs">
              <div className="mb-2 pb-2 border-b border-neutral-800 font-mono text-neutral-400">
                <strong className="text-white">Subject:</strong> {subject}
              </div>
              <div className="max-h-60 overflow-y-auto whitespace-pre-wrap text-neutral-300 font-sans leading-relaxed pr-2">
                {body}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
              >
                {copiedEmail ? <CheckCircle2 className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                <span>{copiedEmail ? 'Email Copied to Clipboard!' : 'Copy Formatted Email'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Standalone Export */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Zero Recurring Cost Standalone Packaging</span>
              </div>
              <p className="leading-relaxed">
                Download a self-contained, single-file <code className="text-amber-300 bg-neutral-900 px-1 py-0.5 rounded">.html</code> export containing the complete luxury video player, scene chapters, photo gallery, and branding.
              </p>
              <div className="bg-neutral-900 p-3 rounded-xl space-y-1.5 text-[11px] text-neutral-400">
                <p>• <strong>Free Web Hosting:</strong> Drag and drop this file to GitHub Pages, Cloudflare Pages, or Netlify for $0.00/mo.</p>
                <p>• <strong>Physical Keepsake:</strong> Copy this file onto a luxury USB thumb drive or heirloom hard drive delivered to the couple.</p>
                <p>• <strong>No Vendor Lock-in:</strong> Unlike VidFlow, this portal will never expire and cannot be deleted by a 3rd party.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleDownloadStandaloneHtml}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Standalone Portal (.html)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
