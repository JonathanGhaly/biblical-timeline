import React from "react";
import {
  LayoutDashboard,
  Users,
  Network,
  Clock,
  Calendar,
  BookOpen,
  Compass,
} from "lucide-react";
import type { Language } from "../../types/genealogy";
import { UI_TRANSLATIONS } from "../../utils/i18n";

export type Page =
  | "dashboard"
  | "people"
  | "family-tree"
  | "family-timeline"
  | "timeline"
  | "events"
  | "map";

interface CopticSidebarProps {
  currentPage: Page;
  onSelectPage: (page: Page) => void;
  lang: Language;
}

export const CopticSidebar: React.FC<CopticSidebarProps> = ({
  currentPage,
  onSelectPage,
  lang,
}) => {
  const t = UI_TRANSLATIONS[lang];

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    {
      id: "dashboard",
      label: t.navDashboard,
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: "people",
      label: t.navPeople,
      icon: <Users size={18} />,
    },
    {
      id: "family-tree",
      label: t.navFamilyTree,
      icon: <Network size={18} />,
    },
    {
      id: "family-timeline",
      label: t.navLifespans,
      icon: <Clock size={18} />,
    },
    {
      id: "timeline",
      label: t.navTimeline,
      icon: <Calendar size={18} />,
    },
    {
      id: "events",
      label: t.navEvents,
      icon: <BookOpen size={18} />,
    },
    {
      id: "map",
      label: t.navMap,
      icon: <Compass size={18} />,
    },
  ];

  return (
    <aside
      className="w-full md:w-64 shrink-0 p-3 md:p-4 border-b md:border-b-0 md:border-r border-[#D4AF37]/40 bg-[#F3EEE0]/60 dark:bg-[#181614]/80 backdrop-blur-sm transition-colors"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#800020] to-[#990026] text-white shadow-md font-bold scale-[1.02]"
                  : "text-[#4A3E31] dark:text-[#C5BBAE] hover:bg-[#D4AF37]/15 hover:text-[#800020] dark:hover:text-[#F3E5AB]"
              }`}
            >
              <span className={isActive ? "text-[#F3E5AB]" : "text-[#800020] dark:text-[#D4AF37]"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Decorative Coptic Motif at bottom of sidebar (desktop only) */}
      <div className="hidden md:block mt-8 pt-6 border-t border-[#D4AF37]/30 text-center">
        <div className="text-[11px] font-cinzel text-[#8C6F12] dark:text-[#A99F8D] uppercase tracking-widest">
          {lang === "ar" ? "✝ إيمان الآباء ✝" : "✝ Faith of the Fathers ✝"}
        </div>
        <p className="mt-1 text-[10px] text-[#7A6E5E] dark:text-[#887C6C] leading-relaxed">
          {lang === "ar"
            ? "التسلسل الزمني التاريخي لأنساب العهد القديم"
            : "Old Testament Genealogy & Historical Chronology"}
        </p>
      </div>
    </aside>
  );
};
