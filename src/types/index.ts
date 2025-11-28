export type AssetType = 'STOCK' | 'MF' | 'GOLD' | 'CRYPTO' | 'EPF' | 'PPF' | 'REAL_ESTATE' | 'CASH';

export interface Asset {
  id?: number;
  symbol?: string; // Ticker symbol (e.g., RELIANCE.NS, BTC-USD)
  name: string;
  type: AssetType;
  currentPrice?: number;
  lastUpdated?: Date;
}

export interface Transaction {
  id?: number;
  assetId: number;
  date: Date;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number; // Price per unit
  fees?: number;
  notes?: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  absoluteReturn: number;
  absoluteReturnPercent: number;
  xirr: number;
}
