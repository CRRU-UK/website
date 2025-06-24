import type { NextPage, GetServerSideProps } from "next";
import type { ParsedUrlQuery } from "querystring";

import { useRouter } from "next/router";

import Link from "next/link";
import Image from "next/image";

import type { CatalogueBottlenoseDolphin } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import { Catalogues } from "@/helpers/constants";
import { formatDateMonth } from "@/helpers/formatDate";
import {
  getBottlenoseDolphinCatalogueItem,
  getBottlenoseDolphinItemEntrySlug,
} from "@/helpers/getCatalogue";
import { setPageCacheHeaders } from "@/helpers/setHeaders";

import { Breadcrumbs, SEO, Timeline, Tooltip, Tree, Toolbar } from "@/components";

import styles from "../[slug].module.scss";

const Unknown = () => (
  <span
    title="Catalogue data is not currently available for this entry and may be updated in the future."
    className={styles.unknown}
  >
    <span>Unknown</span>
  </span>
);

interface PageProps {
  catalogueData: CatalogueBottlenoseDolphin;
  ageText: string | null;
}

const Page: NextPage<PageProps> = ({ catalogueData, ageText }: PageProps) => {
  const {
    id,
    reference,
    name,
    slug,
    birthYear,
    sex,
    totalRecaptures,
    yearsRecaptured,
    totalCalves,
    leftDorsalFin,
    rightDorsalFin,
    otherImages,
    lastUpdated,
  } = catalogueData.entry;

  const title = name ? `#${id} (${name})` : `#${id}`;
  const pageDescription = `CRRU Bottlenose Dolphin catalogue entry for ${title}.`;
  const path = `/research/catalogues/${Catalogues.BottlenoseDolphin}/${slug}`;
  const image = otherImages?.[0] ?? leftDorsalFin ?? rightDorsalFin;
  const breadcrumbs = [
    sitemap.research,
    {
      title: sitemap.catalogues.title,
      path: `${sitemap.catalogues.path}?catalogue=${Catalogues.BottlenoseDolphin}`,
    },
    { title: `Bottlenose Dolphin: ${title}`, path },
  ];

  const noImage = <span className={styles["no-image"]}>No image</span>;

  const router = useRouter();

  return (
    <>
      <SEO
        page={{
          title: `${title} - Bottlenose Dolphin - ${sitemap.catalogues.title}`,
          description: pageDescription,
          path,
        }}
        breadcrumbs={breadcrumbs}
        images={
          image
            ? [
                {
                  url: image.url,
                  width: image.width,
                  height: image.height,
                },
              ]
            : undefined
        }
      />

      {/* key is needed to reset search state on navigation */}
      <Toolbar
        catalogue={Catalogues.BottlenoseDolphin}
        previous={catalogueData.previous}
        next={catalogueData.next}
        key={router.asPath}
      />

      <section className={styles.container}>
        <article className={styles.main}>
          <Breadcrumbs style="inline" items={breadcrumbs} />

          <div className={styles.wrapper}>
            <h2 className={styles["icon-dolphin"]}>Bottlenose Dolphin</h2>
            <h1>{title}</h1>

            <ul className={styles.info}>
              <li className={styles["info-item-crru"]}>
                <b>CRRU ID #</b>
                {id}
              </li>

              <li className={styles["info-item-aulfs"]}>
                <b>
                  AULFS Ref #{" "}
                  <Tooltip text="Aberdeen University Lighthouse Field Station catalogue reference" />
                </b>
                {reference ? (
                  <Link
                    href="https://www.abdn.ac.uk/sbs/outreach/lighthouse/research/bottlenose-dolphins/"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="external"
                  >
                    {reference}
                  </Link>
                ) : (
                  "-"
                )}
              </li>

              <li className={styles["info-item-name"]}>
                <b>Name</b>
                {name ?? <i className={styles.unknown}>Unnamed</i>}
              </li>

              <li className={styles["info-item-birth-year"]}>
                <b>Birth Year</b>
                {birthYear ?? <Unknown />}
              </li>

              <li className={styles["info-item-age"]}>
                <b>Age (Years)</b>
                {ageText ? String(ageText) : <Unknown />}
              </li>

              <li className={styles["info-item-sex"]}>
                <b>Sex</b>
                {sex === "Unknown" ? <Unknown /> : sex}
              </li>

              <li className={[styles["info-item-half"], styles["info-item-calves"]].join(" ")}>
                <b>No. of Known Calves</b>
                {sex !== "Female" ? (
                  <i className={styles.unknown}>N/A</i>
                ) : (
                  (totalCalves ?? <Unknown />)
                )}
              </li>

              <li
                className={[styles["info-item-half"], styles["info-item-total-recaptures"]].join(
                  " ",
                )}
              >
                <b>No. of Recaptures</b>
                {totalRecaptures ?? <Unknown />}
              </li>

              <li
                className={[styles["info-item-full"], styles["info-item-years-recaptured"]].join(
                  " ",
                )}
              >
                <b>Years Recaptured</b>
                {yearsRecaptured ? (
                  <Timeline items={yearsRecaptured} />
                ) : (
                  <i className={styles.unknown}>N/A</i>
                )}
              </li>

              <li
                className={[styles["info-item-half"], styles["info-item-dorsal-fin-left"]].join(
                  " ",
                )}
              >
                <b>Left Dorsal Fin</b>
                {leftDorsalFin ? (
                  <Image
                    src={leftDorsalFin.url}
                    width={leftDorsalFin.width}
                    height={leftDorsalFin.height}
                    alt="Left Dorsal Fin"
                    className={styles.image}
                  />
                ) : (
                  noImage
                )}
              </li>

              <li
                className={[styles["info-item-half"], styles["info-item-dorsal-fin-right"]].join(
                  " ",
                )}
              >
                <b>Right Dorsal Fin</b>
                {rightDorsalFin ? (
                  <Image
                    src={rightDorsalFin.url}
                    width={rightDorsalFin.width}
                    height={rightDorsalFin.height}
                    alt="Left Dorsal Fin"
                    className={styles.image}
                  />
                ) : (
                  noImage
                )}
              </li>

              {otherImages.length > 0 && (
                <li
                  className={[styles["info-item-full"], styles["info-item-other-images"]].join(" ")}
                >
                  <b>Other Images</b>
                  <ul>
                    {otherImages.map((item) => (
                      <li key={item.url}>
                        <Image
                          src={item.url}
                          width={item.width}
                          height={item.height}
                          alt={`General photo of ${name}`}
                          className={styles.image}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </article>

        <article className={styles.sidebar}>
          <Tree type={Catalogues.BottlenoseDolphin} data={catalogueData} />

          <Link
            href={`${sitemap.catalogues.path}?catalogue=${Catalogues.BottlenoseDolphin}`}
            className={styles.back}
          >
            Back to catalogue
          </Link>
        </article>
      </section>

      <p className={styles["last-updated"]}>Last updated: {formatDateMonth(lastUpdated)}</p>
    </>
  );
};

interface PageParams extends ParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const { slug } = ctx.params as PageParams;

  const catalogueData = await getBottlenoseDolphinCatalogueItem(slug);

  if (!catalogueData) {
    const [id] = slug.split("-");

    const newSlug = await getBottlenoseDolphinItemEntrySlug(id);
    if (newSlug) {
      return {
        redirect: {
          permanent: true,
          destination: `/research/catalogues/${Catalogues.BottlenoseDolphin}/${newSlug}`,
        },
      };
    }

    return { notFound: true };
  }

  const { birthYear } = catalogueData.entry;

  // Calculate age in server-side props to prevent rendering mismatch
  let ageNumber = null;
  if (birthYear !== null && !Number.isNaN(birthYear)) {
    ageNumber = new Date().getFullYear() - new Date(birthYear).getFullYear();
  }

  let ageText = null;
  if (ageNumber !== null) {
    ageText = ageNumber;

    if (ageNumber < 1) {
      ageText = "< 1";
    } else if (ageNumber > 25) {
      ageText = "25+";
    }

    ageText = String(ageText);
  }

  setPageCacheHeaders(ctx);

  return {
    props: {
      catalogueData,
      ageText,
    },
  };
};

export default Page;
