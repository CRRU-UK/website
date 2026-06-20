import type { GetServerSideProps, NextPage } from "next";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Filters, Loading } from "@/components";

import sitemap from "@/data/sitemap.json";

import { Catalogues } from "@/helpers/constants";
import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { CatalogueAPIResponse, PageData } from "@/helpers/types";
import CommonPage from "@/layout/CommonPage";

import styles from "./index.module.scss";

interface UpdateURLProps {
  catalogue: Catalogues;
  page: number;
  search: string;
}

const updateURL = ({ catalogue, page, search }: UpdateURLProps) => {
  let newURL: URL | string = new URL(location.toString());

  newURL.searchParams.set("catalogue", catalogue);
  newURL.searchParams.set("page", String(page));
  if (search !== "") {
    newURL.searchParams.set("search", search);
  }

  newURL = newURL.toString();
  history.replaceState({ ...globalThis.history.state, as: newURL, url: newURL }, "", newURL);
};

interface PageProps {
  pageData: PageData;
}

const Page: NextPage<PageProps> = ({ pageData }: PageProps) => {
  let initCatalogue = Catalogues.BottlenoseDolphin;
  let initPage = 1;
  let initSearch = "";

  const searchParams = useSearchParams();

  const paramCatalogue = searchParams.get("catalogue");
  if (paramCatalogue && Object.values<string>(Catalogues).includes(paramCatalogue)) {
    initCatalogue = paramCatalogue as Catalogues;
  }

  const paramPage = searchParams.get("page");
  if (paramPage) {
    initPage = Number.parseInt(paramPage, 10);
  }

  const paramSearch = searchParams.get("search");
  if (paramSearch) {
    initSearch = paramSearch;
  }

  const [catalogue, setCatalogue] = useState<Catalogues>(initCatalogue);
  const [page, setPage] = useState<number>(initPage);
  const [search, setSearch] = useState<string>(initSearch);
  const [searchText, setSearchText] = useState<typeof search>("");
  const [data, setData] = useState<null | CatalogueAPIResponse>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const query = [`page=${page}`];
      if (search !== "") {
        query.push(`search=${search}`);
      }

      const response = await fetch(`/api/catalogues/${catalogue}?${query.join("&")}`);
      const result: CatalogueAPIResponse = await response.json();
      setSearchText(search);
      setData(result);
      updateURL({ catalogue, page, search });

      setLoading(false);
    };

    const timeout = setTimeout(getData, 500);
    return () => clearTimeout(timeout);
  }, [catalogue, page, search]);

  const handleCatalogueChange = (value: string) => {
    setPage(1);
    setCatalogue(value as Catalogues);
  };

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  let pageElements = null;
  if (data && data.meta.totalPages > 1) {
    pageElements = [];
    for (let i = 0; i < data.meta.totalPages; i += 1) {
      pageElements.push(
        <li className={i + 1 === page ? styles["current-page"] : undefined} key={i}>
          <button onClick={() => setPage(i + 1)} type="button">
            {i + 1}
          </button>
        </li>,
      );
    }
  }

  let infoText = "";
  if (searchText !== "" && data?.items?.length === 0) {
    infoText = `No results for "${searchText}"`;
  } else if (searchText !== "" && data?.items) {
    infoText = `${data.meta.totalItems} ${data?.items.length > 1 ? "items" : "item"} found for "${searchText}" (page ${page} of ${data.meta.totalPages})`;
  } else if (data?.items) {
    infoText = `Page ${page} of ${data.meta.totalPages} (showing ${data.items.length} of ${data.meta.totalItems} items)`;
  }

  return (
    <CommonPage
      breadcrumbs={[sitemap.research, sitemap.catalogues]}
      data={pageData}
      page={sitemap.catalogues}
      parent={sitemap.research}
    >
      <br />

      <Filters
        dropdowns={[
          {
            name: "Catalogues",
            defaultValue: catalogue,
            options: [
              {
                text: "Bottlenose dolphins",
                value: Catalogues.BottlenoseDolphin,
              },
              { text: "Minke whales", value: Catalogues.MinkeWhale },
            ],
            callback: handleCatalogueChange,
          },
        ]}
        search={{
          callback: handleSearchChange,
          label: "Search name, ID, reference, birth year...",
          defaultValue: search,
        }}
      />

      <div className={loading ? styles.loading : ""}>
        {!!loading && <Loading type={catalogue} />}

        {!loading && infoText !== "" && <p className={styles.info}>{infoText}</p>}

        {!loading && data?.items && (
          <ul className={styles.list}>
            {data.items.map((item) => (
              <li key={item.id}>
                <Card
                  link={`/research/catalogues/${catalogue}/${item.slug}`}
                  name={item.name ?? undefined}
                  reference={item?.reference ? `#${item.reference}` : undefined}
                  title={item.id}
                  type={catalogue}
                />
              </li>
            ))}
          </ul>
        )}

        <ul className={styles.pagination}>{!loading && pageElements}</ul>
      </div>
    </CommonPage>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const pageData = await getPageContent(sitemap.catalogues.path, { preview });

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
      pageData,
    },
  };
};

export default Page;
