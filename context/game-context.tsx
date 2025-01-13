import { mergeAnimationDuration, tileCountPerDimention } from "@/constants";
import gameReducer, { initialState } from "@/reducers/game-reducer";
import { isNil, throttle } from "lodash";
import { createContext, PropsWithChildren, useCallback, useEffect, useReducer } from "react";
import { Tile } from "@/models/tile";

type MoveDirection = "move_up" | "move_down" | "move_left" | "move_right";

export const GameContext = createContext({
  appendRandomTile: () => {},
  gameState: initialState,
  getTiles: () => [] as Tile[],
  // dispatch: (_: any) => {},
  moveTiles: (_: MoveDirection) => {},
  startGame:()=>{},
  score: 0,
  stepBack:undefined
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

  const getTiles = () => {
    return gameState.tilesByIds.map((tileId) => gameState.tiles[tileId]);
  };

  const moveTiles = useCallback(
    throttle(
      (type: MoveDirection) => dispatch({ type }),
      mergeAnimationDuration * 1.05,
      { trailing: false },
    ),
    [dispatch],
  );


  const startGame = () => {
    // dispatch({ type: "reset_game" });
    dispatch({ type: "create_tile", tile: { position: [0, 1], value: 2 } });
    dispatch({ type: "create_tile", tile: { position: [0, 2], value: 2 } });
  };

  const undo = ()=>{
    dispatch({ type: "undo"})
  }


  return (
    <GameContext.Provider
      value={{ appendRandomTile, getTiles,startGame,moveTiles, stepBack:gameState.previousState,undo, score: gameState.score}}
    >
      {children}
    </GameContext.Provider>
  );
}
