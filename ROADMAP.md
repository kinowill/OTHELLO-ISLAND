# Othello Island - Roadmap

## Objectif courant

Stabiliser le prototype PC local : gameplay Othello jouable, packaging Windows,
identite visuelle, audio et premiere experience installee.

## A faire maintenant

- [x] Creer les sources de verite initiales du projet.
- [x] Choisir la stack technique.
- [x] Definir le perimetre du premier prototype jouable.
- [x] Definir la direction visuelle de base.
- [ ] Produire une mini bible artistique : couleurs, formes, symboles, ambiance.
- [x] Definir la strategie initiale d'assets visuels.
- [x] Definir la strategie audio initiale et les contraintes d'assets musicaux.
- [x] Creer le scaffold React/Tauri.
- [x] Implementer le premier prototype jouable humain contre humain.
- [x] Valider les regles par tests unitaires.
- [x] Valider le build frontend.
- [x] Valider le packaging Tauri desktop local.
- [x] Tester manuellement l'application installee depuis l'installateur Windows.
- [x] Masquer les coups possibles par defaut et ajouter une option pour les
  afficher.
- [x] Creer un premier ecran d'accueil anime retro PC CD-ROM.
- [x] Reprendre l'accueil en scene nocturne wireframe : ile au loin, ocean,
  nuages, vent et fenetre suspecte.
- [x] Integrer les assets PNG 32-bit de l'ecran d'accueil : fond, logo, panneau
  menu, boutons et footer.
- [x] Verrouiller provisoirement la fenetre desktop en `1600x900` pour
  stabiliser le cadrage de l'accueil.
- [x] Remplacer les reglages inline par un vrai panneau de parametres.
- [x] Ajouter un retour menu depuis une partie.
- [x] Retirer l'ambiance audio procedurale jugee mauvaise.
- [x] Integrer les premiers assets audio : ocean, musique menu, vent aleatoire,
  hover et select UI.
- [x] Ajouter les reglages de volume musique, ambiance et UI dans les
  parametres.
- [x] Ajouter les modes d'affichage : plein ecran fenetre sans bordure, vrai
  plein ecran et fenetre fixe `1600x900`.
- [x] Lancer l'ambiance en fade-in et retarder la musique au demarrage.
- [x] Eviter le son de hover sur les boutons grises.
- [x] Rehausser la musique par defaut pour qu'elle passe devant l'ambiance.
- [x] Integrer le kit UI `ASSETS/02` dans les parametres : panneau, onglets,
  boutons, toggles, sliders, icones et curseur custom.
- [x] Remplacer l'icone applicative provisoire par l'icone Othello Island
  fournie par l'utilisateur.
- [x] Corriger les options apres retour utilisateur : permissions de fenetre
  Tauri, mix par defaut musique 90% / ambiance 60%, textes internes retires,
  icones et libelles agrandis, curseur custom restaure et icone audio
  utilisee pour Mixage.
- [x] Reintegrer les deux backgrounds settings panel modifies par
  l'utilisateur et regenerer les artefacts Windows.
- [x] Restaurer le footer d'accueil et ajouter un hook NSIS pour recreer le
  raccourci bureau avec l'icone de l'executable.
- [x] Regenerer les artefacts Windows `0.1.3` avec le curseur personnalise
  embarque dans `dist`.
- [x] Corriger le raccourci Bureau Windows en `0.1.4` pour forcer une icone
  explicite au lieu de laisser Explorer reutiliser l'ancienne vignette.
- [x] Remplacer l'IconLocation du raccourci Bureau en `0.1.5` par un fichier
  `.ico` versionne copie dans le dossier d'installation.
- [x] Ajouter un choix de mode sur l'accueil : `Campagne` /
  `Multijoueur local`, avec fondu noir avant l'entree en partie.
- [x] Cadrer le premier beat de campagne : point & click devant le manoir,
  porte verrouillee par un plateau d'Othello, duel tutoriel contre la porte.
