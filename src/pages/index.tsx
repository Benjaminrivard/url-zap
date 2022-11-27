import type { NextPage } from "next";

import { Box, Title } from "@mantine/core";

import { UrlShortener } from "../components";

const Home: NextPage = () => {
  return (
    <>
      <Box className="flex min-h-screen flex-col items-center justify-center">
        <Title>
          Shorten an <span className="text-[hsl(280,100%,70%)]">Url</span>
        </Title>

        <UrlShortener />
      </Box>

    </>
  );
};

export default Home;
