import { render } from "@testing-library/react";
import Board from "@/components/board";

describe("Board", () => {
  it("should render a 4x4 grid", () => {
    const { container } = render(<Board />);
    const cells = container.querySelectorAll(".cell");

    expect(cells.length).toBe(16); // 4x4 grid has 16 cells
  });

   it("should render a board with 2 tiles", () => {
    const { container } = render(<Board />);
    const cells = container.querySelectorAll(".tile");

    expect(cells.length).toBe(2); // initially 2 tiles are created in useEffect
   });
});
