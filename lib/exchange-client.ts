import { Provider } from "./trade-accounts";
import * as binance from "./binance";
import * as mexc from "./mexc";

export interface EntryOrderParams {
  symbol: string;
  side: 'BUY' | 'SELL';
  price?: string;
  risk?: string;
  risk_amount?: string;
  action: 'ENTRY' | 'ENTRY_LIMIT' | 'EXIT' | 'MOVE_STOPLOSS';
  takeprofit_price?: string;
  stoploss_price?: string;
}

export interface Position {
  symbol: string;
  positionAmt: string;
  entryPrice: string;
  markPrice: string;
  unrealizedProfit: string;
  unrealizedProfitUsd?: string;
  liquidationPrice: string;
  leverage: string | number;
  positionMargin?: string;
  breakEvenPrice?: string;
  stoploss: string;
  takeprofit: string;
  stoplossAmount: number;
  takeprofitAmount: number;
  side: 'LONG' | 'SHORT';
  [key: string]: any;
}

export interface Balance {
  asset: string;
  balance: string;
  availableBalance: string;
  crossUnPnl: string;
  crossUnrealized?: string;
  [key: string]: any;
}

export interface Order {
  symbol: string;
  orderId?: number;
  id?: string;
  price: string;
  origQty?: string;
  vol?: string;
  executedQty?: string;
  dealVol?: string;
  status: string | number;
  type: string | number;
  side: string | number;
  createTime?: number;
  time?: number;
  [key: string]: any;
}

export interface Income {
  symbol: string;
  income: string;
  incomeType?: string;
  type?: number;
  asset: string;
  time: number;
  tranId?: number;
  id?: string;
  [key: string]: any;
}

export interface Snapshot {
  totalWalletBalance: string;
  totalUnrealizedProfit: string;
  availableBalance: string;
  time: number;
  [key: string]: any;
}

function getExchangeFunctions(provider: Provider) {
  switch (provider) {
    case "BINANCE":
      return binance;
    case "MEXC":
      return mexc;
    case "BYBIT":
    case "OKEX":
      throw new Error(`Provider ${provider} is not yet implemented`);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export async function executeEntry(
  tradeAccountId: string,
  provider: Provider,
  params: EntryOrderParams,
  accessToken?: string
): Promise<any> {
  const exchange = getExchangeFunctions(provider);
  return exchange.executeEntry(tradeAccountId, params, accessToken);
}

export async function getBalance(
  tradeAccountId: string,
  provider: Provider,
  accessToken?: string
): Promise<Balance> {
  const exchange = getExchangeFunctions(provider);
  const raw = await exchange.getBalance(tradeAccountId, accessToken) as any;

  if (provider === "MEXC") {
    return {
      asset: raw.currency || "USDT",
      balance: String(raw.equity || raw.cashBalance || "0"),
      availableBalance: String(raw.availableBalance || "0"),
      crossUnPnl: String(raw.unrealized || "0"),
      crossUnrealized: String(raw.unrealized || "0"),
    };
  }

  return raw;
}

export async function getIncome(
  tradeAccountId: string,
  provider: Provider,
  accessToken?: string
): Promise<Income[]> {
  const exchange = getExchangeFunctions(provider);
  const raw = await exchange.getIncome(tradeAccountId, accessToken) as any[];

  if (provider === "MEXC") {
    return raw.map((item: any) => ({
      symbol: item.symbol,
      income: String(Number(item.closeProfitLoss || 0) + Number(item.fee || 0)),
      incomeType: "REALIZED_PNL",
      type: item.positionType,
      asset: "USDT",
      time: item.createTime || item.updateTime || 0,
      tranId: item.positionId,
      id: String(item.positionId),
    }));
  }

  return raw;
}

export async function getTradeHistory(
  tradeAccountId: string,
  provider: Provider,
  symbol: string,
  accessToken?: string
): Promise<any[]> {
  const exchange = getExchangeFunctions(provider);
  const raw = await exchange.getTradeHistory(tradeAccountId, symbol, accessToken) as any[];

  if (provider === "MEXC") {
    const mexcSideToString = (side: number) => {
      if (side === 1 || side === 4) return "BUY";
      if (side === 2 || side === 3) return "SELL";
      return String(side);
    };

    return raw.map((item: any) => ({
      id: item.orderId || item.id,
      time: item.createTime || item.updateTime || 0,
      side: mexcSideToString(item.side),
      price: String(item.price || "0"),
      qty: String(item.vol || item.dealVol || "0"),
      quoteQty: String(item.dealVol || "0"),
      commission: String(item.fee || "0"),
      commissionAsset: "USDT",
      isMaker: item.orderType === 1,
      realizedPnl: String(item.profit || "0"),
    }));
  }

  return raw;
}

export async function getCurrentPosition(
  tradeAccountId: string,
  provider: Provider,
  accessToken?: string
): Promise<Position[]> {
  const exchange = getExchangeFunctions(provider);
  const positions = await exchange.getCurrentPosition(tradeAccountId, accessToken) as any[];
  
  return positions.map((pos: any) => {
    const positionAmt = pos.positionAmt || pos.holdVol || pos.volume || '0';
    const isLong = pos.positionType === 1 || parseFloat(String(positionAmt)) > 0;
    const entryPrice = pos.entryPrice || String(pos.holdAvgPrice || pos.averageOpenPrice || '0');
    
    return {
      symbol: pos.symbol,
      positionAmt: String(positionAmt),
      entryPrice,
      markPrice: pos.markPrice || '0',
      unrealizedProfit: pos.unrealizedProfit != null ? String(pos.unrealizedProfit) : String(pos.unrealized || pos.realised || '0'),
      unrealizedProfitUsd: pos.unrealizedProfitUsd,
      liquidationPrice: pos.liquidationPrice || String(pos.liquidatePrice || '0'),
      leverage: String(pos.leverage),
      positionMargin: pos.positionMargin || String(pos.oim || pos.im || ''),
      breakEvenPrice: pos.breakEvenPrice || entryPrice,
      stoploss: pos.stoploss || '',
      takeprofit: pos.takeprofit || '',
      stoplossAmount: pos.stoplossAmount || 0,
      takeprofitAmount: pos.takeprofitAmount || 0,
      side: isLong ? 'LONG' : 'SHORT',
    };
  });
}

export async function getOpenOrders(
  tradeAccountId: string,
  provider: Provider,
  accessToken?: string
): Promise<Order[]> {
  const exchange = getExchangeFunctions(provider);
  const raw = await exchange.getOpenOrders(tradeAccountId, accessToken) as any[];

  if (provider === "MEXC") {
    return raw.map((item: any) => ({
      id: item.orderId || item.id,
      symbol: item.symbol,
      price: String(item.price || item.priceStr || "0"),
      vol: String(item.vol || "0"),
      dealVol: String(item.dealVol || "0"),
      status: item.status,
      type: item.orderType || item.type,
      side: item.side,
      createTime: item.createTime,
    }));
  }

  return raw;
}

export async function getSnapshots(
  tradeAccountId: string,
  provider: Provider,
  startTime: number,
  endTime: number,
  accessToken?: string
): Promise<Snapshot[]> {
  const exchange = getExchangeFunctions(provider) as any;
  if (!exchange.getSnapshots) {
    throw new Error(`Snapshots are not supported for provider ${provider}`);
  }
  return exchange.getSnapshots(tradeAccountId, startTime, endTime, accessToken);
}