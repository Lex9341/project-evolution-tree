import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import type { Project, VersionNode } from '../data/projects'
import { StatusBadge } from './StatusBadge'

type VersionDetailsDrawerProps = {
  project: Project
  version?: VersionNode
  onClose: () => void
}

export function VersionDetailsDrawer({ project, version, onClose }: VersionDetailsDrawerProps) {
  return (
    <AnimatePresence>
      {version && (
        <>
          <motion.button
            className="drawer-scrim"
            type="button"
            aria-label="Close version details"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="version-details-drawer"
            initial={{ x: '110%' }}
            animate={{ x: 0 }}
            exit={{ x: '110%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          >
            <header className="drawer-header">
              <div>
                <p className="panel-kicker">Version details</p>
                <h2>{version.version}</h2>
                <p>{version.title}</p>
              </div>
              <button className="drawer-close" type="button" onClick={onClose} aria-label="Close drawer">
                <X size={18} />
              </button>
            </header>

            <div className="drawer-meta-grid">
              <Meta label="Project" value={project.name} />
              <Meta label="Date" value={version.date} />
              <Meta label="Type" value={version.type} />
              <div className="drawer-status">
                <span>Status</span>
                <StatusBadge status={version.status} />
              </div>
            </div>

            <DrawerList title="Added" items={version.added} empty="No added features in this node." />
            <DrawerList title="Fixed" items={version.fixed} empty="No fixes recorded." />
            <DrawerList title="Planned" items={version.planned} empty="No planned items recorded." />
            <DrawerList title="Technical notes" items={version.notes ?? []} empty="No notes recorded." />

            {(version.commitUrl ?? project.githubUrl) && (
              <a
                className="drawer-release-link"
                href={version.commitUrl ?? project.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                GitHub release
                <ExternalLink size={16} />
              </a>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function DrawerList({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <section className="drawer-list">
      <h3>{title}</h3>
      <ul>
        {(items.length ? items : [empty]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
