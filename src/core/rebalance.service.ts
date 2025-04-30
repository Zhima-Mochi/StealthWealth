/**
 * @fileoverview Portfolio Rebalancing Service
 */

/// <reference path="./price.service.ts" />
/// <reference path="./asset.service.ts" />
/// <reference path="./allocation.service.ts" />

namespace RebalanceService {
  export interface Holding {
    quantity: number;
    currency: string;
    currentPrice?: number;
    currentPriceInTWD?: number;
  }

  export interface HoldingMap {
    [ticker: string]: Holding;
  }

  export interface AllocationMap {
    [ticker: string]: number; // e.g., { AAPL: 0.6, TSLA: 0.4 }
  }

  /**
 * Execute rebalancing and log results
 */
  export function Rebalance(assets: AssetService.Asset[], allocations: AllocationService.Allocation[]): ActionService.Action[] {
    const holdingMap: HoldingMap = {};
    const allocationMap: AllocationMap = {};
    assets.forEach(asset => {
      const price = PriceService.GetPrice(asset.Ticker);
      holdingMap[asset.Ticker] = {
        quantity: asset.Quantity,
        currency: asset.Currency,
        currentPrice: price,
        currentPriceInTWD: PriceService.ConvertPrice(price, asset.Currency, "TWD")
      };
    });
    allocations.forEach(allocation => {
      allocationMap[allocation.Ticker] = allocation.Percentage;
    });
    const actions = calculate(holdingMap, allocationMap, 0.02);
    return actions;
  }


  /**
   * Calculate rebalancing actions
   */
  function calculate(
    holdingMap: HoldingMap,
    allocationMap: AllocationMap,
    minTradePercentage: number = 0.02
  ): ActionService.Action[] {
    const actions: ActionService.Action[] = [];
    const percentageMap: Map<string, number> = new Map();
    let totalPortfolioValueInTWD = 0;
    const currentHoldings: HoldingMap = holdingMap;

    Object.values(currentHoldings).forEach(holding => {
      totalPortfolioValueInTWD += holding.quantity * holding.currentPriceInTWD!;
    });

    Object.keys(allocationMap).forEach(ticker => {
      const targetRatio = allocationMap[ticker];
      const currentPrice = currentHoldings[ticker].currentPrice!;
      const currentValue = currentHoldings[ticker].quantity * currentPrice;
      const currentValueInTWD = currentHoldings[ticker].quantity * currentHoldings[ticker].currentPriceInTWD!;
      const targetValueInTWD = totalPortfolioValueInTWD * targetRatio;
      const priceInTWD = currentHoldings[ticker].currentPriceInTWD!;

      const currentPercentage = currentValueInTWD / totalPortfolioValueInTWD;
      percentageMap.set(ticker, currentPercentage);

      const diffValueInTWD = targetValueInTWD - currentValueInTWD;
      const quantityChange = Math.round(diffValueInTWD / priceInTWD);

      if (quantityChange === 0) {
        return;
      } else if (targetRatio === 0 || quantityChange + currentHoldings[ticker].quantity < 0) {
        if (currentValueInTWD > 0) {
          actions.push({
            Ticker: ticker,
            Action: "Sell",
            Currency: currentHoldings[ticker].currency,
            Quantity: currentHoldings[ticker].quantity,
            CurrentValue: currentValue,
            TargetValue: 0,
            CurrentPrice: currentPrice,
            Difference: diffValueInTWD
          });
        }
      } else if (Math.abs(currentPercentage - targetRatio) >= minTradePercentage) {
        const targetValue = (quantityChange + currentHoldings[ticker].quantity) * currentPrice;
        actions.push({
          Ticker: ticker,
          Action: quantityChange > 0 ? "Buy" : "Sell",
          Currency: currentHoldings[ticker].currency,
          Quantity: Math.abs(quantityChange),
          CurrentValue: currentValue,
          TargetValue: targetValue,
          CurrentPrice: currentPrice,
          Difference: targetValue - currentValue
        });
      }
    });

    AllocationService.SetCurrentPercentage(percentageMap);
    
    return actions;
  }


  /**
   * Output results
   */
  export function Print(actions: ActionService.Action[]): void {
    actions.forEach(act => {
      console.log(`Ticker: ${act.Ticker} | Action: ${act.Action} | Quantity: ${act.Quantity}`);
    });
  }
}
