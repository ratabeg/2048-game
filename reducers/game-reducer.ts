type State = {
  board: string[][];
};
type Action = {};

[
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function createBoard(tileCountPerDimention: number = 4) {
  const board: string[][] = [];

  for (let i = 0; i < tileCountPerDimention; i += 1) {
    board[i] = new Array(tileCountPerDimention).fill(undefined);
  }

  return board;
}
export const initialState: State = {
  board: createBoard(),
};

export default function gameReducer(
  state: State = initialState,
  action: Action,
) {
  return state;
}
