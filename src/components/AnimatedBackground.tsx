import { motion } from 'framer-motion'

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 29) % 100}%`,
  top: `${(index * 47) % 100}%`,
  delay: (index % 9) * 0.35,
  duration: 6 + (index % 7),
}))

export function AnimatedBackground() {
  return (
    <div className="animated-background" aria-hidden="true">
      <div className="grid-layer" />
      <motion.div
        className="line line-a"
        animate={{ x: ['-12%', '12%', '-12%'], opacity: [0.18, 0.45, 0.18] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="line line-b"
        animate={{ x: ['10%', '-10%', '10%'], opacity: [0.1, 0.35, 0.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      {particles.map((particle) => (
        <motion.span
          className="particle"
          key={particle.id}
          style={{ left: particle.left, top: particle.top }}
          animate={{ y: [-18, 18, -18], opacity: [0.18, 0.7, 0.18], scale: [0.8, 1.3, 0.8] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
