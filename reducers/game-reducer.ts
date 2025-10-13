import { Tile } from "@/models/tile";
import { uid } from "uid";

type State = { board: string[][]; tiles: { [id: string]: Tile } };
type Action = { type: "create_tile"; tile: Tile };

// 4x4 board
// 0 = empty tile
// 2,4,8,16,32,64,128,256,512,1024,2048 = filled tiles

function createBoard(tileCountPerDimension: number = 4) {
  // Create a 4x4 board
  const board: string[][] = [];

  // Initialize the board with empty tiles
  for (let i = 0; i < tileCountPerDimension; i++) {
    board[i] = new Array(tileCountPerDimension).fill(undefined);
  }
  return board;
}

export const initialState: State = { board: createBoard(), tiles: {} };

export default function gameReducer(state: State, action: Action) {
  switch (action.type) {
    case "create_tile": {
      const tileId = uid()// TODO generate unique id
      const [x, y] = action.tile.position; //{ x: number; y: number };
      const newBoard = JSON.parse(JSON.stringify(state.board)); // deep copy
      newBoard[y][x] = tileId; // place tile id on the board

      return {
        ...state,
        board: newBoard, // update board with new tile
        tiles: {
          ...state.tiles,
          [tileId]: action.tile, // add new tile to tiles dictionary
        },
      };
    }
    default:
      return state;
  }
}
