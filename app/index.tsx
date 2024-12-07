import { useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  TextInput,
  Modal,
  RefreshControl,
  Text,
} from "react-native";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import ThemedView from "@/app/components/ThemedView";
import StockListItem from "@/app/components/StockListItem";
import StockDetailView from "@/app/components/StockDetailView";
import ThemedText from "@/app/components/ThemedText";
import { Stock } from "./types/stock";
import stockData from "../dummy_stock_data.json";
import { stockStorage } from "./services/stockStorage";

type SortOrder = "name" | "price" | "change";

const AnimatedText = Animated.createAnimatedComponent(Text);

const adaptStockData = (data: any): Stock[] => {
  return data.stocks.map((stock: any) => ({
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price,
    dailyChange: stock.daily_change,
  }));
};

const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText);

export default function StockListScreen() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("name");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadStocks = async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const { stocks: cachedStocks, lastUpdate } =
          await stockStorage.getStocks();
        if (cachedStocks.length > 0) {
          setStocks(cachedStocks);
          setLastUpdate(lastUpdate);
          return;
        }
      }

      const adaptedData = adaptStockData(stockData);
      setStocks(adaptedData);
      await stockStorage.saveStocks(adaptedData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error loading stocks:", error);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStocks(true);
    setRefreshing(false);
  };

  const filteredAndSortedStocks = stocks
    .filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return b.price - a.price;
        case "change":
          return b.dailyChange - a.dailyChange;
        default:
          return 0;
      }
    });

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Stocks</ThemedText>
        {lastUpdate && (
          <AnimatedText style={styles.lastUpdate} entering={FadeIn.delay(300)}>
            Last update: {lastUpdate.toLocaleTimeString()}
          </AnimatedText>
        )}
      </ThemedView>

      <ThemedView style={styles.filterContainer}>
        <Animated.View entering={FadeIn.delay(100)} layout={Layout.springify()}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for stock..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="gray"
          />
        </Animated.View>

        <ThemedView style={styles.sortButtons}>
          {["name", "price", "change"].map((sort, index) => (
            <Animated.View
              key={sort}
              entering={FadeIn.delay(200 + index * 100)}
              layout={Layout.springify()}
            >
              <AnimatedThemedText
                style={[
                  styles.sortButton,
                  sortOrder === sort && styles.activeSort,
                ]}
                onPress={() => setSortOrder(sort as SortOrder)}
              >
                {sort === "name"
                  ? "Name"
                  : sort === "price"
                  ? "Price"
                  : "Change"}
              </AnimatedThemedText>
            </Animated.View>
          ))}
        </ThemedView>
      </ThemedView>

      <Animated.FlatList
        layout={Layout.springify()}
        data={filteredAndSortedStocks}
        renderItem={({ item, index }) => (
          <StockListItem
            stock={item}
            onPress={() => setSelectedStock(item)}
            index={index}
          />
        )}
        keyExtractor={(item) => item.symbol}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Modal
        visible={selectedStock !== null}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setSelectedStock(null)}
      >
        {selectedStock && (
          <StockDetailView
            stock={selectedStock}
            onClose={() => setSelectedStock(null)}
          />
        )}
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  filterContainer: {
    padding: 16,
    gap: 12,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  sortButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sortButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeSort: {
    backgroundColor: "rgba(0,0,0,0.1)",
    fontWeight: "bold",
  },
  listContent: {
    padding: 8,
  },
  lastUpdate: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
});
