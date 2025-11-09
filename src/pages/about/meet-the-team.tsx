import type { Asset } from "contentful";
import type { GetServerSideProps, NextPage } from "next";

import Image from "next/image";

import type { FlattenedImage, PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import { flattenImageAssetFields } from "@/helpers/flattenAssetFields";
import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";

import CommonPage from "@/layout/CommonPage";

import styles from "./meet-the-team.module.scss";

type PersonDataReduced = {
  name: string;
  title: string;
  qualifications: Array<string>;
  description: string;
  image: FlattenedImage;
  background?: FlattenedImage;
};

const renderPerson = (data: PersonDataReduced) => (
  <section className={styles.item} key={data.name}>
    <div className={styles.left}>
      <Image
        src={data.image.url}
        width={data.image.width}
        height={data.image.height}
        alt={`Photo of ${data.name}.`}
        className={styles.image}
      />
    </div>

    <div className={styles.right}>
      <h3 className={styles.name}>{data.name}</h3>
      <h4 className={styles.title}>{data.title}</h4>
      {!!data?.qualifications?.length && (
        <p className={styles["qualifications-list"]}>
          {data.qualifications.map((item: string) => (
            <span className={styles.qualification} key={item}>
              {item}
            </span>
          ))}
        </p>
      )}
      <p className={styles.description}>{data.description}</p>
    </div>
  </section>
);

interface PageProps {
  pageData: PageData;
  personData: Array<PersonDataReduced> | null;
}

const Page: NextPage<PageProps> = ({ pageData, personData }) => (
  <CommonPage
    page={sitemap["meet-the-team"]}
    parent={sitemap.about}
    breadcrumbs={[sitemap.about, sitemap["meet-the-team"]]}
    data={pageData}
  >
    {personData ? personData.map((item) => renderPerson(item)) : undefined}
  </CommonPage>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const data = await getPageContent(sitemap["meet-the-team"].path, {
    preview,
    references: true,
  });

  const { content, image, background, description, references } = data;

  const personData =
    references?.map(({ fields }) => ({
      name: fields.name as string,
      title: fields.title as string,
      qualifications: (fields.qualifications as Array<string>) ?? null,
      description: fields.description as string,
      image: flattenImageAssetFields(fields.image as Asset),
    })) ?? null;

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
      pageData: {
        content,
        image,
        background,
        description,
      },
      personData,
    },
  };
};

export default Page;
