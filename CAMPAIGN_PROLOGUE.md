# Othello Island - Spec campagne prologue

## Role du document

Ce document fige le premier prologue `Campagne` pour eviter de perdre les
decisions dans le chat.

Source d'assets actuelle :

- `ITERATIONS VISUELLES/ASSETS/03/`

Ces fichiers sont des assets de travail non versionnes tant qu'ils restent dans
`ITERATIONS VISUELLES/`. Les assets retenus pour l'application doivent etre
copies dans `src/assets/campaign/` ou `src/assets/audio/` avant integration.

Etat implementation 2026-05-21 :

- Assets retenus copies dans `src/assets/campaign/`.
- Prologue `Campagne` implemente dans l'application React.
- Validation navigateur locale effectuee en `1600x900`.
- Build frontend valide.
- Executable, MSI et installateur NSIS Windows `0.1.5` regeneres localement.

Correctif implementation 2026-05-22 :

- Vue `manoir loin` remplacee par l'export agrandi `5000x3000`.
- Sons `footsteps-walking-boots-.mp3` et `PION SOUND.wav` copies dans
  `src/assets/campaign/` et utilises pendant l'approche / les coups MAP1.
- Hotspots point & click masques par defaut et au survol. Ils s'affichent
  seulement via l'option `Zones cliquables` ou pendant le maintien de la touche
  `V`.
- Musique d'accueil verrouillee au menu : elle ne redemarre plus pendant la
  campagne apres un clic ou un deblocage audio.
- Victoire / defaite MAP1 mieux separees : defaite avec retour possible vers le
  plateau sans rejouer le texte de surprise ; victoire qui bloque le plateau
  depuis la scene porte.

## Intention

La campagne commence comme une scene point & click courte. Le joueur arrive sur
l'ile, se rapproche du manoir, puis se retrouve devant une porte. La porte est
fermee par un mecanisme d'Othello. Le joueur doit cliquer sur le plateau a cote
de la porte, s'en approcher, puis gagner une partie tutoriel contre "la porte"
pour l'ouvrir.

Le but n'est pas encore une campagne complete. Le but est de poser une premiere
scene jouable, lisible et forte.

## Deroule utilisateur

1. Le joueur clique sur `Campagne` dans le menu de mode.
2. La musique du menu disparait en fondu.
3. Fondu au noir.
4. Ambiance existante du menu et bruitage de marche.
5. Fondu vers `manoir loin.png` pendant quelques secondes maximum.
6. Fondu au noir.
7. Continuation courte du bruitage de marche pendant la transition.
8. Fondu vers `manoir proche.png`.
9. La boucle `campagne background music.mp3.mp3` apparait en fondu.
10. Le curseur custom redevient visible et la scene devient cliquable.
11. Le joueur explore la scene point & click.
12. Le clic sur le plateau a droite ouvre un choix en bas : `S'approcher` ou
    `Annuler`.
13. `S'approcher` ouvre directement le plateau d'Othello vu du dessus avec
    `OTHELLO PLATEAU MAP1.png`.
14. Le texte de pensee apparait : `Je pense pouvoir y arriver.`
15. Le motif `OST othello island MAP1.mp3` peut etre joue ponctuellement, non
    boucle, pendant la partie.
16. Le joueur commence la partie tutoriel.
17. Au premier coup joue par l'IA / la porte, le joueur est surpris :
    `Les... LES PIONS BOUGENT TOUT SEUL !!!??`
18. Si le joueur perd, afficher `...j'ai perdu...`. Il peut reculer puis revenir
    sur le plateau sans reinitialiser la partie ni rejouer le texte de surprise.
19. Si le joueur gagne, afficher `J'ai gagne ! La porte emet un son...`.
20. Apres victoire, le retour a la porte bloque le plateau : cliquer dessus
    affiche seulement `J'ai gagne cette partie, la porte a emis un son.`.
21. La porte ouverte ou entrouverte reste a cadrer visuellement.

## Scene point & click

### Image `manoir loin`

- Asset : `ITERATIONS VISUELLES/ASSETS/03/manoir loin.png`
- Role : transition d'approche depuis l'ile vers le manoir.
- Duree : quelques secondes maximum.
- Interactions : aucune dans la premiere version.
- Audio : ambiance de menu, pas de musique menu, bruitage de marche dedie.

### Image `manoir proche`

- Asset : `ITERATIONS VISUELLES/ASSETS/03/manoir proche.png`
- Role : scene point & click principale devant la porte.
- Interactions attendues :
  - herbes / ombre ;
  - porte ;
  - oeil sur la porte ;
  - plateau a droite ;
  - clics non interactifs.

### Hotspots et textes

Les textes doivent rester courts, sobres et cryptiques.

- Clic sur les herbes / l'ombre :
  `Des bruits etranges emanent de l'ombre...`
- Clic sur la porte :
  `Cette porte semble fermee par un lourd mecanisme.`
- Clic sur l'oeil :
  `Cet oeil... mieux vaut ne pas trainer la.`
- Clic sur le plateau a droite :
  afficher un choix bas d'ecran : `S'approcher` / `Annuler`.
- Apres victoire MAP1, clic sur le plateau :
  `J'ai gagne cette partie, la porte a emis un son.`
