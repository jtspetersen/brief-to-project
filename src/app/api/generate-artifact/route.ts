/**
 * Document Generation API Route
 *
 * POST /api/generate-artifact
 * Body: { type: ArtifactType, data: object, projectName: string, format?: "docx" | "xlsx" }
 * Returns: .docx or .xlsx file as binary download
 */
import { generators, xlsxGenerators, getFileName } from "@/lib/generators";
import type { ArtifactType } from "@/lib/types/artifacts";

const CONTENT_TYPES = {
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const;

export async function POST(req: Request) {
  try {
    const { type, data, projectName, format = "docx" } = (await req.json()) as {
      type: ArtifactType;
      data: Record<string, unknown>;
      projectName: string;
      format?: "docx" | "xlsx";
    };

    // Pick the right generator based on format
    const generator =
      format === "xlsx" ? xlsxGenerators[type] : generators[type];

    if (!generator) {
      return new Response(
        JSON.stringify({ error: `No ${format} generator for artifact type: ${type}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const buffer = await generator(data);
    const fileName = getFileName(type, projectName || "Project", format);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": CONTENT_TYPES[format],
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (error) {
    console.error("Document generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate document" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
