# Interface

Disposition, comportement et textes de l'interface.

## Internationalisation et localisation

- Langues disponibles : français, anglais et breton (`fr-FR`, `en`, `br`).
- Langue de repli : `fr-FR`.
- La langue active suit les réglages de l'ordinateur et le choix de l'utilisateur ou de l'utilisatrice.
- L'internationalisation utilise react-intl. Les fichiers de traduction sont en JSON imbriqué, avec des paramètres ICU (`{name}`).

## Préférences

Les choix de l'utilisateur ou de l'utilisatrice sont conservés d'une session à l'autre : langue, thème, contraste, taille, état maximisé et position de la fenêtre principale, et ferme active. La langue, le thème et le contraste se règlent dans les préférences de la page profil. Ils s'enregistrent dès la sélection, comme des contrôles impératifs (pattern Primer customize) : un `ActionMenu` à choix unique pour la langue (Système épinglé en haut, puis les langues triées par code ISO, chacune nommée dans sa propre langue), un `SegmentedControl` pour le thème, un `ToggleSwitch` pour le contraste élevé. Il n'y a pas de page de réglages.

## Disposition

L'application est une application monopage disposée comme une page de dépôt GitHub :

- En-tête, sur un bandeau atténué (`--bgColor-inset`) : à gauche le nom de l'application, un séparateur `/` et le bouton de la ferme (nom de la ferme active), comme GitHub affiche `propriétaire / dépôt` ; tout à droite le bouton de profil. Pas de slogan. Comme sur GitHub, le bouton de profil est l'`Avatar` Primer rond de l'utilisateur ou de l'utilisatrice dans un `Button` Primer rond, tandis que les autres actions de l'en-tête sont des `IconButton` carrés. Tant que le profil ne peut pas contenir de photo, l'avatar affiche une image générique (la silhouette de personne des Octicons). Le composant `Header` de Primer React n'est pas utilisé : c'est l'ancien en-tête sombre de GitHub, sur lequel les boutons Primer sont illisibles.
- Navigation principale : des onglets `UnderlineNav` en bas de l'en-tête, qui listent les destinations principales de l'application. La destination courante est l'onglet sélectionné (`aria-current="page"`).
- Entrées de la navigation principale : l'accueil, et les réglages de la ferme quand une ferme est ouverte. L'onglet des réglages de la ferme s'intitule Réglages (anglais : Settings), avec l'icône d'engrenage, comme l'onglet Settings d'un dépôt GitHub.
- Contenu central : affiche une page à la fois, dans un `PageLayout` Primer, et porte l'essentiel de l'application. Chaque page commence par un `PageHeader`.
  - Le bouton de la ferme affiche le nom de la ferme active, ou un texte d'invite quand aucune ferme n'est ouverte (choisir une ferme, ou aucune ferme pour l'instant), avec un chevron à droite. Un nom trop long est tronqué proprement et reste disponible en entier.
  - Le bouton de la ferme ouvre le sélecteur de fermes, un `SelectPanel` avec un champ de filtre, qui sert à changer de ferme, avec une action « Nouvelle ferme » dans son pied. Il n'y a pas de page des fermes, ni de menu de création global tant que la ferme est la seule chose qu'on crée depuis n'importe où dans l'application.
  - Sans ferme ouverte, la page d'accueil affiche un état vide centré et neutre. Son appel à l'action est un bouton avec un libellé texte, « Créer une ferme », jamais une icône seule.
  - La page des réglages de la ferme porte les réglages de la ferme active : le renommage dans une section Général, et la suppression dans une zone de danger en bas de la page.
  - Supprimer une ferme ouvre une fenêtre qui nomme la ferme, prévient que toutes ses données seront perdues, et n'active le bouton de suppression qu'une fois le nom exact de la ferme saisi. C'est une exception voulue à la règle « annuler plutôt que confirmer », parce que la suppression détruit des données.
  - Le bouton de profil ouvre la page profil, qui porte les préférences (langue, thème).
- Les messages suivent le pattern Primer de messages de notification : `Banner` en haut du contenu ou dans une fenêtre, pas de toast.
- Historique de navigation : le contenu central garde les pages visitées et peut revenir à la page précédente sur commande. Aucun bouton, raccourci ou action ne le déclenche encore.
- Quand la page change, le focus passe au titre de la page, pour que les personnes au clavier ou avec un lecteur d'écran arrivent sur le nouveau contenu.

## Accessibilité

- Cible : WCAG 2.2 niveau AA.

## UI/UX

- Suivre les bonnes pratiques modernes d'UI/UX en plus des exigences d'accessibilité : cohérence, hiérarchie visuelle claire, retour immédiat sur les actions, annuler plutôt que confirmer quand c'est possible, états vides et messages d'erreur clairs.

## Écriture inclusive

- Les textes de l'interface et la documentation utilisateur utilisent l'écriture inclusive (par exemple « maraîcher·es », « l'utilisateur ou l'utilisatrice »).
- Cela ne s'applique pas au code.

## Raccourcis clavier

- L'application fournit un jeu de raccourcis.
- Les raccourcis suivent d'abord les standards du web, puis ceux des systèmes d'exploitation modernes. Le modificateur principal est ⌘ Cmd sur macOS et Ctrl sur Windows et Linux (par exemple Cmd/Ctrl+C et Cmd/Ctrl+V pour copier et coller, Cmd/Ctrl+A pour tout sélectionner).
- Chaque raccourci est documenté dans la page des raccourcis de chaque langue de la documentation.
