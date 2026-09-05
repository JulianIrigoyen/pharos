-- Server-tracked exam timer: records when a student actually started
-- their timed diagnostic, so the countdown survives refreshes/closed
-- tabs (the client always computes remaining time from this timestamp,
-- never from its own local state).

alter table orders add column if not exists exam_started_at timestamptz;
