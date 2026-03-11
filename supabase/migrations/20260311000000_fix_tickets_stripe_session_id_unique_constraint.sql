-- Fix: Allow multiple tickets per checkout session (multi-ticket purchases)
-- The original unique constraint on stripe_session_id alone prevents creating
-- multiple tickets for different attendees in the same checkout session.
-- Replace with a composite unique constraint on (stripe_session_id, email).

-- Drop the existing unique constraint on stripe_session_id
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_stripe_session_id_key;

-- Add composite unique constraint on (stripe_session_id, email)
-- This allows multiple tickets per session (one per attendee email)
-- while still preventing duplicate tickets for the same attendee in the same session
ALTER TABLE tickets ADD CONSTRAINT tickets_stripe_session_id_email_key UNIQUE (stripe_session_id, email);
