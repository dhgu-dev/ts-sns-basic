const METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
} as const;
export type METHOD = typeof METHOD[keyof typeof METHOD];

export interface Message {
  id: string;
  userId: string;
  timestamp: number;
  text: string;
}

export interface User {
  id: string;
  nickname: string;
}

export interface Users {
  [key: string]: User;
}
