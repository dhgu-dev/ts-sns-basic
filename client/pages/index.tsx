import React from 'react';
import MsgList, { TMsg, TUsers } from '../components/MsgList';
import fetcher from '../fetcher';

type Props = {
  serverMsgs: TMsg[];
  users: TUsers;
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
