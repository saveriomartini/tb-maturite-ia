// Défilement vers un point d'arrivée de la page.
//
// Une page qui empile trois phases et vingt-huit domaines a besoin qu'on puisse
// y atterrir ailleurs qu'en haut. Le geste tient en un appel de navigateur, et
// tout ce qu'il y a à décider est la seule chose que le CSS ne peut pas trancher
// seul : faut-il animer. La réponse est une préférence système, que seul le
// navigateur connaît — d'où ce détour par le JavaScript.
//
// Ce qui n'est pas ici, et n'y sera pas : le retrait sous la barre collée en
// haut de page. Il vit dans la feuille de style, en `scroll-margin-top` sur
// chaque cible, comme le fait déjà ScreenCadrage3. Le calculer ici reviendrait à
// observer un gabarit en JavaScript, ce que la décision du 12.08.2026 écarte.
//
// Le module ne porte aucun état réactif : il est rangé avec les composables
// parce qu'il enveloppe une interface du navigateur, comme useSessionStorage, et
// non parce qu'il en dérive quoi que ce soit.

export function scrollToElement(element) {
  if (!element || typeof window === 'undefined') return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

// Une ancre absente n'est pas une erreur : la section peut n'être pas rendue —
// un rendu côté serveur, un écran qui vient de changer. On ne défile pas, et
// c'est tout.
export function scrollToAnchor(anchor) {
  if (!anchor || typeof document === 'undefined') return
  scrollToElement(document.getElementById(anchor))
}
