"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    PieChart,
    TrendingUp,
    Coins,
    Landmark,
    Wallet,
    Settings,
    FileText,
    Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: "Overview",
            icon: LayoutDashboard,
            href: "/",
            active: pathname === "/",
        },
        {
            label: "Stocks",
            icon: TrendingUp,
            href: "/assets?type=STOCK",
            active: pathname === "/assets" && typeof window !== 'undefined' && window.location.search.includes("STOCK"),
        },
        {
            label: "Mutual Funds",
            icon: PieChart,
            href: "/assets?type=MF",
            active: pathname === "/assets" && typeof window !== 'undefined' && window.location.search.includes("MF"),
        },
        {
            label: "Gold",
            icon: Coins,
            href: "/assets?type=GOLD",
            active: pathname === "/assets" && typeof window !== 'undefined' && window.location.search.includes("GOLD"),
        },
        {
            label: "Crypto",
            icon: Wallet,
            href: "/assets?type=CRYPTO",
            active: pathname === "/assets" && typeof window !== 'undefined' && window.location.search.includes("CRYPTO"),
        },
        {
            label: "EPF / PPF",
            icon: Landmark,
            href: "/assets?type=EPF",
            active: pathname === "/assets" && typeof window !== 'undefined' && window.location.search.includes("EPF"),
        },
        {
            label: "Transactions",
            icon: FileText,
            href: "/transactions",
            active: pathname === "/transactions",
        },
        {
            label: "Import Data",
            icon: FileText, // Reusing icon for now
            href: "/import",
            active: pathname === "/import",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/settings",
            active: pathname === "/settings",
        },
    ]

    return (
        <div className={cn("pb-12 min-h-screen border-r bg-background/50 backdrop-blur-xl", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    route.active && "bg-secondary/50"
                                )}
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className="mr-2 h-4 w-4" />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
                        <h3 className="font-semibold leading-none tracking-tight mb-2 text-sm">Quick Add</h3>
                        <p className="text-xs text-muted-foreground mb-4">Record a new investment.</p>
                        <Button className="w-full" size="sm" asChild>
                            <Link href="/assets">
                                <Plus className="mr-2 h-4 w-4" /> Add Asset
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
