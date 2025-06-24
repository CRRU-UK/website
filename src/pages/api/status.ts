import type { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Cache-Control", "no-store");

  return res.status(200).send("OK");
};

export default handler;
