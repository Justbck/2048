import { tileCountPerDimension } from "@/constants/constants";
import { Tile } from "@/models/tile";
import gameReducer, { initialState } from "@/reducers/game-reducer";
import {  isNil } from "lodash";
import { createContext, PropsWithChildren, useReducer } from "react";

export const gameContext = createContext({
  appendRandomTile: () => {},
  getTiles: () => [] as Tile[],
  dispatch: (_: any) => {},
});

export default function GameProvider({ children }: PropsWithChildren) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const getEmptyCells = () => {
    const results: [number, number][] = [];

    for (let x = 0; x < tileCountPerDimension; x++) {
      for (let y = 0; y < tileCountPerDimension; y++) {
        if (isNil(gameState.board[y][x])) {
          results.push([x, y]);
        }
      }
    }
    return results;
  };

  const appendRandomTile = () => {
    const emptyCells = getEmptyCells();
    if (emptyCells.length > 0) {
      const cellIndex = Math.floor(Math.random() * emptyCells.length);
      const newTile = {
        position: emptyCells[cellIndex],
        value: 2,
      };
      dispatch({ type: "create_tile", tile: newTile });
    }
  };

  const getTiles = () => {
    return gameState.tilesByIds.map((tileId:string) => gameState.tiles[tileId]);
  }

  return (
    <gameContext.Provider value={{ appendRandomTile, getTiles, dispatch }}>
      {children}
    </gameContext.Provider>
  );
}
