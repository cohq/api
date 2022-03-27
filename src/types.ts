export interface Count {
  key: string;
  value: number;
  [key: string]: unknown;
}

export type IDCount = Count & { id: string };

export type Counts = Count[];
