// import { describe, expect, it } from "vitest";
import Board from "@/components/board";
import GameProvider from "@/context/game-context";
import { render, screen } from "@testing-library/react";

describe("Board", () => {
  it("should render board with 16 cells", () => {
    const { container } = render(<GameProvider><Board /></GameProvider>);

    const cellElements = container.querySelectorAll(".cell");

    expect(cellElements.length).toEqual(16);
  });

  it("should render board with 2 tiles", () => {
    const { container } = render(<GameProvider><Board /></GameProvider>);

    const tiles = container.querySelectorAll(".tile");

    expect(tiles.length).toEqual(2);
  });
});
