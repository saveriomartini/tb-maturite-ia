# Guide de rédaction des énoncés descriptifs

Comment sont écrits les cent quarante énoncés du questionnaire — cinq par domaine de capacité, vingt-huit
domaines — et d'où chacun tire son niveau.

Structure d'accueil : [`src/data/statements.js`](../src/data/statements.js).
Grille de dérivation : [`src/data/maturity-indicators.js`](../src/data/maturity-indicators.js).
Contrôle : `npm run check:model`, branché sur `npm run lint`.

## 1. Pourquoi ce document

L'unité de réponse du questionnaire est un énoncé descriptif choisi parmi cinq : on demande à
l'entreprise laquelle des cinq situations la décrit, et non de cocher ce qu'elle a fait. C'est la
méthode annoncée dans [`PERIMETRE.md`](PERIMETRE.md) depuis l'origine et fondée sur Jeanneret Medina
et al. (2024) ; elle remplace la saisie par critère d'adoption, qui rendait un verdict binaire là où
le modèle décrit cinq situations distinctes.

Cette méthode déplace le problème plutôt qu'elle ne le résout. Cent quarante phrases doivent être
écrites, et rien dans le référentiel de base ne les contient : Ozkaya et al. (2026) donnent les
critères comme conditions d'acquisition, ils ne les graduent pas. Écrites au jugé, ces phrases
seraient la partie la plus visible du travail et la moins défendable — un jury qui demande « d'où
viennent vos énoncés ? » n'a pas à se contenter de « je les ai rédigés ».

Le présent guide existe pour que la réponse à cette question soit vérifiable. Il pose une grille
issue de la source, une procédure pour en tirer un énoncé, et un contrôle pour s'assurer que
l'énoncé obtenu dit bien ce que la grille exigeait. La rédaction devient alors une **dérivation
traçable** : chaque phrase se rattache à une ligne de la source, et le rattachement se relit sans
l'auteur. Ce que le guide ne fait pas, il faut le dire aussi — il ne rend pas la rédaction
automatique, il rend le résultat discutable.

Ce document est de la méthode. Les énoncés eux-mêmes sont du contenu d'auteur, rédigés par l'auteur
du travail, conformément à la déclaration d'usage de l'intelligence artificielle du §5 du
[`README`](../README.md). Aucun énoncé de questionnaire ne figure ici, pas même à titre d'exemple :
les emplacements prévus restent vides et signalés comme tels.

## 2. La grille de dérivation

La source ne décrit pas ce qu'est un niveau domaine par domaine. Elle pose une seule fois, au §5
(p. 82-83), trois indicateurs transversaux — Responsabilité, Planification, Ressources — et, pour
chacun, cinq lignes qui disent ce qu'un rang attend quelle que soit la capacité considérée. C'est
cette grille qui fournit la sémantique de niveau du modèle (`DECISIONS.md`, entrée du 30.07.2026).
Les trois premières colonnes ci-dessous reprennent littéralement les énoncés traduits dans
[`maturity-indicators.js`](../src/data/maturity-indicators.js) ; la quatrième est la synthèse
retenue pour chaque rang.

| Rang | Responsabilité | Planification | Ressources | Idée commune du niveau |
|---|---|---|---|---|
| 1 | Personne n’en porte formellement la responsabilité. | Rien n’est planifié de façon régulière. | Les moyens sont alloués au coup par coup. | **Absence** — rien d'assigné, rien de planifié, rien d'alloué régulièrement |
| 2 | Des rôles sont désignés pour atteindre les critères du domaine. | Un plan existe pour atteindre les critères et nomme les parties prenantes. | Le processus budgétaire alloue des moyens suffisants au domaine. | **Existence désignée** — des rôles, un plan, un budget pour ce domaine |
| 3 | Des objectifs et des indicateurs (KPI, ROI) sont définis et rapportés à la direction. | Le plan est actualisé périodiquement au vu des résultats mesurés. | Les moyens sont alloués au vu de la performance mesurée. | **Boucle de mesure** — ce qui est mesuré change la conduite |
| 4 | Les processus sont mesurés et pilotés de la même façon dans tous les services. | Les plans et politiques définissent des processus communs, que chaque service adapte. | Les moyens sont alloués et gérés de la même façon dans tous les services. | **Reproductibilité au-delà du premier cas** — hors de l'équipe qui a lancé |
| 5 | Les améliorations des processus sont choisies et menées selon la stratégie long terme. | La planification anticipe les évolutions possibles : réglementaires, sociétales, technologiques. | Les moyens servent la stratégie long terme, quels que soient les scénarios d’avenir. | **Anticipation** — les choix servent une stratégie et des scénarios à venir |

