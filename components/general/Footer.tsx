"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedinIn,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faCodeBranch,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";

interface FooterProps {
  locale: "en" | "ar";
}

export default function Footer({ locale }: FooterProps) {
  const isArabic = locale === "ar";

  const getLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    if (cleanPath === "") return `/${locale}`;
    return `/${locale}/${cleanPath}`;
  };

  const navLinks = [
    {
      label: isArabic ? "الصفحة الرئيسية" : "Home",
      href: getLocalizedPath(""),
    },
    { label: isArabic ? "عنّي" : "About Me", href: getLocalizedPath("about") },
    {
      label: isArabic ? "مساري التعليمي" : "My Education",
      href: getLocalizedPath("education"),
    },
    {
      label: isArabic ? "مشاريعي" : "My Projects",
      href: getLocalizedPath("projects"),
    },
    {
      label: isArabic ? "خبراتي" : "My Experience",
      href: getLocalizedPath("experience"),
    },
    {
      label: isArabic ? "تواصل معي" : "Contact Me",
      href: getLocalizedPath("contact"),
    },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      label: "GitHub",
      href: "https://github.com",
      icon: faGithub,
      hoverColor: "hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50",
    },
    {
      name: "LinkedIn",
      label: "LinkedIn",
      href: "https://linkedin.com",
      icon: faLinkedinIn,
      hoverColor:
        "hover:text-brand-blue hover:border-brand-blue/50 hover:bg-brand-blue/10",
    },
    {
      name: "WhatsApp",
      label: "WhatsApp",
      href: "https://wa.me/",
      icon: faWhatsapp,
      hoverColor:
        "hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10",
    },
    {
      name: "Email",
      label: isArabic ? "البريد الإلكتروني" : "Email",
      href: "mailto:contact@example.com",
      icon: faEnvelope,
      hoverColor:
        "hover:text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10",
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-border/40">
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3 select-none">
              <div className="relative size-11 shrink-0 rounded-full overflow-hidden border-2 border-primary/30 shadow-md bg-background">
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
              <div className="flex flex-col">
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

            <div className="relative mt-2 p-4 rounded-xl border border-border/60 bg-secondary/30 backdrop-blur-sm text-xs sm:text-sm text-muted-foreground leading-relaxed shadow-sm">
              <FontAwesomeIcon
                icon={faQuoteLeft}
                className="absolute -top-2.5 right-4 text-brand-blue/60 text-xs px-1.5"
              />
              <p className="italic">
                {isArabic ? (
                  <>
                    «البرمجة ليست مجرد كتابة أكواد،
                    <br />
                    بل هي فن تحويل المشاكل المعقدة إلى حلول رقمية بسيطة وأنيقة»
                  </>
                ) : (
                  "“Clean code always looks like it was written by someone who cares.”"
                )}
              </p>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-blue font-mono">
              {isArabic ? "// روابط سريعة" : "// QUICK NAVIGATION"}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 flex items-center gap-1.5 py-1 text-xs sm:text-sm group"
                >
                  <span className="text-brand-violet opacity-0 group-hover:opacity-100 transition-opacity">
                    ›
                  </span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-blue font-mono">
              {isArabic ? "// تواصل معي" : "// CONNECT"}
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`size-9 rounded-xl border border-border/60 bg-secondary/50 flex items-center justify-center text-muted-foreground transition-all duration-300 shadow-sm ${social.hoverColor} hover:scale-105`}
                >
                  <FontAwesomeIcon icon={social.icon} className="text-sm" />
                </a>
              ))}
            </div>

            <div className="mt-2 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono w-fit">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
              </span>
              <span>
                {isArabic
                  ? "متاح للعمل والمشاريع"
                  : "Available for work & projects"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <p>
            ©{" "}
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
