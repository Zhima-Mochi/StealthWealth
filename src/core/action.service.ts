/// <reference path="../repo/sheet.ts" />

namespace ActionService {

    export interface Action {
        Ticker: string;
        Action: "Buy" | "Sell";
        Currency: string;
        Quantity: number;
        CurrentValue: number;
        TargetValue: number;
        CurrentPrice: number;
        Difference: number;
    }

    export function RenewActions(actions: Action[]): boolean {
        deleteActions();
        // sort by action
        actions.sort((a, b) => {
            if (a.Action === "Buy" && b.Action === "Sell") return -1;
            if (a.Action === "Sell" && b.Action === "Buy") return 1;
            return 0;
        });
        actions.forEach(action => {
            addAction(action);
        });
        return true;
    }


    export function GetActions(): Action[] {
        return Repo.GetActions();
    }

    function addAction(action: Action): boolean {
        return Repo.AddAction(action);
    }


    function deleteActions(): boolean {
        return Repo.DeleteActions();
    }
}

