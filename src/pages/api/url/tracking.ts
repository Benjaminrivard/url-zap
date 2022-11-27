import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";

const visitCounters = async (req: NextApiRequest, res: NextApiResponse) => {
    const counters = await prisma.shortUrl.findMany();
    res.status(200).json(counters.map(url => ({ [url.sourceUrl]: url.visited })));
};

export default visitCounters;
