[🇫🇷 Français](../fr/preferences.md) | [🇬🇧 English](../en/preferences.md) | Brezhoneg

# Gwellvezioù diskwel

tunmez a zalc'h soñj eus ho tibaboù diskwel hag o adkav d'al loc'hañ war-lerc'h.

## Yezh, tem ha dargemm

Klikit war ar skeudenn aelad ront e-krec'h a-zehou evit digeriñ ar bajenn **Aelad**. He rann **Gwellvezioù** a ginnig :

- **Yezh an etrefas**, lañser : Reizhiad, Brezhoneg, English pe Français. *Reizhiad* a heul yezh hoc'h urzhiataer ; ma n'eo ket ar galleg, ar saozneg pe ar brezhoneg, e vez diskouezet an etrefas e galleg.
- **Tem** : Reizhiad, Sklaer, Teñval don pe Teñval flour. *Teñval flour* a zo un tem teñval gant dargemmoù dousaet. *Reizhiad* a heul arventenn sklaer pe deñval hoc'h urzhiataer, pa cheñch ivez, hag a implij *Teñval flour* er mod teñval.
- **Dargemm uhel**, da weredekaat pe da ziweredekaat : implijout a ra stumm dargemm uhel an tem, forzh pehini eo.

Lakaet e vez ar c'hemm e pleustr diouzhtu.

## Prenestr

Pa vez serret, tunmez a enroll ment ar prenestr, e lec'hiadur ha ma 'z eo brasaet. Addigoret e vez er memes doare d'al loc'hañ war-lerc'h.

War Linux gant Wayland, ne ro ket ar reizhiad an tu d'an arloadoù da zibab o lec'hiadur : ar prenestr a adkav e vent, met ar reizhiad eo a lec'h anezhañ.

## Restroù ar gwellvezioù

Ar gwellvezioù a vez enrollet en hoc'h aelad implijer, e restroù YAML ha n'hall bezañ lennet nemet gant ho kont.

### Arventennoù : `config.yaml`

Ar yezh, an tem hag an dargemm. Gallout a rit kemmañ ar restr-mañ gant an dorn, gwelloc'h pa vez serret tunmez :

```yaml
locale: br      # fr-FR, en pe br ; dilamit al linenn evit heuliañ yezh ar reizhiad
theme: dark     # system, light, dark pe dark-dimmed
contrast: high  # standard pe high
```

Lec'h :

- Linux : `~/.config/tunmez/config.yaml` (pe `$XDG_CONFIG_HOME/tunmez/config.yaml`)
- macOS : `~/Library/Application Support/tunmez/config.yaml`
- Windows : `%AppData%\tunmez\config.yaml`

Ma 'z eo direizh ar restr (fazi ereadur, talvoud dianav), tunmez a loc'h gant an arventennoù dre ziouer hag a ziskouez ur gemennadenn gant hent ar restr. Ne vez ket kemmet ar restr keit ha ma ne cheñchit ket un arventenn e tunmez ; neuze e vez erlec'hiet.

### Stad an estez : `state.yaml`

Ar prenestr hag an atant oberiant. tunmez a skriv ar restr-mañ e-unan ; n'eo ket graet evit bezañ kemmet.

Lec'h :

- Linux : `~/.local/state/tunmez/state.yaml` (pe `$XDG_STATE_HOME/tunmez/state.yaml`)
- macOS : `~/Library/Application Support/tunmez/state.yaml`
- Windows : `%AppData%\tunmez\state.yaml`
