# Périmètre

## Dans le TB

Modèle à neuf dimensions et vingt-huit domaines de capacité, documenté et justifié par la matrice de
comparaison de six modèles. Énoncés descriptifs à cinq niveaux. Parcours navigable et restitution
individuelle. Évaluation formative par audit d'experts. Test pilote en PME sous réserve de disponibilité.

Les vingt-huit domaines se décomposent en vingt-cinq repris d'Ozkaya et al. (2026) et traduits, et
trois rédigés par l'auteur — A5, A6, A7, la dimension *Motivations et Justification de l'adoption*,
qui porte les trois critères consolidés absents du référentiel de base. Tous les vingt-huit sont
mesurés : depuis le 18.08.2026, aucun domaine du modèle n'est déclaré sans critères ni pratiques.

## Ce que recouvre la revendication « PME de l'arc jurassien »

L'objectif 1 ratifié annonce un modèle *applicable aux PME de l'arc jurassien*. Ce que cette
formule engage, et ce qu'elle n'engage pas, se déclare ici plutôt que de se deviner.

**Ce qui rend le modèle applicable à une PME** tient dans la neuvième dimension, et nulle part
ailleurs : le référentiel de base est écrit pour des organisations qui disposent d'équipes dédiées.
A7 (*right-sizing*) écarte explicitement les solutions qui supposent une taille, une équipe ou une
infrastructure dont l'entreprise ne dispose pas, et fait de l'examen des réponses sans IA une
pratique évaluable. A5 gradue l'engagement financier par paliers révisables et fait de l'arrêt une
issue consignée au même titre que la poursuite. A6 impose de distinguer un besoin propre d'une
pression subie. Ces trois domaines sont la condition d'applicabilité, pas un complément.

**Ce qui ancre le modèle dans l'arc jurassien** tient en trois points, et ils sont modestes :

- la **dépendance au donneur d'ordre** est écrite comme pratique évaluable — recensée en A6,
  opposable au choix de solution en A7 par les engagements de confidentialité et le secret de
  fabrication. C'est la structure du tissu sous-traitant horloger et microtechnique de la région,
  et c'est ce qui distingue une PME d'ici d'une PME de services comparable en taille ;
- le **seuil de N minimal** inscrit dans le modèle est dimensionné sur ce tissu : trois PME
  horlogères de 10 à 49 employés suffisent à réidentifier une entreprise dans l'Arc jurassien ;
- l'**échantillon du test pilote** est régional.

**Ce qui n'est pas revendiqué.** Aucune donnée régionale ne fonde le modèle. Il n'existe ni
étalonnage, ni benchmark, ni distribution de référence pour l'arc jurassien — et il ne pourrait pas
en exister sans la collecte inter-PME, elle-même hors périmètre (voir plus bas). Le modèle n'est pas
*dérivé* d'un échantillon régional : il est conçu pour des PME, ancré sur le trait structurant du
tissu régional, et évalué dans la région. Toute lecture plus forte de l'objectif 1 dépasse ce qui
est livré, et doit être écartée dans le rapport plutôt que laissée ouverte.

## Hors TB, par instruction de la direction de travail

Couche prescriptive : aucun plan d'action généré, aucune recommandation priorisée, aucune feuille de
route par dimension. Frontière à surveiller dans la formulation des énoncés — informer sur ce
qu'implique l'adoption reste descriptif, dire à une entreprise donnée ce qu'elle devrait faire ne l'est plus.

## Hors TB, par décision d'architecture

Backend, persistance serveur, authentification. Statistiques comparatives inter-PME.

L'objectif 3 ratifié mentionne des statistiques descriptives et comparatives. L'exigence retenue est
d'extensibilité, non de fonctionnalité : l'outil doit permettre la collecte et l'exposition
ultérieures sans refonte. Elle se traduit par un contrat de données versionné, une couture de
persistance dont seule l'implémentation locale est livrée, et un seuil de N minimal inscrit dans le
modèle. Trois PME horlogères de 10 à 49 employés suffisent à réidentifier une entreprise dans
l'Arc jurassien : le seuil est une règle du modèle, pas un paramètre d'affichage.

## Dans le périmètre de mesure : la dimension MLOps

La dimension Production et gestion de modèles (MLOps) — A23, A24, A25 — est **mesurée**. Ses trois
domaines portent huit critères d'adoption et vingt-six pratiques, traduits du référentiel de base
comme les autres, et le questionnaire les présente dès que le profil visé les met en jeu.

L'objection qui la tenait naguère hors mesure reste juste : une PME qui consomme des services d'IA
sans développer de modèles n'a pas de pipeline à évaluer, et l'interroger produirait un niveau bas
dénué de sens. Mais l'exclure par dimension entière était une réponse trop grossière — une PME qui
ne développe rien exploite quand même des modèles fournis, dont elle doit connaître la provenance,
la sécurité et le comportement en service.

Le traitement correct est un **scoping par pratiques** : l'attribut de contexte *approche de
développement IA* (`devApproach`) est déjà collecté au cadrage, et n'entre volontairement dans aucun
calcul en attendant. C'est un chantier ouvert, pas un acquis, et il est hors du périmètre du présent
travail. Jusqu'à sa réalisation, MLOps est évalué pour tous.
