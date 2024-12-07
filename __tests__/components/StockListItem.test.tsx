import { render } from "@testing-library/react-native";
import StockListItem from "../../app/components/StockListItem";
import useThemeColor from "../../app/hooks/useThemeColor";

jest.mock("../../app/hooks/useThemeColor", () => ({
  __esModule: true,
  default: () => "#000000",
}));

const mockStock = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: 150.23,
  dailyChange: 2.5,
};

describe("StockListItem", () => {
  it("renders stock information correctly", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <StockListItem stock={mockStock} onPress={mockOnPress} index={0} />
    );

    expect(getByText("AAPL")).toBeTruthy();
    expect(getByText("Apple Inc.")).toBeTruthy();
    expect(getByText("$150.23")).toBeTruthy();
    expect(getByText("+2.50%")).toBeTruthy();
  });
});
