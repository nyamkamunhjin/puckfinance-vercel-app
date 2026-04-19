"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getTradeAccounts,
  type TradeAccount,
  type Provider,
} from "@/lib/trade-accounts";
import {
  getBalance,
  executeEntry,
  type Balance,
} from "@/lib/exchange-client";
import {
  Crosshair,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  Percent,
  DollarSign,
} from "lucide-react";

interface TradeAlert {
  active: boolean;
  direction: "LONG" | "SHORT" | "NONE";
  entryPrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  riskRewardRatio: number | null;
}

interface TradeExecutorProps {
  symbol: string;
  tradeAlert: TradeAlert | undefined;
}

const formatUSD = (v: number) =>
  v.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function TradeExecutor({ symbol, tradeAlert }: TradeExecutorProps) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [accounts, setAccounts] = useState<TradeAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  const [riskPct, setRiskPct] = useState("2");
  const [riskAmount, setRiskAmount] = useState("");

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const hasTrade =
    tradeAlert?.active &&
    tradeAlert.direction !== "NONE" &&
    tradeAlert.entryPrice &&
    tradeAlert.stopLoss &&
    tradeAlert.takeProfit;

  const balanceNum = balance ? parseFloat(balance.availableBalance) : 0;
  const riskPctNum = parseFloat(riskPct) || 0;
  const computedRiskAmt = riskPctNum > 0 ? (balanceNum * riskPctNum) / 100 : 0;
  const effectiveRisk = riskAmount ? parseFloat(riskAmount) : computedRiskAmt;

  useEffect(() => {
    if (!accessToken) return;
    setLoadingAccounts(true);
    getTradeAccounts(accessToken)
      .then((accs) => {
        setAccounts(accs);
        if (accs.length === 1) setSelectedAccountId(accs[0].id);
      })
      .catch(() => {})
      .finally(() => setLoadingAccounts(false));
  }, [accessToken]);

  useEffect(() => {
    if (!selectedAccountId || !accessToken || !selectedAccount) {
      setBalance(null);
      return;
    }
    setLoadingBalance(true);
    getBalance(selectedAccountId, selectedAccount.provider, accessToken)
      .then((b) => setBalance(b))
      .catch(() => setBalance(null))
      .finally(() => setLoadingBalance(false));
  }, [selectedAccountId, accessToken, selectedAccount]);

  useEffect(() => {
    if (computedRiskAmt > 0 && !riskAmount) {
      setRiskAmount(computedRiskAmt.toFixed(2));
    }
  }, [computedRiskAmt, riskAmount]);

  const handleRiskPctChange = (val: string) => {
    setRiskPct(val);
    const pct = parseFloat(val) || 0;
    if (pct > 0 && balanceNum > 0) {
      setRiskAmount(((balanceNum * pct) / 100).toFixed(2));
    }
  };

  const handleRiskAmountChange = (val: string) => {
    setRiskAmount(val);
    if (balanceNum > 0) {
      const amt = parseFloat(val) || 0;
      setRiskPct(((amt / balanceNum) * 100).toFixed(1));
    }
  };

  const handleExecute = useCallback(async () => {
    if (!selectedAccountId || !selectedAccount || !accessToken || !hasTrade)
      return;

    setExecuting(true);
    setResult(null);

    try {
      const res = await executeEntry(
        selectedAccountId,
        selectedAccount.provider as Provider,
        {
          symbol: `${symbol}USDT`,
          side: tradeAlert!.direction === "LONG" ? "BUY" : "SELL",
          price: String(tradeAlert!.entryPrice),
          risk: riskPct,
          risk_amount: riskAmount,
          action: "ENTRY",
          stoploss_price: String(tradeAlert!.stopLoss),
          takeprofit_price: String(tradeAlert!.takeProfit),
        },
        accessToken,
      );

      setResult({ ok: true, msg: `Order filled — qty: ${res?.entry?.origQty || res?.qty || "N/A"}` });
    } catch (err: any) {
      setResult({ ok: false, msg: err.message || "Execution failed" });
    } finally {
      setExecuting(false);
    }
  }, [
    selectedAccountId,
    selectedAccount,
    accessToken,
    hasTrade,
    symbol,
    tradeAlert,
    riskPct,
    riskAmount,
  ]);

  if (!hasTrade) {
    return (
      <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Crosshair className="h-5 w-5 text-primary" />
            Quick Trade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No active trade alert. Run an analysis first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Crosshair className="h-5 w-5 text-primary" />
          Quick Trade
          <span
            className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
              tradeAlert!.direction === "LONG"
                ? "bg-green-500/15 text-green-500"
                : "bg-red-500/15 text-red-500"
            }`}
          >
            {tradeAlert!.direction}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trade levels summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/40 p-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Entry</p>
            <p className="text-sm font-bold font-mono">${tradeAlert!.entryPrice ? formatUSD(tradeAlert!.entryPrice) : "—"}</p>
          </div>
          <div className="rounded-lg bg-red-500/5 p-2">
            <p className="text-[10px] text-red-400 uppercase tracking-wider">Stop Loss</p>
            <p className="text-sm font-bold font-mono text-red-500">${tradeAlert!.stopLoss ? formatUSD(tradeAlert!.stopLoss) : "—"}</p>
          </div>
          <div className="rounded-lg bg-green-500/5 p-2">
            <p className="text-[10px] text-green-400 uppercase tracking-wider">Take Profit</p>
            <p className="text-sm font-bold font-mono text-green-500">${tradeAlert!.takeProfit ? formatUSD(tradeAlert!.takeProfit) : "—"}</p>
          </div>
        </div>

        {/* Account selector */}
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">
            <Wallet className="h-3 w-3 inline mr-1" />
            Trade Account
          </label>
          {loadingAccounts ? (
            <Skeleton className="h-9 w-full" />
          ) : accounts.length === 0 ? (
            <p className="text-xs text-destructive">No trade accounts found.</p>
          ) : (
            <select
              value={selectedAccountId}
              onChange={(e) => {
                setSelectedAccountId(e.target.value);
                setResult(null);
              }}
              className="w-full h-9 rounded-md border border-primary/20 bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select account…</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.provider})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Balance */}
        {selectedAccountId && (
          <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
            <span className="text-xs text-muted-foreground">Available</span>
            {loadingBalance ? (
              <Skeleton className="h-4 w-20" />
            ) : balance ? (
              <span className="text-sm font-semibold font-mono">
                ${formatUSD(parseFloat(balance.availableBalance))} USDT
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
        )}

        {/* Risk inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">
              <Percent className="h-3 w-3 inline mr-1" />
              Risk %
            </label>
            <input
              type="number"
              value={riskPct}
              onChange={(e) => handleRiskPctChange(e.target.value)}
              min="0.1"
              max="100"
              step="0.1"
              className="w-full h-9 rounded-md border border-primary/20 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">
              <DollarSign className="h-3 w-3 inline mr-1" />
              Risk Amount
            </label>
            <input
              type="number"
              value={riskAmount}
              onChange={(e) => handleRiskAmountChange(e.target.value)}
              min="0"
              step="0.01"
              className="w-full h-9 rounded-md border border-primary/20 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Risk summary */}
        {effectiveRisk > 0 && tradeAlert!.entryPrice && tradeAlert!.stopLoss && (
          <div className="text-xs text-muted-foreground rounded-lg bg-muted/30 p-2 space-y-0.5">
            <p>
              Risk: <span className="text-foreground font-medium">${effectiveRisk.toFixed(2)}</span>
            </p>
            <p>
              SL distance: <span className="text-foreground font-medium">${formatUSD(Math.abs(tradeAlert!.entryPrice - tradeAlert!.stopLoss))}</span>
            </p>
            {(() => {
              const qty = effectiveRisk / Math.abs(tradeAlert!.entryPrice - tradeAlert!.stopLoss);
              const notional = qty * tradeAlert!.entryPrice;
              return (
                <p>
                  Est. size: <span className="text-foreground font-medium">{qty.toFixed(4)} {symbol}</span>
                  <span className="ml-1">(~${formatUSD(notional)})</span>
                </p>
              );
            })()}
          </div>
        )}

        {/* Execute */}
        <Button
          onClick={handleExecute}
          disabled={!selectedAccountId || executing || !hasTrade}
          className={`w-full gap-2 ${
            tradeAlert!.direction === "LONG"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          size="lg"
        >
          {executing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Placing {tradeAlert!.direction}…
            </>
          ) : (
            <>
              <Crosshair className="h-4 w-4" />
              {tradeAlert!.direction === "LONG" ? "Buy / Long" : "Sell / Short"} {symbol}
            </>
          )}
        </Button>

        {/* Result */}
        {result && (
          <div
            className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
              result.ok
                ? "bg-green-500/5 border-green-500/20 text-green-600"
                : "bg-red-500/5 border-red-500/20 text-red-500"
            }`}
          >
            {result.ok ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            )}
            <span>{result.msg}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
