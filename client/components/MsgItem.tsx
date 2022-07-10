import React from 'react';
import MsgInput from './MsgInput';

type Props = {
  id: number;
  userId: string;
  timestamp: number;
  text: string;
  onUpdate: (text: string, id?: number) => void;
  isEditing: boolean;
  startEdit: () => void;
  onDelete: () => void;
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
        {userId} <sub>{dateText}</sub>
      </h3>
      {isEditing ? (
        <>
          <MsgInput mutate={onUpdate} id={id} text={text} />
        </>
      ) : (
        text
      )}

      <div className="messages__buttons">
        <button onClick={startEdit}>수정</button>
        <button onClick={onDelete}>삭제</button>
      </div>
    </li>
  );
}

export default MsgItem;
