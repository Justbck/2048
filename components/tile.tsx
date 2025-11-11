import {
  containerWidthDesktop,
  containerWidthMobile,
  mergeAnimationDuration,
  tileCountPerDimension,
} from "@/constants/constants";
import usePreviousProps from "@/hooks/use-previous-props";
import { Tile as TileProps } from "@/models/tile";
import styles from "@/styles/tile.module.css";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Tile({ position, value }: TileProps) {
  const isWideScreen = useMediaQuery({ minWidth: 512});
  const containerWidth = isWideScreen ? containerWidthDesktop : containerWidthMobile;
  const [scale, setScale] = useState(1);
  const previousValue = usePreviousProps(value);
  const hasChanged = previousValue !== value;

  const positionToPixels = (position: number) => {
    return (position / tileCountPerDimension) * containerWidth; // convert grid position to pixel position
  };

  useEffect(() => {
    if (hasChanged) {
      setScale(1.1);
      setTimeout(() => setScale(1), mergeAnimationDuration);
    }
  }, [hasChanged]);

  // 0 - (0 / 4) * 288 = 0px
  // 1 - (1 / 4) * 288 = 72px
  // 2 - (2 / 4) * 288 = 144px
  // 3 - (3 / 4) * 288 = 216px

  const style = {
    left: positionToPixels(position[0]),
    top: positionToPixels(position[1]),
    transform: `scale(${scale})`,
    zIndex: value,
  };

  return (
      <div className={`${styles.tile} ${styles[`tile${value}`]}`} style={style}>
      {value}
    </div>
    )
}
