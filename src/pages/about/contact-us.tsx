import type { NextPage, GetServerSideProps } from "next";

import Link from "next/link";

import type { PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import getPageContent from "@/helpers/getPageContent";

import CommonPage from "@/layout/CommonPage";

interface PageProps {
  data: PageData;
}

const Page: NextPage<PageProps> = ({ data }) => (
  <CommonPage
    page={sitemap.contact}
    parent={sitemap.about}
    breadcrumbs={[sitemap.about, sitemap.contact]}
    data={data}
  >
    <p>
      <strong>Email:</strong> <Link href="mailto:info@crru.org.uk">info@crru.org.uk</Link>
    </p>

    <p>
      <strong>Telephone:</strong> <Link href="tel:+4401261851696">01261 851696</Link>
    </p>

    <p>
      <strong>Address:</strong>
    </p>

    <address>
      Cetacean Research & Rescue Unit (CRRU) <br />
      48 Seatown <br />
      Gardenstown <br />
      Banff AB45 3YQ <br />
      SCOTLAND, UK
    </address>

    <iframe
      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d278169.044684232!2d-2.5250101080536194!3d57.60332544890578!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4884f42b36bcf065%3A0xd89a7ef7e95f9f41!2sCetacean%20Research%20%26%20Rescue%20Unit!5e0!3m2!1sen!2suk!4v1682264934086!5m2!1sen!2suk"
      width="600"
      height="450"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Map"
    />
  </CommonPage>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const data = await getPageContent(sitemap.contact.path, { preview });

  return {
    props: {
      preview,
      data,
    },
  };
};

export default Page;
