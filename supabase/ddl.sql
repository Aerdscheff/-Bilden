-- SQL schema for Ä/Bilden citizen consultation platform

-- Users table: list of participants in the system. Roles control access levels.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  role text not null check (role in ('admin','facilitator','citizen')),
  created_at timestamptz not null default now()
);

-- Proposals represent ideas or motions to be considered by the group.
-- status tracks the current phase of the sociocratic process.
create table proposals (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references users(id),
  title text not null,
  description text not null,
  context text,
  status text not null check (status in (
    'DRAFT',             -- proposal being drafted by the author
    'CLARIFICATION_OPEN',-- clarification round is open
    'REACTION_OPEN',     -- reaction round is open
    'CONSENT_OPEN',      -- consent round is open
    'REVISIONS_OPEN',    -- revisions / safe-to-try integration round is open
    'CONSENTED',         -- proposal has passed consent
    'REVIEW_DUE'         -- review period is due
  )),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Clarifications allow participants to ask clarifying questions about a proposal.
create table clarifications (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  author_id uuid references users(id),
  content text not null,
  created_at timestamptz not null default now()
);

-- Reactions capture participants' reactions after clarification (e.g. concerns, suggestions).
create table reactions (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  author_id uuid references users(id),
  type text not null check (type in ('question','suggestion','concern','approval')),
  content text,
  created_at timestamptz not null default now()
);

-- Consent rounds organize each phase of the sociocratic process for a given proposal.
create table consent_rounds (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  round_type text not null check (round_type in (
    'CLARIFICATION',
    'REACTION',
    'CONSENT',
    'REVISIONS',
    'REVIEW'
  )),
  version integer not null default 1,
  opened_at timestamptz not null,
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Votes register each participant's vote within a consent round.
create table votes (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references consent_rounds(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  vote text not null check (vote in ('consent','objection','concern','abstain')),
  comment text,
  created_at timestamptz not null default now(),
  unique (round_id, user_id) -- one vote per user per round
);

-- Objections store formal objections raised during the consent round, along with suggested changes.
create table objections (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  user_id uuid references users(id),
  description text not null,
  suggested_change text,
  created_at timestamptz not null default now()
);

-- Decisions capture the final outcome of a proposal after consent is reached.
create table decisions (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  final_text text not null,
  accepted_at timestamptz,
  review_date date
);

-- Indexes to speed up lookups
create index on proposals(status);
create index on clarifications(proposal_id);
create index on reactions(proposal_id);
create index on consent_rounds(proposal_id);
create index on votes(round_id);
create index on objections(proposal_id);
create index on decisions(proposal_id);
