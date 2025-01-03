import type { AppProps } from "next/app";

import Head from "next/head";
import Script from "next/script";
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1"
        />

        {/* Favicons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v1"
        />
        <link rel="manifest" href="/site.webmanifest" />

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

      {/* Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'GA_MEASUREMENT_ID');
        `}
      </Script>
    </>
  );
};

export default App;
