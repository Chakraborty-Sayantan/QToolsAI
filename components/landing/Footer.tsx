"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, User } from "lucide-react"
import Image from 'next/image'

export function Footer() {
  return (
    <motion.footer
      id ="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/LOGO1.png" alt="QToolsAI Logo" width={70} height={100} />
            <span className="text-2xl font-bold font-michroma">QToolsAI</span>
          </div>
          <p className="max-w-md mx-auto mt-2 text-muted-foreground">
            A comprehensive suite of AI-powered tools and utilities to boost your productivity and creativity.
          </p>
          <div className="flex mt-6 space-x-4">
            <div className="flex flex-col items-center group">
              <a
                href="https://github.com/chakraborty-sayantan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-6 w-6" />
              </a>
              <span className="mt-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">GitHub</span>
            </div>
            <div className="flex flex-col items-center group">
              <a
                href="https://peerlist.io/sayantan_c"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="h-6 w-6" />
              </a>
              <span className="mt-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">Peerlist</span>
            </div>
            <div className="flex flex-col items-center group">
              <a
                href="https://www.linkedin.com/in/sayantan-c12/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <span className="mt-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">LinkedIn</span>
            </div>
            <div className="flex flex-col items-center group">
              <a
                href="mailto:c.sayantan2000@gmail.com"
                className="text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-6 w-6" />
              </a>
              <span className="mt-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">Email</span>
            </div>
          </div>
        </div>

        

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} QToolsAI. All rights reserved.</p>
          <div className="flex mt-4 -mx-2 sm:mt-0">
            <p className="text-sm text-muted-foreground">
              Contact: Sayantan
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}