import type { ParsedUrlQuery } from "node:querystring";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Breadcrumbs, SEO, Timeline, Toolbar, Tooltip } from "@/components";

import sitemap from "@/data/sitemap.json";

import { Catalogues } from "@/helpers/constants";
import { formatDateMonth } from "@/helpers/formatDate";
import { getMinkeWhaleCatalogueItem, getMinkeWhaleItemEntrySlug } from "@/helpers/getCatalogue";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { CatalogueMinkeWhale } from "@/helpers/types";

import styles from "../[slug].module.scss";

const Unknown = () => (
  <span
    className={styles.unknown}
    title="Catalogue data is not currently available for this entry and may be updated in the future."
  >
    <span>Unknown</span>
  </span>
);

interface PageProps {
  catalogueData: CatalogueMinkeWhale;
}

const Page: NextPage<PageProps> = ({ catalogueData }: PageProps) => {
  const {
    id,
    reference,
    name,
    slug,
    totalRecaptures,
    yearsRecaptured,
    leftDorsalFin,
    rightDorsalFin,
    otherImages,
    lastUpdated,
  } = catalogueData.entry;

  const title = name ? `#${id} (${name})` : `#${id}`;
  const pageDescription = `CRRU Minke Whale catalogue entry for ${title}.`;
  const path = `/research/catalogues/${Catalogues.MinkeWhale}/${slug}`;
  const image = otherImages?.[0] ?? leftDorsalFin ?? rightDorsalFin;
  const breadcrumbs = [
    sitemap.research,
    {
      title: sitemap.catalogues.title,
      path: `${sitemap.catalogues.path}?catalogue=${Catalogues.MinkeWhale}`,
    },
    { title: `Minke Whale: ${title}`, path },
  ];

  const noImage = <span className={styles["no-image"]}>No image</span>;

  const router = useRouter();

  return (
    <>
      <SEO
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
        page={{
          title: `${title} - Minke Whale - ${sitemap.catalogues.title}`,
          description: pageDescription,
          path,
        }}
      />

      {/* key is needed to reset search state on navigation */}
      <Toolbar
        catalogue={Catalogues.MinkeWhale}
        key={router.asPath}
        next={catalogueData.next}
        previous={catalogueData.previous}
      />

      <section className={styles.container}>
        <article className={styles.main}>
          <Breadcrumbs items={breadcrumbs} style="inline" />

          <div className={styles.wrapper}>
            <h2 className={styles["icon-whale"]}>Minke Whale</h2>
            <h1>{title}</h1>

            <ul className={styles.info}>
              <li className={[styles["info-item-crru"]].join(" ")}>
                <b>CRRU ID #</b>
                {id}
              </li>

              {/* <li className={[styles["info-item-half"], styles["info-item-hwdt"]].join(" ")}>
                <b>
                  HWDT Ref #{" "}
                  <Tooltip text="Hebridean Whale and Dolphin Trust catalogue reference" />
                </b>
                {reference ? (
                  <Link
                    className="external"
                    href="https://hwdt.org/catalogue-minke-whale"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {reference}
                  </Link>
                ) : (
                  "-"
                )}
              </li> */}

              <li className={[styles["info-item-name"]].join(" ")}>
                <b>Name</b>
                {name ?? <i className={styles.unkn2own}>Unnamed</i>}
              </li>

              <li className={[styles["info-item-total-recaptures"]].join(" ")}>
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
                    alt="Left Dorsal Fin"
                    className={styles.image}
                    height={leftDorsalFin.height}
                    src={leftDorsalFin.url}
                    width={leftDorsalFin.width}
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
                    alt="Left Dorsal Fin"
                    className={styles.image}
                    height={rightDorsalFin.height}
                    src={rightDorsalFin.url}
                    width={rightDorsalFin.width}
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
                          alt={`General photo of ${name}`}
                          className={styles.image}
                          height={item.height}
                          src={item.url}
                          width={item.width}
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
          <p className={styles["no-data"]}>No family data available</p>

          <Link
            className={styles.back}
            href={`${sitemap.catalogues.path}?catalogue=${Catalogues.MinkeWhale}`}
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

  const catalogueData = await getMinkeWhaleCatalogueItem(slug);

  if (!catalogueData) {
    const [id] = slug.split("-");

    const newSlug = await getMinkeWhaleItemEntrySlug(id);
    if (newSlug) {
      return {
        redirect: {
          permanent: true,
          destination: `/research/catalogues/${Catalogues.MinkeWhale}/${newSlug}`,
        },
      };
    }

    return { notFound: true };
  }

  setPageCacheHeaders(ctx);

  return {
    props: {
      catalogueData,
    },
  };
};

export default Page;
