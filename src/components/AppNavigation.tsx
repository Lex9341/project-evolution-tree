import { motion } from 'framer-motion'
import { GitBranch, LayoutDashboard, Map, Network, PanelsTopLeft } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Overview', Icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', Icon: PanelsTopLeft },
  { to: '/roadmap', label: 'Roadmap', Icon: Map },
]

export function AppNavigation() {
  return (
    <motion.header
      className="app-navigation glass-panel"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <NavLink className="brand-mark" to="/" aria-label="Project Evolution Tree home">
        <span className="brand-icon">
          <Network size={18} />
        </span>
        <span>
          <strong>Evolution Tree</strong>
          <small>Project OS</small>
        </span>
      </NavLink>

      <nav className="nav-links" aria-label="Primary navigation">
        {links.map(({ to, label, Icon }) => (
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to={to} key={to}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <a className="nav-cta" href="#/roadmap">
        <GitBranch size={16} />
        Release map
      </a>
    </motion.header>
  )
}
