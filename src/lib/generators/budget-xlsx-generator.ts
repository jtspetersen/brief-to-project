/**
 * Budget Estimate Spreadsheet Generator (.xlsx)
 *
 * Creates a formatted Excel spreadsheet from budget artifact data.
 * Includes category subtotals, contingency, and grand total.
 */
import ExcelJS from "exceljs";

interface BudgetData {
  projectName: string;
  currency: string;
  categories: {
    category: string;
    lineItems: { item: string; amount: string; notes: string }[];
    subtotal: string;
  }[];
  contingency: { percentage: string; amount: string };
  totalBudget: string;
}

const HEADER_FILL: ExcelJS.FillPattern = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1F2937" },
};

const CATEGORY_FILL: ExcelJS.FillPattern = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFE5E7EB" },
};

const SUBTOTAL_FILL: ExcelJS.FillPattern = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF3F4F6" },
};

const TOTAL_FILL: ExcelJS.FillPattern = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1F2937" },
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

export async function generateBudgetXlsx(data: BudgetData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "BriefKit";

  const sheet = workbook.addWorksheet("Budget Estimate", {
    views: [{ state: "frozen", ySplit: 2 }],
  });

  // ── Title row ──
  sheet.mergeCells("A1:D1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = `Budget Estimate — ${data.projectName} (${data.currency})`;
  titleCell.font = { name: "Arial", size: 14, bold: true };
  titleCell.alignment = { horizontal: "center" };
  sheet.getRow(1).height = 30;

  // ── Header row ──
  const headers = ["Category / Item", "Amount", "Notes", ""];
  const headerRow = sheet.getRow(2);
  headers.forEach((header, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = header;
    cell.font = HEADER_FONT;
    cell.fill = HEADER_FILL;
    cell.alignment = { horizontal: i === 1 ? "right" : "left", vertical: "middle" };
    cell.border = THIN_BORDER;
  });
  headerRow.height = 25;

  // ── Column widths ──
  sheet.columns = [
    { width: 40 },  // Category / Item
    { width: 18 },  // Amount
    { width: 45 },  // Notes
    { width: 5 },   // Spacer
  ];

  // ── Data rows ──
  for (const cat of data.categories) {
    // Category header row
    const catRow = sheet.addRow([cat.category, "", ""]);
    catRow.eachCell((cell) => {
      cell.font = { ...BODY_FONT, bold: true, size: 11 };
      cell.fill = CATEGORY_FILL;
      cell.border = THIN_BORDER;
    });

    // Line items
    for (const item of cat.lineItems) {
      const itemRow = sheet.addRow([`    ${item.item}`, item.amount, item.notes]);
      itemRow.eachCell((cell, colNumber) => {
        cell.font = BODY_FONT;
        cell.border = THIN_BORDER;
        if (colNumber === 2) {
          cell.alignment = { horizontal: "right" };
        }
      });
    }

    // Subtotal row
    const subRow = sheet.addRow([`  Subtotal: ${cat.category}`, cat.subtotal, ""]);
    subRow.eachCell((cell, colNumber) => {
      cell.font = { ...BODY_FONT, bold: true };
      cell.fill = SUBTOTAL_FILL;
      cell.border = THIN_BORDER;
      if (colNumber === 2) {
        cell.alignment = { horizontal: "right" };
      }
    });
  }

  // ── Spacer row ──
  sheet.addRow([]);

  // ── Contingency row ──
  const contRow = sheet.addRow([
    `Contingency (${data.contingency.percentage})`,
    data.contingency.amount,
    "",
  ]);
  contRow.eachCell((cell, colNumber) => {
    cell.font = { ...BODY_FONT, bold: true };
    cell.border = THIN_BORDER;
    if (colNumber === 2) {
      cell.alignment = { horizontal: "right" };
    }
  });

  // ── Grand Total row ──
  const totalRow = sheet.addRow(["TOTAL PROJECT BUDGET", data.totalBudget, ""]);
  totalRow.eachCell((cell, colNumber) => {
    cell.font = { name: "Arial", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = TOTAL_FILL;
    cell.border = THIN_BORDER;
    if (colNumber === 2) {
      cell.alignment = { horizontal: "right" };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
