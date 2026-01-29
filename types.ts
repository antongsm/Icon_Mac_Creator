export interface GeneratedIcon {
  id: string;
  url: string;
  prompt: string;
}

export interface IconGenerationConfig {
  prompt: string;
  style: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}