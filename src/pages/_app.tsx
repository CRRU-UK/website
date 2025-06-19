import type { AppProps } from "next/app";

import Head from "next/head";
import { DefaultSeo } from "next-seo";

import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";

import "../scss/globals.scss";

import Header from "@/layout/Header";
import Footer from "@/layout/Footer";

import { DEFAULT_SEO_OPTIONS, LOCALE } from "@/helpers/constants";

const App = ({ Component, pageProps }: AppProps) => {
  const preview = pageProps.preview || false;

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
        <DefaultSeo {...DEFAULT_SEO_OPTIONS} />
      </Head>

      <Header />

      <main>
        <ContentfulLivePreviewProvider
          locale={LOCALE}
          enableInspectorMode={preview}
          enableLiveUpdates={preview}
        >
          <Component {...pageProps} />
        </ContentfulLivePreviewProvider>
      </main>

      <Footer />
    </>
  );
};

export default App;
