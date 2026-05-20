# Othello Island - Journal de validation

## 2026-05-18

Etat :

- Repo local : documents de cadrage initial crees, depot git initialise sur
  `main`, remote `origin` configure vers GitHub. Les documents initiaux ont
  ete commits et pousses sur `origin/main`.
- Prod alignee : non applicable, aucun build ni deploiement.
- Validation reelle : aucune validation de jeu possible, aucun code jouable.

Commandes/verifications effectuees :

- Recherche des fichiers projet : aucun document existant trouve.
- `git status` / `git log` : le dossier local n'etait pas encore un depot git.
- Verification du depot distant `https://github.com/kinowill/OTHELLO-ISLAND.git`
  par `git ls-remote` : depot accessible, aucun ref renvoye, interprete comme
  depot vide.
- `git init -b main` : depot local initialise.
- `git remote add origin https://github.com/kinowill/OTHELLO-ISLAND.git` :
  configuration effectuee apres autorisation hors sandbox, car Git ne pouvait
  pas verrouiller `.git/config` dans le sandbox.
- Commit initial `docs: initialize project truth` pousse sur `origin/main`.

## 2026-05-18 - Direction artistique

Etat :

- Repo local : documentation modifiee pour acter la direction artistique.
- Prod alignee : non applicable, aucun build ni deploiement.
- Validation reelle : decision de cadrage uniquement, aucun rendu graphique
  encore produit ni teste.

Decision :

- Direction retenue : ile mystique premium avec symbolique occulte/esoterique
  fictionnelle, inspiree de codes pop-culture de societes secretes, Illuminati
  et theories de complot d'elite.
- Limite explicite : ces references servent l'atmosphere et ne doivent pas etre
  presentees comme des accusations ou faits reels.

## 2026-05-18 - Ton visuel

Etat :

- Repo local : documentation modifiee pour preciser le ton de la symbolique.
- Prod alignee : non applicable, aucun build ni deploiement.
- Validation reelle : decision de cadrage uniquement, aucun rendu graphique
  encore produit ni teste.

Decision :

- La symbolique occulte/esoterique doit rester subtile, elegante et cryptique.
- A eviter : rendu trop edgy, goofy, evident, meme internet, horreur adolescente
  ou conspiration trop litterale.

## 2026-05-18 - Stack et strategie assets

Etat :

- Repo local : documentation modifiee pour acter la stack et la strategie
  d'assets.
- Prod alignee : non applicable, aucun build ni deploiement.
- Validation reelle : decision de cadrage uniquement, aucun scaffold ni build
  encore valide.

Decision :

- Stack retenue : Tauri + React + TypeScript, avec Vite pour le developpement
  frontend.
- Le prototype initial doit fonctionner sans assets externes. Les assets
  visuels generes via image IA seront demandes ensuite avec des briefs precis.

## 2026-05-18 - Prototype web initial

Etat :

- Repo local : scaffold React/Vite/Tauri cree, prototype web Othello jouable
  implemente.
- Prod alignee : non applicable, aucun deploiement.
- Validation reelle : validations automatisees frontend effectuees ; validation
  visuelle navigateur non effectuee dans cette passe apres incident memoire.

Ce qui est implemente :

- Plateau 8x8.
- Coups legaux detectes.
- Retournement des pions.
- Passage de tour automatique si l'adversaire n'a aucun coup.
- Detection de fin de partie et vainqueur.
- Mode humain contre humain local.
- Premiere direction visuelle codee en CSS : ile mystique premium, plateau
  rituel, symbolique subtile.

Commandes/verifications effectuees :

- `npm install` : dependances installees, 0 vulnerabilite signalee.
- `npm run lint` : OK.
- `npm test` : OK hors sandbox, 4 tests unitaires passes.
- `npm run build` : OK, build frontend genere dans `dist/`.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` : KO. Le build frontend passe, mais la compilation
  Rust/Tauri echoue ensuite avec une erreur Windows de fichier de pagination
  insuffisant (`os error 1455`). Une tentative avec `CARGO_BUILD_JOBS=1` a aussi
  echoue par manque de memoire au niveau Node/TypeScript.

Decision operationnelle :

- Ne pas relancer de build Tauri complet automatiquement dans cette session.
- Continuer les iterations avec validations legeres : lint, tests, build
  frontend.
- Reprendre le packaging desktop plus tard, explicitement, quand la machine a
  assez de ressources disponibles ou apres ajustement du fichier de pagination.

## 2026-05-18 - Lancement local leger

Etat :

- Repo local : code inchange, serveur de developpement Vite lance localement.
- Prod alignee : non applicable, aucun deploiement.
- Validation reelle : verification HTTP locale effectuee ; inspection visuelle
  ouverte dans le navigateur Windows pour revue humaine.

Commandes/verifications effectuees :

- `npm run dev -- --host 127.0.0.1` : bloque dans le sandbox par `spawn EPERM`
  au demarrage d'esbuild.
- Serveur relance hors sandbox : OK.
- `http://127.0.0.1:1420` : HTTP 200.
- Port 1420 en ecoute localement, PID serveur observe : `36316`.
- Packaging Tauri/Rust non relance.

## 2026-05-18 - Correction ton UI et identite visuelle

Etat :

