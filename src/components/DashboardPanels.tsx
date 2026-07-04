import { motion } from 'framer-motion'
import { Activity, Boxes, CheckCircle2, Clock3, Rocket, Target } from 'lucide-react'
import type { Project } from '../data/projects'
import { getGlobalStats, getLatestReleased, getNextVersions } from '../utils/projectStats'
import { StatusBadge } from './StatusBadge'

type DashboardPanelsProps = {
  projects: Project[]
}

export function DashboardPanels({ projects }: DashboardPanelsProps) {
  const stats = getGlobalStats(projects)
  const nextVersions = getNextVersions(projects, 5)
  const latestReleased = getLatestReleased(projects, 4)

  const cards = [
    { label: 'Projects', value: stats.totalProjects, note: `${stats.coreProjects} core`, Icon: Boxes },
    { label: 'Versions', value: stats.totalVersions, note: `${stats.releasedVersions} released`, Icon: GitMetricIcon },
    { label: 'In progress', value: stats.versionsInProgress, note: `${stats.activeProjects} active projects`, Icon: Activity },
    { label: 'Roadmap items', value: stats.totalRoadmap, note: `${stats.plannedVersions} planned versions`, Icon: Target },
  ]

  return (
    <motion.section
      className="dashboard-panels"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="stat-strip">
        {cards.map(({ label, value, note, Icon }) => (
          <article className="glass-panel command-stat" key={label}>
            <Icon size={18} />
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </div>

      <div className="ops-grid">
        <section className="glass-panel ops-panel">
          <p className="panel-kicker">
            <Clock3 size={15} />
            Next shipping line
          </p>
          <h2>Upcoming release queue</h2>
          <div className="release-feed">
            {nextVersions.map(({ project, version, path }) => (
              <a className="release-row" href={`#/projects/${project.slug}`} key={version.id}>
                <span className="release-main">
                  <strong>{project.name}</strong>
                  <small>{path.join(' / ')} · {version.title}</small>
                </span>
                <StatusBadge status={version.status} />
              </a>
            ))}
          </div>
        </section>

        <section className="glass-panel ops-panel">
          <p className="panel-kicker">
            <CheckCircle2 size={15} />
            Stable signal
          </p>
          <h2>Latest completed work</h2>
          <div className="release-feed compact-feed">
            {latestReleased.map(({ project, version }) => (
              <a className="release-row" href={`#/projects/${project.slug}`} key={version.id}>
                <span className="release-main">
                  <strong>{version.version}</strong>
                  <small>{project.name} · {version.title}</small>
                </span>
                <span className="date-chip">{version.date}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </motion.section>
  )
}

function GitMetricIcon({ size = 18 }: { size?: number }) {
  return <Rocket size={size} />
}
