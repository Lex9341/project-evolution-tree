import { useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, FolderTree } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project, VersionNode } from '../data/projects'
import { statusColors } from '../data/status'
import { flattenVersions } from '../utils/projectStats'
import { StatusBadge } from './StatusBadge'

type ProjectTreeProps = {
  projects: Project[]
  selected: {
    projectId: string
    versionId: string
  }
  onSelectVersion: (projectId: string, version: VersionNode) => void
}

export function ProjectTree({ projects, selected, onSelectVersion }: ProjectTreeProps) {
  const [openProjects, setOpenProjects] = useState(() => new Set(projects.map((project) => project.id)))

  const toggleProject = (projectId: string) => {
    setOpenProjects((current) => {
      const next = new Set(current)
      if (next.has(projectId)) {
        next.delete(projectId)
      } else {
        next.add(projectId)
      }
      return next
    })
  }

  return (
    <aside className="glass-panel tree-panel" aria-label="Project evolution tree">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">Project graph</p>
          <h2>Evolution branches</h2>
        </div>
        <span className="project-count">{projects.length} projects</span>
      </div>

      <div className="tree-legend">
        <span><b className="legend-dot released" /> released</span>
        <span><b className="legend-dot in-progress" /> active</span>
        <span><b className="legend-dot planned" /> planned</span>
      </div>

      <div className="project-stack">
        {projects.map((project, projectIndex) => {
          const isOpen = openProjects.has(project.id)
          const totalVersions = flattenVersions(project).length

          return (
            <motion.article
              className="project-branch"
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: projectIndex * 0.05 }}
            >
              <div className="project-toggle">
                <FolderTree size={20} />
                <Link className="project-title-link" to={`/projects/${project.slug}`}>
                  <span className="project-name">{project.name}</span>
                  <span className="project-description">{project.description}</span>
                </Link>
                <span className="mini-count">{totalVersions}</span>
                <button
                  className="branch-toggle"
                  type="button"
                  onClick={() => toggleProject(project.id)}
                  aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${project.name}`}
                  aria-expanded={isOpen}
                >
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="chevron">
                    <ChevronDown size={18} />
                  </motion.span>
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="tree-versions recursive"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                  >
                    {project.versions.map((version) => (
                      <VersionTreeNode
                        depth={0}
                        key={version.id}
                        project={project}
                        selected={selected}
                        version={version}
                        onSelectVersion={onSelectVersion}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )
        })}
      </div>
    </aside>
  )
}

type VersionTreeNodeProps = {
  depth: number
  project: Project
  selected: { projectId: string; versionId: string }
  version: VersionNode
  onSelectVersion: (projectId: string, version: VersionNode) => void
}

function VersionTreeNode({ depth, project, selected, version, onSelectVersion }: VersionTreeNodeProps) {
  const active = selected.projectId === project.id && selected.versionId === version.id

  return (
    <div className="version-node-group" style={{ '--depth': depth } as CSSProperties}>
      <motion.button
        className={`version-node ${active ? 'active' : ''} depth-${depth}`}
        type="button"
        style={{ '--status-color': statusColors[version.status] } as CSSProperties}
        onClick={() => onSelectVersion(project.id, version)}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="node-dot" />
        <span className="version-meta">
          <span className="version-label">{version.version}</span>
          <span className="version-date">{version.type} · {version.date}</span>
        </span>
        <StatusBadge status={version.status} />
      </motion.button>

      {version.children?.length ? (
        <div className="child-version-list">
          {version.children.map((child) => (
            <VersionTreeNode
              depth={depth + 1}
              key={child.id}
              project={project}
              selected={selected}
              version={child}
              onSelectVersion={onSelectVersion}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