- Repo local : textes UI et CSS modifies apres retour utilisateur.
- Prod alignee : non applicable, aucun deploiement.
- Validation reelle : validations automatisees legeres effectuees ; revue
  visuelle humaine a poursuivre dans le navigateur local ouvert.

Retour utilisateur traite :

- "Nouveau rituel" juge trop edgy.
- Phrase d'introduction jugee forcee et peu claire.
- Premiere version visuelle jugee encore trop proche d'un Othello classique.

Changements effectues :

- Remplacement des textes UI forces par des libelles plus directs : "Nouvelle
  partie", "Partie terminee", "a jouer".
- Ajout d'elements visuels codes pour distinguer l'identite : carte d'ile en
  arriere-plan, lignes de compas autour du plateau, pions legerement graves.
- Principe confirme : l'ambiance doit venir du visuel, pas d'un vocabulaire
  occultisant plaque sur les actions de base.

Commandes/verifications effectuees :

- `npm run build` : OK.
- `npm run lint` : OK, relance seul apres un echec memoire cause par execution
  parallele avec le build.
- `npm test` : OK hors sandbox, 4 tests unitaires passes.
- Packaging Tauri/Rust non relance.

## 2026-05-18 - Packaging Tauri local repare

Etat :

- Repo local : icone applicative provisoire ajoutee, icones Tauri generees,
  configuration du bundle Tauri corrigee, documentation projet mise a jour.
- Distribution locale : executable Windows, MSI et installateur NSIS generes
  avec succes dans `src-tauri/target/release/`.
- Release publique : non publiee. Aucun artefact n'a encore ete pousse comme
  release GitHub ou livre par un canal externe.
- Validation reelle : packaging local valide par commande automatisee. Test
  manuel apres installation non encore effectue.

Changements effectues :

- Ajout de `src-tauri/app-icon.svg` comme source d'icone provisoire.
- Generation des icones Tauri dans `src-tauri/icons/`, dont `icon.ico`.
- Ajout explicite des icones dans `src-tauri/tauri.conf.json`.
- Ajout de `src-tauri/gen/` au `.gitignore`, car ce dossier est genere par
  Tauri pendant le build.

Commandes/verifications effectuees :

- `npm run tauri build` en sandbox : KO, bloque par `spawn EPERM` au lancement
  d'esbuild/Vite.
- `npm run tauri build` hors sandbox avant correction icones : KO, compilation
  Rust terminee mais bundle bloque par icone `.ico` introuvable.
- `npm run tauri icon -- src-tauri/app-icon.svg` : OK, icones generees.
- `npm run tauri build` hors sandbox apres correction : OK.
- Artefacts generes :
  - `src-tauri/target/release/othello-island.exe`
  - `src-tauri/target/release/bundle/msi/Othello Island_0.1.0_x64_en-US.msi`
  - `src-tauri/target/release/bundle/nsis/Othello Island_0.1.0_x64-setup.exe`
- `npm run lint` : OK.
- `npm test` en sandbox : KO, bloque par `spawn EPERM` au lancement
  d'esbuild/Vite.
- `npm test` hors sandbox : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.

## 2026-05-18 - Test manuel installateur Windows

Etat :

- Repo local : inchange par le test manuel.
- Distribution locale : installateur Windows lance et application ouverte.
- Release publique : non publiee.
- Validation reelle : test humain effectue par l'utilisateur.

Resultat du test :

- L'application demarre.
- Le plateau apparait correctement.
- Quelques coups peuvent etre joues.
- Le bouton "Nouvelle partie" remet bien le jeu a zero.

Points constates apres test :

- La taille de fenetre initiale n'est pas adaptee : il faut scroller.
- Le prototype ne contient pas encore de musique, textures assets, ecran
  d'accueil ni options. Ces elements n'etaient pas dans le premier prototype
  jouable et doivent devenir un chantier produit separe.

## 2026-05-18 - Correction fenetre et option coups possibles

Etat :

- Repo local : CSS de layout desktop modifie, option UI ajoutee, documentation
  projet mise a jour.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  avec succes.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Retest manuel de
  l'installateur corrige non encore effectue.

Retour utilisateur traite :

- La fenetre initiale obligeait a scroller.
- Les indications de coups possibles ne doivent pas etre actives par defaut.
- Les indications doivent etre activables dans les options.

Changements effectues :

- Adaptation du layout a la hauteur de fenetre desktop Tauri par defaut.
- Masquage des points de coups possibles par defaut.
- Ajout d'une premiere option "Afficher les coups possibles".
- Les cases jouables restent jouables meme quand l'aide visuelle est masquee.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm run build` hors sandbox : OK.
- `npm test` hors sandbox : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` hors sandbox : OK, artefacts Windows regeneres.

Pistes utilisateur notees pour la suite :

- Ajouter une couche d'histoire ou de secret a debloquer.
- Prevoir des textures generees par l'utilisateur avec GPT Image.
- Explorer une ambiance evolutive pendant la partie : lumiere qui change,
  soleil qui se couche, details de decor qui apparaissent, ou autre progression
  visuelle a cadrer.

## 2026-05-18 - Ecran d'accueil retro et audio procedural

Etat :

- Repo local : ecran d'accueil anime ajoute, style global oriente retro 32-bit,
  ambiance audio procedurale ajoutee, documentation projet mise a jour.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  avec succes.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Retest manuel de
  l'installateur avec nouvel accueil non encore effectue.

Retour utilisateur traite :

- Demande d'un gros ecran d'accueil anime, propre, type 8/32-bit.
- Direction choisie : melange jaquette PC CD-ROM et table d'enquete, avec une
  forte dominante jaquette.
- Direction globale recadree vers retro 32-bit / pixel art propre, pas textures
  ultra lisses.
- Souhait d'ambiance ocean et musique ambient mysterieuse.

Changements effectues :

- Ajout d'un ecran d'accueil avant le plateau.
- Ajout d'une jaquette animee : spine PC CD-ROM, badges d'acces, ile nocturne,
  mer pixelisee, table d'enquete et mini plateau.
- Ajout d'une entree "Entrer dans l'ile" qui active l'ambiance audio, et d'une
  entree silencieuse.
- Ajout d'une option "Ambiance audio" dans le jeu.
- Audio genere en Web Audio : bruit d'ocean et nappe grave mysterieuse. Aucun
  fichier musical externe n'est inclus.
- Les images dans `ITERATIONS VISUELLES/` ont servi de references locales, mais
  ne sont pas integrees directement dans l'application.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm run build` hors sandbox : OK.
