import type { VersionStatus } from './projects'

export const statusColors: Record<VersionStatus, string> = {
  released: '#2af0a0',
  'in-progress': '#2d93ff',
  planned: '#a66cff',
}
