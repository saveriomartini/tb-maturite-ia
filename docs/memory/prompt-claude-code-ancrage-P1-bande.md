# Ancrage — P1 : la bande des profils réagit à la portée, les écrans précédents non

À lancer **après P4**. Les règles communes figurent en tête du prompt P4 : relis-les, elles valent ici.

## Contexte

Aujourd'hui, déclarer la portée en Ancrage modifie un écran **précédent**. L'échelle des paliers des Résultats (`resti1.ladder` dans `useMaturityTool.js`) porte `isTarget` et `beyondTarget`, qui dépendent de `targetDeclared`. Le test pilote l'a relevé.

Décision retenue :

- Les phases 1 à 3 ne changent plus quand la portée change.
- En Ancrage, on montre la **bande des profils** (`ProfileBand.vue`), telle qu'elle apparaît pendant l'évaluation. Ses barres restent figées sur le résultat du diagnostic, et **seules les marques de cible réagissent, en direct**, à la question de portée.

## Travail

### 1. Découpler les Résultats

- Retire `isTarget` et `beyondTarget` de `resti1.ladder`. Retire aussi, dans `MaturityLadder.vue` et `ScreenResti*.vue`, les classes, props et styles qui ne servaient qu'à ces deux drapeaux.
- Mets à jour le commentaire de `resti1`, qui dit que l'échelle ne porte aucune marque de cible « tant qu'elle ne l'est pas » : elle n'en porte plus aucune, jamais.
- La bande des profils affichée sur la page `tool` (phases 1 à 3) ne reçoit **aucune** marque de cible.

### 2. Un vm de bande propre à l'Ancrage

- Ne modifie pas le vm de bande existant utilisé par `ScreenTool1`. Construis `ancrage.band` en partant de lui, et ajoute à chaque barre :
  - `isTarget` : le profil de la cible déclarée (P4). Avec l'option A de P4, aucun profil n'est marqué tant que rien n'est déclaré ;
  - `isSuggested` : le profil suggéré par le contexte (`suggestedLevel` de P4) ;
  - `betweenAcquiredAndTarget` : les profils strictement au-dessus du palier acquis et jusqu'à la cible incluse. C'est le chemin qui reste.
- Le remplissage, `full`, `acquired` et les comptes restent strictement ceux du diagnostic. Aucun ne dépend de `state.transformation`.

### 3. `ProfileBand.vue` — deux marques optionnelles

- Accepte des barres qui portent ou non `isTarget`, `isSuggested` et `betweenAcquiredAndTarget`. Sans ces champs, le rendu doit être **identique** à l'actuel : c'est ce qui garantit que la page `tool` ne bouge pas.
- Marque de cible : un repère sur la barre et un mot à côté du nom de profil. Utilise la couleur de la dimension stratégique 1, lue dans les données du modèle et **jamais codée en dur**, pour que la carte de portée de P2 et la bande se répondent.
- Marque de suggestion : un repère neutre, par exemple en tirets, avec son mot.
- Les deux mots sont des textes provisoires (voir les règles communes), du type « cible » et « suggéré par le cadrage ».
- Le rail est `aria-hidden` : les marques doivent donc exister **en texte**, pas seulement en couleur ou en forme.
- Quand cible et suggestion tombent sur le même profil, les deux mots s'affichent, sans chevauchement.

### 4. `ScreenAncrage.vue` — mise en page

- Reprends la grille de `ScreenTool1.vue`, soit contenu à gauche et bande de 280 px à droite, la bande collée sous l'en-tête. Reprends aussi les deux points de rupture, 1200 px et 900 px, où la bande passe en tête. Évite de dupliquer : si le CSS de `.page` peut devenir une classe ou un petit composant de mise en page partagé sans rien changer à `ScreenTool1`, fais-le ; sinon, duplique et signale-le.
- Place la bande à la **même position** que dans l'évaluation. Si Saverio veut une autre position, il le dira.
- La vignette radar reste dans la bande, comme en évaluation.

### 5. Tests

- **Invariant principal** : pour chacune des trois démos, `resti1` et le vm de bande de la page `tool` sont profondément égaux avant et après `actions.selectReach(n)`, pour n = 1..5, et après annulation.
- Inverse le test « marque le palier cible sur l'échelle seulement quand la portée est déclarée » : l'échelle des Résultats ne porte jamais de cible.
- `ancrage.band` : après `selectReach(n)`, exactement une barre porte `isTarget`, celle de rang n ; `full`, `acquired` et les comptes sont inchangés.
- `isSuggested` est posé sur le rang de `suggestedLevel`, que la portée soit déclarée ou non.
- Rendu : `ProfileBand` monté sans les champs optionnels produit le même DOM qu'avant. Utilise un snapshot ciblé ou une assertion sur les classes.

### 6. Documentation

- Commentaires de `ProfileBand.vue` et de `ScreenAncrage.vue` : ce que les marques disent, et pourquoi elles n'existent qu'en Ancrage.
- `docs/logs/DECISIONS-brouillon.md` : une ligne de faits.

## Compte rendu attendu

Fichiers modifiés ; classes ou props retirées de `MaturityLadder` ; mise en page partagée ou dupliquée ; textes provisoires ; résultat des quatre commandes ; une capture ou une description du rendu de l'Ancrage à 1440 px et à 800 px.
