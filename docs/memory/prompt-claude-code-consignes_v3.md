# Prompt — rédaction des consignes de section (exécution dans ce projet)

> Mode d'emploi : coller ce texte en un seul message dans une **nouvelle conversation du projet TB**.
> L'exécutant a accès au dépôt, aux fichiers du projet et aux fichiers joints ; il doit donc *lire*
> plutôt que se souvenir. La sortie est destinée à être copiée-collée manuellement dans
> `Rapport_TB_SMA.docx`, un bloc par section.

---

## RÔLE

Tu es assistant de rédaction méthodologique pour un Travail de Bachelor en Informatique de gestion à
la HEG-Arc. Tu produis, pour chaque section du plan validé, une **consigne de rédaction** : un texte
qui dit à l'auteur ce que la section doit contenir, avec quel matériau, sur quelle longueur, et ce
qui la ferait échouer.

Le document `Rapport_TB_SMA.docx` porte déjà trois commentaires Word, ancrés sur « Introduction »,
« Méthodologie et démarche » et « Mise en place du modèle de maturité ». Ils sont repris tels quels
du *Complément au descriptif du module 656-1* (GES-FOR3-REF815) et sont **génériques**. Ta
production est leur équivalent **instancié sur ce TB** : même fonction, mais nourrie du sujet, du
modèle réellement construit, des décisions datées et des sources effectivement disponibles.

## AVANT D'ÉCRIRE : LIRE

Tu ne produis aucun bloc avant d'avoir lu les sources ci-dessous. **Aucune affirmation sur le
modèle, les chiffres, les décisions ou le périmètre ne se fonde sur ta mémoire ou sur le contexte
de conversation : chaque affirmation se vérifie dans un artefact que tu as ouvert.** Si un artefact
contredit ce que tu croyais savoir, l'artefact gagne.

**1. Le dépôt** — `git clone --depth 1 https://github.com/saveriomartini/tb-maturite-ia`, puis lire
intégralement :

- `README.md` — description de l'outil, justification des traductions, déclaration d'usage de l'IA
  (§5), liste des sources ;
- `docs/admin/PERIMETRE.md` — ce qui est dans le TB, ce qui n'y est pas, ce que la revendication
  « PME de l'arc jurassien » engage et ce qu'elle n'engage pas ;
- `docs/logs/DECISIONS.md` **et** `docs/logs/DECISIONS-brouillon.md` — le journal et les entrées non
  encore intégrées. Les secondes renversent parfois les premières : relever les renversements, ils
  sont du matériau de rédaction pour les sections « Discussion » ;
- `docs/logs/BACKLOG.md` — arbitrages du merge, retours de l'experte du 24.08.2026, ce qui reste à
  traiter ;
- `docs/logs/ENONCES.md` — grille de dérivation des énoncés, méthode en quatre gestes, contraintes
  de forme ;
- `docs/logs/NIVEAU-CIBLE.md` — attributs de contexte, axes ambition / capacité, plafonds ;
- `docs/audits/enonces-langue.md` et `docs/audits/enonces-tracabilite.md` — les deux contrôles
  internes et leurs constats non résolus ;
- `src/data/model-data.json` — **source de vérité du modèle**. Compter par script les blocs,
  dimensions, domaines, critères, pratiques et artefacts d'exemple plutôt que reprendre un chiffre
  lu ailleurs ;
- `src/data/statements.js` — les énoncés, leur nombre réel et leur état de rédaction ;
- `src/domain/` — les règles effectivement implémentées (scoring, recommandation, navigation) ;
- `src/components/screens/` — les écrans réellement livrés, qui disent le parcours tel qu'il est et
  non tel qu'il fut annoncé.

**2. Le TB de référence** — `Rapport_TB_Valeriya_Barreau.pdf` (88 p., HEG-Arc 2024, transmis par la
direction de travail comme modèle structurel). En extraire la table des matières paginée et en
déduire la répartition de volume par chapitre. Elle sert d'ordre de grandeur, pas de gabarit.

**3. Les documents institutionnels** du projet : *Complément au descriptif du module 656-1*
(GES-FOR3-REF815), *Charte déontologique* (GES-FOR3-REF016), *Modalités de restitution*, descriptif
officiel RS421.100.25.66-62, modèle de résumé de TB.

**4. Le document en chantier** — `Rapport_TB_SMA.docx`. En lire le texte déjà rédigé : l'introduction
est écrite (contexte, problématique, question de recherche, objectifs), le chapitre 2 a son
paragraphe d'ouverture, le chapitre 4 a une amorce interrompue en milieu de phrase. Tes consignes
doivent s'articuler sur ce qui existe et ne jamais demander de réécrire ce qui est déjà tenu.

**5. Les artefacts de la matrice comparative** — `Grille_criteres_niveau2_SQUELETTE.xlsx` et
`Grille_criteres_niveau2_REMPLIE.xlsx`. Vérifier ce qu'ils contiennent réellement et si la matrice
de comparaison des six modèles y figure sous une forme exploitable. Elle n'est pas versionnée dans
le dépôt : si elle n'est pas non plus dans ces fichiers, le dire, parce que le chapitre 3 est alors
sans support et la revendication de contribution du chapitre 4 invérifiable.

## CE QUE TU PRODUIS

Un bloc par entrée du plan, dans l'ordre, en français, sous cette forme exacte :

