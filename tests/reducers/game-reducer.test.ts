import { Tile } from "@/models/tile";
import gameReducer, { initialState } from "@/reducers/game-reducer";
import { renderHook } from "@testing-library/react";
import { isNil } from "lodash";
import { act, useReducer } from "react";

describe("gameReducer", () => {
  describe("create_tile", () => {
    it("should add a new tile to the board", () => {
      const tile: Tile = {
        position: [0, 0],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile });
      });

      const [state] = result.current; // get updated state after act
      expect(state.board[0][0]).toBeDefined(); // check if tile id is placed on the board
      // tiles is an object mapping ids to Tile. Ensure one of the values equals the tile payload
      expect(Object.values(state.tiles)).toContainEqual({ id: state.board[0][0], ...tile});
    });
  });

  describe("move_up", () => {
    it("should move tiles up to the top of the board", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [1, 3], // changed from [1,2] to [1,3] to avoid merging
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 }); // create first tile
        dispatch({ type: "create_tile", tile: tile2 }); // create second tile
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(isNil(stateBefore.board[0][1])).toBeTruthy(); // ensure position [0,1] is empty before move
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_up" })); // perform move up action

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[0][0]).toBe("string");
      expect(typeof stateAfter.board[0][1]).toBe("string");
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });

    it("should stack tiles with the same value on top of each other", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [0, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(typeof stateBefore.board[3][0]).toBe("string");

      act(() => dispatch({ type: "move_up" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[0][0]).toBe("string");
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(isNil(stateAfter.board[3][0])).toBeTruthy();
    });

     it("should merge tiles with the same value", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [0, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[1][0]].value).toBe(2);
      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[3][0]].value).toBe(2);

      act(() => dispatch({ type: "move_up" }));

      const [stateAfter] = result.current;
      expect(stateAfter.tiles[stateAfter.board[0][0]].value).toBe(4);
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(isNil(stateAfter.board[3][0])).toBeTruthy();
    });
  });

  describe("move_down", () => {
    it("should move tiles up to the bottom of the board", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [1, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_down" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[3][0]).toBe("string");
      expect(typeof stateAfter.board[3][1]).toBe("string");
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
    });

    it("should stack tiles with the same value on top of each other", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [0, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(typeof stateBefore.board[3][0]).toBe("string");

      act(() => dispatch({ type: "move_down" }));

      const [stateAfter] = result.current;
      expect(isNil(stateAfter.board[0][0])).toBeTruthy();
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(typeof stateAfter.board[3][0]).toBe("string");
    });
  });

  describe("move_left", () => {
    it("should move tiles up to the left side of the board", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [1, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[3][0])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_left" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[1][0]).toBe("string");
      expect(typeof stateAfter.board[3][0]).toBe("string");
      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });

    it("should move tiles with the same value on top of each other", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [3, 1],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(isNil(stateBefore.board[1][1])).toBeTruthy();
      expect(isNil(stateBefore.board[1][2])).toBeTruthy();
      expect(typeof stateBefore.board[1][3]).toBe("string");

      act(() => dispatch({ type: "move_left" }));

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[1][0]).toBe("string");
      expect(isNil(stateAfter.board[1][1])).toBeTruthy();
      expect(isNil(stateAfter.board[1][2])).toBeTruthy();
      expect(isNil(stateAfter.board[1][3])).toBeTruthy();
    });
  });

  describe("move_right", () => {
    it("should move tiles up to the right side of the board", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [1, 3],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      expect(isNil(stateBefore.board[1][3])).toBeTruthy();
      expect(isNil(stateBefore.board[3][3])).toBeTruthy(); // ensure position [0,1] is empty before move
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => dispatch({ type: "move_right" })); // perform move up action

      const [stateAfter] = result.current;
      expect(typeof stateAfter.board[1][3]).toBe("string");
      expect(typeof stateAfter.board[3][3]).toBe("string");
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });

    it("should move tiles with the same value on top of each other", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [3, 1],
        value: 2,
      };

      const { result } = renderHook(() =>
        useReducer(gameReducer, initialState),
      );
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "create_tile", tile: tile1 });
        dispatch({ type: "create_tile", tile: tile2 });
      });

      const [stateBefore] = result.current;
      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(isNil(stateBefore.board[1][1])).toBeTruthy();
      expect(isNil(stateBefore.board[1][2])).toBeTruthy();
      expect(typeof stateBefore.board[1][3]).toBe("string");

      act(() => dispatch({ type: "move_right" }));

      const [stateAfter] = result.current;
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[1][1])).toBeTruthy();
      expect(isNil(stateAfter.board[1][2])).toBeTruthy();
      expect(typeof stateAfter.board[1][3]).toBe("string");
    });
  });
});
