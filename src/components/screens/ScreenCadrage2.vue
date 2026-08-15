<template>
  <aside class="callout">
    <p class="callout__title heading">NB</p>
    <p class="callout__text">
      Décrire son organisation AVANT l'évaluation change tout : l'outil s'en sert pour vous
      proposer d'abord les areas de compétence qui comptent le plus pour vous, et vous n'avez
      pas à trancher vous-même par où commencer.
    </p>
  </aside>
</template>

<script setup>
// Justification du formulaire de contexte. Section centrale du cadrage : elle
// précède immédiatement le formulaire, vers lequel la page invite à défiler.
// Le gabarit et la navigation appartiennent à la page qui l'accueille.
</script>

<style scoped>
.callout {
  max-width: 900px;
  padding: 24px 28px;
  border-left: 6px solid var(--color-text);
  background: var(--color-neutral-100);
}

.callout__title {
  margin: 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.callout__text {
  margin: 10px 0 0;
  font-size: 19px;
  line-height: 1.45;
  text-wrap: pretty;
}
</style>
