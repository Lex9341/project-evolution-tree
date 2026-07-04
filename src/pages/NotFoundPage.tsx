import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <motion.div
      className="project-page not-found-wrap"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
    >
      <section className="glass-panel not-found-card">
        <p className="panel-kicker">404 signal lost</p>
        <h1>Page not found</h1>
        <p>The requested branch does not exist in this evolution system.</p>
        <Link className="hero-cta" to="/">
          <ArrowLeft size={18} />
          Back to overview
        </Link>
      </section>
    </motion.div>
  )
}
