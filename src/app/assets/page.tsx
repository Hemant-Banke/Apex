"use client"

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { AddAssetForm } from "@/components/forms/AddAssetForm";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AssetsContent() {
    const assets = useLiveQuery(() => db.assets.toArray());
    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams();
    const typeFilter = searchParams.get("type");

    const filteredAssets = assets?.filter(asset =>
        !typeFilter || asset.type === typeFilter
    );

    const title = typeFilter
        ? `${typeFilter.charAt(0) + typeFilter.slice(1).toLowerCase().replace('_', ' ')} Assets`
        : "All Assets";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Add Investment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Investment</DialogTitle>
                            <DialogDescription>
                                Add a new {typeFilter?.toLowerCase() || "asset"} to your portfolio.
                            </DialogDescription>
                        </DialogHeader>
                        <AddAssetForm onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Current Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAssets?.map((asset) => (
                                <TableRow key={asset.id}>
                                    <TableCell className="font-medium">{asset.name}</TableCell>
                                    <TableCell>{asset.symbol || "-"}</TableCell>
                                    <TableCell>{asset.type}</TableCell>
                                    <TableCell className="text-right">
                                        {asset.currentPrice ? `₹${asset.currentPrice.toFixed(2)}` : "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredAssets?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No assets found in this category.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AssetsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AssetsContent />
        </Suspense>
    )
}
