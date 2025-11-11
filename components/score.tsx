
import { gameContext } from "@/context/game-contex";
import styles from "@/styles/score.module.css";
import { useContext } from "react";

export default function Score() {
  const { score } = useContext(gameContext);

  return (
    <div className={styles.score}>
      Score
      <div>{score}</div>
    </div>
  );
}
