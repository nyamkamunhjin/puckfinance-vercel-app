# Binance API Integration

This document outlines the Binance API integration implemented in the frontend application.

## Overview

The integration allows users to:
- View trade history
- Check account balance
- Get income information
- View current positions
- Check open orders
- Get account snapshots
- Execute orders (entry, exit, move stop-loss)

## API Endpoints

The following API endpoints have been implemented:

### Client-side Functions (`lib/binance.ts`)

These functions are used by the frontend components to interact with the backend API:

- `executeEntry(tradeAccountId, params, accessToken)`: Execute entry, limit entry, exit, or move stop-loss orders
- `getBalance(tradeAccountId, accessToken)`: Get account balance
- `getIncome(tradeAccountId, accessToken)`: Get income history
- `getTradeHistory(tradeAccountId, symbol, accessToken)`: Get trade history for a specific symbol
- `getCurrentPosition(tradeAccountId, symbol, accessToken)`: Get current position for a specific symbol
- `getOpenOrders(tradeAccountId, accessToken)`: Get open orders
- `getSnapshots(tradeAccountId, startTime, endTime, accessToken)`: Get account snapshots for a time range

### API Route Handlers

The following API routes are implemented to proxy requests to the backend server:

- `POST /api/binance/entry/[trade_account_id]`: Execute entry, limit entry, exit, or move stop-loss orders
- `GET /api/binance/balance/[trade_account_id]`: Get account balance
- `GET /api/binance/income/[trade_account_id]`: Get income history
- `GET /api/binance/trade-history/[trade_account_id]?symbol=<SYMBOL>`: Get trade history for a specific symbol
- `GET /api/binance/current-position/[trade_account_id]?symbol=<SYMBOL>`: Get current position for a specific symbol
- `GET /api/binance/open-orders/[trade_account_id]`: Get open orders
- `GET /api/binance/snapshot/[trade_account_id]?startTime=<START_TIME>&endTime=<END_TIME>`: Get account snapshots for a time range

## Pages

The following pages have been implemented to use the Binance API:

- `/trade-accounts/[id]/trade-history`: View trade history for a specific trade account

## Data Types

The following data types are defined in `lib/binance.ts`:

- `PositionRisk`: Represents a position risk
- `Order`: Represents an order
- `Income`: Represents income information
- `Balance`: Represents account balance
- `TradeHistoryItem`: Represents a trade history item
- `Snapshot`: Represents an account snapshot
- `EntryOrderParams`: Parameters for executing an entry order

## Usage Example

```typescript
import { getTradeHistory } from "@/lib/binance";

// Get trade history for a specific trade account and symbol
const tradeHistory = await getTradeHistory(
  tradeAccountId, 
  "BTCUSDT", 
  session.accessToken
);
```

## Future Improvements

- Implement additional pages for other Binance operations:
  - Balance page
  - Current positions page
  - Open orders page
  - Order execution page
- Add filtering and sorting capabilities to trade history
- Implement real-time updates using WebSockets
- Add charting and visualization components 