import React, { useRef, FormEvent } from 'react';
import { Mutate } from '../types';

type Props = {
  mutate: Mutate;
  id?: string;
  text?: string;
};

function MsgInput({ mutate, id = undefined, text = '' }: Props) {
  const textRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!textRef.current) return;
    const text = textRef.current.value;
    textRef.current.value = '';
    mutate({ text, id });
  };

  return (
    <form className="messages__input" onSubmit={onSubmit}>
      <textarea
        ref={textRef}
        placeholder="내용을 입력하세요."
        defaultValue={text}
      ></textarea>
      <button type="submit">완료</button>
    </form>
  );
}

export default MsgInput;