- `npm test` hors sandbox : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` hors sandbox : OK, artefacts Windows regeneres.

Decision operationnelle :

- Tester maintenant cette version sans textures image integrees.
- Integrer les textures seulement apres validation de l'accueil, du layout, des
  options et de l'audio.

## 2026-05-18 - Retour test accueil/audio/options

Etat :

- Repo local : retour utilisateur a traiter.
- Distribution locale : version testee par l'utilisateur.
- Release publique : non publiee.
- Validation reelle : test humain effectue par l'utilisateur, resultat negatif
  sur plusieurs elements d'experience.

Retour utilisateur :

- Les textures / faux rendus visuels actuels sont juges trop grossiers.
- Impossible de revenir au menu depuis une partie.
- L'ambiance audio procedurale est jugee mauvaise.
- Les options ne doivent pas etre posees directement dans le panneau de jeu :
  il faut un vrai bouton de parametres qui ouvre un ecran/panneau dedie.
- Le bouton "Silence" sur l'accueil n'a pas de sens s'il lance la meme chose
  que l'entree principale.
- L'utilisateur peut fournir des assets sonores et generer des textures 32-bit
  pour remplacer les placeholders.

Decision operationnelle :

- Retirer l'audio procedural du prototype.
- Remplacer l'accueil par une structure plus claire : jouer, parametres.
- Ajouter un retour menu depuis la partie.
- Centraliser les reglages dans un panneau de parametres.
- Garder les textures et sons comme assets futurs a fournir/generer, pas comme
  faux assets improvises en CSS.

## 2026-05-18 - Correction menu, parametres et audio

Etat :

- Repo local : accueil refondu, panneau de parametres ajoute, retour menu
  ajoute, audio procedural retire, documentation projet mise a jour.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  avec succes.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Retest manuel de
  cette version corrigee non encore effectue.

Changements effectues :

- Remplacement de "Entrer dans l'ile" / "Silence" par un vrai menu :
  "Nouvelle partie", "Reprendre" si une partie existe, "Parametres".
- Ajout d'un bouton "Menu" depuis la partie.
- Ajout d'un bouton "Parametres" depuis la partie.
- Deplacement de l'option "Afficher les coups possibles" dans un panneau de
  parametres dedie.
- Retrait complet de l'audio procedural Web Audio.
- Ajout de placeholders explicites dans les parametres pour audio et textures :
  en attente d'assets locaux.
- Reduction de certains faux effets de texture CSS sur les papiers de l'accueil
  pour limiter le rendu crade en attendant de vrais assets.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm run build` hors sandbox : OK.
