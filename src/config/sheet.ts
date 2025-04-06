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
      headers: ["Ticker", "Percentage"],
      formats: ["TEXT", "PERCENTAGE"]
    },
    "Actions": {
      headers: ["Ticker", "Action", "Currency", "Quantity", "Current Value", "Target Value", "Current Price"],
      formats: ["TEXT", "TEXT", "TEXT", "QUANTITY", "CURRENCY", "CURRENCY", "CURRENCY"]
    }
  };

  export const formatTypes: FormatTypes = {
    QUANTITY: "#,##0.00",
    TEXT: "@",
    PERCENTAGE: "0.00%",
    CURRENCY: "$#,##0.00"
  };

  export const sheetStyles: SheetStyles = {
    HEADER_FONT_WEIGHT: "bold",
    HEADER_BACKGROUND: "#d9ead3",
    NEW_HEADER_BACKGROUND: "#fff2cc"
  };
} 