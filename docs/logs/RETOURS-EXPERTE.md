# Retours de l'experte métier — tableau d'arbitrage

Ce fichier tient, série par série, ce que l'experte qui a conduit les évaluations terrain a demandé,
ce qui en a été fait, et pourquoi lorsque la demande n'a pas été suivie. Il est la matière de
l'annexe 12 et du chapitre d'évaluation du rapport.

Une demande écartée y figure au même titre qu'une demande retenue : c'est la trace du fait qu'elle a
été entendue et instruite. Une évaluation dont on ne garderait que les suites favorables ne mesure
plus rien.

**Vocabulaire des décisions**

| Statut | Sens |
|---|---|
| Retenu | La demande est suivie telle qu'elle est formulée |
| Retenu, autrement | Le défaut relevé est réel, la correction diffère de celle qui était proposée |
| Sans objet | La pièce visée a disparu du parcours pour un autre motif ; la demande tombe avec elle |
| Différé | Reconnu, renvoyé à une itération ultérieure, avec le motif du report |
| Écarté | Non suivi, motif ci-contre |

---

## Série 1 — jeu de commentaires du 24.08.2026 (annexe 12)

Commentaires posés sur des captures du prototype, sur les attributs de contexte, le questionnaire,
la restitution et la liste d'actions.

