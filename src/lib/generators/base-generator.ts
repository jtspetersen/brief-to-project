/**
 * Base Document Generator
 *
 * Shared formatting utilities for all Word document generators.
 * Every artifact generator imports from here to get consistent styling:
 * - US Letter page size (8.5" x 11")
 * - Arial font, 12pt default
 * - 1-inch margins
 * - Page numbers in footer
 * - Heading styles (H1 = 16pt bold, H2 = 14pt bold)
 */
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  PageNumber,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  WidthType,
  TableLayoutType,
  convertInchesToTwip,
  type ISectionOptions,
} from "docx";

// ── Constants ────────────────────────────────────────────────────────

const FONT = "Arial";
const FONT_SIZE_PT = 12;
const FONT_SIZE_HALF_PT = FONT_SIZE_PT * 2; // docx uses half-points
const H1_SIZE_HALF_PT = 16 * 2;
const H2_SIZE_HALF_PT = 14 * 2;
const H3_SIZE_HALF_PT = 13 * 2;

const PAGE_WIDTH_TWIPS = convertInchesToTwip(8.5);  // US Letter width
const PAGE_HEIGHT_TWIPS = convertInchesToTwip(11);   // US Letter height
const MARGIN_TWIPS = convertInchesToTwip(1);         // 1-inch margins

// Colors
const PRIMARY_COLOR = "1F2937";   // Dark gray for headings
const ACCENT_COLOR = "2563EB";    // Blue accent
const LIGHT_GRAY = "F3F4F6";     // Light gray for table headers
const BORDER_COLOR = "D1D5DB";    // Gray for table borders

// ── Section defaults (used by every generator) ──────────────────────

export function getDefaultSection(
  children: (Paragraph | Table)[]
): ISectionOptions {
  return {
    properties: {
      page: {
        size: {
          width: PAGE_WIDTH_TWIPS,
          height: PAGE_HEIGHT_TWIPS,
          orientation: undefined, // portrait
        },
        margin: {
          top: MARGIN_TWIPS,
          right: MARGIN_TWIPS,
          bottom: MARGIN_TWIPS,
          left: MARGIN_TWIPS,
        },
      },
    },
    headers: {
      default: new Header({ children: [] }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                children: [PageNumber.CURRENT],
                font: FONT,
                size: 18, // 9pt in half-points
                color: "999999",
              }),
            ],
          }),
        ],
      }),
    },
    children,
  };
}

// ── Paragraph helpers ───────────────────────────────────────────────

/** Main document title — 16pt bold, centered, with blue accent */
export function title(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200, before: 0 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: H1_SIZE_HALF_PT,
        bold: true,
        color: PRIMARY_COLOR,
      }),
    ],
  });
}

/** Subtitle line (e.g. date, project name under title) — 12pt, centered, gray */
export function subtitle(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: FONT_SIZE_HALF_PT,
        color: "666666",
      }),
    ],
  });
}

/** Section heading — 16pt bold (H1 level) */
export function heading1(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: H1_SIZE_HALF_PT,
        bold: true,
        color: PRIMARY_COLOR,
      }),
    ],
  });
}

/** Sub-section heading — 14pt bold (H2 level) */
export function heading2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: H2_SIZE_HALF_PT,
        bold: true,
        color: PRIMARY_COLOR,
      }),
    ],
  });
}

/** Minor heading — 13pt bold (H3 level) */
export function heading3(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: H3_SIZE_HALF_PT,
        bold: true,
        color: PRIMARY_COLOR,
      }),
    ],
  });
}

/** Standard body paragraph — 12pt Arial */
export function bodyText(text: string, options?: { bold?: boolean; italic?: boolean }): Paragraph {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: FONT_SIZE_HALF_PT,
        bold: options?.bold,
        italics: options?.italic,
      }),
    ],
  });
}

/** A paragraph with a bold label followed by normal text, e.g. "Budget: $850,000" */
export function labeledField(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: `${label}: `,
        font: FONT,
        size: FONT_SIZE_HALF_PT,
        bold: true,
      }),
      new TextRun({
        text: value,
        font: FONT,
        size: FONT_SIZE_HALF_PT,
      }),
    ],
  });
}

/** Bullet point item */
export function bulletItem(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: FONT_SIZE_HALF_PT,
      }),
    ],
  });
}

/** Indented sub-bullet */
export function subBulletItem(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 1 },
    spacing: { after: 40 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: FONT_SIZE_HALF_PT,
      }),
    ],
  });
}

