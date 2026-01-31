/// <reference path="../repo/sheet.ts" />

namespace AllocationService {

    export interface Allocation {
        Ticker: string;
        TargetPercentage: number;
        CurrentPercentage: number;
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
                    TargetPercentage: 0,
                    CurrentPercentage: 0
                });
            }
        });
    }

    export function NormalizeAllocations(): void {
        const allocations = GetAllocations();
        const totalPercentage = allocations.reduce((sum, current) => sum + current.TargetPercentage, 0);
        if (totalPercentage === 0) {return;}
        allocations.forEach(allocation => {
            allocation.TargetPercentage = allocation.TargetPercentage / totalPercentage;
        });
        Repo.UpdateAllocations(allocations);
    }

    export function SetCurrentPercentage(percentageMap: Map<string, number>): void {
        const allocations = GetAllocations();
        allocations.forEach(allocation => {
            allocation.CurrentPercentage = percentageMap.get(allocation.Ticker) ?? 0;
        });
        Repo.UpdateAllocations(allocations);
    }

    function addAllocation(allocation: Allocation): boolean {
        return Repo.AddAllocation(allocation);
    }

}