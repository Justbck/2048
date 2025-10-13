import { render } from '@testing-library/react';
import Board from "@/components/board";

describe('Board', () => {
  it('should render a 4x4 grid', () => {
    const { container } = render(<Board/>);
    const cells = container.querySelectorAll('.cell');

    expect(cells.length).toBe(16); // 4x4 grid has 16 cells
  });
});
