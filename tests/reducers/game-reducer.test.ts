import { Tile } from "@/models/tile";
import gameReducer, { initialState } from "@/reducers/game-reducer";
import { renderHook } from "@testing-library/react";
import { act, useReducer } from "react";

describe('gameReducer', () => { // main test suite
  describe('create_tile', () => {
    it('should add a new tile to the board', () => {
      const tile: Tile = { // action payload
        position: [0,0],
        value: 2,
      }

      const {result} = renderHook(() => useReducer(gameReducer, initialState))
      const [, dispatch] = result.current

      act(() => {
        dispatch({ type: 'create_tile', tile }) // action
      });

      const [state] = result.current // get updated state after act
      expect(state.board[0][0]).toBeDefined() // check if tile id is placed on the board
      // tiles is an object mapping ids to Tile. Ensure one of the values equals the tile payload
      expect(Object.values(state.tiles)).toContainEqual(tile)
  });
});
});