La lecture en lignes donne la progression, et c'est celle qu'on attend. La lecture en **colonnes**
apprend davantage : les trois indicateurs ne disent pas trois choses différentes, ils disent la même
chose dans trois registres. Au rang 2, désigner un rôle, écrire un plan et inscrire un budget sont
trois manières de constater qu'une organisation a cessé d'improviser sur ce domaine — qui en répond,
comment c'est réglé, avec quels moyens. Au rang 3, rapporter des indicateurs à la direction,
actualiser le plan au vu des résultats et allouer selon la performance mesurée sont trois faces
d'une seule boucle. La colonne de synthèse n'est donc pas un résumé approximatif des trois autres :
c'est ce qu'elles ont en commun une fois retirés les registres.

Deux conséquences en découlent, et elles portent le reste du document.

La première est que **la sémantique de niveau ne dépend pas du domaine**. Être au rang 3 en
gouvernance des données et au rang 3 en développement des compétences, c'est se trouver dans la même
situation — une boucle de mesure qui infléchit la conduite — sur deux objets différents. Le rédacteur
n'a donc pas à inventer ce qu'un niveau signifie pour son domaine : il l'instancie.

La seconde est que cette uniformité est **la condition de la règle du minimum**. Le modèle agrège en
prenant le maillon faible, sans compensation et sans score global (`DECISIONS.md`, entrée du
30.07.2026). Prendre un minimum suppose que les valeurs comparées soient sur la même échelle. Si
chaque domaine avait reçu sa propre gradation, construite indépendamment, le minimum aurait comparé
des unités différentes et le résultat n'aurait rien voulu dire. La grille transversale est ce qui
rend les vingt-huit domaines commensurables ; s'en écarter dans la rédaction, c'est saper la règle
d'agrégation qui est le cœur défendable du travail.

## 3. La méthode, en quatre gestes

Chaque énoncé s'obtient par la même suite d'opérations. Elle est courte, et c'est voulu : ce qui
demande du temps est le choix des mots, pas la décision de ce qu'il faut dire.

**Premier geste — fixer l'idée du niveau.** On part de la colonne de synthèse, jamais de
l'impression qu'on a du domaine. Pour le rang 4, l'idée est la reproductibilité au-delà du premier
cas ; ce n'est ni « c'est bien fait », ni « c'est mature », ni « il y en a beaucoup ». Tant que
l'idée n'est pas nommée dans ces termes, on n'écrit pas.

**Deuxième geste — choisir le registre qui discrimine pour ce domaine.** Les trois registres disent
la même chose, mais l'un des trois se voit mieux que les autres selon l'objet. L'heuristique est la
suivante : gouvernance, conformité, IA responsable relèvent de la **Responsabilité** — ce qui s'y
observe est qui répond de quoi ; cycle de vie des données, qualité, tests relèvent de la
**Planification** — ce qui s'y observe est la régularité d'un dispositif ; compétences, architecture,
infrastructure relèvent des **Ressources** — ce qui s'y observe est ce qui est mis à disposition.
L'heuristique oriente, elle ne tranche pas : lorsque deux registres se valent, on retient celui dont
la manifestation est la plus facile à constater sans enquête. Le registre peut changer d'un rang à
l'autre à l'intérieur d'un même domaine, si un autre discrimine mieux à ce rang-là ; c'est admis, à
condition que la progression reste lisible d'un rang au suivant.

**Troisième geste — écrire la manifestation observable.** L'énoncé nomme ce que le registre retenu
donne à voir, à ce niveau, dans le vocabulaire du domaine. Deux fautes sont à éviter, symétriques.
Recopier la phrase de la grille en substituant le nom du domaine produit une phrase juste et
inutilisable : elle décrit un indicateur de maturité, pas une situation d'entreprise. Empiler les
trois registres dans la même phrase produit une phrase longue, à trois conditions, dont on ne sait
plus laquelle est fausse quand l'entreprise hésite. Un seul registre est nommé ; les deux autres
restent implicites, et ils le sont légitimement puisque la colonne montre qu'ils disent la même
chose.

