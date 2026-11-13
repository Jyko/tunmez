import { useState, type FormEvent } from 'react'
import { Banner, Button, Dialog, FormControl, TextInput } from '@primer/react'
import { FARM_NAME_MAX_LENGTH } from '../api/farms'
import { useT } from '../i18n/messages'
import { farmNameError } from '../state/farms'

interface Props {
  open: boolean
  onClose(): void
  title: string
  submitLabel: string
  initialName?: string
  save(name: string): Promise<void>
}

// Counts characters, not UTF-16 code units, like the Go service.
const characterCount = (value: string) => [...value].length

// Asks for a farm name, validates it and saves it.
export default function FarmNameDialog({ open, ...props }: Props) {
  // Mounted only while open, so each opening starts from a fresh form.
  return open ? <NameForm {...props} /> : null
}

function NameForm({ onClose, title, submitLabel, initialName = '', save }: Omit<Props, 'open'>) {
  const t = useT()
  const [name, setName] = useState(initialName)
  const [touched, setTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  const reason = farmNameError(name)
  const error = reason && t(`farm.errors.${reason}`, { max: FARM_NAME_MAX_LENGTH })

  async function submit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (error || saving) return
    setSaving(true)
    setFailed(false)
    try {
      await save(name)
      onClose()
    } catch (err) {
      console.error('Failed to save farm', err)
      setFailed(true)
      setSaving(false)
    }
  }

  return (
    <Dialog
      title={title}
      width="large"
      onClose={onClose}
      renderFooter={() => (
        <Dialog.Footer>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button
            type="submit"
            form="farm-name-form"
            variant="primary"
            loading={saving}
          >
            {submitLabel}
          </Button>
        </Dialog.Footer>
      )}
    >
      {failed && (
        <Banner
          variant="critical"
          title={t('farm.errors.save')}
          hideTitle
          flush
        />
      )}
      <form
        id="farm-name-form"
        noValidate
        onSubmit={submit}
      >
        <FormControl required>
          <FormControl.Label>{t('farm.name')}</FormControl.Label>
          <TextInput
            block
            autoFocus
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setTouched(true)
            }}
          />
          {touched && error && <FormControl.Validation variant="error">{error}</FormControl.Validation>}
          <FormControl.Caption>
            {characterCount(name)} / {FARM_NAME_MAX_LENGTH}
          </FormControl.Caption>
        </FormControl>
      </form>
    </Dialog>
  )
}
