import Board from "@/components/board";
import { tileCountPerDimention } from "@/constants";
import { Tile, TileMap } from "@/models/tile";
import { stat } from "fs";
import { flattenDeep, isNil } from "lodash";
import { uid } from "uid";

type State = {
  board: string[][];
  tiles: TileMap;
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
};

export default function gameReducer(
  state: State = initialState,
  action: Action,
) {
  switch (action.type) {
    case "clean_up": {
      const flattenBoard = flattenDeep(state.board);
      const newTiles: TileMap = flattenBoard.reduce(
        (result, tileId: string) => {
          if (isNil(tileId)) {
            return result;
          }
          return {
            ...result,
            [tileId]: state.tiles[tileId],
          };
        },
        {},
      );

      return {
        ...state,
        tiles: newTiles,
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
      };
    }
    case "move_up": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let x = 0; x < tileCountPerDimention; x++) {
        let newY = 0;
        let previousTile: Tile | undefined;
        for (let y = 0; y < tileCountPerDimention; y++) {
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
                position: [x, newY - 1],
              };
              previousTile = undefined;
              continue;
            }

            newBoard[newY][x] = tileID;
            newTiles[tileID] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileID];
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

      for (let x = 0; x < tileCountPerDimention; x++) {
        let newY = tileCountPerDimention - 1;
        let previousTile: Tile | undefined;

        for (let y = 0; y < tileCountPerDimention; y++) {
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
                position: [x, newY + 1],
              };
              previousTile = undefined;
              continue;
            }

            newBoard[newY][x] = tileID;
            newTiles[tileID] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileID];
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
              continue;
            }

            newBoard[y][newX] = tileID;
            newTiles[tileID] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileID];
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

      for (let y = 0; y < tileCountPerDimention; y++) {
        let newX = tileCountPerDimention - 1;
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
                position: [newX + 1, y],
              };
              previousTile = undefined;
              continue;
            }

            newBoard[y][newX] = tileID;
            newTiles[tileID] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileID];
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
  // return state;
}
