import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale } from "../../i18n/config";
import LocaleSync from "../../components/general/LocaleSync";
import Navbar from "../../components/general/Navbar";
import Footer from "../../components/general/Footer";

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
      icon: "/pictures/favicon.ico",
      apple: "/pictures/apple-touch-icon.png",
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
          url: `${siteUrl}/pictures/og-image.png`,
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
      images: [`${siteUrl}/pictures/og-image.png`],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <>
      <LocaleSync locale={locale as Locale} />
      <Navbar locale={locale as "en" | "ar"} />
      <main className="relative flex-1 container mx-auto pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
