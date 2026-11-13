🇫🇷 Français | [🇬🇧 English](../en/preferences.md)

# Préférences d'affichage

tunmez mémorise vos choix d'affichage et les retrouve au lancement suivant.

## Langue et thème

Ouvrez le menu **Réglages** (icône d'engrenage en haut à droite) :

- **Langue** : Système, Français ou English. *Système* suit la langue de votre ordinateur ; si elle n'est ni le français ni l'anglais, l'interface s'affiche en français.
- **Thème** : Système, Clair ou Sombre. *Système* suit le réglage clair ou sombre de votre ordinateur, y compris quand il change.

Le changement s'applique immédiatement.

## Fenêtre

À la fermeture, tunmez enregistre la taille de la fenêtre, sa position et si elle est maximisée. Elle se rouvre de la même façon au lancement suivant.

Sous Linux avec Wayland, le système ne permet pas aux applications de choisir leur position : la fenêtre retrouve sa taille, mais c'est le système qui la place.

## Emplacement des données

Les préférences sont enregistrées dans la base de données de tunmez, accessible à votre seul compte utilisateur :

- Linux : `~/.local/share/tunmez/tunmez.db` (ou `$XDG_DATA_HOME/tunmez/tunmez.db`)
- macOS : `~/Library/Application Support/tunmez/tunmez.db`
- Windows : `%AppData%\tunmez\tunmez.db`
