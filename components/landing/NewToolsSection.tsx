"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Train, Palette, Gamepad2, ArrowRight } from "lucide-react"

const newTools = [
  {
    title: "PNR Status Checker",
    description: "Check your Indian Railways PNR status instantly.",
    icon: Train,
    href: "/utilities/pnr-status-checker",
  },
  {
    title: "Creative Name Generator",
    description: "Generate unique names for your business or project.",
    icon: Palette,
    href: "/ai-tools/creative-name-generator",
  },
  {
    title: "Tic-Tac-Toe",
    description: "Play the classic game against a friend or our AI.",
    icon: Gamepad2,
    href: "/games/tic-tac-toe",
  },
]

export function NewToolsSection() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <section className="bg-muted dark:bg-muted/50 py-12 md:py-24">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-3xl font-bold leading-tight tracking-tighter md:text-4xl"
        >
          Newly Launched Tools
        </motion.h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {newTools.map((tool, i) => (
            <motion.div
              key={tool.href}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={tool.href}>
                      Try Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