- `npm test` hors sandbox : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` hors sandbox : OK, artefacts Windows regeneres.

## 2026-05-18 - Test installateur corrige

Etat :

- Repo local : inchange par le test manuel.
- Distribution locale : installateur Windows lance et fonctionnel.
- Release publique : non publiee.
- Validation reelle : test humain effectue par l'utilisateur.

Resultat :

- L'installateur corrige fonctionne.

Retour utilisateur suivant :

- Retravailler fortement l'ecran d'accueil.
- Aller vers une scene plus ambitieuse : ile mysterieuse au loin, ocean de
  nuit, lumiere suspecte depuis une fenetre, vent, nuages sombres.
- Travailler en wireframe/brouillon anime si les textures definitives ne sont
  pas encore disponibles.

## 2026-05-18 - Refonte accueil scene nocturne

Etat :

- Repo local : ecran d'accueil retravaille en scene nocturne animee, sans
  integration de textures image.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  avec succes.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Retest manuel de
  cette version non encore effectue.

Changements effectues :

- Remplacement de la composition d'accueil par une scene : ocean de nuit,
  ile mysterieuse au loin, manoir, fenetre lumineuse, faisceau suspect,
  nuages sombres et lignes de vent.
- Conservation du menu : "Nouvelle partie", "Reprendre" si applicable,
  "Parametres".
- Ajout d'un panneau de signal fictionnel pour renforcer l'ambiance sans
  ajouter de lore lourd.
- Les textures restent en attente d'assets generes/fournis. La scene actuelle
  sert de wireframe anime pour guider les futurs prompts et integrations.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm run build` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` : OK, artefacts Windows regeneres.

## 2026-05-19 - Fenetre fixe 1600x900

Etat :

- Repo local : configuration Tauri, CSS d'accueil et documentation projet
  modifies pour privilegier une surface fixe `1600x900`.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  avec succes.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Revue visuelle
  finale dans l'application installee non encore effectuee.

Decision :

- Pour le prototype PC actuel, l'accueil asset-based est compose sur une seule
  surface `1600x900`.
- La fenetre Tauri est non redimensionnable (`resizable: false`) avec largeur,
  hauteur, minimum et maximum fixes a `1600x900`.
- Cette solution stabilise les PNG, le logo, le panneau de menu et le footer.
  Elle pourra etre remplacee plus tard par un mode scale/letterbox si le
  support de petits ecrans devient prioritaire.

Changements effectues :

- Remplacement des deux fonds d'accueil carres par les nouvelles versions larges
  `2000x1000` fournies par l'utilisateur.
- Retour du fond en `background-size: cover` avec scene large adaptee au ratio
  de la fenetre.
- Positionnement fixe du logo, du menu et du footer pour eviter le chevauchement
  avec le texte bas de l'image.
- Verrouillage de la fenetre Tauri en `1600x900` non redimensionnable.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm run build` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` : OK, artefacts Windows regeneres.

## 2026-05-19 - Integration assets PNG accueil

Etat :

- Repo local : assets PNG d'accueil copies dans `src/assets/title/`, ecran
  d'accueil remplace par une composition basee sur ces assets, documentation
  projet mise a jour.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  avec succes.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Retest manuel de
  cette version non encore effectue.

Assets integres :

- `ui_title_background_frame_01.png`
- `ui_title_background_frame_02.png`
- `ui_title_logo_idle.png`
- `ui_title_logo_shimmer_01.png`
- `ui_title_menu_panel_idle.png`
- `ui_title_menu_panel_selected_glow.png`
- Boutons `enter`, `resume`, `settings`, `quit` avec etats idle/selected.
- `ui_title_footer_idle.png`
- `ui_title_footer_shimmer_01.png`

Changements effectues :

- Remplacement du wireframe CSS par le fond PNG d'accueil.
- Alternance legere des deux frames de fond.
- Utilisation du logo PNG avec shimmer.
- Utilisation du panneau menu PNG et des boutons PNG comme etats visuels.
- Conservation de vrais boutons HTML pour le clic et l'accessibilite.
- Ajout d'un bouton quitter qui tente de fermer la fenetre Tauri.
- `ITERATIONS VISUELLES/` est ignore par Git ; seuls les assets retenus dans
  `src/assets/title/` sont destines a etre versionnes.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm run build` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` : OK, artefacts Windows regeneres.

## 2026-05-19 - Correction cadrage fond accueil

Etat :

- Repo local : CSS de l'accueil modifie pour eviter le zoom excessif du fond.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Retest manuel de
  cette correction non encore effectue.

Cause :

- Le fond `ui_title_background_frame_01.png` est carre (`886x887`). Avec
  `background-size: cover`, il etait agrandi puis coupe dans une fenetre large.

Correction :

- Passage du fond en `background-size: auto 100%`.
- Ancrage a droite pour conserver l'ile, la mer et le ponton.
- Ajout d'un degradé sombre a gauche pour recevoir le logo et le menu sans
  forcer le zoom du decor.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm run build` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` : OK, artefacts Windows regeneres.

## 2026-05-19 - Reintegration assets nettoyes accueil

Etat :

- Repo local : assets PNG d'accueil versionnes dans `src/assets/title/`
  remplaces par les nouveaux exports nettoyes fournis dans
  `ITERATIONS VISUELLES/ASSETS/`.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  avec succes.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Retest visuel dans
  l'application installee non encore effectue.

Changements effectues :

- Reprise des nouveaux assets logo, panneau, boutons et footer dont les mauvais
  fonds transparents / decoupages ont ete corriges.
- Conservation explicite des fonds larges `2000x1000` pour eviter de remettre
  les anciens fonds carres `886x887` dans l'ecran d'accueil.
- Aucun changement de code CSS/TypeScript necessaire : les noms et dimensions
  utiles restent compatibles avec l'integration existante.

Commandes/verifications effectuees :

- Verification des dimensions PNG dans `src/assets/title/` : fonds `2000x1000`,
  logo `915x484`, panneau `735x734`, boutons et footer coherents.
- `npm run lint` : OK.
- `npm run build` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` : OK, artefacts Windows regeneres.

## 2026-05-19 - Integration audio assets menu

Etat :

- Repo local : cinq assets audio copies dans `src/assets/audio/` et controleur
  Web Audio ajoute dans `src/audio/titleAudio.ts`.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  avec succes.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Validation a
  l'oreille dans l'application installee non encore effectuee.

Assets integres :

- `amb_ocean_night_wind_loop_01.wav` : boucle ocean nocturne, 30 s.
- `mus_menu_16bit_secret_island_loop.mp3` : boucle musique menu, 60 s.
- `amb_wind_loop_01.mp3` : vent, 22 s, utilise en declenchement aleatoire.
- `ui_hover_01.wav` : survol/focus UI, 1 s.
- `ui_select_01.wav` : selection/clic UI, 2 s.

Changements effectues :

