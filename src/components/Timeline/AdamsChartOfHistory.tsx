import React, { useState, useMemo } from "react";
import type { Language, Person, BiblicalEvent } from "../../types/genealogy";
import {
  ADAMS_HISTORICAL_EVENTS,
  ADAMS_ERAS,
  CIVILIZATION_INFO,
  type CivilizationTrack,
  type SynchronizedHistoricalEvent,
  type AdamsEra,
} from "../../data/adamsSynchronologicalHistory";
import {
  UI_TRANSLATIONS,
  formatYearDisplay,
  getEventDisplayTitle,
  getEventDisplayDescription,
  getPersonDisplayName,
} from "../../utils/i18n";
import { resolveEventYear } from "../../utils/chronology";
import {
  Search,
  Calendar,
  Layers,
  Sparkles,
  BookOpen,
  Landmark,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  ChevronRight,
  ShieldCheck,
  Compass,
  MapPin,
  CheckCircle2,
  Users,
} from "lucide-react";
import { CopticCross } from "../Coptic/CopticCross";

interface AdamsChartOfHistoryProps {
  lang: Language;
  biblicalPeople?: Person[];
  biblicalEvents?: BiblicalEvent[];
}

type ViewMode = "streams" | "matrix";
type MatrixGrouping = "enteredEvents" | "eras";

