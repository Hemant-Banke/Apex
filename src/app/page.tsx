"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Plus, Building2, Bitcoin, Landmark, BadgeIndianRupee, Newspaper, ExternalLink } from "lucide-react"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { AddInvestmentDialog } from "@/components/forms/AddInvestmentDialog"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { useState } from "react"

// Map asset types to Lucide Icons
const getAssetIcon = (type: string) => {
  switch (type) {
    case 'STOCK': return Building2;
    case 'CRYPTO': return Bitcoin;
    case 'MF': return Landmark;
    case 'GOLD': return BadgeIndianRupee;
    default: return BadgeIndianRupee;
  }
}

// Dummy News Data
const newsItems = [
  { id: 1, title: "Market hits all-time high amidst rate cut hopes", source: "Bloomberg", time: "2h ago", url: "#" },
  { id: 2, title: "Crypto regulation framework discussed in parliament", source: "TechCrunch", time: "4h ago", url: "#" },
  { id: 3, title: "Gold prices stabilize after weekly rally", source: "Reuters", time: "5h ago", url: "#" },
]

// Dummy Chart Data (Generated for smoothness)
const generateData = (points: number, startVal: number) => {
  const data = [];
  let current = startVal;
  for (let i = 0; i < points; i++) {
    current = current * (1 + (Math.random() * 0.04 - 0.015)); // Random walk
    data.push({
      date: i,
      value: current
    });
  }
  return data;
}

const chartData1D = generateData(24, 85000);
const chartData1W = generateData(7, 82000);
const chartData1M = generateData(30, 80000);
const chartData1Y = generateData(12, 40000);
const chartDataAll = generateData(50, 10000);

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1Y');

  const assets = useLiveQuery(() => db.assets.toArray());
  const transactions = useLiveQuery(() => db.transactions.toArray());

  const totalValue = assets?.reduce((acc, asset) => acc + (asset.currentPrice || 0), 0) || 0;

  // Categorize assets
  const categories = {
    Stocks: assets?.filter(a => a.type === 'STOCK').length || 0,
    Crypto: assets?.filter(a => a.type === 'CRYPTO').length || 0,
    RealEstate: assets?.filter(a => a.type === 'REAL_ESTATE').length || 0,
    Other: assets?.filter(a => !['STOCK', 'CRYPTO', 'REAL_ESTATE'].includes(a.type)).length || 0,
  };

  const totalAssets = (assets?.length || 1);
  const categoryPercentages = {
    Stocks: (categories.Stocks / totalAssets) * 100,
    Crypto: (categories.Crypto / totalAssets) * 100,
    RealEstate: (categories.RealEstate / totalAssets) * 100,
    Other: (categories.Other / totalAssets) * 100,
  }

  const getCurrentChartData = () => {
    switch (timeframe) {
      case '1D': return chartData1D;
      case '1W': return chartData1W;
      case '1M': return chartData1M;
      case '1Y': return chartData1Y;
      case 'ALL': return chartDataAll;
      default: return chartData1Y;
    }
  }

  return (
    <div className="space-y-12 md:pt-0 pt-16 pb-12">

      {/* Header & Add Button */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="md:block hidden text-5xl font-serif font-bold text-foreground tracking-tight mb-2">Dashboard</h1>
          <h1 className="md:hidden text-3xl font-serif font-bold text-foreground tracking-tight mb-1">Dashboard</h1>
          <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">Financial Overview • {new Date().getFullYear()}</p>
        </div>

        <AddInvestmentDialog>
          <Button className="hidden md:flex h-12 px-8 bg-white text-black border border-black shadow-[4px_4px_0px_0px_#71717a] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-none font-bold uppercase tracking-wider active:shadow-none hover:bg-white/90">
            <Plus className="mr-2 h-4 w-4" /> Add Investment
          </Button>
        </AddInvestmentDialog>

        <AddInvestmentDialog>
          <Button variant="neobrutal" className="md:hidden h-10 w-10 p-0 flex items-center justify-center">
            <Plus className="h-5 w-5" />
          </Button>
        </AddInvestmentDialog>
      </div>

      {/* Net Worth Section (No Card, Minimal) */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase mb-2">Total Net Worth</p>
            <div className="flex items-baseline gap-4">
              <h1 className="text-6xl font-mono font-bold tracking-tighter text-foreground">₹{totalValue.toLocaleString('en-IN')}</h1>
              <div className="font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-1 text-xs flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +2.4%
              </div>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-1 bg-[#18181b] p-1 border border-[#27272a]">
            {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`px-4 py-1.5 text-xs font-bold font-mono transition-all ${timeframe === tf
                  ? 'bg-primary text-black shadow-sm'
                  : 'text-muted-foreground hover:text-white hover:bg-[#27272a]'
                  }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[350px] w-full relative border-b border-[#27272a]">
          {/* Chart Grid Only - No Background Card */}
          <div className="h-full w-full relative z-10 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getCurrentChartData()} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.5} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
                  }}
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ borderRadius: '0px', border: '1px solid #27272a', background: '#09090b' }}
                  labelStyle={{ color: '#a1a1aa', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Net Worth']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  cursor={{ stroke: '#00ff88', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00ff88"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Asset Allocation (Minimal List) */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif font-bold border-b border-border pb-4">Allocation</h2>
          <div className="space-y-6">
            {[
              { label: 'Stocks', val: categoryPercentages.Stocks, color: 'bg-blue-600' },
              { label: 'Crypto', val: categoryPercentages.Crypto, color: 'bg-primary' },
              { label: 'Real Estate', val: categoryPercentages.RealEstate, color: 'bg-purple-600' },
              { label: 'Gold / Other', val: categoryPercentages.Other, color: 'bg-orange-600' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                  <span>{item.label}</span>
                  <span className="text-foreground">{item.val.toFixed(0)}%</span>
                </div>
                <div className="h-1 w-full bg-[#18181b]">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market News (Minimal List) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-serif font-bold border-b border-border pb-4 flex items-center justify-between">
            Market Brief
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems.map(news => (
              <a key={news.id} href={news.url} className="group cursor-pointer hover:bg-[#18181b]/50 transition-colors p-4 -ml-4 border border-transparent hover:border-[#27272a]">
                <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {news.title}
                </h3>
                <div className="flex items-center gap-2 mt-3 text-xs font-mono text-muted-foreground uppercase">
                  <span className="text-primary">{news.source}</span>
                  <span>•</span>
                  <span>{news.time}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Assets List Section */}
      <div className="pt-8">
        <div className="flex items-center justify-between mb-8 border-border border-b pb-4">
          <h2 className="text-3xl font-serif font-bold">Portfolio Holdings</h2>
          <Button variant="neobrutal" className="h-8 px-4 text-xs">
            Manage All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets?.map((asset) => {
            const Icon = getAssetIcon(asset.type);
            return (
              <div key={asset.id} className="border border-[#27272a] bg-[#09090b]/80 p-6 shadow-[4px_4px_0px_0px_#27272a] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 border border-[#27272a] bg-[#18181b] group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold font-mono">₹{(asset.currentPrice || 0).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-primary font-mono bg-primary/10 px-1">+12.5%</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif truncate">{asset.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{asset.type} • {asset.symbol}</p>
                </div>
              </div>
            );
          })}
          {(!assets || assets.length === 0) && (
            <div className="col-span-full py-16 text-center border-t border-b border-[#27272a]">
              <p className="text-muted-foreground font-serif italic text-lg">No assets found.</p>
              <AddInvestmentDialog>
                <Button variant="link" className="mt-2 text-primary">Add your first investment</Button>
              </AddInvestmentDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
