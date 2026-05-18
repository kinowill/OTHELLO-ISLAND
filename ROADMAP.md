# Othello Island - Roadmap

## Objectif courant

Cadrer le projet avant implementation : stack, gameplay attendu, direction
artistique, audio et mode de distribution PC.

## A faire maintenant

- [x] Creer les sources de verite initiales du projet.
- [x] Choisir la stack technique.
- [x] Definir le perimetre du premier prototype jouable.
- [x] Definir la direction visuelle de base.
- [ ] Produire une mini bible artistique : couleurs, formes, symboles, ambiance.
- [x] Definir la strategie initiale d'assets visuels.
- [ ] Definir la strategie audio et les contraintes d'assets musicaux.
- [x] Creer le scaffold React/Tauri.
- [x] Implementer le premier prototype jouable humain contre humain.
- [x] Valider les regles par tests unitaires.
- [x] Valider le build frontend.
- [ ] Valider le packaging Tauri desktop sur une machine avec ressources
  systeme suffisantes.

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
5. Travail graphique et animations autour d'une ile mystique premium avec
   symbolique occulte/esoterique fictionnelle.
6. Integration audio.
7. Packaging Windows.

## Bloque ou a arbitrer

- Bible artistique detaillee non creee.
- Niveau d'IA attendu non choisi.
- Type de musiques et droits d'utilisation non clarifies.
- Packaging Tauri desktop bloque localement par une erreur Windows de
  memoire/fichier de pagination pendant la compilation Rust complete.

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

## Direction artistique retenue

Base : ile/fantasy stylisee, sobre, premium, mystique.

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
- Ne pas transformer le jeu en manifeste politique ou en accusation contre des
  groupes reels.
- Eviter de recopier servilement un embleme officiel existant si un symbole
  original peut mieux servir l'identite du jeu.
