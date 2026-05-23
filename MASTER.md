# Othello Island - Document maitre

## But du projet

Othello Island est un jeu PC personnel base sur les regles d'Othello/Reversi.
Le but est d'obtenir une experience jouable, soignee visuellement, avec une
ambiance graphique et musicale forte.

Le projet n'est pas prevu comme produit commercial ni comme projet open source
public signe. Il reste un projet personnel.

## Etat courant

- Prototype web jouable cree en React/TypeScript.
- Regles Othello implementees et couvertes par tests unitaires.
- Build frontend valide.
- Packaging Tauri desktop valide localement : executable Windows, MSI et
  installateur NSIS generes avec succes apres correction des icones Tauri.
- Validation manuelle initiale apres installation effectuee : demarrage,
  plateau, coups jouables et nouvelle partie OK.
- Ecran d'accueil anime ajoute : jaquette PC CD-ROM retro, table d'enquete,
  entree dans le jeu, bouton parametres et reprise de partie.
- Ecran d'accueil remplace par des assets PNG 32-bit fournis par l'utilisateur :
  fond nocturne, logo, panneau de menu, boutons et footer.
- Accueil compose sur une base `1600x900`, avec mode par defaut en vrai plein
  ecran applique au lancement.
- L'accueil ouvre maintenant un choix de mode avant l'entree en partie :
  `Campagne` ou `Multijoueur local`, puis applique un fondu noir avant de
  charger le plateau.
- Le mode `Campagne` charge maintenant un premier prologue jouable : fondu
  depuis le menu, approche du manoir, scene point & click devant la porte,
  hotspots herbes/porte/oeil/plateau, choix `S'approcher` / `Annuler`, puis
  duel Othello tutoriel contre "la porte" avec IA simple.
- Correctif campagne du 2026-05-22 : les zones cliquables ne sont plus
  visibles par defaut ni au survol, une option `Zones cliquables` et le maintien
  de la touche `V` permettent de les afficher, le curseur custom reste actif
  sur les dialogues et les bords de scene, la musique d'accueil ne peut plus
  redemarrer pendant la campagne, le hotspot de l'oeil est recentre, le plateau
  MAP1 est recadre, les nouveaux sons de marche et de pion sont integres, et
  la victoire MAP1 bloque le plateau avec un texte de retour.
- Correctif campagne complementaire du 2026-05-22 : le son de marche est coupe
  court avec fondu, l'OST ponctuelle MAP1 redemarre a chaque entree/reprise du
  plateau puis s'arrete au retour porte, le hotspot de l'oeil est encore
  resserre, le bouton `Reculer` garde le curseur custom, et l'animation de pion
  ne laisse plus voir le pion fixe sous le spritesheet.
- Les artefacts Windows `0.1.5` ont ete regeneres localement apres integration
  du prologue campagne : executable, MSI et installateur NSIS.
- Parametres enrichis et rhabilles avec un kit UI 32-bit : mode d'affichage,
  ambiance sonore, coups possibles, mixage separe musique / ambiance / UI,
  lueurs de panneau.
- Audio procedural retire apres test utilisateur negatif. Premiere integration
  audio par assets locaux : ocean nocturne, musique menu retardee avec fade-in,
  vent aleatoire, hover et select UI. Le mix par defaut place maintenant la
  musique a 90% et l'ambiance a 60%.
- Correctif options du 2026-05-20 : permissions Tauri ajoutees pour les modes
  d'affichage, version installable passee a `0.1.5`, footer image restaure,
  curseur 32-bit personnalise restaure, textes internes du panneau options
  retires et icone audio utilisee pour le bloc Mixage.
- Correctif options du 2026-05-21 : les libelles de volume du bloc Mixage ont
  ete rentres dans le panneau et les sliders legerement resserres pour eviter
  le chevauchement avec la texture decorative. Le bandeau d'onglets decoratifs
  `Affichage / Audio / Gameplay / Commandes` a aussi ete retire car il ne
  declenchait aucune navigation et promettait une section `Commandes`
  inexistante.
- Les deux backgrounds du panneau settings (`idle` et `glow`) ont ete
  reintegres depuis les exports modifies de l'utilisateur le 2026-05-20, puis
  les artefacts Windows `0.1.5` ont ete regeneres.
