import { request } from 'graphql-request';
import { DocumentNode } from 'graphql';
import { MsgQueryData, Message, Page } from './types';

const URL = 'http://localhost:8000/graphql';

export const fetcher = (
  query: DocumentNode,
  variables: { [key: string]: any } = {},
) => request(URL, query, variables);

export const QueryKeys = {
  MESSAGES: 'MESSAGES',
  MESSAGE: 'MESSAGE',
  USERS: 'USERS',
  USER: 'USER',
};

export const findTargetMsgIndex = (pages: Page[], id: string) => {
  let msgIndex = -1;
  const pageIndex = pages.findIndex(({ messages }) => {
    msgIndex = messages.findIndex((msg) => msg.id === id);
    if (msgIndex > -1) return true;
    return false;
  });
  return { pageIndex, msgIndex };
};

export const getNewMessages = (old: MsgQueryData) => ({
  pages: old.pages.map(({ messages }) => ({ messages: [...messages] })),
  pageParams: old.pageParams,
});
