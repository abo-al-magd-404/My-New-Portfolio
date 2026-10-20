// 1. IMPORTS
import type { Metadata, Viewport } from "next";
import { Audiowide, Tajawal, Geist_Mono } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { locales, type Locale } from "../../i18n/config";
import Background from "@/components/general/Background";
import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";
import ThemeProvider from "@/components/providers/ThemeProvider";

// 2. FONT CONFIGURATION
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

// 3. METADATA
type MetadataProps = {
  params: Promise<{ locale: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
}

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const isArabic = locale === "ar";

  const title = isArabic
    ? "محمد محمود أبو المجد | مطور تطبيقات ويب كاملة"
    : "Mohamed Mahmoud Abo al magd | Full-Stack Developer";

  const description = isArabic
    ? "الموقع الشخصي لمحمد محمود أبو المجد، مطور Full-Stack متخصص في MERN Stack وNext.js. اكتشف رحلته في البرمجة ومشاريعه ومهاراته وخبراته في تطوير الواجهات الأمامية والخلفية وقواعد البيانات وهندسة البرمجيات."
    : "Explore Mohamed Mahmoud Abo al magd's programming journey, projects, technical skills, and experience as a Full-Stack Developer specializing in MERN Stack, React, Next.js, Node.js, and MongoDB. Discover his work in frontend development, backend development, web development, UI/UX design, and software engineering.";

  const keywords = [
    // Personal Identity — English
    "Mohamed Mahmoud Abo al magd",
    "Mohamed Abo al magd",
    "Mohamed Mahmoud",
    "Abo al magd",
    "Aboalmagd",

    // Personal Identity — Arabic
    "محمد محمود أبو المجد",
    "محمد أبو المجد",
    "محمد محمود",
    "أبو المجد",
    "ابو المجد",

    // Professional Roles
    "Full-Stack Developer",
    "Full Stack Developer",
    "Software Developer",
    "Software Engineer",
    "Web Developer",
    "MERN Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "JavaScript Developer",

    // Markup & Styling
    "HTML",
    "HTML5",
    "CSS",
    "CSS3",
    "Sass",
    "SCSS",
    "Tailwind CSS",
    "Bootstrap",
    "Responsive Web Design",
    "تصميم واجهات الويب",

    // Programming Languages
    "JavaScript",
    "TypeScript",
    "ES6+",

    // Frontend Technologies
    "React",
    "React.js",
    "Next.js",
    "Frontend Development",
    "Component-Based Architecture",
    "تطوير الواجهات الأمامية",

    // Backend & APIs
    "Backend Development",
    "REST API",
    "API Development",
    "Server-Side Development",
    "تطوير الواجهات الخلفية",

    // Databases & ORMs
    "MongoDB",
    "Mongoose",
    "MySQL",
    "Sequelize",
    "SQL",
    "NoSQL",
    "Database Design",
    "Database Development",
    "Data Modeling",
    "تصميم قواعد البيانات",

    // Software Engineering
    "Software Development",
    "Web Application Development",
    "Full-Stack Web Development",
    "Clean Code",
    "Software Architecture",
    "Problem Solving",
    "Git",
    "GitHub",

    // Professional Skills
    "Team Collaboration",
    "Project Planning",
    "Technical Problem Solving",

    // Arabic Professional Terms
    "مطور ويب",
    "مطور ويب متكامل",
    "مطور فل ستاك",
    "مطور فول ستاك",
    "مطور MERN Stack",
    "مطور واجهات أمامية",
    "مطور واجهات خلفية",
    "مهندس برمجيات",
    "مبرمج",
    "تطوير الويب",
    "تطوير تطبيقات الويب",
    "تصميم واجهات المستخدم",
    "محمد محمود أبو المجد مطور ويب",
  ];

  return {
    metadataBase: new URL(siteUrl!),
    applicationName: "Mohamed Mahmoud Abo al magd",

    title: {
      absolute: title,
    },

    description,
    keywords,

    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },

    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
      },
    },

    openGraph: {
      type: "website",
      url: `${siteUrl}/${locale}`,
      siteName: "Mohamed Mahmoud Abo al magd",
      title,
      description,
      locale: isArabic ? "ar_EG" : "en_US",
      alternateLocale: isArabic ? ["en_US"] : ["ar_EG"],
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/og-image.png`],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

// 4. VIEWPORT
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#f7f5ef",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#000000",
    },
  ],
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

// 5. ROOT LAYOUT PROPS
type RootLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

// 6. ROOT LAYOUT COMPONENT
export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={[
        "min-h-full",
        "antialiased",
        audiowide.variable,
        tajawal.variable,
        geistMono.variable,
      ].join(" ")}
    >
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <Background />
          <Navbar />
          <main className="relative z-100 flex-1 container mx-auto px-4 sm:px-5">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
