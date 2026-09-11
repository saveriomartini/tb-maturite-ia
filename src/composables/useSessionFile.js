// Les deux seules opérations de navigateur que demande le fichier de session :
// écrire un texte dans un fichier téléchargé, lire le texte d'un fichier choisi.
//
// Elles vivent ici et non dans `domain/session-file.js` pour la raison qui vaut
// pour tout ce dossier : le domaine ne connaît ni `document`, ni `Blob`, ni
// `URL`, et c'est ce qui permet de le tester sans navigateur. Le partage entre
// les deux est net : le domaine décide ce que le fichier contient et comment il
// s'appelle, cette couche se contente de le poser sur le disque.
//
// — pourquoi une URL d'objet plutôt qu'un `data:` —
// L'URL d'objet ne recopie pas le contenu dans le document, elle le désigne. Le
// même jeton sert donc au clic programmé et au lien de repli affiché sous le
// bouton, sans que le JSON soit inscrit deux fois dans la page. Il est révoqué
// quand le bloc disparaît ou que l'état change : une URL d'objet retient son
// contenu en mémoire tant qu'elle vit.

export function textUrl(text) {
  if (typeof URL === 'undefined' || !URL.createObjectURL) return null
  return URL.createObjectURL(new Blob([text], { type: 'application/json' }))
}

export function revokeUrl(url) {
  if (url && typeof URL !== 'undefined' && URL.revokeObjectURL) URL.revokeObjectURL(url)
}

// Le téléchargement se déclenche par un lien détaché du document : c'est la
// seule forme qui porte un nom de fichier sans passer par un serveur.
export function saveUrl(url, name) {
  if (!url || typeof document === 'undefined') return
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function readFileText(file) {
  return file.text()
}