**Quatrième geste — vérifier par le test de fausseté.** On retourne l'énoncé et on demande : cette
phrase peut-elle être vraie alors que l'idée du niveau est fausse ? Si une entreprise peut
reconnaître la situation décrite sans être au niveau visé, l'énoncé décrit autre chose et doit être
réécrit. Ce test attrape en particulier les énoncés de rang 4 qui ne parlent que de volume — plusieurs
cas d'usage peuvent coexister sans que rien ne se reproduise — et les énoncés de rang 3 qui
mentionnent une mesure sans dire qu'elle infléchit une décision.

## 4. Les contraintes de forme

Elles sont peu nombreuses et ne se négocient pas, parce qu'elles conditionnent la lisibilité en
séance.

**Une phrase, vingt-cinq mots au plus.** Les cinq énoncés d'un domaine sont lus d'affilée, à l'écran,
avant qu'un choix soit fait : au-delà, la comparaison entre rangs voisins devient impossible.

**Présent de l'indicatif, forme active.** L'énoncé décrit ce que l'entreprise fait ou ce qui s'y
passe, avec un sujet qui agit. Le passif était la forme dominante des critères traduits ; l'experte
a explicitement demandé d'en sortir dans son jeu de commentaires du 24.08.2026, et la refonte en
énoncés adopte la forme active.

**Une situation observable, pas une intention ni une capacité.** « L'entreprise souhaite », « est en
mesure de », « pourrait » n'ont pas leur place : on ne mesure pas ce que l'organisation se propose de
faire, on lui demande de reconnaître ce qui est.

**Tranchable par un dirigeant de PME, sans consultant ni audit.** Le critère est opératoire : si
répondre suppose d'aller vérifier une pièce, d'interroger un service ou de lancer une enquête
interne, l'énoncé est mal écrit. Celui qui répond doit pouvoir dire oui ou non de mémoire, en séance.

