"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AddInvestmentForm } from "./AddInvestmentForm"
import { AssetType } from "@/types"
import { Building2, Bitcoin, Landmark, BadgeIndianRupee } from "lucide-react"

interface AddInvestmentDialogProps {
    children: React.ReactNode
    defaultType?: AssetType
}

const assetTypes: { type: AssetType; label: string; desc: string; icon: any }[] = [
    { type: 'STOCK', label: 'Stocks', desc: 'Direct Equity', icon: Building2 },
    { type: 'MF', label: 'Mutual Funds', desc: 'SIPs & Lumpsum', icon: Landmark },
    { type: 'GOLD', label: 'Gold', desc: 'Digital & Physical', icon: BadgeIndianRupee },
    { type: 'CRYPTO', label: 'Crypto', desc: 'Coins & Tokens', icon: Bitcoin },
];

export function AddInvestmentDialog({ children, defaultType }: AddInvestmentDialogProps) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState<'TYPE_SELECTION' | 'DETAILS'>('TYPE_SELECTION')
    const [selectedType, setSelectedType] = useState<AssetType | null>(null)

    // Initialize with defaultType if provided
    React.useEffect(() => {
        if (defaultType) {
            setSelectedType(defaultType);
            setStep('DETAILS');
        }
    }, [defaultType]);

    const handleTypeSelect = (type: AssetType) => {
        setSelectedType(type)
        setStep('DETAILS')
    }

    const reset = () => {
        setOpen(false)
        setTimeout(() => {
            setStep('TYPE_SELECTION')
            setSelectedType(null)
        }, 300)
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
            <DialogContent className="sm:max-w-[425px] bg-[#09090b] border border-[#27272a] shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 border-b border-[#27272a] bg-[#09090b]">
                    <DialogTitle className="text-xl font-serif font-bold">
                        {step === 'TYPE_SELECTION' ? 'Select Asset Type' : `Add ${selectedType} Investment`}
                    </DialogTitle>
                    <DialogDescription className="text-xs font-mono uppercase tracking-widest">
                        {step === 'TYPE_SELECTION' ? 'Choose what you want to track' : 'Enter transaction details'}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 bg-[#09090b]">
                    {step === 'TYPE_SELECTION' && (
                        <div className="grid grid-cols-1 gap-4">
                            {assetTypes.map((item) => (
                                <button
                                    key={item.type}
                                    onClick={() => handleTypeSelect(item.type)}
                                    className="flex items-center gap-4 p-4 border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] hover:border-[#27272a] transition-all text-left shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] group"
                                >
                                    <div className="h-10 w-10 flex items-center justify-center bg-[#09090b] border border-[#27272a] text-muted-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold font-serif text-foreground group-hover:text-primary transition-colors">{item.label}</h3>
                                        <p className="text-xs text-muted-foreground font-mono">{item.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 'DETAILS' && selectedType && (
                        <AddInvestmentForm
                            type={selectedType}
                            onSuccess={reset}
                            onCancel={() => setStep('TYPE_SELECTION')}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
