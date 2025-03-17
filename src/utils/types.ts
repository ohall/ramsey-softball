export type Position = {
  x: number;
  y: number;
};

export type PitchType = 'fastball' | 'curveball' | 'changeup';

export type PitchSettings = {
  type: PitchType;
  speed: number;
  curve: number;
};

export enum GameState {
  WAITING = 'waiting',
  PITCHING = 'pitching',
  BATTING = 'batting',
  RUNNING = 'running',
  FIELDING = 'fielding',
  BETWEEN_PLAYS = 'betweenPlays',
}

export enum SwingResult {
  MISS = 'miss',
  FOUL = 'foul',
  HIT = 'hit',
  HOME_RUN = 'homeRun',
}

export type GameStats = {
  score: number;
  strikes: number;
  balls: number;
  outs: number;
  inning: number;
  isTopInning: boolean;
};

export type Chant = {
  text: string;
  duration: number;
};

export const DUGOUT_CHANTS: Chant[] = [
  { text: "We need a hit!", duration: 2000 },
  { text: "Hey batter batter!", duration: 2000 },
  { text: "Rally time!", duration: 2000 },
  { text: "Let's go Ramsey!", duration: 2000 },
  { text: "Swing batter!", duration: 1500 },
  { text: "Eye on the ball!", duration: 2000 },
  { text: "Crush it!", duration: 1500 },
  { text: "Nice swing!", duration: 1500 },
  { text: "You got this!", duration: 1500 },
  { text: "Bring 'em home!", duration: 2000 },
];