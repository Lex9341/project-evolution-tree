import { Circle, GitBranch, Sparkles } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { VersionStatus } from '../data/projects'
import { statusColors } from '../data/status'

const statusConfig = {
  released: { label: 'Released', Icon: Circle },
  'in-progress': { label: 'In progress', Icon: GitBranch },
  planned: { label: 'Planned', Icon: Sparkles },
} satisfies Record<VersionStatus, { label: string; Icon: LucideIcon }>

type StatusBadgeProps = {
  status: VersionStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, Icon } = statusConfig[status]

  return (
    <span className="status-badge" style={{ '--status-color': statusColors[status] } as CSSProperties}>
      <Icon />
      {label}
    </span>
  )
}