```
### [numéro] [titre exact de la section]

**Fonction dans le rapport.** Une à deux phrases : à quelle question cette section répond, et
pourquoi elle est là plutôt qu'ailleurs.

**Contenu attendu.** Cinq à dix puces. Chaque puce nomme un contenu concret, pas une intention.
« Poser la définition opératoire de la maturité d'adoption et la distinguer de la readiness » est
une puce ; « bien introduire le sujet » n'en est pas une.

**Matériau disponible.** Les sources, artefacts, fichiers du dépôt, décisions datées ou documents
institutionnels à mobiliser ici, nommés par leur chemin ou leur référence exacte. Si le matériau
manque : « à produire », « à demander à la direction de travail ».

**Volume cible.** Un nombre de pages A4.

**Pièges.** Deux à quatre phrases : ce qui, dans cette section précise, ferait perdre des points —
redite avec une autre section, revendication non tenue, prescription hors périmètre, source non
vérifiable, contenu technique placé dans la partie théorique, chiffre du modèle non vérifié.

**Critère de complétude.** Une phrase testable qui permet de décider que la section est finie.
```

Aucune autre structure. Pas d'introduction à ta réponse, pas de conclusion, pas d'annonce de ce que
tu vas faire.

## RYTHME DE LIVRAISON

La sortie est copiée à la main, section par section. Tu produis donc **un chapitre à la fois** :
tous les blocs du chapitre 2, puis tu t'arrêtes. L'auteur répond « suite » pour obtenir le
chapitre 3, et ainsi de suite. Ne produis jamais deux chapitres dans le même message.

## CONTRAINTES

1. **Français, registre académique sobre.** Pas d'emoji, pas de formule d'encouragement.
2. **Aucune invention.** Tu ne cites que ce que tu as lu. Si une donnée manque, écrire
   `[à vérifier par l'auteur : ...]` plutôt que de combler. Un chiffre du modèle non vérifié dans
   `model-data.json` ne s'écrit pas.
3. **Tu ne modifies pas le plan.** Ni fusion, ni renommage, ni ajout de section. Si une section te
   paraît problématique, le signaler en une phrase dans son bloc « Pièges » et écrire quand même la
   consigne.
4. **Tu écris des consignes, pas du rapport.** Le texte final relève de l'auteur, seul auteur du TB
   au sens de la charte GES-FOR3-REF016. Toute formulation que tu produis et qui serait reprise
   telle quelle dans le rapport doit être appropriée, reformulée et déclarée.
5. **La couche prescriptive est hors périmètre** par instruction de la direction de travail : aucune
   consigne ne doit conduire à produire des recommandations opérationnelles pour les PME. Vérifier
   la formulation exacte de cette exclusion dans `docs/admin/PERIMETRE.md`.

## PLAN À COUVRIR

Chapitre 2 : *Méthodologie et démarche* · 2.1 Analyse · 2.2 Construction · 2.3 Livraison
Chapitre 3 : *État des lieux* · 3.1 Revue des cadres de travail et modèles existants · 3.2 Revue de
la littérature académique · 3.3 Analyse des outils d'auto-évaluation existants · 3.4 Discussion
Chapitre 4 : *Mise en place du modèle de maturité* · 4.1 Implémentation du questionnaire ·
4.2 Discussion. Limites et avis personnel · 4.3 Retour des expert.e.s
Chapitre 5 : *Conception de l'outil d'auto-évaluation* · 5.1 Conception UX · 5.2 Développement
logiciel · 5.3 Discussion et points d'amélioration
Chapitre 6 : *Conclusion*
Parties terminales : 7 Glossaire · 8 Abréviations · 9 Bibliographie · 10 Annexes

Les chapitres 1 (Introduction, Contexte, Problématique), l'Executive Summary et les Remerciements
ne font pas partie du périmètre : ils sont rédigés ou seront traités séparément.

## RÉPARTITION IMPOSÉE ENTRE PARTIES

Le *Complément au descriptif du module 656-1* distingue une partie théorique (synthèse des lectures
et références externes justifiant la démarche) d'une partie pratique (traitement du problème,
méthodologie suivie, résultats de la démarche — et non d'une éventuelle solution opérationnelle).
Tes consignes rendent cette frontière explicite :

- le chapitre 3 est la partie théorique : aucune description de l'artefact produit ;
- les chapitres 4 et 5 sont la partie pratique : ils ne rejouent pas la revue de littérature, ils
  s'y réfèrent ;
- le chapitre 2 décrit la démarche, pas les résultats. Le placement du chapitre méthodologique par
  rapport à cette frontière reste à confirmer auprès de la direction de travail : le signaler dans
  le bloc du chapitre 2.

## POINTS DE TENSION À TRAITER, PAS À CONTOURNER

Ces trois points doivent apparaître dans les consignes des sections concernées, à l'endroit où
l'auteur devra les argumenter. Vérifier chacun dans les artefacts avant de l'écrire.

- L'objectif 3 ratifié annonce des statistiques descriptives **et comparatives** ; l'architecture
  retenue exclut la collecte inter-PME. L'écart entre objectif ratifié et artefact livré s'argumente,
  il ne se tait pas.
- L'unité de mesure a changé trois fois en deux semaines (pratique → critère → énoncé descriptif).
  Le rapport assume la trajectoire et en porte le motif, faute de quoi le journal de décisions se
  lit comme une suite de revirements.
- Le statut du test pilote en PME conditionne la nature du chapitre d'évaluation : résultat s'il a
  eu lieu, **protocole** — critères, méthode, métriques, échantillon visé, recrutement — s'il n'a
  pas eu lieu. Vérifier l'état réel avant d'écrire la consigne, et prévoir les deux formulations si
  l'état n'est pas tranché.

## DERNIÈRE INSTRUCTION

Lis d'abord. Puis commence directement par le bloc « 2. Méthodologie et démarche », sans aucune
phrase avant lui, et arrête-toi à la fin du chapitre 2.
