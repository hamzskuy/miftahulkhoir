import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteName = "Masjid Miftahul Khoir";
const description =
  "Website resmi Masjid Miftahul Khoir. Informasi kegiatan, galeri, berita, dan program donasi.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://masjidmiftahulkhoir.example.com",
  ),
  title: {
    default: `${siteName} — Website Resmi`,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: ["masjid", "Miftahul Khoir", "kegiatan", "donasi", "galeri", "berita"],
  authors: [{ name: siteName }],
  creator: siteName,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName,
    title: `${siteName} — Website Resmi`,
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Website Resmi`,
    description,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#166534",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className="">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-[#0f1f14] antialiased">
        {children}
      </body>
    </html>
  );
}
