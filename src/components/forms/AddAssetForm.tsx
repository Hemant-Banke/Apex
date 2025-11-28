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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { db } from "@/lib/db"
import { useState } from "react"
import { AssetType } from "@/types"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    symbol: z.string().optional(),
    type: z.enum(['STOCK', 'MF', 'GOLD', 'CRYPTO', 'EPF', 'PPF', 'REAL_ESTATE', 'CASH'] as [string, ...string[]]),
})

interface AddAssetFormProps {
    onSuccess?: () => void;
}

export function AddAssetForm({ onSuccess }: AddAssetFormProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            symbol: "",
            type: "STOCK",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await db.assets.add({
                name: values.name,
                symbol: values.symbol,
                type: values.type as AssetType,
                lastUpdated: new Date(),
            });
            form.reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to add asset:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Asset Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Reliance Industries" {...field} />
                            </FormControl>
                            <FormDescription>
                                The display name for this asset.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Symbol / Ticker (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. RELIANCE.NS" {...field} />
                            </FormControl>
                            <FormDescription>
                                Used for fetching live prices.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Asset Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="STOCK">Stock</SelectItem>
                                    <SelectItem value="MF">Mutual Fund</SelectItem>
                                    <SelectItem value="GOLD">Gold</SelectItem>
                                    <SelectItem value="CRYPTO">Crypto</SelectItem>
                                    <SelectItem value="EPF">EPF</SelectItem>
                                    <SelectItem value="PPF">PPF</SelectItem>
                                    <SelectItem value="REAL_ESTATE">Real Estate</SelectItem>
                                    <SelectItem value="CASH">Cash</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Asset"}
                </Button>
            </form>
        </Form>
    )
}
