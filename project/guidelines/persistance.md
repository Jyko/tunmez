# Persistance

Base de données et fichiers de préférences.

- Une seule base SQLite, rangée dans le dossier de données de l'utilisateur ou de l'utilisatrice : `$XDG_DATA_HOME/tunmez/tunmez.db` (par défaut `~/.local/share/tunmez/tunmez.db`) sous Linux, `tunmez/tunmez.db` dans le dossier de configuration de l'utilisateur ou de l'utilisatrice sous macOS et Windows. Le fichier n'est accessible qu'à son propriétaire (`0600`).
- `internal/database` ouvre la base et applique les migrations. Les migrations sont des fichiers SQL numérotés, embarqués dans le binaire (`internal/database/migrations/`), appliqués avec goose au démarrage.
- Les identifiants techniques sont des UUIDv7 stockés en `TEXT`.
- Les préférences ne sont pas stockées dans la base. Elles vivent dans des fichiers YAML du profil, accessibles à leur seul propriétaire, lus au démarrage :
  - Les réglages modifiables à la main (langue, thème) : `config.yaml` dans le dossier de configuration (`$XDG_CONFIG_HOME/tunmez/`, par défaut `~/.config/tunmez/`, sous Linux ; `tunmez/` dans le dossier de configuration sous macOS et Windows).
  - L'état de session écrit par l'application (géométrie de la fenêtre, ferme active) : `state.yaml` dans `$XDG_STATE_HOME/tunmez/` (par défaut `~/.local/state/tunmez/`) sous Linux, à côté de `config.yaml` sous macOS et Windows.
  - Les valeurs par défaut sont déclarées dans le code ; une clé absente d'un fichier garde sa valeur par défaut.
  - Un fichier de réglages invalide ne bloque pas le démarrage : les valeurs par défaut s'appliquent, l'application indique quel fichier est invalide, et ne le remplace que lorsqu'un réglage change. Un fichier d'état invalide revient silencieusement aux valeurs par défaut.
  - Les fichiers sont écrits de façon atomique (fichier temporaire puis renommage).
- Les données d'une ferme référencent `farm(id)` avec `ON DELETE CASCADE` : supprimer une ferme supprime ses données.
