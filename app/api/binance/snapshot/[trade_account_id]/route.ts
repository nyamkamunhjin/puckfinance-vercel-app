import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { trade_account_id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const tradeAccountId = params.trade_account_id;
    const startTime = request.nextUrl.searchParams.get('startTime');
    const endTime = request.nextUrl.searchParams.get('endTime');
    
    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: 'StartTime and endTime are required' }, 
        { status: 400 }
      );
    }
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/binance/snapshot/${tradeAccountId}?startTime=${startTime}&endTime=${endTime}&api_key=munkhjinbnoo`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('API request error:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 