- Clic non interactif :
  jouer le son de clic invalide, sans dialogue obligatoire.

### Choix plateau

- `S'approcher` :
  - jouer un son de confirmation ou clic ;
  - fondu court ;
  - passer sur `OTHELLO PLATEAU MAP1.png` ;
  - afficher : `Je pense pouvoir y arriver.`
- `Annuler` :
  - fermer le choix ;
  - rester sur la porte proche.

## Plateau campagne

### Image

- Asset : `ITERATIONS VISUELLES/ASSETS/03/OTHELLO PLATEAU MAP1.png`
- Dimensions observees : `2000x1000`.
- Role : fond de plateau vu du dessus pour le duel contre la porte.
- Le plateau graphique est deja dessine dans l'image. L'UI React doit placer les
  cases jouables exactement sur la grille verte existante.

### Pions

Assets disponibles :

- `ITERATIONS VISUELLES/ASSETS/03/PION NOIR.png`
- `ITERATIONS VISUELLES/ASSETS/03/PION BLANC.png`

Dimensions observees :

- `169x173` chacun.

Utilisation :

- Remplacer les disques CSS du mode campagne par ces images.
- Garder le mode multijoueur local existant intact si possible.

### Animation de retournement

Assets disponibles :

- `pion_flip_00.png`
- `pion_flip_01.png`
- `pion_flip_02.png`
- `pion_flip_03.png`
- `pion_flip_04.png`
- `pion_flip_05.png`
- `pion_flip_06.png`
- `pion_flip_07.png`
- `pion_flip_08.png`
- `pion_noir_vers_blanc_animation.gif`
- `pion_noir_vers_blanc_spritesheet.png`

Role :

- Animation noir vers blanc fournie.
- Version actuelle : le spritesheet est joue dans le sens normal pour noir vers
  blanc et en sens inverse pour blanc vers noir. Aucun second asset n'est donc
  necessaire pour cette premiere passe.
- Depuis le correctif du 2026-05-22, le spritesheet est rendu en surcouche
  au-dessus du pion final pour eviter le clignotement au moment ou l'asset fixe
  reprend la main.

## IA / tutoriel

Premiere version souhaitee :

- IA simple, presque pedagogique.
- Elle doit apprendre les bases de l'Othello sans punir le joueur.
- Elle doit jouer legalement.
- Elle doit donner l'impression que la porte agit toute seule.

Comportement minimum :

- Le joueur joue noir en premier.
- La porte joue blanc automatiquement apres un court delai.
- Au premier coup de la porte, afficher :
  `Les... LES PIONS BOUGENT TOUT SEUL !!!??`
- L'IA peut choisir un coup legal simple, par exemple :
  - priorite aux coins si disponibles ;
  - eviter de bloquer le tutoriel ;
  - sinon choisir un coup legal stable ou le premier coup legal.

Non-objectifs :

- Pas d'IA forte dans ce premier prologue.
- Pas de sauvegarde de campagne complexe.
- Pas de multi-chapitres.

## Audio

### Ambiance

- Utiliser la meme ambiance que le menu pour l'ocean / fond sonore.
- Ne pas reutiliser la musique du menu dans la scene proche.
- Le controleur audio interdit explicitement la boucle musicale d'accueil tant
  que la campagne est active.

### Musique

- Menu :
  - la musique menu doit disparaitre en fondu quand `Campagne` commence.
- Campagne :
  - boucle de fond : `ITERATIONS VISUELLES/ASSETS/03/campagne background music.mp3.mp3`
  - duree observee : environ `1059.08s`.
  - apparait en fondu sur la scene `manoir proche`.
  - cette boucle est la seule musique campagne jouee en loop.
- Motif ponctuel :
  - asset : `ITERATIONS VISUELLES/ASSETS/03/OST othello island MAP1.mp3`
  - duree observee : environ `149.68s`.
  - ne doit pas boucler.
  - version actuelle : joue comme motif ponctuel au lancement du plateau
    campagne, avec un throttle long pour eviter les empilements.
- Easter egg :
  - asset : `ITERATIONS VISUELLES/ASSETS/03/SAD.mp3`
  - duree observee : environ `182.05s`.
  - version actuelle : peut se declencher tres rarement sur un clic invalide
    campagne.

### Sons fournis

- `BIG_HEAVY_DOOR WONT OPEN.wav`
  - role : clic sur porte fermee / mecanisme lourd.
  - duree observee : environ `1s`.
- `CLIC ON THE EYE OF THE DOOR.wav`
  - role : clic sur l'oeil de la porte.
  - duree observee : environ `2s`.
- `MOUSE CLICK WRONG.wav`
  - role : clic sur une zone non interactive.
  - duree observee : environ `1s`.
- `speaksound.wav`
  - role : son de pensee / parole courte du joueur.
  - duree observee : environ `1s`.
- `footsteps-walking-boots-.mp3`
  - role : marche pendant l'approche du manoir.
- `PION SOUND.wav`
  - role : son de pion pose pendant les coups du joueur et de la porte.