- [x] Documenter le prologue campagne, les hotspots, textes, sons et assets
  fournis dans `CAMPAIGN_PROLOGUE.md`.
- [ ] Retester l'installateur Windows apres ecran d'accueil, parametres, retour
  menu, correction de taille de fenetre et option de coups possibles.
- [ ] Cadrer les options completes.
- [x] Choisir ou fournir des assets audio ocean / ambient mysterieuse.
- [x] Fournir les premiers assets campagne dans `ITERATIONS VISUELLES/ASSETS/03`
  : vues manoir, plateau, pions, animation de retournement, musique et sons.
- [x] Copier les assets campagne retenus dans `src/assets/`.
- [x] Integrer les sons campagne ajoutes le 2026-05-22 : pas de marche et son
  de pion pose.
- [ ] Completer ou produire les sons encore absents : retournement, reaction de
  porte, serrure et ouverture finale si les sons fournis ne suffisent pas.
- [x] Implementer la scene point & click de campagne et le hotspot du plateau.
- [x] Implementer le duel tutoriel contre la porte avec IA simple.
- [x] Corriger le premier retour campagne : curseur custom stable, hotspots
  masques par defaut, touche `V` et option de debug visuel, musique d'accueil
  isolee, hotspot oeil recentre, plateau MAP1 recadre, et fin victoire/defaite
  mieux geree.
- [ ] Cadrer la couche histoire / secret a debloquer apres la premiere porte.
- [ ] Cadrer les textures evolutives et changements d'ambiance pendant la
  partie.
- [ ] Definir la liste prioritaire de textures 32-bit a generer et integrer.

## Prototype jouable vise

- Plateau Othello 8x8.
- Regles completes : coups legaux, retournement des pions, passage de tour,
  detection de fin de partie, score.
- Mode humain contre humain local.
- Interface PC claire et agreable.
- Pas d'IA dans le premier prototype.
- Pas de dependance a des assets externes dans le premier prototype.

## Etapes suivantes probables

1. Initialisation technique du projet.
2. Implementation du moteur de regles Othello.
3. Creation d'une interface jouable minimale.
4. Ajout d'une IA locale.
5. Travail graphique et animations autour d'une direction retro 32-bit / PC
   CD-ROM sombre avec symbolique fictionnelle.
6. Cadrage d'une couche histoire / secret a debloquer.
7. Textures et ambiance evolutives selon l'avancee de la partie.
8. Integration audio.
9. Packaging Windows.

## Bloque ou a arbitrer

- Bible artistique detaillee non creee.
- Niveau d'IA attendu non choisi.
- Type de musiques et droits d'utilisation non clarifies.
- Premiers assets audio fournis et integres. Mixage par defaut corrige pour
  mettre la musique a 90% et l'ambiance a 60%, mais le niveau final reste a
  retester a l'oreille dans l'application installee.
- Premier beat de campagne defini : approche point & click du manoir, porte
  proche, plateau/cle cliquable, duel tutoriel contre "la porte", victoire qui
  ouvre la porte.
- Mode `Campagne` implemente localement comme gameplay distinct : intro manoir,
  scene point & click, plateau MAP1 et duel contre "la porte". Validation
  navigateur locale effectuee, executable et installateurs Windows `0.1.5`
  regeneres, mais application installee non retestee depuis cette integration.
- IA de campagne implementee en premiere version simple : elle joue blanc
  legalement apres un court delai et choisit volontairement des coups peu
  agressifs. Son niveau reste a ajuster apres test humain.
- Forme exacte de l'histoire / secret apres la premiere porte non definie.
- Systeme d'evolution visuelle en partie a definir : lumiere, textures,
  details de decor, et conditions de changement.
- Assets d'accueil et kit de parametres 32-bit integres. Les autres textures de
  jeu restent a definir et integrer.
