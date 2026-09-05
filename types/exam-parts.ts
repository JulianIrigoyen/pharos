import type { ExamLevel } from "./diagnostic";

/**
 * Reading and Use of English — part configuration
 *
 * This describes the *shape* of the answer sheet, not the test content.
 * The student reads every question, given word, and sentence on the test
 * PDF (left panel); this form only captures their answer — exactly like
 * the real Cambridge answer sheet, and exactly like the current Google
 * Form Marcela uses (numbered answers only, no question text). That is
 * also why question numbers run continuously across the whole paper
 * (Q1...Q52 for B2, Q1...Q56 for C1) instead of restarting at 1 in every
 * part — it matches both the official Cambridge answer sheet and the
 * existing Google Sheet columns (Q1 | Q2 | ... | Q52).
 *
 * Because the structure is fixed by Cambridge and identical across every
 * test in the bank (B2-CAMBRIDGE-SAMPLE-1, B2-SCHOOLS-SAMPLE-1, B2-DIGITAL-1...), one config per level is
 * enough — no per-test-in-the-bank component needed.
 */

export type UseOfEnglishPartKind = "radio" | "text";

interface BasePartConfig {
  /** Official Cambridge part number for this exam level (1-indexed). */
  id: number;
  title: string;
  instructions: string;
  /** Global question number this part starts at (Q1, Q9, Q17...). */
  startQuestion: number;
  /** Number of questions in this part. */
  count: number;
}

export interface RadioPartConfig extends BasePartConfig {
  kind: "radio";
  /** The letter options the student chooses from for every question in this part. */
  options: readonly string[];
}

export interface TextPartConfig extends BasePartConfig {
  kind: "text";
}

export type UseOfEnglishPartConfig = RadioPartConfig | TextPartConfig;

// Letter option sets used across Reading & Use of English parts.
export const OPTIONS_ABCD = ["A", "B", "C", "D"] as const;
export const OPTIONS_ABCDEFG = ["A", "B", "C", "D", "E", "F", "G"] as const;

/**
 * B2 First — Reading and Use of English
 * Official format: 1h15, 7 parts, 52 questions.
 * Source: https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/format/
 */
const B2_PARTS: UseOfEnglishPartConfig[] = [
  {
    kind: "radio",
    id: 1,
    title: "Part 1: Multiple Choice Cloze",
    instructions:
      "For each question 1-8, select the correct option A, B, C, or D.",
    startQuestion: 1,
    count: 8,
    options: OPTIONS_ABCD,
  },
  {
    kind: "text",
    id: 2,
    title: "Part 2: Open Cloze",
    instructions:
      "For each question 9-16, write the missing word in the gap.",
    startQuestion: 9,
    count: 8,
  },
  {
    kind: "text",
    id: 3,
    title: "Part 3: Word Formation",
    instructions:
      "For each question 17-24, write the word formed from the given word (printed on the test) that fits the gap.",
    startQuestion: 17,
    count: 8,
  },
  {
    kind: "text",
    id: 4,
    title: "Part 4: Key Word Transformations",
    instructions:
      "For each question 25-30, write the missing words (between three and six words) that complete the second sentence, using the key word given on the test.",
    startQuestion: 25,
    count: 6,
  },
  {
    kind: "radio",
    id: 5,
    title: "Part 5: Multiple Choice",
    instructions:
      "For each question 31-36, choose the answer A, B, C, or D that best fits according to the text.",
    startQuestion: 31,
    count: 6,
    options: OPTIONS_ABCD,
  },
  {
    kind: "radio",
    id: 6,
    title: "Part 6: Gapped Text",
    instructions:
      "For each question 37-42, choose from paragraphs A-G the one which fits each gap. There is one extra paragraph which you do not need to use.",
    startQuestion: 37,
    count: 6,
    options: OPTIONS_ABCDEFG,
  },
  {
    kind: "radio",
    id: 7,
    title: "Part 7: Multiple Matching",
    instructions:
      "For each question 43-52, choose from the sections A-D.",
    startQuestion: 43,
    count: 10,
    options: OPTIONS_ABCD,
  },
];

/**
 * C1 Advanced — Reading and Use of English
 * Official format: 1h30, 8 parts, 56 questions.
 * Source: https://www.cambridgeenglish.org/exams-and-tests/qualifications/advanced/format/
 *
 * Note: the exact number of sections in Part 8 (Multiple Matching) can vary
 * slightly by test edition — confirm against the specific test bank PDF
 * before assigning options if a given test uses more than 4 sections.
 */
const C1_PARTS: UseOfEnglishPartConfig[] = [
  {
    kind: "radio",
    id: 1,
    title: "Part 1: Multiple Choice Cloze",
    instructions:
      "For each question 1-8, select the correct option A, B, C, or D.",
    startQuestion: 1,
    count: 8,
    options: OPTIONS_ABCD,
  },
  {
    kind: "text",
    id: 2,
    title: "Part 2: Open Cloze",
    instructions:
      "For each question 9-16, write the missing word in the gap.",
    startQuestion: 9,
    count: 8,
  },
  {
    kind: "text",
    id: 3,
    title: "Part 3: Word Formation",
    instructions:
      "For each question 17-24, write the word formed from the given word (printed on the test) that fits the gap.",
    startQuestion: 17,
    count: 8,
  },
  {
    kind: "text",
    id: 4,
    title: "Part 4: Key Word Transformations",
    instructions:
      "For each question 25-30, write the missing words (between three and six words) that complete the second sentence, using the key word given on the test.",
    startQuestion: 25,
    count: 6,
  },
  {
    kind: "radio",
    id: 5,
    title: "Part 5: Multiple Choice",
    instructions:
      "For each question 31-36, choose the answer A, B, C, or D that best fits according to the text.",
    startQuestion: 31,
    count: 6,
    options: OPTIONS_ABCD,
  },
  {
    kind: "radio",
    id: 6,
    title: "Part 6: Cross-text Multiple Matching",
    instructions:
      "For each question 37-40, choose from the texts A-D.",
    startQuestion: 37,
    count: 4,
    options: OPTIONS_ABCD,
  },
  {
    kind: "radio",
    id: 7,
    title: "Part 7: Gapped Text",
    instructions:
      "For each question 41-46, choose from paragraphs A-G the one which fits each gap. There is one extra paragraph which you do not need to use.",
    startQuestion: 41,
    count: 6,
    options: OPTIONS_ABCDEFG,
  },
  {
    kind: "radio",
    id: 8,
    title: "Part 8: Multiple Matching",
    instructions:
      "For each question 47-56, choose from the sections A-D.",
    startQuestion: 47,
    count: 10,
    options: OPTIONS_ABCD,
  },
];

export const USE_OF_ENGLISH_PARTS_BY_LEVEL: Record<
  ExamLevel,
  UseOfEnglishPartConfig[]
> = {
  B2: B2_PARTS,
  C1: C1_PARTS,
};

/**
 * Official Cambridge Reading and Use of English paper duration, in
 * minutes. Same sources as above: 1h15 for B2 First, 1h30 for C1
 * Advanced. Drives the exam countdown timer.
 */
export const USE_OF_ENGLISH_DURATION_MINUTES: Record<ExamLevel, number> = {
  B2: 75,
  C1: 90,
};
