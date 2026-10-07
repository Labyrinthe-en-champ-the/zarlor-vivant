# Le Zarlor Vivant – mode d'emploi

Adresse du jeu : **https://labyrinthe-en-champ-the.github.io/zarlor-vivant/**

## Contenu du dépôt

Tous les fichiers sont **à la racine**, sans dossier.

| Fichier | À quoi il sert | Le modifier ? |
|---|---|---|
| `zarlor.json` | **Tous les textes** : fiches FR/EN, indices, messages, réponses acceptées | ✅ Oui, c'est le fichier à modifier |
| `index.html` | Les écrans du jeu | Non |
| `style.css` | Les couleurs et la mise en page | Non |
| `app.js` | Le fonctionnement du jeu | Non |
| `sw.js` | Le mode hors ligne | Non |
| `chewy.woff2`, `plus-jakarta-sans.woff2` | Les polices, stockées en local pour fonctionner sans réseau | Non |
| `logo-zarlor.png` | Le logo | Oui, en gardant exactement ce nom |
| `outil-reponses.html` | Outil pour ajouter une réponse acceptée | Non |

## Mise en ligne (une seule fois, environ 10 minutes)

1. Sur **github.com**, cliquez sur **+** en haut à droite, puis **New repository**.
2. **Repository name** : tapez exactement `zarlor-vivant`.
3. Laissez **Public**, **Add README** sur Off, puis cliquez sur **Create repository**.
4. Cliquez sur le lien **uploading an existing file**.
5. Glissez **tous les fichiers** du dossier décompressé (sélectionnez-les tous avec Cmd + A), **pas le dossier lui-même**.
6. Cliquez sur **Commit changes**.
7. Allez dans **Settings**, puis **Pages**. Sous **Branch**, choisissez `main` et `/ (root)`, puis **Save**.
8. Attendez 1 à 2 minutes, puis ouvrez **https://labyrinthe-en-champ-the.github.io/zarlor-vivant/**

## Mettre à jour la page d'accueil (dépôt `home`)

Le fichier `sw.js` de la page d'accueil doit connaître les fichiers du Zarlor pour les télécharger à l'entrée.
1. Ouvrez le dépôt `home`, puis **Add file → Upload files**.
2. Déposez le nouveau `sw.js` fourni à part (dossier `home-mise-a-jour`).
3. Cliquez sur **Commit changes**. GitHub remplace l'ancien fichier.

## Vérifications après la mise en ligne

- [ ] La page d'accueil des jeux affiche « Le Zarlor Vivant : prêt, même sans réseau ✅ ».
- [ ] Touchez un numéro : en français, l'indice et le champ de réponse s'affichent ; en anglais, la fiche traduite s'affiche en plus.
- [ ] Le bouton « Pancarte suivante » passe bien au numéro suivant.
- [ ] **Test hors ligne** : ouvrez la page d'accueil avec du réseau, attendez les ✅, passez en mode avion, puis ouvrez le Zarlor et une pancarte.
- [ ] Répondez à 2 ou 3 questions, puis validez : la note s'affiche.

## Avant l'ouverture : « Bientôt disponible »

Tout en haut de `zarlor.json`, la ligne `"disponible": false` affiche « Bientôt disponible » partout : sur la page d'accueil des jeux, via le bouton du Challenge et sur l'adresse directe.

- **Pour tester le jeu avant l'ouverture**, ouvrez **https://labyrinthe-en-champ-the.github.io/zarlor-vivant/?apercu=1**. L'aperçu reste actif tant que l'onglet est ouvert.
- **Le jour du lancement** : ouvrez `zarlor.json`, cliquez sur le crayon ✏️, remplacez `false` par `true` (sans guillemets), puis **Commit changes**. Le jeu s'ouvre pour tout le monde en 1 à 2 minutes.

## Modifier un texte

1. Dans le dépôt, ouvrez `zarlor.json`, puis cliquez sur le crayon ✏️.
2. Utilisez **Cmd + F** pour trouver le texte à changer.
3. Modifiez **uniquement le texte entre guillemets**.
4. ⚠️ N'utilisez jamais de guillemets droits `"` dans un texte. Utilisez « » en français et “ ” en anglais. Les apostrophes `'` ne posent aucun problème.
5. Cliquez sur **Commit changes**.

Si le jeu affiche « Le jeu n'a pas pu se charger » après une modification, une virgule ou un guillemet a sans doute été supprimé. Annulez votre dernière modification dans l'onglet **History** du fichier, ou envoyez-moi le fichier.

## Ajouter une réponse acceptée

Les réponses sont codées dans `zarlor.json`, pour qu'un joueur curieux ne puisse pas les lire.
1. Ouvrez **https://labyrinthe-en-champ-the.github.io/zarlor-vivant/outil-reponses.html**
2. Tapez la nouvelle réponse (ex. « Pois de sabre »), puis cliquez sur **Coder**.
3. Dans `zarlor.json`, trouvez l'espèce, puis sa ligne `"reponses_codees"`. Ajoutez le code **entre guillemets**, séparé du précédent par une virgule.

Le jeu tolère automatiquement les majuscules, les accents, les tirets, les articles (« le », « la », « the »…) et quelques fautes de frappe.

## Pancartes

Le Zarlor se joue **sans QR code** : chaque pancarte porte simplement son **numéro**, de 1 à 17, dans l'ordre de la liste du jeu. Le joueur touche ce numéro dans le jeu pour voir l'indice et répondre.

## À la fin du jeu

Pour retirer le jeu, deux options :
- supprimez le dépôt `zarlor-vivant` (**Settings → Delete this repository**, tout en bas) ;
- ou désactivez simplement la publication (**Settings → Pages → Unpublish site**).

Pensez aussi à retirer la carte du Zarlor de la page d'accueil et le bouton du Challenge.

## Contenus en attente de vérification

- **Statuts du Petit tamarin des Hauts (n°5) et du Bois de fer (n°16)** : affichés avec le texte des pancartes, sans pastille de couleur, en attendant votre confirmation (CR ou EN).
- **Traductions anglaises** : à relire dans `zarlor.json` (blocs `"en"`). En français, le texte des fiches n'est pas affiché : le joueur lit directement la pancarte.
- **Pétrel noir (n°8)** : l'information « nid non découvert avec certitude » est à reconfirmer auprès de la SEOR.
- **Pétrel de Barau (n°9)** : le jeu affiche *Pterodroma baraui* (nom du brief). La pancarte indique *barau*. Les deux sont acceptés comme réponse.
