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
  const sidebarRef = useRef<HTMLDivElement>(null)

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }
  
  const handleMouseEnter = () => {
    document.body.classList.add("sidebar-scrolling");
    // Also add class to main content if you have a ref to it
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.add('main-content-locked');
    }
  };

  const handleMouseLeave = () => {
    document.body.classList.remove("sidebar-scrolling");
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.remove('main-content-locked');
    }
  };

  // Handle wheel events on the sidebar
  const handleWheel = useCallback((e: WheelEvent) => {
    if (sidebarRef.current) {
      e.stopPropagation();
      // Allow the sidebar to scroll naturally
      sidebarRef.current.scrollTop += e.deltaY;
    }
  }, []);

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (document.querySelector('.sidebar-scrolling')) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const scrollAmount = e.key === 'ArrowUp' ? -50 : 50;
        if (sidebarRef.current) {
          sidebarRef.current.scrollTop += scrollAmount;
        }
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, []);

  return (
    <div
      className="hidden md:flex flex-col relative w-72 border-r border-neutral-800 dark:border-neutral-100 bg-#d9c8c5/80 dark:bg-#1e1f24/80 backdrop-blur-sm flex-shrink-0"
    >
      <div className="flex-1 flex flex-col gap-2 h-screen">
        {/* Fixed Header */}
        <div className="flex h-16 items-center justify-between border-neutral-800 dark:border-neutral-100 px-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/LOGO1.png" alt="QToolsAI Logo" width={70} height={100} />
            <span className="text-lg font-bold font-michroma">QToolsAI</span>
          </Link>
          <ThemeToggle />
        </div>
        
        {/* Scrollable Content */}
        <div 
            ref={sidebarRef}
            className="flex-1 overflow-y-auto py-2 sidebar-scroll"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
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
    </div>
  )
}