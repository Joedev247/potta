import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint for Vercel deployment
 * This minimal API route ensures Vercel detects at least one serverless page
 */
export async function GET(_request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}
