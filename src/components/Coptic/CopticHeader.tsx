import React from "react";
import {
  Globe,
  Sun,
  Moon,
  Database,
  Download,
  RotateCcw,
} from "lucide-react";
import { CopticCross } from "./CopticCross";
import type { Language, ThemeMode } from "../../types/genealogy";
import { UI_TRANSLATIONS } from "../../utils/i18n";

interface CopticHeaderProps {
  lang: Language;
  onToggleLang: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isGistLive: boolean;
  onOpenGistModal: () => void;
  onExportJson: () => void;
  onResetData: () => void;
}

export const CopticHeader: React.FC<CopticHeaderProps> = ({
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  isGistLive,
  onOpenGistModal,
  onExportJson,
  onResetData,
}) => {
  const t = UI_TRANSLATIONS[lang];

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b-2 border-[#D4AF37]/50 shadow-md transition-colors bg-[#FBF8EF]/95 dark:bg-[#121110]/95"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Decorative Gold Top Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#1A365D]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand & Coptic Emblem */}
        <div className="flex items-center gap-3.5">
          <div className="relative p-1 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#800020]/20 border border-[#D4AF37]/40 shadow-sm flex items-center justify-center">
            <CopticCross size={34} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                {t.appTitle}
              </h1>
              <span className="hidden md:inline-flex items-center text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                {t.copticTradition}
              </span>
            </div>
            <p className="text-xs text-[#6B5E4E] dark:text-[#A99F8D] truncate max-w-[280px] sm:max-w-md">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gist Live Status Pill */}
          <button
            onClick={onOpenGistModal}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm transition-all hover:scale-105 ${
              isGistLive
                ? "border-emerald-500/50 bg-emerald-50/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-amber-500/50 bg-amber-50/80 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
            }`}
            title={t.gistConfigure}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isGistLive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <Database size={13} />
            <span className="hidden md:inline">
              {isGistLive ? t.gistLive : t.gistCached}
            </span>
          </button>

          {/* Export JSON Button */}
          <button
            onClick={onExportJson}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/60 text-xs font-semibold text-[#800020] dark:text-[#F3E5AB] hover:bg-[#D4AF37]/15 transition-colors"
            title={t.exportJson}
          >
            <Download size={14} />
            <span>{t.exportJson}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onResetData}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 text-xs font-semibold text-[#6B5E4E] dark:text-[#A99F8D] hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 transition-colors"
            title={t.resetData}
          >
            <RotateCcw size={14} />
            <span>{t.resetData}</span>
          </button>

          {/* Gist Trigger (Mobile Icon Button) */}
          <button
            onClick={onOpenGistModal}
            className="sm:hidden p-2 rounded-xl border border-[#D4AF37]/50 text-[#800020] dark:text-[#D4AF37] hover:bg-[#D4AF37]/15"
            title={t.gistConfigure}
          >
            <Database size={17} />
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-[#D4AF37]/50 text-[#800020] dark:text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all shadow-sm"
            title={theme === "dark" ? "Light Parchment Mode" : "Dark Coptic Crypt Mode"}
          >
            {theme === "dark" ? <Sun size={17} className="text-[#D4AF37]" /> : <Moon size={17} />}
          </button>

          {/* Language Switcher (English ⇄ العربية) */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/20 to-[#800020]/20 hover:from-[#D4AF37]/30 hover:to-[#800020]/30 font-bold text-xs sm:text-sm text-[#800020] dark:text-[#F3E5AB] shadow transition-all hover:scale-105"
            title={lang === "en" ? "التبديل إلى اللغة العربية" : "Switch to English"}
          >
            <Globe size={15} />
            <span>{lang === "en" ? "العربية" : "English"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
