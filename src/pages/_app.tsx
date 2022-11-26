import type { AppProps } from "next/app";
import type { GetServerSidePropsContext } from "next";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";

import { getCookie, setCookie } from "cookies-next";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Layout from "./layout";
import { useState } from "react";
import Head from "next/head";

const MyApp = ({
  Component,
  pageProps,
  colorScheme,
}: AppProps & { colorScheme: ColorScheme }) => {
  const [theme, setTheme] = useState<ColorScheme>(colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setTheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <title>Url zap ⚡</title>
        <meta name="description" content="Makes an long url very short" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ColorSchemeProvider
        colorScheme={theme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: theme,
            primaryColor: "violet",
            defaultGradient: { from: "pink", to: "violet", deg: 20 },
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};

MyApp.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  // get color scheme from cookie
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});

export default trpc.withTRPC(MyApp);
