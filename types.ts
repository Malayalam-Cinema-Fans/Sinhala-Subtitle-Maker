
export interface SubtitleBlock {
  index: number;
  timestamp: string;
  text: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  TRANSLATING = 'TRANSLATING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}
