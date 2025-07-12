import { Variants } from 'framer-motion';

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      duration: 0.5,
    },
  },
};

export const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 100 }, // Increased y for more noticeable movement
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    y: -100,
    scale: 0.9,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      opacity: {
        duration: 0.20,
        ease: "easeOut",
      },
    },
  },
};