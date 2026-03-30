/**
 * Ticket Invoice Backfill API
 * POST /api/admin/tickets/invoices/backfill
 *
 * Creates invoice records for all confirmed tickets that don't yet have one.
 * Processes tickets in batches and skips non-Stripe sessions (B2B, manual, etc.).
 * Safe to run multiple times — idempotent per stripe_session_id.
 *
 * Returns a summary of created, skipped, and failed invoices.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminAccess } from '@/lib/admin/auth';
import { createServiceRoleClient } from '@/lib/supabase';
import { createInvoiceForNewTicket } from '@/lib/tickets';
import type { Ticket } from '@/lib/types/database';
import { logger } from '@/lib/logger';

const log = logger.scope('Ticket Invoice Backfill');

const BATCH_SIZE = 50;

const SKIP_PREFIXES = ['b2b_invoice_', 'manual_', 'bank_transfer_', 'complimentary_'];

function shouldSkip(sessionId: string): boolean {
  return SKIP_PREFIXES.some((prefix) => sessionId.startsWith(prefix));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { authorized } = verifyAdminAccess(req);
  if (!authorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServiceRoleClient() as any;

    // Fetch all confirmed tickets — one representative per stripe_session_id
    // (deduplicated so group purchases only produce one invoice attempt)
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: true });

    if (error) {
      log.error('Failed to fetch tickets for backfill', error);
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }

    // Deduplicate: keep only the first (oldest) ticket per stripe_session_id
    const seenSessions = new Set<string>();
    const representatives: Ticket[] = [];
    for (const ticket of tickets as Ticket[]) {
      if (!seenSessions.has(ticket.stripe_session_id)) {
        seenSessions.add(ticket.stripe_session_id);
        representatives.push(ticket);
      }
    }

    // Find which sessions already have an invoice
    const { data: existingInvoices } = await supabase
      .from('ticket_invoices')
      .select('stripe_session_id');

    const invoicedSessions = new Set<string>(
      (existingInvoices ?? []).map((inv: { stripe_session_id: string }) => inv.stripe_session_id)
    );

    const toProcess = representatives.filter(
      (t) => !invoicedSessions.has(t.stripe_session_id) && !shouldSkip(t.stripe_session_id)
    );

    log.info('Starting backfill', {
      total: representatives.length,
      alreadyInvoiced: invoicedSessions.size,
      toProcess: toProcess.length,
    });

    let created = 0;
    let skipped = 0;
    const failures: Array<{ ticketId: string; sessionId: string; error: string }> = [];

    // Process in batches to avoid overwhelming the DB
    for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
      const batch = toProcess.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (ticket) => {
          try {
            await createInvoiceForNewTicket(ticket);
            created++;
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            failures.push({ ticketId: ticket.id, sessionId: ticket.stripe_session_id, error: message });
          }
        })
      );
    }

    skipped = representatives.length - toProcess.length - (existingInvoices?.length ?? 0);

    log.info('Backfill complete', { created, skipped, failures: failures.length });

    return res.status(200).json({
      success: true,
      summary: {
        total: representatives.length,
        alreadyHadInvoice: invoicedSessions.size,
        created,
        skipped,
        failed: failures.length,
      },
      failures: failures.length > 0 ? failures : undefined,
    });
  } catch (error) {
    log.error('Backfill error', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Backfill failed',
    });
  }
}
