import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Boxes, CheckCircle2, ShieldAlert, Target } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ProjectVersionTreeCanvas } from '../components/ProjectVersionTreeCanvas'
import { StatusBadge } from '../components/StatusBadge'
import { VersionDetailsDrawer } from '../components/VersionDetailsDrawer'
import { projects } from '../data/projects'
import type { Project, VersionNode } from '../data/projects'
import { getProjectStats } from '../utils/projectStats'
import { NotFoundPage } from './NotFoundPage'

export function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  const [selectedVersion, setSelectedVersion] = useState<VersionNode | undefined>(undefined)

  if (!project) {
    return <NotFoundPage />
  }

  return (
    <motion.div
      className="project-tree-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <header className="tree-page-header">
        <Link className="back-link" to="/">
          <ArrowLeft size={18} />
          Back to projects
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="panel-kicker">Project version system</p>
          <h1>{project.name}</h1>
          <p>{project.tagline}</p>
        </motion.div>
      </header>

      <ProjectCommandDock project={project} />

      <ProjectVersionTreeCanvas
        drawerOpen={Boolean(selectedVersion)}
        versions={project.versions}
        selectedId={selectedVersion?.id}
        onSelect={setSelectedVersion}
      />

      <ProjectIntelligencePanel project={project} />

      <VersionDetailsDrawer
        project={project}
        version={selectedVersion}
        onClose={() => setSelectedVersion(undefined)}
      />
    </motion.div>
  )
}

function ProjectCommandDock({ project }: { project: Project }) {
  const stats = getProjectStats(project)

  return (
    <section className="glass-panel project-command-dock">
      <div>
        <p className="panel-kicker">Mission</p>
        <h2>{project.description}</h2>
        <p>{project.solution}</p>
      </div>
      <div className="project-dock-stats">
        <MiniStat label="Current" value={project.currentVersion} />
        <MiniStat label="Versions" value={String(stats.totalVersions)} />
        <MiniStat label="Branches" value={String(stats.branches)} />
        <MiniStat label="Target" value={project.launchTarget} />
      </div>
      <StatusBadge status={project.status} />
    </section>
  )
}

function ProjectIntelligencePanel({ project }: { project: Project }) {
  return (
    <section className="project-intelligence-grid">
      <InfoPanel title="Core features" icon={<CheckCircle2 size={18} />} items={project.features} />
      <InfoPanel title="Roadmap" icon={<Target size={18} />} items={project.roadmap} />
      <InfoPanel title="Risks" icon={<ShieldAlert size={18} />} items={project.risks} />
      <InfoPanel title="Design rules" icon={<Boxes size={18} />} items={project.designPrinciples} />
    </section>
  )
}

function InfoPanel({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return (
    <article className="glass-panel info-panel">
      <h2>{icon}{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
