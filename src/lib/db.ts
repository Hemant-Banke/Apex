import Dexie, { Table } from 'dexie';
import { Asset, Transaction } from '@/types';

export class PortfolioDatabase extends Dexie {
    assets!: Table<Asset, number>;
    transactions!: Table<Transaction, number>;

    constructor() {
        super('PortfolioTrackerDB');
        this.version(1).stores({
            assets: '++id, symbol, type',
            transactions: '++id, assetId, date, type'
        });
    }
}

export const db = new PortfolioDatabase();
