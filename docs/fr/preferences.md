🇫🇷 Français | [🇬🇧 English](../en/preferences.md)

# Préférences d'affichage

tunmez mémorise vos choix d'affichage et les retrouve au lancement suivant.

## Langue, thème et contraste

Cliquez sur l'icône de profil en haut à droite pour ouvrir la page **Profil**. Sa section **Préférences** propose :

- **Langue de l'interface**, menu : Système, Français ou English. *Système* suit la langue de votre ordinateur ; si elle n'est ni le français ni l'anglais, l'interface s'affiche en français.
- **Thème** : Système, Clair, Sombre profond ou Sombre doux. *Sombre doux* est un thème sombre aux contrastes atténués. *Système* suit le réglage clair ou sombre de votre ordinateur, y compris quand il change, et utilise *Sombre doux* en mode sombre.
- **Contraste élevé**, interrupteur : utilise la variante à contraste élevé du thème, quel qu'il soit.

Le changement s'applique immédiatement.

## Fenêtre

À la fermeture, tunmez enregistre la taille de la fenêtre, sa position et si elle est maximisée. Elle se rouvre de la même façon au lancement suivant.

Sous Linux avec Wayland, le système ne permet pas aux applications de choisir leur position : la fenêtre retrouve sa taille, mais c'est le système qui la place.

## Fichiers de préférences

Les préférences sont enregistrées dans votre profil utilisateur, dans des fichiers YAML lisibles par votre seul compte.

### Réglages : `config.yaml`

La langue, le thème et le contraste. Vous pouvez modifier ce fichier à la main, de préférence quand tunmez est fermé :

```yaml
locale: fr-FR   # fr-FR ou en ; supprimez la ligne pour suivre la langue du système
theme: dark     # system, light, dark ou dark-dimmed
contrast: high  # standard ou high
```

Emplacement :

- Linux : `~/.config/tunmez/config.yaml` (ou `$XDG_CONFIG_HOME/tunmez/config.yaml`)
- macOS : `~/Library/Application Support/tunmez/config.yaml`
- Windows : `%AppData%\tunmez\config.yaml`

Si le fichier est invalide (erreur de syntaxe, valeur inconnue), tunmez démarre avec les réglages par défaut et affiche un message avec le chemin du fichier. Le fichier n'est pas modifié tant que vous ne changez pas un réglage dans tunmez ; il est alors remplacé.

### État de session : `state.yaml`

La fenêtre et la ferme active. tunmez écrit ce fichier lui-même ; il n'est pas fait pour être modifié.

Emplacement :

- Linux : `~/.local/state/tunmez/state.yaml` (ou `$XDG_STATE_HOME/tunmez/state.yaml`)
- macOS : `~/Library/Application Support/tunmez/state.yaml`
- Windows : `%AppData%\tunmez\state.yaml`