**Registre France Num.** Français professionnel de comité de direction, le même que le reste du
modèle : anglicismes d'usage conservés lorsqu'ils sont plus clairs que leur traduction (KPI, ROI,
SLA, POC, sandbox), jargon de référentiel écarté. « L'entreprise » désigne l'unité évaluée, qui est
nommée une fois en tête de la restitution et de l'export plutôt que rappelée dans chaque phrase
(`DECISIONS.md`, entrée du 18.08.2026 sur l'unité évaluée).

## 5. Deux difficultés à traiter explicitement

Elles sont connues, elles n'ont pas de solution élégante, et les ignorer se verrait dans le
résultat.

### Le niveau 4 parle de services que la cible n'a pas

Les trois cellules du rang 4 disent « dans tous les services ». Dans une PME de douze personnes, la
formule ne veut rien dire : il n'y a pas de services, et une entreprise qui répondrait honnêtement
ne pourrait jamais atteindre ce rang. Le fichier `maturity-indicators.js` documente déjà ce
raccourci — `organizational unit sub-components` y est rendu par « les services » — mais il documente
une traduction, il ne résout pas le fond.

Le fond est que l'idée du rang 4 n'est pas une géographie de départements : c'est la
**reproductibilité au-delà du premier cas**. Ce qui distingue le rang 4 du rang 3 est qu'un dispositif
qui marchait dans le contexte où il a été inventé continue de marcher ailleurs, sans son inventeur.
Le rédacteur rend donc cette idée par « d'un cas d'usage à l'autre », « hors de l'équipe qui l'a
lancé », « quel que soit le projet », et jamais par une répartition en départements. Cette
formulation est en outre exacte dans une grande organisation, alors que l'inverse ne l'est pas : la
reproductibilité est ce que « dans tous les services » voulait dire, et non le contraire.

### Le niveau 1 décrit l'absence

Les trois cellules du rang 1 décrivent ce qui n'existe pas : personne n'en répond, rien n'est
planifié, les moyens vont au coup par coup. La conséquence est mécanique et il faut la regarder en
face — **tout domaine renseigné est au moins au niveau 1**. Le premier palier n'est plus une
acquisition, c'est un acquis par défaut, obtenu par quiconque répond au questionnaire.

Cela ne pose pas de problème à la mesure, qui gradue de 1 à 5 et lit correctement un domaine au
plus bas. Cela en pose un au profil « Préparation » ([`src/data/preparation.js`](../src/data/preparation.js)),
ajouté sous le premier profil du modèle pour accuser réception d'un premier effort. Son seuil est
aujourd'hui de trois critères d'adoption validés (`PREPARATION_THRESHOLD` dans
[`src/domain/scoring.js`](../src/domain/scoring.js)) : il compte une unité de mesure qui disparaît
avec la refonte en énoncés, et il ne peut pas être transposé tel quel à une échelle où répondre
suffit à valoir un niveau.

**La décision n'est pas prise**, et ce document ne la prend pas. Trois pistes restent ouvertes, à
trancher avant la rédaction des blocs suivants parce que la troisième changerait ce qu'un énoncé de
rang 1 doit dire :

- **Préparation définie sur le nombre de domaines encore au niveau 1** : le profil décrit alors une
  organisation qui a commencé à sortir de l'absence sans que le premier palier soit acquis. Cohérent
  avec la grille, au prix d'un seuil à justifier de nouveau ;
- **Préparation abandonnée** : le niveau 1 du modèle joue déjà le rôle de point d'appui que la
  Préparation avait été créée pour donner. Simple, mais l'entrée du 15.08.2026 rappelle pourquoi
  elle avait été ajoutée — le premier retour de l'outil ne doit pas être un constat de carence ;
- **Niveau 1 décrivant l'exploration naissante plutôt que l'absence** : le rang cesse d'être gratuit
  et redevient une situation reconnaissable. C'est la piste la plus coûteuse, parce qu'elle écarte
  les cent quarante énoncés de rang 1 de la ligne 1 de la grille, et que cet écart devrait alors être
  déclaré et défendu comme tel.

Tant que la question n'est pas tranchée, les énoncés de rang 1 suivent la grille et décrivent
l'absence.

## 6. Le contrôle de relecture

Le contrôle est unique et il est mécanique : **un énoncé de rang _n_ qui ne dit rien de ce que la
ligne _n_ de la grille exige est à réécrire.** On ne demande pas si la phrase est bien tournée, ni si
elle décrit une situation plausible — on demande ce qu'elle a retenu de sa ligne. Si la réponse est
« rien d'identifiable », la phrase décrit un autre niveau, ou aucun.

Ce contrôle se fait **bloc par bloc, et non énoncé par énoncé**. Relu isolément, un énoncé paraît
presque toujours acceptable ; ce qui se voit en série, ce sont les défauts qui comptent — deux rangs
voisins qu'on ne sait pas départager, un domaine dont l'échelle progresse plus vite que celle du
domaine d'à côté, une même tournure recopiée d'un domaine à l'autre au point que le questionnaire
paraît poser cinq fois la même question. La série est aussi le seul endroit où se constate la
longueur relative des cinq énoncés d'un domaine, qui doit rester comparable : un rang beaucoup plus
détaillé que les autres attire les réponses.

Deux commandes accompagnent la rédaction, et elles ne contrôlent que la structure :

- `npm run check:model` vérifie que chacun des vingt-huit domaines porte cinq énoncés numérotés de 1
  à 5, qu'aucune clé ne désigne un domaine inexistant, et affiche l'avancement. Un énoncé vide n'y
  est pas une erreur : c'est de la rédaction qui n'a pas eu lieu. C'est ce mode qui est branché sur
  `npm run lint`, donc sur l'intégration continue ;
- `npm run check:model:strict` échoue en plus sur tout énoncé vide. C'est le mode que la livraison
  doit passer : le jour où il sort en 0, les cent quarante énoncés sont écrits.

Ni l'un ni l'autre ne dit quoi que ce soit de la qualité d'un énoncé. Le contrôle de contenu est
celui du premier paragraphe, et il se fait à la lecture.

## 7. Exemple travaillé — A1, à compléter

Le domaine A1, *Élaboration de la stratégie IA*, est exigé au palier 2. La source le définit comme
« la capacité de l'entreprise à définir comment l'IA soutiendra les résultats métier visés, au
travers d'une stratégie IA réaliste, évolutive et exécutable », et lui associe trois critères
d'adoption : un périmètre d'adoption cohérent avec la mission et les objectifs métier, une stratégie
d'adoption établie pour ce périmètre, et une évaluation régulière de l'avancement au regard de ces
objectifs.

Deuxième geste, appliqué une fois pour le domaine : A1 porte sur la conduite d'une stratégie et sur
les instances qui en répondent, ce que l'heuristique du §3 range du côté de la **Responsabilité**.
C'est ce registre qui est retenu pour les cinq rangs ci-dessous ; les trois critères ci-dessus
fournissent le vocabulaire dans lequel l'écrire.

Le tableau est un **gabarit**, pas une proposition. Les cellules de grille sont celles de la colonne
Responsabilité, reprises littéralement ; la dernière colonne reste vide et sera remplie par l'auteur.

| Rang | Idée du niveau | Cellule de grille instanciée (Responsabilité) | Énoncé A1 |
|---|---|---|---|
| 1 | Absence | Personne n’en porte formellement la responsabilité. | *(à rédiger — vide)* |
| 2 | Existence désignée | Des rôles sont désignés pour atteindre les critères du domaine. | *(à rédiger — vide)* |
| 3 | Boucle de mesure | Des objectifs et des indicateurs (KPI, ROI) sont définis et rapportés à la direction. | *(à rédiger — vide)* |
| 4 | Reproductibilité au-delà du premier cas | Les processus sont mesurés et pilotés de la même façon dans tous les services. | *(à rédiger — vide)* |
| 5 | Anticipation | Les améliorations des processus sont choisies et menées selon la stratégie long terme. | *(à rédiger — vide)* |

Trois points d'attention pour ce domaine en particulier, à relire une fois les cinq lignes écrites.
Le rang 4 ne doit pas être rendu par une diffusion de la stratégie dans des départements, mais par le
fait qu'elle tient au-delà du premier cas d'usage qui l'a suscitée (§5). Les rangs 2 et 3 se
départagent sur la boucle et non sur le document : l'existence d'une stratégie écrite relève du rang
2, son réexamen au vu de ce qui a été mesuré relève du rang 3. Enfin, A1 côtoie A4 *Planification
prospective*, exigé au palier 5 : le rang 5 de A1 doit rester une manière de conduire la stratégie
existante, faute de quoi les deux domaines mesurent la même chose.

## 8. Feuille de route de rédaction

Les vingt-huit domaines dans l'ordre de [`model-data.json`](../src/data/model-data.json), qui est
celui du questionnaire. Le palier d'exigence est le rang à partir duquel le modèle requiert le
domaine ; il n'intervient pas dans la rédaction, mais il indique quels domaines pèsent sur les
premiers paliers et méritent d'être écrits en premier. La colonne « registre retenu » est à remplir
par l'auteur au moment du deuxième geste, et vaut trace de la décision.

| Domaine | Nom | Palier d'exigence | Bloc | Registre retenu |
|---|---|---|---|---|
| A1 | Élaboration de la stratégie IA | 2 | B1 · Strategy |  |
| A2 | Développement des partenariats IA | 3 | B1 · Strategy |  |
| A3 | Ajustement de la structure organisationnelle | 3 | B1 · Strategy |  |
| A4 | Planification prospective | 5 | B1 · Strategy |  |
| A5 | Gestion du budget et des investissements IA | 2 | B1 · Strategy |  |
| A6 | Pressions et motivations externes | 1 | B1 · Strategy |  |
| A7 | Adéquation et proportionnalité de la solution (right-sizing) | 2 | B1 · Strategy |  |
| A8 | Développement des compétences IA des collaborateurs | 1 | B2 · Stakeholders |  |
| A9 | Évolution de la culture d'entreprise | 3 | B2 · Stakeholders |  |
| A10 | Gestion des risques | 2 | B2 · Stakeholders |  |
| A11 | Politiques et conformité | 2 | B2 · Stakeholders |  |
| A12 | IA responsable | 2 | B2 · Stakeholders |  |
| A13 | Expérimentation | 1 | B3 · Business |  |
| A14 | Innovation des processus métier | 3 | B3 · Business |  |
| A15 | Automatisation à supervision humaine | 3 | B3 · Business |  |
| A16 | Mesure et analyse | 3 | B3 · Business |  |
| A17 | Gestion du cycle de vie des données | 2 | B3 · Business |  |
| A18 | Assurance qualité des données | 2 | B3 · Business |  |
| A19 | Architecture IA | 2 | B4 · Technology |  |
| A20 | Tests et évaluation | 2 | B4 · Technology |  |
| A21 | Intégration aux systèmes existants | 3 | B4 · Technology |  |
| A22 | Transparence et explicabilité | 3 | B4 · Technology |  |
| A23 | Gestion des modèles IA | 2 | B4 · Technology |  |
| A24 | Sécurité des modèles et agents IA | 2 | B4 · Technology |  |
| A25 | Suivi | 3 | B4 · Technology |  |
| A26 | Infrastructure technologique | 2 | B4 · Technology |  |
| A27 | Gestion de la chaîne d'approvisionnement | 3 | B4 · Technology |  |
| A28 | Déploiement à l'échelle | 4 | B4 · Technology |  |

Les quatre blocs se rédigent dans cet ordre, et la relecture du §6 se fait à la fin de chacun plutôt
qu'une fois les cent quarante énoncés écrits : les défauts d'échelle repérés sur Strategy évitent
d'être reproduits vingt et une fois.
