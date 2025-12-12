import { AssetType } from "@/types";

export interface SearchResult {
    symbol: string;
    name: string;
    type: AssetType;
    price: number;
}

const MOCK_DB: SearchResult[] = [
    { symbol: "RELIANCE.NS", name: "Reliance Industries", type: "STOCK", price: 2450.00 },
    { symbol: "TCS.NS", name: "Tata Consultancy Services", type: "STOCK", price: 3400.00 },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank", type: "STOCK", price: 1600.00 },
    { symbol: "INFY.NS", name: "Infosys", type: "STOCK", price: 1450.00 },
    { symbol: "ITC.NS", name: "ITC Limited", type: "STOCK", price: 440.00 },
    { symbol: "AAPL", name: "Apple Inc.", type: "FOREIGN_EQUITY", price: 14500.00 },
    { symbol: "MSFT", name: "Microsoft Corp", type: "FOREIGN_EQUITY", price: 25000.00 },
    { symbol: "BTC-USD", name: "Bitcoin", type: "CRYPTO", price: 3500000.00 },
    { symbol: "ETH-USD", name: "Ethereum", type: "CRYPTO", price: 250000.00 },
    { symbol: "HDFC-MF", name: "HDFC Top 100 Fund", type: "MF", price: 540.00 },
    { symbol: "SBI-MF", name: "SBI Bluechip Fund", type: "MF", price: 120.00 },
];

export const searchAssets = async (query: string): Promise<SearchResult[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!query) return [];

    return MOCK_DB.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.symbol.toLowerCase().includes(query.toLowerCase())
    );
};

export const getHistoricalPrice = async (symbol: string, date: Date): Promise<number | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find the mock asset
    const asset = MOCK_DB.find(a => a.symbol === symbol);
    if (!asset) return null;

    // Simulate price fluctuation based on date
    // Simple logic: Price = Current Price * (Random factor based on date hash)
    const dateHash = date.getTime() % 1000;
    const factor = 1 + ((dateHash - 500) / 2000); // +/- 25% variation

    return Number((asset.price * factor).toFixed(2));
}
