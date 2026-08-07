import type { Chunk } from "./types";

/**
 * Quebra um documento markdown em chunks por seção (`## `).
 *
 * Estratégia:
 * - O título do documento vem do primeiro `# `.
 * - A linha de fontes (`> **Fontes**: ...`) é extraída e anexada a cada chunk,
 *   para que toda resposta possa citar de onde veio.
 * - Cada seção `## ` vira um chunk. Seções muito grandes são divididas por
 *   parágrafos, respeitando um teto de caracteres, para não estourar o contexto.
 */
export function chunkMarkdown(docId: string, raw: string): Chunk[] {
  const MAX_CHARS = 1400;
  const lines = raw.split("\n");

  let docTitle = docId.replace(/\.md$/, "").replace(/__/g, " › ");
  let source = "";

  // Extrai título (# ) e linha de fontes (> **Fontes**).
  for (const line of lines) {
    if (!docTitle.startsWith("#") && line.startsWith("# ")) {
      docTitle = line.replace(/^#\s+/, "").trim();
    }
    if (/^>\s*\*\*Fontes?\*\*/i.test(line)) {
      source = line
        .replace(/^>\s*\*\*Fontes?\*\*:?\s*/i, "")
        .replace(/\*/g, "")
        .trim();
      break;
    }
  }

  // Divide o corpo em seções por "## ".
  const sections: { heading: string; body: string }[] = [];
  let current = { heading: "", body: "" };
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current.body.trim()) sections.push(current);
      current = { heading: line.replace(/^##\s+/, "").trim(), body: "" };
    } else if (!line.startsWith("# ")) {
      current.body += line + "\n";
    }
  }
  if (current.body.trim()) sections.push(current);

  // Se não houver nenhuma seção "## ", trata o doc inteiro como uma seção.
  if (sections.length === 0) {
    sections.push({ heading: "", body: raw });
  }

  const chunks: Chunk[] = [];
  let idx = 0;

  for (const sec of sections) {
    const pieces = splitByBudget(sec.body.trim(), MAX_CHARS);
    for (const piece of pieces) {
      if (!piece.trim()) continue;
      chunks.push({
        id: `${docId}#${idx}`,
        docId,
        docTitle,
        section: sec.heading,
        source,
        text: piece.trim(),
      });
      idx++;
    }
  }

  return chunks;
}

/** Divide um texto em blocos <= maxChars, cortando em parágrafos quando possível. */
function splitByBudget(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];

  const paragraphs = text.split(/\n\s*\n/);
  const out: string[] = [];
  let buf = "";

  for (const p of paragraphs) {
    if ((buf + "\n\n" + p).length > maxChars && buf) {
      out.push(buf);
      buf = p;
    } else {
      buf = buf ? buf + "\n\n" + p : p;
    }
  }
  if (buf) out.push(buf);

  return out;
}
