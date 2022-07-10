import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import MsgInput from './MsgInput';
import MsgItem from './MsgItem';
import fetcher from '../fetcher';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

type Props = {
  serverMsgs: TMsg[];
  users: TUsers;
};
export type TMsg = {
  id: string;
  userId: string;
  timestamp: number;
  text: string;
};
export type TUsers = {
  [key: string]: {
    id: string;
    nickname: string;
  };
};

function MsgList({ serverMsgs, users }: Props) {
  const { query } = useRouter();
  const userId = query.userId || query.userid || '';
  const [msgs, setMsgs] = useState<TMsg[]>(serverMsgs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fetchMoreEl = useRef<HTMLDivElement>(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);
  const [hasNext, setHasNext] = useState(true);

  const onCreate = async (text: string) => {
    const newMsg: TMsg = await fetcher('post', '/messages', { text, userId });
    if (!newMsg) throw Error('no new message');
    setMsgs((msgs) => [newMsg, ...msgs]);
  };
  const onUpdate = async (text: string, id?: string) => {
    const newMsg = await fetcher('put', `/messages/${id}`, { text, userId });
    if (!newMsg) throw Error('no new message');
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex(
        (msg) => String(msg.id) === String(id),
      );
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };
  const onDelete = async (id: string) => {
    const receivedId = await fetcher('delete', `/messages/${id}`, {
      params: { userId },
    });
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex(
        (msg) => String(msg.id) === String(receivedId),
      );
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };
  const doneEdit = () => setEditingId(null);

  const getMessages = async () => {
    const newMsgs: TMsg[] = await fetcher('get', '/messages', {
      params: { cursor: msgs[msgs.length - 1]?.id || '' },
    });
    if (newMsgs.length === 0) {
      setHasNext(false);
      return;
    }
    setMsgs((msgs) => [...msgs, ...newMsgs]);
  };

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);

  return (
    <>
      {userId && <MsgInput mutate={onCreate}></MsgInput>}
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            isEditing={editingId === x.id}
            startEdit={() =>
              setEditingId((prevId) => (prevId === x.id ? null : x.id))
            }
            onDelete={() => onDelete(x.id)}
            myId={userId}
            nickname={users[x.userId].nickname}
          ></MsgItem>
        ))}
      </ul>
      <div ref={fetchMoreEl}></div>
    </>
  );
}

export default MsgList;
