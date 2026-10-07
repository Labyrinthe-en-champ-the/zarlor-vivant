/* =====================================================================
   LE ZARLOR VIVANT – logique du jeu
   Les textes des fiches et des indices sont dans zarlor.json.
   Ici : uniquement les libellés de l'interface (boutons, menus).
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Libellés de l'interface ---------- */
  const I18N = {
    fr: {
      challenge: 'Challenge', tous_jeux: 'Tous les jeux',
      mes_pancartes: 'Mes 17 pancartes', trouvees: 'fiches lues', repondues: 'réponses',
      suivante: 'Pancarte suivante',
      a_decouvrir: 'À découvrir', repondu: '✓ Répondu', a_repondre: 'À répondre',
      lire_pancarte: n => `Lisez bien la pancarte n°${n} dans le labyrinthe : c'est elle qui vous mettra sur la piste.`,
      pancarte_n: 'Pancarte n°', retour: 'Mes pancartes', habitat: 'Mon habitat', indice: "L'indice",
      resultat: 'Mon résultat', valider: 'Valider mes réponses', revalider: 'Revalider mes réponses',
      modifier: 'Modifier mes réponses', nouvelle: 'Nouvelle partie',
      aide_resultat: 'Validez quand vous voulez : vous verrez votre note sur 17, et vous pourrez encore corriger vos réponses puis revalider.',
      score_perime: 'Vous avez modifié des réponses depuis : revalidez pour mettre la note à jour.',
      nav_parcours: 'Parcours', nav_resultat: 'Résultat',
      oui: 'Oui', annuler: 'Annuler',
      reponse_vide: "Tapez d'abord un nom d'espèce.",
      confirmer_manque: n => `Il vous reste ${n} question${n > 1 ? 's' : ''} sans réponse. Valider quand même ?`,
      confirmer_nouvelle: 'Effacer toute votre progression et recommencer une nouvelle partie ?',
      erreur_donnees: 'Le jeu n\u2019a pas pu se charger. Vérifiez votre connexion puis rechargez la page.',
      lang_btn: 'EN 🇬🇧', lang_aria: 'Switch to English'
    },
    en: {
      challenge: 'Challenge', tous_jeux: 'All games',
      mes_pancartes: 'My 17 signs', trouvees: 'signs read', repondues: 'answered',
      suivante: 'Next sign',
      a_decouvrir: 'Still to find', repondu: '✓ Answered', a_repondre: 'To answer',
      lire_pancarte: n => `Read sign no. ${n} carefully.`,
      pancarte_n: 'Sign no. ', retour: 'My signs', habitat: 'My habitat', indice: 'The clue',
      resultat: 'My result', valider: 'Submit my answers', revalider: 'Submit my answers again',
      modifier: 'Change my answers', nouvelle: 'New game',
      aide_resultat: 'Submit whenever you like: you will see your score out of 17, and you can still change your answers and submit again.',
      score_perime: 'You have changed some answers since: submit again to update your score.',
      nav_parcours: 'Trail', nav_resultat: 'Result',
      oui: 'Yes', annuler: 'Cancel',
      reponse_vide: 'Type the name of a species first.',
      confirmer_manque: n => `You still have ${n} unanswered question${n > 1 ? 's' : ''}. Submit anyway?`,
      confirmer_nouvelle: 'Erase all your progress and start a new game?',
      erreur_donnees: 'The game could not load. Check your connection and reload the page.',
      lang_btn: 'FR 🇫🇷', lang_aria: 'Passer en français'
    }
  };

  /* ---------- Icônes des rubriques ---------- */
  const ICONES = {
    detail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15zm0 0 7-7m-3 0h3v-3"/></svg>',
    technique: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9 18h6m-5 3h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
    oeil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>',
    cuisine: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 10h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-3zm-2 0h2m16 0h2M9 10V8a3 3 0 0 1 6 0v2"/></svg>'
  };

  /* ---------- Sauvegarde ---------- */
  const CLE_ETAT = 'zarlor_vivant_etat';
  const CLE_LANGUE = 'labyrinthe_lang';          // partagée avec la page d'accueil et le Challenge
  const etatVide = () => ({ v: 1, trouvees: [], reponses: {}, score: null, scorePerime: false, commence: false });
  let etat = etatVide();
  function charger() {
    try {
      const brut = localStorage.getItem(CLE_ETAT);
      if (brut) etat = Object.assign(etatVide(), JSON.parse(brut));
    } catch (e) { etat = etatVide(); }
  }
  function sauver() {
    try { localStorage.setItem(CLE_ETAT, JSON.stringify(etat)); } catch (e) {}
  }

  /* ---------- Langue ---------- */
  function langueDepart() {
    const p = new URLSearchParams(location.search).get('lang');
    if (p === 'fr' || p === 'en') return p;
    try {
      const m = localStorage.getItem(CLE_LANGUE);
      if (m === 'fr' || m === 'en') return m;
    } catch (e) {}
    return (navigator.language || 'fr').toLowerCase().startsWith('en') ? 'en' : 'fr';
  }
  let langue = langueDepart();
  try { localStorage.setItem(CLE_LANGUE, langue); } catch (e) {}
  const t = cle => I18N[langue][cle];

  /* ---------- Données ---------- */
  let DATA = null;
  let especes = [];
  const parNumero = n => especes.find(e => e.numero === n);

  /* ---------- Comparaison tolérante des réponses ---------- */
  function normaliser(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/œ/g, 'oe').replace(/æ/g, 'ae')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/^(le|la|les|l|un|une|the|a|an) /, '')
      .replace(/ /g, '');
  }
  function distance(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prec = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cour = [i];
      for (let j = 1; j <= n; j++) {
        cour[j] = Math.min(prec[j] + 1, cour[j - 1] + 1, prec[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prec = cour;
    }
    return prec[n];
  }
  const tolerance = len => (len <= 4 ? 0 : len <= 7 ? 1 : len <= 12 ? 2 : 3);
  function decoder(b64) {
    try { return decodeURIComponent(escape(atob(b64))); } catch (e) { return ''; }
  }
  function estJuste(espece, saisie) {
    const s = normaliser(saisie);
    if (!s) return false;
    return espece.reponses.some(r => {
      const c = normaliser(r);
      return c && distance(s, c) <= tolerance(c.length);
    });
  }

  /* ---------- Raccourcis ---------- */
  const $ = id => document.getElementById(id);
  const echapper = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let toastMinuteur = null;
  function toast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastMinuteur);
    toastMinuteur = setTimeout(() => { el.hidden = true; }, 2800);
  }

  function confirmer(texte) {
    return new Promise(resolve => {
      $('modale-texte').textContent = texte;
      $('modale-oui').textContent = t('oui');
      $('modale-non').textContent = t('annuler');
      $('modale').hidden = false;
      $('modale-oui').focus();
      const fin = r => { $('modale').hidden = true; $('modale-oui').onclick = $('modale-non').onclick = null; resolve(r); };
      $('modale-oui').onclick = () => fin(true);
      $('modale-non').onclick = () => fin(false);
    });
  }

  /* ---------- Écrans ---------- */
  let ecranCourant = 'accueil';
  let ficheCourante = null;

  function montrer(nom) {
    ecranCourant = nom;
    document.querySelectorAll('.ecran').forEach(s => { s.hidden = s.id !== 'ecran-' + nom; });
    $('nav-bas').hidden = nom === 'accueil';
    document.querySelectorAll('.nav-item').forEach(b => {
      const actif = b.dataset.nav === nom || (nom === 'fiche' && b.dataset.nav === 'parcours');
      b.classList.toggle('actif', actif);
      if (actif) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    if (nom === 'parcours') rendreParcours();
    if (nom === 'resultat') rendreResultat();
    window.scrollTo(0, 0);
  }

  function nbReponses() {
    return especes.filter(e => (etat.reponses[e.numero] || '').trim()).length;
  }

  function rendreParcours() {
    const nbT = etat.trouvees.length, nbR = nbReponses();
    $('nb-trouvees').textContent = nbT;
    $('nb-reponses').textContent = nbR;
    $('barre-remplie').style.width = (nbR / 17 * 100) + '%';
    const liste = $('liste-pancartes');
    liste.innerHTML = especes.map(e => {
      const rep = (etat.reponses[e.numero] || '').trim();
      return `<li><button type="button" class="ligne-pancarte${rep ? ' repondue' : ''}" data-numero="${e.numero}">
        <span class="num">${e.numero}</span>
        <span class="nom">${echapper(e[langue].indice_kreol)}</span>
        <span class="etat">${rep ? echapper(t('repondu')) : echapper(t('a_repondre'))}</span>
      </button></li>`;
    }).join('');
  }

  function rendreFiche(n) {
    const e = parNumero(n);
    if (!e) return;
    ficheCourante = n;
    if (!etat.trouvees.includes(n)) {
      etat.trouvees.push(n);
      etat.trouvees.sort((a, b) => a - b);
      etat.commence = true;
      sauver();
    }
    const d = e[langue];
    $('fiche-numero').textContent = t('pancarte_n') + e.numero;
    // La fiche (texte de la pancarte) n'est affichée qu'en anglais :
    // en français, le joueur lit directement la pancarte dans le labyrinthe.
    const ficheVisible = langue === 'en';
    document.querySelector('.fiche').hidden = !ficheVisible;
    $('fiche-aide').hidden = ficheVisible;
    $('fiche-aide').textContent = t('lire_pancarte')(e.numero);
    $('fiche-zot-sous-titre').hidden = langue !== 'en';
    $('fiche-zot').textContent = d.zot_te_kone;
    $('fiche-habitat').textContent = d.habitat;
    $('fiche-sci').textContent = e.nom_scientifique;
    $('fiche-nom').textContent = e.nom;
    $('fiche-rubriques').innerHTML = d.rubriques.map(r => {
      const pastille = (r.type === 'oeil' && e.pastille) ? ' ' + e.pastille : '';
      return `<section class="rubrique ${r.type}">
        <div class="icone">${ICONES[r.type] || ''}</div>
        <div><h3>${echapper(r.titre)}${pastille}</h3><p>${echapper(r.texte)}</p></div>
      </section>`;
    }).join('');
    $('fiche-kreol').textContent = '« ' + d.indice_kreol + ' »';
    $('fiche-indice').textContent = '(' + d.indice + ')';
    $('champ-reponse').value = etat.reponses[n] || '';
    $('champ-reponse').placeholder = DATA.textes[langue].placeholder;
    $('message-enregistre').hidden = true;
    montrer('fiche');
  }

  function rendreResultat() {
    $('res-trouvees').textContent = etat.trouvees.length;
    $('res-reponses').textContent = nbReponses();
    const s = etat.score;
    $('bloc-score').hidden = s === null;
    $('aide-resultat').hidden = s !== null;
    if (s !== null) {
      const paliers = DATA.textes[langue].felicitations.slice().sort((a, b) => b.min - a.min);
      const palier = paliers.find(p => s >= p.min) || paliers[paliers.length - 1];
      $('score-valeur').textContent = s;
      $('score-titre').textContent = palier.titre;
      $('score-texte').textContent = palier.texte;
      $('score-perime').hidden = !etat.scorePerime;
    }
    $('btn-valider').textContent = s === null ? t('valider') : t('revalider');
  }

  /* ---------- Textes selon la langue ---------- */
  function appliquerLangue() {
    document.documentElement.lang = langue;
    document.querySelectorAll('[data-i]').forEach(el => {
      const v = I18N[langue][el.dataset.i];
      if (typeof v === 'string') el.textContent = v;
    });
    if (DATA) {
      const tx = DATA.textes[langue];
      document.querySelectorAll('[data-t]').forEach(el => {
        const v = tx[el.dataset.t];
        if (typeof v === 'string') el.textContent = v;
      });
    }
    $('btn-langue').textContent = t('lang_btn');
    $('btn-langue').setAttribute('aria-label', t('lang_aria'));
    $('lien-tous').setAttribute('aria-label', t('tous_jeux'));
    $('lien-tous').href = '/home/?lang=' + langue;
    $('lien-challenge').href = '/challenge-des-experts/?lang=' + langue;
    if (!DATA) return;
    if (ecranCourant === 'fiche' && ficheCourante) {
      const saisie = $('champ-reponse').value;
      rendreFiche(ficheCourante);
      $('champ-reponse').value = saisie;
    } else {
      montrer(ecranCourant);
    }
  }

  /* ---------- Validation ---------- */
  async function valider() {
    const manque = 17 - nbReponses();
    if (manque > 0 && !(await confirmer(t('confirmer_manque')(manque)))) return;
    etat.score = especes.filter(e => estJuste(e, etat.reponses[e.numero])).length;
    etat.scorePerime = false;
    sauver();
    rendreResultat();
    $('bloc-score').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---------- Événements ---------- */
  function brancher() {
    $('btn-langue').addEventListener('click', () => {
      langue = langue === 'fr' ? 'en' : 'fr';
      try { localStorage.setItem(CLE_LANGUE, langue); } catch (e) {}
      appliquerLangue();
    });
    $('btn-logo').addEventListener('click', () => montrer(etat.commence ? 'parcours' : 'accueil'));
    $('btn-commencer').addEventListener('click', () => { etat.commence = true; sauver(); montrer('parcours'); });
    $('btn-suivante').addEventListener('click', () => rendreFiche(ficheCourante >= 17 ? 1 : ficheCourante + 1));
    $('btn-retour-parcours').addEventListener('click', () => montrer('parcours'));
    $('liste-pancartes').addEventListener('click', ev => {
      const b = ev.target.closest('button[data-numero]');
      if (b) rendreFiche(Number(b.dataset.numero));
    });
    $('btn-enregistrer').addEventListener('click', enregistrer);
    $('champ-reponse').addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); enregistrer(); } });

    document.querySelectorAll('.nav-item').forEach(b => b.addEventListener('click', () => montrer(b.dataset.nav)));
    $('btn-valider').addEventListener('click', valider);
    $('btn-modifier').addEventListener('click', () => montrer('parcours'));
    $('btn-nouvelle').addEventListener('click', async () => {
      if (!(await confirmer(t('confirmer_nouvelle')))) return;
      etat = etatVide();
      sauver();
      montrer('accueil');
    });
  }

  function enregistrer() {
    const n = ficheCourante;
    const v = $('champ-reponse').value.trim();
    if (!v) { toast(t('reponse_vide')); return; }
    if ((etat.reponses[n] || '') !== v) {
      etat.reponses[n] = v;
      if (etat.score !== null) etat.scorePerime = true;
      sauver();
    }
    const msg = $('message-enregistre');
    msg.textContent = DATA.textes[langue].enregistre;
    msg.hidden = false;
    $('champ-reponse').blur();
  }

  /* ---------- Démarrage ---------- */
  async function demarrer() {
    charger();
    brancher();
    appliquerLangue();
    try {
      const rep = await fetch('zarlor.json');
      DATA = await rep.json();
    } catch (e) {
      document.getElementById('contenu').innerHTML = '<div class="carte"><p>' + echapper(t('erreur_donnees')) + '</p></div>';
      return;
    }
    especes = DATA.especes.map(e => Object.assign({}, e, { reponses: (e.reponses_codees || []).map(decoder) }));
    // On ne garde que les pancartes qui existent encore dans les données
    etat.trouvees = etat.trouvees.filter(n => parNumero(n));

    // Adresse propre (sans ?lang=) une fois la langue appliquée
    if (location.search) history.replaceState(null, '', location.pathname);

    appliquerLangue();
    montrer(etat.commence ? 'parcours' : 'accueil');
  }

  /* ---------- Mode hors ligne ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
  }

  demarrer();
})();
