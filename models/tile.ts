export type Tile = {
  id?: string;
  value: number;
  position: [number, number]; // [x, y]
};

export type TileMap = { [id: string]: Tile };
