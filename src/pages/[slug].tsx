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
    console.log(shortUrl)
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
export const getStaticPaths: GetStaticPaths = async () => {
    const urls = await prisma.shortUrl.findMany({
        select: {
            id: true,
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