/// <reference path="./core/notify.service.ts" />
/// <reference path="./core/rebalance.service.ts" />
/// <reference path="./config/sheet.ts" />
/// <reference path="./util/sheet.ts" />
/// <reference path="./repo/sheet.ts" />
/// <reference path="./core/asset.service.ts" />
/// <reference path="./core/allocation.service.ts" />
/// <reference path="./core/action.service.ts" />
/// <reference path="./core/notify.service.ts" />
function Rebalance(): ActionService.Action[] {
    const assets = AssetService.GetAssets();
    AllocationService.SetAssetInAllocation(assets);
    AllocationService.NormalizeAllocations();
    const allocations = AllocationService.GetAllocations();
    const actions = RebalanceService.Rebalance(assets, allocations);
    RebalanceService.Print(actions);
    ActionService.RenewActions(actions);

    return actions;
}

function Initialize() {
    Object.keys(SheetConfig.sheetsConfig).forEach(sheetName => {
        SheetUtil.EnsureSheetExists(sheetName);
    });
    AssetService.AddCurrencyAsset("TWD");
    AssetService.AddCurrencyAsset("USD");
}

function Notify() {
    const actions = ActionService.GetActions();
    if (actions.length > 0) {
        NotifyService.SendEmail(actions);
    }
}

function DangerouslyDeleteAllData() {
    Repo.DeleteAssets();
    Repo.DeleteAllocations();
    Repo.DeleteActions();
}

function DangerouslyAddAssets() {
    const sampleAssets: AssetService.Asset[] = [
        {
            Asset: "Apple",
            Ticker: "AAPL",
            Quantity: 10,
            Currency: "USD",
            Notes: "Sample Notes"
        },
        {
            Asset: "Microsoft",
            Ticker: "MSFT",
            Quantity: 5,

            Currency: "USD",
            Notes: "Sample Notes"
        },
        {
            Asset: "Tesla",
            Ticker: "TSLA",
            Quantity: 3,
            Currency: "USD",
            Notes: "Sample Notes"
        },
        {
            Asset: "NVIDIA",
            Ticker: "NVDA",
            Quantity: 2,
            Currency: "USD",
            Notes: "Sample Notes"
        }
    ];

    sampleAssets.forEach(asset => {
        Repo.AddAsset(asset);
    });
}


function onOpen() {
    SpreadsheetApp.getUi()
        .createMenu('📈 StealthWealth Rebalancer')
        .addItem('🔁 Rebalance Portfolio', 'Rebalance')
        .addItem('🧰 Initialize Sheets', 'Initialize')
        .addToUi();
}

function onHomepage() {
    const html = HtmlService.createHtmlOutputFromFile('sidebar.html')
        .setTitle('StealthWealth Rebalancer');

    SpreadsheetApp.getUi().showSidebar(html);
}