/** Empty line for spacing */
export function spacer(): Paragraph {
  return new Paragraph({ spacing: { after: 200 }, children: [] });
}

/** Horizontal rule (thin gray line) */
export function divider(): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: BORDER_COLOR,
      },
    },
    children: [],
  });
}

// ── Table helpers ───────────────────────────────────────────────────

const TABLE_BORDER = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: BORDER_COLOR,
};

const TABLE_BORDERS = {
  top: TABLE_BORDER,
  bottom: TABLE_BORDER,
  left: TABLE_BORDER,
  right: TABLE_BORDER,
  insideHorizontal: TABLE_BORDER,
  insideVertical: TABLE_BORDER,
};

// Content area width: 8.5" page - 1" left margin - 1" right margin = 6.5"
const CONTENT_WIDTH_TWIPS = convertInchesToTwip(6.5); // 9360

/**
 * Convert a human-readable percentage (0-100) to absolute twip width (DXA).
 * We use DXA instead of WidthType.PERCENTAGE because docx-js appends a "%"
 * suffix to pct values which Word doesn't parse correctly.
 */
function pct(percent: number): { size: number; type: (typeof WidthType)[keyof typeof WidthType] } {
  return { size: Math.round((percent / 100) * CONTENT_WIDTH_TWIPS), type: WidthType.DXA };
}

/** Create a styled table cell */
function styledCell(
  text: string,
  options?: {
    bold?: boolean;
    shading?: string;
    widthPct?: number;
    columnSpan?: number;
  }
): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text,
            font: FONT,
            size: FONT_SIZE_HALF_PT,
            bold: options?.bold,
          }),
        ],
      }),
    ],
    margins: {
      top: convertInchesToTwip(0.05),
      bottom: convertInchesToTwip(0.05),
      left: convertInchesToTwip(0.1),
      right: convertInchesToTwip(0.1),
    },
    ...(options?.shading && { shading: { fill: options.shading } }),
    ...(options?.widthPct != null && { width: pct(options.widthPct) }),
    ...(options?.columnSpan && { columnSpan: options.columnSpan }),
  });
}

/**
 * Create a simple table with a header row and data rows.
 *
 * @param headers - Column header labels
 * @param rows - Array of rows, each row is an array of cell values
 * @param columnWidths - Optional percentage widths for columns (should sum to 100)
 */
export function simpleTable(
  headers: string[],
  rows: string[][],
  columnWidths?: number[]
): Table {
  const widths = columnWidths ?? headers.map(() => Math.floor(100 / headers.length));

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      styledCell(h, {
        bold: true,
        shading: LIGHT_GRAY,
        widthPct: widths[i],
      })
    ),
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map((cell, i) =>
          styledCell(cell, {
            widthPct: widths[i],
          })
        ),
      })
  );

  return new Table({
    width: pct(100),
    layout: TableLayoutType.FIXED,
    borders: TABLE_BORDERS,
    rows: [headerRow, ...dataRows],
  });
}

/**
 * Create a key-value table (2 columns: label | value).
 * Useful for metadata sections like project info boxes.
 */
export function keyValueTable(
  entries: { key: string; value: string }[],
  labelWidthPercent = 30
): Table {
  return new Table({
    width: pct(100),
    layout: TableLayoutType.FIXED,
    borders: TABLE_BORDERS,
    rows: entries.map(
      ({ key, value }) =>
        new TableRow({
          children: [
            styledCell(key, {
              bold: true,
              shading: LIGHT_GRAY,
              widthPct: labelWidthPercent,
            }),
            styledCell(value, {
              widthPct: 100 - labelWidthPercent,
            }),
          ],
        })
    ),
  });
}

// ── Document builder ────────────────────────────────────────────────

/**
 * Create a complete Document with default page settings.
 * Each generator calls this with its content array.
 */
export function createDocument(children: (Paragraph | Table)[]): Document {
  return new Document({
    sections: [getDefaultSection(children)],
  });
}

// ── Safe data helpers ────────────────────────────────────────────────
// AI-generated artifact data may have missing fields. These helpers
// prevent crashes when a field is null/undefined.

/** Safe string — returns '' for null/undefined, otherwise String(val) */
export function s(val: unknown): string {
  if (val === null || val === undefined) return "";
  return String(val);
}

/** Safe array — returns [] for null/undefined, otherwise the array as-is */
export function a<T>(val: T[] | null | undefined): T[] {
  return Array.isArray(val) ? val : [];
}

// ── Re-exports for convenience ──────────────────────────────────────
// Generators can import everything they need from base-generator

export { Packer } from "docx";
export type { Document } from "docx";
