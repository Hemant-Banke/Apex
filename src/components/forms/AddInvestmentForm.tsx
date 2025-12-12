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
import { useState, useEffect } from "react"
import { AssetType } from "@/types"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

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

    const isStockOrCrypto = type === 'STOCK' || type === 'CRYPTO' || type === 'MF' || type === 'GOLD';

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <div className="space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Asset Details</h3>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={`e.g. ${type === 'STOCK' ? 'Reliance Industries' : 'HDFC Mutual Fund'}`} {...field} />
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
                                    <FormLabel>Ticker / Symbol (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. RELIANCE.NS" {...field} />
                                    </FormControl>
                                    <FormDescription>Used for live price updates.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Purchase Details</h3>

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of Purchase</FormLabel>
                                {isMobile ? (
                                    // Native Mobile Date Picker
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
                                    // Desktop Popover Picker - Reverted to Standard Shadcn Calendar
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
                                    <FormLabel>Price per Unit</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="any" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={loading} variant="neobrutal-primary">
                        {loading ? "Adding..." : "Add Investment"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
