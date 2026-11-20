import type { Request, Response } from 'express';
import { parseQuoteRequest } from '../src/utils/websiteQuote.ts';

// The Vercel function forwards to the Express service, which owns durable storage and pricing.
export default async function websiteQuotes(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Use POST to submit a quotation request.' });
    return;
  }

  let body: unknown;
  try {
    body = req.body;
  } catch {
    res.status(400).json({ ok: false, error: 'Enter a valid quotation request.' });
    return;
  }
  const parsed = parseQuoteRequest(body);
  if ('error' in parsed) {
    res.status(400).json({ ok: false, ...parsed });
    return;
  }

  try {
    const upstream = new URL(process.env.WEBSITE_QUOTE_BACKEND_URL ?? '');
    if (upstream.protocol !== 'https:' || upstream.host === req.headers.host) throw new Error('Invalid quote upstream');

    const response = await fetch(upstream, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.quote),
      signal: AbortSignal.timeout(10_000),
      redirect: 'error',
    });
    const result = await response.json();
    if (response.ok && result.ok === true && result.id === parsed.quote.id) {
      res.status(response.status).json({ ok: true, id: result.id });
      return;
    }
    if (response.status === 400 || response.status === 409) {
      res.status(response.status).json({ ok: false, error: 'Review your configuration or start a new request.' });
      return;
    }
  } catch {
    // An unreachable or unconfigured backend cannot confirm receipt.
  }

  res.status(503).json({ ok: false, error: 'The quote service is temporarily unavailable. Please try again later.' });
}
