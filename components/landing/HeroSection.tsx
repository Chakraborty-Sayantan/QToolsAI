"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

export function HeroSection() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const titleAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const letterAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <section className="container py-24 sm:py-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center"
      >
        <motion.div variants={fadeInUp} className="mb-6">
          <div
            className={cn(
              "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ Zero SignUp Required</span>
              <ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </div>
        </motion.div>

        {/* ─── Mobile: two lines ───────────────────────── */}
        <motion.div
          variants={titleAnimation}
          initial="hidden"
          animate="visible"
          className="block sm:hidden"
        >
          <motion.h2
            whileHover={{
              textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
              transition: { duration: 0.3 },
            }}
            className="text-4xl font-bold text-primary font-michroma"
          >
            {"QTools".split("").map((char, idx) => (
              <motion.span key={idx} variants={letterAnimation} className="inline-block">
                {char}
              </motion.span>
            ))}
          </motion.h2>
          <motion.h2
            whileHover={{
              textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
              transition: { duration: 0.3 },
            }}
            className="text-3xl font-bold text-primary font-michroma"
          >
            {"AI".split("").map((char, idx) => (
              <motion.span key={idx} variants={letterAnimation} className="inline-block">
                {char}
              </motion.span>
            ))}
          </motion.h2>
        </motion.div>

        {/* ─── Desktop: single line ────────────────────── */}
        <motion.h2
          variants={titleAnimation}
          initial="hidden"
          animate="visible"
          whileHover={{
            textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
            transition: { duration: 0.3 },
          }}
          className="hidden sm:flex text-[100px] md:text-[80px] font-bold text-primary font-michroma tracking-tighter pb-8"
        >
          {"QTools AI".split("").map((char, idx) => (
            <motion.span key={idx} variants={letterAnimation} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>

        {/* Sub-headline */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Your Complete{" "}
          <span className="text-primary">AI-Powered</span> Toolkit
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="max-w-[700px] text-lg text-muted-foreground md:text-xl"
        >
          Access dozens of intelligent tools and utilities to boost your
          productivity and creativity.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6"
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/dashboard">
              Explore All Options <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}