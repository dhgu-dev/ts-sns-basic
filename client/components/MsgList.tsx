import React, { useState, useEffect } from 'react';
import MsgInput from './MsgInput';
import MsgItem from './MsgItem';

type Props = {};
type TMsg = {
  id: number;
  userId: string;
  timestamp: number;
  text: string;
};

const userIds = ['roy', 'jay'];
const getRandomUserId = () => userIds[Math.round(Math.random())];

function MsgList({}: Props) {
  const [msgs, setMsgs] = useState<TMsg[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const onCreate = (text: string) => {
    const newMsg: TMsg = {
      id: msgs.length + 1,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${msgs.length + 1} ${text}`,
    };
    setMsgs((msgs) => [newMsg, ...msgs]);
  };
  const onUpdate = (text: string, id?: number) => {
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, {
        ...msgs[targetIndex],
        text,
      });
      return newMsgs;
    });
    doneEdit();
  };
  const onDelete = (id: number) => {
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };
  const doneEdit = () => setEditingId(null);

  useEffect(() => {
    const msgs = Array(50)
      .fill(0)
      .map((_, idx) => ({
        id: idx + 1,
        userId: getRandomUserId(),
        timestamp: 1234567890123 + idx * 1000 * 60,
        text: `${idx + 1} mock text`,
      }))
      .reverse();
    setMsgs(msgs);
  }, []);

  return (
    <>
      <MsgInput mutate={onCreate}></MsgInput>
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
          ></MsgItem>
        ))}
      </ul>
    </>
  );
}

export default MsgList;
