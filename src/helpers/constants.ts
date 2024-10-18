// Defaults

export const DEFAULT_SITE_NAME = 'CRRU';

export const DEFAULT_SITE_DOMAIN = 'https://crru.org.uk';

export const DEFAULT_SITE_DESCRIPTION = 'The Cetacean Research & Rescue Unit (CRRU) is dedicated to the research, conservation and protection of cetaceans (whales, dolphins, and porpoises) in northeast Scotland.';

export const DEFAULT_SEO_OPTIONS = {
  twitter: {
    handle: '@CRRU',
    site: '@CRRU',
    cardType: 'summary_large_image',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: DEFAULT_SITE_DOMAIN,
    siteName: DEFAULT_SITE_NAME,
  },
};

export const DEFAULT_SEO_IMAGE = [{
  url: 'https://images.ctfassets.net/xe1w9sqtia79/6zrbOLcLyjChTaNt2DpO4S/761c5daf4bc9a577ceaeaf0c33a05072/Default_SEO_Image.jpg',
  width: 1200,
  height: 630,
}];

// General

export const PAYPAL_BUSINESS_ID = 'TDCEPPBXUZGMA';

export const AMAZON_REFERRAL_LINK = 'https://www.amazon.co.uk/exec/obidos/redirect-home?tag=cetaceresearr-21&site=amazon';

// Contentful

export const LOCALE = 'en-GB';

export enum ContentTypes {
  Homepage = 'homepage',
  PageContent = 'page',
  PageModule = 'pageModule',
  NewsArticle = 'newsArticle',
  SpeciesPage = 'speciesPage',
  ScientificPublication = 'scientificPublication',
  CatalogueBottlenoseDolphin = 'catalogueBottlenoseDolphin',
  CatalogueMinkeWhale = 'catalogueMinkeWhale',
  People = 'people',
  Sponsor = 'sponsor',
  UsefulLink = 'usefulLink',
}

export enum ScientificPublicationCategories {
  ResearchPaper = 'Research Paper',
  Report = 'Report',
  Conference = 'Conference',
  Thesis = 'Thesis',
}

export enum UsefulLinksCategories {
  WelfareGroups = 'Animal Welfare / Marine Conservation Groups',
  EnvironmentalJobs = 'Environmental Jobs',
  CetaceanOrganisations = 'International Cetacean Organisations',
  RescueGroups = 'Marine Mammal Rescue Groups',
  MarineSites = 'Other Miscellaneous Marine Sites',
  Photography = 'Photography Links',
  ConservationOrganisations = 'Scottish Conservation Organisations',
  ResearchOrganisations = 'UK-based Research Organisations',
}

export enum EmbeddedContentEntries {
  Gallery = 'pageComponentGallery',
  ImageRow = 'pageComponentImageRow',
  Highlight = 'pageComponentHighlight',
  Columns = 'pageComponentColumns',
  Video = 'pageComponentVideo',
  Module = 'pageModule',
  People = 'people',
  Sponsor = 'sponsor',
}

export enum InlineContentEntries {
  Page = ContentTypes.PageContent,
  Species = ContentTypes.SpeciesPage,
  News = ContentTypes.NewsArticle,
}

export enum Catalogues {
  BottlenoseDolphin = 'bottlenose-dolphin',
  MinkeWhale = 'minke-whale',
}

export const CATALOGUE_RESULTS_LIMIT = 30;
