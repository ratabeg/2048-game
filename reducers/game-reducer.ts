import Board from "@/components/board";
import { tileCountPerDimention } from "@/constants";
import { Tile, TileMap } from "@/models/tile";
import { isNil } from "lodash";
import { uid } from "uid";

type State = {
  board: string[][];
  tiles: TileMap;
};
type Action = {
  type: "create_tile";
  tile: Tile;
}|{
  type: "move_up";
}|{
  type: "move_down";
}|{
  type: "move_left";
}|{
  type: "move_right";
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
    case "create_tile":{
      const tileID = uid();
      const [x, y] = action.tile.position;
      const newBoard = JSON.parse(JSON.stringify(state.board));
      newBoard[y][x] = tileID;

      return {
        ...state,
        board: newBoard,
        tiles: { ...state.tiles, [tileID]: action.tile },
      };
    }
    case "move_up":{
      const newBoard = createBoard();
      const newTiles:TileMap = {}

      for(let x = 0; x < tileCountPerDimention; x++){
        let newY = 0;
        for(let y = 0; y < tileCountPerDimention; y++){
          const tileID = state.board[y][x];
          if(!isNil(tileID)){
            newBoard[newY][x] = tileID
            newTiles[tileID]= {
              ...state.tiles[tileID],
              position: [x,newY],
            }
            newY++;
          }
        }
      }

      return{
        ...state,
        board:newBoard,
        tiles:newTiles
      }
    }

    case "move_down":{
      const newBoard = createBoard();
      const newTiles:TileMap = {}

      for(let x = 0; x < tileCountPerDimention; x++){
        let newY = tileCountPerDimention - 1;
        for(let y = 0; y < tileCountPerDimention; y++){
          const tileID = state.board[y][x];
          if(!isNil(tileID)){
            newBoard[newY][x] = tileID
            newTiles[tileID]= {
              ...state.tiles[tileID],
              position: [x,newY],
            }
            newY--;
          }
        }
      }

      return{
        ...state,
        board:newBoard,
        tiles:newTiles
      }
    }

    case "move_left":{
      const newBoard = createBoard();
      const newTiles:TileMap = {}

      for(let y = 0; y < tileCountPerDimention; y++){
        let newX = 0;
        for(let x = 0; x < tileCountPerDimention; x++){
          const tileID = state.board[y][x];
          if(!isNil(tileID)){
            newBoard[y][newX] = tileID
            newTiles[tileID]= {
              ...state.tiles[tileID],
              position: [newX,y],
            }
            newX++;
          }
        }
      }

      return{
        ...state,
        board:newBoard,
        tiles:newTiles
      }
    }

    case "move_right":{
      const newBoard = createBoard();
      const newTiles:TileMap = {}

      for(let y = 0; y < tileCountPerDimention; y++){
        let newX = tileCountPerDimention - 1;
        for(let x = 0; x < tileCountPerDimention; x++){
          const tileID = state.board[y][x];
          if(!isNil(tileID)){
            newBoard[y][newX] = tileID
            newTiles[tileID]= {
              ...state.tiles[tileID],
              position: [newX,y],
            }
            newX--;
          }
        }
      }

      return{
        ...state,
        board:newBoard,
        tiles:newTiles
      }
    }

    default:
      return state;
  }
  // return state;
}
