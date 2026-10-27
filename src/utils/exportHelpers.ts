import { ClientProject } from '../types/cineflow';

/**
 * Generate a luxury client delivery email ready for the filmmaker to copy and send to couples/clients
 */
export function generateClientEmail(project: ClientProject, clientPortalUrl: string): { subject: string; body: string } {
  const pinText = project.isPasswordProtected && project.passcode
    ? `\n🔒 Your Private Access PIN: ${project.passcode}\n`
    : '';

  const subject = `Your Cinematic Films are Ready! ✨ ${project.title} — ${project.branding.studioName}`;

  const body = `Dear ${project.title},

We are so thrilled to share that your official cinematic films and heirloom gallery are complete! 🥂

Every frame from your day was a true honor to craft. We have created a private, distraction-free cinema portal for you to experience your films in full 4K UHD.

🎬 Access Your Cinema Gallery:
${clientPortalUrl}
${pinText}
What you will find inside your portal:
• Your Feature Films & Highlight cuts in 4K UHD
• Interactive Scene Chapters (jump straight to your vows, first dance, or speeches)
• High-Resolution Master Downloads for your family archive
• Mobile & Social cuts formatted for Instagram Reels and sharing
• TV Presentation Guide (how to watch together on your Smart TV via AirPlay or Chromecast)

We recommend opening this on a big screen, dimming the lights, and pouring a favorite glass of wine.

From the bottom of our hearts, thank you for trusting ${project.branding.studioName} with your memories.

Warmly,
${project.branding.filmmakerName}
${project.branding.studioName}
${project.branding.websiteUrl || ''}
${project.branding.instagramHandle || ''}`;

  return { subject, body };
}

/**
 * Generates a self-contained, standalone HTML export of the client portal that the videographer
 * can host anywhere for $0 (Cloudflare Pages, GitHub Pages, Netlify, Amazon S3, USB drive)
 */
export function generateStandaloneHtml(project: ClientProject): string {
  const sanitizedProjectJson = JSON.stringify(project).replace(/<\/script>/g, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title} — Cinematic Film Gallery | ${project.branding.studioName}</title>
  <meta name="description" content="Official cinematic gallery for ${project.title}. ${project.subtitle}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0a0a0a; color: #f5f5f5; }
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-playfair { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen">
  <header class="relative w-full h-[65vh] min-h-[460px] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('${project.heroCoverImageUrl}'); filter: brightness(0.4);"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
    <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <p class="text-amber-400 uppercase tracking-widest text-xs font-semibold mb-3">${project.subtitle} · ${project.eventDate}</p>
      <h1 class="font-cinzel text-4xl sm:text-6xl font-bold tracking-tight text-white mb-3">${project.title}</h1>
      <p class="text-neutral-400 text-sm sm:text-base">${project.location}</p>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 py-12">
    <section class="mb-16">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="font-cinzel text-2xl font-bold text-white">Cinematic Films</h2>
          <p class="text-xs text-neutral-400 mt-1">Select any film below to watch in full quality.</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${project.films.map(f => `
          <div class="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all">
            <div class="relative aspect-video bg-neutral-950">
              <img src="${f.coverImage}" alt="${f.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                <a href="${f.videoUrl}" target="_blank" rel="noopener noreferrer" class="w-14 h-14 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold shadow-lg hover:scale-110 transition-transform">
                  ▶
                </a>
              </div>
              <span class="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">${f.duration}</span>
            </div>
            <div class="p-5">
              <span class="text-xs text-amber-400 font-medium">${f.category}</span>
              <h3 class="text-lg font-bold text-white mt-1">${f.title}</h3>
              <p class="text-xs text-neutral-400 mt-2 line-clamp-2">${f.description}</p>
              ${f.chapters && f.chapters.length > 0 ? `
                <div class="mt-4 pt-4 border-t border-neutral-800/80">
                  <p class="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Chapters (${f.chapters.length})</p>
                  <div class="flex flex-wrap gap-1.5">
                    ${f.chapters.map(c => `<span class="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded">${c.title}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    ${project.photos && project.photos.length > 0 ? `
    <section class="mb-16">
      <h2 class="font-cinzel text-2xl font-bold text-white mb-2">Curated Stills</h2>
      <p class="text-xs text-neutral-400 mb-6">High resolution frames captured throughout your celebration.</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${project.photos.map(p => `
          <div class="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
            <img src="${p.url}" alt="${p.caption}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <section class="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 text-center max-w-2xl mx-auto">
      <h3 class="font-cinzel text-xl font-bold text-white mb-2">Master Download Vault</h3>
      <p class="text-xs text-neutral-400 mb-6">Download archival master 4K copies to your hard drive or cloud backup.</p>
      <div class="space-y-3">
        ${project.films[0]?.downloads.map(d => `
          <a href="${d.url}" download class="flex items-center justify-between p-3.5 bg-neutral-800/80 hover:bg-neutral-800 rounded-xl text-left border border-neutral-700/50 transition-colors">
            <div>
              <p class="text-sm font-semibold text-white">${d.label}</p>
              <p class="text-xs text-neutral-400">${d.resolution} · ${d.format}</p>
            </div>
            <span class="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-md">${d.fileSize}</span>
          </a>
        `).join('') || '<p class="text-xs text-neutral-400">Downloads available directly from filmmaker.</p>'}
      </div>
    </section>
  </main>

  <footer class="border-t border-neutral-800/60 py-10 text-center text-xs text-neutral-500">
    <p class="font-medium text-neutral-400">${project.branding.studioName}</p>
    <p class="mt-1">${project.branding.tagline}</p>
    <p class="mt-4 text-[11px] text-neutral-600">Delivered via CineFlow Studio · Zero Subscription Client Delivery</p>
  </footer>
</body>
</html>`;
}