- Ajout d'un mix Web Audio avec gains separes par asset.
- Ocean et musique menu demarrent en boucles continues.
- Le vent ne boucle pas en synchro fixe avec l'ocean : chaque rafale part apres
  un delai aleatoire, avec offset, duree et volume legerement variables.
- Ajout d'une option `Ambiance sonore` dans les parametres.
- Ajout des sons hover/select sur les boutons principaux, les reglages et les
  cases jouables.

Mesures de niveau source :

- Ocean : mean -34.4 dB, max -20.2 dB.
- Vent : mean -29.5 dB, max -12.1 dB.
- Musique : mean -14.9 dB, max -0.4 dB.
- Hover : mean -63.4 dB, max -39.5 dB.
- Select : mean -33.9 dB, max -12.1 dB.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm run build` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` : OK, artefacts Windows regeneres.

## 2026-05-19 - Reglages audio, affichage et preparation push public

Etat :

- Repo local : parametres enrichis, controle audio ajuste, metadonnees d'assets
  nettoyees avant publication du depot public.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  avec succes apres nettoyage des assets.
- Release publique : non publiee. Aucun artefact n'a encore ete publie comme
  GitHub Release.
- Validation reelle : validations automatisees effectuees. Retest manuel dans
  l'application installee encore necessaire pour juger le mixage a l'oreille et
  verifier les modes d'affichage sur l'ecran cible.

Changements effectues :

- Ajout des modes d'affichage dans les parametres :
  - plein ecran fenetre sans bordure, applique par defaut au lancement ;
  - vrai plein ecran ;
  - fenetre fixe `1600x900`.
- Ajout de trois sliders de volume : musique, ambiance et UI.
- Demarrage audio adouci : ocean en fade-in, musique retardee puis fade-in.
- Conservation du vent aleatoire, sans synchro fixe avec la boucle ocean.
- Suppression du son de hover sur les boutons grises.
- Nettoyage des metadonnees :
  - commentaire/ID de generation retire du MP3 de musique ;
  - chunks XMP Photoshop retires des PNG d'accueil ;
  - `ITERATIONS VISUELLES/` reste ignore par Git.

Commandes/verifications effectuees :

- `ffprobe` sur les assets audio sources : plus de commentaire de generation
  dans la musique, seulement le tag technique d'encodeur.
- Scan texte/binaire anti-leak sur les assets et le code : aucun token, cle API,
  chemin utilisateur ou metadonnee XMP residuelle detecte dans les fichiers
  destines au commit.
- `npm run lint` : OK.
- `npm run build` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` : OK, artefacts Windows regeneres.

Artefacts generes :

- `src-tauri/target/release/othello-island.exe`
- `src-tauri/target/release/bundle/msi/Othello Island_0.1.0_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Othello Island_0.1.0_x64-setup.exe`

## 2026-05-19 - Push GitHub assets et controles

Etat :

- Repo local : commit `12b5c2f` cree sur `main`.
- GitHub : commit `12b5c2f` pousse sur `origin/main`.
- Distribution locale : installateur Windows regenere avant le push.
- Release publique : non publiee. Le code source et les assets sont publics sur
  GitHub, mais aucun installateur n'a ete publie comme GitHub Release.
- Validation reelle : validations automatisees effectuees avant commit. Retest
  manuel de l'installateur, du mixage audio et des modes d'affichage encore a
  faire.

Controles avant push :

- `git diff --check` : OK.
- Scan anti-leak sur code et assets publics : aucun token, cle API, chemin
  utilisateur ou metadonnee XMP residuelle detecte.
- `ITERATIONS VISUELLES/`, `dist/` et `src-tauri/target/` restent ignores par
  Git.

## 2026-05-19 - Kit parametres 32-bit, icone finale et mix musique

Etat :

- Repo local : panneau de parametres rhabille avec des assets `ASSETS/02`,
  curseur custom ajoute, mix audio ajuste et icone applicative remplacee.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  avec succes.
- Release publique : non publiee. Aucun artefact n'a encore ete publie comme
  GitHub Release.
- Validation reelle : validations automatisees effectuees. Retest manuel dans
  l'application installee encore necessaire pour juger le rendu exact du panneau
  de parametres, le nouveau curseur et le mix musique/ambiance a l'oreille.

Changements effectues :

- Musique remontee dans le mix par defaut ; ambiance ocean/vent reduite pour
  rester en arriere-plan.
- Integration selective du kit `ITERATIONS VISUELLES/ASSETS/02` :
  panneau de parametres, titre, onglets, boutons de mode d'affichage, toggles,
  sliders, icones de section et curseur 32-bit.
- Remplacement de `src-tauri/app-icon.svg` par `src-tauri/app-icon.png`, issu de
  `ICONE OTHELLO ISLAND.png`, puis regeneration des icones Tauri.
- Nettoyage des metadonnees de provenance de l'icone source avant
  versionnement.
- Assets 02 inutilises retires de `src/assets/` avant commit pour eviter de
  publier des exports bruts non exploites.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm run build` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri icon -- src-tauri/app-icon.png` : OK, icones regenerees.
- `npm run tauri build` : OK, artefacts Windows regeneres.
- Scan anti-leak/metadonnees sur les assets destines au depot : aucun token,
  chemin utilisateur ou XMP residuel detecte dans les nouveaux assets
  versionnes.
- Verification navigateur automatique limitee : le serveur Vite local repond
  en HTTP 200 sur `http://127.0.0.1:1420`, mais la capture headless n'a pas
  produit de screenshot exploitable dans cette session.

