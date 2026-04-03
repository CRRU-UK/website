import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { generateDefaultSeo } from "next-seo/pages";

import "../scss/globals.scss";

import { DEFAULT_SEO_OPTIONS, LOCALE } from "@/helpers/constants";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";

const App = ({ Component, pageProps }: AppProps) => {
  const preview = pageProps.preview || false;

  return (
    <>
      <Head>
        {/* General */}
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1" name="viewport" />

        {/* Favicons */}
        <link href="/favicon.ico" rel="shortcut icon" />
        <link href="/apple-touch-icon.png?v2" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicon-96x96.png?v2" rel="icon" sizes="96x96" type="image/png" />
        <link href="/favicon-32x32.png?v2" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon-16x16.png?v2" rel="icon" sizes="16x16" type="image/png" />
        <meta content="CRRU" name="apple-mobile-web-app-title" />
        <link href="/site.webmanifest" rel="manifest" />
        <meta content="#000" name="theme-color" />

        {/* SEO */}
        {generateDefaultSeo(DEFAULT_SEO_OPTIONS)}
      </Head>

      <Header />

      <main>
        <ContentfulLivePreviewProvider
          enableInspectorMode={preview}
          enableLiveUpdates={preview}
          locale={LOCALE}
        >
          <Component {...pageProps} />
        </ContentfulLivePreviewProvider>
      </main>

      <Footer />
    </>
  );
};

export default App;
