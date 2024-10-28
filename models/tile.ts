import Tile from "@/components/tile";

export type Tile = {
  id?: string;
  position: [number, number];
  value: number;
};


export type TileMap = { [id:string]:Tile}