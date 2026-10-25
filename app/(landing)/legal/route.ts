import { serveLegalDocument } from "@/lib/legal-documents";

export const runtime = "nodejs";

export function GET() {
  return serveLegalDocument("index.html");
}
