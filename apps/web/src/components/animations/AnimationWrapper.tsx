"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimationWrapperProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  type?: "fade" | "slide-up" | "slide-right" | "zoom" | "bounce" | "wave" | "glow";
  duration?: number;
}

export function AnimationWrapper({
  children,
  delay = 0,
  className = "",
  type = "fade",
  duration = 0.6,
}: AnimationWrapperProps) {
  const variants: { [key: string]: any } = {
    fade: {
      initial: { opacity: 0, filter: "blur(8px)" },
      whileInView: { opacity: 1, filter: "blur(0)" },
      transition: { duration, delay },
    },
    "slide-up": {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration, delay, type: "spring", stiffness: 100 },
    },
    "slide-right": {
      initial: { opacity: 0, x: -100 },
      whileInView: { opacity: 1, x: 0 },
      transition: { duration, delay },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.85 },
      whileInView: { opacity: 1, scale: 1 },
      transition: { duration, delay, type: "spring", stiffness: 200 },
    },
    bounce: {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      transition: {
        duration,
        delay,
        type: "spring",
        bounce: 0.5,
        damping: 8,
      },
    },
    wave: {
      initial: { opacity: 0, y: 30, rotateX: 90 },
      whileInView: { opacity: 1, y: 0, rotateX: 0 },
      transition: { duration, delay },
    },
    glow: {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: { duration, delay },
    },
  };

  return (
    <motion.div
      className={className}
      initial={variants[type].initial}
      whileInView={variants[type].whileInView}
      transition={variants[type].transition}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Staggered Container for multiple children
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={childVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Enhanced Section Wrapper for smooth reveals
interface EnhancedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function EnhancedSection({
  children,
  className = "",
  id,
}: EnhancedSectionProps) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  );
}