Sons encore a identifier ou produire si absents :

- pion retourne ;
- reaction de la porte quand elle joue ;
- serrure / ouverture finale.

## Interface

### Curseur

- Le curseur custom doit rester visible sur `manoir proche`.
- Le curseur custom doit rester visible sur les bords de scene et les dialogues.
- Les hotspots ne doivent pas etre visibles par defaut ni au hover.
- L'option `Zones cliquables` et la touche `V` servent a les afficher pour
  inspection ou aide ponctuelle.

### Options / menu campagne

- Ajouter un petit acces options visible et propre sur la scene campagne.
- Utiliser une icone cryptique deja disponible dans les assets du jeu si elle
  convient.
- Ce menu doit donner acces au minimum a :
  - reglages audio ;
  - retour menu ;
  - plus tard : sauvegarde / reprise si la campagne grandit.

La premiere passe peut reutiliser le panneau parametres existant.

## Assets inventories

Fichiers principaux :

- `ITERATIONS VISUELLES/ASSETS/03/manoir loin.png`
- `ITERATIONS VISUELLES/ASSETS/03/manoir proche.png`
- `ITERATIONS VISUELLES/ASSETS/03/OTHELLO PLATEAU MAP1.png`
- `ITERATIONS VISUELLES/ASSETS/03/PION BLANC.png`
- `ITERATIONS VISUELLES/ASSETS/03/PION NOIR.png`
- `ITERATIONS VISUELLES/ASSETS/03/campagne background music.mp3.mp3`
- `ITERATIONS VISUELLES/ASSETS/03/OST othello island MAP1.mp3`
- `ITERATIONS VISUELLES/ASSETS/03/SAD.mp3`
- `ITERATIONS VISUELLES/ASSETS/03/BIG_HEAVY_DOOR WONT OPEN.wav`
- `ITERATIONS VISUELLES/ASSETS/03/CLIC ON THE EYE OF THE DOOR.wav`
- `ITERATIONS VISUELLES/ASSETS/03/MOUSE CLICK WRONG.wav`
- `ITERATIONS VISUELLES/ASSETS/03/speaksound.wav`
- `ITERATIONS VISUELLES/ASSETS/03/footsteps-walking-boots-.mp3`
- `ITERATIONS VISUELLES/ASSETS/03/PION SOUND.wav`

Frames / animation :

- `ITERATIONS VISUELLES/ASSETS/03/pion_noir_vers_blanc_assets et gifs/pion_flip_00.png`
- `ITERATIONS VISUELLES/ASSETS/03/pion_noir_vers_blanc_assets et gifs/pion_flip_01.png`
- `ITERATIONS VISUELLES/ASSETS/03/pion_noir_vers_blanc_assets et gifs/pion_flip_02.png`
- `ITERATIONS VISUELLES/ASSETS/03/pion_noir_vers_blanc_assets et gifs/pion_flip_03.png`
- `ITERATIONS VISUELLES/ASSETS/03/pion_noir_vers_blanc_assets et gifs/pion_flip_04.png`
- `ITERATIONS VISUELLES/ASSETS/03/pion_noir_vers_blanc_assets et gifs/pion_flip_05.png`
- `ITERATIONS VISUELLES/ASSETS/03/pion_noir_vers_blanc_assets et gifs/pion_flip_06.png`
- `ITERATIONS VISUELLES/ASSETS/03/pion_noir_vers_blanc_assets et gifs/pion_flip_07.png`
- `ITERATIONS VISUELLES/ASSETS/03/pion_noir_vers_blanc_assets et gifs/pion_flip_08.png`
- `ITERATIONS VISUELLES/ASSETS/03/pion_noir_vers_blanc_assets et gifs/pion_noir_vers_blanc_animation.gif`
- `ITERATIONS VISUELLES/ASSETS/03/pion_noir_vers_blanc_assets et gifs/pion_noir_vers_blanc_spritesheet.png`

## Plan d'implementation recommande

1. Copier les assets retenus dans `src/assets/campaign/` et
   `src/assets/audio/`.
2. Etendre le controleur audio pour pouvoir :
   - eteindre la musique menu en fondu ;
   - garder l'ambiance menu ;
   - lancer la musique campagne en fondu ;
   - jouer les sons de scene.
3. Ajouter un nouvel etat d'ecran `campaign`.
4. Ajouter les sous-etats de campagne :
   - `approach`;
   - `door`;
   - `board`;
   - `opened` plus tard.
5. Implementer les hotspots de `manoir proche`.
6. Implementer le choix `S'approcher` / `Annuler`.
7. Integrer le plateau image-based de campagne.
8. Ajouter une IA simple pour la porte.
9. Ajouter les dialogues et sons.
10. Valider visuellement en `1600x900`, puis build.

Etat de ce plan au 2026-05-21 :

- Etapes 1 a 10 realisees pour une premiere version locale.
- Sons de marche et pion pose distinct integres le 2026-05-22.
- Sons de retournement, serrure et ouverture finale restent a produire ou
  identifier.
- La victoire affiche maintenant un retour court et bloque le plateau depuis la
  scene porte ; la vraie image/animation de porte ouverte reste a cadrer.
