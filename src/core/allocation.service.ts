/// <reference path="../repo/sheet.ts" />

namespace AllocationService {

    export interface Allocation {
        Ticker: string;
        Percentage: number;
    }

    export function GetAllocations(): Allocation[] {
        return Repo.GetAllocations();
    }

    export function SetAssetInAllocation(assets: AssetService.Asset[]): void {
        const allocations = GetAllocations();

        assets.forEach(asset => {
            if (!allocations.some(allocation => allocation.Ticker === asset.Ticker)) {
                addAllocation({
                    Ticker: asset.Ticker,
                    Percentage: 0
                });
            }
        });
    }

    export function NormalizeAllocations(): void {
        const allocations = GetAllocations();
        const totalPercentage = allocations.reduce((sum, current) => sum + current.Percentage, 0);
        if (totalPercentage === 0) {return;}
        allocations.forEach(allocation => {
            allocation.Percentage = allocation.Percentage / totalPercentage;
        });
        Repo.UpdateAllocations(allocations);
    }

    function addAllocation(allocation: Allocation): boolean {
        return Repo.AddAllocation(allocation);
    }

}