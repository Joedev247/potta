import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Health check endpoint for Vercel deployment
 * This minimal API route ensures Vercel detects at least one serverless page
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
}

