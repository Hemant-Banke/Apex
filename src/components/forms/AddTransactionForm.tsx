"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { db } from "@/lib/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useState } from "react"

const formSchema = z.object({
    assetId: z.string().min(1, "Please select an asset"),
    date: z.date(),
    type: z.enum(["BUY", "SELL"]),
    quantity: z.coerce.number().positive("Quantity must be positive"),
    price: z.coerce.number().positive("Price must be positive"),
    fees: z.coerce.number().min(0).optional(),
})

interface AddTransactionFormProps {
    assetId?: number;
    onSuccess?: () => void;
}

export function AddTransactionForm({ assetId, onSuccess }: AddTransactionFormProps) {
    const [loading, setLoading] = useState(false);
    const assets = useLiveQuery(() => db.assets.toArray());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useForm<z.infer<typeof formSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            assetId: assetId?.toString() || "",
            date: new Date(),
            type: "BUY",
            quantity: 0,
            price: 0,
            fees: 0,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await db.transactions.add({
                assetId: parseInt(values.assetId),
                date: values.date,
                type: values.type,
                quantity: values.quantity,
                price: values.price,
                fees: values.fees || 0,
            });
            form.reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to add transaction:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="assetId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Asset</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={!!assetId}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an asset" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {assets?.map((asset) => (
                                        <SelectItem key={asset.id} value={asset.id?.toString() || ""}>
                                            {asset.name} ({asset.symbol || asset.type})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
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
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="BUY">Buy</SelectItem>
                                        <SelectItem value="SELL">Sell</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    <FormField
                        control={form.control}
                        name="fees"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fees (Optional)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="any" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Adding..." : "Add Transaction"}
                </Button>
            </form>
        </Form>
    )
}
