import type { Entry, EntryFieldTypes } from 'contentful';
import type { Document } from '@contentful/rich-text-types';

import { ContentTypes } from './constants';

// General

export type SitemapItem = {
  title: string,
  description?: string,
  path: string,
};

export type FlattenedImage = {
  url: string,
  width: number,
  height: number,
  alt: string | null,
};

export type FlattenedVideo = {
  url: string,
  type: string,
};

export type PageData = {
  id?: string,
  content: Document | null,
  description: string | null,
  image: FlattenedImage | null,
  background: FlattenedImage | null,
  references?: Array<Entry> | null,
};

export type PageModule = {
  content: Document,
  data: Object | null,
};

export type NewsArticle = {
  title: string,
  slug: string,
  date: string,
  category: string,
  keywords: Array<string>,
  content: Document,
  description: string,
  image: FlattenedImage,
};

export type SpeciesEntry = {
  name: string,
  slug: string,
  order: string,
  suborder: string,
  family: string,
  subfamily: string | null,
  genus: string,
  species: string,
  content: Document,
  description: string,
  image: FlattenedImage,
};

// Simplified references used in API responses and the `<Catalogue />` component
export type CatalogueBottlenoseDolphinBasicInfo = {
  id: string,
  name: string | null,
  slug: string,
};

export type CatalogueBottlenoseDolphinListAPIResponse = {
  meta: {
    pageSize: number,
    currentPage: number,
    totalPages: number,
    totalItems: number,
  },
  items: Array<CatalogueBottlenoseDolphinBasicInfo>,
};

export type CatalogueBottlenoseDolphin = {
  entry: {
    id: string,
    auid: string | null,
    name: string | null,
    slug: string,
    description: string | null,
    firstSeen: string | null,
    birthYear: string | null,
    age: number | null,
    sex: 'UNKNOWN' | 'FEMALE' | 'MALE',
    leftDorsalFin: FlattenedImage | null,
    rightDorsalFin: FlattenedImage | null,
    otherImages: Array<FlattenedImage> | [],
    lastUpdated: string,
  },
  mother: CatalogueBottlenoseDolphinBasicInfo | null,
  calves: Array<CatalogueBottlenoseDolphinBasicInfo> | [],
};

// Contentful Content Models

export type ContentTypeHomepage = {
  contentTypeId: ContentTypes.Homepage,
  fields: {
    name: EntryFieldTypes.Symbol,
    heroVideos: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>,
    heroImage: EntryFieldTypes.AssetLink,
    highlightLeftTitle: EntryFieldTypes.Symbol,
    highlightLeftSubtitle: EntryFieldTypes.Symbol,
    highlightLeftImage: EntryFieldTypes.AssetLink,
    highlightLeftLink: EntryFieldTypes.EntryLink<ContentTypeNews | ContentTypePageContent | ContentTypeSpeciesPage>,
    highlightRightTitle: EntryFieldTypes.Symbol,
    highlightRightSubtitle: EntryFieldTypes.Symbol,
    highlightRightImage: EntryFieldTypes.AssetLink,
    highlightRightLink: EntryFieldTypes.EntryLink<ContentTypeNews | ContentTypePageContent | ContentTypeSpeciesPage>,
  },
};

export type ContentTypeNews = {
  contentTypeId: ContentTypes.NewsArticle,
  fields: {
    title: EntryFieldTypes.Symbol,
    slug: EntryFieldTypes.Symbol,
    date: EntryFieldTypes.Date,
    category: EntryFieldTypes.Symbol,
    keywords: EntryFieldTypes.Array<EntryFieldTypes.Symbol>,
    content: EntryFieldTypes.RichText,
    description: EntryFieldTypes.Symbol,
    image: EntryFieldTypes.AssetLink,
  },
};

