"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Building2, Bitcoin, Landmark, BadgeIndianRupee,
    Globe, PiggyBank, Briefcase, FileBadge,
    Wallet, CreditCard, Banknote, Landmark as Bank
} from "lucide-react"
import { useState } from "react"
import { AddInvestmentForm } from "./AddInvestmentForm"
import { AssetType } from "@/types"

interface AddInvestmentDialogProps {
    children: React.ReactNode;
    defaultType?: AssetType; // Optional prop to pre-select a type
}

const assetTypes: { type: AssetType; label: string; icon: any }[] = [
    { type: 'STOCK', label: 'Stocks', icon: Building2 },
    { type: 'MF', label: 'Mutual Funds', icon: Landmark },
    { type: 'FOREIGN_EQUITY', label: 'Foreign Equity', icon: Globe },
    { type: 'GOLD', label: 'Gold / Commodities', icon: BadgeIndianRupee },
    { type: 'CRYPTO', label: 'Crypto', icon: Bitcoin },
    { type: 'FD', label: 'Fixed Deposit', icon: Banknote },
    { type: 'BOND', label: 'Bonds', icon: FileBadge },
    { type: 'EPF', label: 'EPF / PPF', icon: PiggyBank },
    { type: 'REAL_ESTATE', label: 'Real Estate', icon: Building2 },
    { type: 'ESOP', label: 'ESOPs / RSUs', icon: Briefcase },
]

export function AddInvestmentDialog({ children, defaultType }: AddInvestmentDialogProps) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState<'TYPE_SELECTION' | 'DETAILS'>('TYPE_SELECTION')
    const [selectedType, setSelectedType] = useState<AssetType | null>(defaultType || null)

    // Reset or Initialize based on props/state
    const handleTypeSelect = (type: AssetType) => {
        setSelectedType(type)
        // Add a small delay for better UX
        setTimeout(() => setStep('DETAILS'), 100)
    }

    const handleBack = () => {
        setStep('TYPE_SELECTION')
        setSelectedType(null)
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (open) {
            setStep('TYPE_SELECTION');
            setSelectedType(null);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-[#09090b] border border-[#27272a] shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 border-b border-[#27272a] bg-[#09090b]">
                    <DialogTitle className="text-xl font-serif font-bold tracking-tight">
                        {step === 'TYPE_SELECTION' ? 'Select Asset Type' : `Add ${assetTypes.find(t => t.type === selectedType)?.label}`}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {step === 'TYPE_SELECTION' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {assetTypes.map((item) => (
                                <button
                                    key={item.type}
                                    onClick={() => handleTypeSelect(item.type)}
                                    className="flex flex-col items-center justify-center gap-3 p-4 border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] hover:border-[#27272a] transition-all text-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] group h-32"
                                >
                                    <div className="h-10 w-10 flex items-center justify-center bg-[#09090b] border border-[#27272a] text-muted-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all rounded-full">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Back Button for UX */}
                            <button onClick={handleBack} className="text-xs text-muted-foreground hover:text-primary underline mb-4">
                                ← Change Asset Type
                            </button>

                            {selectedType && (
                                <AddInvestmentForm
                                    type={selectedType}
                                    onSuccess={() => setOpen(false)}
                                    onCancel={() => setOpen(false)}
                                />
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
