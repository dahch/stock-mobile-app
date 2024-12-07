import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stock } from "../types/stock";

const STOCKS_STORAGE_KEY = "@stocks_data";
const LAST_UPDATE_KEY = "@last_update";

export const stockStorage = {
  async saveStocks(stocks: Stock[]): Promise<void> {
    try {
      const jsonStocks = JSON.stringify(stocks);
      await AsyncStorage.multiSet([
        [STOCKS_STORAGE_KEY, jsonStocks],
        [LAST_UPDATE_KEY, new Date().toISOString()],
      ]);
    } catch (error) {
      console.error("Error saving stocks:", error);
    }
  },

  async getStocks(): Promise<{ stocks: Stock[]; lastUpdate: Date | null }> {
    try {
      const [stocksResult, lastUpdateResult] = await AsyncStorage.multiGet([
        STOCKS_STORAGE_KEY,
        LAST_UPDATE_KEY,
      ]);

      const stocks = stocksResult[1] ? JSON.parse(stocksResult[1]) : [];
      const lastUpdate = lastUpdateResult[1]
        ? new Date(lastUpdateResult[1])
        : null;

      return { stocks, lastUpdate };
    } catch (error) {
      console.error("Error getting stocks:", error);
      return { stocks: [], lastUpdate: null };
    }
  },
};
