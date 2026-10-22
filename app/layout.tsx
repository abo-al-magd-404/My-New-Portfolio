import type { Metadata, Viewport } from "next";
import { Audiowide, Tajawal, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "../components/general/CustomCursor";
import ServiceWorkerRegistration from "../components/general/ServiceWorkerRegistration";
import ThemeProvider from "../components/providers/ThemeProvider";
import Background from "../components/general/Background";

const audiowide = Audiowide({
  variable: "--font-audiowide",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
};

const localeBootScript = `(function(){try{var l=location.pathname.split("/")[1];if(l==="ar"||l==="en"){var d=document.documentElement;d.lang=l;d.dir=l==="ar"?"rtl":"ltr";}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={[
        "min-h-full",
        "antialiased",
        audiowide.variable,
        tajawal.variable,
        geistMono.variable,
      ].join(" ")}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeBootScript }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <ServiceWorkerRegistration />
        <CustomCursor />
        <ThemeProvider>
          <Background />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
