import Link from 'next/link';
import { LayoutDashboard, PieChart, Settings, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <PieChart className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">
                            Portfolio Tracker
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/assets"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Assets
                        </Link>
                        <Link
                            href="/transactions"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Transactions
                        </Link>
                        <Link
                            href="/import"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Import
                        </Link>
                        <Link
                            href="/settings"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Settings
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search or other controls can go here */}
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Transaction
                    </Button>
                </div>
            </div>
        </nav>
    );
}
