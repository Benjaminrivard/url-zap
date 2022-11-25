import type {
  NextPage
} from "next";
import Head from "next/head";

import { UrlShortener } from '../components';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Url zap ⚡</title>
        <meta name="description" content="Makes an long url very short" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <UrlShortener />
      </main>
    </>
  );
};

export default Home;
