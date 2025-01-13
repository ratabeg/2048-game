import Board from "@/components/board";
import Head from "next/head";
import styles from "@/styles/index.module.css";
import Score from "@/components/score";
import { GameContext } from "@/context/game-context";
import { useContext } from "react";

export default function Home() {

  // const { StepBack, stepBack } = useContext(GameContext);
    const { StepBack, stepBack } = useContext(GameContext);



  return (
    <div className={styles.twenty48}>
      <Head>
        <title>Play 2048</title>
        <meta name="description" content="2048 in react" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>2048</h1>
        <Score />
      </header>
      <main>
        <Board />
      </main>
      <header>
      {stepBack? <button className={styles.undoBtn} onClick={StepBack}>Step back</button>: ""}
      </header>
      <footer>Made with ❤️ by Raouf</footer>
    </div>
  );
}