| # | Demande | Objet visé | Décision | Suite donnée, et où elle se vérifie |
|---|---|---|---|---|
| 1.1 | « Expliquer *transverse* » | Attribut de périmètre, option « un programme transverse » | Retenu, autrement | Option retirée le 28.08.2026 plutôt qu'expliquée : calque de l'anglais *program*, qui ne nomme rien dans une PME et faisait hésiter entre le périmètre évalué et l'instance qui pilote. Le mot ne survit qu'au pilotage, où il a un sens — « Instance transverse (commission IA) ». `src/data/context-attributes.js` |
| 1.2 | « Remplacer *posture* par *environnement* » | Attribut de posture réglementaire | Sans objet | L'attribut entier a été retiré le 28.08.2026 (voir 1.3) ; le mot critiqué a disparu avec lui |
| 1.3 | « *Non régulé* est trompeur, il y a des obligations légales générales » | Options du même attribut | Retenu | Argument repris tel quel : une PME de l'arc jurassien relève de la nLPD, souvent du règlement européen sur l'IA par ses clients. Un attribut dont une option sur trois ne décrit aucune organisation réelle fausse le calcul au lieu de l'informer — il faisait en outre baisser l'appétit au risque retenu. Attribut supprimé, obligations générales tenues pour acquises. `src/data/context-attributes.js`, `src/domain/recommendation.js` |
| 1.4 | « Remplacer par *Solution prête à l'emploi* » | Préparation des données | Retenu | Les options se lisent « Partiellement prêtes à l'emploi » et « Prêtes à l'emploi », et la solution prête à l'emploi qui vient avec ses données est nommée dans la description du rang haut |
| 1.5 | « Expliquer *hybride* (par rapport à quoi) » | Approche de développement IA | Retenu, autrement | Option retirée le 30.08.2026 : l'attribut demande l'approche *principale*, et « hybride » est la réponse qu'on choisit pour ne pas trancher — toute PME s'y reconnaît, l'option attirait les réponses sans rien apprendre |
| 1.6 | « Remplacer *litteracie* par *connaissances* » | Attribut de littératie IA | Retenu | Libellé devenu « Connaissances IA du conseil et de la direction » |
| 1.7 | « Expliquer *coordination légère* » | Pilotage de l'adoption | Retenu | Chaque option porte désormais sa description : référent ou groupe de travail qui recense et diffuse des règles, sans mandat d'arbitrage ni budget propre |
| 1.8 | « Expliquer *qualitativement* ? » | Anticipation du ROI | Retenu | Description ajoutée à l'option : gains nommés et débattus avant le lancement, aucun chiffré ni rapporté au coût |
| 1.9 | « Re-traduire *cas d'affaires*, ce n'est pas clair » | Même attribut, rang haut | Retenu | Devenu « Rentabilité chiffrée en amont » |
| 1.10 | « Qui veut être *retardataire* ? Quelle différence entre majorité tardive et précoce ? » | Rythme d'adoption, catégories de Rogers (1962) | Retenu | Les noms de Rogers sont abandonnés, la question et l'axe restent. Motif écrit dans le code : une option humiliante n'est pas répondue sincèrement, elle est répondue un cran au-dessus, et l'attribut mesure alors la pudeur plutôt que le rythme. Libellés actuels : « Adopter ce qui a fait ses preuves » … « Ouvrir la voie » |
| 1.11 | « Remplacer *établissement* et *unité évaluée* par *organisation* » | Vocabulaire du cadrage et de la restitution | Retenu en partie | Les deux termes critiqués ont disparu de l'interface. Le mot retenu n'est pas « organisation » mais « périmètre » — le champ s'intitule « Périmètre de l'évaluation » —, parce que ce que la question demande est l'étendue de ce qu'on évalue, et non l'entité qui répond |
| 1.12 | « *Empreinte organisationnelle* ? Plutôt *territoire* ? » | Même écran | Sans objet | Le terme n'existe plus dans l'interface |
| 1.13 | « Remplacer la forme passive par de l'actif pour toutes ces phrases » | Énoncés du questionnaire | Retenu | La refonte en énoncés descriptifs (28.08.2026) les écrit à la première personne du pluriel et à l'actif : « Nous avons désigné qui retient un fournisseur d'IA… ». `src/data/statements.js` |
| 1.14 | « Je ne comprends pas comment gérer les indicateurs de maturité : beaucoup de questions différentes, des indicateurs similaires. Je séparerais les critères des indicateurs, en deux étapes » | Structure du questionnaire | Retenu, autrement | Le défaut est reconnu et cité dans l'entrée `DECISIONS.md` du 28.08.2026. La séparation en deux passages est explicitement écartée : elle règle la confusion en déplaçant la question au lieu de la supprimer. Les trois indicateurs transversaux sortent du parcours et deviennent la grille de dérivation des cinq énoncés de chaque domaine — 84 rangs hors calcul disparaissent au profit de 28 énoncés, et une sémantique de niveau uniforme qui rend la règle du minimum commensurable |
| 1.15 | « Qui est Venkatraman ? » | Nom d'échelle affiché sans source | Retenu | Deux réponses successives : le nom est d'abord retiré de la prose du parcours (15.08.2026), puis rétabli là où il s'explique — légende « Adapté de Venkatraman (1994) et Ozkaya et al. (2026) » sous l'escalier des paliers (31.08.2026), et tableau d'équivalences entre échelles dans l'écran d'information |
| 1.16 | « Comment la note peut-elle être plus haute que le total ? 3,1 / 3 » | Défaut d'affichage de la restitution | Retenu | La restitution ne rend plus de note globale : l'agrégation est un minimum par axe, jamais une moyenne compensatoire (30.07.2026). Le dépassement d'échelle est en outre couvert par un test — « la moyenne et le plancher d'une dimension ne dépassent jamais le haut de l'échelle », `tests/restitution.test.js` |
| 1.17 | « Cette liste est une série de suggestions ; certains items sont répétitifs, un 100 % ne sera jamais atteint et ce n'est pas le but. J'éviterais de faire croire que tout doit être fait » | Liste de pratiques cochables | Retenu | Les cases à cocher disparaissent avec l'unité de réponse (28.08.2026) : les 271 pratiques restent dans le modèle, sortent du questionnaire et de l'export. Il n'y a plus ni compteur, ni pourcentage, ni liste à épuiser |
| 1.18 | « Il manque un aspect de priorité, mais cela devrait être fait avec un.e spécialiste » | Domaines qui séparent de la cible | Différé | Le tri suit le rang déclencheur du modèle puis l'ordre du questionnaire, jamais le retard constaté : prioriser demanderait de peser coût, risque et dépendances, ce que l'outil ne mesure pas. L'experte le dit elle-même — l'exercice appelle un spécialiste. Renvoyé à une itération ultérieure |

**Liste de contrôle de la même série** — objet mesuré, cohérence modèle / outil, parcours,
ordonnancement des domaines, logique de calcul, terminologie : ce ne sont pas des demandes de
correction mais les points de validation de la direction de travail. Ils sont couverts par les
entrées `DECISIONS.md` du lot 0 ; « HELP pour les écrans de restitution » est ce que produisent les
tâches 3.5 à 3.8 du backlog.

---

## Série 2 — retour du 10.09.2026

Reçu après la seconde campagne d'évaluations terrain, sur une version jugée « beaucoup plus claire »
que celle de la première série.

