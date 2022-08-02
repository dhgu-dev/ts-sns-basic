import { writeDB } from '../dbController.js';
import { v4 } from 'uuid';

const setMsgs = (data) => writeDB('messages', data);

// obj: parent 객체, 거의 사용X
// args: Query에 필요한 필드에 제공되는 인수(파라미터)
// context: 로그인한 사용자, DB Access 등의 중요한 정보들

const messageResolver = {
  Query: {
    messages: (obj, args, context) => {
      const { models } = context;
      const { cursor = '' } = args;
      const fromIndex =
        models.messages.findIndex((msg) => String(msg.id) === cursor) + 1;
      return models.messages?.slice(fromIndex, fromIndex + 15) || [];
    },
    message: (obj, { id = '' }, { models }) => {
      return models.messages.find((msg) => String(msg.id) === id);
    },
  },
  Mutation: {
    createMessage: (obj, { text, userId }, { models }) => {
      if (!userId) throw Error('사용자가 없습니다');
      const newMsg = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      models.messages.unshift(newMsg);
      setMsgs(models.messages);
      return newMsg;
    },
    updateMessage: (obj, { id, text, userId }, { models }) => {
      const { messages } = models;
      const targetIndex = messages.findIndex((msg) => String(msg.id) === id);
      if (targetIndex < 0) throw Error('메세지가 없습니다');
      if (messages[targetIndex].userId !== userId)
        throw Error('사용자가 다릅니다');

      const newMsg = { ...messages[targetIndex], text };
      messages.splice(targetIndex, 1, newMsg);
      setMsgs(messages);
      return newMsg;
    },
    deleteMessage: (obj, { id, userId }, { models }) => {
      const { messages } = models;
      const targetIndex = messages.findIndex((msg) => String(msg.id) === id);
      if (targetIndex < 0) throw Error('메세지가 없습니다');
      if (messages[targetIndex].userId !== userId)
        throw Error('사용자가 다릅니다');
      messages.splice(targetIndex, 1);
      setMsgs(messages);
      return id;
    },
  },
  Message: {
    user: (msg, args, { models }) => models.users[msg.userId],
  },
};

export default messageResolver;
