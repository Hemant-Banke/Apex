"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/db"
import { useState, useEffect, useRef } from "react"
import { AssetType } from "@/types"
import { CalendarIcon, Loader2, Check } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { searchAssets, getHistoricalPrice, SearchResult } from "@/lib/mock-api"

const formSchema = z.object({
    // Asset Details
    name: z.string().min(2, "Name must be at least 2 characters"),
    symbol: z.string().optional(),

    // Transaction Details
    date: z.date(),
    quantity: z.coerce.number().positive("Quantity must be positive"),
    price: z.coerce.number().positive("Price must be positive"),
    fees: z.coerce.number().min(0).optional(),
})

interface AddInvestmentFormProps {
    type: AssetType;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function AddInvestmentForm({ type, onSuccess, onCancel }: AddInvestmentFormProps) {
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);

    // Autocomplete & Auto-Price States
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [fetchingPrice, setFetchingPrice] = useState(false);
    const isSelectionRef = useRef(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            symbol: "",
            date: new Date(),
            quantity: 0,
            price: 0,
            fees: 0,
        },
    })

    const nameValue = form.watch('name');
    const symbolValue = form.watch('symbol');
    const dateValue = form.watch('date');

    // 1. Search Suggestions Effect
    useEffect(() => {
        const fetchSuggestions = async () => {
            // Only search for stock/crypto types
            if (!['STOCK', 'MF', 'CRYPTO', 'FOREIGN_EQUITY'].includes(type)) return;
            if (nameValue.length < 2) {
                setSuggestions([]);
                return;
            }

            if (isSelectionRef.current) {
                isSelectionRef.current = false;
                return;
            }

            // If the name exactly matches a selected suggestion, don't re-search immediately
            // (Simplification: assuming user is typing)
            const results = await searchAssets(nameValue);
            setSuggestions(results);
            setShowSuggestions(true);
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [nameValue, type]);

    // 2. Auto-Price Fetching Effect
    useEffect(() => {
        const fetchPrice = async () => {
            if (!symbolValue || !dateValue) return;
            if (form.getValues('price') > 0 && !form.formState.dirtyFields.date) return; // Don't overwrite if manually set/untouched date

            setFetchingPrice(true);
            try {
                const price = await getHistoricalPrice(symbolValue, dateValue);
                if (price) {
                    form.setValue('price', price);
                }
            } catch (error) {
                console.error("Error fetching price", error);
            } finally {
                setFetchingPrice(false);
            }
        };

        // Trigger when Symbol or Date changes
        fetchPrice();
    }, [symbolValue, dateValue, form]);


    const handleSelectSuggestion = (asset: SearchResult) => {
        isSelectionRef.current = true;
        form.setValue('name', asset.name);
        form.setValue('symbol', asset.symbol);
        setShowSuggestions(false);
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await db.transaction('rw', db.assets, db.transactions, async () => {
                // 1. Create Asset
                const assetId = await db.assets.add({
                    name: values.name,
                    symbol: values.symbol,
                    type: type,
                    currentPrice: values.price, // Initialize with buy price
                    quantity: values.quantity, // Initialize with buy quantity
                    lastUpdated: new Date(),
                });

                // 2. Create Initial Transaction
                await db.transactions.add({
                    assetId: assetId as number,
                    date: values.date,
                    type: 'BUY',
                    quantity: values.quantity,
                    price: values.price,
                    fees: values.fees || 0,
                });
            });

            form.reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to add investment:", error);
        } finally {
            setLoading(false);
        }
    }

    const isStockOrCrypto = ['STOCK', 'CRYPTO', 'MF', 'FOREIGN_EQUITY'].includes(type);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* 2-Column Layout for Tablet+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left Column: Asset Info */}
                    <div className="space-y-4">
                        <h3 className="font-serif font-bold text-sm text-foreground uppercase tracking-wider border-b border-[#27272a] pb-2">Asset Details</h3>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder={`e.g. ${type === 'STOCK' ? 'Reliance Industries' : 'HDFC Mutual Fund'}`}
                                                {...field}
                                                autoComplete="off"
                                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
                                            />
                                            {/* Dropdown Suggestions */}
                                            {showSuggestions && suggestions.length > 0 && (
                                                <div className="absolute z-[100] w-full mt-2 bg-zinc-950 border border-zinc-800 shadow-2xl max-h-60 overflow-auto rounded-lg ring-1 ring-white/10">
                                                    {suggestions.map((s) => (
                                                        <div
                                                            key={s.symbol}
                                                            className="flex items-center justify-between px-3 py-2 hover:bg-[#18181b] cursor-pointer text-sm"
                                                            onMouseDown={() => handleSelectSuggestion(s)}
                                                        >
                                                            <span>{s.name}</span>
                                                            <span className="text-xs text-muted-foreground font-mono">{s.symbol}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isStockOrCrypto && (
                            <FormField
                                control={form.control}
                                name="symbol"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ticker / Symbol</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. RELIANCE.NS" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">Used to fetch live prices.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    {/* Right Column: Transaction Info */}
                    <div className="space-y-4">
                        <h3 className="font-serif font-bold text-sm text-foreground uppercase tracking-wider border-b border-[#27272a] pb-2">Purchase Details</h3>

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of Purchase</FormLabel>
                                    {isMobile ? (
                                        <FormControl>
                                            <input
                                                type="date"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                                onChange={(e) => {
                                                    const date = e.target.value ? new Date(e.target.value) : new Date();
                                                    field.onChange(date);
                                                }}
                                            />
                                        </FormControl>
                                    ) : (
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen} modal={true}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                                side="bottom"
                                                sideOffset={4}
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => {
                                                        field.onChange(date);
                                                        setCalendarOpen(false);
                                                    }}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    captionLayout="dropdown"
                                                    fromYear={1980}
                                                    toYear={2030}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center justify-between">
                                            Price per Unit
                                            {fetchingPrice && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-[#27272a]">
                    <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={loading} variant="neobrutal-primary">
                        {loading ? "Adding..." : "Add Investment"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