- Mode responsive/letterbox non implemente : la version courante privilegie une
  base `1600x900` avec vrai plein ecran par defaut, plus options plein ecran
  fenetre sans bordure et fenetre fixe. Les permissions Tauri ont ete corrigees
  le 2026-05-20 et le build Tauri accepte la configuration fullscreen du
  2026-05-22, mais ces modes sont encore a retester dans l'application
  installee.
- Aucun blocage packaging connu apres correction Windows et ajout des icones.
- Release publique non publiee : les artefacts existent localement, mais ne
  sont pas encore livres via GitHub Release ou autre canal.

## Stack retenue

- Tauri + React + TypeScript.
- Vite pour le developpement frontend.
- Prototype initial jouable dans le navigateur local avant packaging PC.
- Tauri servira a produire l'application desktop quand la boucle de jeu sera
  stable.

## Assets visuels

- Le prototype initial ne depend pas d'assets externes : il doit etre jouable
  avec CSS, formes vectorielles simples et textures procedurales.
- Les assets generes par image IA seront demandes plus tard avec des briefs
  precis : fond principal, textures de plateau, icones/sceaux, pions,
  eventuellement jaquette ou splash screen.
- Les textures doivent etre generees dans un style retro 32-bit / pixel art
  propre. Eviter les textures photo lisses ou trop modernes.
- Les iterations et exports bruts restent dans `ITERATIONS VISUELLES/` et ne
  sont pas versionnes. Les assets retenus sont copies dans `src/assets/`.
- Les futures textures peuvent devenir evolutives pendant la partie : lumiere
  qui baisse, signes qui apparaissent, decor qui se charge de details, ou autre
  progression visuelle a definir.
- Assets campagne prioritaires a generer :
  vue basse depuis l'ile en direction du manoir, vue tres proche de la porte,
  porte avec plateau d'Othello et cle dessinee comme indice cliquable, porte
  entrouverte ou ouverte, plateau vu du dessus pour le duel contre la porte.
- Audio campagne prioritaire :
  musique specifique du seuil, ambiance de manoir/ile proche, fondu de sortie
  de la musique menu, sons de marche, sons de pion pose, retournement, reaction
  de la porte, serrure et ouverture finale.
- Les assets `ASSETS/03` retenus sont copies dans `src/assets/campaign/` :
  manoir loin, manoir proche, plateau campagne, pions noir/blanc, spritesheet
  de retournement lu dans les deux sens, boucle `campagne background music`,
  motif ponctuel `OST othello island MAP1`, easter egg rare `SAD`, clic porte,
  clic oeil, clic invalide, son de pensee, pas de marche et son de pion pose.
  Voir `CAMPAIGN_PROLOGUE.md` pour le mapping exact.

## Direction artistique retenue

Base : retro 32-bit / pixel art propre, jaquette PC CD-ROM sombre, ile
mysterieuse, table d'enquete, mer nocturne et dossiers confidentiels
fictionnels.

References visuelles autorisees :

- Oeil central, pyramide, compas, cercles, triangles, grilles et geometrie
  sacree.
- Sceaux, runes inventees, gravures, constellations, manuscrits et signes de
  rituel.
- Codes pop-culture de societes secretes, Illuminati, elite cachee et theorie
  du complot, traites comme atmosphere fictionnelle.

Limite :

- Garder un traitement subtil, cryptique et premium : le joueur doit sentir un
  ordre cache ou un rituel, pas recevoir un collage evident de symboles.
- Eviter le ton edgy, goofy, meme internet, horreur adolescente ou conspiration
  trop litterale.
- Garder les textes d'interface simples et fonctionnels. Les termes occultes ne
  doivent pas remplacer les mots de jeu attendus comme "partie", "tour" ou
  "score".
- Ne pas transformer le jeu en manifeste politique ou en accusation contre des
  groupes reels.
- Eviter de recopier servilement un embleme officiel existant si un symbole
  original peut mieux servir l'identite du jeu.
