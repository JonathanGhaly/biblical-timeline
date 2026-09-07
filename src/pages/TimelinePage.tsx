import { useState, useMemo, useRef } from "react";
import type { Person, BiblicalEvent, Language } from "../types/genealogy";
import {
  UI_TRANSLATIONS,
  getPersonDisplayName,
  getEventDisplayTitle,
  getEventDisplayDescription,
  formatYearDisplay,
} from "../utils/i18n";
import { Clock, Calendar, Sparkles, X, BookOpen } from "lucide-react";
import { CopticCross } from "../components/Coptic/CopticCross";

type TimelinePageProps = {
  people: Person[];
  events: BiblicalEvent[];
  lang?: Language;
};

type MarriageItem = {
  id: string;
  title: string;
  year: number;
  husbandName: string;
  wifeName: string;
  husbandAge?: number;
  wifeAge?: number;
  references?: string[];
};

type SelectedItem =
  | { type: "person"; data: Person; birthYear: number; deathYear: number }
  | { type: "event"; data: BiblicalEvent }
  | { type: "marriage"; data: MarriageItem };

const getBirthYear = (
  person: Person,
  peopleList: Person[],
  visited = new Set<string>()
): number => {
  const pAny = person as any;

  if (person.birth?.year !== undefined) return person.birth.year;
  if (typeof person.birth === "number") return person.birth;
  if (pAny.birthYear !== undefined) return pAny.birthYear;
  if (pAny.birth_year !== undefined) return pAny.birth_year;
  if (pAny.dateOfBirth?.year !== undefined) return pAny.dateOfBirth.year;

  if (visited.has(person.id)) return -4000;
  visited.add(person.id);

  const anchorId = person.anchorPersonId || person.fatherId || pAny.parentId;
  const ageAtBirth =
    person.anchorPersonAgeAtBirth ?? person.fatherAgeAtBirth ?? pAny.ageAtBirth;

  if (anchorId && ageAtBirth !== undefined) {
    const anchor = peopleList.find((p) => p.id === anchorId);
    if (anchor) {
      return getBirthYear(anchor, peopleList, visited) + Number(ageAtBirth);
    }
  }

  return -4000;
};

