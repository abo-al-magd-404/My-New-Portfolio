"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCodeBranch,
  faEnvelope,
  faFolderOpen,
  faGraduationCap,
  faHouse,
  faQuoteLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

interface FooterProps {
  locale: "en" | "ar";
}

export default function Footer({ locale }: FooterProps) {
  const isArabic = locale === "ar";
  const pathname = usePathname();

  const getLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    if (cleanPath === "") return `/${locale}`;
    return `/${locale}/${cleanPath}`;
  };

  const navLinks = [
    {
      label: isArabic ? "الصفحة الرئيسية" : "Home",
      href: getLocalizedPath(""),
      icon: faHouse,
    },
    {
      label: isArabic ? "عنـــــّي" : "About Me",
      href: getLocalizedPath("about"),
      icon: faUser,
    },
    {
      label: isArabic ? "مساري التعليمي" : "My Education",
      href: getLocalizedPath("education"),
      icon: faGraduationCap,
    },
    {
      label: isArabic ? "مشاريعي" : "My Projects",
      href: getLocalizedPath("projects"),
      icon: faFolderOpen,
    },
    {
      label: isArabic ? "خبراتي" : "My Experience",
      href: getLocalizedPath("experience"),
      icon: faBriefcase,
    },
    {
      label: isArabic ? "تواصل معي" : "Contact Me",
      href: getLocalizedPath("contact"),
      icon: faEnvelope,
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
    relative 
    w-full px-3 py-2  sm:px-5 sm:py-2.5 
    border-t border-border rounded-t-xl
    bg-foreground/5 text-foreground backdrop-blur-sm
    transition-all duration-300 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-24 bg-linear-to-r from-brand-cyan/10 via-brand-violet/10 to-brand-blue/10 blur-3xl pointer-events-none rounded-full" />

      <div className="container mx-auto max-w-7xl">
        <nav
          aria-label={isArabic ? "روابط الفوتر" : "Footer navigation"}
          className="grid grid-cols-2 items-stretch gap-2 border-b border-border/40 pb-6 sm:gap-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-4"
        >
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== `/${locale}` &&
                pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 w-full items-center justify-center rounded-lg px-2 py-2 text-center text-sm transition-colors ${
                  isActive
                    ? "border border-brand-blue/50 bg-brand-blue/15 font-semibold text-brand-blue"
                    : "border border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <FontAwesomeIcon
                  icon={link.icon}
                  aria-hidden="true"
                  className="shrink-0 text-xs"
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-6 border-b border-border/40 py-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex min-w-0 flex-col items-start gap-3">
            <div className="flex min-w-0 items-center gap-3 select-none">
              <div className="relative size-11 shrink-0 overflow-hidden rounded-full border-2 border-primary/30 bg-background shadow-md">
                <Image
                  src="/pictures/apple-touch-icon.png"
                  alt={
                    isArabic
                      ? "محمد محمود أبو المجد"
                      : "Mohamed Mahmoud Abo al magd"
                  }
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="font-bold text-base tracking-tight">
                  {isArabic
                    ? "محمد محمود أبو المجد"
                    : "Mohamed Mahmoud Abo al magd"}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {isArabic
                    ? "مطور تطبيقات ويب كاملة (MERN & Next.js)"
                    : "Full-Stack Web Developer (MERN & Next.js)"}
                </span>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-mono text-emerald-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>
                {isArabic
                  ? "متاح للعمل والمشاريع"
                  : "Available for work & projects"}
              </span>
            </div>
          </div>

          <blockquote className="relative rounded-xl border border-border/60 bg-secondary/30 p-4 text-xs leading-relaxed text-muted-foreground shadow-sm backdrop-blur-sm sm:text-sm lg:max-w-xl">
            <FontAwesomeIcon
              icon={faQuoteLeft}
              className="absolute -top-5 inset-s-4 px-1.5 text-3xl text-brand-blue"
            />
            <p className="italic">
              {isArabic
                ? "«نطلب الحق ونبذل في إدراكه غاية الجهد.»"
                : "“The important thing is not to stop questioning. Curiosity has its own reason for existing.”"}
            </p>
            <cite className="mt-2 block text-[11px] not-italic text-foreground/70">
              — {isArabic ? "ابن الهيثم" : "Albert Einstein"}
            </cite>
          </blockquote>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-muted-foreground font-mono sm:flex-row">
          <p>
            © {currentYear}{" "}
            {isArabic ? "محمد محمود أبو المجد" : "Mohamed Mahmoud Abo al magd"}.{" "}
            {isArabic ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 opacity-80">
              <FontAwesomeIcon
                icon={faCodeBranch}
                className="text-brand-blue"
              />{" "}
              v1.0.0
            </span>
            <span>•</span>
            <span className="hover:text-foreground transition-colors cursor-default">
              {isArabic
                ? "صُنع باستخدام Next.js وMongoDB"
                : "Built with Next.js & MongoDB"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
