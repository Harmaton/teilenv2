import { readFile } from "node:fs/promises";
import path from "node:path";

export type LegalDocument = "index.html" | "precio.html" | "terminos.html" | "privacidad.html" | "reembolsos.html";

export async function getLegalDocumentContent(filename: LegalDocument) {
  const filePath = path.join(process.cwd(), "public", "legal-documents", filename);
  const html = await readFile(filePath, "utf8");
  const match = html.match(/<main id="contenido">([\s\S]*?)<\/main>/i);

  if (!match) {
    throw new Error(`The legal document ${filename} is missing its main content.`);
  }

  return match[1].replaceAll("24 de octubre de 2026", "26 de octubre de 2026");
}
