import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Lead Intake",
  description: "Apollo Lead Intake",
  icons: {
    icon: [
      { url: "https://vamonos.digital/wp-content/uploads/2025/11/cropped-favicon-32x32.jpg", sizes: "32x32" },
      { url: "https://vamonos.digital/wp-content/uploads/2025/11/cropped-favicon-192x192.jpg", sizes: "192x192" },
    ],
    apple: "https://vamonos.digital/wp-content/uploads/2025/11/cropped-favicon-180x180.jpg",
  },
  other: {
    "msapplication-TileImage": "https://vamonos.digital/wp-content/uploads/2025/11/cropped-favicon-270x270.jpg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
