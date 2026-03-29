-- Local CFP reviewer dashboard seed data
-- Applied automatically by `supabase db reset` for local development.
-- Scoped to reviewer-dashboard testing: submissions, tags, reviewers, reviews.

-- Reviewers
insert into public.cfp_reviewers (
    id,
    email,
    name,
    role,
    can_see_speaker_identity,
    invited_by,
    invited_at,
    accepted_at,
    is_active
)
values
    (
        'e58748da-c000-43b7-a2bc-528b7c6763db',
        'reviewer+local@zurichjs.test',
        'Local Reviewer',
        'reviewer',
        false,
        null,
        '2026-02-26T00:00:00.000Z',
        '2026-02-26T08:00:00.000Z',
        true
    ),
    (
        '6b111111-1111-4111-8111-111111111111',
        'committee+local@zurichjs.test',
        'Committee Reviewer',
        'reviewer',
        true,
        null,
        '2026-02-26T00:00:00.000Z',
        '2026-02-26T09:00:00.000Z',
        true
    )
on conflict (id) do update set
    email = excluded.email,
    name = excluded.name,
    role = excluded.role,
    can_see_speaker_identity = excluded.can_see_speaker_identity,
    invited_at = excluded.invited_at,
    accepted_at = excluded.accepted_at,
    is_active = excluded.is_active;

-- Speakers
insert into public.cfp_speakers (
    id,
    email,
    first_name,
    last_name,
    job_title
)
values
    ('11111111-1111-4111-8111-111111111111', 'alex.ai@example.test', 'Alex', 'Ng', 'Engineer'),
    ('22222222-2222-4222-8222-222222222222', 'sam.nuxt@example.test', 'Sam', 'Rivera', 'Frontend Lead'),
    ('33333333-3333-4333-8333-333333333333', 'maya.web@example.test', 'Maya', 'Khan', 'Developer Advocate'),
    ('44444444-4444-4444-8444-444444444444', 'leo.misc@example.test', 'Leo', 'Berg', 'Staff Engineer'),
    ('55555555-5555-4555-8555-555555555555', 'nina.scale@example.test', 'Nina', 'Costa', 'Platform Engineer'),
    ('66666666-6666-4666-8666-666666666666', 'omar.cache@example.test', 'Omar', 'Haddad', 'Principal Engineer')
on conflict (id) do update set
    email = excluded.email,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    job_title = excluded.job_title;

-- Tags
insert into public.cfp_tags (
    id,
    name,
    is_suggested
)
values
    ('90000000-0000-4000-8000-000000000001', 'AI', true),
    ('90000000-0000-4000-8000-000000000002', 'Agents', true),
    ('90000000-0000-4000-8000-000000000003', 'Nuxt', true),
    ('90000000-0000-4000-8000-000000000004', 'Nuxt 4', true),
    ('90000000-0000-4000-8000-000000000005', 'Vue', true),
    ('90000000-0000-4000-8000-000000000006', 'Architecture', true),
    ('90000000-0000-4000-8000-000000000007', 'Observability', true),
    ('90000000-0000-4000-8000-000000000008', 'Performance', true),
    ('90000000-0000-4000-8000-000000000009', 'Caching', true),
    ('90000000-0000-4000-8000-000000000010', 'Testing', true),
    ('90000000-0000-4000-8000-000000000011', 'DX', true),
    ('90000000-0000-4000-8000-000000000012', 'TypeScript', true)
on conflict (name) do update set
    is_suggested = excluded.is_suggested;