- Le depot GitHub de reference est `https://github.com/kinowill/OTHELLO-ISLAND`.
- Direction artistique canonique : retro 32-bit / pixel art propre, ambiance
  PC CD-ROM sombre, ile mysterieuse, dossiers confidentiels fictionnels.

## Stack

Stack retenue :

- Application desktop web embarquee : Tauri + React + TypeScript.
- Build frontend : Vite.
- Langage UI et logique de jeu : TypeScript.
- Packaging PC cible : Tauri, apres stabilisation du prototype web.

Raison : Othello est un jeu de regles, d'interface, d'animations et d'ambiance.
Tauri + React permet de produire un executable PC tout en gardant une base UI
facile a iterer, tester et maintenir.

## Structure des dossiers

Structure actuelle :

- `MASTER.md` : source principale de verite projet.
- `ROADMAP.md` : backlog et etapes de travail.
- `VALIDATION.md` : journal des validations reelles.
- `CAMPAIGN_PROLOGUE.md` : specification detaillee du premier prologue
  campagne point & click devant le manoir.
- `src/` : application React et logique Othello.
- `src/assets/audio/` : assets audio versionnes pour l'ambiance d'accueil et
  les sons UI.
- `src/assets/campaign/` : assets versionnes du prologue campagne : vues
  manoir, plateau MAP1, pions, animation de retournement, musique de fond,
  motif MAP1, easter egg SAD et sons de scene.
- `src/assets/title/` : assets PNG versionnes pour l'ecran d'accueil.
- `src/audio/titleAudio.ts` : controleur Web Audio de l'accueil et du
  prologue campagne.
- `src/game/othello.ts` : moteur de regles Othello.
- `src/game/othello.test.ts` : tests unitaires des regles.
- `src-tauri/` : configuration et code Tauri pour packaging PC.
- `src-tauri/app-icon.png` : source de l'icone applicative.
- `src-tauri/icons/` : icones generees pour le packaging Tauri.
- `src/assets/settings/` : kit d'assets PNG 32-bit pour le panneau de
  parametres.
- `src/assets/cursor/` : curseurs PNG 32-bit actifs pour l'etat normal, le
  survol et le clic.
- `ITERATIONS VISUELLES/` : dossier local de references et iterations visuelles,
  ignore par Git. Les assets retenus doivent etre copies dans `src/assets/`.
- `dist/` : sortie de build frontend, non versionnee.

## Sources de verite

1. `MASTER.md`
2. `ROADMAP.md`
3. `VALIDATION.md`
4. Code et builds reels quand ils existeront
5. Instructions Codex actives et protocole de travail

## Decisions connues

- Le projet est un jeu PC Othello/Reversi.
- Le nom de travail est `Othello Island`.
- Le depot GitHub de reference est `kinowill/OTHELLO-ISLAND`.
- Le depot GitHub est public : ne jamais versionner de secrets, tokens, exports
  bruts, prompts prives ou metadonnees inutiles dans les assets publies.
- La direction visuelle vise un rendu retro 32-bit / pixel art propre, proche
  d'une jaquette PC CD-ROM sombre : ile nocturne, mer, table d'enquete,
  dossiers confidentiels fictionnels, typographie pixelisee et scanlines.
  L'accueil utilise maintenant une vraie scene PNG 32-bit : ocean nocturne,
  ile lointaine, lumiere suspecte, ponton, damier au premier plan et menu a
  gauche.
- L'accueil desktop est compose pour une base `1600x900`. Le mode par defaut
  applique au runtime et dans la configuration Tauri est le vrai plein ecran.
  Les parametres proposent aussi un plein ecran fenetre sans bordure et un
  retour en fenetre fixe `1600x900`. Un mode scale/letterbox pourra remplacer
  cette contrainte plus tard si le support de petits ecrans devient prioritaire.
