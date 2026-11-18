// Shared <head> values. Next needs an absolute base to expand relative paths
// into the canonical and og:/twitter: URLs that crawlers and link unfurlers
// (Slack, iMessage, X) require.
export const SITE_NAME = "Racing Thoughts Records";

export const SITE_URL = "https://www.racingthoughtsrecords.com";

export const SITE_DESCRIPTION =
  "The official store for music by Joshua Hamilton. Vinyl, CD, Cassette; Lil Darkie and more.";

// Shown when a page has no image of its own.
export const SITE_IMAGE = { url: "/images/og.jpg", alt: SITE_NAME };

// Metadata for a page that has nothing better to share than the site image.
// `title` is the bare page name; the root layout's template adds the brand.
// Open Graph does not inherit that template, so the brand is added by hand.
export function pageMetadata({ title, description, path }) {
  const shareTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: shareTitle,
      description,
      url: path,
      images: [SITE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [SITE_IMAGE],
    },
  };
}