-- Submissions
insert into public.cfp_submissions (
    id,
    speaker_id,
    title,
    abstract,
    submission_type,
    talk_level,
    workshop_duration_hours,
    status,
    submitted_at
)
values
    (
        'aaaa1111-1111-4111-8111-111111111111',
        '11111111-1111-4111-8111-111111111111',
        'Practical AI Agents in JavaScript',
        'Build robust agent workflows with guardrails, evals, and telemetry. Covers tool calling, retries, and production debugging for AI agents.',
        'standard',
        'intermediate',
        null,
        'submitted',
        '2026-02-20T10:00:00.000Z'
    ),
    (
        'aaaa2222-2222-4222-8222-222222222222',
        '22222222-2222-4222-8222-222222222222',
        'Shipping Nuxt 4 in Production',
        'Patterns for SSR, caching, and deployment hardening in Nuxt 4 apps, with notes on when plain Nuxt defaults stop being enough.',
        'standard',
        'advanced',
        null,
        'under_review',
        '2026-02-21T10:00:00.000Z'
    ),
    (
        'aaaa3333-3333-4333-8333-333333333333',
        '33333333-3333-4333-8333-333333333333',
        'Nuxt Patterns for Vue Teams',
        'A migration playbook for Vue teams adopting modern Nuxt architecture, composables, and layered code ownership.',
        'standard',
        'beginner',
        null,
        'submitted',
        '2026-02-22T10:00:00.000Z'
    ),
    (
        'aaaa4444-4444-4444-8444-444444444444',
        '44444444-4444-4444-8444-444444444444',
        'Event Sourcing for Frontend Apps',
        'State modeling techniques with snapshots, replay, and conflict resolution for collaborative clients and offline-first UX.',
        'standard',
        'advanced',
        null,
        'submitted',
        '2026-02-23T10:00:00.000Z'
    ),
    (
        'bbbb1111-1111-4111-8111-111111111111',
        '55555555-5555-4555-8555-555555555555',
        'Legacy Refactors without AI',
        'Tactical refactoring methods that do not rely on AI assistance: seams, strangler patterns, and confidence-building tests.',
        'lightning',
        'intermediate',
        null,
        'submitted',
        '2026-02-24T10:00:00.000Z'
    ),
    (
        'bbbb2222-2222-4222-8222-222222222222',
        '33333333-3333-4333-8333-333333333333',
        'Observability for AI Workloads',
        'Tracing, metrics, cost controls, and failure analysis for LLM-heavy systems with humans still in the loop.',
        'standard',
        'advanced',
        null,
        'waitlisted',
        '2026-02-25T10:00:00.000Z'
    ),
    (
        'bbbb3333-3333-4333-8333-333333333333',
        '22222222-2222-4222-8222-222222222222',
        'Vue DX in 2026',
        'Nuxt 4 module ergonomics, layer composition, and test setup for fast-moving product teams.',
        'standard',
        'intermediate',
        null,
        'submitted',
        '2026-02-26T10:00:00.000Z'
    ),
    (
        'bbbb4444-4444-4444-8444-444444444444',
        '66666666-6666-4666-8666-666666666666',
        'HTTP Caching Deep Dive',
        'ETag, Cache-Control, CDN invalidation, stale-while-revalidate, and edge caching strategies you can actually trust.',
        'workshop',
        'intermediate',
        4,
        'submitted',
        '2026-02-27T10:00:00.000Z'
    ),
    (
        'cccc1111-1111-4111-8111-111111111111',
        '55555555-5555-4555-8555-555555555555',
        'Type-Safe MCP Servers with TypeScript',
        'Design contracts, schema validation, and reliable tool execution for MCP servers in TypeScript.',
        'standard',
        'advanced',
        null,
        'accepted',
        '2026-02-28T10:00:00.000Z'
    ),
    (
        'cccc2222-2222-4222-8222-222222222222',
        '66666666-6666-4666-8666-666666666666',
        'Testing Nuxt 4 Without Tears',
        'A practical stack for component, integration, and end-to-end testing in Nuxt 4, including CI stability tips.',
        'lightning',
        'beginner',
        null,
        'rejected',
        '2026-03-01T10:00:00.000Z'
    )
on conflict (id) do update set
    speaker_id = excluded.speaker_id,
    title = excluded.title,
    abstract = excluded.abstract,
    submission_type = excluded.submission_type,
    talk_level = excluded.talk_level,
    workshop_duration_hours = excluded.workshop_duration_hours,
    status = excluded.status,
    submitted_at = excluded.submitted_at;

-- Submission/tag links
insert into public.cfp_submission_tags (
    submission_id,
    tag_id
)
select links.submission_id::uuid, tags.id
from (
    values
        ('aaaa1111-1111-4111-8111-111111111111', 'AI'),
        ('aaaa1111-1111-4111-8111-111111111111', 'Agents'),
        ('aaaa1111-1111-4111-8111-111111111111', 'TypeScript'),
        ('aaaa2222-2222-4222-8222-222222222222', 'Nuxt'),
        ('aaaa2222-2222-4222-8222-222222222222', 'Nuxt 4'),
        ('aaaa2222-2222-4222-8222-222222222222', 'Performance'),
        ('aaaa2222-2222-4222-8222-222222222222', 'Caching'),
        ('aaaa3333-3333-4333-8333-333333333333', 'Nuxt'),
        ('aaaa3333-3333-4333-8333-333333333333', 'Vue'),
        ('aaaa3333-3333-4333-8333-333333333333', 'DX'),
        ('aaaa4444-4444-4444-8444-444444444444', 'Architecture'),
        ('aaaa4444-4444-4444-8444-444444444444', 'TypeScript'),
        ('bbbb1111-1111-4111-8111-111111111111', 'Architecture'),
        ('bbbb1111-1111-4111-8111-111111111111', 'Testing'),
        ('bbbb2222-2222-4222-8222-222222222222', 'AI'),
        ('bbbb2222-2222-4222-8222-222222222222', 'Observability'),
        ('bbbb2222-2222-4222-8222-222222222222', 'Agents'),
        ('bbbb3333-3333-4333-8333-333333333333', 'Nuxt'),
        ('bbbb3333-3333-4333-8333-333333333333', 'Nuxt 4'),
        ('bbbb3333-3333-4333-8333-333333333333', 'Vue'),
        ('bbbb3333-3333-4333-8333-333333333333', 'DX'),
        ('bbbb4444-4444-4444-8444-444444444444', 'Caching'),
        ('bbbb4444-4444-4444-8444-444444444444', 'Performance'),
        ('cccc1111-1111-4111-8111-111111111111', 'TypeScript'),
        ('cccc1111-1111-4111-8111-111111111111', 'Architecture'),
        ('cccc1111-1111-4111-8111-111111111111', 'Agents'),
        ('cccc2222-2222-4222-8222-222222222222', 'Nuxt'),
        ('cccc2222-2222-4222-8222-222222222222', 'Nuxt 4'),
        ('cccc2222-2222-4222-8222-222222222222', 'Testing')
) as links(submission_id, tag_name)
join public.cfp_tags tags on tags.name = links.tag_name
on conflict (submission_id, tag_id) do nothing;