Artefacts generes :

- `src-tauri/target/release/othello-island.exe`
- `src-tauri/target/release/bundle/msi/Othello Island_0.1.0_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Othello Island_0.1.0_x64-setup.exe`

## 2026-05-19 - Push GitHub kit parametres et icone

Etat :

- Repo local : commit `956a173` cree sur `main`.
- GitHub : commit `956a173` pousse sur `origin/main`.
- Distribution locale : installateur Windows regenere avant le push.
- Release publique : non publiee. Le code source et les assets sont publics sur
  GitHub, mais aucun installateur n'a ete publie comme GitHub Release.
- Validation reelle : validations automatisees effectuees avant commit. Retest
  manuel de l'installateur, du nouveau panneau de parametres, du curseur, de
  l'icone installee et du mix audio encore a faire.

## 2026-05-19 - Correction curseur custom sur boutons

Etat :

- Repo local : CSS corrige pour conserver le curseur custom au survol et au
  clic des boutons, controles et cases jouables.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  avec succes apres correction.
- Release publique : non publiee. Aucun artefact n'a encore ete publie comme
  GitHub Release.
- Validation reelle : validations automatisees effectuees. Retest manuel dans
  l'application installee encore necessaire pour verifier visuellement que le
  curseur Windows ne reapparait plus au survol des boutons.

Cause :

- Les curseurs custom etaient declares en haut de `src/App.css`, mais des
  regles plus basses comme `cursor: pointer` et `cursor: default` reprenaient
  la main sur les boutons et certains controles.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm run build` : OK.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `git diff --check` : OK.
- `npm run tauri build` : OK, artefacts Windows regeneres.

## 2026-05-19 - Push GitHub correction curseur

Etat :

- Repo local : commit `5ee10f9` cree sur `main`.
- GitHub : commit `5ee10f9` pousse sur `origin/main`.
- Distribution locale : installateur Windows regenere avant le push.
- Release publique : non publiee. Le code source est pousse, mais aucun
  installateur n'a ete publie comme GitHub Release.
- Validation reelle : validations automatisees effectuees avant commit. Retest
  manuel du curseur dans l'application installee encore a faire a la reprise.

## 2026-05-20 - Correctifs options, affichage et packaging 0.1.1

Etat :

- Repo local : options et configuration desktop corrigees, non committees.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  en version `0.1.1`.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Validation manuelle
  dans l'application installee encore necessaire pour confirmer les modes
  d'affichage, l'icone du raccourci desktop et le rendu exact du panneau options
  sur l'ecran cible.

Causes identifiees :

- Les boutons de mode d'affichage appelaient les API Tauri de fenetre, mais la
  capability desktop n'autorisait pas les commandes `set_fullscreen`,
  `set_size`, `set_position`, `set_decorations` et commandes associees.
- Le mix par defaut utilisait encore `ambience: 0.68` au lieu des 60% demandes.
- Le panneau options contenait un texte de commentaire interne :
  `Musique legerement devant le decor sonore...`.
- Le footer d'accueil etait un PNG affichant `Othello Island v1.0 2025`.
- Le curseur personnalise etait encore reference par le CSS.
- L'icone desktop pouvait rester ancienne si Windows gardait le raccourci ou le
  cache d'icone d'un installateur au meme numero de version.

Changements effectues :

- Ajout des permissions Tauri de fenetre dans
  `src-tauri/capabilities/default.json`.
- Version projet et bundle passee de `0.1.0` a `0.1.1`.
- Volumes par defaut : musique 90%, ambiance 60%, UI inchangee.
- Libelles des modes d'affichage raccourcis et agrandis.
- Icones de section et textes du panneau options agrandis.
- Texte audio interne remplace par un libelle utilisateur sobre.
- Bloc developpement `Textures / Non integrees` retire du panneau options.
- Footer `Othello Island v1.0 2025` retire de l'accueil.
- References CSS au curseur personnalise supprimees. Les PNG de curseur restent
  conserves dans `src/assets/cursor/`, mais ne sont plus utilises.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm run build` : OK.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` : OK, artefacts Windows `0.1.1` generes.
- `git diff --check` : OK.
- Scan statique sur `src`, `dist` et config Tauri : aucune reference restante a
  `assets/cursor`, `asset-title-footer`, `Othello Island v1.0 2025`,
  `Musique legerement...`, `Ocean en fondue`, `Textures / Non integrees`, ni
  aux anciens libelles longs des modes d'affichage.

Limite de validation :

- Verification visuelle navigateur automatique non effectuee : le plugin Browser
  etait disponible, mais l'outil de pilotage necessaire n'etait pas expose dans
  cette session.
- Verification manuelle de l'application installee non effectuee dans cette
  session.

Artefacts generes :

- `src-tauri/target/release/othello-island.exe`
- `src-tauri/target/release/bundle/msi/Othello Island_0.1.1_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Othello Island_0.1.1_x64-setup.exe`

## 2026-05-20 - Reintegrations backgrounds settings panel

Etat :

- Repo local : les deux assets settings panel modifies par l'utilisateur ont
  remplace les versions integrees dans `src/assets/settings/`.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  en version `0.1.1` avec ces assets.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Validation visuelle
  manuelle dans l'application installee encore necessaire.

Assets remplaces :

- `src/assets/settings/settings_background_panel_idle.png`
- `src/assets/settings/settings_background_panel_glow.png`

Sources utilisees :

- `ITERATIONS VISUELLES/ASSETS/02/settings/settings_background_panel_idle.png`
- `ITERATIONS VISUELLES/ASSETS/02/settings/settings_background_panel_glow.png`

Hashes SHA-256 apres integration :

- `settings_background_panel_idle.png` :
  `4CEE2719D66874ECABB8E5E1E7389B4EA2C83FDF04F59953D87D120E3055BBAF`
- `settings_background_panel_glow.png` :
  `2CE7D9F68E9A903C296D568371E672DAD2913153D89D12C2206218DE8C6591B1`

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm run build` : OK, les deux nouveaux assets sont presents dans `dist`.
- `npm run tauri build` : OK, artefacts Windows `0.1.1` regeneres.

