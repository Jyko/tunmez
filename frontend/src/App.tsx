import { useEffect, useRef, useState } from 'react'
import { Banner, PageLayout, Stack, Text, UnderlineNav } from '@primer/react'
import { GearIcon, HomeIcon } from '@primer/octicons-react'
import FarmButton from './components/FarmButton'
import FarmNameDialog from './components/FarmNameDialog'
import ProfileButton from './components/ProfileButton'
import { useT } from './i18n/messages'
import FarmSettingsPage from './pages/FarmSettingsPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import { useDisplayPreferences } from './state/displayPreferences'
import { useFarms } from './state/farms'
import { useNavigation, type Page } from './state/navigation'
import styles from './App.module.css'

// Keyboard and screen reader users land on the new page (see guideline).
function focusPageHeading() {
  const heading = document.querySelector<HTMLElement>('main h1')
  if (!heading) return
  heading.tabIndex = -1
  heading.focus()
}

export default function App() {
  const t = useT()
  const farms = useFarms()
  const prefs = useDisplayPreferences()
  const navigation = useNavigation()
  const page = navigation.current

  const [creating, setCreating] = useState(false)
  const [openFailed, setOpenFailed] = useState(false)
  // Shown once at startup; the file is replaced when a setting changes.
  const [invalidConfigShown, setInvalidConfigShown] = useState(prefs.invalidConfig !== '')

  // Compared with the shown page rather than a first-render flag, so the
  // initial page does not take focus when effects run twice (StrictMode).
  const shownPage = useRef(page)
  useEffect(() => {
    if (shownPage.current === page) return
    shownPage.current = page
    focusPageHeading()
  }, [page])

  async function selectFarm(id: string) {
    setOpenFailed(false)
    try {
      await farms.select(id)
      navigation.navigate('home')
    } catch (error) {
      console.error('Failed to open farm', error)
      setOpenFailed(true)
    }
  }

  async function createFarm(name: string) {
    await farms.create(name)
    navigation.navigate('home')
  }

  const destinations: { page: Page; title: string; icon: typeof HomeIcon }[] = [
    { page: 'home', title: t('nav.home'), icon: HomeIcon },
    // Settings of the open farm, so only shown while a farm is open.
    ...(farms.active ? [{ page: 'farmSettings' as const, title: t('nav.farmSettings'), icon: GearIcon }] : []),
  ]

  const current = (page: Page) => (navigation.current === page ? 'page' : undefined)
  const pageProps = { onSelect: selectFarm, onCreate: () => setCreating(true) }

  return (
    <>
      <header className={styles.header}>
        <Stack
          direction="horizontal"
          align="center"
          justify="space-between"
          padding="normal"
        >
          {/* Context, as GitHub shows "owner / repository": the application, then the active farm. */}
          <Stack
            direction="horizontal"
            align="center"
            gap="condensed"
            className={styles.context}
          >
            <Text
              size="large"
              weight="semibold"
            >
              {t('app.name')}
            </Text>
            <Text
              size="large"
              className={styles.separator}
              aria-hidden="true"
            >
              /
            </Text>
            <FarmButton {...pageProps} />
          </Stack>
          <Stack
            direction="horizontal"
            align="center"
            gap="condensed"
          >
            <ProfileButton
              current={navigation.current === 'profile'}
              onClick={() => navigation.navigate('profile')}
            />
          </Stack>
        </Stack>
        <UnderlineNav aria-label={t('nav.label')}>
          {destinations.map(({ page, title, icon: Icon }) => (
            <UnderlineNav.Item
              key={page}
              as="button"
              type="button"
              leadingVisual={<Icon />}
              aria-current={current(page)}
              onSelect={(event) => {
                event.preventDefault()
                navigation.navigate(page)
              }}
            >
              {title}
            </UnderlineNav.Item>
          ))}
        </UnderlineNav>
      </header>
      <PageLayout containerWidth="medium">
        <PageLayout.Content>
          {invalidConfigShown && (
            <Banner
              className={styles.banner}
              variant="warning"
              title={t('settings.invalidFileTitle')}
              description={t('settings.invalidFile', { path: prefs.invalidConfig })}
              onDismiss={() => setInvalidConfigShown(false)}
            />
          )}
          {openFailed && (
            <Banner
              className={styles.banner}
              variant="critical"
              title={t('farm.errors.open')}
              onDismiss={() => setOpenFailed(false)}
            />
          )}
          {navigation.current === 'farmSettings' && <FarmSettingsPage />}
          {navigation.current === 'profile' && <ProfilePage />}
          {navigation.current === 'home' && <HomePage {...pageProps} />}
        </PageLayout.Content>
      </PageLayout>
      <FarmNameDialog
        open={creating}
        onClose={() => setCreating(false)}
        title={t('farm.new')}
        submitLabel={t('farm.create')}
        save={createFarm}
      />
    </>
  )
}
