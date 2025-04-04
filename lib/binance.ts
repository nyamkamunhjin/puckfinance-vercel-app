// Types
export interface PositionRisk {
  symbol: string;
  positionAmt: string;
  entryPrice: string;
  markPrice: string;
  unrealizedProfit: string;
  liquidationPrice: string;
  leverage: string;
  maxNotionalValue: string;
  marginType: string;
  isolatedMargin: string;
  isAutoAddMargin: string;
  positionSide: string;
  notional: string;
  isolatedWallet: string;
  updateTime: number;
  stoploss: string;
  takeprofit: string;
  stoplossAmount: number;
  takeprofitAmount: number;
  [key: string]: any;
}

export interface Order {
  symbol: string;
  orderId: number;
  clientOrderId: string;
  price: string;
  origQty: string;
  executedQty: string;
  status: string;
  timeInForce: string;
  type: string;
  side: string;
  stopPrice: string;
  time: number;
  [key: string]: any;
}

export interface Income {
  symbol: string;
  incomeType: string;
  income: string;
  asset: string;
  info: string;
  time: number;
  tranId: number;
  tradeId: number;
  [key: string]: any;
}

export interface Balance {
  accountAlias: string;
  asset: string;
  balance: string;
  crossWalletBalance: string;
  crossUnPnl: string;
  availableBalance: string;
  maxWithdrawAmount: string;
  marginAvailable: boolean;
  updateTime: number;
}

export interface TradeHistoryItem {
  symbol: string;
  id: number;
  orderId: number;
  price: string;
  qty: string;
  quoteQty: string;
  commission: string;
  commissionAsset: string;
  time: number;
  isBuyer: boolean;
  isMaker: boolean;
  positionSide: string;
  side: string;
  realizedPnl: string;
  [key: string]: any;
}

export interface Snapshot {
  totalWalletBalance: string;
  totalUnrealizedProfit: string;
  totalMarginBalance: string;
  totalInitialMargin: string;
  totalMaintMargin: string;
  totalPositionInitialMargin: string;
  totalOpenOrderInitialMargin: string;
  totalCrossWalletBalance: string;
  totalCrossUnPnl: string;
  availableBalance: string;
  maxWithdrawAmount: string;
  time: number;
  [key: string]: any;
}

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

// Client-side API functions that use the accessToken from the session
export async function executeEntry(
  tradeAccountId: string, 
  params: EntryOrderParams, 
  accessToken?: string
): Promise<any> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/binance/entry/${tradeAccountId}?api_key=munkhjinbnoo`, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(params),
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to execute order");
  }
  
  return response.json();
}

export async function getBalance(
  tradeAccountId: string, 
  accessToken?: string
): Promise<Balance> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/binance/balance/${tradeAccountId}?api_key=munkhjinbnoo`, 
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch balance");
  }
  
  return response.json();
}

export async function getIncome(
  tradeAccountId: string, 
  accessToken?: string
): Promise<Income[]> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/binance/income/${tradeAccountId}?api_key=munkhjinbnoo`, 
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch income");
  }
  
  return response.json();
}

export async function getTradeHistory(
  tradeAccountId: string, 
  symbol: string, 
  accessToken?: string
): Promise<TradeHistoryItem[]> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/binance/trade-history/${tradeAccountId}?symbol=${symbol}&api_key=munkhjinbnoo`, 
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch trade history");
  }
  
  return response.json();
}

export async function getCurrentPosition(
  tradeAccountId: string, 
  accessToken?: string
): Promise<PositionRisk[]> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/binance/current-position/${tradeAccountId}?api_key=munkhjinbnoo`, 
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch current position");
  }
  
  return response.json();
}

export async function getOpenOrders(
  tradeAccountId: string, 
  accessToken?: string
): Promise<Order[]> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/binance/open-orders/${tradeAccountId}?api_key=munkhjinbnoo`, 
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch open orders");
  }
  
  return response.json();
}

export async function getSnapshots(
  tradeAccountId: string, 
  startTime: number, 
  endTime: number, 
  accessToken?: string
): Promise<Snapshot[]> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/binance/snapshot/${tradeAccountId}?startTime=${startTime}&endTime=${endTime}&api_key=munkhjinbnoo`, 
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch snapshots");
  }
  
  return response.json();
} 