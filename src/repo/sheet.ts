/**
 * @fileoverview Asset DATA type definition
 */

/// <reference path="../core/asset.service.ts" />
/// <reference path="../core/allocation.service.ts" />
/// <reference path="../core/action.service.ts" />
/// <reference path="../util/sheet.ts" />
/// <reference path="../config/sheet.ts" />

namespace Repo {
  export function AddAsset(asset: Partial<AssetService.Asset>): boolean 
  {
    try {
      const sheet = SheetUtil.GetOrCreateSheet('Assets');
      if (!sheet) return false;

      const headers = SheetConfig.sheetsConfig['Assets'].headers;
      const row = dataToRow(asset, headers);
      sheet.appendRow(row);
      return true;
    } catch (error) {
      console.error('Failed to add asset:', error);
      return false;
    }
  }

  export function GetAssets(): AssetService.Asset[] {
    const sheet = SheetUtil.GetOrCreateSheet('Assets');
    if (!sheet) return [];

    const headers = SheetConfig.sheetsConfig['Assets'].headers;
    const rows = sheet.getDataRange().getValues().slice(1);
    return rows.map(row => rowToData(row, headers)) as AssetService.Asset[];
  }

  export function DeleteAssets(): boolean {
    const sheet = SheetUtil.GetOrCreateSheet('Assets');
    if (!sheet) return false;

    const dataRow = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
    dataRow.clearContent();
    return true;
  }

  export function AddAllocation(allocation: AllocationService.Allocation): boolean {
    const sheet = SheetUtil.GetOrCreateSheet('Allocation');
    if (!sheet) return false;

    const headers = SheetConfig.sheetsConfig['Allocation'].headers;
    const row = dataToRow(allocation, headers);
    sheet.appendRow(row);
    return true;
  }

  export function DeleteAllocations(): boolean {
    const sheet = SheetUtil.GetOrCreateSheet('Allocation');
    if (!sheet) return false;

    const dataRow = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
    dataRow.clearContent();
    return true;
  }

  export function GetAllocations(): AllocationService.Allocation[] {
    const sheet = SheetUtil.GetOrCreateSheet('Allocation');
    if (!sheet) return [];

    const headers = SheetConfig.sheetsConfig['Allocation'].headers;
    const rows = sheet.getDataRange().getValues().slice(1);
    return rows.map(row => rowToData(row, headers)) as AllocationService.Allocation[];
  }
  
  export function UpdateAllocations(allocations: AllocationService.Allocation[]): void {
    const sheet = SheetUtil.GetOrCreateSheet('Allocation');
    if (!sheet) return;

    const headers = SheetConfig.sheetsConfig['Allocation'].headers;
    const rows = sheet.getDataRange().getValues().slice(1);
    rows.forEach((row, index) => {
      const allocation = allocations.find(a => a.Ticker === row[0]);
      if (allocation) {
        rows[index] = dataToRow(allocation, headers);
      }
    });
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  export function AddAction(action: Partial<ActionService.Action>): boolean {
    try {
      const sheet = SheetUtil.GetOrCreateSheet('Actions');
      if (!sheet) return false;

      const headers = SheetConfig.sheetsConfig['Actions'].headers;
      const row = dataToRow(action, headers);
      sheet.appendRow(row);
      return true;
    } catch (error) {
      console.error('Failed to add action:', error);
      return false;
    }
  }
  
  export function GetActions(): ActionService.Action[] {
    const sheet = SheetUtil.GetOrCreateSheet('Actions');
    if (!sheet) return [];

    const headers = SheetConfig.sheetsConfig['Actions'].headers;
    const rows = sheet.getDataRange().getValues().slice(1);
    return rows.map(row => rowToData(row, headers)) as ActionService.Action[];
  }

  export function DeleteActions(): boolean {
    const sheet = SheetUtil.GetOrCreateSheet('Actions');
    if (!sheet) return false;

    const dataRow = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
    dataRow.clearContent();
    return true;
  }
  
  function dataToRow(data: Record<string, any>, headers: string[]): any[] {
    return headers.map(header => data[normalizeHeader(header)] ?? "");
  }


  function rowToData(row: any[], headers: string[]): Record<string, any> {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      obj[normalizeHeader(header)] = row[index];
    });
    return obj;
  }

  function normalizeHeader(header: string): string {
    // Target Value -> TargetValue
    return header.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  }
}
