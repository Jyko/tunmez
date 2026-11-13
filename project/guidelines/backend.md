# Backend

Code Go et architecture.

## Go

- Suivre à la lettre les recommandations et la philosophie de Go ([Effective Go](https://go.dev/doc/effective_go), [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments)).
- Le code se documente lui-même : noms clairs et petites fonctions. Les commentaires expliquent pourquoi, pas quoi. Les commentaires de documentation des identifiants exportés suivent [Go Doc Comments](https://go.dev/doc/comment).
- L'organisation des paquets se définit au fur et à mesure. Le code métier vit dans `internal/<domaine>`.

## Architecture

- Les responsabilités sont séparées : les services portent la logique métier, les repositories l'accès aux données.
- Le SQL n'apparaît que dans `internal/database` et dans les repositories. Un service n'accède jamais directement à la base.
- Un service dépend d'une interface de repository déclarée dans son propre paquet. L'implémentation SQLite vit à côté, dans un fichier `sqlite_<entité>_repository.go`, une implémentation en fichier YAML dans un fichier `yaml_<entité>_repository.go`.
- Nommage : entité + rôle, le nom du paquet qualifiant le domaine, par exemple `preferences.DisplayService`, `preferences.SettingsRepository`, `farm.SQLiteRepository`. Ne jamais répéter le nom du paquet (`preferences.PreferencesService`).