export default function TimelinePage({ people, events, lang = "en" }: TimelinePageProps) {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Interactive Mouse Pointer Hover State
  const [hoverState, setHoverState] = useState<{
    x: number;
    y: number;
    year: number;
  } | null>(null);

  const trackRef = useRef<HTMLDivElement | null>(null);

  const t = UI_TRANSLATIONS[lang];

  const peopleWithLifespans = useMemo(() => {
    const list = people.map((person) => {
      const birthYear = getBirthYear(person, people);
      const pAny = person as any;
      const duration =
        person.yearsLived ||
        pAny.lifespan ||
        (person.death?.year !== undefined ? person.death.year - birthYear : 70);
      const deathYear = birthYear + duration;

      return {
        person,
        birthYear,
        deathYear,
        duration,
      };
    });

    return list.sort((a, b) => a.birthYear - b.birthYear);
  }, [people]);

  const derivedMarriages = useMemo(() => {
    const list: MarriageItem[] = [];
    const processedPairs = new Set<string>();

    peopleWithLifespans.forEach(({ person }) => {
      const spouseId =
        person.gender === "female"
          ? person.husbandId || person.spouseIds?.[0]
          : person.wifeId || person.spouseIds?.[0];

      if (!spouseId) return;

      const spouse = people.find((p) => p.id === spouseId);
      if (!spouse) return;

      const coupleKey = [person.id, spouse.id].sort().join("_");
      if (processedPairs.has(coupleKey)) return;
      processedPairs.add(coupleKey);

      const husband = person.gender === "male" ? person : spouse;
      const wife = person.gender === "female" ? person : spouse;

      const husbandBirth = getBirthYear(husband, people);
      const wifeBirth = getBirthYear(wife, people);

      let marriageYear: number | null = null;
      const husbandAge = husband.husbandMarriageAge;
      const wifeAge = wife.wifeMarriageAge;

      if (husbandAge !== undefined && husbandAge !== null) {
        marriageYear = husbandBirth + Number(husbandAge);
      } else if (wifeAge !== undefined && wifeAge !== null) {
        marriageYear = wifeBirth + Number(wifeAge);
      }

      if (marriageYear !== null) {
        const refs = [
          ...(husband.biblicalReferences || []),
          ...(wife.biblicalReferences || []),
        ];

        list.push({
          id: `marriage_${coupleKey}`,
          title: `${husband.name} & ${wife.name}`,
          year: marriageYear,
          husbandName: husband.name,
          wifeName: wife.name,
          husbandAge: husbandAge !== undefined ? Number(husbandAge) : undefined,
          wifeAge: wifeAge !== undefined ? Number(wifeAge) : undefined,
          references: Array.from(new Set(refs)),
        });
      }
    });

    return list.sort((a, b) => a.year - b.year);
  }, [people, peopleWithLifespans]);

  const validEvents = useMemo(
    () => events.filter((e) => e.date?.year !== undefined),
    [events]
  );

  const term = searchTerm.trim().toLowerCase();

  const filteredPeople = useMemo(() => {
    if (!term) return peopleWithLifespans;
    return peopleWithLifespans.filter(({ person }) => {
      const nameMatch = person.name.toLowerCase().includes(term);
      const arMatch = (person.arabicName || "").toLowerCase().includes(term);
      const notesMatch = (person.notes || "").toLowerCase().includes(term);
      return nameMatch || arMatch || notesMatch;
    });
  }, [peopleWithLifespans, term]);

  const filteredEvents = useMemo(() => {
    if (!term) return validEvents;
    return validEvents.filter((e) => {
      const titleMatch = e.title.toLowerCase().includes(term);
      const arMatch = (e.arabicTitle || "").toLowerCase().includes(term);
      const descMatch = (e.description || "").toLowerCase().includes(term);
      return titleMatch || arMatch || descMatch;
    });
  }, [validEvents, term]);

  const { minYear, maxYear, ticks } = useMemo(() => {
    const allYears: number[] = [
      ...peopleWithLifespans.map((p) => p.birthYear),
      ...peopleWithLifespans.map((p) => p.deathYear),
      ...validEvents.map((e) => e.date!.year!),
      ...derivedMarriages.map((m) => m.year),
    ];

    const rawMin = allYears.length ? Math.min(...allYears) : -4000;
    const rawMax = allYears.length ? Math.max(...allYears) : -1000;

    const min = Math.floor(rawMin / 250) * 250;
    const max = Math.ceil(rawMax / 250) * 250;

    const generatedTicks: number[] = [];
    for (let yr = min; yr <= max; yr += 250) {
      generatedTicks.push(yr);
    }

    return { minYear: min, maxYear: max, ticks: generatedTicks };
  }, [peopleWithLifespans, validEvents, derivedMarriages]);

  const isRTL = lang === "ar";
  const totalYears = maxYear - minYear || 1;
  const timelineWidth = 2600;

  const getPosPx = (year: number) => {
    const ratio = (year - minYear) / totalYears;
    return Math.max(0, Math.min(timelineWidth, ratio * timelineWidth));
  };

  const getWidthPx = (duration: number) => {
    return Math.max(12, (duration / totalYears) * timelineWidth);
  };

  // Mouse move handler computing X & Y positions relative to the container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clampedX = Math.max(0, Math.min(timelineWidth, x));

    let ratio = clampedX / timelineWidth;
    if (isRTL) {
      ratio = 1 - ratio;
    }

    const calculatedYear = Math.round(minYear + ratio * totalYears);
    setHoverState({ x: clampedX, y, year: calculatedYear });
  };

  const handleMouseLeave = () => {
    setHoverState(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#800020]/15 via-[#FBF8EF] to-[#1A365D]/15 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#1A365D]/25 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <CopticCross size={26} />
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
              {t.navLifespans}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B5E4E] dark:text-[#A99F8D] mt-1">
            {isRTL
              ? "استكشف تداخل أعمار الآباء والأحداث التاريخية عبر الخط الزمني الأفقي (من اليمين إلى اليسار)."
              : "Horizontal chart visualizing overlapping patriarch lifespans, marriages, and biblical epochs."}
          </p>
        </div>

        <div className="relative">
          <input
            type="search"
            placeholder={t.searchPeoplePlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 rounded-xl border border-[#D4AF37]/60 bg-white dark:bg-[#121110] text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>
      </div>

      {/* Horizontal Chart Wrapper with Fixed Sticky Side Column */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#D4AF37]/50 bg-white/70 dark:bg-[#1C1A17] shadow-inner">
        <div className="overflow-x-auto">
          <div className="relative" style={{ width: `${timelineWidth + 240}px` }}>
            {/* Header Time Axis */}
            <div
              className="relative h-10 border-b-2 border-[#D4AF37]/40 mb-6"
              style={{
                marginInlineStart: "176px",
              }}
            >
              {ticks.map((yr) => {
                const pos = getPosPx(yr);
                return (
                  <div
                    key={yr}
                    className={`absolute top-0 text-[11px] font-bold font-mono text-[#800020] dark:text-[#D4AF37] whitespace-nowrap ${
                      isRTL ? "translate-x-1/2" : "-translate-x-1/2"
                    }`}
                    style={{ [isRTL ? "right" : "left"]: `${pos}px` }}
                  >
                    {formatYearDisplay(yr, lang)}
                  </div>
                );
              })}
            </div>

            {/* Main Interactive Timeline Track */}
            <div
              ref={trackRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative cursor-crosshair"
              style={{
                marginInlineStart: "176px",
                width: `${timelineWidth}px`,
              }}
            >
              {/* Vertical Cursor Line & Adjacent Floating Year Badge */}
              {hoverState && (
                <>
                  <div
                    className="absolute top-0 bottom-0 pointer-events-none z-30 w-0.5 bg-[#800020] dark:bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                    style={{ left: `${hoverState.x}px` }}
                  />
                  <div
                    className="absolute pointer-events-none z-40 px-2 py-1 rounded-md bg-[#800020] text-[#F3E5AB] text-[11px] font-bold font-mono shadow-md border border-[#D4AF37] whitespace-nowrap transition-transform duration-75"
                    style={{
                      left: `${hoverState.x + (isRTL ? -12 : 12)}px`,
                      top: `${hoverState.y - 12}px`,
                      transform: isRTL ? "translateX(-100%)" : "none",
                    }}
                  >
                    {formatYearDisplay(hoverState.year, lang)}
                  </div>
                </>
              )}

              {/* Vertical Grid Reference Lines */}
              <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none">
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

              {/* 1. Biblical Figures Lifespan Bars */}
              <div className="space-y-2 relative z-10 mb-8 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37] mb-2 px-2 flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{t.totalPeople} ({filteredPeople.length})</span>
                </h4>

                {filteredPeople.map(({ person, birthYear, deathYear, duration }) => {
                  const displayName = getPersonDisplayName(person, lang);
                  const pos = getPosPx(birthYear);
                  const widthPx = getWidthPx(duration);

                  return (
                    <div
                      key={person.id}
                      className="flex items-center h-8 hover:bg-[#D4AF37]/10 rounded-lg transition-colors cursor-pointer"
                      onClick={() =>
                        setSelectedItem({
                          type: "person",
                          data: person,
                          birthYear,
                          deathYear,
                        })
                      }
                    >
                      {/* Sticky Pinned Name Label */}
                      <div
                        className={`sticky ${
                          isRTL ? "right-0 text-right" : "left-0 text-left"
                        } z-20 w-44 shrink-0 px-3 py-1 text-xs font-bold truncate text-[#2D2721] dark:text-[#E6E0D4] font-cinzel bg-white/90 dark:bg-[#1C1A17]/90 backdrop-blur-sm border-r border-l border-[#D4AF37]/30 shadow-sm`}
                        style={{ marginInlineStart: "-176px" }}
                        title={displayName}
                      >
                        {displayName}
                      </div>

                      {/* Lifespan Bar */}
                      <div className="relative flex-1 h-full">
                        <div
                          className="absolute top-1 bottom-1 rounded-md bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#121110] px-2 flex items-center justify-between text-[10px] font-bold shadow-sm transition-transform hover:scale-y-110 border border-[#8C6F12]"
                          style={{
                            [isRTL ? "right" : "left"]: `${pos}px`,
                            width: `${widthPx}px`,
                          }}
                        >
                          <span className="truncate">{duration} {t.years}</span>
                          <span className="hidden sm:inline text-[9px] opacity-80">
                            {formatYearDisplay(birthYear, lang)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 2. Key Biblical Events Pins */}
              <div className="space-y-2 relative z-10 pt-4 border-t border-[#D4AF37]/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A365D] dark:text-[#90CDF4] mb-2 px-2 flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{t.totalEvents} ({filteredEvents.length})</span>
                </h4>

                {filteredEvents.map((event) => {
                  const displayTitle = getEventDisplayTitle(event, lang);
                  const eventYear = event.date!.year!;
                  const pos = getPosPx(eventYear);

                  return (
                    <div
                      key={event.id}
                      className="flex items-center h-7 hover:bg-[#1A365D]/10 rounded-lg transition-colors cursor-pointer"
                      onClick={() => setSelectedItem({ type: "event", data: event })}
                    >
                      {/* Sticky Pinned Event Label */}
                      <div
                        className={`sticky ${
                          isRTL ? "right-0 text-right" : "left-0 text-left"
                        } z-20 w-44 shrink-0 px-3 py-1 text-xs font-semibold truncate text-[#1A365D] dark:text-[#90CDF4] bg-white/90 dark:bg-[#1C1A17]/90 backdrop-blur-sm border-r border-l border-[#D4AF37]/30 shadow-sm`}
                        style={{ marginInlineStart: "-176px" }}
                        title={displayTitle}
                      >
                        {displayTitle}
                      </div>

                      <div className="relative flex-1 h-full">
                        <div
                          className="absolute top-0.5 bottom-0.5 px-2.5 rounded-full bg-gradient-to-r from-[#800020] to-[#A01128] text-white text-[10px] font-bold flex items-center gap-1 shadow-sm border border-[#D4AF37]"
                          style={{ [isRTL ? "right" : "left"]: `${pos}px` }}
                        >
                          <Sparkles size={10} className="text-[#D4AF37]" />
                          <span>{displayTitle}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Item Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-md p-6 rounded-2xl bg-[#FBF8EF] dark:bg-[#1C1A17] border-2 border-[#D4AF37] shadow-2xl text-[#2D2721] dark:text-[#E6E0D4] space-y-4"
            onClick={(e) => e.stopPropagation()}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2">
                <CopticCross size={24} />
                <h3 className="text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                  {selectedItem.type === "person"
                    ? getPersonDisplayName(selectedItem.data, lang)
                    : selectedItem.type === "event"
                    ? getEventDisplayTitle(selectedItem.data, lang)
                    : selectedItem.data.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg hover:bg-[#D4AF37]/20 text-[#6B5E4E]"
              >
                <X size={18} />
              </button>
            </div>

            {selectedItem.type === "person" && (
              <div className="space-y-2 text-xs">
                <p>
                  <strong>{t.lifespan}:</strong> {selectedItem.data.yearsLived || 70} {t.years}
                </p>
                <p>
                  <strong>{t.birth}:</strong> {formatYearDisplay(selectedItem.birthYear, lang)}
                  {" — "}
                  <strong>{t.death}:</strong> {formatYearDisplay(selectedItem.deathYear, lang)}
                </p>
                {selectedItem.data.notes && (
                  <p className="italic bg-[#D4AF37]/10 p-3 rounded-xl border border-[#D4AF37]/20">
                    {selectedItem.data.notes}
                  </p>
                )}
                {selectedItem.data.biblicalReferences && selectedItem.data.biblicalReferences.length > 0 && (
                  <p className="flex items-center gap-1 font-semibold text-[#800020] dark:text-[#D4AF37]">
                    <BookOpen size={13} />
                    <span>{selectedItem.data.biblicalReferences.join(", ")}</span>
                  </p>
                )}
              </div>
            )}

            {selectedItem.type === "event" && (
              <div className="space-y-2 text-xs">
                <p>
                  <strong>{t.year}:</strong> {formatYearDisplay(selectedItem.data.date?.year, lang)}
                </p>
                {selectedItem.data.location && (
                  <p>
                    <strong>{t.location}:</strong> {selectedItem.data.location}
                  </p>
                )}
                {getEventDisplayDescription(selectedItem.data, lang) && (
                  <p className="italic bg-[#D4AF37]/10 p-3 rounded-xl border border-[#D4AF37]/20">
                    {getEventDisplayDescription(selectedItem.data, lang)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}