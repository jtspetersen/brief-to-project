/**
 * Risk Register Spreadsheet Generator (.xlsx)
 *
 * Creates a formatted Excel spreadsheet from risk-register artifact data.
 * Includes conditional formatting on risk scores (green/yellow/orange/red).
 */
import ExcelJS from "exceljs";

interface RiskRegisterData {
  projectName: string;
  risks: {
    id: string;
    category: string;
    description: string;
    probability: number;
    impact: number;
    score: number;
    rating: string;
    mitigation: string;
    contingency: string;
    owner: string;
    status: string;
  }[];
}

// Colors for risk ratings
const RATING_COLORS: Record<string, string> = {
  Low: "92D050",       // Green
  Medium: "FFC000",    // Yellow/amber
  High: "FF6600",      // Orange
  Critical: "FF0000",  // Red
};

const HEADER_FILL: ExcelJS.FillPattern = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1F2937" }, // Dark gray
};

const HEADER_FONT: Partial<ExcelJS.Font> = {
  name: "Arial",
  size: 11,
  bold: true,
  color: { argb: "FFFFFFFF" },
};

const BODY_FONT: Partial<ExcelJS.Font> = {
  name: "Arial",
  size: 10,
};

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "FFD1D5DB" } },
  bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
  left: { style: "thin", color: { argb: "FFD1D5DB" } },
  right: { style: "thin", color: { argb: "FFD1D5DB" } },
};

export async function generateRiskRegisterXlsx(data: RiskRegisterData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Brief-to-Project";

  const sheet = workbook.addWorksheet("Risk Register", {
    views: [{ state: "frozen", ySplit: 2 }], // Freeze header rows
  });

  // ── Title row ──
  sheet.mergeCells("A1:K1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = `Risk Register — ${data.projectName}`;
  titleCell.font = { name: "Arial", size: 14, bold: true };
  titleCell.alignment = { horizontal: "center" };
  sheet.getRow(1).height = 30;

  // ── Header row ──
  const headers = [
    "ID", "Category", "Description", "Probability\n(1-5)", "Impact\n(1-5)",
    "Score", "Rating", "Mitigation", "Contingency", "Owner", "Status",
  ];

  const headerRow = sheet.getRow(2);
  headers.forEach((header, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = header;
    cell.font = HEADER_FONT;
    cell.fill = HEADER_FILL;
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN_BORDER;
  });
  headerRow.height = 35;

  // ── Column widths ──
  sheet.columns = [
    { width: 8 },   // ID
    { width: 14 },  // Category
    { width: 35 },  // Description
    { width: 12 },  // Probability
    { width: 10 },  // Impact
    { width: 8 },   // Score
    { width: 10 },  // Rating
    { width: 35 },  // Mitigation
    { width: 30 },  // Contingency
    { width: 15 },  // Owner
    { width: 12 },  // Status
  ];

  // ── Data rows ──
  for (const risk of data.risks) {
    const row = sheet.addRow([
      risk.id,
      risk.category,
      risk.description,
      risk.probability,
      risk.impact,
      risk.score,
      risk.rating,
      risk.mitigation,
      risk.contingency,
      risk.owner,
      risk.status,
    ]);

    row.eachCell((cell, colNumber) => {
      cell.font = BODY_FONT;
      cell.border = THIN_BORDER;
      cell.alignment = { vertical: "top", wrapText: true };

      // Center-align numeric and short fields
      if ([1, 4, 5, 6, 7, 11].includes(colNumber)) {
        cell.alignment = { horizontal: "center", vertical: "top" };
      }
    });

    // Color the Rating cell based on risk level
    const ratingCell = row.getCell(7);
    const ratingColor = RATING_COLORS[risk.rating];
    if (ratingColor) {
      ratingCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${ratingColor}` },
      };
      // Use white text for dark backgrounds
      if (risk.rating === "High" || risk.rating === "Critical") {
        ratingCell.font = { ...BODY_FONT, bold: true, color: { argb: "FFFFFFFF" } };
      } else {
        ratingCell.font = { ...BODY_FONT, bold: true };
      }
    }

    // Color the Score cell with a gradient
    const scoreCell = row.getCell(6);
    const score = risk.score;
    let scoreColor = "92D050"; // green
    if (score >= 16) scoreColor = "FF0000";
    else if (score >= 10) scoreColor = "FF6600";
    else if (score >= 5) scoreColor = "FFC000";
    scoreCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${scoreColor}` },
    };
    if (score >= 10) {
      scoreCell.font = { ...BODY_FONT, bold: true, color: { argb: "FFFFFFFF" } };
    } else {
      scoreCell.font = { ...BODY_FONT, bold: true };
    }
  }

  // ── Legend at bottom ──
  const legendStartRow = data.risks.length + 4;
  sheet.getCell(`A${legendStartRow}`).value = "Risk Score Legend:";
  sheet.getCell(`A${legendStartRow}`).font = { ...BODY_FONT, bold: true };

  const legendItems = [
    { label: "Low (1-4)", color: "92D050" },
    { label: "Medium (5-9)", color: "FFC000" },
    { label: "High (10-15)", color: "FF6600" },
    { label: "Critical (16-25)", color: "FF0000" },
  ];

  legendItems.forEach((item, i) => {
    const row = legendStartRow + 1 + i;
    const cell = sheet.getCell(`A${row}`);
    cell.value = item.label;
    cell.font = BODY_FONT;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${item.color}` },
    };
    if (i >= 2) {
      cell.font = { ...BODY_FONT, color: { argb: "FFFFFFFF" } };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
