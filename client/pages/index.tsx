import React from 'react';
import MsgList from '../components/MsgList';
import fetcher from '../fetcher';
import { Message, Users, METHOD } from '../types';

type Props = {
  serverMsgs: Message[];
  users: Users;
};

function Home({ serverMsgs, users }: Props) {
  return (
    <>
      <h1>HOME</h1>
      <MsgList serverMsgs={serverMsgs} users={users} />
    </>
  );
}

export const getServerSideProps = async () => {
  const serverMsgs = await fetcher('get', '/messages');
  const users = await fetcher('get', '/users');
  return {
    props: { serverMsgs, users },
  };
};

export default Home;
