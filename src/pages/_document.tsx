import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html dir="ltr" lang="en-GB">
        <Head />
        <body>
          <div className="banner-30-years">Celebrating 30 years in conservation!</div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
