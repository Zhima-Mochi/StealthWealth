# 📈 StealthWealth Rebalancer – Google Sheets Add-on

![Stealth Wealth Logo](./assets/logo.png)

The **StealthWealth Rebalancer** is a powerful, scriptable, and modular **portfolio rebalancing tool** built with **Google Apps Script** (written in TypeScript). This tool seamlessly integrates with **Google Sheets** to help you manage your assets, automatically calculate rebalance actions based on your target allocations, and send **email notifications** for important updates.

Designed for investors seeking **visibility, automation, and control**, the StealthWealth Rebalancer empowers you to make informed decisions directly within Google Sheets.

---

## 🚀 Features

| Function Name                          | Description                                                                 |
|----------------------------------------|-----------------------------------------------------------------------------|
| `Rebalance()`                          | Calculates and logs rebalancing actions based on current assets versus target allocations. |
| `Initialize()`                         | Sets up all necessary sheets and adds default currencies (TWD, USD) for immediate use. |
| `Notify()`                             | Sends an email notification summarizing all pending actions, keeping you informed. |
| `DangerouslyDeleteAllData()`           | Permanently deletes all data: assets, allocations, and actions (⚠️ irreversible). |
| `DangerouslyAddAssets()`               | Quickly adds sample assets for testing purposes, allowing for rapid experimentation. |
| `onOpen()`                             | Adds a custom menu to the Google Sheets UI for easy access to the add-on features. |

---

## 📥 Installation and Usage

1. **Install the Add-on**:
2. **Open Google Sheets**: Create or open a spreadsheet where you want to use the tool.
3. **Access the Add-on**: Click on the custom menu added by the add-on to start using its features.
