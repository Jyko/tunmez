# Documentation

Documentation technique et utilisateur, licence.

- Les documents techniques (`project/`) sont écrits en français.
- Les user stories (`project/user-stories/`) sont écrites en français naturel, dans un format très léger ou libre, pour qu'une personne puisse en écrire et en commiter une sans passer par un agent.
  - Une story par besoin, petite : une opération métier chacune (créer, renommer, supprimer…), pour qu'elle soit facile à exprimer et à relire.
  - Les fichiers sont numérotés dans l'ordre d'écriture : `NNNN_titre.md`, par exemple `0001_choisir-la-langue.md`.
  - Une story ne contient ni choix technique, ni choix d'interface déjà couvert par les lignes directrices, ni état d'avancement.
- La documentation utilisateur est écrite en français, en anglais et en breton, en Markdown simple qui s'affiche sur GitHub :
  - `README.md` (français), `README.en.md` (anglais) et `README.br.md` (breton).
  - `docs/fr/`, `docs/en/` et `docs/br/` ont la même structure. Les noms de fichiers sont traduits et parlants dans chaque langue (par exemple `raccourcis.md`, `keybinds.md` et `berradennou.md`).
  - La documentation utilisateur est découpée en plusieurs fichiers, pour la lisibilité et la maintenance.
  - Chaque page commence par un sélecteur de langue qui renvoie vers ses équivalents, par exemple : `🇫🇷 Français | [🇬🇧 English](README.en.md) | [Brezhoneg](README.br.md)`.
- Les textes de l'interface et la documentation utilisateur utilisent l'écriture inclusive : voir [interface.md](interface.md#écriture-inclusive).

## Licence

Le projet est libre, versé dans le domaine public sous The Unlicense (`LICENSE.md`).
