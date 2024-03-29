import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import type {
    GetStaticPaths,
    GetStaticPropsContext, NextPage
} from "next";
import Head from "next/head";
import superjson from 'superjson';
import { createContext } from "../server/trpc/context";

import { appRouter } from "../server/trpc/router/_app";

import { prisma } from "../server/db/client";

/**
 * For each page generated with the path provided by getStaticPaths
 * We're going to see if the provided url slug can be found in DB.
 * If yes, the user is going to get redirected to the destination, and the visit count will get incremented
 */
export async function getStaticProps(
    context: GetStaticPropsContext<{ slug: string }>,
) {
    const ssg = await createProxySSGHelpers({
        router: appRouter,
        ctx: await createContext(),
        transformer: superjson, // optional - adds superjson serialization
    });
    const slug = context.params?.slug as string;
    const shortUrl = await ssg.shortUrl.getByUrl.fetch(slug);
    if (shortUrl) {
        await ssg.shortUrl.visit.fetch(shortUrl.id);
        return {
            redirect: {
                destination: shortUrl.sourceUrl,
                statusCode: 301,
            },
        }
    }
    return {
        props: {
            trpcState: ssg.dehydrate(),
            slug,
        },
        revalidate: 1,
    };
}

/**
 * With this function, we're going to generate at app build time every possible redirection path.
 * @param fallback is set to blocking, so in case a user create a link while app has been built already,
 * then the page will get generated by next
 */
export const getStaticPaths: GetStaticPaths = async () => {
    const urls = await prisma.shortUrl.findMany({
        select: {
            targetUrl: true
        },
    });
    return {
        paths: urls.map((url) => ({
            params: {
                slug: url.targetUrl,
            },
        })),
        // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
        fallback: 'blocking',
    };
};

const HashPage: NextPage = () => {
    return (
        <div>
            <Head>
                <title>URL Shortener</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>Requested link not found</h1>
        </div>
    );
};


export default HashPage;