export type ContentTypePageContent = {
  contentTypeId: ContentTypes.PageContent,
  fields: {
    name: EntryFieldTypes.Symbol,
    path: EntryFieldTypes.Symbol,
    content: EntryFieldTypes.RichText,
    references?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentTypePerson | ContentTypeSponsor | ContentTypeUsefulLink>>,
    description?: EntryFieldTypes.Symbol,
    image?: EntryFieldTypes.AssetLink,
    background?: EntryFieldTypes.AssetLink,
  },
};

export type ContentTypePageModule = {
  contentTypeId: ContentTypes.PageModule,
  fields: {
    name: EntryFieldTypes.Symbol,
    id: EntryFieldTypes.Symbol,
    content: EntryFieldTypes.RichText,
    data: EntryFieldTypes.Object,
  },
};

export type ContentTypeScientificPublication = {
  contentTypeId: ContentTypes.ScientificPublication,
  fields: {
    title: EntryFieldTypes.Symbol,
    description: EntryFieldTypes.Text,
    category: EntryFieldTypes.Symbol,
    date: EntryFieldTypes.Date,
    attachment: EntryFieldTypes.AssetLink,
  },
};

export type ContentTypePerson = {
  contentTypeId: ContentTypes.People,
  fields: {
    name: EntryFieldTypes.Symbol,
    title: EntryFieldTypes.Symbol,
    qualifications: EntryFieldTypes.Array<EntryFieldTypes.Symbol>,
    description: EntryFieldTypes.Symbol,
    image: EntryFieldTypes.AssetLink,
  },
};

export type ContentTypeSponsor = {
  contentTypeId: ContentTypes.Sponsor,
  fields: {
    name: EntryFieldTypes.Symbol,
    url: EntryFieldTypes.Symbol,
    description: EntryFieldTypes.Text,
    image: EntryFieldTypes.AssetLink,
  },
};

export type ContentTypeSpeciesArchive = {
  contentTypeId: ContentTypes.SpeciesArchive,
  fields: {
    id: EntryFieldTypes.Number,
    name: EntryFieldTypes.Symbol,
    species: EntryFieldTypes.Symbol,
    image: EntryFieldTypes.AssetLink,
  },
};

export type ContentTypeSpeciesPage = {
  contentTypeId: ContentTypes.SpeciesPage,
  fields: {
    name: EntryFieldTypes.Symbol,
    slug: EntryFieldTypes.Symbol,
    order: EntryFieldTypes.Symbol,
    suborder: EntryFieldTypes.Symbol,
    family: EntryFieldTypes.Symbol,
    subfamily?: EntryFieldTypes.Symbol,
    genus: EntryFieldTypes.Symbol,
    species: EntryFieldTypes.Symbol,
    content: EntryFieldTypes.RichText,
    description: EntryFieldTypes.Symbol,
    image: EntryFieldTypes.AssetLink,
  },
};

export type ContentTypeUsefulLink = {
  contentTypeId: ContentTypes.UsefulLink,
  fields: {
    title: EntryFieldTypes.Symbol,
    url: EntryFieldTypes.Symbol,
    category: EntryFieldTypes.Symbol,
    description?: EntryFieldTypes.Text,
    image?: EntryFieldTypes.AssetLink,
  },
};

export type ContentTypeCatalogueBottlenoseDolphin = {
  contentTypeId: ContentTypes.CatalogueBottlenoseDolphin,
  fields: {
    id: EntryFieldTypes.Symbol,
    auid?: EntryFieldTypes.Symbol,
    name?: EntryFieldTypes.Symbol,
    slug: EntryFieldTypes.Symbol,
    description?: EntryFieldTypes.Symbol,
    firstSeen?: EntryFieldTypes.Date,
    birthYear?: EntryFieldTypes.Date,
    age?: EntryFieldTypes.Integer,
    sex: EntryFieldTypes.Symbol<'Unknown' | 'Female' | 'Male'>,
    mother?: EntryFieldTypes.EntryLink<ContentTypeCatalogueBottlenoseDolphin>,
    leftDorsalFin?: EntryFieldTypes.AssetLink,
    rightDorsalFin?: EntryFieldTypes.AssetLink,
    otherImages?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>,
  },
};
