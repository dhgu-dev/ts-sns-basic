import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import MsgInput from './MsgInput';
import MsgItem from './MsgItem';
import fetcher from '../fetcher';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { METHOD, Message, Users } from '../types';

type Props = {
  serverMsgs: Message[];
  users: Users;
};

function MsgList({ serverMsgs, users }: Props) {
  const { query } = useRouter();
  const userId = (query.userId || query.userid || '') as string;
  const [msgs, setMsgs] = useState<Message[]>(serverMsgs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fetchMoreEl = useRef<HTMLDivElement>(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);
  const [hasNext, setHasNext] = useState<boolean>(true);

  const onCreate = async (text: string) => {
    const newMsg: Message = await fetcher('post', '/messages', {
      text,
      userId,
    });
    if (!newMsg) throw Error('no new message');
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text: string, id?: string) => {
    const newMsg: Message = await fetcher('put', `/messages/${id}`, {
      text,
      userId,
    });
    if (!newMsg) throw Error('no new message');
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };

  const onDelete = async (id: string) => {
    const receivedId: string = await fetcher('delete', `/messages/${id}`, {
      params: { userId },
    });
    if (!receivedId) throw Error('delete failed');
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === receivedId);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  const doneEdit = () => setEditingId(null);

  const getMessages = async () => {
    const newMsgs: Message[] = await fetcher('get', '/messages', {
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
            user={users[x.userId]}
          ></MsgItem>
        ))}
      </ul>
      <div ref={fetchMoreEl}></div>
    </>
  );
}

export default MsgList;
