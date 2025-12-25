
export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  grade: number;
  illustrationUrl?: string; // URL hình ảnh minh họa từ AI
}

export enum GameStatus {
  LOBBY = 'LOBBY',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
  GAMEOVER = 'GAMEOVER'
}

export interface CharacterState {
  hp: number;
  maxHp: number;
  name: string;
}
