import { motion } from 'framer-motion'
import { CheckCircle2, ExternalLink, GitBranch, Hammer, Rocket, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project, VersionNode } from '../data/projects'
import { StatusBadge } from './StatusBadge'

type VersionCardProps = {
  project: Project
  version: VersionNode
}

export function VersionCard({ project, version }: VersionCardProps) {
  const totalChanges = version.added.length + version.fixed.length + version.planned.length

  return (
    <motion.article
      className="glass-panel details-panel version-card"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <header className="version-header">
        <div className="version-title">
          <p className="panel-kicker">Version details</p>
          <h2>
            {project.name} {version.version}
          </h2>
          <p>{version.title}</p>
        </div>
        <StatusBadge status={version.status} />
      </header>

      <div className="version-grid">
        <div className="metric">
          <span>Project</span>
          <strong>{project.name}</strong>
        </div>
        <div className="metric">
          <span>Branch type</span>
          <strong>{version.type}</strong>
        </div>
        <div className="metric">
          <span>Date</span>
          <strong>{version.date}</strong>
        </div>
        <div className="metric">
          <span>Changes</span>
          <strong>{totalChanges}</strong>
        </div>
      </div>

      <div className="feature-columns three-columns">
        <FeatureList title="Added" items={version.added} empty="No added features in this node." icon="added" />
        <FeatureList title="Fixed" items={version.fixed} empty="No fixes recorded in this node." icon="fixed" />
        <FeatureList title="Planned" items={version.planned} empty="No planned items recorded." icon="planned" />
      </div>

      <section className="notes-box project-context-box">
        <h3>Project context</h3>
        <div className="context-grid">
          <div>
            <span>Problem</span>
            <p>{project.problem}</p>
          </div>
          <div>
            <span>Next milestone</span>
            <p>{project.nextMilestone}</p>
          </div>
        </div>
      </section>

      <section className="notes-box">
        <h3>Technical notes</h3>
        <p>{version.notes?.join(' ') ?? 'No technical notes recorded yet.'}</p>
      </section>

      <section className="screenshot-box">
        <h3>Interface preview slot</h3>
        <div className="screenshot-preview" role="img" aria-label={`${project.name} interface preview`}>
          <div className="screenshot-grid">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <div className="version-actions">
        <Link className="github-link" to={`/projects/${project.slug}`}>
          <GitBranch size={18} />
          Full tree
        </Link>
        {(version.commitUrl ?? project.githubUrl) ? (
          <motion.a
            className="github-link secondary-link"
            href={version.commitUrl ?? project.githubUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Rocket size={18} />
            Source
            <ExternalLink size={16} />
          </motion.a>
        ) : null}
      </div>
    </motion.article>
  )
}

type FeatureListProps = {
  title: string
  items: string[]
  empty: string
  icon: 'added' | 'fixed' | 'planned'
}

function FeatureList({ title, items, empty, icon }: FeatureListProps) {
  const Icon = icon === 'planned' ? Sparkles : icon === 'fixed' ? Hammer : CheckCircle2

  return (
    <section className="feature-box">
      <h3>{title}</h3>
      <ul className={`feature-list ${icon}`}>
        {(items.length ? items : [empty]).map((item) => (
          <li key={item}>
            <Icon />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
