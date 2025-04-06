/**
 * @fileoverview Real-time price service using Yahoo Finance
 */

namespace PriceService {

    export const Currencies = new Set<string>(["TWD", "USD", "HKD", "CNY", "JPY", "EUR", "GBP", "AUD", "CAD", "CHF", "NZD", "RUB", "INR", "MXN", "ZAR", "BRL", "ARS", "CLP", "COP", "PEN", "UYU", "PYG", "UFX", "VND", "PHP", "IDR", "THB", "MYR", "KRW", "SGD", "NOK", "SEK", "DKK", "ISK", "RSD", "RON", "BGN", "TRY", "BAM", "AZN", "MDL", "GEL", "AMD", "KZT", "KGS", "TJS", "TMT", "UZS", "BYN", "KRW", "XDR", "XAG", "XAU"]);

    declare const UrlFetchApp: {
        fetch(url: string, params?: any): {
            getResponseCode(): number;
            getContentText(): string;
        };
    };

    export function GetPrice(ticker: string): number {
        if (Currencies.has(ticker)) return 1;

        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d`;
        const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
        const code = response.getResponseCode();

        if (code !== 200) throw new Error(`Yahoo API error: HTTP ${code} for ${ticker}`);

        const json = JSON.parse(response.getContentText());
        const chart = json.chart?.result?.[0];

        if (!chart?.indicators?.quote?.[0]?.close?.[0]) {
            throw new Error(`No price data for ${ticker}`);
        }

        return chart.indicators.quote[0].close[0];
    }

    export function ConvertPrice(price: number, fromCurrency: string, toCurrency: string): number {
        if (fromCurrency === toCurrency) return price;
      
        const pair = `${fromCurrency}${toCurrency}=X`; // e.g. USDJPY=X
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${pair}?interval=1d`;
      
        const response = UrlFetchApp.fetch(url);
        const code = response.getResponseCode();
        if (code !== 200) throw new Error(`Yahoo API error: HTTP ${code} for ${pair}`);

        const json = JSON.parse(response.getContentText());
        const chart = json.chart?.result?.[0];
      
        if (!chart?.indicators?.quote?.[0]?.close?.[0]) {
            throw new Error(`No price data for ${pair}`);
        }
      
        const rate = chart.indicators.quote[0].close[0];
        return price * rate;
    }
}
