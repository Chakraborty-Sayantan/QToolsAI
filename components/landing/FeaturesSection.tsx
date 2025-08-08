"use client"

import { motion } from "framer-motion"
import { Sparkles, Zap, Code, Brain, PenToolIcon as Tool } from "lucide-react"

export function FeaturesSection() {
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

  return (
    <section id="features" className="container py-12 md:py-24">
      <div className="mx-auto max-w-[980px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 mb-12 text-center text-3xl font-bold leading-tight tracking-tighter md:text-4xl"
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
              x: [0, -328 * features.length], // Adjusted for new width + gap
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
            {[...features, ...features].map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="flex-shrink-0 w-[300px] rounded-lg border border-primary/10 bg-transparent p-6 transition-all"
                whileHover={{ 
                  scale: 1.03,
                  borderColor: "hsl(var(--primary))",
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.1)",
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
  )
}
