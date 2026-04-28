import { GameContext } from "@/context/game-context";
import styles from "@/styles/splash.module.css";
import { useContext } from "react";

import Image from "next/image";
import TrophyPic from "../public/trophy.png"; // Adjust path based on file location

export default function Splash({ heading = "You won!", type = "" }) {
  const { startGame } = useContext(GameContext);

  return (
    <div
      id="wonSplash"
      className={`${styles.splash} ${type === "won" && styles.win}`}
    >
      <div>
        <Image src={TrophyPic} alt="Trophy" width={100} />

        <h1>{heading}</h1>
        <Image src={TrophyPic} alt="Trophy" width={100}/>

        <button className={styles.button} onClick={startGame}>
          Play again
        </button>
      </div>
    </div>
  );
}
