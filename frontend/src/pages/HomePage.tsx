import FarmEmptyState from '../components/FarmEmptyState'
import { useFarms } from '../state/farms'

interface Props {
  onSelect(id: string): void
  onCreate(): void
}

export default function HomePage(props: Props) {
  const { active } = useFarms()
  return active ? null : <FarmEmptyState {...props} />
}