Artefacts generes :

- `src-tauri/target/release/othello-island.exe`
- `src-tauri/target/release/bundle/msi/Othello Island_0.1.1_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Othello Island_0.1.1_x64-setup.exe`

## 2026-05-20 - Retours UI et raccourci desktop 0.1.2

Etat :

- Repo local : corrections UI et packaging ajoutees, non committees.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  en version `0.1.2`.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Validation manuelle
  dans l'application installee encore necessaire pour confirmer le curseur, le
  footer, le panneau options et l'icone du raccourci bureau.

Causes / constats :

- Le footer avait ete retire entierement alors que l'utilisateur voulait le
  conserver.
- Le CSS ne declarait plus de curseur sur la racine apres suppression du
  curseur custom ; l'application force maintenant le curseur systeme visible
  cote CSS et via `setCursorVisible(true)` dans Tauri.
- Le texte `Musique, ocean et vent sont regles dans le mixage.` etait encore
  trop descriptif pour un menu de jeu.
- Le bloc Mixage utilisait l'icone controles au lieu de l'icone audio.
- Le script NSIS cree le raccourci bureau vers l'executable, mais un raccourci
  deja existant peut conserver l'ancienne icone Windows. Un hook post-install
  recree maintenant ce raccourci s'il existe.

Changements effectues :

- Footer d'accueil restaure avec `ui_title_footer_idle.png` et son shimmer.
- Texte audio superflu retire du panneau options.
- Bloc `Audio / Sons actifs` retire ; le statut reste porte par le toggle
  `Audio du menu`.
- Bloc Mixage passe sur l'icone audio.
- Curseur systeme force sur `html`, `body`, `#root`, `.app-shell` et
  `.asset-title-screen`.
- Permission Tauri `core:window:allow-set-cursor-visible` ajoutee.
- Version projet et bundle passee de `0.1.1` a `0.1.2`.
- Hook NSIS `src-tauri/windows/nsis-hooks.nsh` ajoute pour supprimer/recreer le
  raccourci bureau existant avec l'icone de `othello-island.exe`.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm run build` : OK, footer et nouveaux assets presents dans `dist`.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `npm run tauri build` : OK, artefacts Windows `0.1.2` generes.
- Verification du script NSIS genere : inclusion de
  `src-tauri/windows/nsis-hooks.nsh` et insertion de `NSIS_HOOK_POSTINSTALL`
  confirmees.

Artefacts generes :

- `src-tauri/target/release/othello-island.exe`
- `src-tauri/target/release/bundle/msi/Othello Island_0.1.2_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Othello Island_0.1.2_x64-setup.exe`

## 2026-05-20 - Restauration curseur custom et packaging 0.1.3

Etat :

- Repo local : curseur personnalise restaure dans le CSS, versions projet
  passees en `0.1.3`, documentation projet mise a jour, non committe.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  en version `0.1.3`.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees. Validation manuelle
  dans l'application installee encore necessaire pour confirmer visuellement le
  curseur personnalise, les modes d'affichage, le panneau options et l'icone du
  raccourci bureau.

Cause :

- La demande precedente de retrait du curseur personnalise avait conduit a
  forcer le curseur systeme dans `src/App.css`.
- Les assets PNG de curseur existaient toujours dans `src/assets/cursor/`, mais
  l'interface packagerisee ne les utilisait plus.
- Des regles plus basses comme `cursor: pointer` et `cursor: default` peuvent
  reprendre la main si les curseurs custom ne sont pas reappliques en fin de
  CSS.

Changements effectues :

- Restauration de `cursor_idle.png`, `cursor_hover.png` et
  `cursor_pressed.png` sur la racine, les boutons, les labels, les inputs, les
  controles de parametres, les cases jouables et les etats disabled.
- Ajout de regles prioritaires en fin de `src/App.css` pour que les curseurs
  custom restent actifs malgre les anciennes declarations `pointer/default`.
- Version projet et bundle passee de `0.1.2` a `0.1.3`.

Commandes/verifications effectuees :

- `npm run lint` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `git diff --check` : OK.
- `npm run tauri build` : OK, artefacts Windows `0.1.3` generes.
- Verification du build frontend : les trois assets de curseur sont presents
  dans `dist/assets/` et references par le CSS genere.

Artefacts generes :

- `src-tauri/target/release/othello-island.exe`
- `src-tauri/target/release/bundle/msi/Othello Island_0.1.3_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Othello Island_0.1.3_x64-setup.exe`

