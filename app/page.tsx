"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Zap, Code, Brain, PenToolIcon as Tool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  // Ensure theme toggle works correctly
  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: Sparkles,
      title: "AI Content Generation",
      description: "Create high-quality content with advanced AI models",
    },
    {
      icon: Code,
      title: "Code Assistance",
      description: "Get explanations and help with your code",
    },
    {
      icon: Zap,
      title: "Productivity Tools",
      description: "Boost your workflow with specialized utilities",
    },
    {
      icon: Brain,
      title: "Smart Utilities",
      description: "Intelligent tools for everyday tasks",
    },
    {
      icon: Tool,
      title: "Customizable Tools",
      description: "Adapt tools to your specific needs",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  return (
    <motion.div 
      className="flex min-h-screen flex-col bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="sticky top-0 z-40 border-b">
        <motion.div 
          className="container flex h-16 items-center justify-between"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">QToolsAI</span>
          </div>
          {mounted && <ThemeToggle />}
        </motion.div>
      </header>

      <main className="flex-1">
        <section className="container py-24 sm:py-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center"
          >
            <motion.h1
              initial={{ opacity: 1 }}
              className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1, delayChildren: 0.3 }}
              >
                {"Your Complete ".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  className="text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: "Your Complete ".length * 0.1 }}
                >
                  {"AI-Powered".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: ("Your Complete ".length + index) * 0.1 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
                {" Toolkit".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: ("Your Complete AI-Powered".length + index) * 0.1 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="max-w-[700px] text-lg text-muted-foreground md:text-xl"
            >
              Access dozens of intelligent tools and utilities to boost your productivity and creativity.
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

        <section className="container py-12 md:py-24">
          <div className="mx-auto max-w-[980px]">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12 text-center text-3xl font-bold leading-tight tracking-tighter md:text-4xl"
            >
              Powerful Features at Your Fingertips
            </motion.h2>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative overflow-hidden"
            >
              <motion.div
                animate={{
                  x: [0, -100 * features.length],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                  },
                }}
                className="flex gap-8"
              >
                {/* Original features */}
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="flex-shrink-0 w-[300px] rounded-lg border bg-card p-6 shadow-sm transition-all"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  >
                    <motion.div 
                      className="mb-4 rounded-full bg-primary/10 p-3 w-fit"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
                {/* Duplicate features for seamless loop */}
                {features.map((feature, index) => (
                  <motion.div
                    key={`duplicate-${index}`}
                    variants={item}
                    className="flex-shrink-0 w-[300px] rounded-lg border bg-card p-6 shadow-sm transition-all"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  >
                    <motion.div 
                      className="mb-4 rounded-full bg-primary/10 p-3 w-fit"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="border-t">
          <motion.div 
            className="container py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mx-auto max-w-[980px] text-center"
            >
              <h2 className="mb-6 text-3xl font-bold">Ready to Get Started?</h2>
              <p className="mb-8 text-muted-foreground">
                Explore our comprehensive suite of AI-powered tools and utilities.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Explore All Options <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <motion.footer 
        className="border-t py-6 md:py-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} QToolsAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="http://maito:c.sayantan2000@gmail.com/" className="text-sm text-muted-foreground hover:underline">
              Contact: Sayantan
            </Link>
                      </div>
        </div>
      </motion.footer>
    </motion.div>
  )
}

