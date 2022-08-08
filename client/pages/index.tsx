import React from 'react';
import MsgList from '../components/MsgList';
import { fetcher } from '../queryClient';
import { Message, Page } from '../types';
import { GET_MESSAGES } from '../graphql/message';

type Props = {
  serverMsgs: Message[];
};

function Home({ serverMsgs }: Props) {
  return (
    <>
      <h1>SNS</h1>
      <MsgList serverMsgs={serverMsgs} />
    </>
  );
}

export const getServerSideProps = async () => {
  const { messages: serverMsgs }: Page = await fetcher(GET_MESSAGES);
  return {
    props: { serverMsgs },
  };
};

export default Home;
