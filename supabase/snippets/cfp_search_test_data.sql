-- Local CFP search test data
-- Apply against local Supabase to seed reviewer-dashboard search cases.

-- Reviewer used for local auth testing
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
values (
           'e58748da-c000-43b7-a2bc-528b7c6763db',
           'reviewer+local@zurichjs.test',
           'Local Reviewer',
           'reviewer',
           false,
           null,
           '2026-02-26T00:00:00.000Z',
           null,
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

insert into public.cfp_speakers (
    id,
    email,
    first_name,
    last_name,
    job_title
)
values
    (
        '11111111-1111-4111-8111-111111111111',
        'alex.ai@example.test',
        'Alex',
        'Ng',
        'Engineer'
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        'sam.nuxt@example.test',
        'Sam',
        'Rivera',
        'Frontend Lead'
    ),
    (
        '33333333-3333-4333-8333-333333333333',
        'maya.web@example.test',
        'Maya',
        'Khan',
        'Developer Advocate'
    ),
    (
        '44444444-4444-4444-8444-444444444444',
        'leo.misc@example.test',
        'Leo',
        'Berg',
        'Staff Engineer'
    )
    on conflict (id) do update set
    email = excluded.email,
                            first_name = excluded.first_name,
                            last_name = excluded.last_name,
                            job_title = excluded.job_title;

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
        'Build robust agent workflows with guardrails and telemetry.',
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
        'Patterns for SSR, caching, and deployment hardening in Nuxt 4 apps.',
        'standard',
        'advanced',
        null,
        'submitted',
        '2026-02-21T10:00:00.000Z'
    ),
    (
        'aaaa3333-3333-4333-8333-333333333333',
        '33333333-3333-4333-8333-333333333333',
        'Nuxt Patterns for Vue Teams',
        'A migration playbook for teams adopting modern Nuxt architecture.',
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
        'State modeling techniques with snapshots, replay, and conflict resolution.',
        'standard',
        'advanced',
        null,
        'submitted',
        '2026-02-23T10:00:00.000Z'
    ),
    (
        'bbbb1111-1111-4111-8111-111111111111',
        '11111111-1111-4111-8111-111111111111',
        'Legacy Refactors without AI',
        'Tactical refactoring methods that do not rely on AI assistance.',
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
        'Tracing, metrics, and cost controls for LLM-heavy systems.',
        'standard',
        'advanced',
        null,
        'submitted',
        '2026-02-25T10:00:00.000Z'
    ),
    (
        'bbbb3333-3333-4333-8333-333333333333',
        '22222222-2222-4222-8222-222222222222',
        'Vue DX in 2026',
        'Nuxt 4 module ergonomics, layer composition, and test setup.',
        'standard',
        'intermediate',
        null,
        'submitted',
        '2026-02-26T10:00:00.000Z'
    ),
    (
        'bbbb4444-4444-4444-8444-444444444444',
        '44444444-4444-4444-8444-444444444444',
        'HTTP Caching Deep Dive',
        'ETag, Cache-Control, and CDN invalidation strategies.',
        'workshop',
        'intermediate',
        4,
        'submitted',
        '2026-02-27T10:00:00.000Z'
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
