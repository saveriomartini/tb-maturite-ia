"""Genere le tableau de couverture inter-modeles pour le rapport.

Usage : python scripts/gen_couverture.py > docs/couverture.md

Le tableau est derive du modele, jamais saisi a la main : il ne peut pas
se desynchroniser de la matrice.
"""
import json
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
modele = json.loads((RACINE / "src" / "data" / "modele.json").read_text(encoding="utf-8"))
sources = [s["id"] for s in modele["modeles_sources"]]

print("| Dimension | DP | Critere | Role | " + " | ".join(sources) + " |")
print("|---|---|---|---|" + "---|" * len(sources))
for d in modele["dimensions"]:
    for ca in d["capability_areas"]:
        for r in ca["rattachements"]:
            deg = r["degres_par_modele"]
            cellules = [str(deg.get(s, "")) for s in sources]
            print(f"| {d['nom_fr']} | {ca['id']} | {r['critere']} | {r['role']} | " + " | ".join(cellules) + " |")

faibles = [
    (d["nom_fr"], ca["id"])
    for d in modele["dimensions"]
    for ca in d["capability_areas"]
    if not any(v == 2 for r in ca["rattachements"] for v in r["degres_par_modele"].values())
]
if faibles:
    print("\nDomaines sans aucune corroboration de degre 2 :")
    for dim, ca in faibles:
        print(f"- {ca} ({dim})")
