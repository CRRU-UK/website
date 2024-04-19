import type { NextPage } from 'next';

import Head from 'next/head';

const Page: NextPage = () => (
  <>
    <Head>
      <title>CRRU - Not Found</title>
    </Head>

    <article className="content">
      <h3>Not Found</h3>
      <p>The requested resource cannot be found (404).</p>
    </article>
  </>
);

export default Page;
