# url-zap

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the [T3-Stack](https://create.t3.gg).

## How do I run this

Needed: `node >= 18`
Optional: [nvm](https://github.com/nvm-sh/nvm)

- (optional) `nvm use`
- `npm install`
- create a `.env` copy of the `.env.example` file, and replace the values if needed
- `npm run dev`

## How would I deploy this?

Whether:

- Using [Vercel](https://create.t3.gg/en/deployment/vercel)
- Using [Docker](https://create.t3.gg/en/deployment/docker)
- Using a Cloud Provider, [AWS for instance](https://aws.amazon.com/blogs/mobile/host-a-next-js-ssr-app-with-real-time-data-on-aws-amplify/)

## folder structure

Folder structure is detailed by [Create-T3-stack](https://create.t3.gg/en/folder-structure)

## E2E Testing

The main use case is tested with [Playwright](https://playwright.dev/)

The tests are located in the `<root>/e2e` directory

Run the following commands :

- `npx playwright install`
- (optional) `sudo npx playwright install-deps`
- `npm run test:e2e`

## DB

Db made with sqlite and Prisma

`postinstall` script details :

1. Prisma client is created with `prisma generate`
2. Schema created with `prisma db push`
3. DB is seeded with `prisma db seed`

To get correct typings of the prisma client, the TS extension in the IDE needs to be restarted.

### Model description

The `ShortUrl` model is defined in the `prisma/schema.prisma` file.

- The `id` of the table is generated using the [cuid](https://github.com/paralleldrive/cuid) algorithm, and is the unique key of the table
- The `sourceUrl` property contains the link provided by the user.
- The `targetUrl` property is generated using `cuid.slug`
  - `cuid.slug` produces a shorter (but more sensible to collision) string.
  - That is why id is not generated using the method ([as recommended in the lib](https://github.com/paralleldrive/cuid#short-urls))
- The `createdAt` and `updatedAt` are auto-generated and not used currently.
  - The could be used to manage the TTL of an URL, with a cron task deleting too old links, for instance.
- The `visited` attribute is incremented by 1 every time a link is clicked.

## tRPC

tRPC stand for Typescript Remote Procedure Call

It is designed to ensure end-to-end type safety (using typescript inference) between the whole application stack.

It uses `zod` to validate inputs (both prior compilation and during the runtime) to ensure type safety.

Backend logic is exposed through a router, that is injected inside the client app using the HOC `withTRPC`.

## Backend

The backend is powered through next `src/pages/api` folder.

## SSG

At application build time, every redirection page is generated beforehand, so it's ready to get statically served to the user.
It ensure fast performances and a smooth experience.
If a short url is created during the application runtime, the `src/pages/[slug].tsx` : `getStaticPaths.fallback` option kicks in and generate the page (which can then be cached)

## Style

Tailwind for ease of use in HTML

Tailwind preflight are disabled because they cause conflict with Mantine default theme

Mantine for components + Layout

## Nice to haves

- [x] Dark mode
- [x] Same URL always returns the same generated string
- [ ] User can customise the URL
- [ ] Expiration dates on URLs
- [x] Tests => Test implemented using Playwright, see [E2E Testing](#e2e-testing)
- [*] Clicks counter => counter visible with api route [/api/url/tracking](http://localhost:300/api/url.tracking), but not working entierly as expected

## What's missing before going to production

- should implement [prisma migration instead of pushing the model directly](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push#choosing-db-push-or-prisma-migrate).
- component testing, maybe using jest & testing-library
- better host handling
- Because the page redirection page can be cached by the user or a CDN, the visit number might not increase correctly.
  - Data fetching and navigation should occur in the client side if we wish to have a correct counter
  - Otherwise we could use the HTTP code 307 (moved temporarily) to tell the user to never cache the page
