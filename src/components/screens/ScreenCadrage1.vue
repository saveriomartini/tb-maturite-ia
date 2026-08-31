<template>
  <div class="framework">
    <p class="intro">
      Le modèle est proposé en 4 blocs-thématiques où ses 9 dimensions sont organisées ; à l'intérieur
      de chaque dimension on retrouve des domaines de capacité, pour un total de 28 domaines. Pour
      considérer un domaine de capacité acquis, il faut avoir satisfait tous les critères d'adoption
      correspondants. Le parcours d'évaluation est guidé par des pratiques à valider si mises en place
      par l'organisation.
    </p>

    <div class="hr hr--intro" />

    <FrameworkTable :blocks="vm.blocks" />

    <p class="lead">Ainsi que 5 profils de maturité d'adoption qui seront attribués à l'organisation :</p>

    <MaturityLevelList :levels="vm.levels" @toggle="emit('toggle-level', $event)" />

    <p class="note">Le niveau de maturité par bloc peut être calculé séparément dans cet outil.</p>
  </div>
</template>

<script setup>
// Présentation du modèle. Section de la page d'information : elle n'ouvre plus
// le parcours d'évaluation, où elle imposait une lecture avant toute question.
// Le gabarit et la navigation appartiennent désormais à la page qui l'accueille.
import FrameworkTable from '../FrameworkTable.vue'
import MaturityLevelList from '../MaturityLevelList.vue'

defineProps({
  vm: { type: Object, required: true }
})

const emit = defineEmits(['toggle-level'])
</script>

<style scoped>
/* Le chapô tient la largeur du tableau qu'il annonce, comme les autres textes
   de la page d'information : borné plus court, il laissait à sa droite un vide
   que rien ne venait occuper. */
.intro {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  text-wrap: pretty;
}

.hr--intro {
  margin: 24px 0;
}

.lead {
  margin: 28px 0 14px;
  font-size: 14px;
  line-height: 1.5;
}

.note {
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--color-neutral-700);
}
</style>
