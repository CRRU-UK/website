/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from "next";

import { Catalogues } from "@/helpers/constants";
import { getCatalogueList } from "@/helpers/getCatalogue";
import { COMMON_CACHE_DIRECTIVES } from "@/helpers/constants";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Cache-Control", COMMON_CACHE_DIRECTIVES);
    res.setHeader("Cache-Key", "catalogue");
  }

  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  const catalogue = req.query.catalogue;

  if (catalogue !== Catalogues.BottlenoseDolphin && catalogue !== Catalogues.MinkeWhale) {
    return res.status(404).send("Not Found");
  }

  const pageQuery = Array.isArray(req.query.page) ? req.query.page[0] : req.query.page;

  if (pageQuery === undefined) {
    return res.status(400).send("Missing `page` param");
  }

  const pageNumber = parseInt(String(pageQuery), 10);

  // TODO: Replace with joi?
  if (String(pageQuery).includes(".") || Number.isNaN(pageNumber) || pageNumber <= 0) {
    return res.status(400).send("`page` param must be an integer greater than 0");
  }

  const query: any = {
    page: pageNumber,
  };

  if (req.query?.search) {
    const searchQuery = Array.isArray(req.query.search) ? req.query.search[0] : req.query.search;
    query.search = searchQuery;
  }

  const data = await getCatalogueList(catalogue, query);

  return res.json(data);
};

export default handler;
