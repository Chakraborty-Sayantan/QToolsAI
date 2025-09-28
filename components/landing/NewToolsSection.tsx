"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Braces, Zap } from "lucide-react"
import Link from "next/link"

const newTools = [
  {
    title: "Content Generator",
    description: "Generate high-quality content for blogs, social media, and more.",
    icon: Sparkles,
    href: "/ai-tools/content-generator",
  },
  {
    title: "Text Summarizer",
    description: "Summarize long articles and documents into concise summaries.",
    icon: Braces,
    href: "/ai-tools/text-summarizer",
  },
  {
    title: "Language Translator",
    description: "Translate text between multiple languages with high accuracy.",
    icon: Zap,
    href: "/ai-tools/translator",
  },
]

export function NewToolsSection() {
  return (
    <section id="new-tools" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Newly Added Tools
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our latest additions, designed to enhance your productivity and creativity.
          </p>
        </div>
        <div className="mt-12 overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{
              x: ["0%", "-100%"],
              transition: {
                ease: "linear",
                duration: 20,
                repeat: Infinity,
              },
            }}
          >
            {[...newTools, ...newTools].map((tool, index) => (
              <Card key={index} className="w-80 flex-shrink-0">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                  <Button asChild className="mt-4">
                    <Link href={tool.href}>Try it out</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}