## 2026-05-20 - Correction raccourci Bureau et packaging 0.1.4

Etat :

- Repo local : hook NSIS corrige, versions projet passees en `0.1.4`,
  documentation projet mise a jour, non committe.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  en version `0.1.4`.
- Installation locale : installateur NSIS `0.1.4` execute en mode silencieux
  apres autorisation utilisateur ; l'installation locale indique maintenant
  `DisplayVersion = 0.1.4`.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees et raccourci Bureau
  inspecte via Windows. Validation visuelle finale par l'utilisateur encore
  necessaire sur le Bureau.

Cause :

- La capture utilisateur montrait encore l'ancienne icone provisoire SVG
  (carre sombre, cercle dore, petit plateau).
- L'executable installe contenait bien la nouvelle icone, mais le raccourci
  Bureau avait `IconLocation=,0`, donc Explorer pouvait reutiliser l'ancienne
  vignette en cache.
- Le hook NSIS post-install recreait le raccourci, mais le bouton de fin
  d'installation pouvait appeler ensuite `CreateOrUpdateDesktopShortcut`, qui
  reecrivait le raccourci sans chemin d'icone explicite.

Changements effectues :

- `src-tauri/windows/nsis-hooks.nsh` recree maintenant le raccourci Bureau avec
  l'icone explicite de `othello-island.exe`.
- Le hook appelle `SetLnkAppUserModelId` sur le raccourci recree.
- Le hook met `NoShortcutMode` a `1` apres recreation du raccourci pour eviter
  que la page de fin d'installation le reecrive sans `IconLocation`.
- Version projet et bundle passee de `0.1.3` a `0.1.4`.

Commandes/verifications effectuees :

- `npm run tauri build` : OK, artefacts Windows `0.1.4` generes.
- `npm run lint` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- Verification du script NSIS genere : hook `NSIS_HOOK_POSTINSTALL` inclus,
  `NoShortcutMode` utilise et `SetLnkAppUserModelId` appele.
- Installation silencieuse de `Othello Island_0.1.4_x64-setup.exe` : OK.
- Verification du raccourci Bureau :
  `IconLocation=C:\Users\ArtLi\AppData\Local\Othello Island\othello-island.exe,0`.
- Rafraichissement leger du cache d'icones Windows via `ie4uinit.exe -show`.

Artefacts generes :

- `src-tauri/target/release/othello-island.exe`
- `src-tauri/target/release/bundle/msi/Othello Island_0.1.4_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Othello Island_0.1.4_x64-setup.exe`

## 2026-05-20 - Icone Bureau via fichier ICO versionne 0.1.5

Etat :

- Repo local : hook NSIS corrige pour copier un fichier `.ico` versionne,
  versions projet passees en `0.1.5`, documentation projet mise a jour, non
  committe.
- Distribution locale : executable Windows, MSI et installateur NSIS regeneres
  en version `0.1.5`.
- Installation locale : installateur NSIS `0.1.5` execute en mode silencieux
  apres autorisation utilisateur ; l'installation locale indique maintenant
  `DisplayVersion = 0.1.5`.
- Release publique : non publiee.
- Validation reelle : validations automatisees effectuees et raccourci Bureau
  inspecte via Windows. Validation visuelle finale par l'utilisateur encore
  necessaire sur le Bureau.

Cause :

- Le raccourci Bureau `0.1.4` pointait bien vers l'executable, mais l'affichage
  Explorer restait encore sur l'ancienne vignette selon le retour utilisateur.
- Pour contourner le cache base sur `othello-island.exe,0`, le raccourci doit
  pointer vers un chemin d'icone nouveau et explicite.

Changements effectues :

- `src-tauri/windows/nsis-hooks.nsh` copie maintenant
  `src-tauri/icons/icon.ico` dans le dossier d'installation sous le nom
  `othello-island-icon-0.1.5.ico`.
- Le raccourci Bureau pointe son `IconLocation` vers
  `othello-island-icon-0.1.5.ico,0`.
- Les anciens fichiers `othello-island-icon-*.ico` du dossier d'installation
  sont supprimes avant copie.
- Version projet et bundle passee de `0.1.4` a `0.1.5`.

Commandes/verifications effectuees :

- `npm run tauri build` : deux echecs intermediaires diagnostiques puis
  corriges (`/oname` NSIS avec guillemets, puis chemin relatif vers `icon.ico`).
- `npm run tauri build` final : OK, artefacts Windows `0.1.5` generes.
- `npm run lint` : OK.
- `npm test` : OK, 4 tests unitaires passes.
- `npm audit --audit-level=high` : OK, 0 vulnerabilite.
- `git diff --check` : OK avant mise a jour finale de la documentation.
- Installation silencieuse de `Othello Island_0.1.5_x64-setup.exe` : OK.
- Verification du raccourci Bureau :
  `IconLocation=C:\Users\ArtLi\AppData\Local\Othello Island\othello-island-icon-0.1.5.ico,0`.
- Verification SHA-256 : le `.ico` installe est identique a
  `src-tauri/icons/icon.ico`.
- Rafraichissement leger du cache d'icones Windows via `ie4uinit.exe -show`.

Artefacts generes :

- `src-tauri/target/release/othello-island.exe`
- `src-tauri/target/release/bundle/msi/Othello Island_0.1.5_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Othello Island_0.1.5_x64-setup.exe`
