"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, ListTodo } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h1 className="text-xl font-bold tracking-tight text-primary">
            CAD Collections Overview
          </h1>
        </div>

        {/* PPA Division */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            PPA
          </h2>
          <div className="space-y-1">
            <Link href="/ppa">
              <Button variant={pathname === "/ppa" ? "secondary" : "ghost"} className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Overview
              </Button>
            </Link>
            <Link href="/ppa/actions">
              <Button variant={pathname === "/ppa/actions" ? "secondary" : "ghost"} className="w-full justify-start">
                <ListTodo className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </Link>
          </div>
        </div>

        {/* MCS Division */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            MCS
          </h2>
          <div className="space-y-1">
            <Link href="/mcs">
              <Button variant={pathname === "/mcs" ? "secondary" : "ghost"} className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Overview
              </Button>
            </Link>
            <Link href="/mcs/actions">
              <Button variant={pathname === "/mcs/actions" ? "secondary" : "ghost"} className="w-full justify-start">
                <ListTodo className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </Link>
          </div>
        </div>

        {/* EPM Division */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            EPM
          </h2>
          <div className="space-y-1">
            <Link href="/epm">
              <Button variant={pathname === "/epm" ? "secondary" : "ghost"} className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Overview
              </Button>
            </Link>
            <Link href="/epm/actions">
              <Button variant={pathname === "/epm/actions" ? "secondary" : "ghost"} className="w-full justify-start">
                <ListTodo className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 