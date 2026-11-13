import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Banner, Button, Dialog, FormControl, Heading, PageHeader, Text, TextInput } from '@primer/react'
import { Card } from '@primer/react/experimental'
import { PencilIcon, TrashIcon } from '@primer/octicons-react'
import FarmNameDialog from '../components/FarmNameDialog'
import { useT } from '../i18n/messages'
import { useFarms } from '../state/farms'
import { useNavigation } from '../state/navigation'
import styles from './Page.module.css'

export default function FarmSettingsPage() {
  const t = useT()
  const farms = useFarms()
  const { navigate } = useNavigation()
  const farm = farms.active

  const [renameOpen, setRenameOpen] = useState(false)
  // Kept while the dialog is open, so its text does not change once the farm is gone.
  const [deletingName, setDeletingName] = useState<string | null>(null)
  const deleteButton = useRef<HTMLButtonElement>(null)

  // These settings belong to the active farm; without one, home offers to pick one.
  useEffect(() => {
    if (!farm && deletingName === null) navigate('home')
  }, [farm, deletingName, navigate])

  async function rename(name: string) {
    if (farm) await farms.rename(farm.id, name)
  }

  async function remove() {
    if (!farm) return
    await farms.remove(farm.id)
    setDeletingName(null)
    navigate('home')
  }

  return (
    <div className={styles.page}>
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.Title as="h1">{t('farmSettings.title')}</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>

      {farm && (
        <>
          <section
            className={styles.section}
            aria-labelledby="farm-settings-general"
          >
            <Heading
              as="h2"
              variant="small"
              id="farm-settings-general"
            >
              {t('farmSettings.general')}
            </Heading>
            <Card>
              <Card.Heading>{t('farm.name')}</Card.Heading>
              <Card.Description>{farm.name}</Card.Description>
              <Card.Action>
                <Button
                  leadingVisual={PencilIcon}
                  onClick={() => setRenameOpen(true)}
                >
                  {t('farmSettings.rename')}
                </Button>
              </Card.Action>
            </Card>
          </section>

          <section
            className={styles.section}
            aria-labelledby="farm-settings-danger"
          >
            <Heading
              as="h2"
              variant="small"
              id="farm-settings-danger"
            >
              {t('farmSettings.danger')}
            </Heading>
            <Card>
              <Card.Heading>{t('farmSettings.delete')}</Card.Heading>
              <Card.Description>{t('farmSettings.deleteHint')}</Card.Description>
              <Card.Action>
                <Button
                  ref={deleteButton}
                  variant="danger"
                  leadingVisual={TrashIcon}
                  onClick={() => setDeletingName(farm.name)}
                >
                  {t('farmSettings.delete')}
                </Button>
              </Card.Action>
            </Card>
          </section>
        </>
      )}

      <FarmNameDialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        title={t('farm.renameTitle')}
        submitLabel={t('common.save')}
        initialName={farm?.name}
        save={rename}
      />

      {deletingName !== null && (
        <DeleteDialog
          name={deletingName}
          returnFocusRef={deleteButton}
          onClose={() => setDeletingName(null)}
          remove={remove}
        />
      )}
    </div>
  )
}

interface DeleteDialogProps {
  name: string
  returnFocusRef: React.RefObject<HTMLButtonElement | null>
  onClose(): void
  remove(): Promise<void>
}

// Typing the farm name confirms the deletion (Primer delete pattern, type-to-confirm).
function DeleteDialog({ name, returnFocusRef, onClose, remove }: DeleteDialogProps) {
  const t = useT()
  const [confirmation, setConfirmation] = useState('')
  const [removing, setRemoving] = useState(false)
  const [failed, setFailed] = useState(false)
  const confirmed = confirmation === name

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!confirmed || removing) return
    setRemoving(true)
    setFailed(false)
    try {
      await remove()
    } catch (error) {
      console.error('Failed to delete farm', error)
      setFailed(true)
      setRemoving(false)
    }
  }

  return (
    <Dialog
      title={t('farm.deleteTitle')}
      role="alertdialog"
      width="large"
      returnFocusRef={returnFocusRef as React.RefObject<HTMLElement>}
      onClose={onClose}
      renderFooter={() => (
        <Dialog.Footer>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button
            type="submit"
            form="farm-delete-form"
            variant="danger"
            disabled={!confirmed}
            loading={removing}
          >
            {t('farm.delete')}
          </Button>
        </Dialog.Footer>
      )}
    >
      {failed && (
        <Banner
          variant="critical"
          title={t('farm.errors.delete')}
          hideTitle
          flush
        />
      )}
      <form
        id="farm-delete-form"
        className={styles.section}
        noValidate
        onSubmit={submit}
      >
        <Text as="p">{t('farm.deleteWarning', { name })}</Text>
        <FormControl>
          <FormControl.Label>{t('farmSettings.confirmLabel', { name })}</FormControl.Label>
          <TextInput
            block
            autoFocus
            autoComplete="off"
            spellCheck={false}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </FormControl>
      </form>
    </Dialog>
  )
}