export const AdamsChartOfHistory: React.FC<AdamsChartOfHistoryProps> = ({
  lang,
  biblicalPeople = [],
  biblicalEvents = [],
}) => {
  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  // State
  const [viewMode, setViewMode] = useState<ViewMode>("streams");
  const [matrixGrouping, setMatrixGrouping] = useState<MatrixGrouping>("enteredEvents");
  const [selectedEraId, setSelectedEraId] = useState<string>("all");
  const [selectedCiv, setSelectedCiv] = useState<string>("all");
  const [selectedEnteredEventId, setSelectedEnteredEventId] = useState<string>("all");
  const [selectedSignificance, setSelectedSignificance] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<SynchronizedHistoricalEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<SynchronizedHistoricalEvent | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [showNotice, setShowNotice] = useState<boolean>(true);

  // 1. Transform the user's entered BiblicalEvents into SynchronizedHistoricalEvents
  // Per user specification: "inside adams chart if event is not sure when it happened don't add it there"
  const userEnteredSynchronizedEvents = useMemo<SynchronizedHistoricalEvent[]>(() => {
    if (!biblicalEvents || biblicalEvents.length === 0) return [];

    return biblicalEvents
      .map((evt) => {
        // Strict certainty check: If event is not sure when it happened, do not add it to Adams Chart
        const isApproximate =
          evt.date?.precision === "approximate" ||
          evt.date?.precision === "about";

        const hasDefiniteScripturalAnchor =
          Boolean(evt.anchorPersonId && (evt.anchorAge !== undefined || evt.anchorPersonAgeAtEvent !== undefined));

        const isExactOrCalculated =
          evt.date?.precision === "exact" ||
          evt.date?.precision === "calculated";

        // Must be sure: not approximate/about, and either explicit exact/calculated or scripturally anchored
        const isSure =
          !isApproximate &&
          (isExactOrCalculated || hasDefiniteScripturalAnchor);

        if (!isSure) {
          // Exclude uncertain event from Adams Chart
          return null;
        }

        const resolvedYear = resolveEventYear(evt, biblicalPeople) ?? evt.date?.year;
        if (resolvedYear === undefined || isNaN(resolvedYear)) return null;

        const yearDisplayEn = formatYearDisplay(resolvedYear, "en");
        const yearDisplayAr = formatYearDisplay(resolvedYear, "ar");
        const titleEn = getEventDisplayTitle(evt, "en");
        const titleAr = getEventDisplayTitle(evt, "ar");
        const descEn = getEventDisplayDescription(evt, "en") || "";
        const descAr = getEventDisplayDescription(evt, "ar") || "";

        // Linked people names
        const peopleNamesEn = (evt.personIds || [])
          .map((id) => {
            const p = biblicalPeople.find((person) => person.id === id);
            return p ? getPersonDisplayName(p, "en") : id;
          })
          .join(", ");

        const peopleNamesAr = (evt.personIds || [])
          .map((id) => {
            const p = biblicalPeople.find((person) => person.id === id);
            return p ? getPersonDisplayName(p, "ar") : id;
          })
          .join("، ");

        // Contemporaneous real world historical events for this entered event
        const worldContemporaries = ADAMS_HISTORICAL_EVENTS.filter(
          (w) => w.civilization !== "biblical" && Math.abs(w.year - resolvedYear) <= 150
        );

        const syncSummaryEn =
          worldContemporaries.length > 0
            ? `Synchronous with ${worldContemporaries
                .slice(0, 3)
                .map((w) => `${w.titleEn} (${w.yearDisplayEn})`)
                .join("; ")}.`
            : `Sacred biblical event recorded in Holy Scripture.`;

        const syncSummaryAr =
          worldContemporaries.length > 0
            ? `متزامن تاريخياً مع: ${worldContemporaries
                .slice(0, 3)
                .map((w) => `${w.titleAr} (${w.yearDisplayAr})`)
                .join("؛ ")}.`
            : `حدث كتابي مقدس مسجل في أسفار العهد القديم.`;

        const item: SynchronizedHistoricalEvent = {
          id: `user_evt_${evt.id}`,
          year: resolvedYear,
          yearDisplayEn,
          yearDisplayAr,
          civilization: "biblical",
          titleEn,
          titleAr,
          rulerOrLeaderEn: peopleNamesEn || undefined,
          rulerOrLeaderAr: peopleNamesAr || undefined,
          descriptionEn: descEn,
          descriptionAr: descAr,
          biblicalSynchronismEn: syncSummaryEn,
          biblicalSynchronismAr: syncSummaryAr,
          biblicalReferences: evt.biblicalReferences,
          location: evt.location,
          isUserEntered: true,
          originalEventId: evt.id,
          significance: "monumental",
        };

        return item;
      })
      .filter((e): e is SynchronizedHistoricalEvent => e !== null)
      .sort((a, b) => a.year - b.year);
  }, [biblicalEvents, biblicalPeople]);

  // Excluded uncertain events count
  const excludedUncertainEventsCount = useMemo(() => {
    if (!biblicalEvents) return 0;
    return biblicalEvents.filter((evt) => {
      const isApproximate =
        evt.date?.precision === "approximate" ||
        evt.date?.precision === "about";
      const hasDefiniteScripturalAnchor =
        Boolean(evt.anchorPersonId && (evt.anchorAge !== undefined || evt.anchorPersonAgeAtEvent !== undefined));
      const isExactOrCalculated =
        evt.date?.precision === "exact" ||
        evt.date?.precision === "calculated";
      const isSure = !isApproximate && (isExactOrCalculated || hasDefiniteScripturalAnchor);
      return !isSure;
    }).length;
  }, [biblicalEvents]);

  // 2. Real World Historical Events (Egypt, Mesopotamia, Persia, Greece, Rome, Wonders)
  const realWorldHistoricalEvents = useMemo(() => {
    return ADAMS_HISTORICAL_EVENTS.filter((e) => e.civilization !== "biblical");
  }, []);

  // 3. Combined synchronized dataset: User's entered events for biblical track + Real world history
  const allSynchronizedEvents = useMemo<SynchronizedHistoricalEvent[]>(() => {
    if (userEnteredSynchronizedEvents.length > 0) {
      return [...userEnteredSynchronizedEvents, ...realWorldHistoricalEvents].sort(
        (a, b) => a.year - b.year
      );
    }
    // Fallback if no user events yet
    return [...ADAMS_HISTORICAL_EVENTS].sort((a, b) => a.year - b.year);
  }, [userEnteredSynchronizedEvents, realWorldHistoricalEvents]);

  // 4. Focus on selected entered event
  const focusedEnteredEvent = useMemo<SynchronizedHistoricalEvent | undefined>(() => {
    if (selectedEnteredEventId === "all") return undefined;
    return userEnteredSynchronizedEvents.find((e) => e.originalEventId === selectedEnteredEventId);
  }, [selectedEnteredEventId, userEnteredSynchronizedEvents]);

  // Dynamic range based on selected focus or era
  const activeEra = useMemo<AdamsEra | undefined>(() => {
    if (selectedEraId === "all") return undefined;
    return ADAMS_ERAS.find((e) => e.id === selectedEraId);
  }, [selectedEraId]);

  const effectiveMinYear = useMemo(() => {
    if (focusedEnteredEvent) {
      return focusedEnteredEvent.year - 200;
    }
    if (activeEra) {
      return activeEra.startYear;
    }
    return -4004;
  }, [focusedEnteredEvent, activeEra]);

  const effectiveMaxYear = useMemo(() => {
    if (focusedEnteredEvent) {
      return focusedEnteredEvent.year + 200;
    }
    if (activeEra) {
      return activeEra.endYear;
    }
    return 33;
  }, [focusedEnteredEvent, activeEra]);

  const effectiveSpan = Math.max(1, effectiveMaxYear - effectiveMinYear);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return allSynchronizedEvents.filter((evt) => {
      // 1. Focus on specific entered event (shows the event + contemporaneous world history within window)
      if (focusedEnteredEvent) {
        if (evt.id === focusedEnteredEvent.id) return true;
        if (evt.year < effectiveMinYear || evt.year > effectiveMaxYear) return false;
      }

      // 2. Era filter
      if (!focusedEnteredEvent && selectedEraId !== "all") {
        if (evt.year < effectiveMinYear || evt.year > effectiveMaxYear) {
          return false;
        }
      }

      // 3. Civilization filter
      if (selectedCiv !== "all" && evt.civilization !== selectedCiv) {
        return false;
      }

      // 4. Significance filter
      if (selectedSignificance !== "all" && evt.significance !== selectedSignificance) {
        return false;
      }

      // 5. Search query
      if (term) {
        const titleMatch =
          evt.titleEn.toLowerCase().includes(term) ||
          evt.titleAr.toLowerCase().includes(term);
        const descMatch =
          evt.descriptionEn.toLowerCase().includes(term) ||
          evt.descriptionAr.toLowerCase().includes(term);
        const rulerMatch =
          (evt.rulerOrLeaderEn || "").toLowerCase().includes(term) ||
          (evt.rulerOrLeaderAr || "").toLowerCase().includes(term);
        const syncMatch =
          (evt.biblicalSynchronismEn || "").toLowerCase().includes(term) ||
          (evt.biblicalSynchronismAr || "").toLowerCase().includes(term);
        const archMatch =
          (evt.archaeologicalEvidenceEn || "").toLowerCase().includes(term) ||
          (evt.archaeologicalEvidenceAr || "").toLowerCase().includes(term);
        const yearMatch =
          evt.yearDisplayEn.toLowerCase().includes(term) ||
          evt.yearDisplayAr.toLowerCase().includes(term);

        if (!titleMatch && !descMatch && !rulerMatch && !syncMatch && !archMatch && !yearMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => a.year - b.year);
  }, [
    allSynchronizedEvents,
    focusedEnteredEvent,
    selectedEraId,
    selectedCiv,
    selectedSignificance,
    searchTerm,
    effectiveMinYear,
    effectiveMaxYear,
  ]);

  // Group events by the user's entered events for matrix view
  const eventsGroupedByEnteredEvents = useMemo(() => {
    return userEnteredSynchronizedEvents.map((userEvt) => {
      // Find contemporaneous world events within 150 years
      const concurrentWorldEvents = realWorldHistoricalEvents.filter(
        (w) => Math.abs(w.year - userEvt.year) <= 150
      );

      return {
        enteredEvent: userEvt,
        concurrentEvents: concurrentWorldEvents,
      };
    });
  }, [userEnteredSynchronizedEvents, realWorldHistoricalEvents]);

  // Group events by era for matrix view
  const eventsByEra = useMemo(() => {
    return ADAMS_ERAS.map((era) => {
      const eraEvts = filteredEvents.filter(
        (e) => e.year >= era.startYear && e.year <= era.endYear
      );
      return {
        era,
        events: eraEvts,
      };
    }).filter((group) => group.events.length > 0);
  }, [filteredEvents]);

  // Contemporaneous events for modal
  const contemporaneousEvents = useMemo(() => {
    if (!selectedEvent) return [];
    return allSynchronizedEvents.filter((e) => {
      if (e.id === selectedEvent.id) return false;
      return Math.abs(e.year - selectedEvent.year) <= 150;
    }).slice(0, 4);
  }, [selectedEvent, allSynchronizedEvents]);

  // Civilizations tracked list
  const civTracks: CivilizationTrack[] = [
    "biblical",
    "egypt",
    "mesopotamia",
    "persia",
    "greece",
    "rome",
    "wonders",
  ];

  // Helper to calculate X percentage position on timeline
  const getEventPositionPct = (year: number) => {
    const clampedYear = Math.max(effectiveMinYear, Math.min(effectiveMaxYear, year));
    const pct = ((clampedYear - effectiveMinYear) / effectiveSpan) * 100;
    return isRTL ? 100 - pct : pct;
  };

  // Timeline year ticks
  const timelineTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = effectiveSpan > 2000 ? 500 : effectiveSpan > 600 ? 200 : effectiveSpan > 200 ? 50 : 25;
    const start = Math.ceil(effectiveMinYear / step) * step;
    for (let yr = start; yr <= effectiveMaxYear; yr += step) {
      ticks.push(yr);
    }
    return ticks;
  }, [effectiveMinYear, effectiveMaxYear, effectiveSpan]);

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Victorian Chromolithograph Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#800020]/20 via-[#FBF8EF] to-[#1A365D]/20 dark:from-[#2A1810] dark:via-[#161412] dark:to-[#121E2E] p-5 sm:p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <CopticCross size={26} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB] tracking-wide">
                {t.adamsTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6B5E4E] dark:text-[#A99F8D] leading-relaxed">
              {t.adamsSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#7A6E5E] dark:text-[#C5BAA8] pt-1">
              <span className="font-semibold text-[#800020] dark:text-[#D4AF37] flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>
                  {userEnteredSynchronizedEvents.length} {t.adamsYourEventsCount}
                </span>
              </span>
              {excludedUncertainEventsCount > 0 && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[11px] font-medium"
                  title={
                    isRTL
                      ? "تم استبعاد الأحداث غير المؤكدة تاريخياً لتطبيق معايير الدقة التزامنية"
                      : "Uncertain / approximate events are omitted per chronological certainty rules"
                  }
                >
                  <ShieldCheck size={12} className="text-amber-600 dark:text-amber-400" />
                  <span>
                    {isRTL
                      ? `تم استبعاد ${excludedUncertainEventsCount} حدث غير مؤكد`
                      : `${excludedUncertainEventsCount} uncertain event(s) omitted`}
                  </span>
                </span>
              )}
              <span aria-hidden="true" className="opacity-40">·</span>
              <span>{realWorldHistoricalEvents.length} {t.adamsWorldEventsCount}</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span>7 {t.adamsCivilizationsCount}</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span className="font-mono">4004 BC — 33 AD</span>
            </div>
          </div>

          {/* View Mode Segmented Controls */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/80 dark:bg-[#1C1A17] border border-[#D4AF37]/50 shadow-inner self-start md:self-center">
            <button
              type="button"
              onClick={() => setViewMode("streams")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "streams"
                  ? "bg-[#800020] text-[#F3E5AB] shadow-sm"
                  : "text-[#6B5E4E] dark:text-[#A99F8D] hover:text-[#800020] dark:hover:text-[#F3E5AB]"
              }`}
            >
              <Layers size={14} />
              <span>{t.adamsViewStreams}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "matrix"
                  ? "bg-[#800020] text-[#F3E5AB] shadow-sm"
                  : "text-[#6B5E4E] dark:text-[#A99F8D] hover:text-[#800020] dark:hover:text-[#F3E5AB]"
              }`}
            >
              <Calendar size={14} />
              <span>{t.adamsViewMatrix}</span>
            </button>
          </div>
        </div>

        {/* Adams Method Informational Notice */}
        {showNotice && (
          <div className="mt-4 pt-3.5 border-t border-[#D4AF37]/30 flex items-start justify-between gap-3 text-xs text-[#5D5245] dark:text-[#B3A897] bg-[#D4AF37]/10 dark:bg-[#D4AF37]/5 p-3 rounded-xl">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-[#800020] dark:text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#800020] dark:text-[#F3E5AB] block mb-0.5">
                  {t.adamsChartNotice}
                </strong>
                <p className="leading-relaxed">
                  {lang === "ar"
                    ? "تُعرض الآن الأحداث التي أدخلتها في مسار الكتاب المقدس، متزامنة أفقياً مع أحداث الحضارات العالمية المعاصرة (الفراعنة، بلاد الرافدين، آشور، فارس، اليونان، وروما) في نفس الفترة والتاريخ."
                    : "Your entered biblical events are now mapped onto the biblical track, precisely synchronized with contemporary world civilizations (Pharaohs of Egypt, Mesopotamia, Assyria, Persia, Greece, and Rome) for each period and date."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowNotice(false)}
              className="text-[#800020] dark:text-[#D4AF37] hover:opacity-75 p-1"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white/85 dark:bg-[#1C1A17]/85 backdrop-blur-md p-4 rounded-2xl border-2 border-[#D4AF37]/50 shadow-sm space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRTL ? "right-3" : "left-3"
              } text-[#7A6E5E] dark:text-[#A99F8D]`}
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.adamsSearchPlaceholder}
              className={`w-full ${
                isRTL ? "pr-9 pl-4" : "pl-9 pr-4"
              } py-2 rounded-xl border border-[#D4AF37]/60 bg-[#FBF8EF] dark:bg-[#121110] text-xs sm:text-sm text-[#2D2721] dark:text-[#E6E0D4] placeholder:text-[#9B8E7D] dark:placeholder:text-[#7A7062] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]`}
            />
          </div>

          {/* Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Focus on User's Entered Event Filter */}
            {userEnteredSynchronizedEvents.length > 0 && (
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="adams-entered-select"
                  className="text-xs font-semibold text-[#800020] dark:text-[#D4AF37] whitespace-nowrap flex items-center gap-1"
                >
                  <BookOpen size={13} />
                  <span>{t.adamsFilterByEnteredEvent}:</span>
                </label>
                <select
                  id="adams-entered-select"
                  value={selectedEnteredEventId}
                  onChange={(e) => {
                    setSelectedEnteredEventId(e.target.value);
                    if (e.target.value !== "all") {
                      setSelectedEraId("all");
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border-2 border-[#D4AF37] bg-[#FBF8EF] dark:bg-[#121110] text-xs font-bold text-[#800020] dark:text-[#F3E5AB] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
                >
                  <option value="all">{t.adamsAllEnteredEvents}</option>
                  {userEnteredSynchronizedEvents.map((evt) => (
                    <option key={`opt_${evt.id}`} value={evt.originalEventId}>
                      {lang === "ar" ? evt.titleAr : evt.titleEn} (
                      {lang === "ar" ? evt.yearDisplayAr : evt.yearDisplayEn})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Era Filter (when not locked to an entered event) */}
            {selectedEnteredEventId === "all" && (
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="adams-era-select"
                  className="text-xs font-semibold text-[#800020] dark:text-[#D4AF37] whitespace-nowrap"
                >
                  {t.adamsEraFilter}:
                </label>
                <select
                  id="adams-era-select"
                  value={selectedEraId}
                  onChange={(e) => setSelectedEraId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#D4AF37]/60 bg-[#FBF8EF] dark:bg-[#121110] text-xs font-medium text-[#2D2721] dark:text-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
                >
                  <option value="all">{t.adamsAllEras}</option>
                  {ADAMS_ERAS.map((era) => (
                    <option key={era.id} value={era.id}>
                      {lang === "ar" ? era.nameAr : era.nameEn} (
                      {lang === "ar" ? era.dateRangeAr : era.dateRangeEn})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Civilization Filter */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="adams-civ-select"
                className="text-xs font-semibold text-[#800020] dark:text-[#D4AF37] whitespace-nowrap"
              >
                {t.adamsCivilizationFilter}:
              </label>
              <select
                id="adams-civ-select"
                value={selectedCiv}
                onChange={(e) => setSelectedCiv(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#D4AF37]/60 bg-[#FBF8EF] dark:bg-[#121110] text-xs font-medium text-[#2D2721] dark:text-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
              >
                <option value="all">{t.adamsAllCivilizations}</option>
                {civTracks.map((civKey) => {
                  const info = CIVILIZATION_INFO[civKey];
                  return (
                    <option key={civKey} value={civKey}>
                      {info.icon} {lang === "ar" ? info.nameAr : info.nameEn}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Significance Filter */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="adams-significance-select"
                className="text-xs font-semibold text-[#800020] dark:text-[#D4AF37] whitespace-nowrap"
              >
                {t.adamsSignificance}:
              </label>
              <select
                id="adams-significance-select"
                value={selectedSignificance}
                onChange={(e) => setSelectedSignificance(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#D4AF37]/60 bg-[#FBF8EF] dark:bg-[#121110] text-xs font-medium text-[#2D2721] dark:text-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
              >
                <option value="all">{lang === "ar" ? "كافة المحطات" : "All Milestones"}</option>
                <option value="monumental">{t.adamsMonumental}</option>
                <option value="major">{t.adamsMajor}</option>
              </select>
            </div>

            {/* Clear filters button if active */}
            {(selectedEraId !== "all" ||
              selectedCiv !== "all" ||
              selectedEnteredEventId !== "all" ||
              selectedSignificance !== "all" ||
              searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedEraId("all");
                  setSelectedCiv("all");
                  setSelectedEnteredEventId("all");
                  setSelectedSignificance("all");
                  setSearchTerm("");
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#800020]/10 hover:bg-[#800020]/20 text-[#800020] dark:text-[#F3E5AB] text-xs font-semibold transition cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>{t.clearTypeFilter}</span>
              </button>
            )}
          </div>
        </div>

        {/* Civilization Quick Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D4AF37]/20 text-xs">
          <span className="font-semibold text-[#7A6E5E] dark:text-[#A99F8D]">
            {t.adamsCivilizationFilter}:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCiv("all")}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
              selectedCiv === "all"
                ? "bg-[#800020] text-[#F3E5AB] font-bold"
                : "bg-[#F3EEE0] dark:bg-[#25221F] text-[#4A3E31] dark:text-[#C5BAA8] hover:bg-[#EAE2D0]"
            }`}
          >
            {t.adamsAllCivilizations} ({allSynchronizedEvents.length})
          </button>
          {civTracks.map((civKey) => {
            const info = CIVILIZATION_INFO[civKey];
            const isSelected = selectedCiv === civKey;
            const count = allSynchronizedEvents.filter((e) => e.civilization === civKey).length;
            return (
              <button
                key={`civ_tag_${civKey}`}
                type="button"
                onClick={() => setSelectedCiv(isSelected ? "all" : civKey)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-[#D4AF37] font-bold"
                    : "opacity-85 hover:opacity-100"
                } ${info.bgBadge}`}
              >
                <span>{info.icon}</span>
                <span>{lang === "ar" ? info.nameAr : info.nameEn}</span>
                <span className="font-mono text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: Adams' Synchronological Multi-Track Stream Canvas */}
      {viewMode === "streams" && (
        <div className="relative rounded-2xl border-2 border-[#D4AF37]/60 bg-[#FAF7F0] dark:bg-[#161412] shadow-xl overflow-hidden">
          {/* Top Bar with Scale / Zoom Controls */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#D4AF37]/40 bg-[#F3EEE0]/80 dark:bg-[#1F1C18]/80 text-xs">
            <div className="flex items-center gap-2">
              <Compass size={15} className="text-[#800020] dark:text-[#D4AF37]" />
              <span className="font-semibold text-[#800020] dark:text-[#F3E5AB]">
                {focusedEnteredEvent
                  ? `${t.adamsUserEnteredBadge}: ${
                      lang === "ar" ? focusedEnteredEvent.titleAr : focusedEnteredEvent.titleEn
                    }`
                  : activeEra
                  ? lang === "ar"
                    ? activeEra.nameAr
                    : activeEra.nameEn
                  : t.adamsAllEras}
              </span>
              <span className="font-mono text-[#7A6E5E] dark:text-[#A99F8D]">
                ({formatYearDisplay(effectiveMinYear, lang)} —{" "}
                {formatYearDisplay(effectiveMaxYear, lang)})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#7A6E5E] dark:text-[#A99F8D]">
                {t.zoomLevel}: {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale((z) => Math.max(0.6, z - 0.2))}
                className="p-1 rounded-md bg-white dark:bg-[#25221F] border border-[#D4AF37]/50 hover:bg-[#F3EEE0] cursor-pointer"
                title={t.zoomOutAdams}
              >
                <ZoomOut size={14} />
              </button>
              <button
                type="button"
                onClick={() => setZoomScale((z) => Math.min(2.5, z + 0.2))}
                className="p-1 rounded-md bg-white dark:bg-[#25221F] border border-[#D4AF37]/50 hover:bg-[#F3EEE0] cursor-pointer"
                title={t.zoomInAdams}
              >
                <ZoomIn size={14} />
              </button>
              {zoomScale !== 1 && (
                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-[#25221F] border border-[#D4AF37]/50 hover:bg-[#F3EEE0] text-[11px] font-semibold cursor-pointer"
                >
                  {t.resetScaleAdams}
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Scroll Track Wrapper */}
          <div className="overflow-x-auto overflow-y-visible">
            <div
              className="relative p-4 select-none min-w-[1100px]"
              style={{
                width: `${Math.max(1100, Math.round(1400 * zoomScale))}px`,
              }}
            >
              {/* Year Scale Header Axis */}
              <div className="relative h-10 border-b-2 border-[#D4AF37] mb-4">
                {timelineTicks.map((yr) => {
                  const posPct = getEventPositionPct(yr);
                  return (
                    <div
                      key={`axis_tick_${yr}`}
                      className="absolute top-0 bottom-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                      style={{
                        [isRTL ? "right" : "left"]: `${posPct}%`,
                      }}
                    >
                      <span className="text-[11px] font-mono font-bold text-[#800020] dark:text-[#D4AF37] bg-[#FAF7F0] dark:bg-[#161412] px-1">
                        {formatYearDisplay(yr, lang)}
                      </span>
                      <div className="w-0.5 h-2 bg-[#D4AF37] mt-auto" />
                    </div>
                  );
                })}
              </div>

              {/* Parallel Civilization Streams */}
              <div className="space-y-3 relative">
                {civTracks.map((civKey) => {
                  const info = CIVILIZATION_INFO[civKey];
                  const civEvents = filteredEvents.filter((e) => e.civilization === civKey);

                  return (
                    <div
                      key={`civ_stream_${civKey}`}
                      className={`relative rounded-xl border p-2.5 transition-colors ${
                        civKey === "biblical"
                          ? "border-2 border-[#800020] dark:border-[#D4AF37] bg-[#800020]/5 dark:bg-[#D4AF37]/5"
                          : "border-[#D4AF37]/30 bg-white/70 dark:bg-[#1C1A17]/70 hover:border-[#D4AF37]"
                      }`}
                    >
                      {/* Civilization Ribbon Label */}
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{info.icon}</span>
                          <span
                            className="font-bold font-cinzel text-xs tracking-wide"
                            style={{ color: info.color }}
                          >
                            {lang === "ar" ? info.nameAr : info.nameEn}
                          </span>
                          {civKey === "biblical" && (
                            <span className="px-2 py-0.5 rounded-md bg-[#800020] text-[#F3E5AB] font-mono text-[10px] font-bold">
                              {t.adamsYourEventsCount}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono opacity-65">
                          {civEvents.length} {t.eventsWord || "events"}
                        </span>
                      </div>

                      {/* Stream Horizontal Track */}
                      <div className="relative h-16 rounded-lg border border-dashed border-[#D4AF37]/40 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent overflow-visible">
                        {/* Vertical Tick Guide Lines */}
                        {timelineTicks.map((yr) => {
                          const posPct = getEventPositionPct(yr);
                          return (
                            <div
                              key={`grid_line_${civKey}_${yr}`}
                              className="absolute top-0 bottom-0 w-[1px] bg-[#D4AF37]/20 pointer-events-none"
                              style={{
                                [isRTL ? "right" : "left"]: `${posPct}%`,
                              }}
                            />
                          );
                        })}

                        {/* Event Nodes on this stream */}
                        {civEvents.map((evt) => {
                          const posPct = getEventPositionPct(evt.year);
                          const isHovered = hoveredEvent?.id === evt.id;
                          const isSelected = selectedEvent?.id === evt.id;
                          const isUser = evt.isUserEntered;

                          return (
                            <div
                              key={`stream_node_${evt.id}`}
                              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-pointer ${
                                isHovered ? "z-50" : "z-10"
                              }`}
                              style={{
                                [isRTL ? "right" : "left"]: `${posPct}%`,
                              }}
                              onClick={() => setSelectedEvent(evt)}
                              onMouseEnter={() => setHoveredEvent(evt)}
                              onMouseLeave={() => setHoveredEvent(null)}
                            >
                              {/* Event Badge / Marker */}
                              <div
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shadow-sm transition-all duration-150 ${
                                  isUser
                                    ? "ring-2 ring-[#800020] dark:ring-[#D4AF37] font-bold"
                                    : ""
                                } ${
                                  isSelected
                                    ? "ring-2 ring-[#D4AF37] scale-105 shadow-md"
                                    : isHovered
                                    ? "scale-105 shadow-md"
                                    : "hover:scale-102"
                                }`}
                                style={{
                                  backgroundColor:
                                    isSelected || isHovered
                                      ? info.color
                                      : isUser
                                      ? "#FBF8EF"
                                      : "#FFFFFF",
                                  borderColor: isUser ? "#800020" : info.borderColor,
                                  color:
                                    isSelected || isHovered
                                      ? "#FFFFFF"
                                      : isUser
                                      ? "#800020"
                                      : "#1A1A1A",
                                }}
                              >
                                <span className="font-mono text-[10px] font-bold shrink-0">
                                  {lang === "ar" ? evt.yearDisplayAr : evt.yearDisplayEn}
                                </span>
                                <span className={`text-xs font-semibold ${isHovered ? "max-w-none whitespace-nowrap" : "max-w-[130px] truncate"}`}>
                                  {lang === "ar" ? evt.titleAr : evt.titleEn}
                                </span>
                                {isUser && (
                                  <Sparkles size={11} className="text-[#D4AF37] shrink-0" />
                                )}
                              </div>

                              {/* Hover Quick Card Tooltip */}
                              {isHovered && (
                                <div
                                  className={`absolute bottom-full mb-2 w-72 p-3 rounded-xl border-2 border-[#D4AF37] bg-white dark:bg-[#1F1C18] text-[#2D2721] dark:text-[#E6E0D4] shadow-2xl z-50 text-xs pointer-events-none animate-fadeIn ${
                                    posPct > 70
                                      ? "-translate-x-3/4"
                                      : posPct < 30
                                      ? "-translate-x-1/4"
                                      : "-translate-x-1/2"
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#800020] dark:text-[#D4AF37] mb-1">
                                    <span>
                                      {lang === "ar" ? evt.yearDisplayAr : evt.yearDisplayEn}
                                    </span>
                                    <span>
                                      {isUser ? "📜 " + t.adamsUserEnteredBadge : info.icon}
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-sm text-[#800020] dark:text-[#F3E5AB] mb-1">
                                    {lang === "ar" ? evt.titleAr : evt.titleEn}
                                  </h4>
                                  {evt.rulerOrLeaderEn && (
                                    <div className="text-[11px] font-medium text-[#7A6E5E] dark:text-[#A99F8D] mb-1">
                                      👑 {lang === "ar" ? evt.rulerOrLeaderAr : evt.rulerOrLeaderEn}
                                    </div>
                                  )}
                                  {evt.location && (
                                    <div className="text-[10px] text-[#7A6E5E] dark:text-[#A99F8D] mb-1 flex items-center gap-1">
                                      <MapPin size={10} />
                                      <span>{evt.location}</span>
                                    </div>
                                  )}
                                  <p className="text-[11px] line-clamp-3 leading-relaxed mb-2 opacity-90">
                                    {lang === "ar" ? evt.descriptionAr : evt.descriptionEn}
                                  </p>
                                  {evt.biblicalSynchronismEn && (
                                    <div className="pt-1.5 border-t border-[#D4AF37]/30 text-[10px] text-[#800020] dark:text-[#D4AF37]">
                                      <strong>🏛️ {t.adamsConcurrentWorldEvents}: </strong>
                                      <span className="line-clamp-2">
                                        {lang === "ar"
                                          ? evt.biblicalSynchronismAr
                                          : evt.biblicalSynchronismEn}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Year Scale Axis */}
              <div className="relative h-8 border-t-2 border-[#D4AF37] mt-4 pt-1">
                {timelineTicks.map((yr) => {
                  const posPct = getEventPositionPct(yr);
                  return (
                    <div
                      key={`axis_bottom_tick_${yr}`}
                      className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                      style={{
                        [isRTL ? "right" : "left"]: `${posPct}%`,
                      }}
                    >
                      <div className="w-0.5 h-2 bg-[#D4AF37] mb-0.5" />
                      <span className="text-[10px] font-mono text-[#7A6E5E] dark:text-[#A99F8D]">
                        {formatYearDisplay(yr, lang)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Comparative Matrix View */}
      {viewMode === "matrix" && (
        <div className="space-y-6">
          {/* Sub-grouping switcher: Group by User's Entered Events vs Group by Eras */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/80 dark:bg-[#1C1A17] border border-[#D4AF37]/50 shadow-xs">
            <span className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
              {lang === "ar" ? "طريقة عرض المقارنة التاريخية:" : "Comparative Grouping Mode:"}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMatrixGrouping("enteredEvents")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  matrixGrouping === "enteredEvents"
                    ? "bg-[#800020] text-[#F3E5AB] shadow-xs"
                    : "text-[#6B5E4E] dark:text-[#A99F8D] hover:bg-[#800020]/10"
                }`}
              >
                {t.adamsGroupByEntered} ({userEnteredSynchronizedEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setMatrixGrouping("eras")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  matrixGrouping === "eras"
                    ? "bg-[#800020] text-[#F3E5AB] shadow-xs"
                    : "text-[#6B5E4E] dark:text-[#A99F8D] hover:bg-[#800020]/10"
                }`}
              >
                {t.adamsGroupByEras} (7)
              </button>
            </div>
          </div>

          {/* Grouping 1: Group by User's Entered Events */}
          {matrixGrouping === "enteredEvents" && (
            <div className="space-y-8">
              {eventsGroupedByEnteredEvents.map(({ enteredEvent, concurrentEvents }) => (
                <div
                  key={`user_grp_${enteredEvent.id}`}
                  className="rounded-2xl border-2 border-[#800020] dark:border-[#D4AF37] bg-white/90 dark:bg-[#1A1815] shadow-lg p-5 sm:p-6 space-y-5"
                >
                  {/* Entered Event Anchor Banner */}
                  <div className="p-4 rounded-xl border border-[#D4AF37]/50 bg-gradient-to-r from-[#800020]/15 via-[#FBF8EF] to-[#D4AF37]/15 dark:from-[#2A1810] dark:via-[#161412] dark:to-[#121E2E] flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#800020] text-[#F3E5AB] text-[11px] font-bold font-mono">
                          {t.adamsUserEnteredBadge}
                        </span>
                        <span className="font-mono font-bold text-sm text-[#800020] dark:text-[#D4AF37]">
                          {lang === "ar" ? enteredEvent.yearDisplayAr : enteredEvent.yearDisplayEn}
                        </span>
                        {enteredEvent.location && (
                          <span className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] flex items-center gap-1">
                            <MapPin size={11} />
                            <span>{enteredEvent.location}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                        {lang === "ar" ? enteredEvent.titleAr : enteredEvent.titleEn}
                      </h3>
                      {enteredEvent.rulerOrLeaderEn && (
                        <div className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] flex items-center gap-1">
                          <Users size={12} />
                          <span>
                            {lang === "ar"
                              ? enteredEvent.rulerOrLeaderAr
                              : enteredEvent.rulerOrLeaderEn}
                          </span>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-[#4A3E31] dark:text-[#D4AF37]/90 leading-relaxed pt-1">
                        {lang === "ar" ? enteredEvent.descriptionAr : enteredEvent.descriptionEn}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedEvent(enteredEvent)}
                      className="self-start md:self-center px-3.5 py-1.5 rounded-xl bg-[#800020] hover:bg-[#6A001A] text-[#F3E5AB] text-xs font-bold transition shadow cursor-pointer whitespace-nowrap"
                    >
                      {lang === "ar" ? "تفاصيل الحدث ↗" : "Event Dossier ↗"}
                    </button>
                  </div>

                  {/* Concurrent Real World History Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37] flex items-center gap-1.5">
                        <Landmark size={14} />
                        <span>{t.adamsConcurrentWorldEvents}:</span>
                      </h4>
                      <span className="text-xs font-mono text-[#7A6E5E] dark:text-[#A99F8D]">
                        {concurrentEvents.length} {lang === "ar" ? "أحداث عالمية معاصرة" : "contemporary world events"}
                      </span>
                    </div>

                    {concurrentEvents.length === 0 ? (
                      <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] italic p-3 rounded-lg bg-[#FAF7F0] dark:bg-[#121110]">
                        {lang === "ar"
                          ? "لا توجد أحداث تاريخية عالمية موثقة في هذا النطاق الزمني القريب."
                          : "No recorded world history events in this specific narrow period."}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {concurrentEvents.map((wEvt) => {
                          const civInfo = CIVILIZATION_INFO[wEvt.civilization];
                          return (
                            <div
                              key={`sync_card_${wEvt.id}`}
                              onClick={() => setSelectedEvent(wEvt)}
                              className="group flex flex-col justify-between rounded-xl border border-[#D4AF37]/40 bg-[#FBF8EF] dark:bg-[#141210] p-3.5 shadow-xs hover:shadow-md hover:border-[#D4AF37] transition cursor-pointer"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-mono font-bold text-[#800020] dark:text-[#D4AF37]">
                                    {lang === "ar" ? wEvt.yearDisplayAr : wEvt.yearDisplayEn}
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${civInfo.bgBadge}`}
                                  >
                                    <span>{civInfo.icon}</span>
                                    <span>{lang === "ar" ? civInfo.nameAr : civInfo.nameEn}</span>
                                  </span>
                                </div>
                                <h5 className="font-bold text-xs sm:text-sm text-[#1C1A17] dark:text-[#F3E5AB] group-hover:text-[#800020] dark:group-hover:text-[#D4AF37] transition-colors">
                                  {lang === "ar" ? wEvt.titleAr : wEvt.titleEn}
                                </h5>
                                {wEvt.rulerOrLeaderEn && (
                                  <div className="text-[11px] text-[#7A6E5E] dark:text-[#A99F8D] font-medium">
                                    👑 {lang === "ar" ? wEvt.rulerOrLeaderAr : wEvt.rulerOrLeaderEn}
                                  </div>
                                )}
                                <p className="text-[11px] text-[#4A3E31] dark:text-[#C5BAA8] line-clamp-2 leading-relaxed">
                                  {lang === "ar" ? wEvt.descriptionAr : wEvt.descriptionEn}
                                </p>
                              </div>

                              <div className="pt-2 mt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] text-[#800020] dark:text-[#D4AF37] font-semibold">
                                <span>{lang === "ar" ? "عرض الأثر والتوثيق" : "Inspect Artifacts"}</span>
                                <ChevronRight
                                  size={13}
                                  className={`group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${
                                    isRTL ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grouping 2: Group by Universal Eras */}
          {matrixGrouping === "eras" && (
            <div className="space-y-8">
              {eventsByEra.map(({ era, events }) => (
                <div
                  key={`era_section_${era.id}`}
                  className="rounded-2xl border-2 border-[#D4AF37]/60 bg-white/80 dark:bg-[#1A1815]/90 shadow-md p-4 sm:p-6 space-y-4"
                >
                  {/* Era Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-[#D4AF37]/40">
                    <div>
                      <div className="flex items-center gap-2">
                        <Landmark size={20} className="text-[#800020] dark:text-[#D4AF37]" />
                        <h3 className="text-lg sm:text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                          {lang === "ar" ? era.nameAr : era.nameEn}
                        </h3>
                      </div>
                      <p className="text-xs text-[#6B5E4E] dark:text-[#A99F8D] mt-1 max-w-3xl">
                        {lang === "ar" ? era.descriptionAr : era.descriptionEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center font-mono font-bold text-xs bg-[#800020]/10 dark:bg-[#D4AF37]/15 text-[#800020] dark:text-[#F3E5AB] px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 shrink-0">
                      <Calendar size={13} />
                      <span>{lang === "ar" ? era.dateRangeAr : era.dateRangeEn}</span>
                    </div>
                  </div>

                  {/* Grid of Events in Era */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((evt) => {
                      const civInfo = CIVILIZATION_INFO[evt.civilization];
                      return (
                        <div
                          key={`card_${evt.id}`}
                          onClick={() => setSelectedEvent(evt)}
                          className={`group flex flex-col justify-between rounded-xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                            evt.isUserEntered
                              ? "border-2 border-[#800020] dark:border-[#D4AF37] bg-[#FAF5E8] dark:bg-[#201D1A]"
                              : "border-[#D4AF37]/40 bg-[#FBF8EF] dark:bg-[#141210] hover:border-[#D4AF37]"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="font-mono font-bold text-[#800020] dark:text-[#D4AF37]">
                                {lang === "ar" ? evt.yearDisplayAr : evt.yearDisplayEn}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${civInfo.bgBadge}`}
                              >
                                <span>{civInfo.icon}</span>
                                <span>{lang === "ar" ? civInfo.nameAr : civInfo.nameEn}</span>
                              </span>
                            </div>

                            <h4 className="font-bold text-sm text-[#1C1A17] dark:text-[#F3E5AB] group-hover:text-[#800020] dark:group-hover:text-[#D4AF37] transition-colors leading-snug">
                              {lang === "ar" ? evt.titleAr : evt.titleEn}
                            </h4>

                            {evt.rulerOrLeaderEn && (
                              <div className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] font-medium">
                                👑 {lang === "ar" ? evt.rulerOrLeaderAr : evt.rulerOrLeaderEn}
                              </div>
                            )}

                            <p className="text-xs text-[#4A3E31] dark:text-[#C5BAA8] line-clamp-3 leading-relaxed">
                              {lang === "ar" ? evt.descriptionAr : evt.descriptionEn}
                            </p>

                            {evt.biblicalSynchronismEn && (
                              <div className="p-2.5 rounded-lg bg-[#800020]/10 dark:bg-[#D4AF37]/10 border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#800020] dark:border-[#D4AF37] text-xs text-[#800020] dark:text-[#F3E5AB] space-y-1">
                                <div className="flex items-center gap-1 font-bold text-[11px]">
                                  <BookOpen size={12} />
                                  <span>{t.adamsBiblicalSynchronism}</span>
                                </div>
                                <p className="text-[11px] leading-relaxed line-clamp-2">
                                  {lang === "ar"
                                    ? evt.biblicalSynchronismAr
                                    : evt.biblicalSynchronismEn}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="pt-3 mt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-[#800020] dark:text-[#D4AF37] font-semibold">
                            <span>{lang === "ar" ? "عرض التفاصيل الكاملة" : "Inspect Dossier"}</span>
                            <ChevronRight
                              size={15}
                              className={`group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${
                                isRTL ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: Comprehensive Adams Historical Dossier */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-[#D4AF37] bg-[#FAF7F0] dark:bg-[#1A1815] text-[#2D2721] dark:text-[#E6E0D4] shadow-2xl p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#D4AF37]/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl">
                    {CIVILIZATION_INFO[selectedEvent.civilization].icon}
                  </span>
                  <span className="font-mono font-bold text-sm text-[#800020] dark:text-[#D4AF37]">
                    {lang === "ar" ? selectedEvent.yearDisplayAr : selectedEvent.yearDisplayEn}
                  </span>
                  <span aria-hidden="true" className="opacity-40">·</span>
                  <span className="text-xs font-semibold text-[#7A6E5E] dark:text-[#A99F8D]">
                    {lang === "ar"
                      ? CIVILIZATION_INFO[selectedEvent.civilization].nameAr
                      : CIVILIZATION_INFO[selectedEvent.civilization].nameEn}
                  </span>
                  {selectedEvent.isUserEntered && (
                    <span className="px-2 py-0.5 rounded-md bg-[#800020] text-[#F3E5AB] font-mono text-[10px] font-bold">
                      {t.adamsUserEnteredBadge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                  {lang === "ar" ? selectedEvent.titleAr : selectedEvent.titleEn}
                </h3>
                {selectedEvent.rulerOrLeaderEn && (
                  <div className="text-xs font-medium text-[#7A6E5E] dark:text-[#A99F8D] pt-0.5">
                    👑 {t.rulerOrLeaderLabel}:{" "}
                    <strong className="text-[#2D2721] dark:text-[#E6E0D4]">
                      {lang === "ar"
                        ? selectedEvent.rulerOrLeaderAr
                        : selectedEvent.rulerOrLeaderEn}
                    </strong>
                  </div>
                )}
                {selectedEvent.location && (
                  <div className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg border border-[#D4AF37]/50 hover:bg-[#800020]/10 text-[#800020] dark:text-[#F3E5AB] cursor-pointer"
                title={t.adamsClose}
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#800020] dark:text-[#D4AF37]">
                {lang === "ar" ? "الحدث التاريخي وتفاصيله" : "Historical Event & Chronicles"}
              </h4>
              <p className="text-sm leading-relaxed text-[#3D3328] dark:text-[#D9D1C3]">
                {lang === "ar" ? selectedEvent.descriptionAr : selectedEvent.descriptionEn}
              </p>
            </div>

            {/* Biblical Synchronism / Concurrent World Events */}
            {selectedEvent.biblicalSynchronismEn && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#800020]/15 to-[#D4AF37]/15 border-2 border-[#D4AF37]/60 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#800020] dark:text-[#F3E5AB]">
                  <BookOpen size={16} />
                  <span>
                    {selectedEvent.isUserEntered
                      ? t.adamsConcurrentWorldEvents
                      : t.adamsBiblicalSynchronism}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#4A3E31] dark:text-[#E6E0D4]">
                  {lang === "ar"
                    ? selectedEvent.biblicalSynchronismAr
                    : selectedEvent.biblicalSynchronismEn}
                </p>
                {selectedEvent.biblicalReferences && selectedEvent.biblicalReferences.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-[11px] font-semibold text-[#800020] dark:text-[#D4AF37]">
                      {lang === "ar" ? "الشواهد الكتابية:" : "Biblical Citations:"}
                    </span>
                    {selectedEvent.biblicalReferences.map((ref, idx) => (
                      <span
                        key={`ref_${idx}`}
                        className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-[#121110] border border-[#D4AF37]/40 text-xs font-mono font-medium text-[#800020] dark:text-[#F3E5AB]"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Archaeological Proof & Artifacts */}
            {selectedEvent.archaeologicalEvidenceEn && (
              <div className="p-4 rounded-xl bg-emerald-950/10 dark:bg-emerald-950/30 border border-emerald-600/40 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck size={16} />
                  <span>{t.adamsArchaeologicalEvidence}</span>
                </div>
                <p className="text-xs leading-relaxed text-[#3D3328] dark:text-[#C5BAA8]">
                  {lang === "ar"
                    ? selectedEvent.archaeologicalEvidenceAr
                    : selectedEvent.archaeologicalEvidenceEn}
                </p>
              </div>
            )}

            {/* Contemporaneous World Events */}
            {contemporaneousEvents.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#800020] dark:text-[#D4AF37]">
                  {t.adamsRelatedEvents}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {contemporaneousEvents.map((ce) => (
                    <button
                      key={`rel_${ce.id}`}
                      type="button"
                      onClick={() => setSelectedEvent(ce)}
                      className="text-start p-2.5 rounded-lg border border-[#D4AF37]/40 bg-white/60 dark:bg-[#141210] hover:bg-white dark:hover:bg-[#201D1A] transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#800020] dark:text-[#D4AF37]">
                        <span>{lang === "ar" ? ce.yearDisplayAr : ce.yearDisplayEn}</span>
                        <span>{CIVILIZATION_INFO[ce.civilization].icon}</span>
                      </div>
                      <div className="text-xs font-bold text-[#1C1A17] dark:text-[#F3E5AB] truncate mt-0.5">
                        {lang === "ar" ? ce.titleAr : ce.titleEn}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-3 border-t border-[#D4AF37]/40 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#6A001A] text-[#F3E5AB] font-bold text-xs shadow transition cursor-pointer"
              >
                {t.adamsClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
