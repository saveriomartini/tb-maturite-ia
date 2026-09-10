# Portée visée — cinq énoncés, une carte

Proposition de textes pour l'étape 2a du chantier « Ancrage · P2 ». **Rien de `src/` n'est modifié
par ce document** : il propose, il n'intègre pas. L'intégration (étape 2b) n'utilisera que les
textes validés — ou réécrits — par l'auteur.

## Ce qui est proposé, et d'où ça vient

La question « Portée visée » cesse d'être un champ à options et devient **une carte de domaine** :
cinq énoncés, un seul retenu, le composant du questionnaire repris tel quel, à la couleur de la
dimension `D11` (`#ff6464`, `model-data.json → blocks[B1].dimensions[D11].color` — lue depuis le
modèle en 2b, jamais recopiée en dur).

Chaque énoncé est dérivé de deux sources tenues en parallèle :

- **Ozkaya et al. (2026)**, pour ce que le niveau *est* : `src/data/model-data.json`, tableau
  `levels`, entrée dont le champ `n` vaut le rang. Champs cités : `.name`, `.tag`, `.desc` ;
- **Venkatraman (1994)**, pour ce que la transformation *touche* : `TRANSFORMATION_DEGREES` dans
  `src/data/transformation.js`, entrée dont `n` vaut le rang. Champs cités : `.name`, `.reach`, et
  une phrase de `.position`.

La troisième colonne rappelle l'existant — `REACH_QUESTION.options` du même fichier, entrée dont `n`
vaut le rang, champs `.label` et `.detail` — parce que les énoncés proposés en reprennent beaucoup :
les `detail` actuels sont déjà des situations décrites, il leur manquait la forme d'un énoncé et la
place d'un choix.

**Contrainte qui prime sur tout le reste** (BACKLOG 1.11) : aucun nom de profil, aucun nom de degré,
aucun numéro de rang, aucun nom de source dans ce qui s'affiche. L'utilisateur décrit une situation ;
il ne nomme pas la cible que l'outil va lui renvoyer.

---

## Rang 1

| Source | Texte |
|---|---|
| **Ozkaya et al. (2026)** — `levels[n=1]` | `.name` : « Exploration localisée ». `.tag` : « L'exploration démarre dans une fonction isolée : c'est le début de la transformation. » `.desc` : « […] l'entreprise se familiarise avec les capacités de l'IA au regard du périmètre, des risques et de l'adoption identifiés. […] un ensemble limité de cas d'usage permet d'établir des pratiques standard minimales. » |
| **Venkatraman (1994)** — `TRANSFORMATION_DEGREES[n=1]` | `.name` : « Exploitation localisée ». `.reach` : « une fonction isolée ». Phrase clé de `.position` : « l'IA est essayée là où elle tombe bien, sans que rien change autour d'elle ». |
| **Existant** — `REACH_QUESTION.options[n=1]` | `.label` : « Une fonction s'en trouve outillée ». `.detail` : « L'IA sert dans une activité précise — un service, un poste, une tâche — et le reste de l'entreprise continue de travailler comme avant. » |

> **Énoncé proposé**
> Une activité précise — un service, un poste, une tâche — travaille avec l'IA, et le reste de
> l'entreprise continue comme avant.

