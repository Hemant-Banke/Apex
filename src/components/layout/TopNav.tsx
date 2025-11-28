"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Mountain } from "lucide-react"

export function TopNav() {
    const pathname = usePathname()

    // Simple check to see if we are in "Portfolio" mode (default for now)
    const isPortfolio = true;

    return (
        <div className="border-b bg-background/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex h-16 items-center px-4 md:px-8">
                <div className="mr-8 flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Mountain className="h-5 w-5" />
                    </div>
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        Apex
                    </span>
                </div>
                <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
                    <Link
                        href="/"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isPortfolio ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Portfolio
                    </Link>
                    <Link
                        href="/money"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary text-muted-foreground opacity-50 cursor-not-allowed"
                        )}
                        title="Coming Soon"
                    >
                        Money Tracker
                    </Link>
                </nav>
                <div className="ml-auto flex items-center space-x-4">
                    {/* User profile or other actions */}
                </div>
            </div>
        </div>
    )
}
