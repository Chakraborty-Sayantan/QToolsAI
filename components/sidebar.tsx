"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChevronDown } from "lucide-react"
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { sidebarItems } from "@/lib/sidebar-data"

export function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>([])
  const [isResizing, setIsResizing] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(288)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebarWidth")
    if (savedWidth) {
      setSidebarWidth(Math.min(Math.max(Number(savedWidth), 200), 500))
    }
  }, [])

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    setIsResizing(true)
    mouseDownEvent.preventDefault()
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX
      if (newWidth >= 200 && newWidth <= 500) { 
        setSidebarWidth(newWidth)
        localStorage.setItem("sidebarWidth", String(newWidth))
      }
    }
  }, [isResizing])

  useEffect(() => {
    window.addEventListener("mousemove", resize)
    window.addEventListener("mouseup", stopResizing)
    return () => {
      window.removeEventListener("mousemove", resize)
      window.removeEventListener("mouseup", stopResizing)
    }
  }, [resize, stopResizing])
  
  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [isResizing])

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  return (
    <div
      ref={sidebarRef}
      className="hidden md:flex relative border-r bg-background/80 dark:bg-slate-900/80 backdrop-blur-sm flex-shrink-0"
      style={{ width: sidebarWidth }}
    >
      <div className="flex-1 flex flex-col gap-2 overflow-y-hidden">
        <div className="flex h-16 items-center justify-between border-b px-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/LOGO1.png" alt="QToolsAI Logo" width={70} height={100} />
            <span className="text-lg font-bold font-michroma">QToolsAI</span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {sidebarItems.map((item, index) => {
              const isOpen = openSections.includes(item.title)
              return item.items ? (
                <div key={index} className="px-3 py-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => toggleSection(item.title)}
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      {item.title}
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                  </Button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pl-4 pt-2">
                          {item.items.map((subItem, subIndex) => (
                            <Button
                              key={subIndex}
                              variant={pathname === subItem.href ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start",
                                pathname === subItem.href && "font-bold"
                              )}
                              asChild
                            >
                              <Link href={subItem.href}>
                                {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                {subItem.title}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  key={index}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "font-bold"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>
      </div>
      <div
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize bg-transparent hover:bg-primary/10 transition-colors"
        onMouseDown={startResizing}
      />
    </div>
  )
}
