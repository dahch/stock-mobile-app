import { View, Text, StyleSheet } from "react-native";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import { Stock } from "../types/stock";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";
import { Pressable } from "react-native";

interface Props {
  stock: Stock;
  onPress: () => void;
}

export default function StockListItem({
  stock,
  onPress,
  index,
}: Props & { index: number }) {
  const isPositiveChange = stock.dailyChange >= 0;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      exiting={FadeOutUp}
      layout={Layout.springify()}
    >
      <Pressable onPress={onPress}>
        <ThemedView style={styles.container}>
          <View style={styles.leftContent}>
            <ThemedText style={styles.symbol}>{stock.symbol}</ThemedText>
            <ThemedText style={styles.name}>{stock.name}</ThemedText>
          </View>
          <View style={styles.priceContainer}>
            <ThemedText style={styles.price}>
              ${stock.price.toFixed(2)}
            </ThemedText>
            <ThemedView
              style={[
                styles.changeContainer,
                {
                  backgroundColor: isPositiveChange
                    ? "rgba(76,175,80,0.1)"
                    : "rgba(244,67,54,0.1)",
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.change,
                  { color: isPositiveChange ? "#4CAF50" : "#F44336" },
                ]}
              >
                {isPositiveChange ? "+" : ""}
                {stock.dailyChange.toFixed(2)}%
              </ThemedText>
            </ThemedView>
          </View>
        </ThemedView>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    margin: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    opacity: 0.7,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  changeContainer: {
    padding: 6,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  change: {
    fontSize: 14,
    fontWeight: "600",
  },
});
