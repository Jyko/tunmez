import { ActionList } from '@primer/react'
import { Blankslate } from '@primer/react/experimental'
import { LocationIcon } from '@primer/octicons-react'
import { useT } from '../i18n/messages'
import { useFarms } from '../state/farms'
import styles from './FarmEmptyState.module.css'

interface Props {
  onSelect(id: string): void
  onCreate(): void
}

// Shown without an active farm: lists the farms to open, or invites to create one.
export default function FarmEmptyState({ onSelect, onCreate }: Props) {
  const t = useT()
  const { farms } = useFarms()
  const copy = farms.length ? 'farm.choose' : 'farm.empty'

  return (
    <Blankslate spacious>
      <Blankslate.Visual>
        <LocationIcon size="medium" />
      </Blankslate.Visual>
      <Blankslate.Heading as="h1">{t(`${copy}.title`)}</Blankslate.Heading>
      <Blankslate.Description>{t(`${copy}.text`)}</Blankslate.Description>
      {farms.length > 0 && (
        <ActionList
          className={styles.list}
          aria-label={t('farm.list')}
          showDividers
        >
          {farms.map((farm) => (
            <ActionList.Item
              key={farm.id}
              onSelect={() => onSelect(farm.id)}
            >
              <ActionList.LeadingVisual>
                <LocationIcon />
              </ActionList.LeadingVisual>
              {farm.name}
            </ActionList.Item>
          ))}
        </ActionList>
      )}
      <Blankslate.PrimaryAction onClick={onCreate}>{t('farm.create')}</Blankslate.PrimaryAction>
    </Blankslate>
  )
}
