import type { Metadata } from "next";
import type { Locale } from "../i18n/config";

export type PageKey =
  | "home"
  | "about"
  | "education"
  | "projects"
  | "experience"
  | "contact";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
}

const siteName = "Mohamed Mahmoud Abo al magd";
const socialImage = "/pictures/og-image.png";

type PageMetadataContent = {
  title: string;
  description: string;
  keywords: string[];
  category: string;
  classification: string;
  imageAlt: string;
};

const pages = {
  en: {
    home: {
      title: `${siteName} | Full-Stack Developer`,
      description:
        "Explore the portfolio of Mohamed Mahmoud Abo al magd, a full-stack web developer focused on the MERN stack and Next.js. Discover his approach to frontend and backend development, selected projects, education, professional experience, and ways to get in touch.",
      keywords: [
        "Mohamed Mahmoud Abo al magd portfolio",
        "personal portfolio of a web developer",
        "full-stack web developer portfolio",
        "MERN stack developer portfolio",
        "Next.js developer portfolio",
        "React and Node.js developer",
        "MongoDB Express React Node.js",
        "frontend and backend developer",
        "web application development portfolio",
        "software engineering portfolio",
        "JavaScript web developer",
        "TypeScript application developer",
        "responsive web development",
        "Egyptian full-stack developer",
        "bilingual Arabic English developer portfolio",
      ],
      category: "Web development portfolio",
      classification: "Personal developer portfolio and professional profile",
      imageAlt:
        "Mohamed Mahmoud Abo al magd's full-stack web developer portfolio",
    },
    about: {
      title: `About ${siteName} | Full-Stack Developer`,
      description:
        "Get to know Mohamed Mahmoud Abo al magd: his path from learning frontend development to building full-stack web applications, the technologies he works with, and the principles he values, including clear architecture, careful implementation, and reliable user experiences.",
      keywords: [
        "about Mohamed Mahmoud Abo al magd",
        "Mohamed Abo al magd developer biography",
        "full-stack developer personal story",
        "web developer career journey",
        "how I became a full-stack developer",
        "frontend to backend development journey",
        "developer values and engineering approach",
        "clean code and modular software design",
        "building reliable web products",
        "user-focused web application development",
        "MERN stack engineering background",
        "Next.js developer profile",
        "JavaScript developer introduction",
        "software problem-solving approach",
        "personal story of a software developer",
      ],
      category: "Developer biography",
      classification: "About page and professional developer profile",
      imageAlt:
        "About Mohamed Mahmoud Abo al magd and his full-stack development journey",
    },
    education: {
      title: `${siteName} | Education`,
      description:
        "Explore Mohamed Mahmoud Abo al magd's education and ongoing learning in software development. This page focuses on the knowledge and skills behind his work, including web technologies, programming fundamentals, application development, databases, and software engineering.",
      keywords: [
        "Mohamed Mahmoud Abo al magd education",
        "software developer education background",
        "web development learning path",
        "programming skills development",
        "computer science and software learning",
        "JavaScript and TypeScript studies",
        "React and Next.js learning",
        "Node.js backend development learning",
        "MongoDB database learning",
        "frontend development skills",
        "backend programming fundamentals",
        "software engineering knowledge",
        "independent technology study",
        "continuous learning in software development",
        "technical education and developer skills",
      ],
      category: "Education and professional learning",
      classification: "Developer education, learning, and technical skills",
      imageAlt:
        "Education and ongoing software development learning of Mohamed Mahmoud Abo al magd",
    },
    projects: {
      title: `${siteName} | Projects`,
      description:
        "Browse selected web development projects by Mohamed Mahmoud Abo al magd. Explore application interfaces, full-stack implementation, frontend experiences, backend functionality, and practical use of technologies such as React, Next.js, Node.js, and MongoDB.",
      keywords: [
        "Mohamed Mahmoud Abo al magd projects",
        "full-stack web application examples",
        "MERN stack application projects",
        "Next.js website projects",
        "React frontend portfolio projects",
        "Node.js backend application examples",
        "MongoDB powered web applications",
        "responsive website implementation",
        "interactive user interface projects",
        "REST API application development",
        "end-to-end web product development",
        "personal software project showcase",
        "modern JavaScript application portfolio",
        "web interface and UX implementation",
        "production-minded software projects",
      ],
      category: "Software development projects",
      classification: "Selected web applications and development work",
      imageAlt:
        "Selected web development projects by Mohamed Mahmoud Abo al magd",
    },
    experience: {
      title: `${siteName} | Experience`,
      description:
        "Discover Mohamed Mahmoud Abo al magd's practical experience building for the web, spanning frontend interfaces, backend services, database-backed applications, and full-stack development. Learn about his technical focus, project responsibilities, and collaborative approach.",
      keywords: [
        "Mohamed Mahmoud Abo al magd experience",
        "full-stack web development experience",
        "frontend engineering experience",
        "backend application development experience",
        "React developer practical experience",
        "Next.js application development work",
        "Node.js server development",
        "REST API implementation experience",
        "MongoDB data-driven applications",
        "web project delivery responsibilities",
        "software development collaboration",
        "technical planning and implementation",
        "interface development and integration",
        "application architecture experience",
        "professional software developer profile",
      ],
      category: "Professional experience",
      classification: "Web development experience and technical practice",
      imageAlt:
        "Full-stack web development experience of Mohamed Mahmoud Abo al magd",
    },
    contact: {
      title: `Contact ${siteName} | Full-Stack Developer`,
      description:
        "Get in touch with Mohamed Mahmoud Abo al magd to discuss a web application, a full-stack development project, a professional opportunity, or a potential collaboration. Use the contact page to start a conversation about your goals and technical needs.",
      keywords: [
        "contact Mohamed Mahmoud Abo al magd",
        "message Mohamed Abo al magd developer",
        "hire a full-stack web developer",
        "web application project inquiry",
        "MERN stack development consultation",
        "Next.js website development contact",
        "React and Node.js project collaboration",
        "discuss a custom web application",
        "software developer professional inquiry",
        "full-stack development partnership",
        "frontend development project contact",
        "backend development collaboration",
        "web development opportunity contact",
        "request a portfolio project discussion",
        "connect with a JavaScript developer",
      ],
      category: "Contact and collaboration",
      classification: "Professional contact for web development inquiries",
      imageAlt:
        "Contact Mohamed Mahmoud Abo al magd for web development collaboration",
    },
  },
  ar: {
    home: {
      title: "محمد محمود أبو المجد | مطور ويب متكامل",
      description:
        "اكتشف معرض أعمال محمد محمود أبو المجد، مطور الويب المتكامل المهتم بتقنيات MERN Stack وNext.js. تعرّف على أسلوبه في تطوير الواجهات والخدمات الخلفية، ومشاريعه وتعليمه وخبراته العملية، واستكشف طرق التواصل والتعاون.",
      keywords: [
        "معرض أعمال محمد محمود أبو المجد",
        "الموقع الشخصي لمطور ويب",
        "معرض أعمال مطور ويب متكامل",
        "مطور تطبيقات MERN Stack",
        "مطور مواقع Next.js",
        "مطور React وNode.js",
        "تطوير تطبيقات الويب المتكاملة",
        "مطور واجهات أمامية وخلفية",
        "معرض مشاريع هندسة البرمجيات",
        "مبرمج JavaScript وTypeScript",
        "تصميم مواقع ويب متجاوبة",
        "تطوير تطبيقات باستخدام MongoDB",
        "مطور ويب من مصر",
        "مطور برمجيات عربي وإنجليزي",
        "المسيرة المهنية لمطور ويب",
      ],
      category: "معرض أعمال تطوير الويب",
      classification: "معرض شخصي وملف مهني لمطور برمجيات",
      imageAlt: "معرض أعمال محمد محمود أبو المجد في تطوير الويب المتكامل",
    },
    about: {
      title: "عن محمد محمود أبو المجد | مطور ويب متكامل",
      description:
        "تعرّف على محمد محمود أبو المجد ورحلته من تعلّم تطوير الواجهات الأمامية إلى بناء تطبيقات ويب متكاملة. اكتشف التقنيات التي يستخدمها والمبادئ التي يهتم بها، مثل تنظيم بنية البرمجيات، ودقة التنفيذ، وتقديم تجربة استخدام واضحة وموثوقة.",
      keywords: [
        "نبذة عن محمد محمود أبو المجد",
        "السيرة المهنية لمحمد أبو المجد",
        "قصة مطور ويب متكامل",
        "رحلة تعلم تطوير البرمجيات",
        "الانتقال من الواجهات إلى البرمجة الخلفية",
        "منهج مطور البرمجيات في العمل",
        "مبادئ كتابة الشيفرة النظيفة",
        "تنظيم بنية تطبيقات الويب",
        "بناء منتجات رقمية موثوقة",
        "تطوير تطبيقات تركز على المستخدم",
        "خبرة في تقنيات MERN Stack",
        "التعريف بمطور Next.js",
        "حل المشكلات في هندسة البرمجيات",
        "اهتمامات مطور JavaScript",
        "ملف تعريفي لمهندس برمجيات",
      ],
      category: "نبذة عن المطور",
      classification: "صفحة تعريفية وسيرة مهنية لمطور ويب",
      imageAlt: "نبذة عن محمد محمود أبو المجد ورحلته في تطوير الويب",
    },
    education: {
      title: "تعليم محمد محمود أبو المجد",
      description:
        "تعرّف على المسار التعليمي والتعلّم المستمر لمحمد محمود أبو المجد في مجال تطوير البرمجيات. تعرض الصفحة المعارف والمهارات المرتبطة بعمله، بما يشمل تقنيات الويب وأساسيات البرمجة وتطوير التطبيقات وقواعد البيانات ومفاهيم هندسة البرمجيات.",
      keywords: [
        "تعليم محمد محمود أبو المجد",
        "الخلفية التعليمية لمطور برمجيات",
        "المسار التعليمي في تطوير الويب",
        "تعلم أساسيات البرمجة",
        "تطوير المهارات التقنية للمبرمج",
        "تعلم JavaScript وTypeScript",
        "دراسة React وNext.js",
        "تعلم تطوير الخوادم باستخدام Node.js",
        "أساسيات قواعد بيانات MongoDB",
        "مهارات تصميم واجهات الويب",
        "مبادئ البرمجة الخلفية",
        "معارف هندسة البرمجيات",
        "التعلم الذاتي لتقنيات البرمجة",
        "التعلم المستمر لمطور الويب",
        "التأهيل التقني لتطوير التطبيقات",
      ],
      category: "التعليم والتعلّم التقني",
      classification: "التعليم والتطوير المستمر والمهارات البرمجية",
      imageAlt: "تعليم محمد محمود أبو المجد وتعلمه المستمر في البرمجة",
    },
    projects: {
      title: "مشاريع محمد محمود أبو المجد",
      description:
        "تصفح مجموعة مختارة من مشاريع تطوير الويب لمحمد محمود أبو المجد. استكشف بناء التطبيقات المتكاملة وتجارب الواجهات وتنفيذ الوظائف الخلفية والاستخدام العملي لتقنيات React وNext.js وNode.js وMongoDB.",
      keywords: [
        "مشاريع محمد محمود أبو المجد",
        "نماذج تطبيقات ويب متكاملة",
        "مشاريع تطبيقات MERN Stack",
        "أمثلة مواقع مبنية باستخدام Next.js",
        "مشاريع واجهات React",
        "تطبيقات خلفية باستخدام Node.js",
        "تطبيقات ويب مرتبطة بقاعدة MongoDB",
        "تنفيذ مواقع متوافقة مع الجوال",
        "مشاريع واجهات مستخدم تفاعلية",
        "تطوير تطبيقات تعتمد على REST API",
        "تنفيذ منتج ويب من البداية للنهاية",
        "استعراض مشاريع برمجية شخصية",
        "معرض تطبيقات JavaScript الحديثة",
        "تنفيذ تصميم وتجربة المستخدم",
        "نماذج أعمال تطوير البرمجيات",
      ],
      category: "مشاريع تطوير البرمجيات",
      classification: "نماذج مختارة من تطبيقات ومشاريع الويب",
      imageAlt: "مشاريع تطوير الويب لمحمد محمود أبو المجد",
    },
    experience: {
      title: "خبرات محمد محمود أبو المجد",
      description:
        "اكتشف خبرة محمد محمود أبو المجد العملية في تطوير الويب، من بناء الواجهات الأمامية والخدمات الخلفية إلى تطبيقات قواعد البيانات والعمل المتكامل. تعرّف على تركيزه التقني ومسؤوليات تنفيذ المشاريع وطريقته في التعاون.",
      keywords: [
        "خبرات محمد محمود أبو المجد",
        "خبرة عملية في تطوير الويب المتكامل",
        "خبرة هندسة الواجهات الأمامية",
        "تنفيذ تطبيقات البرمجة الخلفية",
        "خبرة مطور React في المشاريع",
        "تطوير تطبيقات Next.js عملياً",
        "بناء خدمات الخادم باستخدام Node.js",
        "تنفيذ واجهات REST API",
        "تطوير تطبيقات MongoDB",
        "مسؤوليات تنفيذ مشاريع الويب",
        "التعاون في فرق تطوير البرمجيات",
        "تخطيط وتنفيذ الحلول التقنية",
        "دمج الواجهات مع خدمات التطبيقات",
        "خبرة تصميم بنية التطبيقات",
        "الملف المهني لمطور برمجيات",
      ],
      category: "الخبرة المهنية",
      classification: "خبرة وممارسة عملية في تطوير تطبيقات الويب",
      imageAlt: "خبرة محمد محمود أبو المجد في تطوير الويب المتكامل",
    },
    contact: {
      title: "تواصل مع محمد محمود أبو المجد | مطور ويب متكامل",
      description:
        "تواصل مع محمد محمود أبو المجد لمناقشة تطبيق ويب أو مشروع تطوير متكامل أو فرصة مهنية أو تعاون تقني. استخدم صفحة التواصل لبدء محادثة حول أهداف مشروعك واحتياجاته في تطوير الواجهات أو الخدمات الخلفية.",
      keywords: [
        "التواصل مع محمد محمود أبو المجد",
        "إرسال رسالة إلى مطور ويب",
        "توظيف مطور ويب متكامل",
        "طلب تنفيذ مشروع تطبيق ويب",
        "استشارة تطوير MERN Stack",
        "التواصل بشأن تطوير موقع Next.js",
        "تعاون في مشروع React وNode.js",
        "مناقشة إنشاء تطبيق ويب مخصص",
        "استفسار مهني لمطور برمجيات",
        "شراكة في تطوير التطبيقات المتكاملة",
        "طلب تطوير واجهات أمامية",
        "التعاون في بناء الخدمات الخلفية",
        "التواصل بشأن فرصة تطوير ويب",
        "طلب مناقشة مشروع من معرض الأعمال",
        "التواصل مع مطور JavaScript",
      ],
      category: "التواصل والتعاون",
      classification: "صفحة التواصل لاستفسارات تطوير الويب المهنية",
      imageAlt: "تواصل مع محمد محمود أبو المجد لمشاريع تطوير الويب",
    },
  },
} satisfies Record<Locale, Record<PageKey, PageMetadataContent>>;

const paths: Record<PageKey, string> = {
  home: "",
  about: "/about",
  education: "/education",
  projects: "/projects",
  experience: "/experience",
  contact: "/contact",
};

function localizedUrl(locale: Locale, page: PageKey): string {
  return `${siteUrl}/${locale}${paths[page]}`;
}

export function getPageMetadata(locale: Locale, page: PageKey): Metadata {
  const {
    title,
    description,
    keywords,
    category,
    classification,
    imageAlt,
  } = pages[locale][page];
  const url = localizedUrl(locale, page);
  const imageUrl = `${siteUrl}${socialImage}`;

  return {
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    category,
    classification,
    referrer: "strict-origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: localizedUrl("en", page),
        ar: localizedUrl("ar", page),
        "x-default": localizedUrl("en", page),
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName,
      title,
      description,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_EG"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: imageAlt }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
