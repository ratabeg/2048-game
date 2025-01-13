import { TileMap } from "@/models/tile";

export type State = {
  board: string[][];
  tiles: TileMap;
  tilesByIds: string[];
  hasChanged: boolean;
  score: number;
  previousState: State | undefined; // Add this to store the previous state
};

