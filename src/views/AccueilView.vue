<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store, modele, reinitialiser, chargerDemo } from '../store.js'
import { niveauCible } from '../scoring.js'

const router = useRouter()
const cible = computed(() => niveauCible(store.contexte))
const pret = computed(() => store.contexte.secteur && store.contexte.effectif && store.contexte.objectif)
const libelleCible = computed(() =>
  cible.value ? modele.echelle.niveaux.find((n) => n.rang === cible.value).libelle_fr : null
)
</script>

<template>
  <span class="eyebrow">Socle 0 — profil et intention</span>
  <h1>Diagnostic de maturite IA</h1>
  <p class="chapeau">PME manufacturieres de l'Arc jurassien — auto-evaluation guidee</p>

  <p>
    Cet instrument situe votre entreprise sur neuf axes d'adoption de l'intelligence artificielle.
    Le parcours n'est pas une echelle a monter : vous choisissez l'ordre des axes, et le resultat
    se lit par rapport au niveau que vous visez, non par rapport au niveau maximal.
  </p>

  <h2>Votre entreprise</h2>
  <label for="secteur">Secteur d'activite</label>
  <select id="secteur" v-model="store.contexte.secteur">
    <option value="">choisir</option>
    <option>Horlogerie</option>
    <option>Microtechnique</option>
    <option>Machines et equipements</option>
    <option>Autre industrie manufacturiere</option>
  </select>

  <label for="effectif">Effectif</label>
  <select id="effectif" v-model="store.contexte.effectif">
    <option value="">choisir</option>
    <option>10-49</option>
    <option>50-99</option>
  </select>

  <label for="fonction">Votre fonction</label>
  <select id="fonction" v-model="store.contexte.fonction">
    <option value="">choisir</option>
    <option>Direction</option>
    <option>Production / operations</option>
    <option>Informatique / systemes d'information</option>
  </select>

  <h2>Votre intention</h2>
  <p class="chapeau">
    Ces trois reponses ne sont pas notees. Elles determinent le niveau que vous visez,
    qui sert de reference a la lecture du resultat.
  </p>

  <label for="objectif">Ce que vous attendez de l'IA</label>
  <select id="objectif" v-model="store.contexte.objectif">
    <option value="">choisir</option>
    <option value="exploration">Comprendre de quoi il s'agit</option>
    <option value="productivite_interne">Gagner en productivite interne</option>
    <option value="offre_produit">Integrer l'IA dans nos produits ou services</option>
  </select>

  <label for="risque">Votre tolerance au risque</label>
  <select id="risque" v-model="store.contexte.risque">
    <option value="">choisir</option>
    <option value="faible">Faible</option>
    <option value="moyen">Moyenne</option>
    <option value="eleve">Elevee</option>
  </select>

  <label for="horizon">Votre horizon d'investissement</label>
  <select id="horizon" v-model="store.contexte.horizon">
    <option value="">choisir</option>
    <option value="court">Un an ou moins</option>
    <option value="long">Plus de trois ans</option>
  </select>

  <p v-if="cible" class="note">
    Niveau vise : <strong>{{ libelleCible }}</strong> (niveau {{ cible }} sur 5).
    Rester en dessous du niveau 5 sur un axe peut etre une decision deliberee, non une carence.
  </p>

  <p style="margin-top: 1.75rem">
    <button :disabled="!pret" @click="router.push('/parcours')">Commencer le diagnostic</button>
    <button class="bouton-plat" style="margin-left: 0.6rem" @click="chargerDemo(); router.push('/restitution')">
      Voir un exemple de restitution
    </button>
    <button class="bouton-plat" style="margin-left: 0.6rem" @click="reinitialiser">Effacer mes reponses</button>
  </p>

  <p class="note">
    A decider : le consentement eclaire (nLPD) doit-il figurer ici, avant toute saisie,
    ou seulement lorsque des donnees seraient transmises ? En v{{ modele._meta.version }},
    rien n'est transmis.
  </p>
</template>