- Le choix de mode de l'accueil separe `Multijoueur local` et `Campagne`.
  `Multijoueur local` correspond au plateau classique existant. `Campagne`
  lance le prologue point & click decrit dans `CAMPAIGN_PROLOGUE.md` : fondu
  noir, extinction progressive de la musique du menu, approche du manoir, vue
  proche de la porte, hotspots courts, acces options via icone, puis plateau
  Othello MAP1. Le joueur joue noir contre "la porte" en blanc. L'IA de la
  porte joue legalement mais reste volontairement simple et pedagogique.
- Les appels Tauri de gestion de fenetre doivent etre autorises dans
  `src-tauri/capabilities/default.json`. Sans ces permissions, les boutons de
  mode d'affichage peuvent ne rien changer dans l'application desktop.
- Les codes de societes secretes, d'elite cachee et de theories de complot
  peuvent nourrir l'ambiance, mais doivent rester fictionnels et non accusatoires.
- Le traitement artistique doit rester subtil, elegant et cryptique : symboles
  integres dans les matieres, gravures, interfaces, animations et details
  decouvrables. Eviter le rendu trop edgy, goofy, horrifique adolescent ou
  trop evident.
- Le texte visible de l'interface doit rester sobre et direct. L'ambiance
  mystique doit venir d'abord de la composition, des matieres, de la lumiere et
  des signes visuels, pas de libelles forces comme "rituel" ou "sceau" sur les
  actions courantes.
- Le jeu doit utiliser ces references comme esthetique de mystere et de pouvoir,
  pas comme affirmation politique ou accusation contre des groupes reels.
- Les musiques devront etre gerees comme des assets locaux fournis par
  l'utilisateur ou generes/specifies separement. Le projet ne doit pas inclure
  de contenu pirate ou redistribue sans droit dans le depot.
- L'audio actif dans la version courante utilise des assets locaux. L'ocean
  arrive en fade-in, la musique demarre quelques secondes apres avec fade-in,
  le vent est relance avec delais/offsets aleatoires pour eviter une synchro
  fixe, et les sons UI hover/select ont des gains separes. Les parametres
  exposent trois volumes : musique, ambiance et UI. Le mix par defaut met la
  musique a 90% et l'ambiance a 60%. Le mixage reste a valider a l'oreille
  dans l'application installee.
- Audio campagne : la musique menu sort en fondu au lancement de `Campagne`.
  La seule boucle musicale de campagne est
  `campagne background music.mp3.mp3`. `OST othello island MAP1.mp3` est un
  motif ponctuel non boucle pendant le plateau, et `SAD.mp3` est reserve a un
  declenchement tres rare type easter egg. L'ambiance ocean/vent du menu reste
  active comme fond sonore. Depuis le correctif du 2026-05-22, le controleur
  audio interdit explicitement la boucle musicale d'accueil tant que la campagne
  est active, meme apres un nouveau clic ou une reprise du contexte audio.
- Les boutons grises ne doivent pas declencher de son de hover.
- Les assets visuels importants pourront etre crees separement par
  l'utilisateur via generation d'image, puis integres au projet quand leur role
  est clair. Ils doivent viser un rendu 32-bit/pixel art, pas des textures
  realistes lisses.
- L'icone applicative actuelle utilise l'asset `ICONE OTHELLO ISLAND.png`
  fourni par l'utilisateur, nettoye de ses metadonnees avant versionnement puis
  regenere en formats Tauri. La version installable a ete incrementee en
  `0.1.5`. Le hook NSIS copie maintenant un fichier
  `othello-island-icon-0.1.5.ico` dans le dossier d'installation et le
  raccourci bureau pointe son `IconLocation` vers ce fichier versionne, afin
  d'eviter que le cache Explorer reutilise l'ancienne icone liee a
  `othello-island.exe,0`.
- Piste future : etendre la campagne apres la premiere porte, ajouter une
  couche d'histoire ou de secret a debloquer, et faire evoluer l'ambiance
  pendant la partie via lumiere, textures et details de decor. Les textures
  importantes seront generees plus tard par l'utilisateur avec GPT Image, puis
  integrees comme assets locaux. Pour le prologue, les assets de travail
  fournis vivent dans `ITERATIONS VISUELLES/ASSETS/03/`, les assets retenus
  sont copies dans `src/assets/campaign/`, et le mapping exact est documente
  dans `CAMPAIGN_PROLOGUE.md`.
