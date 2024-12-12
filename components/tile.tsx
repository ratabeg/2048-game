import {
  containerWidth,
  mergeAnimationDuration,
  tileCountPerDimention,
} from "@/constants";
import usePreviousProps from "@/hooks/use-previous-props";
import { Tile as TileProps } from "@/models/tile";
import styles from "@/styles/tile.module.css";
import { transform } from "lodash";
import { useEffect, useState } from "react";

const Tile = ({ position, value }: TileProps) => {
  const [Scale, setScale] = useState(1);
  const previousValue = usePreviousProps(value);
  const hasChange = previousValue != value;

  useEffect(() => {
    if (hasChange) {
      setScale(1.1);
      setTimeout(() => setScale(1), mergeAnimationDuration);
    }
  }, [hasChange]);

  const positionToPixels = (position: number) => {
    return (position / tileCountPerDimention) * containerWidth;
  };

  const style = {
    left: positionToPixels(position[0]),
    top: positionToPixels(position[1]),
    transform: `scale(${Scale})`,
    zIndex: value,
  };
  return (
    <div className={styles.tile} style={style}>
      {value}
    </div>
  );
};

export default Tile;
