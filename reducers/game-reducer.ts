import Board from "@/components/board";
import { tileCountPerDimention } from "@/constants";
import { Tile, TileMap } from "@/models/tile";
import { stat } from "fs";
import { debounce, flattenDeep, isEqual, isNil, throttle } from "lodash";
import { uid } from "uid";


type State = {
  board: string[][];
  tiles: TileMap;
  tilesByIds: string[];
  hasChanged: boolean;
  score: number;
  previousState: State | undefined; // Add this to store the previous state
};
type Action =
  | {
      type: "create_tile";
      tile: Tile;
    }
  | {
      type: "move_up";
    }
  | {
      type: "move_down";
    }
  | {
      type: "move_left";
    }
  | {
      type: "move_right";
    }
  | {
      type: "clean_up";
    }
    | {
      type: "undo";
    };

function createBoard() {
  const board: string[][] = [];

  for (let i = 0; i < tileCountPerDimention; i += 1) {
    board[i] = new Array(tileCountPerDimention).fill(undefined);
  }

  return board;
}
export const initialState: State = {
  board: createBoard(),
  tiles: {},
  tilesByIds: [],
  hasChanged: false,
  score: 0,
  previousState:undefined,
};

export default function gameReducer(
  state: State = initialState,
  action: Action,
) {

  switch (action.type) {
    case "clean_up": {
      const flattenBoard = flattenDeep(state.board);
      const newTiles: TileMap = flattenBoard.reduce(
        (result, tileID: string) => {
          if (isNil(tileID)) {
            return result;
          }
          return {
            ...result,
            [tileID]: state.tiles[tileID],
          };
        },
        {},
      );

      return {
        ...state,
        tiles: newTiles,
        tilesByIds: Object.keys(newTiles),
        hasChanged: false,
        
      };
    }

    case "create_tile": {
      const tileID = uid();
      const [x, y] = action.tile.position;
      const newBoard = JSON.parse(JSON.stringify(state.board));
      newBoard[y][x] = tileID;

      return {
        ...state,
        board: newBoard,
        tiles: { ...state.tiles, [tileID]: { id: tileID, ...action.tile } },
        tilesByIds: [...state.tilesByIds, tileID],
      };
    }
    case "move_up": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let x = 0; x < tileCountPerDimention; x++) {
        let newY = 0;
        let previousTile: Tile | undefined;

        for (let y = 0; y < tileCountPerDimention; y++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              score += previousTile.value * 2;
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY - 1],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true;
            }
            newY++;
          }
        }
      }
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
        previousState: { ...state }, // Save the current state before changes
      };
    }
    case "move_down": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;

      for (let x = 0; x < tileCountPerDimention; x++) {
        let newY = tileCountPerDimention - 1;
        let previousTile: Tile | undefined;

        for (let y = tileCountPerDimention - 1; y >= 0; y--) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              // score += previousTile.value * 2;
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY + 1],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true;
            }
            newY--;
          }
        }
      }
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        previousState: { ...state }, // Save the current state before changes
      };
    }

    case "move_left": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;

      for (let y = 0; y < tileCountPerDimention; y++) {
        let newX = 0;
        let previousTile: Tile | undefined;

        for (let x = 0; x < tileCountPerDimention; x++) {
          const tileID = state.board[y][x];
          const currentTile = state.tiles[tileID];

          if (!isNil(tileID)) {
            if (previousTile?.value === currentTile.value) {
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileID] = {
                ...currentTile,
                position: [newX - 1, y],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[y][newX] = tileID;
            newTiles[tileID] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileID];

            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true;
            }
            newX++;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged: hasChanged,
        previousState: { ...state }, // Save the current state before changes
      };
    }

    case "move_right": {

      
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;
      
      for (let y = 0; y < tileCountPerDimention; y++) {
        let newX = tileCountPerDimention - 1;
        let previousTile: Tile | undefined;

        for (let x = tileCountPerDimention - 1; x >= 0; x--) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              score += previousTile.value * 2;
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [newX + 1, y],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...state.tiles[tileId],
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true;
            }
            newX--;
          }
        }
      }
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        previousState: { ...state }, // Save the current state before changes
        score,
      };
    }

    case "undo":{
      if(state.previousState){
        return{
          ...state.previousState
        }
      }
      // if (state.previousState) {
      //   return {
      //     ...state.previousState, // Restore the previous state
      //     previousState: undefined, // Clear the previous state after undoing
      //   };
      // }
      // return state; // If no previous state, return the current state
    
    }

    default:
      return state;
  }
  // return state;
}
