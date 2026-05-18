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
- Packaging Tauri desktop non valide pour l'instant : le build Rust complet a
  ete bloque par une limite systeme de memoire/fichier de pagination Windows.
- Le depot GitHub de reference est `https://github.com/kinowill/OTHELLO-ISLAND`.
- Direction artistique de base retenue : ile mystique premium, avec symbolique
  occulte et esoterique fictionnelle.

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
- `src/game/othello.ts` : moteur de regles Othello.
- `src/game/othello.test.ts` : tests unitaires des regles.
- `src-tauri/` : scaffold Tauri pour futur packaging PC.
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
- La direction visuelle vise une ambiance ile/fantasy stylisee, sobre et
  premium, enrichie de symboles occultes et esoteriques fictifs : oeil,
  pyramide, compas, geometrie sacree, sceaux, cercles rituels, runes inventees,
  codes visuels evoquant les societes secretes, l'Illuminati pop-culture et
  les theories de complot d'elite.
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
- Les assets visuels importants pourront etre crees separement par
  l'utilisateur via generation d'image, puis integres au projet quand leur role
  est clair. Le prototype doit d'abord fonctionner avec des formes, textures et
  styles generes en code.
