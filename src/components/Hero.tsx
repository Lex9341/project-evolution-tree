import { motion } from 'framer-motion'
import { ArrowDown, GitBranch, Network, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="hero-section">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="hero-kicker">
          <Network size={16} />
          Living changelog system
        </p>
        <h1>Project Evolution Tree</h1>
        <p className="hero-subtitle">
          A serious portfolio command center: every project, major release, branch, patch,
          feature, fix and future milestone in one animated developer-grade system.
        </p>
        <div className="hero-actions">
          <motion.a
            href="#projects"
            className="hero-cta"
            whileHover={{ y: -2, boxShadow: '0 0 42px rgba(42, 240, 160, 0.36)' }}
            whileTap={{ scale: 0.98 }}
          >
            Explore tree
            <ArrowDown size={18} />
          </motion.a>
          <motion.a
            href="#/roadmap"
            className="hero-cta secondary"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Roadmap
            <GitBranch size={18} />
          </motion.a>
        </div>
        <div className="hero-proof-grid" aria-label="System principles">
          <span><Sparkles size={15} /> Major versions stay on trunk</span>
          <span><Sparkles size={15} /> Minor versions become branches</span>
          <span><Sparkles size={15} /> Patch versions become sub-branches</span>
        </div>
      </motion.div>
    </section>
  )
}
