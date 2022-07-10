import React from 'react';
import MsgInput from './MsgInput';

type Props = {
  id: string;
  userId: string;
  timestamp: number;
  text: string;
  onUpdate: (text: string, id?: string) => void;
  isEditing: boolean;
  startEdit: () => void;
  onDelete: () => void;
  myId: string | string[];
  nickname: string;
};

function MsgItem({
  id,
  userId,
  timestamp,
  text,
  onUpdate,
  isEditing,
  startEdit,
  onDelete,
  myId,
  nickname,
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
        {nickname} <sub>{dateText}</sub>
      </h3>
      {isEditing ? (
        <>
          <MsgInput mutate={onUpdate} id={id} text={text} />
        </>
      ) : (
        text
      )}

      {myId === userId && (
        <div className="messages__buttons">
          <button onClick={startEdit}>수정</button>
          <button onClick={onDelete}>삭제</button>
        </div>
      )}
    </li>
  );
}

export default MsgItem;
