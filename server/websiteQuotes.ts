import { randomUUID } from 'node:crypto';
import { link, mkdir, readFile, realpath, unlink, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Request, Response } from 'express';
import { PACKAGES } from '../src/data/websitePricing.ts';
import { calculateEstimate } from '../src/utils/websiteEstimate.ts';
import { parseQuoteRequest } from '../src/utils/websiteQuote.ts';

const projectDirectory = fileURLToPath(new URL('..', import.meta.url));
const defaultDirectory = path.join(homedir(), '.genmax-it', 'website-quotes');

function isOutside(project: string, directory: string) {
  const relative = path.relative(project, directory);
  return relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
}

export async function submitWebsiteQuote(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store');
  const parsed = parseQuoteRequest(req.body);
  if ('error' in parsed) {
    res.status(400).json({ ok: false, ...parsed });
    return;
  }

  const { quote } = parsed;
  const { selection } = quote;
  const packageDetails = selection.type === 'application' ? null : PACKAGES[selection.type][selection.tier];
  const directory = path.resolve(process.env.WEBSITE_QUOTE_DATA_DIR || defaultDirectory);
  let temporary: string | undefined;
  const record = {
    quote,
    package: packageDetails && {
      name: packageDetails.name,
      features: packageDetails.features,
      delivery: packageDetails.delivery,
      revisions: packageDetails.revisions,
      support: packageDetails.support,
    },
    estimate: calculateEstimate(selection, quote.currency),
    status: 'new',
    submittedAt: new Date().toISOString(),
  };

  try {
    if (!isOutside(projectDirectory, directory)) throw new Error('Quote storage must be outside the project directory.');
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const resolved = await realpath(directory);
    if (!isOutside(await realpath(projectDirectory), resolved)) throw new Error('Quote storage must be outside the project directory.');

    const destination = path.join(resolved, `${quote.id}.json`);
    temporary = path.join(resolved, `.${randomUUID()}.tmp`);
    await writeFile(temporary, JSON.stringify(record, null, 2), { flag: 'wx', mode: 0o600, flush: true });

    // Publish the complete file without replacing a request already stored under this ID.
    try {
      await link(temporary, destination);
      res.status(201).json({ ok: true, id: quote.id });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      const existing = JSON.parse(await readFile(destination, 'utf8'));
      if (JSON.stringify(existing.quote) !== JSON.stringify(quote)) {
        res.status(409).json({ ok: false, error: 'Start a new request to submit different details.' });
        return;
      }
      res.json({ ok: true, id: quote.id });
    }
  } catch (error) {
    console.error('Website quote storage failed.', (error as NodeJS.ErrnoException).code ?? 'unknown');
    res.status(503).json({ ok: false, error: 'Your request could not be saved. Please try again.' });
  } finally {
    if (temporary) await unlink(temporary).catch(() => {});
  }
}
