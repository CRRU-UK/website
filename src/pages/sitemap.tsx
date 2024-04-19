import type { NextPage, GetServerSideProps } from 'next';

import Link from 'next/link';

import type { PageData, SitemapItem } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import getPageContent from '@/helpers/getPageContent';
import getSpecies from '@/helpers/getSpecies';

import CommonPage from '@/layout/CommonPage';

const ListItem = ({ item }: { item: SitemapItem }) => (
  <Link href={item.path}>
    {item.title}
  </Link>
);

type SpeciesDataReduced = {
  name: string,
  slug: string,
};

interface PageProps {
  pageData: PageData,
  speciesData: Array<SpeciesDataReduced>,
}

const Page: NextPage<PageProps> = ({
  pageData,
  speciesData,
}: PageProps) => (
  <CommonPage
    page={sitemap.sitemap}
    breadcrumbs={[sitemap.sitemap]}
    data={pageData}
  >
    <ul>
      <li><ListItem item={sitemap.home} /></li>
      <li>
        <ListItem item={sitemap.about} />
        <ul>
          <li><ListItem item={sitemap['meet-the-team']} /></li>
          <li><ListItem item={sitemap.sponsors} /></li>
          <li><ListItem item={sitemap['useful-links']} /></li>
          <li><ListItem item={sitemap.contact} /></li>
        </ul>
      </li>
      <li>
        <ListItem item={sitemap.research} />
        <ul>
          <li><ListItem item={sitemap['bottlenose-dolphin-studies']} /></li>
          <li><ListItem item={sitemap['bottlenose-dolphin-archive']} /></li>
          <li><ListItem item={sitemap['minke-whale-studies']} /></li>
          <li><ListItem item={sitemap['environmental-mitigation']} /></li>
          <li><ListItem item={sitemap.publications} /></li>
          <li><ListItem item={sitemap.collaborators} /></li>
        </ul>
      </li>
      <li>
        <ListItem item={sitemap.rescue} />
        <ul>
          <li><ListItem item={sitemap.stranded} /></li>
          <li><ListItem item={sitemap['rescue-training']} /></li>
          <li><ListItem item={sitemap['species-identification-key']} /></li>
        </ul>
      </li>
      <li>
        <ListItem item={sitemap.education} />
        <ul>
          <li><ListItem item={sitemap['school-visits']} /></li>
          <li><ListItem item={sitemap['events-and-talks']} /></li>
          <li><ListItem item={sitemap['stands-and-exhibits']} /></li>
          <li><ListItem item={sitemap['cetacean-fact-files']} /></li>
          <ul>
            {speciesData.map(({ name, slug }) => (
              <li key="slug">
                <ListItem item={{ title: name, path: `/education/species/${slug}` }} />
              </li>
            ))}
          </ul>
        </ul>
      </li>
      <li>
        <ListItem item={sitemap.training} />
        <ul>
          <li><ListItem item={sitemap['summer-training-placements']} /></li>
          <li><ListItem item={sitemap['mmo-training']} /></li>
          <li><ListItem item={sitemap['pam-training']} /></li>
          <li><ListItem item={sitemap['gain-university-credits']} /></li>
        </ul>
      </li>
      <li>
        <ListItem item={sitemap.help} />
        <ul>
          <li><ListItem item={sitemap.sightings} /></li>
          <li><ListItem item={sitemap['fundraising-support']} /></li>
          <li><ListItem item={sitemap['become-a-friend']} /></li>
          <li><ListItem item={sitemap.bequests} /></li>
        </ul>
      </li>
      <li>
        <ListItem item={sitemap.news} />
      </li>
      <li><ListItem item={sitemap.terms} /></li>
      <li><ListItem item={sitemap.credits} /></li>
      <li><ListItem item={sitemap.sitemap} /></li>
    </ul>
  </CommonPage>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === 'true';
  const [pageData, speciesData] = await Promise.all([
    getPageContent(sitemap.sitemap.path, { preview: preview }),
    getSpecies(),
  ]);

  return {
    props: {
      preview,
      pageData,
      speciesData,
    },
  };
};

export default Page;
