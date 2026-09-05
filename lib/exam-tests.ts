import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExamLevel } from "@/types/diagnostic";

/**
 * Picks the next test from the bank for a given level, in sequential
 * order: a student's 1st attempt at a level gets the first test
 * (alphabetically by test_code — e.g. "B2-CAMBRIDGE-SAMPLE-1"), their 2nd attempt
 * gets the next one, and so on. Once they've cycled through every test
 * in the bank, it wraps back around to the first one.
 *
 * "Attempt number" is counted as how many of this student's previous
 * orders at this level already have an assigned_test_code — i.e. how
 * many times they've actually started this diagnostic before, not just
 * purchased it.
 *
 * Assumes the caller already knows the order needs an assignment (i.e.
 * assigned_test_code is currently null) — this function doesn't guard
 * against double-assignment itself; the caller (the /start route) does
 * that the same way it already guards exam_started_at.
 */
export async function pickTestForOrder(
  supabase: SupabaseClient,
  examLevel: ExamLevel,
  customerEmail: string | null
): Promise<string | null> {
  const { data: activeTests, error } = await supabase
    .from("exam_tests")
    .select("test_code")
    .eq("exam_level", examLevel)
    .eq("active", true)
    .order("test_code", { ascending: true });

  if (error || !activeTests || activeTests.length === 0) {
    console.error(
      "No active tests found in bank for level:",
      examLevel,
      error
    );
    return null;
  }

  const sequence = (activeTests as { test_code: string }[]).map(
    (t) => t.test_code
  );

  let priorAttempts = 0;
  if (customerEmail) {
    const { count, error: countError } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("customer_email", customerEmail)
      .eq("exam_level", examLevel)
      .not("assigned_test_code", "is", null);

    if (countError) {
      console.error("Failed to count prior attempts:", countError);
    } else {
      priorAttempts = count ?? 0;
    }
  }

  return sequence[priorAttempts % sequence.length];
}