-- Reviews
insert into public.cfp_reviews (
    id,
    submission_id,
    reviewer_id,
    score_overall,
    score_relevance,
    score_technical_depth,
    score_clarity,
    score_diversity,
    private_notes,
    feedback_to_speaker,
    created_at,
    updated_at
)
values
    (
        '70000000-0000-4000-8000-000000000001',
        'aaaa1111-1111-4111-8111-111111111111',
        'e58748da-c000-43b7-a2bc-528b7c6763db',
        4, 4, 4, 4, 4,
        'Strong framing and practical examples.',
        null,
        '2026-03-02T10:00:00.000Z',
        '2026-03-02T10:00:00.000Z'
    ),
    (
        '70000000-0000-4000-8000-000000000002',
        'aaaa2222-2222-4222-8222-222222222222',
        'e58748da-c000-43b7-a2bc-528b7c6763db',
        3, 4, 3, 3, 3,
        'Good topic, could use clearer production tradeoffs.',
        null,
        '2026-03-02T11:00:00.000Z',
        '2026-03-02T11:00:00.000Z'
    ),
    (
        '70000000-0000-4000-8000-000000000003',
        'bbbb2222-2222-4222-8222-222222222222',
        'e58748da-c000-43b7-a2bc-528b7c6763db',
        4, 4, 4, 3, 4,
        'Strong operational angle for AI systems.',
        null,
        '2026-03-03T09:30:00.000Z',
        '2026-03-03T09:30:00.000Z'
    ),
    (
        '70000000-0000-4000-8000-000000000004',
        'cccc2222-2222-4222-8222-222222222222',
        'e58748da-c000-43b7-a2bc-528b7c6763db',
        2, 3, 2, 3, 2,
        'Useful for beginners but may overlap with other Nuxt talks.',
        null,
        '2026-03-03T12:00:00.000Z',
        '2026-03-03T12:00:00.000Z'
    ),
    (
        '70000000-0000-4000-8000-000000000005',
        'aaaa1111-1111-4111-8111-111111111111',
        '6b111111-1111-4111-8111-111111111111',
        4, 5, 4, 4, 4,
        'Committee review: relevant and timely.',
        null,
        '2026-03-02T15:00:00.000Z',
        '2026-03-02T15:00:00.000Z'
    ),
    (
        '70000000-0000-4000-8000-000000000006',
        'aaaa4444-4444-4444-8444-444444444444',
        '6b111111-1111-4111-8111-111111111111',
        5, 4, 5, 4, 4,
        'Excellent depth and strong frontend angle.',
        null,
        '2026-03-04T09:00:00.000Z',
        '2026-03-04T09:00:00.000Z'
    ),
    (
        '70000000-0000-4000-8000-000000000007',
        'bbbb4444-4444-4444-8444-444444444444',
        '6b111111-1111-4111-8111-111111111111',
        4, 4, 4, 4, 3,
        'Workshop looks useful and practical.',
        null,
        '2026-03-04T10:00:00.000Z',
        '2026-03-04T10:00:00.000Z'
    ),
    (
        '70000000-0000-4000-8000-000000000008',
        'cccc1111-1111-4111-8111-111111111111',
        '6b111111-1111-4111-8111-111111111111',
        5, 5, 5, 4, 4,
        'Great fit for advanced backend/frontend crossover audience.',
        null,
        '2026-03-04T11:00:00.000Z',
        '2026-03-04T11:00:00.000Z'
    )
on conflict (submission_id, reviewer_id) do update set
    score_overall = excluded.score_overall,
    score_relevance = excluded.score_relevance,
    score_technical_depth = excluded.score_technical_depth,
    score_clarity = excluded.score_clarity,
    score_diversity = excluded.score_diversity,
    private_notes = excluded.private_notes,
    feedback_to_speaker = excluded.feedback_to_speaker,
    updated_at = excluded.updated_at;
