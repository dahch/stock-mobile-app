import { StyleSheet, View, Dimensions } from "react-native";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import { Stock } from "../types/stock";
import useThemeColor from "../hooks/useThemeColor";
import Animated, {
  SlideInUp,
  SlideOutDown,
  withSpring,
  useAnimatedStyle,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";

interface Props {
  stock: Stock;
  onClose: () => void;
}

export default function StockDetailView({ stock, onClose }: Props) {
  const isPositiveChange = stock.dailyChange >= 0;
  const backgroundColor = useThemeColor({}, "background");
  const slideAnim = useSharedValue(0);

  useEffect(() => {
    slideAnim.value = withSpring(1);
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(slideAnim.value, [0, 1], [300, 0]),
        },
      ],
      opacity: slideAnim.value,
    };
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor }, animatedStyles]}
      entering={SlideInUp}
      exiting={SlideOutDown}
    >
      <View style={styles.header}>
        <ThemedText type="title">{stock.symbol}</ThemedText>
        <ThemedText style={styles.closeButton} onPress={onClose}>
          ✕
        </ThemedText>
      </View>

      <ThemedText style={styles.name}>{stock.name}</ThemedText>

      <ThemedView style={styles.priceContainer}>
        <ThemedText
          style={styles.price}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          allowFontScaling={true}
        >
          $
          {stock.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
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
      </ThemedView>
    </Animated.View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: "100%",
    backgroundColor: "white",
    marginTop: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  closeButton: {
    fontSize: 24,
    padding: 10,
  },
  name: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 10,
  },
  priceContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 20,
  },
  price: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    includeFontPadding: false,
    padding: 20,
    marginVertical: 10,
  },
  changeContainer: {
    padding: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  change: {
    fontSize: 16,
    fontWeight: "600",
  },
});
