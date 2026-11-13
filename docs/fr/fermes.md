🇫🇷 Français | [🇬🇧 English](../en/farms.md)

# Fermes

tunmez gère plusieurs fermes. Chacune disposera de ses propres données : paramétrages, parcelles, planches, tâches, calendrier…

## Première ferme

Au premier lancement, aucune ferme n'existe. La page d'accueil propose le bouton **Créer une ferme**. Saisissez son nom et validez : la ferme est créée et devient la ferme active.

Le nom est obligatoire et ne doit pas dépasser 255 caractères. Deux fermes peuvent porter le même nom.

## Changer de ferme

Le nom de la ferme active s'affiche en haut à gauche, après le nom de l'application, sous la forme `tunmez / nom de la ferme`. Si aucune ferme n'est ouverte, il est remplacé par *Choisir une ferme*, ou par *Aucune ferme* si vous n'en avez pas.

Cliquez dessus, ou utilisez le raccourci Ctrl+O (⌘ Cmd+O sur macOS), pour ouvrir la liste des fermes. La ferme active vient en premier, cochée, suivie des autres, de la plus récemment utilisée à la plus ancienne. Saisissez du texte dans le champ de filtre pour réduire la liste par nom, sans tenir compte des majuscules ni des accents ; parcourez-la avec les flèches du clavier. Choisir une autre ferme en fait la ferme active, et la liste se referme ; vous restez sur la page en cours. Échap referme la liste sans rien changer.

## Gérer les fermes

Le bouton **Nouvelle ferme**, en bas de la liste des fermes, crée une ferme, qui devient la ferme active.

Les réglages de la ferme active s'ouvrent depuis l'onglet **Réglages**, avec l'icône d'engrenage, sous le nom de l'application. Cet onglet n'apparaît que lorsqu'une ferme est ouverte. La page propose :

- dans la section **Général**, le bouton **Renommer** pour changer le nom de la ferme ;
- dans la section **Zone de danger**, le bouton **Supprimer cette ferme**. Pour confirmer, saisissez le nom exact de la ferme dans la fenêtre qui s'ouvre. **La suppression est définitive** : la ferme et toutes ses données sont effacées.

Après la suppression de la ferme active, aucune ferme n'est ouverte : la page d'accueil propose de choisir l'une des fermes restantes ou d'en créer une.

## Au lancement

tunmez rouvre la dernière ferme utilisée. Si elle n'existe plus, la page d'accueil liste vos fermes, ou propose d'en créer une si vous n'en avez aucune.

## Emplacement des données

Les fermes sont enregistrées dans la base de données de tunmez, accessible à votre seul compte utilisateur :

- Linux : `~/.local/share/tunmez/tunmez.db` (ou `$XDG_DATA_HOME/tunmez/tunmez.db`)
- macOS : `~/Library/Application Support/tunmez/tunmez.db`
- Windows : `%AppData%\tunmez\tunmez.db`

La ferme active est mémorisée dans l'[état de session](preferences.md#état-de-session--stateyaml).
