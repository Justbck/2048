import { containerWidth, tileCountPerDimension } from "@/constants/constants";
import { Tile as TileProps } from "@/models/tile";
import styles from "@/styles/tile.module.css";

export default function Tile({ position, value }: TileProps) {
  const positionToPixels = (position: number) => {
    return (position / tileCountPerDimension) * containerWidth; // convert grid position to pixel position
  };

  // 0 - (0 / 4) * 288 = 0px
  // 1 - (1 / 4) * 288 = 72px
  // 2 - (2 / 4) * 288 = 144px
  // 3 - (3 / 4) * 288 = 216px

  const style = {
    left: positionToPixels(position[0]),
    top: positionToPixels(position[1]),
  };

  return (
    <div className={styles.tile} style={style}>
      {value}
    </div>
  ); // style={{ left: positionToPixels(position[0]), top: positionToPixels(position[1]) }
}
