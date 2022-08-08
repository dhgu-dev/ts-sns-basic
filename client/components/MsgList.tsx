import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import MsgInput from './MsgInput';
import MsgItem from './MsgItem';
import {
  QueryKeys,
  fetcher,
  findTargetMsgIndex,
  getNewMessages,
} from '../queryClient';
import {
  GET_MESSAGES,
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  DELETE_MESSAGE,
} from '../graphql/message';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import {
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { Message, MsgQueryData } from '../types';

type Props = {
  serverMsgs: Message[];
};

function MsgList({ serverMsgs }: Props) {
  const client = useQueryClient();
  const { query } = useRouter();
  const userId = (query.userId || query.userid || '') as string;
  const [msgs, setMsgs] = useState([{ messages: serverMsgs }]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fetchMoreEl = useRef<HTMLDivElement>(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const { mutate: onCreate } = useMutation(
    ({ text }: { text: string }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        client.setQueryData<MsgQueryData>([QueryKeys.MESSAGES], (old) => {
          if (!old)
            return { pages: [{ messages: [createMessage] }], pageParams: '' };
          return {
            pages: [
              { messages: [createMessage, ...old.pages[0].messages] },
              ...old.pages.slice(1),
            ],
            pageParams: old.pageParams,
          };
        });
      },
    },
  );

  const { mutate: onUpdate } = useMutation(
    ({ text, id }: { text: string; id?: string }) =>
      fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        doneEdit();
        client.setQueryData<MsgQueryData>([QueryKeys.MESSAGES], (old) => {
          if (!old) return { pages: [{ messages: [] }], pageParams: '' };
          const { pageIndex, msgIndex } = findTargetMsgIndex(
            old.pages,
            updateMessage.id,
          );
          if (pageIndex < 0 || msgIndex < 0) return old;
          const newMsgs = getNewMessages(old);
          newMsgs.pages[pageIndex].messages.splice(msgIndex, 1, updateMessage);
          return newMsgs;
        });
      },
    },
  );

  const { mutate: onDelete } = useMutation(
    (id: string) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
      onSuccess: ({ deleteMessage: deletedId }) => {
        client.setQueryData<MsgQueryData>([QueryKeys.MESSAGES], (old) => {
          if (!old) return { pages: [{ messages: [] }], pageParams: '' };
          const { pageIndex, msgIndex } = findTargetMsgIndex(
            old.pages,
            deletedId,
          );
          if (pageIndex < 0 || msgIndex < 0) return old;
          const newMsgs = getNewMessages(old);
          newMsgs.pages[pageIndex].messages.splice(msgIndex, 1);
          return newMsgs;
        });
      },
    },
  );

  const doneEdit = () => setEditingId(null);

  const { data, error, isError, fetchNextPage, hasNextPage } = useInfiniteQuery(
    [QueryKeys.MESSAGES],
    ({ pageParam = '' }) => fetcher(GET_MESSAGES, { cursor: pageParam }),
    {
      getNextPageParam: ({ messages }) => messages?.[messages.length - 1]?.id,
    },
  );

  useEffect(() => {
    if (!data?.pages) return;
    setMsgs(data.pages);
  }, [data?.pages]);

  if (isError) {
    console.error(error);
    return null;
  }

  useEffect(() => {
    if (intersecting && hasNextPage) fetchNextPage();
  }, [intersecting, hasNextPage]);

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs.map(({ messages }, pageIndex) =>
          messages.map((x) => (
            <MsgItem
              key={pageIndex + x.id}
              {...x}
              onUpdate={onUpdate}
              isEditing={editingId === x.id}
              startEdit={() =>
                setEditingId((prevId) => (prevId === x.id ? null : x.id))
              }
              onDelete={() => onDelete(x.id)}
              myId={userId}
            />
          )),
        )}
      </ul>
      <div ref={fetchMoreEl}></div>
    </>
  );
}

export default MsgList;
