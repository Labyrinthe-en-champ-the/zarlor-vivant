/* =====================================================================
   MODE HORS LIGNE – Le Zarlor Vivant
   ---------------------------------------------------------------------
   Permet au Zarlor de s'ouvrir sans réseau dans la forêt.
   - Avec du réseau : le jeu est chargé normalement (dernière version),
     et une copie est gardée sur le téléphone.
   - Sans réseau (ou réseau trop lent, plus de 4 secondes) : la copie
     gardée sur le téléphone est utilisée.
   Les adresses des QR codes (?espece=…) ne changent pas.
   Si vous modifiez un fichier du jeu : rien à faire, la nouvelle version
   est récupérée automatiquement dès qu'il y a du réseau.
   ===================================================================== */
const CACHE = 'labyrinthe-jeux';          // mémoire commune avec la page d'accueil
const DELAI_RESEAU_MS = 4000;
const DOSSIER = new URL('./', self.location).pathname;   // ex. /challenge-des-experts/
const FICHIERS = [
  './',
  './style.css',
  './style.css?v=3',
  './app.js',
  './app.js?v=3',
  './zarlor.json',
  './html5-qrcode.min.js',
  './logo-zarlor.png',
  './chewy.woff2',
  './plus-jakarta-sans.woff2'
];
const HOTES_EXTERNES = ['fonts.googleapis.com', 'fonts.gstatic.com', 'unpkg.com', 'cdn.jsdelivr.net'];

function cleDe(url) {
  const u = new URL(url, self.location);
  if (u.origin === self.location.origin) {
    u.search = '';
    if (u.pathname.endsWith('/index.html')) u.pathname = u.pathname.slice(0, -10);
  }
  u.hash = '';
  return u.toString();
}
async function nettoyer(rep) {
  if (!rep || !rep.redirected) return rep;
  return new Response(await rep.blob(), { status: rep.status, statusText: rep.statusText, headers: rep.headers });
}
async function telecharger(cache, adresse) {
  try {
    const u = new URL(adresse, self.location);
    const externe = u.origin !== self.location.origin;
    const rep = await fetch(new Request(u, { cache: 'reload', mode: externe ? 'cors' : 'same-origin' }));
    if (!rep.ok) return;
    if (u.hostname === 'fonts.googleapis.com') {
      const css = await rep.clone().text();
      const polices = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(m => m[1]);
      await Promise.all(polices.map(p => telecharger(cache, p)));
    }
    await cache.put(cleDe(u), await nettoyer(rep));
  } catch (e) { /* ignoré */ }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(FICHIERS.map(f => telecharger(cache, f)));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (!url.pathname.startsWith(DOSSIER) || url.pathname.endsWith('.pdf') || url.pathname.endsWith('/sw.js')) return;
    event.respondWith(reseauPuisCopie(event));
  } else if (HOTES_EXTERNES.includes(url.hostname)) {
    event.respondWith(copiePuisReseau(req));
  }
});

async function reseauPuisCopie(event) {
  const req = event.request;
  const cle = cleDe(req.url);
  const cache = await caches.open(CACHE);
  // « no-cache » : le téléphone vérifie toujours auprès de GitHub s'il existe une version plus récente
  const demande = req.mode === 'navigate' ? req : new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' });
  const reseau = fetch(demande).then(async rep => {
    if (rep && rep.ok) await cache.put(cle, await nettoyer(rep.clone()));
    return rep;
  });
  event.waitUntil(reseau.catch(() => {}));
  const delai = new Promise(r => setTimeout(r, DELAI_RESEAU_MS, null));
  try {
    const rep = await Promise.race([reseau, delai]);
    if (rep && rep.ok) return await nettoyer(rep);
    if (rep && rep.status === 404) return rep;
  } catch (e) {}
  const copie = await cache.match(cle);
  if (copie) return copie;
  try { return await reseau; } catch (e) {}
  return new Response('<p style="font-family:sans-serif;padding:24px">Pas de réseau. Ouvrez d\'abord la page d\'accueil des jeux à l\'entrée.<br>No network. Open the games home page at the entrance first.</p>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
async function copiePuisReseau(req) {
  const cache = await caches.open(CACHE);
  const copie = await cache.match(cleDe(req.url));
  if (copie) return copie;
  try {
    const rep = await fetch(req);
    if (rep && rep.ok) cache.put(cleDe(req.url), rep.clone());
    return rep;
  } catch (e) { return new Response('', { status: 504 }); }
}
