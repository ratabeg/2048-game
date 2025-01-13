import styles from "@/styles/board.module.css";
import Tile from "./tile";
// import { useCallback, useContext, useEffect, useReducer, useRef } from "react";
import { useCallback, useContext, useEffect, useRef } from "react";
// import gameReducer, { initialState } from "@/reducers/game-reducer";
import { Tile as TileModel } from "@/models/tile";
// import { mergeAnimationDuration } from "@/constants";
// import { GameContext, dispatch, gameState } from "@/context/game-context";
import dispatch,{ GameContext } from "@/context/game-context";


const Board = () => {
  const { moveTiles, getTiles,startGame } = useContext(GameContext);
  // const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const initilized = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();

      switch (e.key) {
        case "ArrowUp":
         moveTiles("move_up");
          break;
        case "ArrowDown":
          moveTiles("move_down");
          break;
        case "ArrowLeft":
          moveTiles("move_left");
          break;
        case "ArrowRight":
          moveTiles("move_right");
          break;
      
      }

      // setTimeout(() => {dispatch({ type: "clean_up" })
      // appendRandomTile()
      // }, mergeAnimationDuration);
    },
    [moveTiles],
  );


  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCellsCount = 16;

    for (let index = 0; index < totalCellsCount; index += 1) {
      cells.push(<div className={styles.cell} key={index} />);
    }

    return cells;
  };

  const renderTiles = () => {
    return getTiles().map((tile: TileModel) => (
      <Tile key={`${tile.id}`} {...tile} />
    ));
  };

  // const renderTiles = () => {
  //   return Object.values(gameState.tiles).map(
  //     (tile: TileModel, index: number) => {
  //       return <Tile key={`${index}`} {...tile} />;
  //     },
  //   );
  // };

  useEffect(() => {
    if (initilized.current == false) {
      // dispatch({ type: "create_tile", tile: { position: [0, 1], value: 2 } });
      // dispatch({ type: "create_tile", tile: { position: [0, 2], value: 2 } });
      startGame();
      initilized.current = true;
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
      <div className={styles.tiles}>
        {/* <Tile /> */}
        {renderTiles()}
      </div>
      <div className={styles.grid}>{renderGrid()}</div>
    </div>
  );
};

export default Board;
