/**
 * @fileoverview Sheet configurations and constants
 */

namespace SheetConfig {
  // Type definitions
  type FontWeight = "normal" | "bold" | null;

  export interface SheetConfig {
    headers: string[];
    formats: string[];
    init?: (sheet: GoogleAppsScript.Spreadsheet.Sheet) => void;
  }

  export interface SheetStyles {
    HEADER_FONT_WEIGHT: FontWeight;
    HEADER_BACKGROUND: string;
    NEW_HEADER_BACKGROUND: string;
  }

  export interface FormatTypes {
    [key: string]: string;
  }

  // Constants
  export const sheetsConfig: { [key: string]: SheetConfig } = {
    "Assets": {
      headers: ["Asset", "Ticker", "Quantity", "Currency", "Notes"],
      formats: ["TEXT", "TEXT", "QUANTITY", "TEXT", "TEXT"]
    },
    "Allocation": {
      headers: ["Ticker", "Percentage", "Current Percentage"],
      formats: ["TEXT", "PERCENTAGE", "PERCENTAGE"]
    },
    "Actions": {
      headers: ["Ticker", "Currency", "Current Price", "Action", "Quantity", "Current Value", "Target Value", "Difference"],
      formats: ["TEXT", "TEXT", "CURRENCY", "TEXT", "QUANTITY", "CURRENCY", "CURRENCY", "CURRENCY"]
    }
  };

  export const formatTypes: FormatTypes = {
    QUANTITY: "#,##0.00000",
    TEXT: "@",
    PERCENTAGE: "0.0000%",
    CURRENCY: "$#,##0.0000"
  };

  export const sheetStyles: SheetStyles = {
    HEADER_FONT_WEIGHT: "bold",
    HEADER_BACKGROUND: "#d9ead3",
    NEW_HEADER_BACKGROUND: "#fff2cc"
  };
} 