| # | Demande | Objet visé | Décision | Motif |
|---|---|---|---|---|
| 2.1 | Reprendre dans le bandeau « Strategy – Stakeholders… » les titres employés dans les chapitres d'évaluation (« alignements, motivation… »), faute de quoi on ne sait pas s'il y a une différence pertinente ni où l'on se trouve | Barre de parcours du questionnaire | Écarté | Les quatre blocs sont une pièce du modèle, et la navigation est leur place dans l'outil ; la dimension et le domaine sont signalés dans la carte de chaque énoncé, où se prend la réponse. La difficulté relevée est une difficulté de lecture initiale — il faut lire un peu avant de répondre —, non un défaut de structure. Elle est traitée par le parcours plutôt que par les intitulés : voir 2.5 |
| 2.2 | Dire « non applicable » ou « ne s'applique pas » plutôt que « ne pas appliquer » | Sortie hors périmètre du sélecteur d'énoncés | Retenu | Appliqué le 10.09.2026. La forme verbale nommait le geste de celui qui répond, quand un interrupteur enclenché montre un état du domaine ; « non applicable » est le terme reçu des questionnaires. Nom accessible et comportement inchangés. Entrée `DECISIONS.md` du 10.09.2026 |
| 2.3 | « C'est utile de voir les modifications *live* du profil sur la droite […] mais on a l'impression de voir à quel niveau on se trouve au fil des réponses » | Bande des cinq profils | Écarté | C'est l'effet recherché, et d'autres retours de la même campagne l'ont apprécié : la bande montre le résultat en train de se constituer. Le risque de lecture — prendre une barre à demi remplie pour un palier presque acquis — est déjà tenu par la forme, que la décision du 18.08.2026 a réglée : seuil au trait fort, remplissage qui passe au noir en l'atteignant, et compte en clair « 8 sur 9 domaines attendus » plutôt qu'un pourcentage |
| 2.4 | « La partie information est très complète […] il faudrait une différence visuelle : 1 pour remplir le questionnaire, 2 pour comprendre le résultat, 3 pour comprendre la méthode. Tous les usagers devraient lire la partie 1, le reste est facultatif » | Écran d'information | Retenu, priorité haute | Les six sections sont empilées à plat, sans hiérarchie : rien ne dit ce qu'il faut lire avant de commencer. Découpage arrêté — 1 : le parcours, les trois mots (adoption, readiness, maturité d'adoption), la carte des domaines ; 2 : la construction des niveaux, le cadre de référence ; 3 : les équivalences entre échelles, l'attribution. Parties 2 et 3 repliées par défaut, ce qui matérialise le facultatif mieux qu'un intertitre. Tâche 5.2 du backlog |

**Deux chantiers nés de cette série sans y avoir été demandés.** Ils répondent par le parcours à la
friction que l'experte décrit en 2.1 — savoir où l'on en est — plutôt que par les intitulés :

- **5.3** — à la sélection d'un énoncé, défilement forcé vers le premier domaine encore vide, et non
  vers le suivant dans l'ordre : reprendre une réponse ne doit pas renvoyer à la fin de ce qui est
  déjà rempli.
- **5.4** — petite modale de confirmation sur « non applicable », qui rappelle ce que l'exclusion
  emporte — le domaine ne s'applique pas à l'organisation et sort de l'évaluation — puis, sur
  confirmation, enchaîne le saut de 5.3. Acquittement mémorisé dans la session : la modale ne
  reparaît pas vingt-huit fois.

Ordre d'exécution arrêté par l'auteur : 2.2 (fait) → 2.4 → 5.3 → 5.4.

---

## Réserves de traçabilité

Trois points à connaître avant de citer ce tableau dans le rapport.

1. **La date de la série 1.** Elle est prise du journal des décisions, qui parle du « jeu de
   commentaires du 24.08.2026 » ; l'horodatage du fichier `Annexe_12_Retours_experte.pptx` indique
   pour sa part le 22.05.2026, ce qui peut n'être qu'un artefact de synchronisation. À trancher
   contre le courriel de transmission avant de dater la pièce dans le rapport.
2. **Le rapprochement entre une demande de la série 1 et la décision qui la suit** est reconstitué à
   la relecture du dépôt — commentaires de code datés, entrées du journal des décisions — et non
   tiré d'une réponse formelle adressée à l'experte. Le rapprochement est solide là où le code porte
   la date et l'argument (1.1, 1.3, 1.5, 1.10, 1.14, 1.15) ; il est déduit ailleurs.
3. **Aucune de ces suites n'a été renvoyée à l'experte pour confirmation.** Le tableau dit ce que le
   travail a fait des demandes, pas ce que l'experte pense de ce qui en a été fait.
