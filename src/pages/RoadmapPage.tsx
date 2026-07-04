import { motion } from 'framer-motion'
import { CalendarDays, CheckCircle2, GitBranch, Rocket, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import type { VersionStatus } from '../data/projects'
import { flattenAllVersions } from '../utils/projectStats'
import { StatusBadge } from '../components/StatusBadge'

const columns: Array<{ status: VersionStatus; title: string; note: string }> = [
  { status: 'released', title: 'Released', note: 'Already shipped or validated.' },
  { status: 'in-progress', title: 'In progress', note: 'Currently moving.' },
  { status: 'planned', title: 'Planned', note: 'Future major work.' },
]

export function RoadmapPage() {
  const records = flattenAllVersions(projects).sort((left, right) => left.version.date.localeCompare(right.version.date))

  return (
    <motion.section
      className="roadmap-page page-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <header className="page-hero glass-panel">
        <p className="panel-kicker">
          <CalendarDays size={16} />
          Global roadmap
        </p>
        <h1>One timeline for all products, branches and launch decisions.</h1>
        <p>
          Released work, active branches and planned releases are separated so the next move is always visible.
        </p>
      </header>

      <div className="roadmap-board">
        {columns.map((column) => {
          const columnRecords = records.filter(({ version }) => version.status === column.status)

          return (
            <section className="glass-panel roadmap-column" key={column.status}>
              <header>
                <span className={`roadmap-icon ${column.status}`}>
                  {column.status === 'released' ? <CheckCircle2 size={18} /> : null}
                  {column.status === 'in-progress' ? <GitBranch size={18} /> : null}
                  {column.status === 'planned' ? <Sparkles size={18} /> : null}
                </span>
                <div>
                  <h2>{column.title}</h2>
                  <p>{column.note}</p>
                </div>
              </header>

              <div className="roadmap-cards">
                {columnRecords.map(({ project, version, path }) => (
                  <Link className="roadmap-card" to={`/projects/${project.slug}`} key={version.id}>
                    <div>
                      <strong>{project.name}</strong>
                      <span>{path.join(' / ')}</span>
                    </div>
                    <h3>{version.title}</h3>
                    <p>{version.added[0] ?? version.fixed[0] ?? version.planned[0] ?? 'Scope note pending.'}</p>
                    <small>{version.date}</small>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <section className="glass-panel timeline-panel">
        <p className="panel-kicker">
          <Rocket size={16} />
          Chronological release feed
        </p>
        <div className="timeline-list">
          {records.map(({ project, version, path }) => (
            <Link className="timeline-row" to={`/projects/${project.slug}`} key={version.id}>
              <span className="timeline-date">{version.date}</span>
              <span className="timeline-body">
                <strong>{project.name} · {version.title}</strong>
                <small>{path.join(' / ')}</small>
              </span>
              <StatusBadge status={version.status} />
            </Link>
          ))}
        </div>
      </section>
    </motion.section>
  )
}
