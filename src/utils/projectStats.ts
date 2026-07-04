import type { Project, VersionNode, VersionStatus } from '../data/projects'

export type VersionRecord = {
  project: Project
  version: VersionNode
  depth: number
  path: string[]
}

export function flattenVersions(project: Project): VersionRecord[] {
  const records: VersionRecord[] = []

  const walk = (versions: VersionNode[], depth = 0, path: string[] = []) => {
    versions.forEach((version) => {
      const nextPath = [...path, version.version]
      records.push({ project, version, depth, path: nextPath })
      if (version.children?.length) {
        walk(version.children, depth + 1, nextPath)
      }
    })
  }

  walk(project.versions)
  return records
}

export function flattenAllVersions(projects: Project[]): VersionRecord[] {
  return projects.flatMap((project) => flattenVersions(project))
}

export function findVersion(project: Project, versionId: string): VersionNode | undefined {
  return flattenVersions(project).find((record) => record.version.id === versionId)?.version
}

export function getProjectStats(project: Project) {
  const versions = flattenVersions(project)
  const byStatus = countByStatus(versions.map((record) => record.version))
  const changes = versions.reduce(
    (sum, record) => sum + record.version.added.length + record.version.fixed.length + record.version.planned.length,
    0,
  )
  const latest = [...versions]
    .sort((left, right) => right.version.date.localeCompare(left.version.date))[0]
    ?.version

  return {
    branches: versions.filter((record) => record.version.type === 'branch').length,
    changes,
    latest,
    maxDepth: Math.max(...versions.map((record) => record.depth), 0),
    released: byStatus.released,
    totalVersions: versions.length,
    inProgress: byStatus['in-progress'],
    planned: byStatus.planned,
  }
}

export function getGlobalStats(projects: Project[]) {
  const versions = flattenAllVersions(projects)
  const byStatus = countByStatus(versions.map((record) => record.version))
  const coreProjects = projects.filter((project) => project.priority === 'core').length
  const activeProjects = projects.filter((project) => project.status === 'in-progress').length
  const totalFeatures = projects.reduce((sum, project) => sum + project.features.length, 0)
  const totalRoadmap = projects.reduce((sum, project) => sum + project.roadmap.length, 0)

  return {
    activeProjects,
    coreProjects,
    plannedVersions: byStatus.planned,
    releasedVersions: byStatus.released,
    totalFeatures,
    totalProjects: projects.length,
    totalRoadmap,
    totalVersions: versions.length,
    versionsInProgress: byStatus['in-progress'],
  }
}

export function countByStatus(versions: VersionNode[]): Record<VersionStatus, number> {
  return versions.reduce<Record<VersionStatus, number>>(
    (accumulator, version) => {
      accumulator[version.status] += 1
      return accumulator
    },
    { released: 0, 'in-progress': 0, planned: 0 },
  )
}

export function getNextVersions(projects: Project[], limit = 8) {
  return flattenAllVersions(projects)
    .filter((record) => record.version.status !== 'released')
    .sort((left, right) => left.version.date.localeCompare(right.version.date))
    .slice(0, limit)
}

export function getLatestReleased(projects: Project[], limit = 6) {
  return flattenAllVersions(projects)
    .filter((record) => record.version.status === 'released')
    .sort((left, right) => right.version.date.localeCompare(left.version.date))
    .slice(0, limit)
}
