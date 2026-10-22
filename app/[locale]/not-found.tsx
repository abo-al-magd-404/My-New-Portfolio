import type { Metadata } from "next";
import NotFoundContent from "../../components/general/NotFoundContent";

export const metadata: Metadata = {
  title: "404 | Page not found · الصفحة غير موجودة",
  description:
    "The requested page could not be found. الصفحة التي تبحث عنها غير موجودة.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <NotFoundContent />;
}
