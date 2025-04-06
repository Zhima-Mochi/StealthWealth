/**
 * @fileoverview Google Sheet operation utilities
 */

/// <reference path="../config/sheet.ts" />
namespace SheetUtil {
  /**
   * Ensures a specific sheet exists; if not, creates it with predefined headers and formats.
   * @param {string} sheetName - Name of the sheet to check/create.
   * @throws {Error} If sheet configuration is not found
   */
  export function EnsureSheetExists(sheetName: string): void {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (!(sheetName in SheetConfig.sheetsConfig)) {
      throw new Error(`Sheet config for "${sheetName}" not found.`);
    }

    const config = SheetConfig.sheetsConfig[sheetName];
    let sheet = ss.getSheetByName(sheetName);

    if (sheet) {
      // Even if sheet exists, ensure all required headers are present
      ensureHeadersExist(sheet, config.headers);
      return;
    }

    // Create the sheet
    try {
      sheet = ss.insertSheet(sheetName);

      // Set up headers
      const headerRange = sheet.getRange(1, 1, 1, config.headers.length);
      headerRange
        .setValues([config.headers])
        .setFontWeight(SheetConfig.sheetStyles.HEADER_FONT_WEIGHT)
        .setBackground(SheetConfig.sheetStyles.HEADER_BACKGROUND);
      sheet.setFrozenRows(1);

      // Apply column formats
      if (config.formats && config.formats.length > 0) {
        config.formats.forEach((format, i) => {
          if (i < config.headers.length && sheet) {
            const colRange = sheet.getRange(2, i + 1, sheet.getMaxRows() - 1);
            applyFormat(colRange, format);
          }
        });
      }

      // Apply any custom initialization if defined
      if (config.init && typeof config.init === 'function') {
        try {
          config.init(sheet);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          Logger.log(`Error in custom initialization for sheet "${sheetName}": ${message}`);
        }
      }

      try {
        SpreadsheetApp.flush();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        Logger.log(`Warning: Failed to flush spreadsheet: ${message}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Logger.log(`ERROR creating sheet "${sheetName}": ${message}`);
      throw error;
    }
  }

  /**
   * Ensures that all required headers exist in the sheet
   * @param {Sheet} sheet - The sheet to check
   * @param {Array} requiredHeaders - Array of header names that should exist
   * @returns {boolean} True if all headers exist or were created
   */
  function ensureHeadersExist(sheet: GoogleAppsScript.Spreadsheet.Sheet, requiredHeaders: string[]): boolean {
    if (!sheet || !requiredHeaders || !requiredHeaders.length) return false;

    const lastCol = sheet.getLastColumn();
    let existingHeaders: string[] = [];
    if (lastCol > 0) {
      existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    }

    let allHeadersExist = true;
    const addedHeaders: string[] = [];

    requiredHeaders.forEach(header => {
      if (!existingHeaders.includes(header) && header) {
        allHeadersExist = false;

        const newColIndex = existingHeaders.length + 1;
        try {
          const headerCell = sheet.getRange(1, newColIndex);
          headerCell.setValue(header)
            .setFontWeight(SheetConfig.sheetStyles.HEADER_FONT_WEIGHT)
            .setBackground(SheetConfig.sheetStyles.HEADER_BACKGROUND);

          existingHeaders.push(header);
          addedHeaders.push(header);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          Logger.log(`Failed to add header "${header}": ${message}`);
        }
      }
    });

    if (addedHeaders.length > 0) {
      Logger.log(`Added missing headers to ${sheet.getName()}: ${addedHeaders.join(', ')}`);
    }

    return allHeadersExist;
  }

  /**
   * Retrieves a sheet by name or creates it using config if not found.
   * @param {string} sheetName - Name of the sheet
   * @returns {Sheet} The sheet object (existing or newly created)
   * @throws {Error} If sheet config is not found
   */
  export function GetOrCreateSheet(sheetName: string): GoogleAppsScript.Spreadsheet.Sheet | null {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (sheet) return sheet;

    EnsureSheetExists(sheetName);
    return ss.getSheetByName(sheetName);
  }

  /**
   * Utility: Apply consistent formatting type to a given range.
   * @param {Range} range - The range to format
   * @param {string} formatType - The type of format to apply
   */
  export function applyFormat(range: GoogleAppsScript.Spreadsheet.Range, formatType: string): void {
    if (!(formatType in SheetConfig.formatTypes)) {
      Logger.log(`Warning: Unknown format type "${formatType}", using TEXT format`);
      formatType = "TEXT";
    }
    range.setNumberFormat(SheetConfig.formatTypes[formatType]);
  }
} 