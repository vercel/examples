export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const

export const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
} as const
