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
- Accueil compose sur une base `1600x900`, avec mode par defaut en plein
  ecran fenetre sans bordure applique au lancement.
- Parametres enrichis : mode d'affichage, ambiance sonore, coups possibles et
  mixage separe musique / ambiance / UI.
- Audio procedural retire apres test utilisateur negatif. Premiere integration
  audio par assets locaux : ocean nocturne, musique menu retardee avec fade-in,
  vent aleatoire, hover et select UI.
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
- `src/` : application React et logique Othello.
- `src/assets/audio/` : assets audio versionnes pour l'ambiance d'accueil et
  les sons UI.
- `src/assets/title/` : assets PNG versionnes pour l'ecran d'accueil.
- `src/audio/titleAudio.ts` : controleur Web Audio de l'accueil.
- `src/game/othello.ts` : moteur de regles Othello.
- `src/game/othello.test.ts` : tests unitaires des regles.
- `src-tauri/` : configuration et code Tauri pour packaging PC.
- `src-tauri/app-icon.svg` : source de l'icone applicative.
- `src-tauri/icons/` : icones generees pour le packaging Tauri.
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
  applique au runtime est le plein ecran fenetre sans bordure. Les parametres
  proposent aussi un vrai plein ecran et un retour en fenetre fixe `1600x900`.
  Un mode scale/letterbox pourra remplacer cette contrainte plus tard si le
  support de petits ecrans devient prioritaire.
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
  exposent trois volumes : musique, ambiance et UI. Le mixage reste a valider a
  l'oreille dans l'application installee.
- Les boutons grises ne doivent pas declencher de son de hover.
- Les assets visuels importants pourront etre crees separement par
  l'utilisateur via generation d'image, puis integres au projet quand leur role
  est clair. Ils doivent viser un rendu 32-bit/pixel art, pas des textures
  realistes lisses.
- Une icone applicative provisoire existe pour debloquer le packaging Tauri.
  Elle peut etre remplacee plus tard par un asset final plus travaille.
- Piste future a cadrer : ajouter une couche d'histoire ou de secret a
  debloquer, et faire evoluer l'ambiance pendant la partie via lumiere,
  textures et details de decor. Les textures importantes seront generees plus
  tard par l'utilisateur avec GPT Image, puis integrees comme assets locaux.
