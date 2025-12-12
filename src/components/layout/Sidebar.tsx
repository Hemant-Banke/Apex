"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    PieChart,
    Menu,
    IndianRupee,
    X,
    LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

const ApexLogo = ({ className }: { className?: string }) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M16 2L2 26H30L16 2Z" className="fill-foreground" />
        <path d="M16 8L8 22H24L16 8Z" className="fill-background" />
    </svg>
)

export function Sidebar({ className }: SidebarProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile Header & Trigger */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background border-b border-border">
                <div className="flex items-center gap-2">
                    <ApexLogo className="h-6 w-6" />
                    <span className="font-serif text-2xl font-bold tracking-tighter">Apex</span>
                </div>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        {/* Better Styled Menu Button (Neo-brutal) */}
                        <Button variant="neobrutal" className="h-10 w-10 p-0 flex items-center justify-center">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>

                    {/* Full Screen Mobile Menu */}
                    <SheetContent side="top" className="w-screen h-screen p-0 bg-background border-none slide-in-from-top duration-300">
                        <div className="flex flex-col h-full relative">
                            {/* Close Button */}
                            <div className="absolute top-4 right-4">
                                <SheetClose asChild>
                                    <Button variant="neobrutal" className="h-10 w-10 p-0 flex items-center justify-center text-black bg-primary border-black">
                                        <X className="h-6 w-6" />
                                    </Button>
                                </SheetClose>
                            </div>

                            <div className="flex flex-col items-center justify-center h-full space-y-8 p-8">
                                <div className="flex items-center gap-3 mb-8 scale-150">
                                    <ApexLogo />
                                    <span className="font-serif text-3xl font-bold tracking-tighter">Apex</span>
                                </div>

                                <nav className="flex flex-col gap-6 w-full max-w-xs text-center">
                                    <MobileLink href="/" icon={LayoutDashboard} label="Dashboard" setOpen={setOpen} />
                                    <MobileLink href="/assets" icon={PieChart} label="Assets" setOpen={setOpen} />
                                    <MobileLink href="/money-tracker" icon={IndianRupee} label="Money Tracker" setOpen={setOpen} />
                                </nav>

                                <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
                                    <Button variant="outline" className="w-full h-12 rounded-none border-white/20 text-muted-foreground uppercase tracking-widest text-sm font-bold">
                                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                    </Button>
                                    <div className="text-center text-xs text-muted-foreground font-mono">
                                        v1.2 • Synced
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar (Unchanged mostly) */}
            <div className={cn("hidden md:flex flex-col border-r border-[#27272a] bg-background h-screen z-40 pt-8", className)}>
                <SidebarContent />
            </div>
        </>
    )
}

function MobileLink({ href, icon: Icon, label, setOpen }: any) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
                "group flex items-center justify-center gap-4 text-2xl font-serif font-bold transition-all p-4 border border-transparent hover:border-white/20 hover:bg-white/5",
                isActive ? "text-primary border-primary/20 bg-primary/5" : "text-muted-foreground"
            )}
        >
            <Icon className={cn("h-6 w-6", isActive ? "text-primary" : "text-muted-foreground")} />
            {label}
        </Link>
    )
}

function SidebarContent() {
    const pathname = usePathname();

    const routes = [
        { label: "Dashboard", href: "/", active: pathname === "/" },
        { label: "Assets", href: "/assets", active: pathname === "/assets" || pathname?.startsWith("/assets") },
        { label: "Money Tracker", href: "/money-tracker", active: pathname === "/money-tracker" },
    ]

    return (
        <div className="flex flex-col h-full">
            <div className="flex px-6 mb-12">
                <div className="flex items-center gap-3">
                    <ApexLogo />
                    <span className="font-serif text-3xl font-bold tracking-tighter text-foreground">Apex</span>
                </div>
            </div>

            <div className="flex-1 px-0 space-y-2">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex items-center gap-4 px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all hover:bg-white/5",
                            route.active ? "text-primary border-r-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {route.label}
                    </Link>
                ))}
            </div>
        </div>
    )
}
