# Ancrage — P4 : la cible appartient à l'organisation, le contexte suggère

À lancer **en premier** : P1 et P2 s'appuient sur ce que ce lot expose.

## Règles communes (valent pour P4, P1, P2)

- Branche `main`. Un commit par prompt.
- Avant de modifier, lis : `docs/logs/DECISIONS.md` (entrées du 28.08.2026 sur la question de portée et la phase Ancrage), `docs/logs/BACKLOG.md` (points 0.5, 0.5a, 0.5c, 0.5d, 0.5f), `docs/logs/NIVEAU-CIBLE.md` § 0.
- Le style du dépôt : commentaires qui disent **pourquoi**, en français, au registre des commentaires existants. Pas de code mort laissé derrière.
- Tu ne rédiges **aucun texte définitif** affiché à l'utilisateur. Là où un texte doit changer, écris une chaîne provisoire, factuelle, courte, précédée du commentaire `// TEXTE PROVISOIRE — à valider par Saverio`, et liste-la dans ton compte rendu.
- À la fin : `npm run lint`, `npm run check:model:strict`, `npm test`, `npm run build` doivent passer. Si l'un échoue, corrige ou arrête-toi et explique.
- N'écris dans `docs/logs/DECISIONS.md` **rien**. Dans `docs/logs/DECISIONS-brouillon.md`, ajoute seulement une ligne de faits (date, ce qui change, fichiers touchés), sans motif ni alternatives écartées : Saverio les rédige.

## Contexte

Un test pilote en PME a jugé gênant que l'outil **impose** la cible. Aujourd'hui, `useMaturityTool.js` calcule :

```js
state.transformation == null
  ? recommendation.value.level
  : Math.min(state.transformation, recommendation.value.level)
```

et `intentionGap` l'annonce (« c'est ce profil, le plus bas des deux, qui sert de cible »). C'est contraire à l'entrée DECISIONS du 28.08.2026, qui dit que la capacité ne borne plus l'intention, et le point 0.5c du BACKLOG est resté ouvert.

Décision retenue : **la cible effective est celle que l'organisation déclare**. L'outil l'informe de deux choses, sans jamais la corriger : d'où vient la suggestion qu'il formule (les attributs du cadrage), et ce que la cible déclarée engage (la nature du passage, `passageNature`, déjà en place).

## Décision à trancher avant de lancer — garde UNE option, supprime l'autre

- **Option A — pas de cible implicite.** Tant que la portée n'est pas déclarée, il n'y a pas de cible : `target` vaut `null`, la section « Ce qui vous en sépare » n'affiche qu'une invitation à déclarer la portée, et la suggestion du contexte est montrée comme telle. Cohérent avec « la cible appartient à l'organisation ».
- **Option B — suggestion par défaut, nommée comme telle.** Tant que la portée n'est pas déclarée, l'écart se calcule contre la suggestion du contexte, mais chaque libellé dit « profil suggéré », jamais « profil visé ».

## Travail

### 1. `src/composables/useMaturityTool.js` — la cible

- `target` = `state.transformation` quand elle est déclarée ; sinon selon l'option retenue (A : `null` ; B : `recommendation.value.level`).
- Supprime toute application de `Math.min` entre intention et recommandation, et le commentaire qui la justifie. Remplace-le par un commentaire qui dit ce que fait désormais le calcul et renvoie à l'entrée DECISIONS du 28.08.2026.
- Passe en revue tout ce qui lit `target` : `targetLabel`, `passageNature`, `gates`, `targetReached`, `exportPreview`, et tout autre usage. Avec l'option A, chacun doit traiter `null` explicitement — **aucun `else` silencieux**, aucun profil « 0 » affiché.

### 2. La suggestion du contexte, exposée à part

Ajoute au vm `ancrage` :

- `suggestedLevel` et `suggestedLabel` : `recommendation.value.level` et son nom de profil ;
- `suggestedReasons` : ce qui fait descendre la suggestion, tiré de `recommendation.value.capNotes` et `recommendation.value.level5Missing`, sous forme de libellés lisibles déjà disponibles dans `context-attributes.js` ou `recommendation.js`. N'invente pas de nouveaux libellés ; si aucun n'existe, rends la liste des identifiants et signale-le ;
- `relation` : `'undeclared' | 'above' | 'below' | 'equal'`, position de la cible déclarée par rapport à la suggestion.

### 3. `intentionGap` — dire, ne pas corriger

Réécris la fonction sur les quatre états de `relation`. Aucun état ne dit que la cible est corrigée, bornée ou remplacée. Chaque texte, provisoire, doit dire au plus : quelle cible est déclarée, quel profil le contexte suggère, et que la suggestion vient des attributs du cadrage. Proscrits : « sert de cible », « on ne fait pas viser », « le plus bas des deux », tout verbe à l'impératif.

### 4. Affichage dans `ScreenAncrage.vue`

- Dans la section « Le profil visé, et ce qu'il engage », ajoute sous le profil diagnostiqué une ligne `Profil suggéré par votre contexte : {{ vm.suggestedLabel }}`, suivie des motifs s'il y en a.
- Quand `relation` vaut `above`, marque visuellement l'écart. Contraintes : jetons de `assets/tokens.css`, `role="status"` et non `alert`, **pas de couleur d'erreur**. C'est une information mise en regard, pas un avertissement : un liseré ou une pastille neutre, plus un texte.
- Ne touche pas au chapô, ni à `passage` : ils seront réécrits plus tard.

### 5. `src/domain/recommendation.js`

Ne change **pas** le calcul de `buildRecommendation`. Mets seulement à jour les commentaires qui parlent de « profil visé » borné ou d'écart « entre le profil visé et celui qu'appelaient les réponses » : la recommandation est désormais une suggestion.

### 6. Tests (Vitest)

- Une portée déclarée au-dessus de la suggestion donne une cible égale à la portée déclarée.
- La recommandation ne fait jamais descendre une cible déclarée : teste-le sur toutes les paires (1..5 × 1..5).
- `relation` rend les quatre états attendus.
- Option A : sans portée, `target` vaut `null`, `gates` est vide, et aucun libellé exporté ne contient « Niveau 0 » ni un nom de profil présenté comme cible.
- Relance les trois démos (Rochat, Bel-Air, Terravia). **Si l'une change de position, ne corrige pas la démo** : signale-le dans le compte rendu, avec l'ancienne et la nouvelle cible.

### 7. Documentation

- `docs/logs/NIVEAU-CIBLE.md` : réécris le § 0 pour qu'il décrive le calcul réel (cible = déclaration, recommandation = suggestion affichée), et marque en tête du fichier que les § 1 à 3 décrivent la construction de la **suggestion**.
- `docs/logs/BACKLOG.md` : passe 0.5c à `[x]` avec un renvoi à ce commit.
- `docs/logs/DECISIONS-brouillon.md` : une ligne de faits, voir les règles communes.

## Compte rendu attendu

Fichiers modifiés ; textes provisoires, avec leur emplacement ; démos qui ont changé ; usages de `target` que tu as dû adapter ; résultat des quatre commandes.
