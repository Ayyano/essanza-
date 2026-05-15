import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header, Footer, MobileNav } from "@/components/layout";
import { CartProvider } from "@/lib/store";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://essanza.pk"),
  title: {
    default: "ESSANZA — Premium Lifestyle Brand Pakistan | Women & Men Fashion",
    template: "%s | ESSANZA Pakistan",
  },
  description:
    "ESSANZA — Pakistan ka premium lifestyle brand. Shop Women Unstitched, Men Stitched, Kids Wear, Beauty, Home Essentials & more. Cash on Delivery. Har style ka apna ESSANZA.",
  keywords: [
    "ESSANZA", "Pakistani fashion brand", "women unstitched", "men stitched",
    "premium lifestyle Pakistan", "online shopping Pakistan", "COD Pakistan",
    "women clothing Pakistan", "men fashion", "kids wear", "beauty products",
    "home essentials", "Pakistan ecommerce store",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "ESSANZA Pakistan",
    title: "ESSANZA — Premium Lifestyle Brand Pakistan",
    description: "Har style ka apna ESSANZA. Premium fashion, beauty & lifestyle.",
    url: "https://essanza.pk",
  },
  twitter: {
    card: "summary_large_image",
    title: "ESSANZA — Premium Lifestyle Brand Pakistan",
    description: "Har style ka apna ESSANZA. Premium fashion, beauty & lifestyle.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_ID",
  },
  other: {
    "google-site-verification": "YOUR_GOOGLE_SEARCH_CONSOLE_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
        </CartProvider>
      </body>
    </html>
  );
}
