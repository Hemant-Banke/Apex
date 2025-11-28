"use client"

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Asset } from "@/types";

export default function TransactionsPage() {
    const transactions = useLiveQuery(async () => {
        const txs = await db.transactions.toArray();
        // Sort by date desc
        return txs.sort((a, b) => b.date.getTime() - a.date.getTime());
    });

    const assets = useLiveQuery(() => db.assets.toArray());
    const assetMap = assets?.reduce((acc, asset) => {
        if (asset.id) acc[asset.id] = asset;
        return acc;
    }, {} as Record<number, Asset>);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Asset</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions?.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>{format(tx.date, "PP")}</TableCell>
                                <TableCell>
                                    {assetMap?.[tx.assetId]?.name || "Unknown Asset"}
                                </TableCell>
                                <TableCell>
                                    <span className={tx.type === 'BUY' ? 'text-green-600' : 'text-red-600'}>
                                        {tx.type}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">{tx.quantity}</TableCell>
                                <TableCell className="text-right">₹{tx.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    ₹{(tx.quantity * tx.price).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {transactions?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
