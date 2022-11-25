import React, { useState } from "react"

import { trpc } from "../utils/trpc";

/**
 * A simple url shortener component that display a form and create a shorter version of the url
 */
const UrlShortener: React.FC = () => {

    const [id, setId] = useState('');
    const [url, setUrl] = useState('');

    const mutation =
        trpc.shortUrl.create.useMutation();

    const shortUrl = trpc.shortUrl.getOne.useQuery(id);

    const submitHandler: React.DOMAttributes<HTMLFormElement>['onSubmit'] = (event) => {
        event.preventDefault();

        mutation.mutate(url, {
            onSuccess(data) {
                if (data) setId(data.id);
            },
        });
    }

    return <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Shorten an  <span className="text-[hsl(280,100%,70%)]">Url</span>
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <form className="flex gap-2 items-center justify-center" method='post' onSubmit={submitHandler}>
                <label className="text-white" htmlFor="url" >Url</label>
                <input className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-white"
                    value={url} onChange={event => setUrl(event.target.value)} name="url" id="url" type="url" required />
                <button
                    type="submit"
                    className="p-2 bg-white rounded-md border-2 border-zinc-800 focus:outline-none"
                >
                    Zap ⚡
                </button>
            </form>

            {shortUrl.data && <span className="text-white"> Your short url : <a href={shortUrl.data.targetUrl}>{shortUrl.data.targetUrl}</a></span>}
        </div>
    </div >
}

export default UrlShortener;  