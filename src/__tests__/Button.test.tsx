import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "../components/Button";

describe("Button Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );

    fireEvent.press(getByText("Test Button"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} disabled={true} />
    );

    const button = getByText("Test Button");
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("renders with different variants", () => {
    const { rerender, getByText } = render(
      <Button title="Primary" onPress={() => {}} variant="primary" />
    );
    expect(getByText("Primary")).toBeTruthy();

    rerender(
      <Button title="Secondary" onPress={() => {}} variant="secondary" />
    );
    expect(getByText("Secondary")).toBeTruthy();

    rerender(<Button title="Outline" onPress={() => {}} variant="outline" />);
    expect(getByText("Outline")).toBeTruthy();
  });
});
