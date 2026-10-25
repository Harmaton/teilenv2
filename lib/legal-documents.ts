import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const documents = new Set(["index.html", "precio.html", "terminos.html", "privacidad.html", "reembolsos.html"]);

export async function serveLegalDocument(filename: string) {
  if (!documents.has(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", "legal-documents", filename);
  const html = await readFile(filePath, "utf8");

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
