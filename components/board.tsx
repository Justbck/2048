import { JSX, useCallback, useContext, useEffect, useRef } from "react";
import styles from "@/styles/board.module.css";
import Tile from "./tile";
import { Tile as TileModel } from "@/models/tile";
import { gameContext } from "@/context/game-contex";

export default function Board() {
  const { getTiles, dispatch } = useContext(gameContext);
  const initialized = useRef(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();

    switch (e.code) {
      case "ArrowUp":
        dispatch({ type: "move_up" });
        break;
      case "ArrowDown":
        dispatch({ type: "move_down" });
        break;

      case "ArrowLeft":
        dispatch({ type: "move_left" });
        break;

      case "ArrowRight":
        dispatch({ type: "move_right" });
        break;
    }
  },
  [dispatch]
);

  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCells = 4 * 4; // 4x4 grid

    for (let i = 0; i < totalCells; i++) {
      cells.push(<div className={styles.cell} key={i} />);
    }
    return cells;
  };

  const renderTiles = () => {
    return getTiles().map(
      (tile: TileModel) => {
        return <Tile key={`${tile.id}`} {...tile} />;
      },
    );
  };

  useEffect(() => {
    if (initialized.current === false) {
      // run only once
      dispatch({ type: "create_tile", tile: { position: [0, 1], value: 2 } });
      dispatch({ type: "create_tile", tile: { position: [0, 2], value: 2 } });
      initialized.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={styles.board}>
      <div className={styles.tiles}>{renderTiles()}</div>
      <div className={styles.grid}>{renderGrid()}</div>
    </div>
  );
}
