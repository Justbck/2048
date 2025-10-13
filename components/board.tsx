import { JSX } from "react";
import styles from "@/styles/board.module.css";

export default function Board() {
  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCells = 4 * 4; // 4x4 grid

    for (let i = 0; i < totalCells; i++) {
      cells.push(<div className={styles.cell} key={i} />);
    }
    return cells;
  };

  return (
    <div className={styles.board}>
      <div className={styles.grid}>{renderGrid()}</div>
    </div>
  );
}