*Ce qu'il prend à chaque source* : à Ozkaya, le caractère isolé et limité de l'usage (`tag`,
« fonction isolée » ; `desc`, « ensemble limité de cas d'usage ») ; à Venkatraman, la seconde
moitié — rien ne change autour (`position`) — qui est le vrai discriminant du rang ; à l'existant,
l'énumération « un service, un poste, une tâche », qui rend « fonction isolée » sans employer le mot
du modèle.

- [x] **forme des énoncés de domaine** — une phrase, présent de l'indicatif, forme active, sujet qui
  agit (`docs/logs/ENONCES.md` §4). Règle suivie : « Présent de l'indicatif, forme active ».
- [x] **situation souhaitée** — portée par le titre de la carte (voir § *Le titre de la carte*), pas
  par le temps du verbe ; déviation déclarée en fin de document.
- [x] **cumulatif** — rang plancher, il ne suppose rien.
- [x] **aucun nom de profil, de degré, de source, aucun numéro** — vérifié : ni « Exploration », ni
  « Exploitation », ni « localisée ».
- [x] **longueur** — 20 mots (médiane des 140 énoncés : 20).
- [x] **défaut « Nous »** — ne commence pas par « Nous » ; déviation déclarée en fin de document.

---

## Rang 2

| Source | Texte |
|---|---|
| **Ozkaya et al. (2026)** — `levels[n=2]` | `.name` : « Intégration opérationnelle ». `.tag` : « Des cas d'usage sont en production et l'IA s'intègre aux processus internes. » `.desc` : « L'entreprise met en œuvre des systèmes et workflows soutenus par l'IA, dont certains sont désormais en production avec un ROI et une valeur potentiels. » |
| **Venkatraman (1994)** — `TRANSFORMATION_DEGREES[n=2]` | `.name` : « Intégration interne ». `.reach` : « les processus internes existants ». Phrase clé de `.position` : « l'IA franchit les cloisons entre fonctions et s'installe dans les processus existants, sans les redessiner ». |
| **Existant** — `REACH_QUESTION.options[n=2]` | `.label` : « Nos processus internes s'en trouvent équipés ». `.detail` : « L'IA est présente dans les processus qui font tourner l'entreprise, d'un service à l'autre. Ces processus restent ceux d'aujourd'hui : l'IA s'y ajoute, elle ne les redessine pas. » |

> **Énoncé proposé**
> Les processus qui font tourner l'entreprise s'appuient sur l'IA, d'un service à l'autre, mais
> restent ceux d'aujourd'hui.

*Ce qu'il prend à chaque source* : à Ozkaya, « s'intègre aux processus internes » et le fait que ce
soit en production, rendu par « qui font tourner l'entreprise » plutôt que par le mot *production* ;
à Venkatraman, les deux moitiés de la phrase clé — le franchissement des cloisons (« d'un service à
l'autre ») et surtout la restriction (« sans les redessiner ») ; à l'existant, la formule « les
processus qui font tourner l'entreprise » et l'opposition à aujourd'hui, condensées en une phrase.

- [x] **forme des énoncés de domaine** — une phrase, présent, active. Règles suivies : « Une phrase,
  vingt-cinq mots au plus » et « Présent de l'indicatif, forme active ». Le « mais » qui borne la
  situation est le tour employé par plusieurs énoncés de rang 2 du questionnaire.
- [x] **situation souhaitée** — portée par le titre.
- [x] **cumulatif** — suppose le rang 1 : des processus entiers ne s'appuient pas sur l'IA sans
  qu'une activité l'ait fait avant.
- [x] **aucun nom de profil, de degré, de source, aucun numéro** — « processus » figure dans deux
  noms du modèle (« Alignement des processus », « Réingénierie des processus ») mais aucun de ces
  noms n'apparaît. Le test de 2b doit porter sur les noms complets, jamais sur les mots isolés :
  interdire « processus » rendrait le vocabulaire du domaine inutilisable.
- [x] **longueur** — 17 mots (le plus court des cinq ; plancher des 140 énoncés : 13).
- [x] **défaut « Nous »** — ne commence pas par « Nous ».

---

## Rang 3

| Source | Texte |
|---|---|
| **Ozkaya et al. (2026)** — `levels[n=3]` | `.name` : « Alignement des processus ». `.tag` : « Les processus sont repensés autour de l'IA et pilotés de manière cohérente. » `.desc` : « […] les workflows pertinents sont identifiés et pilotés de manière cohérente avec les applications d'IA. » |
| **Venkatraman (1994)** — `TRANSFORMATION_DEGREES[n=3]` | `.name` : « Réingénierie des processus ». `.reach` : « la façon même dont le travail est organisé ». Phrase clé de `.position` : « les processus ne reçoivent plus l'IA, ils sont refaits autour d'elle ». |
| **Existant** — `REACH_QUESTION.options[n=3]` | `.label` : « Notre façon de travailler est revue ». `.detail` : « Les processus sont repensés autour de ce que l'IA permet, et non l'inverse. Certaines étapes disparaissent, d'autres changent de main : c'est l'organisation du travail elle-même qui bouge. » |

> **Énoncé proposé**
> La façon de travailler change pour tirer parti de l'IA : des étapes disparaissent, d'autres
> changent de main, les rôles se déplacent.

*Ce qu'il prend à chaque source* : à Ozkaya, l'idée que les processus sont repensés *autour* de l'IA
(`tag`) ; à Venkatraman, la formule qui la rend concrète — les processus ne reçoivent plus l'IA, ils
sont refaits autour d'elle —, retournée en actif ; à l'existant, les deux manifestations observables
(des étapes disparaissent, d'autres changent de main), auxquelles s'ajoute le déplacement des rôles,
qui est ce qu'un dirigeant constate en premier.

- [x] **forme des énoncés de domaine** — une phrase, présent, active. Règle suivie : « Présent de
  l'indicatif, forme active » — l'existant disait « les processus **sont repensés** », le passif
  disparaît. Règle suivie aussi : « Une situation observable » — trois manifestations, pas une
  qualification.
- [x] **situation souhaitée** — portée par le titre.
- [x] **cumulatif** — suppose les rangs 1 et 2 : on ne refait pas des processus que l'IA n'a pas
  encore atteints.
- [x] **aucun nom de profil, de degré, de source, aucun numéro** — « Alignement » et
  « Réingénierie » sont écartés, et c'est ici que la contrainte coûte le plus : les deux sources
  nomment ce rang par un mot que l'énoncé n'a pas le droit d'employer.
- [x] **longueur** — 21 mots.
- [x] **défaut « Nous »** — ne commence pas par « Nous ».

---

## Rang 4

| Source | Texte |
|---|---|
| **Ozkaya et al. (2026)** — `levels[n=4]` | `.name` : « Mise à l'échelle en réseau ». `.tag` : « L'IA passe à l'échelle et s'étend à vos partenaires, clients et fournisseurs. » `.desc` : « […] l'entreprise est capable de conduire ses initiatives IA à l'échelle, d'appliquer l'IA sans difficulté à de nouveaux cas d'usage et à de nouveaux périmètres, et de garantir des mises en œuvre fiables et des résultats dignes de confiance. » |
| **Venkatraman (1994)** — `TRANSFORMATION_DEGREES[n=4]` | `.name` : « Réingénierie du réseau d'affaires ». `.reach` : « le réseau de partenaires, de fournisseurs et de clients ». Phrase clé de `.position` : « la transformation ne s'arrête plus aux murs de l'entreprise, elle porte sur ses relations avec ses partenaires, ses fournisseurs et ses clients ». |
| **Existant** — `REACH_QUESTION.options[n=4]` | `.label` : « Nos relations d'affaires sont revues ». `.detail` : « La transformation dépasse les murs de l'entreprise : ce qui change touche la façon de travailler avec les fournisseurs, les donneurs d'ordre et les clients — échanges, délais, engagements réciproques. » |

> **Énoncé proposé**
> Les relations avec les fournisseurs, les donneurs d'ordre et les clients changent : délais,
> échanges et engagements réciproques ne se règlent plus comme avant.

*Ce qu'il prend à chaque source* : à Venkatraman, l'essentiel — le franchissement des murs de
l'entreprise et les trois interlocuteurs qu'il nomme ; à Ozkaya, le même mouvement vers l'extérieur
(`tag`) ; à l'existant, le triplet « délais, échanges, engagements réciproques », qui donne à voir ce
que « relations » veut dire.

**Point de dérivation à signaler.** Ozkaya place à ce rang deux choses : l'ouverture au réseau *et*
le passage à l'échelle (`desc` : « de nouveaux cas d'usage et de nouveaux périmètres »).
Venkatraman n'en retient qu'une, le réseau. L'énoncé suit Venkatraman, parce que c'est la portée qui
est demandée et non la performance ; le passage à l'échelle est déjà supposé par la cumulativité,
puisque le rang 3 vaut alors pour toute l'organisation. Si ce raccourci n'est pas accepté, c'est
l'énoncé de rang 4 qu'il faut rouvrir, et lui seul.

- [x] **forme des énoncés de domaine** — une phrase, présent, active. Règle suivie : « Présent de
  l'indicatif, forme active » — l'existant disait « sont revues ». Règle suivie : « Registre France
  Num » — « donneurs d'ordre » est le mot des PME industrielles, « partenaires » celui du
  référentiel.
- [x] **situation souhaitée** — portée par le titre.
- [x] **cumulatif** — suppose les rangs 1 à 3 : les engagements pris avec des tiers supposent une
  organisation interne déjà refaite.
- [x] **aucun nom de profil, de degré, de source, aucun numéro** — « réseau » et « échelle » sont
  écartés, alors qu'ils sont les mots des deux sources pour ce rang.
- [x] **longueur** — 23 mots (plafond des 140 énoncés : 24).
- [x] **défaut « Nous »** — ne commence pas par « Nous ».

---

## Rang 5

| Source | Texte |
|---|---|
| **Ozkaya et al. (2026)** — `levels[n=5]` | `.name` : « Redéfinition stratégique du périmètre ». `.tag` : « L'IA redéfinit votre périmètre d'activité et vous savez anticiper ses évolutions. » `.desc` : « L'entreprise a un historique de réussites portées par l'IA. Elle déploie et fait monter en charge ses solutions IA de manière constante, au point qu'un retour aux anciennes façons de travailler constituerait un risque existentiel. » |
| **Venkatraman (1994)** — `TRANSFORMATION_DEGREES[n=5]` | `.name` : « Redéfinition du périmètre d'activité ». `.reach` : « le périmètre d'activité lui-même ». Phrase clé de `.position` : « ce n'est plus la façon de faire qui change, c'est ce que l'entreprise fait ». |
| **Existant** — `REACH_QUESTION.options[n=5]` | `.label` : « Notre activité elle-même est redéfinie ». `.detail` : « Ce n'est plus la façon de faire qui change, c'est ce que l'entreprise fait : l'IA ouvre des prestations, des marchés ou un métier qui n'étaient pas les siens. » |

> **Énoncé proposé**
> L'entreprise ne fait plus tout à fait le même métier : l'IA lui ouvre des prestations ou des
> marchés qui n'étaient pas les siens.

*Ce qu'il prend à chaque source* : à Venkatraman, le renversement — ce n'est plus la façon de faire
qui change, c'est ce que l'entreprise fait —, rendu par « ne fait plus tout à fait le même métier » ;
à Ozkaya, la même bascule dite comme un périmètre redéfini (`tag`) ; à l'existant, le couple
« prestations, marchés », qui rend le mot *périmètre* inutile.

*Ce qu'il ne prend pas* : le « risque existentiel » du `.desc` d'Ozkaya. C'est une conséquence du
niveau, pas une situation à reconnaître, et l'énoncer ici demanderait à l'utilisateur de souhaiter un
risque. Il reste dit là où il a sa place, dans `TRANSFORMATION_DEGREES[n=5].position`, en
restitution.

- [x] **forme des énoncés de domaine** — une phrase, présent, active. Règle suivie : « Présent de
  l'indicatif, forme active » — l'existant disait « est redéfinie ». Règle suivie : «
  “ L'entreprise ” désigne l'unité évaluée » (§4), employée ici sans la renommer.
- [x] **situation souhaitée** — portée par le titre.
- [x] **cumulatif** — suppose les rangs 1 à 4.
- [x] **aucun nom de profil, de degré, de source, aucun numéro** — « Redéfinition » et « périmètre »
  sont écartés, bien qu'ils soient les mots des deux sources pour ce rang.
- [x] **longueur** — 23 mots.
- [x] **défaut « Nous »** — ne commence pas par « Nous ».

---

## Les cinq d'affilée

C'est ainsi qu'ils se liront, et c'est le seul contrôle qui vaille (`ENONCES.md` §6 : la relecture se
fait en série, jamais énoncé par énoncé).

| Rang | Énoncé | Mots |
|---|---|---|
| 1 | Une activité précise — un service, un poste, une tâche — travaille avec l'IA, et le reste de l'entreprise continue comme avant. | 20 |
| 2 | Les processus qui font tourner l'entreprise s'appuient sur l'IA, d'un service à l'autre, mais restent ceux d'aujourd'hui. | 17 |
| 3 | La façon de travailler change pour tirer parti de l'IA : des étapes disparaissent, d'autres changent de main, les rôles se déplacent. | 21 |
| 4 | Les relations avec les fournisseurs, les donneurs d'ordre et les clients changent : délais, échanges et engagements réciproques ne se règlent plus comme avant. | 23 |
| 5 | L'entreprise ne fait plus tout à fait le même métier : l'IA lui ouvre des prestations ou des marchés qui n'étaient pas les siens. | 23 |

Comptage : mots séparés par une espace ; tirets cadratins et signes de ponctuation non comptés ;
« l'IA », « d'aujourd'hui », « d'ordre » comptés pour un. Les 140 énoncés du questionnaire vont de 13
à 24 mots, médiane 20, moyenne 19,9 — la série ci-dessus tient dans cette fourchette et la parcourt
sans qu'aucun rang y soit sensiblement plus détaillé que ses voisins (`ENONCES.md` §6 : « un rang
beaucoup plus détaillé que les autres attire les réponses »).

