import type { NextPage, GetServerSideProps } from 'next';
import type { MouseEventHandler } from 'react';
import type { Asset } from 'contentful';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import type { PageData, FlattenedImage, ContentTypeSpeciesArchive } from '@/helpers/types';

import sitemap from '@/data/sitemap.json';

import getPageContent from '@/helpers/getPageContent';
import { ContentTypes, PhotoArchiveSpecies } from '@/helpers/constants';
import { flattenImageAssetFields } from '@/helpers/flattenAssetFields';
import { contentfulDeliveryClient } from '@/helpers/contentful';

import CommonPage from '@/layout/CommonPage';
import { Filters } from '@/components/index';

import styles from './bottlenose-archive.module.scss';

type ArchiveDataReduced = {
  id: string | null,
  name: string | null,
  image: FlattenedImage,
};

interface ZoomProps {
  callbackPrevious: MouseEventHandler,
  callbackNext: MouseEventHandler,
  callbackClose: Function,
  item: ArchiveDataReduced,
  showControls: boolean,
}

const Zoom = ({
  callbackPrevious,
  callbackNext,
  callbackClose,
  item,
  showControls,
}: ZoomProps) => (
  <div className={styles.zoom}>
    <button
      type="button"
      title="Close"
      aria-label="Close"
      className={styles['zoom-close']}
      tabIndex={0}
      onClick={() => callbackClose(false)}
      onKeyDown={() => {}}
    />
    {showControls && (
      <button
        type="button"
        title="Previous"
        aria-label="Previous"
        className={styles['zoom-previous']}
        tabIndex={0}
        onClick={callbackPrevious}
        onKeyDown={() => {}}
      />
    )}
    {showControls && (
      <button
        type="button"
        title="Next"
        aria-label="Next"
        className={styles['zoom-next']}
        tabIndex={0}
        onClick={callbackNext}
        onKeyDown={() => {}}
      />
    )}
    <div className={styles['zoom-image-container']}>
      <Image
        src={item.image.url}
        width={item.image.width}
        height={item.image.height}
        alt={item.name ?? ''}
        title={item.name ?? ''}
        className={styles['zoom-image']}
        style={{ maxWidth: item.image.width, maxHeight: item.image.height }}
      />
    </div>
  </div>
);

interface PageProps {
  pageData: PageData,
  archiveData: Array<ArchiveDataReduced>,
}

const Page: NextPage<PageProps> = ({
  pageData,
  archiveData,
}) => {
  const [search, setSearch] = useState<string>('');
  const [zoomIndex, setZoomIndex] = useState<number>(0);
  const [zoomOpen, setZoomOpen] = useState<boolean>(false);

  const filteredData = archiveData.filter((item) => {
    if (search === '') return item;
    const searchText = search.toLowerCase();
    return ([item.id, item.name].join('')).toLowerCase().includes(searchText);
  });

  const zoomImage = filteredData[zoomIndex];

  useEffect(() => {
    document.body.classList.toggle('no-scroll', zoomOpen);
  }, [zoomOpen]);

  const handleZoom = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setZoomIndex(index);
    setZoomOpen(true);
  };

  const handlePrevious = () => {
    let newIndex = zoomIndex - 1;

    if (newIndex < 0) {
      newIndex = filteredData.length - 1;
    }

    return setZoomIndex(newIndex);
  };

  const handleNext = () => {
    let newIndex = zoomIndex + 1;

    if (newIndex > filteredData.length - 1) {
      newIndex = 0;
    }

    return setZoomIndex(newIndex);
  };

  return (
    <CommonPage
      page={sitemap['bottlenose-dolphin-archive']}
      parent={sitemap.research}
      breadcrumbs={[sitemap.research, sitemap['bottlenose-dolphin-archive']]}
      data={pageData}
    >
      <br />

      <Filters onSearch={setSearch} />

      <div className={styles.info}>
        Showing {filteredData.length} records
      </div>

      <div className={styles.grid}>
        {filteredData.length ? filteredData.map((item, index) => (
          <Link
            href={item.image.url}
            onClick={(event) => handleZoom(event, index)}
            className={styles.item}
            key={item.id}
          >
            <span className={styles.icon} />
            <Image
              src={item.image.url}
              width={300}
              height={300}
              alt={item.name ?? ''}
              title={item.name ?? ''}
              className={styles.image}
            />
          </Link>
        )) : <p>No results for &quot;{search}&quot;</p>}
      </div>

      {zoomOpen ? (
        <Zoom
          callbackPrevious={handlePrevious}
          callbackNext={handleNext}
          callbackClose={setZoomOpen}
          item={zoomImage}
          showControls={filteredData.length > 1}
        />
      ) : <></>}
    </CommonPage>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === 'true';
  const pageData = await getPageContent(sitemap['bottlenose-dolphin-archive'].path, { preview });

  const archiveData = await contentfulDeliveryClient.getEntries<ContentTypeSpeciesArchive>({
    content_type: ContentTypes.SpeciesArchive,
    order: ['fields.id'],
    'fields.species': PhotoArchiveSpecies.BottlenoseDolphin,
    limit: 1000,
  });

  return {
    props: {
      preview,
      pageData,
      archiveData: archiveData.items.map(({ fields }) => ({
        id: String(fields.id).padStart(3, '0') ?? null,
        name: fields.name ?? null,
        image: flattenImageAssetFields(fields.image as Asset),
      })),
    },
  };
};

export default Page;
