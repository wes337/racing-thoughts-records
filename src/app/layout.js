import "./globals.css";
import {
  SITE_DESCRIPTION,
  SITE_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/metadata";

// Site-wide defaults. Pages set a bare `title` and the template adds the brand.
export const metadata = {
  // Absolute base for canonical and share URLs; pages hand Next relative
  // paths and it expands them against this.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Vinyl, CDs & Cassettes`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "lil darkie",
    "joshua hamilton",
    "vinyl",
    "cd",
    "cassette",
    "music",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_IMAGE],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
