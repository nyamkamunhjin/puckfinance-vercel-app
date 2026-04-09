export interface MexcPosition {
  positionId: number;
  symbol: string;
  positionType: number;
  openType: number;
  state: number;
  holdVol: number;
  frozenVol: number;
  closeVol: number;
  holdAvgPrice: number;
  holdAvgPriceFullyScale: string;
  openAvgPrice: number;
  openAvgPriceFullyScale: string;
  closeAvgPrice: number;
  liquidatePrice: number;
  oim: number;
  im: number;
  holdFee: number;
  realised: number;
  leverage: number;
  marginRatio: number;
  autoAddIm: boolean;
  profitRatio: number;
  fee: number;
  totalFee: number;
  createTime: number;
  updateTime: number;
  stoploss: string;
  takeprofit: string;
  stoplossAmount: number;
  takeprofitAmount: number;
  [key: string]: any;
}

export interface MexcOrder {
  orderId: string;
  symbol: string;
  positionId: number;
  price: number;
  priceStr: string;
  vol: number;
  leverage: number;
  side: number;
  category: number;
  orderType: number;
  dealAvgPrice: number;
  dealAvgPriceStr: string;
  dealVol: number;
  orderMargin: number;
  takerFee: number;
  makerFee: number;
  profit: number;
  fee: number;
  status: number;
  stopLossPrice?: number;
  takeProfitPrice?: number;
  createTime: number;
  updateTime: number;
  [key: string]: any;
}

export interface MexcBalance {
  currency: string;
  positionMargin: number;
  frozenBalance: number;
  availableBalance: number;
  cashBalance: number;
  equity: number;
  unrealized: number;
  bonus: number;
  bonusExpireTime?: number;
  availableCash: number;
  availableOpen: number;
  debtAmount: number;
  contributeMarginAmount: number;
  vcoinId: string;
  [key: string]: any;
}

export interface MexcHistoryPosition {
  positionId: number;
  symbol: string;
  positionType: number;
  openType: number;
  state: number;
  holdVol: number;
  frozenVol: number;
  closeVol: number;
  holdAvgPrice: number;
  holdAvgPriceFullyScale: string;
  openAvgPrice: number;
  openAvgPriceFullyScale: string;
  closeAvgPrice: number;
  liquidatePrice: number;
  oim: number;
  im: number;
  holdFee: number;
  realised: number;
  leverage: number;
  profitRatio: number;
  closeProfitLoss: number;
  fee: number;
  totalFee: number;
  createTime: number;
  updateTime: number;
  [key: string]: any;
}

export interface MexcHistoryOrder {
  orderId: string;
  symbol: string;
  price: number;
  vol: number;
  dealVol: number;
  dealAvgPrice: number;
  side: number;
  orderType: number;
  openType: number;
  leverage: number;
  profit: number;
  fee: number;
  status: number;
  createTime: number;
  updateTime: number;
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

export async function executeEntry(
  tradeAccountId: string,
  params: EntryOrderParams,
  accessToken?: string
): Promise<any> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mexc/entry/${tradeAccountId}?api_key=munkhjinbnoo`,
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
): Promise<MexcBalance> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mexc/balance/${tradeAccountId}?api_key=munkhjinbnoo`,
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

export async function getBalanceV3(
  tradeAccountId: string,
  accessToken?: string
): Promise<MexcBalance[]> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mexc/balance-v3/${tradeAccountId}?api_key=munkhjinbnoo`,
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
): Promise<MexcHistoryPosition[]> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mexc/income/${tradeAccountId}?api_key=munkhjinbnoo`,
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
): Promise<MexcHistoryOrder[]> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const querySymbol = symbol.includes('_') ? symbol.replace('_USDT', 'USDT') : symbol;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mexc/trade-history/${tradeAccountId}?symbol=${querySymbol}&api_key=munkhjinbnoo`,
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
): Promise<MexcPosition[]> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mexc/current-position/${tradeAccountId}?api_key=munkhjinbnoo`,
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
): Promise<MexcOrder[]> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mexc/open-orders/${tradeAccountId}?api_key=munkhjinbnoo`,
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
