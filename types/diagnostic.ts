export type DiagnosticType = "writing" | "use-of-english" | "listening";
export type ExamLevel = "B2" | "C1";

export interface Diagnostic {
  slug: DiagnosticType;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  features: string[];
  examLevels: ExamLevel[];
}

export const DIAGNOSTICS: Diagnostic[] = [
  {
    slug: "writing",
    title: "Writing Diagnostic",
    subtitle: "Detailed analysis of your writing performance",
    description:
      "Submit a writing task and receive a corrected version, performance analysis against Cambridge descriptors, improvement suggestions, and an estimated exam score.",
    price: 15,
    features: [
      "Corrected version of your writing",
      "Performance analysis by Cambridge criteria",
      "Content, Communicative Achievement, Organisation, Language",
      "Specific improvement suggestions",
      "Estimated Cambridge exam score",
    ],
    examLevels: ["B2", "C1"],
  },
  {
    slug: "use-of-english",
    title: "Use of English Diagnostic",
    subtitle: "Grammar, vocabulary & structure analysis",
    description:
      "Complete a full Use of English paper and receive detailed analysis of your grammar, vocabulary, word formation, and transformation skills.",
    price: 8,
    features: [
      "Multiple choice cloze analysis",
      "Open cloze evaluation",
      "Word formation assessment",
      "Key word transformations review",
      "Targeted grammar improvement areas",
    ],
    examLevels: ["B2", "C1"],
  },
  {
    slug: "listening",
    title: "Listening Diagnostic",
    subtitle: "Comprehension & strategy assessment",
    description:
      "Complete a listening exam and receive analysis of your listening accuracy, paraphrase recognition, and exam strategy effectiveness.",
    price: 8,
    features: [
      "Listening accuracy breakdown",
      "Paraphrase recognition analysis",
      "Exam strategy evaluation",
      "Part-by-part performance",
      "Targeted improvement suggestions",
    ],
    examLevels: ["B2", "C1"],
  },
];
