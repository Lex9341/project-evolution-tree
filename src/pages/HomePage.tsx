import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DashboardPanels } from '../components/DashboardPanels'
import { Hero } from '../components/Hero'
import { ProjectTree } from '../components/ProjectTree'
import { VersionCard } from '../components/VersionCard'
import { projects } from '../data/projects'
import type { VersionNode } from '../data/projects'
import { findVersion } from '../utils/projectStats'

export function HomePage() {
  const initialSelection = useMemo(
    () => ({ projectId: projects[0].id, versionId: projects[0].versions[0].id }),
    [],
  )
  const [selected, setSelected] = useState(initialSelection)

  const selectedProject = projects.find((project) => project.id === selected.projectId) ?? projects[0]
  const selectedVersion = findVersion(selectedProject, selected.versionId) ?? selectedProject.versions[0]

  const handleSelectVersion = (projectId: string, version: VersionNode) => {
    setSelected({ projectId, versionId: version.id })
  }

  return (
    <>
      <Hero />
      <DashboardPanels projects={projects} />
      <motion.section
        id="projects"
        className="workspace"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <ProjectTree
          projects={projects}
          selected={selected}
          onSelectVersion={handleSelectVersion}
        />

        <AnimatePresence mode="wait">
          <VersionCard
            key={`${selectedProject.id}-${selectedVersion.id}`}
            project={selectedProject}
            version={selectedVersion}
          />
        </AnimatePresence>
      </motion.section>
    </>
  )
}
