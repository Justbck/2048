import { tileCountPerDimension } from "@/constants/constants";
import { Tile, TileMap } from "@/models/tile";
import { flattenDeep, isNil } from "lodash";
import { uid } from "uid";

type State = { board: string[][]; tiles: TileMap; tilesByIds: string[] };
type Action =
  | { type: "create_tile"; tile: Tile }
  | { type: "move_up" }
  | { type: "move_down" }
  | { type: "move_left" }
  | { type: "move_right" }
  | { type: "clean_up"};

// 4x4 board
// 0 = empty tile
// 2,4,8,16,32,64,128,256,512,1024,2048 = filled tiles

function createBoard() {
  // Create a 4x4 board
  const board: string[][] = [];

  // Initialize the board with empty tiles
  for (let i = 0; i < tileCountPerDimension; i++) {
    board[i] = new Array(tileCountPerDimension).fill(undefined);
  }
  return board;
}

export const initialState: State = { board: createBoard(), tiles: {}, tilesByIds: [] };

export default function gameReducer(state: State = initialState, action: Action) {
  switch (action.type) {

    case "clean_up": {
      // Keep only tiles that are present on the board (non-nil) and exist in the tiles map.
      const flattenBoard = flattenDeep(state.board) as Array<string | undefined>;
      const newTiles: TileMap = flattenBoard.reduce((acc, tileId) => {
        if (isNil(tileId)) return acc; // skip empty cells
        const tile = state.tiles[tileId];
        if (!tile) return acc; // skip if tiles map doesn't have this id
        return {
          ...acc,
          [tileId]: tile,
        };
      }, {} as TileMap);

      return {
        ...state,
        tiles: newTiles,
        tilesByIds: Object.keys(newTiles),
      };
    }

    case "create_tile": {
      const tileId = uid(); // TODO generate unique id
      const [x, y] = action.tile.position; //{ x: number; y: number };
      const newBoard = JSON.parse(JSON.stringify(state.board)); // deep copy
      newBoard[y][x] = tileId; // place tile id on the board

      return {
        ...state,
        board: newBoard, // update board with new tile
        tiles: {
          ...state.tiles,
          [tileId]: { id: tileId, ...action.tile }, // add new tile to tiles dictionary
        },
        tilesByIds: [...state.tilesByIds, tileId],
      };
    }

    case "move_up": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = 0;
        let previousTile: Tile | undefined;

        for (let y = 0; y < tileCountPerDimension; y++) {
          const tileId = state.board[y][x]; // get tile id at current position
          const currentTile = state.tiles[tileId]; // get tile object from tiles dictionary

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY - 1],
              };
              previousTile = undefined;
              continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            newY++;
          }
        }
      }
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    case "move_down": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = tileCountPerDimension - 1;
        let previousTile: Tile | undefined;

        for (let y = tileCountPerDimension - 1; y >= 0; y--) {
          const tileId = state.board[y][x]; // get tile id at current position
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY + 1],
              };
              previousTile = undefined;
              continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            newY--;
          }
        }
      }
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    case "move_left": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = 0;
        let previousTile: Tile | undefined;

        for (let x = 0; x < tileCountPerDimension; x++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [newX - 1, y],
              };
              previousTile = undefined;
              continue;
            }

            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            newX++;
          }
        }
      }
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    case "move_right": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = tileCountPerDimension - 1;
        let previousTile: Tile | undefined;

        for (let x = tileCountPerDimension - 1; x >= 0; x--) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];
          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [newX + 1, y],
              };
              previousTile = undefined;
              continue;
            }
            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            newX--;
          }
        }
      }
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    default:
      return state;
  }
}
