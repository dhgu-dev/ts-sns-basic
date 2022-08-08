export interface Message {
  id: string;
  userId: string;
  timestamp: number;
  text: string;
  user: User;
}

export interface User {
  id: string;
  nickname: string;
}

export interface Page {
  messages: Message[];
}

export type Mutate = ({ text, id }: { text: string; id?: string }) => void;

export interface MsgQueryData {
  pages: Page[];
  pageParams: string;
}
