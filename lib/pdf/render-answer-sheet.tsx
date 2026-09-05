import { renderToBuffer } from "@react-pdf/renderer";
import { AnswerSheetDocument, type AnswerSheetProps } from "./answer-sheet";

/** Renders the answer sheet PDF to a Buffer, ready to attach to an email or upload. */
export async function renderAnswerSheetPdf(
  props: AnswerSheetProps
): Promise<Buffer> {
  return renderToBuffer(<AnswerSheetDocument {...props} />);
}
