/**
 * @fileoverview Asset operations
 */

/// <reference path="../repo/sheet.ts" />
/// <reference path="../util/sheet.ts" />
/// <reference path="../config/sheet.ts" />
/// <reference path="../repo/sheet.ts" />

namespace AssetService {
  export interface Asset {
    Asset: string;
    Ticker: string;
    Quantity: number;
    Currency: string;
    Notes: string;
  }
  /**
   * Gets all assets from the Assets sheet
    */
  export function GetAssets(): Asset[] {
    return Repo.GetAssets();
  }

  export function AddCurrencyAsset(currency: string): void {
    const assets = GetAssets();
    if (assets.some(a => a.Ticker === currency)) {
      return;
    }
    Repo.AddAsset({
      Asset: "CASH",
      Ticker: currency,
      Currency: currency,
      Quantity: 0,
      Notes: ""
    });
  }

  export function DeleteAssets(): void {
    Repo.DeleteAssets();
  }
}