Ce que la série donne à voir, et qui ne se voit pas énoncé par énoncé : les cinq groupes nominaux de
tête forment eux-mêmes l'échelle — *une activité précise*, *les processus*, *la façon de travailler*,
*les relations*, *le métier*. Ce qui grandit d'un rang au suivant est le sujet de la phrase, ce qui
est exactement la variable demandée.

---

## Le titre de la carte

La carte ressemblera à un domaine du questionnaire, et les vingt-huit domaines demandent tous la
situation **actuelle** sous la même phrase : `PICKER_QUESTION` = « Laquelle de ces situations décrit
le mieux votre organisation ? ». Le titre de la carte de portée doit donc rendre la réponse au
présent impossible, sans quoi l'utilisateur répondra au questionnaire une vingt-neuvième fois.

- **Variante A** — « Le jour où l'adoption de l'IA aura réussi chez vous, laquelle de ces situations
  décrira votre organisation ? »
- **Variante B** — « Si l'adoption de l'IA réussit chez vous, jusqu'où doit-elle avoir porté ? »
  (l'actuel `REACH_QUESTION.question`, inchangé)
- **Variante C** — « Ces situations ne décrivent pas votre organisation d'aujourd'hui : laquelle
  voulez-vous atteindre ? »

**Recommandation : A.** C'est la seule des trois qui reprenne la charpente de `PICKER_QUESTION`
— « laquelle de ces situations… votre organisation » — en n'y changeant que le temps. Le parallèle
avec les vingt-huit cartes reste visible, ce qui est le propos de la refonte, et le futur retire au
présent toute prise : on ne peut pas répondre « aujourd'hui » à une question posée au jour où.
B pose la bonne question mais dans une forme qui n'est pas celle d'une carte : « jusqu'où » appelle
une distance, pas le choix d'une situation parmi cinq, et l'écart avec la phrase des domaines devient
un dépaysement gratuit. C dit la consigne avant la question ; elle est exacte, mais elle commence par
une négation et fait porter à l'utilisateur la charge de la nuance, alors que A la porte dans sa
grammaire.

---

## Le sort du `hint`

Actuel : « Décrivez la situation que vous souhaitez atteindre, non celle d'aujourd'hui. Chaque
situation suppose les précédentes : la dernière retenue vaut pour toutes celles qui la précèdent. »

Il dit deux choses, et elles n'ont pas le même sort.

**Recommandation : le garder sous la carte, amputé de sa première phrase.**

> Chaque situation suppose les précédentes : la dernière retenue vaut pour toutes celles qui la
> précèdent.

Trois raisons. La première phrase devient redondante si la variante A est retenue : le titre dit déjà
que la question ne porte pas sur aujourd'hui, et le redire dessous suggérerait que le titre n'a pas
suffi. La seconde phrase, en revanche, n'est dite nulle part ailleurs : la cumulativité se lit sur
les cartes de domaine dans le rendu — les rangs sous l'énoncé retenu s'affichent comme `reached` —
mais elle ne s'y explique pas, et c'est ici qu'elle décide de la réponse, puisque retenir le rang 4
engage à vouloir aussi le rang 2. La supprimer ferait perdre la seule information de lecture de la
carte. Enfin, un `hint` sous la carte est aussi le signal visuel qu'il ne s'agit pas d'un domaine :
aucune des vingt-huit cartes n'en porte. La ressemblance recherchée est celle du composant, pas celle
du statut — et cette différence-là mérite d'être visible.

---

## Le chemin en tête de carte

L'équivalent du chemin des domaines, qui n'affiche plus que la dimension depuis le retrait du bloc
(`useMaturityTool.js`, commentaire de `dim`) et, à droite, le rang d'exigence (`requiredLabel`).

- **Variante 1** — un seul segment : « Portée visée ». Rien à droite.
- **Variante 2** — deux segments : « Ancrage · Portée visée ». Rien à droite.

**Recommandation : 1.** Le chemin des domaines a été ramené à un seul segment précisément parce que
le second — le nom du bloc — répétait vingt-huit fois ce que la navigation disait déjà. « Ancrage »
est dans le même cas : le titre de l'écran est « Préparer l'ancrage » et la barre de phases le
marque. Deux segments rouvriraient ici le défaut qu'on vient de fermer là. Dans les deux variantes,
la place du `requiredLabel` reste vide : la portée n'est exigée à aucun profil, et y écrire quoi que
ce soit reviendrait à faire dire à l'outil ce que l'utilisateur doit viser.

---

## Deux déviations, déclarées

**1. « Une situation observable, pas une intention » (`ENONCES.md` §4) n'est pas respectée, et ne
peut pas l'être.** La règle interdit « l'entreprise souhaite », « est en mesure de », au motif qu'on
ne mesure pas ce qu'une organisation se propose de faire. Or c'est exactement ce que la carte de
portée demande. La contradiction est réelle et se résout ainsi : les énoncés restent au **présent de
l'indicatif**, comme ceux des domaines, et décrivent des situations tout aussi observables — ce qui
change est le moment depuis lequel on les regarde, et c'est le titre qui le fixe (variante A : « le
jour où… »). Aucun énoncé ne contient de verbe de volonté ni de modalité. C'est aussi ce qui permet
de réutiliser le composant sans le tordre : le picker fait choisir une situation, il ne gradue pas
une ambition. Si cette lecture n'est pas retenue, l'alternative est de passer les cinq énoncés au
futur antérieur, ce qui les allongerait d'environ deux mots chacun et briserait la parenté de forme
avec les 140 autres.

