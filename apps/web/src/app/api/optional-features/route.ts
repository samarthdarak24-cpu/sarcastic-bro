import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Blockchain Trace
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const feature = searchParams.get('feature');
  const productId = searchParams.get('productId');
  const farmerId = searchParams.get('farmerId');

  try {
    if (feature === 'blockchain-trace' && productId) {
      const response = await fetch(
        `${API_BASE}/api/blockchain/trace/${productId}`
      );
      return NextResponse.json(await response.json());
    }

    if (feature === 'analytics' && farmerId) {
      const response = await fetch(
        `${API_BASE}/api/analytics/dashboard/${farmerId}`
      );
      return NextResponse.json(await response.json());
    }

    if (feature === 'iot' && farmerId) {
      const response = await fetch(`${API_BASE}/api/iot/dashboard/${farmerId}`);
      return NextResponse.json(await response.json());
    }

    return NextResponse.json(
      { error: 'Feature not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { feature } = body;

  try {
    if (feature === 'video-call') {
      const response = await fetch(`${API_BASE}/api/video-calls/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return NextResponse.json(await response.json());
    }

    if (feature === 'subsidy-check') {
      const response = await fetch(
        `${API_BASE}/api/subsidy/check-eligibility`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      return NextResponse.json(await response.json());
    }

    return NextResponse.json(
      { error: 'Feature not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
