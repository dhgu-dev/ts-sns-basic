import './index.scss';
import type { AppProps, AppContext } from 'next/app';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useRef } from 'react';

const App = ({ Component, pageProps }: AppProps) => {
  const clientRef = useRef<QueryClient | null>(null);

  const getClient = () => {
    if (!clientRef.current) {
      clientRef.current = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      });
    }
    return clientRef.current;
  };

  return (
    <QueryClientProvider client={getClient()}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
};

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  const pageProps = await Component.getInitialProps?.(ctx);
  return { pageProps };
};

export default App;
