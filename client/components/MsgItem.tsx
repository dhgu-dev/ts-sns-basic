import React from 'react';
import MsgInput from './MsgInput';
import { User } from '../types';

type Props = {
  id: string;
  timestamp: number;
  text: string;
  isEditing: boolean;
  onUpdate: (text: string, id?: string) => void;
  onDelete: () => void;
  startEdit: () => void;
  myId: string;
  user: User;
};

function MsgItem({
  id,
  timestamp,
  text,
  isEditing,
  onUpdate,
  onDelete,
  startEdit,
  myId,
  user,
}: Props) {
  const dateText = new Date(timestamp).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return (
    <li className="messages__item">
      <h3>
        {user.nickname} <sub>{dateText}</sub>
      </h3>
      {isEditing ? (
        <>
          <MsgInput mutate={onUpdate} id={id} text={text} />
        </>
      ) : (
        text
      )}

      {myId === user.id && (
        <div className="messages__buttons">
          <button onClick={startEdit}>수정</button>
          <button onClick={onDelete}>삭제</button>
        </div>
      )}
    </li>
  );
}

export default MsgItem;
