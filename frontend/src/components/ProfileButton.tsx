import { Avatar, Button, Tooltip } from '@primer/react'
import placeholder from '../assets/avatar-placeholder.svg'
import { useT } from '../i18n/messages'
import styles from './ProfileButton.module.css'

interface Props {
  current?: boolean
  onClick(): void
}

// Opens the profile page. A round avatar in a round invisible Button, as on
// GitHub, where the other header actions are square icon buttons (approved
// exception, see project/guidelines/design-system.md). Shows a generic
// picture until the profile can hold one.
export default function ProfileButton({ current = false, onClick }: Props) {
  const t = useT()
  return (
    <Tooltip
      text={t('profile.title')}
      type="label"
    >
      <Button
        variant="invisible"
        className={styles.button}
        aria-current={current ? 'page' : undefined}
        onClick={onClick}
      >
        <Avatar
          src={placeholder}
          size={32}
        />
      </Button>
    </Tooltip>
  )
}
