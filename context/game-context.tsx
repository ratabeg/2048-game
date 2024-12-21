import { mergeAnimationDuration, tileCountPerDimention } from "@/constants";
import gameReducer, { initialState } from "@/reducers/game-reducer";
import { isNil } from "lodash";
import { createContext, PropsWithChildren, useEffect, useReducer } from "react";

export const GameContext = createContext({
  appendRandomTile: () => {},
  gameState: initialState,
  dispatch: (_: any) => {},
});

export default function GameProvider({ children }: PropsWithChildren) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const getEmptyCells = () => {
    const results: [number, number][] = [];

    for (let x = 0; x < tileCountPerDimention; x++) {
      for (let y = 0; y < tileCountPerDimention; y++) {
        if (isNil(gameState.board[y][x])) {
          results.push([x, y]);
        }
      }
    }
    return results;
  };

  useEffect(() => {
    if (gameState.hasChanged) {
      setTimeout(() => {
        dispatch({ type: "clean_up" });
        appendRandomTile();
      }, mergeAnimationDuration);
    }
  }, [gameState.hasChanged]);

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
  return (
    <GameContext.Provider value={{ appendRandomTile, gameState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
