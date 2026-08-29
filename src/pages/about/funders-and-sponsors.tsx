import type { Asset } from "contentful";
import type { GetServerSideProps, NextPage } from "next";
import { ListItem } from "@/components";

import sitemap from "@/data/sitemap.json";

import { flattenImageAssetFields } from "@/helpers/flattenAssetFields";
import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { FlattenedImage, PageData } from "@/helpers/types";
import CommonPage from "@/layout/CommonPage";

type SponsorsDataReduced = {
  name: string;
  description: string;
  url: string;
  image: FlattenedImage;
  background?: FlattenedImage;
};

type TechnologySponsorsType = Array<{ name: string; url: string }>;

interface PageProps {
  pageData: PageData;
  sponsorsData: Array<SponsorsDataReduced> | null;
  technologySponsorsData: TechnologySponsorsType | null;
}

export const TechnologySponsorsList = ({ data }: { data: TechnologySponsorsType | null }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <>
      <hr />

      <p>
        Many thanks also to our technology partners and programmes which have provided support and
        grants towards the software and systems that drive much of our research work:
      </p>

      <ul>
        {data?.map(({ name, url }: { name: string; url: string }) => (
          <li key={name}>
            <a className="external" href={url} rel="noopener noreferrer" target="_blank">
              {name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export const SponsorsList = ({ data }: { data: Array<SponsorsDataReduced> | null }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return data.map((item) => (
    <ListItem
      description={item.description}
      image={item.image}
      key={item.name}
      link={item.url}
      title={item.name}
    />
  ));
};

const Page: NextPage<PageProps> = ({ pageData, sponsorsData, technologySponsorsData }) => (
  <CommonPage
    breadcrumbs={[sitemap.about, sitemap.sponsors]}
    data={pageData}
    page={sitemap.sponsors}
    parent={sitemap.about}
  >
    <SponsorsList data={sponsorsData} />
    <TechnologySponsorsList data={technologySponsorsData} />
  </CommonPage>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";

  const data = await getPageContent(sitemap.sponsors.path, {
    references: true,
    preview,
  });

  const { content, image, data: technologySponsors, background, description, references } = data;

  const technologySponsorsData = (technologySponsors as TechnologySponsorsType) ?? null;

  const sponsorsData =
    references?.map(({ fields }) => ({
      name: fields.name as string,
      url: fields.url as string,
      description: fields.description as string,
      image: flattenImageAssetFields(fields.image as Asset),
    })) ?? null;

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      pageData: {
        preview,
        content,
        image,
        background,
        description,
      },
      sponsorsData,
      technologySponsorsData,
    },
  };
};

export default Page;
