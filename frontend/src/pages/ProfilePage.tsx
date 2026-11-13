import { useId } from 'react'
import { ActionList, ActionMenu, Heading, PageHeader, SegmentedControl, Text, ToggleSwitch } from '@primer/react'
import { GlobeIcon } from '@primer/octicons-react'
import type { LocaleChoice, ThemeChoice } from '../api/displayPreferences'
import { useT } from '../i18n/messages'
import { useDisplayPreferences } from '../state/displayPreferences'
import pageStyles from './Page.module.css'
import styles from './ProfilePage.module.css'

// The user's page. Its preferences save on selection (Primer customize
// pattern: imperative controls).
export default function ProfilePage() {
  const t = useT()
  return (
    <div className={pageStyles.page}>
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.Title as="h1">{t('profile.title')}</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>
      <section
        className={pageStyles.section}
        aria-labelledby="profile-preferences"
      >
        <Heading
          as="h2"
          variant="small"
          id="profile-preferences"
        >
          {t('profile.preferences')}
        </Heading>
        <LanguagePreference />
        <ThemePreference />
        <ContrastPreference />
      </section>
    </div>
  )
}

function LanguagePreference() {
  const t = useT()
  const prefs = useDisplayPreferences()
  const id = useId()

  // Language names are shown in their own language, whatever the interface language.
  const locales: { value: LocaleChoice; title: string }[] = [
    { value: '', title: t('settings.system') },
    { value: 'fr-FR', title: 'Français' },
    { value: 'en', title: 'English' },
  ]
  const selected = locales.find((locale) => locale.value === prefs.locale) ?? locales[0]

  return (
    <div className={styles.preference}>
      <Text
        as="h3"
        weight="semibold"
        id={`${id}-label`}
        className={styles.label}
      >
        {t('settings.interfaceLanguage')}
      </Text>
      <ActionMenu>
        <ActionMenu.Button
          id={`${id}-button`}
          aria-labelledby={`${id}-label ${id}-button`}
          aria-describedby={`${id}-hint`}
          leadingVisual={GlobeIcon}
        >
          {selected?.title}
        </ActionMenu.Button>
        <ActionMenu.Overlay width="small">
          <ActionList selectionVariant="single">
            {locales.map((locale) => (
              <ActionList.Item
                key={locale.value}
                selected={locale.value === prefs.locale}
                onSelect={() => void prefs.setLocale(locale.value)}
              >
                {locale.title}
              </ActionList.Item>
            ))}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
      <Text
        as="p"
        size="small"
        id={`${id}-hint`}
        className={styles.hint}
      >
        {t('settings.languageHint')}
      </Text>
    </div>
  )
}

function ThemePreference() {
  const t = useT()
  const prefs = useDisplayPreferences()
  const id = useId()

  const themes: { value: ThemeChoice; label: string }[] = [
    { value: 'system', label: t('settings.system') },
    { value: 'light', label: t('settings.light') },
    { value: 'dark', label: t('settings.dark') },
    { value: 'dark-dimmed', label: t('settings.darkDimmed') },
  ]

  return (
    <div className={styles.preference}>
      <Text
        as="h3"
        weight="semibold"
        id={`${id}-label`}
        className={styles.label}
      >
        {t('settings.theme')}
      </Text>
      <SegmentedControl
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-hint`}
        variant={{ narrow: 'dropdown', regular: 'default' }}
        onChange={(index) => {
          const theme = index === undefined ? undefined : themes[index]
          if (theme) void prefs.setTheme(theme.value)
        }}
      >
        {themes.map((theme) => (
          <SegmentedControl.Button
            key={theme.value}
            selected={prefs.theme === theme.value}
          >
            {theme.label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
      <Text
        as="p"
        size="small"
        id={`${id}-hint`}
        className={styles.hint}
      >
        {t('settings.themeHint')}
      </Text>
    </div>
  )
}

function ContrastPreference() {
  const t = useT()
  const prefs = useDisplayPreferences()
  const id = useId()

  return (
    <div className={styles.switchRow}>
      <div className={styles.preference}>
        <Text
          as="h3"
          weight="semibold"
          id={`${id}-label`}
          className={styles.label}
        >
          {t('settings.highContrast')}
        </Text>
        <Text
          as="p"
          size="small"
          id={`${id}-hint`}
          className={styles.hint}
        >
          {t('settings.highContrastHint')}
        </Text>
      </div>
      <ToggleSwitch
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-hint`}
        buttonLabelOn={t('common.on')}
        buttonLabelOff={t('common.off')}
        checked={prefs.contrast === 'high'}
        onChange={(on) => void prefs.setContrast(on ? 'high' : 'standard')}
      />
    </div>
  )
}
