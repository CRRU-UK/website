import type { NextPage } from "next";

import Head from "next/head";

const Page: NextPage = () => (
  <>
    <Head>
      <title>CRRU - Error</title>
    </Head>

    <article className="content">
      <h2>Error</h2>
      <p>Internal Server Error (500).</p>
    </article>
  </>
);

export default Page;
