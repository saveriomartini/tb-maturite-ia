<template>
  <div class="scope-map">
    <section v-for="block in blocks" :key="block.id" class="block">
      <h2 class="block__name heading">{{ block.name }}</h2>
      <div class="block__dimensions">
        <div v-for="dimension in block.dimensions" :key="dimension.id" class="dimension">
          <h3
            class="dimension__name"
            :class="{ 'is-off-scope': !dimension.inScope }"
            :style="dimension.inScope ? { background: dimension.color } : null"
          >
            {{ dimension.name }}
          </h3>
          <div class="dimension__areas">
            <p
              v-for="area in dimension.areas"
              :key="area.id"
              class="chip area"
              :class="{ 'is-off-scope': !area.inScope }"
              :style="area.inScope ? { '--chip-color': dimension.color } : null"
            >
              {{ area.label }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Carte du diagnostic : les areas évaluables du modèle, groupées par bloc et
// dimension. Elle ne montre rien d'autre — ni les areas encore à définir, ni ce
// qui a présidé à la sélection. Chaque area et chaque dimension portent leur
// `inScope` : la carte l'affiche, elle ne le calcule pas.
defineProps({
  blocks: { type: Array, required: true }
})
</script>

<style scoped>
.scope-map {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 2px solid var(--color-text);
}

.block {
  border-right: 2px solid var(--color-text);
  background: var(--color-bg);
}

.block:last-child {
  border-right: 0;
}

.block__name {
  margin: 0;
  padding: 10px 14px;
  border-bottom: 2px solid var(--color-text);
  font-size: 14px;
  letter-spacing: normal;
}

.block__dimensions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
}

.dimension {
  border: 1px solid var(--color-divider);
  background: var(--color-neutral-100);
}

.dimension__name {
  margin: 0;
  padding: 8px 10px;
  border-bottom: 1px solid var(--color-divider);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: normal;
}

/* Hors profil : la carte ne rétrécit pas — l'area garde sa place et son
   libellé — mais la dimension perd sa couleur et l'area son cadre plein. Ce
   qu'un profil ne met pas en jeu n'est pas retiré du modèle, seulement éteint. */
.dimension__name.is-off-scope {
  background: var(--color-neutral-200);
  color: var(--color-neutral-600);
}

.dimension__areas {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
}

/* Même étiquette que dans le cadre de référence — fond clair, bande de la
   dimension à gauche : une area en jeu se lit ici comme là-bas. */
.area {
  --chip-font-size: 9.5px;
  --chip-padding: 6px 7px;
  margin: 0;
  border-left: 4px solid var(--chip-color, var(--color-neutral-400));
}

.area.is-off-scope {
  border-color: var(--color-neutral-400);
  background: transparent;
  color: var(--color-neutral-600);
}

@media (max-width: 1200px) {
  .scope-map {
    grid-template-columns: 1fr 1fr;
  }

  .block:nth-child(2n) {
    border-right: 0;
  }

  .block:nth-child(-n + 2) {
    border-bottom: 2px solid var(--color-text);
  }
}

@media (max-width: 900px) {
  .scope-map {
    grid-template-columns: 1fr;
  }

  .block {
    border-right: 0;
  }

  .block:not(:last-child) {
    border-bottom: 2px solid var(--color-text);
  }

  /* à une colonne, les dimensions d'un bloc se déploient à nouveau en largeur */
  .block__dimensions {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    align-items: start;
  }
}
</style>
