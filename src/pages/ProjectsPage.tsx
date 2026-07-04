import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Boxes, Search, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import type { Project, VersionStatus } from '../data/projects'
import { getProjectStats } from '../utils/projectStats'
import { StatusBadge } from '../components/StatusBadge'

const statusOptions: Array<VersionStatus | 'all'> = ['all', 'released', 'in-progress', 'planned']

export function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<VersionStatus | 'all'>('all')

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesStatus = status === 'all' || project.status === status
      const searchable = [
        project.name,
        project.tagline,
        project.description,
        project.category,
        project.platform,
        project.stack.join(' '),
        project.features.join(' '),
      ].join(' ').toLowerCase()
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [query, status])

  return (
    <motion.section
      className="catalog-page page-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <header className="page-hero glass-panel">
        <p className="panel-kicker">
          <Boxes size={16} />
          Project catalog
        </p>
        <h1>Every project with status, stack, risk and next milestone.</h1>
        <p>
          A portfolio should not be just cards. It should explain what each product does, why it exists,
          how mature it is, and where the next release is going.
        </p>
      </header>

      <section className="catalog-toolbar glass-panel">
        <label className="search-box">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by project, stack, feature or category"
          />
        </label>
        <div className="status-filter" aria-label="Project status filter">
          <SlidersHorizontal size={17} />
          {statusOptions.map((option) => (
            <button
              className={status === option ? 'active' : ''}
              key={option}
              type="button"
              onClick={() => setStatus(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <div className="project-card-grid">
        {filteredProjects.map((project, index) => (
          <ProjectCatalogCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </motion.section>
  )
}

function ProjectCatalogCard({ project, index }: { project: Project; index: number }) {
  const stats = getProjectStats(project)

  return (
    <motion.article
      className="glass-panel catalog-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <header>
        <div>
          <p className="panel-kicker">{project.category}</p>
          <h2>{project.name}</h2>
        </div>
        <StatusBadge status={project.status} />
      </header>

      <p className="catalog-tagline">{project.tagline}</p>

      <dl className="catalog-meta">
        <div>
          <dt>Version</dt>
          <dd>{project.currentVersion}</dd>
        </div>
        <div>
          <dt>Health</dt>
          <dd>{project.health}</dd>
        </div>
        <div>
          <dt>Versions</dt>
          <dd>{stats.totalVersions}</dd>
        </div>
        <div>
          <dt>Target</dt>
          <dd>{project.launchTarget}</dd>
        </div>
      </dl>

      <section className="catalog-problem">
        <strong>Problem</strong>
        <p>{project.problem}</p>
      </section>

      <section className="catalog-problem solution">
        <strong>Solution</strong>
        <p>{project.solution}</p>
      </section>

      <div className="tag-cloud compact-tags">
        {project.stack.slice(0, 6).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <Link className="catalog-link" to={`/projects/${project.slug}`}>
        Open project tree
        <ArrowRight size={17} />
      </Link>
    </motion.article>
  )
}
