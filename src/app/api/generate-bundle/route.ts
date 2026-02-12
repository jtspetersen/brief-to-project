/**
 * Bundle Generation API Route
 *
 * POST /api/generate-bundle
 * Body: { artifacts: Array<{ type, data }>, projectName: string }
 * Returns: .zip file containing all generated documents
 */
import JSZip from "jszip";
import { generators, xlsxGenerators, getFileName } from "@/lib/generators";
import type { ArtifactType } from "@/lib/types/artifacts";

interface ArtifactInput {
  type: ArtifactType;
  data: Record<string, unknown>;
}

export async function POST(req: Request) {
  try {
    const { artifacts, projectName } = (await req.json()) as {
      artifacts: ArtifactInput[];
      projectName: string;
    };

    if (!artifacts || artifacts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No artifacts provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const zip = new JSZip();
    const safeName = projectName.replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "_");

    // Generate all documents in parallel
    const tasks = artifacts.flatMap((artifact) => {
      const result: Promise<void>[] = [];

      // Always generate .docx
      const docxGen = generators[artifact.type];
      if (docxGen) {
        result.push(
          docxGen(artifact.data).then((buffer) => {
            const fileName = getFileName(artifact.type, projectName, "docx");
            zip.file(fileName, buffer);
          })
        );
      }

      // Also generate .xlsx if available
      const xlsxGen = xlsxGenerators[artifact.type];
      if (xlsxGen) {
        result.push(
          xlsxGen(artifact.data).then((buffer) => {
            const fileName = getFileName(artifact.type, projectName, "xlsx");
            zip.file(fileName, buffer);
          })
        );
      }

      return result;
    });

    await Promise.all(tasks);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipFileName = `${safeName}_Documentation.zip`;

    return new Response(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipFileName}"`,
        "Content-Length": String(zipBuffer.length),
      },
    });
  } catch (error) {
    console.error("Bundle generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate documentation bundle" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
