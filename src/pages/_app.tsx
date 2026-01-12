import type { AppProps } from "next/app";

import { generateDefaultSeo } from "next-seo/pages";
import Head from "next/head";

import "../scss/globals.scss";

import Footer from "@/layout/Footer";
import Header from "@/layout/Header";

import { DEFAULT_SEO_OPTIONS } from "@/helpers/constants";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        {/* General */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />

        {/* Favicons */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v2" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v2" />
        <meta name="apple-mobile-web-app-title" content="CRRU" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000" />

        {/* SEO */}
        {generateDefaultSeo(DEFAULT_SEO_OPTIONS)}
      </Head>

      <Header />

      <main>
        <Component {...pageProps} />
      </main>

      <Footer />
    </>
  );
};

export default App;
