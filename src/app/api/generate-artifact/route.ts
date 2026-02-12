/**
 * Document Generation API Route
 *
 * POST /api/generate-artifact
 * Body: { type: ArtifactType, data: object, projectName: string }
 * Returns: .docx file as binary download
 */
import { generators, getFileName } from "@/lib/generators";
import type { ArtifactType } from "@/lib/types/artifacts";

export async function POST(req: Request) {
  try {
    const { type, data, projectName } = (await req.json()) as {
      type: ArtifactType;
      data: Record<string, unknown>;
      projectName: string;
    };

    const generator = generators[type];
    if (!generator) {
      return new Response(
        JSON.stringify({ error: `No generator found for artifact type: ${type}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const buffer = await generator(data);
    const fileName = getFileName(type, projectName || "Project");

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
