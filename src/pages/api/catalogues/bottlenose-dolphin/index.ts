import type { NextApiRequest, NextApiResponse } from 'next';

import { getCatalogueList } from '@/helpers/getBottlenoseDolphinCatalogue';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  const pageQuery = Array.isArray(req.query.page) ? req.query.page[0] : req.query.page;

  if (pageQuery === undefined) {
    return res.status(400).send('Missing `page` param');
  }

  const pageNumber = parseInt(String(pageQuery), 10);

  if (String(pageQuery).includes('.') || Number.isNaN(pageNumber) || pageNumber <= 0) {
    return res.status(400).send('`page` param must be an integer greater than 0');
  }

  const query: any = {
    page: pageNumber,
  };

  if (req.query?.search) {
    const searchQuery = Array.isArray(req.query.search) ? req.query.search[0] : req.query.search;
    query.search = searchQuery;
  }

  const data = await getCatalogueList(query);

  return res.json(data);
};

export default handler;
