import { useState, useMemo, useRef, useEffect } from "react";
import type { Person, BiblicalEvent, Language } from "../types/genealogy";
import {
  UI_TRANSLATIONS,
  getPersonDisplayName,
  getEventDisplayTitle,
  formatYearDisplay,
  localizeBiblicalReference,
} from "../utils/i18n";
import { Clock, Sparkles, Heart, Users } from "lucide-react";
import { CopticCross } from "../components/Coptic/CopticCross";
import {
  TimelineControls,
} from "../components/Timeline/TimelineControls";
import {
  TimelineMinimap,
} from "../components/Timeline/TimelineMinimap";
import {
  TimelineDetailModal,
} from "../components/Timeline/TimelineDetailModal";
import {
  BIBLICAL_ERAS,
  type EraId,
  type TimelineViewMode,
  type TimelinePersonItem,
  type TimelineEventItem,
  type TimelineMarriageItem,
  type TimelineSelectedItem,
  getBirthYear,
  isBirthYearEstimated,
  packIntoLanes,
  deriveMarriages,
  generateTicks,
} from "../components/Timeline/timelineUtils";

type TimelinePageProps = {
  people: Person[];
  events: BiblicalEvent[];
  lang?: Language;
};

export default function TimelinePage({
  people,
  events,
  lang = "en",
}: TimelinePageProps) {
  const [selectedItem, setSelectedItem] = useState<TimelineSelectedItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<TimelineViewMode>("compact");
  const [selectedEra, setSelectedEra] = useState<EraId>("all");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFitToScreen, setIsFitToScreen] = useState<boolean>(true);

  // Layer visibility toggles
  const [showFigures, setShowFigures] = useState<boolean>(true);
  const [showMarriages, setShowMarriages] = useState<boolean>(true);
  const [showEvents, setShowEvents] = useState<boolean>(true);

  // Hovered item tooltip state
  const [hoveredTooltip, setHoveredTooltip] = useState<{
    item: TimelineSelectedItem;
    x: number;
    y: number;
  } | null>(null);

  // Interactive Hover Year Pointer State (tracks exact cursor position without RTL inversion)
  const [hoverPointer, setHoverPointer] = useState<{
    x: number;
    y: number;
    year: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1100);

  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  // Measure container width dynamically via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.floor(entry.contentRect.width));
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 1. Process People with Lifespans & Parent Relationship
  const peopleWithLifespans = useMemo<TimelinePersonItem[]>(() => {
    const list = people.map((person) => {
      const birthYear = getBirthYear(person, people);
      const isEstimated = isBirthYearEstimated(person);
      const pAny = person as any;
      const duration =
        person.yearsLived ||
        pAny.lifespan ||
        (person.death?.year !== undefined ? person.death.year - birthYear : 70);
      const deathYear = birthYear + duration;

      const fatherId = person.fatherId || person.anchorPersonId || pAny.parentId || pAny.father_id;
      const father = fatherId ? people.find((p) => p.id === fatherId) : undefined;
      const fatherName = father ? getPersonDisplayName(father, lang) : undefined;

      return {
        person,
        birthYear,
        deathYear,
        duration,
        startYear: birthYear,
        endYear: deathYear,
        isEstimatedBirth: isEstimated,
        fatherId,
        fatherName,
      };
    });

    return list.sort((a, b) => a.birthYear - b.birthYear);
  }, [people, lang]);

  // 2. Process Marriages
  const derivedMarriagesList = useMemo<TimelineMarriageItem[]>(() => {
    return deriveMarriages(people, peopleWithLifespans);
  }, [people, peopleWithLifespans]);

  // 3. Process Events
  const validEvents = useMemo<TimelineEventItem[]>(() => {
    return events
      .filter((e) => e.date?.year !== undefined)
      .map((event) => ({
        event,
        year: event.date!.year!,
        startYear: event.date!.year!,
        endYear: event.date!.year! + 25,
      }))
      .sort((a, b) => a.year - b.year);
  }, [events]);

  // Determine full historical bounds
  const { fullMinYear, fullMaxYear } = useMemo(() => {
    const allYears: number[] = [
      ...peopleWithLifespans.map((p) => p.birthYear),
      ...peopleWithLifespans.map((p) => p.deathYear),
      ...validEvents.map((e) => e.year),
      ...derivedMarriagesList.map((m) => m.year),
    ];

    const rawMin = allYears.length ? Math.min(...allYears) : -4004;
    const rawMax = allYears.length ? Math.max(...allYears) : -400;

    return {
      fullMinYear: Math.floor(rawMin / 100) * 100,
      fullMaxYear: Math.ceil(rawMax / 100) * 100,
    };
  }, [peopleWithLifespans, validEvents, derivedMarriagesList]);

  // Active date bounds based on Selected Era
  const { minYear, maxYear } = useMemo(() => {
    const eraDef = BIBLICAL_ERAS.find((e) => e.id === selectedEra);
    if (!eraDef || eraDef.id === "all") {
      return { minYear: fullMinYear, maxYear: fullMaxYear };
    }
    return { minYear: eraDef.minYear, maxYear: eraDef.maxYear };
  }, [selectedEra, fullMinYear, fullMaxYear]);

  // Filter items according to Era and Search Term
  const term = searchTerm.trim().toLowerCase();

  const eraFilteredPeople = useMemo(() => {
    return peopleWithLifespans.filter((p) => {
      // Must overlap with active minYear and maxYear
      return p.deathYear >= minYear && p.birthYear <= maxYear;
    });
  }, [peopleWithLifespans, minYear, maxYear]);

  const filteredPeople = useMemo(() => {
    if (!term) return eraFilteredPeople;
    return eraFilteredPeople.filter(({ person }) => {
      const nameMatch = person.name.toLowerCase().includes(term);
      const arMatch = (person.arabicName || "").toLowerCase().includes(term);
      const notesMatch = (person.notes || "").toLowerCase().includes(term);
      const arNotesMatch = ((person as any).arabicNotes || "").toLowerCase().includes(term);
      return nameMatch || arMatch || notesMatch || arNotesMatch;
    });
  }, [eraFilteredPeople, term]);

  const filteredMarriages = useMemo(() => {
    return derivedMarriagesList.filter((m) => {
      const inEra = m.year >= minYear && m.year <= maxYear;
      if (!inEra) return false;
      if (!term) return true;
      const titleMatch = m.title.toLowerCase().includes(term);
      const arMatch = m.arabicTitle.toLowerCase().includes(term);
      const hMatch = m.husbandName.toLowerCase().includes(term);
      const wMatch = m.wifeName.toLowerCase().includes(term);
      return titleMatch || arMatch || hMatch || wMatch;
    });
  }, [derivedMarriagesList, minYear, maxYear, term]);

  const filteredEvents = useMemo(() => {
    return validEvents.filter(({ event, year }) => {
      const inEra = year >= minYear && year <= maxYear;
      if (!inEra) return false;
      if (!term) return true;
      const titleMatch = event.title.toLowerCase().includes(term);
      const arMatch = (event.arabicTitle || "").toLowerCase().includes(term);
      const descMatch = (event.description || "").toLowerCase().includes(term);
      return titleMatch || arMatch || descMatch;
    });
  }, [validEvents, minYear, maxYear, term]);

  // Timeline Scale & Geometry
  const ticks = useMemo(() => generateTicks(minYear, maxYear), [minYear, maxYear]);
  const totalYears = maxYear - minYear || 1;

  // Responsive dynamic width calculation
  const timelineTrackWidth = useMemo(() => {
    const baseWidth = Math.max(760, containerWidth - 24);
    if (isFitToScreen) {
      return baseWidth;
    }
    return Math.max(baseWidth, Math.round(baseWidth * zoomLevel));
  }, [containerWidth, isFitToScreen, zoomLevel]);

  const getPosPx = (year: number) => {
    const ratio = (year - minYear) / totalYears;
    return Math.max(0, Math.min(timelineTrackWidth, ratio * timelineTrackWidth));
  };

  const getWidthPx = (duration: number) => {
    const px = (duration / totalYears) * timelineTrackWidth;
    return Math.max(16, Math.min(timelineTrackWidth, px));
  };

  // Prepare People Items with Visual Width so packIntoLanes leaves room for full names
  const peopleWithVisualWidths = useMemo(() => {
    return filteredPeople.map((item) => {
      const displayName = getPersonDisplayName(item.person, lang);
      const minNameWidthPx = Math.max(92, Math.ceil(displayName.length * 8 + 36));
      // Convert minNameWidthPx to equivalent timeline years
      const visualYears = (minNameWidthPx / timelineTrackWidth) * totalYears;
      const visualEndYear = item.birthYear + Math.max(item.duration, visualYears);

      return {
        ...item,
        startYear: item.birthYear,
        endYear: visualEndYear,
      };
    });
  }, [filteredPeople, lang, timelineTrackWidth, totalYears]);

  // Smart Lane Packing: Packs people into lanes while placing children directly in lanes under their father!
  const { packedPeopleLanes, peopleLaneCount } = useMemo(() => {
    const buffer = Math.max(15, Math.round((maxYear - minYear) * 0.01));
    const personLaneMap = new Map<string, number>();

    const result = packIntoLanes(peopleWithVisualWidths, buffer, (item, lanes) => {
      // If item has a father already placed in a lane, try the lane directly below the father
      if (item.fatherId && personLaneMap.has(item.fatherId)) {
        const fatherLane = personLaneMap.get(item.fatherId)!;
        const candidateLane = fatherLane + 1;
        if (candidateLane < lanes.length) {
          const targetLane = lanes[candidateLane];
          if (item.startYear >= targetLane.lastEndYear + buffer) {
            return candidateLane;
          }
        }
      }
      return undefined;
    });

    // Record placed lanes in map
    result.lanes.forEach((lane, lIdx) => {
      lane.forEach((item) => {
        personLaneMap.set(item.person.id, lIdx);
      });
    });

    return {
      packedPeopleLanes: result.lanes,
      peopleLaneCount: result.laneCount,
    };
  }, [peopleWithVisualWidths, minYear, maxYear]);

  const { packedMarriagesLanes, marriagesLaneCount } = useMemo(() => {
    const buffer = Math.max(25, Math.round((maxYear - minYear) * 0.02));
    const result = packIntoLanes(filteredMarriages, buffer);
    return {
      packedMarriagesLanes: result.lanes,
      marriagesLaneCount: result.laneCount,
    };
  }, [filteredMarriages, minYear, maxYear]);

  const { packedEventsLanes, eventsLaneCount } = useMemo(() => {
    const buffer = Math.max(25, Math.round((maxYear - minYear) * 0.02));
    const result = packIntoLanes(filteredEvents, buffer);
    return {
      packedEventsLanes: result.lanes,
      eventsLaneCount: result.laneCount,
    };
  }, [filteredEvents, minYear, maxYear]);

  // Zoom handlers
  const handleFitToScreen = () => {
    setIsFitToScreen(true);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setIsFitToScreen(false);
    setZoomLevel((prev) => Math.min(3.5, Number((prev + 0.35).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(1, Number((prev - 0.35).toFixed(2)));
      if (next <= 1) setIsFitToScreen(true);
      return next;
    });
  };

  const handleResetZoom = () => {
    setIsFitToScreen(true);
    setZoomLevel(1);
    setSelectedEra("all");
    setSearchTerm("");
  };

  const handleEraChange = (era: EraId) => {
    setSelectedEra(era);
    setIsFitToScreen(true);
    setZoomLevel(1);
  };

  // Hover crosshair tracking: calculates exact year and pixel distance from left edge
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clampedX = Math.max(0, Math.min(timelineTrackWidth, x));

    // In RTL, the earliest year (-4004 BC) is on the right edge, latest (-400 BC) on the left
    let ratio = clampedX / timelineTrackWidth;
    if (isRTL) {
      ratio = 1 - ratio;
    }

    const calculatedYear = Math.round(minYear + ratio * totalYears);
    setHoverPointer({ x: clampedX, y, year: calculatedYear });
  };

  const handleMouseLeave = () => {
    setHoverPointer(null);
    setHoveredTooltip(null);
  };

  // Check if a person is actively matched by search
  const isMatch = (person: Person) => {
    if (!term) return false;
    const nameMatch = person.name.toLowerCase().includes(term);
    const arMatch = (person.arabicName || "").toLowerCase().includes(term);
    return nameMatch || arMatch;
  };

  return (
    <div
      ref={containerRef}
      className="space-y-4 animate-fadeIn select-none"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#800020]/15 via-[#FBF8EF] to-[#1A365D]/15 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#1A365D]/25 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <CopticCross size={26} />
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
              {t.navLifespans}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B5E4E] dark:text-[#A99F8D] mt-1 max-w-2xl leading-relaxed">
            {isRTL
              ? "استكشف تداخل أعمار الآباء والأحداث بمسارات متوازية مدمجة؛ حيث تظهر أسماء الشخصيات كاملة وتُوضع الشخصيات غير محددة تاريخ الميلاد تحت آبائها مباشرة."
              : "Explore biblical patriarch lifespans with bars fitted to names and figures of unspecified birth dates neatly positioned under their fathers."}
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold bg-white/80 dark:bg-[#121110] px-3.5 py-2 rounded-xl border border-[#D4AF37]/50 text-[#800020] dark:text-[#F3E5AB] shadow-xs shrink-0">
          <Clock size={15} className="text-[#D4AF37]" />
          <span>
            {formatYearDisplay(minYear, lang)} — {formatYearDisplay(maxYear, lang)}
          </span>
          <span className="text-[#8C6F12] opacity-80">
            ({Math.abs(maxYear - minYear)} {t.years})
          </span>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <TimelineControls
        lang={lang}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedEra={selectedEra}
        onEraChange={handleEraChange}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={handleFitToScreen}
        onResetZoom={handleResetZoom}
        isFitToScreen={isFitToScreen}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFigures={showFigures}
        onToggleFigures={() => setShowFigures(!showFigures)}
        showMarriages={showMarriages}
        onToggleMarriages={() => setShowMarriages(!showMarriages)}
        showEvents={showEvents}
        onToggleEvents={() => setShowEvents(!showEvents)}
        counts={{
          figures: filteredPeople.length,
          marriages: filteredMarriages.length,
          events: filteredEvents.length,
          matchedFigures: term
            ? filteredPeople.filter((p) => isMatch(p.person)).length
            : undefined,
        }}
      />

      {/* Mini-Map Scrubber Bar (Bird's-eye view across 4000 years) */}
      <TimelineMinimap
        lang={lang}
        fullMinYear={fullMinYear}
        fullMaxYear={fullMaxYear}
        currentMinYear={minYear}
        currentMaxYear={maxYear}
        people={peopleWithLifespans}
        onSelectYearRange={(_newMin, _newMax) => {
          setSelectedEra("all");
          setIsFitToScreen(false);
          setZoomLevel(1.8);
        }}
      />

      {/* Main Timeline Canvas */}
      <div className="relative rounded-2xl border-2 border-[#D4AF37]/50 bg-white/80 dark:bg-[#1C1A17] shadow-lg overflow-hidden">
        {/* Horizontal Scroll Wrapper */}
        <div className="overflow-x-auto overflow-y-visible">
          <div
            className="relative py-4 px-3"
            style={{ width: `${timelineTrackWidth + (viewMode === "expanded" ? 220 : 40)}px` }}
          >
            {/* Header Time Ticks Bar */}
            <div
              className="relative h-9 border-b-2 border-[#D4AF37]/50 mb-3"
              style={{
                marginInlineStart: viewMode === "expanded" ? "220px" : "16px",
                width: `${timelineTrackWidth}px`,
              }}
            >
              {ticks.map((yr) => {
                const pos = getPosPx(yr);
                return (
                  <div
                    key={yr}
                    className={`absolute top-0 text-[11px] font-bold font-mono text-[#800020] dark:text-[#D4AF37] select-none whitespace-nowrap ${
                      isRTL ? "translate-x-1/2" : "-translate-x-1/2"
                    }`}
                    style={{ [isRTL ? "right" : "left"]: `${pos}px` }}
                  >
                    <div className="flex flex-col items-center">
                      <span>{formatYearDisplay(yr, lang)}</span>
                      <div className="w-0.5 h-2 bg-[#D4AF37]/60 mt-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Interactive Track */}
            <div
              ref={trackRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative cursor-crosshair min-h-[160px]"
              style={{
                marginInlineStart: viewMode === "expanded" ? "220px" : "16px",
                width: `${timelineTrackWidth}px`,
              }}
            >
              {/* Vertical Reference Grid Lines */}
              <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none z-0">
                {ticks.map((yr) => {
                  const pos = getPosPx(yr);
                  return (
                    <div
                      key={`grid_${yr}`}
                      className={`absolute top-0 bottom-0 w-px border-dashed border-[#D4AF37]/20 ${
                        isRTL ? "border-r" : "border-l"
                      }`}
                      style={{ [isRTL ? "right" : "left"]: `${pos}px` }}
                    />
                  );
                })}
              </div>

              {/* Hover Crosshair Vertical Line & Floating Year Badge (Fixed in RTL: Uses left: hoverPointer.x directly so it never inverts) */}
              {hoverPointer && (
                <>
                  <div
                    className="absolute top-0 bottom-0 pointer-events-none z-30 w-0.5 bg-[#800020] dark:bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                    style={{ left: `${hoverPointer.x}px` }}
                  />
                  <div
                    className="absolute pointer-events-none z-40 px-2.5 py-1 rounded-lg bg-[#800020] text-[#F3E5AB] text-[11px] font-bold font-mono shadow-xl border border-[#D4AF37] whitespace-nowrap flex items-center gap-1.5"
                    style={{
                      left: `${hoverPointer.x}px`,
                      transform: isRTL ? "translateX(-110%)" : "translateX(14px)",
                      top: `${Math.max(4, hoverPointer.y - 32)}px`,
                    }}
                  >
                    <Clock size={12} className="text-[#D4AF37]" />
                    <span>{formatYearDisplay(hoverPointer.year, lang)}</span>
                  </div>
                </>
              )}

              {/* Floating Detailed Hover Tooltip on Item */}
              {hoveredTooltip && (
                <div
                  className="absolute pointer-events-none z-50 p-3 rounded-xl bg-[#FBF8EF] dark:bg-[#121110] text-[#2D2721] dark:text-[#E6E0D4] text-xs shadow-2xl border-2 border-[#D4AF37] max-w-xs space-y-1.5"
                  style={{
                    [isRTL ? "right" : "left"]: `${Math.min(
                      timelineTrackWidth - 220,
                      Math.max(10, hoveredTooltip.x + 12)
                    )}px`,
                    top: `${Math.max(10, hoveredTooltip.y + 14)}px`,
                  }}
                >
                  <div className="font-bold font-cinzel text-sm text-[#800020] dark:text-[#F3E5AB] flex items-center gap-1.5">
                    {hoveredTooltip.item.type === "person" ? (
                      <Users size={14} className="text-[#800020] dark:text-[#D4AF37]" />
                    ) : hoveredTooltip.item.type === "event" ? (
                      <Sparkles size={14} className="text-[#1A365D] dark:text-[#90CDF4]" />
                    ) : (
                      <Heart size={14} className="text-[#800020]" />
                    )}
                    <span>
                      {hoveredTooltip.item.type === "person"
                        ? getPersonDisplayName(hoveredTooltip.item.data, lang)
                        : hoveredTooltip.item.type === "event"
                        ? getEventDisplayTitle(hoveredTooltip.item.data, lang)
                        : hoveredTooltip.item.data.title}
                    </span>
                  </div>

                  {hoveredTooltip.item.type === "person" && (
                    <div className="space-y-0.5 text-[11px] text-[#6B5E4E] dark:text-[#A99F8D]">
                      {hoveredTooltip.item.fatherName && (
                        <p className="text-[#800020] dark:text-[#F3E5AB] font-semibold">
                          ↳ {isRTL ? `ابن: ${hoveredTooltip.item.fatherName}` : `Son of: ${hoveredTooltip.item.fatherName}`}
                          {hoveredTooltip.item.isEstimatedBirth && (
                            <span className="text-[10px] text-[#8C6F12] ms-1">
                              ({isRTL ? "تحت الأب" : "under father"})
                            </span>
                          )}
                        </p>
                      )}
                      <p>
                        <strong className="text-[#800020] dark:text-[#D4AF37]">
                          {t.lifespan}:
                        </strong>{" "}
                        {hoveredTooltip.item.data.yearsLived || 70} {t.years}
                      </p>
                      <p>
                        <strong className="text-[#800020] dark:text-[#D4AF37]">
                          {t.birth} — {t.death}:
                        </strong>{" "}
                        {formatYearDisplay(hoveredTooltip.item.birthYear, lang)} —{" "}
                        {formatYearDisplay(hoveredTooltip.item.deathYear, lang)}
                      </p>
                      {hoveredTooltip.item.data.biblicalReferences?.[0] && (
                        <p className="italic pt-0.5 text-[10px] text-[#8C6F12] dark:text-[#D4AF37]">
                          📖 {localizeBiblicalReference(hoveredTooltip.item.data.biblicalReferences[0], lang)}
                        </p>
                      )}
                    </div>
                  )}

                  {hoveredTooltip.item.type === "event" && (
                    <div className="space-y-0.5 text-[11px] text-[#6B5E4E] dark:text-[#A99F8D]">
                      <p>
                        <strong className="text-[#1A365D] dark:text-[#90CDF4]">
                          {t.year}:
                        </strong>{" "}
                        {formatYearDisplay(hoveredTooltip.item.data.date?.year, lang)}
                      </p>
                      {hoveredTooltip.item.data.location && (
                        <p>📍 {hoveredTooltip.item.data.location}</p>
                      )}
                      {hoveredTooltip.item.data.biblicalReferences?.[0] && (
                        <p className="italic pt-0.5 text-[10px] text-[#8C6F12] dark:text-[#D4AF37]">
                          📖 {localizeBiblicalReference(hoveredTooltip.item.data.biblicalReferences[0], lang)}
                        </p>
                      )}
                    </div>
                  )}

                  {hoveredTooltip.item.type === "marriage" && (
                    <div className="space-y-0.5 text-[11px] text-[#6B5E4E] dark:text-[#A99F8D]">
                      <p>
                        <strong className="text-[#800020] dark:text-[#D4AF37]">
                          {t.year}:
                        </strong>{" "}
                        {formatYearDisplay(hoveredTooltip.item.data.year, lang)}
                      </p>
                      <p>
                        👰 {hoveredTooltip.item.data.husbandName} & {hoveredTooltip.item.data.wifeName}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* SECTION 1: FIGURES / LIFESPANS BARS                      */}
              {/* ======================================================== */}
              {showFigures && filteredPeople.length > 0 && (
                <div className="relative z-10 mb-6">
                  {/* Section Label */}
                  <div className="flex items-center justify-between text-xs font-bold text-[#800020] dark:text-[#D4AF37] uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <Users size={14} />
                      <span>{t.toggleFigures} ({filteredPeople.length})</span>
                      {viewMode === "compact" && (
                        <span className="text-[10px] font-mono lowercase opacity-75 font-normal">
                          ({peopleLaneCount} {t.lanesCount})
                        </span>
                      )}
                    </span>
                  </div>

                  {/* MODE A: COMPACT MULTI-TRACK VIEW (Bars fit names, children under fathers) */}
                  {viewMode === "compact" ? (
                    <div
                      className="relative rounded-xl bg-[#FBF8EF]/60 dark:bg-[#121110]/40 border border-[#D4AF37]/30 p-1.5 space-y-1.5"
                      style={{
                        minHeight: `${Math.max(80, peopleLaneCount * 34)}px`,
                      }}
                    >
                      {packedPeopleLanes.map((lane, laneIdx) => (
                        <div
                          key={`lane_${laneIdx}`}
                          className="relative h-7 w-full rounded-md hover:bg-[#D4AF37]/5 transition-colors"
                        >
                          {lane.map(({ person, birthYear, deathYear, duration, isEstimatedBirth, fatherName }) => {
                            const displayName = getPersonDisplayName(person, lang);
                            const pos = getPosPx(birthYear);
                            const widthPx = getWidthPx(duration);
                            // Bar is sized to guarantee the person's name always fits comfortably
                            const minNameWidthPx = Math.max(92, Math.ceil(displayName.length * 8 + 36));
                            const effectiveBarWidth = Math.max(widthPx, minNameWidthPx);
                            const matched = isMatch(person);
                            const isFemale = person.gender === "female";

                            return (
                              <div
                                key={person.id}
                                id={`timeline-person-${person.id}`}
                                onClick={() =>
                                  setSelectedItem({
                                    type: "person",
                                    data: person,
                                    birthYear,
                                    deathYear,
                                    isEstimatedBirth,
                                    fatherName,
                                  })
                                }
                                onMouseEnter={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const parentRect = trackRef.current?.getBoundingClientRect();
                                  if (!parentRect) return;
                                  setHoveredTooltip({
                                    item: {
                                      type: "person",
                                      data: person,
                                      birthYear,
                                      deathYear,
                                      isEstimatedBirth,
                                      fatherName,
                                    },
                                    x: pos,
                                    y: rect.top - parentRect.top,
                                  });
                                }}
                                onMouseLeave={() => setHoveredTooltip(null)}
                                className={`absolute top-0.5 bottom-0.5 rounded-lg px-2 flex items-center justify-between text-[11px] font-bold cursor-pointer transition-all duration-150 shadow-xs hover:shadow-md hover:scale-[1.02] border ${
                                  matched
                                    ? "ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#800020] animate-pulse z-20"
                                    : ""
                                } ${
                                  term && !matched ? "opacity-35 hover:opacity-100" : ""
                                } ${
                                  isFemale
                                    ? "bg-gradient-to-r from-[#991B1B] via-[#BE185D] to-[#800020] text-white border-[#F472B6]"
                                    : "bg-gradient-to-r from-[#800020] via-[#941c30] to-[#730018] text-[#F3E5AB] border-[#D4AF37]"
                                }`}
                                style={{
                                  [isRTL ? "right" : "left"]: `${pos}px`,
                                  width: `${effectiveBarWidth}px`,
                                  minWidth: `${minNameWidthPx}px`,
                                }}
                                title={`${displayName} (${duration} ${t.years})${fatherName ? ` - ${isRTL ? `ابن ${fatherName}` : `son of ${fatherName}`}` : ""}`}
                              >
                                <div className="flex items-center justify-between gap-1.5 w-full whitespace-nowrap overflow-hidden px-0.5">
                                  <div className="flex items-center gap-1 min-w-0">
                                    {isEstimatedBirth && (
                                      <span
                                        className="text-[10px] font-bold text-[#D4AF37] shrink-0"
                                        title={isRTL ? "موضوع تحت الأب" : "Placed under father"}
                                      >
                                        ↳
                                      </span>
                                    )}
                                    <span className="font-cinzel font-bold text-[11px] truncate" title={displayName}>
                                      {displayName}
                                    </span>
                                  </div>
                                  <span className="text-[10px] opacity-85 font-mono shrink-0">
                                    ({duration}y)
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* MODE B: EXPANDED ROWS VIEW (1 row per person with lineage tags under father) */
                    <div className="space-y-1.5">
                      {filteredPeople.map(({ person, birthYear, deathYear, duration, isEstimatedBirth, fatherName }) => {
                        const displayName = getPersonDisplayName(person, lang);
                        const pos = getPosPx(birthYear);
                        const widthPx = getWidthPx(duration);
                        const minNameWidthPx = Math.max(92, Math.ceil(displayName.length * 8 + 36));
                        const effectiveBarWidth = Math.max(widthPx, minNameWidthPx);
                        const matched = isMatch(person);
                        const isFemale = person.gender === "female";

                        return (
                          <div
                            key={person.id}
                            className={`flex items-center h-8 hover:bg-[#D4AF37]/10 rounded-lg transition-colors cursor-pointer group ${
                              term && !matched ? "opacity-35 hover:opacity-100" : ""
                            }`}
                            onClick={() =>
                              setSelectedItem({
                                type: "person",
                                data: person,
                                birthYear,
                                deathYear,
                                isEstimatedBirth,
                                fatherName,
                              })
                            }
                          >
                            {/* Sticky Pinned Name Column */}
                            <div
                              className={`sticky ${
                                isRTL ? "right-0 text-right" : "left-0 text-left"
                              } z-20 w-52 shrink-0 px-2.5 py-1 text-xs font-bold truncate text-[#2D2721] dark:text-[#E6E0D4] font-cinzel bg-white/95 dark:bg-[#1C1A17]/95 backdrop-blur-md border-r border-l border-[#D4AF37]/30 shadow-xs flex items-center justify-between`}
                              style={{ marginInlineStart: "-220px" }}
                              title={displayName}
                            >
                              <div className="min-w-0 pe-1">
                                <span className="truncate block font-bold text-[12px]">{displayName}</span>
                                {fatherName && (
                                  <span className="text-[10px] font-normal text-[#6B5E4E] dark:text-[#A99F8D] block truncate">
                                    ↳ {isRTL ? `ابن ${fatherName}` : `son of ${fatherName}`}
                                    {isEstimatedBirth ? ` (${isRTL ? "تحت الأب" : "under father"})` : ""}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-[#8C6F12] dark:text-[#D4AF37] shrink-0">
                                {duration}y
                              </span>
                            </div>

                            {/* Lifespan Bar */}
                            <div className="relative flex-1 h-full">
                              <div
                                className={`absolute top-0.5 bottom-0.5 rounded-lg px-2.5 flex items-center justify-between text-[11px] font-bold shadow-xs transition-transform group-hover:scale-y-110 border ${
                                  matched
                                    ? "ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#800020]"
                                    : ""
                                } ${
                                  isFemale
                                    ? "bg-gradient-to-r from-[#991B1B] via-[#BE185D] to-[#800020] text-white border-[#F472B6]"
                                    : "bg-gradient-to-r from-[#800020] via-[#941c30] to-[#730018] text-[#F3E5AB] border-[#D4AF37]"
                                }`}
                                style={{
                                  [isRTL ? "right" : "left"]: `${pos}px`,
                                  width: `${effectiveBarWidth}px`,
                                  minWidth: `${minNameWidthPx}px`,
                                }}
                              >
                                <span className="truncate pe-1 font-cinzel">
                                  {displayName} ({duration} {t.years})
                                </span>
                                <span className="hidden sm:inline text-[9px] font-mono opacity-85 shrink-0">
                                  {formatYearDisplay(birthYear, lang)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* SECTION 2: BIBLICAL MARRIAGES                            */}
              {/* ======================================================== */}
              {showMarriages && filteredMarriages.length > 0 && (
                <div className="relative z-10 my-4 pt-3 border-t border-[#D4AF37]/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#F3E5AB] mb-2">
                    <Heart size={14} className="text-[#800020] dark:text-[#D4AF37]" />
                    <span>{t.toggleMarriages} ({filteredMarriages.length})</span>
                  </div>

                  {viewMode === "compact" ? (
                    <div
                      className="relative rounded-xl bg-[#FBF8EF]/40 dark:bg-[#121110]/40 border border-[#D4AF37]/30 p-1 space-y-1"
                      style={{
                        minHeight: `${Math.max(40, marriagesLaneCount * 28)}px`,
                      }}
                    >
                      {packedMarriagesLanes.map((lane, laneIdx) => (
                        <div key={`m_lane_${laneIdx}`} className="relative h-6 w-full">
                          {lane.map((marriage) => {
                            const pos = getPosPx(marriage.year);
                            const title = isRTL ? marriage.arabicTitle : marriage.title;

                            return (
                              <div
                                key={marriage.id}
                                id={`timeline-marriage-${marriage.id}`}
                                onClick={() => setSelectedItem({ type: "marriage", data: marriage })}
                                className="absolute top-0 bottom-0 px-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#121110] text-[10px] font-bold flex items-center gap-1 shadow-xs hover:shadow-md hover:scale-105 transition-all cursor-pointer border border-[#8C6F12] whitespace-nowrap"
                                style={{ [isRTL ? "right" : "left"]: `${pos}px` }}
                                title={`${title} (${formatYearDisplay(marriage.year, lang)})`}
                              >
                                <Heart size={10} className="fill-current text-[#800020] shrink-0" />
                                <span className="truncate max-w-[130px]">{title}</span>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredMarriages.map((marriage) => {
                        const title = isRTL ? marriage.arabicTitle : marriage.title;
                        const pos = getPosPx(marriage.year);

                        return (
                          <div
                            key={marriage.id}
                            className="flex items-center h-6 hover:bg-[#800020]/10 rounded-lg transition-colors cursor-pointer"
                            onClick={() => setSelectedItem({ type: "marriage", data: marriage })}
                          >
                            <div
                              className={`sticky ${
                                isRTL ? "right-0 text-right" : "left-0 text-left"
                              } z-20 w-52 shrink-0 px-2.5 py-0.5 text-xs font-semibold truncate text-[#800020] dark:text-[#F3E5AB] bg-white/95 dark:bg-[#1C1A17]/95 backdrop-blur-md border-r border-l border-[#D4AF37]/30 shadow-xs`}
                              style={{ marginInlineStart: "-220px" }}
                              title={title}
                            >
                              {title}
                            </div>
                            <div className="relative flex-1 h-full">
                              <div
                                className="absolute top-0.5 bottom-0.5 px-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#121110] text-[10px] font-bold flex items-center gap-1 shadow-xs border border-[#8C6F12]"
                                style={{ [isRTL ? "right" : "left"]: `${pos}px` }}
                              >
                                <Heart size={9} className="fill-current text-[#800020]" />
                                <span>{formatYearDisplay(marriage.year, lang)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* SECTION 3: KEY BIBLICAL EVENTS                           */}
              {/* ======================================================== */}
              {showEvents && filteredEvents.length > 0 && (
                <div className="relative z-10 my-4 pt-3 border-t border-[#D4AF37]/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1A365D] dark:text-[#90CDF4] mb-2">
                    <Sparkles size={14} className="text-[#D4AF37]" />
                    <span>{t.toggleEvents} ({filteredEvents.length})</span>
                  </div>

                  {viewMode === "compact" ? (
                    <div
                      className="relative rounded-xl bg-[#FBF8EF]/40 dark:bg-[#121110]/40 border border-[#D4AF37]/30 p-1 space-y-1"
                      style={{
                        minHeight: `${Math.max(40, eventsLaneCount * 28)}px`,
                      }}
                    >
                      {packedEventsLanes.map((lane, laneIdx) => (
                        <div key={`e_lane_${laneIdx}`} className="relative h-6 w-full">
                          {lane.map(({ event, year }) => {
                            const pos = getPosPx(year);
                            const displayTitle = getEventDisplayTitle(event, lang);

                            return (
                              <div
                                key={event.id}
                                id={`timeline-event-${event.id}`}
                                onClick={() => setSelectedItem({ type: "event", data: event })}
                                className="absolute top-0 bottom-0 px-2.5 rounded-full bg-gradient-to-r from-[#1A365D] via-[#244b7d] to-[#1A365D] text-white text-[10px] font-bold flex items-center gap-1.5 shadow-xs hover:shadow-md hover:scale-105 transition-all cursor-pointer border border-[#D4AF37] whitespace-nowrap"
                                style={{ [isRTL ? "right" : "left"]: `${pos}px` }}
                                title={`${displayTitle} (${formatYearDisplay(year, lang)})`}
                              >
                                <Sparkles size={10} className="text-[#D4AF37] shrink-0" />
                                <span className="truncate max-w-[150px]">{displayTitle}</span>
                                <span className="opacity-80 font-mono text-[9px]">
                                  {formatYearDisplay(year, lang)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredEvents.map(({ event, year }) => {
                        const displayTitle = getEventDisplayTitle(event, lang);
                        const pos = getPosPx(year);

                        return (
                          <div
                            key={event.id}
                            className="flex items-center h-6 hover:bg-[#1A365D]/10 rounded-lg transition-colors cursor-pointer"
                            onClick={() => setSelectedItem({ type: "event", data: event })}
                          >
                            <div
                              className={`sticky ${
                                isRTL ? "right-0 text-right" : "left-0 text-left"
                              } z-20 w-52 shrink-0 px-2.5 py-0.5 text-xs font-semibold truncate text-[#1A365D] dark:text-[#90CDF4] bg-white/95 dark:bg-[#1C1A17]/95 backdrop-blur-md border-r border-l border-[#D4AF37]/30 shadow-xs`}
                              style={{ marginInlineStart: "-220px" }}
                              title={displayTitle}
                            >
                              {displayTitle}
                            </div>
                            <div className="relative flex-1 h-full">
                              <div
                                className="absolute top-0.5 bottom-0.5 px-2 rounded-full bg-gradient-to-r from-[#1A365D] to-[#2B6CB0] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs border border-[#D4AF37]"
                                style={{ [isRTL ? "right" : "left"]: `${pos}px` }}
                              >
                                <Sparkles size={9} className="text-[#D4AF37]" />
                                <span>{formatYearDisplay(year, lang)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Localized Item Detail Modal */}
      <TimelineDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        lang={lang}
        allPeople={people}
      />
    </div>
  );
}
