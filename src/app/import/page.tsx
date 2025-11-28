"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseCAS } from "@/lib/cas-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleImport = async () => {
        if (!file) return;
        setLoading(true);
        setLogs([]);

        try {
            setLogs(prev => [...prev, "Starting import..."]);
            const transactions = await parseCAS(file, password);
            setLogs(prev => [...prev, `Parsed ${transactions.length} transactions.`]);
            // TODO: Save transactions to DB
        } catch (error) {
            setLogs(prev => [...prev, `Error: ${(error as Error).message}`]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Import CAS PDF</CardTitle>
                    <CardDescription>
                        Upload your Consolidated Account Statement (CAS) from CDSL/NSDL.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="cas-file">CAS PDF File</Label>
                        <Input id="cas-file" type="file" accept=".pdf" onChange={handleFileChange} />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="password">Password (usually PAN)</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter PDF password"
                        />
                    </div>

                    <Button onClick={handleImport} disabled={!file || loading}>
                        {loading ? "Importing..." : "Import CAS"}
                    </Button>

                    {logs.length > 0 && (
                        <div className="mt-4 rounded-md bg-muted p-4">
                            <pre className="text-xs whitespace-pre-wrap">
                                {logs.join('\n')}
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
