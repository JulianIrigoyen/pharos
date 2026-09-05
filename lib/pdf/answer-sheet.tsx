import fs from "node:fs";
import path from "node:path";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { ExamLevel } from "@/types/diagnostic";
import { USE_OF_ENGLISH_PARTS_BY_LEVEL } from "@/types/exam-parts";

export interface AnswerSheetProps {
  studentName: string | null;
  studentEmail: string;
  examLevel: ExamLevel;
  orderId: string;
  /** Which test from the bank the student was assigned (e.g. "B2-CAMBRIDGE-SAMPLE-1"), if any — lets Marcela's correction process know which answer key to grade against. */
  testCode: string | null;
  submittedAt: string; // ISO timestamp
  /** Flat Q1..Q52/56 answers, exactly what the student submitted. */
  answers: Record<string, string | undefined>;
}

// Pharos brand colors, taken from tailwind.config.ts (navy / gold palette)
// so this PDF looks consistent with the site.
const NAVY_900 = "#1a365d";
const NAVY_700 = "#334e68";
const NAVY_500 = "#627d98";
const NAVY_100 = "#d9e2ec";

// The full gold lockup (lighthouse + wordmark + tagline) already used
// elsewhere on the site — read once at module load, not per-request.
const LOGO_PATH = path.join(process.cwd(), "public", "pharos-footer-logo.png");
const logoBuffer = fs.existsSync(LOGO_PATH)
  ? fs.readFileSync(LOGO_PATH)
  : null;

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: NAVY_700,
  },
  header: {
    marginBottom: 18,
    paddingBottom: 10,
    borderBottom: `2 solid ${NAVY_900}`,
  },
  logo: {
    width: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: NAVY_900,
  },
  metaRow: {
    marginTop: 6,
    fontSize: 9,
    color: NAVY_500,
  },
  partTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: NAVY_900,
    marginTop: 14,
    marginBottom: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "20%",
    flexDirection: "row",
    marginBottom: 5,
    paddingRight: 6,
  },
  qNum: {
    width: 22,
    fontFamily: "Helvetica-Bold",
    color: NAVY_700,
  },
  answer: {
    flex: 1,
    borderBottom: `0.5 solid ${NAVY_100}`,
    paddingBottom: 1,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    fontSize: 8,
    color: NAVY_500,
    borderTop: `0.5 solid ${NAVY_100}`,
    paddingTop: 6,
  },
});

/**
 * Renders the student's Use of English submission as a clean,
 * answer-sheet-style PDF: question number + the letter or word they
 * submitted, grouped by part, with no question text (that stays on the
 * test PDF). Used both as a record for the student and as the input
 * document for the correction workflow.
 */
export function AnswerSheetDocument({
  studentName,
  studentEmail,
  examLevel,
  orderId,
  testCode,
  submittedAt,
  answers,
}: AnswerSheetProps) {
  const parts = USE_OF_ENGLISH_PARTS_BY_LEVEL[examLevel];
  const submittedDate = new Date(submittedAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoBuffer && <Image src={logoBuffer} style={styles.logo} />}
          <Text style={styles.title}>
            Use of English — Answer Sheet ({examLevel})
          </Text>
          <Text style={styles.metaRow}>
            Student: {studentName ?? studentEmail} ({studentEmail})
          </Text>
          <Text style={styles.metaRow}>
            Order: {orderId} · Submitted: {submittedDate}
          </Text>
          {testCode && (
            <Text style={styles.metaRow}>Test Code: {testCode}</Text>
          )}
        </View>

        {parts.map((part) => (
          <View key={part.id} wrap={false}>
            <Text style={styles.partTitle}>{part.title}</Text>
            <View style={styles.grid}>
              {Array.from({ length: part.count }, (_, i) => {
                const q = part.startQuestion + i;
                const value = answers[`Q${q}`];
                return (
                  <View key={q} style={styles.cell}>
                    <Text style={styles.qNum}>{q}.</Text>
                    <Text style={styles.answer}>{value || "—"}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <Text style={styles.footer} fixed>
          Generated automatically by Pharos English Lab. This document
          records the student&apos;s submitted answers only — it does not
          include scoring or feedback.
        </Text>
      </Page>
    </Document>
  );
}
