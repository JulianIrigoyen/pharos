-- Lets a student choose, once, between a fully timed exam simulation and
-- an untimed practice mode. Null until they pick on the "Start Exam"
-- screen; set together with exam_started_at (see /api/exam/[orderId]/start).

alter table orders add column if not exists exam_timed_mode boolean;
