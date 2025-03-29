import { Session } from "next-auth";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
    };
  }
}

export type Provider = "BINANCE" | "BYBIT" | "OKEX";

export interface TradeAccount {
  id: string;
  userId: string;
  name: string;
  apiKey: string;
  secretKey: string;
  provider: Provider;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTradeAccountDto {
  name: string;
  apiKey: string;
  secretKey: string;
  provider: Provider;
}

export interface UpdateTradeAccountDto {
  apiKey: string;
  secretKey: string;
  name: string;
  provider: Provider;
}

// Client-side API functions that use the accessToken from the session
export async function getTradeAccounts(accessToken?: string): Promise<TradeAccount[]> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trade-accounts`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch trade accounts");
  }
  
  return response.json();
}

export async function getTradeAccountById(id: string, accessToken?: string): Promise<TradeAccount> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trade-accounts/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch trade account");
  }
  
  return response.json();
}

export async function createTradeAccount(data: CreateTradeAccountDto, accessToken?: string): Promise<TradeAccount> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trade-accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create trade account");
  }
  
  return response.json();
}

export async function updateTradeAccount(id: string, data: UpdateTradeAccountDto, accessToken?: string): Promise<TradeAccount> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  // Only send the name for updating
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trade-accounts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ name: data.name }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update trade account");
  }
  
  return response.json();
}

export async function deleteTradeAccount(id: string, accessToken?: string): Promise<void> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/trade-accounts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete trade account");
  }
} 