**2. Le défaut « Nous » n'est pas reproduit, délibérément.** 110 des 140 énoncés du questionnaire
commencent par « Nous » ; aucun des cinq énoncés ci-dessus ne le fait, et aucun n'emploie la première
personne. Deux motifs. Le premier est celui du §6 d'`ENONCES.md` : « une même tournure recopiée d'un
domaine à l'autre au point que le questionnaire paraît poser cinq fois la même question » — ajouter
un vingt-neuvième bloc en « Nous » aggraverait un défaut déjà connu. Le second est propre à cette
carte : ce qui doit se comparer d'un énoncé à l'autre est **ce que la transformation touche**, et
mettre cet objet en position de sujet le donne à lire au premier mot (voir « Les cinq d'affilée »).
Un « Nous » en tête l'enfouirait cinq fois de suite au même endroit.

Si la parenté de forme doit primer, voici les cinq mêmes énoncés en première personne. Ils sont plus
longs de zéro à quatre mots (+1, +4, +2, +0, +0) et perdent l'échelle lisible en tête de phrase.

| Rang | Variante en première personne | Mots |
|---|---|---|
| 1 | Nous employons l'IA dans une activité précise — un service, un poste, une tâche — et le reste de l'entreprise travaille comme avant. | 21 |
| 2 | Nous nous appuyons sur l'IA dans les processus qui font tourner l'entreprise, d'un service à l'autre, sans avoir changé ces processus. | 21 |
| 3 | Nous avons changé notre façon de travailler pour tirer parti de l'IA : des étapes disparaissent, d'autres changent de main, les rôles se déplacent. | 23 |
| 4 | Nous traitons autrement avec nos fournisseurs, nos donneurs d'ordre et nos clients : délais, échanges et engagements réciproques ne se règlent plus comme avant. | 23 |
| 5 | Nous ne faisons plus tout à fait le même métier : l'IA nous ouvre des prestations ou des marchés qui n'étaient pas les nôtres. | 23 |

---

## Ce qui est attendu pour lancer l'étape 2b

Quatre décisions, et rien d'autre : les cinq énoncés (ceux du tableau « Les cinq d'affilée », ceux de
la variante en première personne, ou réécrits) ; le titre (A, B, C ou autre) ; le sort du `hint` ; le
chemin (1 ou 2). L'intégration reprendra ces textes **au mot près**.
