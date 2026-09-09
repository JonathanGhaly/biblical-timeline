import {
  Users,
  Calendar,
  Layers,
  Sparkles,
  Database,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { CopticCross } from "../components/Coptic/CopticCross";
import type { GenealogyData, Language } from "../types/genealogy";
import {
  UI_TRANSLATIONS,
  getEventDisplayTitle,
  getEventDisplayDescription,
  formatYearDisplay,
  localizeBiblicalReferences,
} from "../utils/i18n";
import { getStoredGistId } from "../services/gistService";

interface DashboardProps {
  data: GenealogyData;
  lang: Language;
  onNavigate: (page: string) => void;
  onOpenGistModal: () => void;
  isGistLive: boolean;
}

export default function Dashboard({
  data,
  lang,
  onNavigate,
  onOpenGistModal,
  isGistLive,
}: DashboardProps) {
  const t = UI_TRANSLATIONS[lang];
  const peopleCount = data.people.length;
  const eventsCount = data.events.length;
  const gistId = getStoredGistId();

  // Calculate earliest biblical date
  let earliestYear = -4000;
  data.events.forEach((ev) => {
    if (ev.date?.year && ev.date.year < earliestYear) {
      earliestYear = ev.date.year;
    }
  });

  return (
    <div className="space-y-8 animate-fadeIn" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Illuminated Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#D4AF37] p-6 sm:p-8 bg-gradient-to-br from-[#800020]/15 via-[#FBF8EF] to-[#1A365D]/15 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#0F2537]/40 shadow-xl">
        {/* Background Decorative Cross Watermark */}
        <div className="absolute right-4 sm:right-12 -bottom-10 opacity-10 pointer-events-none transform rotate-12">
          <CopticCross size={260} glow={false} />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37] bg-[#D4AF37]/15 text-[#800020] dark:text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
            <CopticCross size={16} />
            <span>{t.copticTradition}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB] tracking-tight">
            {t.appTitle}
          </h2>

          <p className="text-sm sm:text-base text-[#4A3E31] dark:text-[#C5BBAE] leading-relaxed font-body">
            {t.exploreDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate("family-tree")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#A01128] text-white font-bold text-sm shadow-md hover:brightness-110 hover:shadow-lg transition-all"
            >
              <span>{t.navFamilyTree}</span>
              <ArrowRight size={16} className={lang === "ar" ? "rotate-180" : ""} />
            </button>

            <button
              onClick={() => onNavigate("family-timeline")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#D4AF37] text-[#800020] dark:text-[#F3E5AB] hover:bg-[#D4AF37]/15 font-bold text-sm transition-all"
            >
              <span>{t.navLifespans}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Illuminated Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* People Metric */}
        <div
          onClick={() => onNavigate("people")}
          className="group cursor-pointer rounded-2xl p-5 border-2 border-[#D4AF37]/60 bg-white/70 dark:bg-[#1C1A17] shadow-sm hover:shadow-md hover:border-[#D4AF37] transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B5E4E] dark:text-[#A99F8D]">
              {t.totalPeople}
            </span>
            <div className="p-2 rounded-xl bg-[#800020]/10 dark:bg-[#800020]/30 text-[#800020] dark:text-[#F3E5AB]">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
              {peopleCount}
            </span>
            <span className="text-xs text-[#7A6E5E] dark:text-[#887C6C]">
              {lang === "ar" ? "شخصية تاريخية" : "patriarchs & figures"}
            </span>
          </div>
        </div>

        {/* Events Metric */}
        <div
          onClick={() => onNavigate("events")}
          className="group cursor-pointer rounded-2xl p-5 border-2 border-[#D4AF37]/60 bg-white/70 dark:bg-[#1C1A17] shadow-sm hover:shadow-md hover:border-[#D4AF37] transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B5E4E] dark:text-[#A99F8D]">
              {t.totalEvents}
            </span>
            <div className="p-2 rounded-xl bg-[#1A365D]/10 dark:bg-[#1A365D]/30 text-[#1A365D] dark:text-[#90CDF4]">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-cinzel text-[#1A365D] dark:text-[#90CDF4]">
              {eventsCount}
            </span>
            <span className="text-xs text-[#7A6E5E] dark:text-[#887C6C]">
              {lang === "ar" ? "حدث كتابي" : "biblical milestones"}
            </span>
          </div>
        </div>

        {/* Generations Metric */}
        <div
          onClick={() => onNavigate("family-tree")}
          className="group cursor-pointer rounded-2xl p-5 border-2 border-[#D4AF37]/60 bg-white/70 dark:bg-[#1C1A17] shadow-sm hover:shadow-md hover:border-[#D4AF37] transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B5E4E] dark:text-[#A99F8D]">
              {t.generationsSpan}
            </span>
            <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#8C6F12] dark:text-[#F3E5AB]">
              <Layers size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-cinzel text-[#8C6F12] dark:text-[#F3E5AB]">
              20+
            </span>
            <span className="text-xs text-[#7A6E5E] dark:text-[#887C6C]">
              {lang === "ar" ? "من آدم إلى إبراهيم" : "Adam to Abraham"}
            </span>
          </div>
        </div>

        {/* Earliest Era Metric */}
        <div
          onClick={() => onNavigate("timeline")}
          className="group cursor-pointer rounded-2xl p-5 border-2 border-[#D4AF37]/60 bg-white/70 dark:bg-[#1C1A17] shadow-sm hover:shadow-md hover:border-[#D4AF37] transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B5E4E] dark:text-[#A99F8D]">
              {t.earliestDate}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
              4000
            </span>
            <span className="text-xs text-[#7A6E5E] dark:text-[#887C6C]">
              {lang === "ar" ? "ق.م (الخلق)" : "BC (Creation)"}
            </span>
          </div>
        </div>
      </div>

      {/* Live GitHub Gist Database Status Card */}
      <div className="rounded-2xl p-5 sm:p-6 border border-[#D4AF37]/40 bg-gradient-to-r from-[#D4AF37]/10 via-white/80 to-[#800020]/10 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#800020]/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#8C6F12] dark:text-[#F3E5AB]">
            <Database size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#800020] dark:text-[#F3E5AB]">
                {t.gistSettingsTitle}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isGistLive
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isGistLive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                {isGistLive ? t.gistLive : t.gistCached}
              </span>
            </div>
            <p className="text-xs text-[#6B5E4E] dark:text-[#A99F8D] mt-0.5">
              Gist ID: <code className="font-mono text-[11px] font-bold">{gistId}</code> (bible-data.json)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenGistModal}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-[#121110] font-bold text-xs shadow transition-all"
          >
            {t.gistConfigure}
          </button>
          <a
            href={`https://gist.github.com/${gistId}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl border border-[#D4AF37]/50 text-[#800020] dark:text-[#F3E5AB] hover:bg-[#D4AF37]/15 transition-colors"
            title="Open Gist on GitHub"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Key Biblical Events Timeline Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-[#800020] dark:text-[#D4AF37]" />
            <h3 className="text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
              {t.recentEvents}
            </h3>
          </div>
          <button
            onClick={() => onNavigate("events")}
            className="text-xs font-bold text-[#800020] dark:text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <span>{lang === "ar" ? "عرض جميع الأحداث" : "View all events"}</span>
            <ArrowRight size={14} className={lang === "ar" ? "rotate-180" : ""} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.events.slice(0, 6).map((event, index) => {
            const displayTitle = getEventDisplayTitle(event, lang);
            const displayDesc = getEventDisplayDescription(event, lang);
            const formattedYear = formatYearDisplay(event.date?.year, lang);

            return (
              <div
                key={`dash_ev_${event.id}_${index}`}
                className="group relative rounded-2xl p-5 border border-[#D4AF37]/40 bg-white/60 dark:bg-[#1C1A17] hover:border-[#D4AF37] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-base text-[#800020] dark:text-[#F3E5AB] font-cinzel">
                      {displayTitle}
                    </h4>
                    {event.date?.year !== undefined && (
                      <span className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                        {formattedYear}
                      </span>
                    )}
                  </div>

                  {displayDesc && (
                    <p className="text-xs text-[#5C5042] dark:text-[#A99F8D] leading-relaxed line-clamp-2">
                      {displayDesc}
                    </p>
                  )}
                </div>

                {event.biblicalReferences && event.biblicalReferences.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center gap-1.5 text-[11px] text-[#8C6F12] dark:text-[#C5A028] font-medium">
                    <BookOpen size={12} />
                    <span>
                      {localizeBiblicalReferences(event.biblicalReferences, lang).join(
                        lang === "ar" ? "، " : ", "
                      )}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
