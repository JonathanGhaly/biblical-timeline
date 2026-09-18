import { useState, useMemo } from "react";
import type { Person, BiblicalEvent, Language } from "../types/genealogy";
import {
  UI_TRANSLATIONS,
  getEventDisplayTitle,
  getEventDisplayDescription,
  formatYearDisplay,
  getPersonDisplayName,
  localizeBiblicalReferences,
  matchesBiblicalSearch,
} from "../utils/i18n";
import { resolveEventYear } from "../utils/chronology";
import {
  MapPin,
  BookOpen,
  Edit3,
  X,
  Users,
  Globe,
  Sparkles,
  Plus,
  Trash2,
  Filter,
} from "lucide-react";
import { CopticCross } from "../components/Coptic/CopticCross";
import AddEventModal from "../components/Event/AddEventModal";
import { EventTypeBadge } from "../components/Event/EventTypeBadge";
import {
  getEventTypeDefinition,
  getEventTypeLabel,
  guessEventTypeForLegacyEvent,
} from "../data/biblicalEventTypes";

type TimelineProps = {
  people: Person[];
  events: BiblicalEvent[];
  onAddEvent?: (newEvent: BiblicalEvent) => void;
  onUpdateEvent?: (updatedEvent: BiblicalEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  lang?: Language;
};

export default function Timeline({
  people,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  lang = "en",
}: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventType, setSelectedEventType] = useState<string>("all");

  const t = UI_TRANSLATIONS[lang];

  const getPersonName = (id: string) => {
    const p = people.find((person) => person.id === id);
    if (!p) return id;
    return lang === "ar" && p.arabicName ? p.arabicName : p.name;
  };

  // Compute event counts per resolved event type
  const eventTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((evt) => {
      const type = evt.eventType || guessEventTypeForLegacyEvent(evt);
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [events]);

  // List of active event types present in current dataset, sorted by frequency
  const activeEventTypes = useMemo(() => {
    return Object.keys(eventTypeCounts).sort(
      (a, b) => eventTypeCounts[b] - eventTypeCounts[a]
    );
  }, [eventTypeCounts]);

  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const sorted = [...events].sort((a, b) => {
      const yearA = resolveEventYear(a, people) ?? a.date?.year ?? 0;
      const yearB = resolveEventYear(b, people) ?? b.date?.year ?? 0;
      return yearA - yearB;
    });

    return sorted.filter((evt) => {
      // 1. Filter by event type
      if (selectedEventType !== "all") {
        const resolvedType = evt.eventType || guessEventTypeForLegacyEvent(evt);
        if (resolvedType !== selectedEventType) return false;
      }

      // 2. Filter by search query
      if (!term) return true;

      const matchTitle = evt.title.toLowerCase().includes(term);
      const matchArTitle = (evt.arabicTitle || "").toLowerCase().includes(term);
      const matchDesc = evt.description?.toLowerCase().includes(term) ?? false;
      const matchArDesc = evt.arabicDescription?.toLowerCase().includes(term) ?? false;
      const matchLocation = evt.location?.toLowerCase().includes(term) ?? false;
      const matchRef = (evt.biblicalReferences || []).some((r) =>
        matchesBiblicalSearch(r, term)
      );
      const matchPeople = (evt.personIds || []).some((id) => {
        const p = people.find((person) => person.id === id);
        return (
          p?.name.toLowerCase().includes(term) ||
          (p?.arabicName && p.arabicName.toLowerCase().includes(term))
        );
      });

      return (
        matchTitle ||
        matchArTitle ||
        matchDesc ||
        matchArDesc ||
        matchLocation ||
        matchRef ||
        matchPeople
      );
    });
  }, [events, people, searchTerm, selectedEventType]);

  const handleOpenModal = (event: BiblicalEvent) => {
    setSelectedEvent(event);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (selectedEvent) {
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#800020]/15 via-[#FBF8EF] to-[#1A365D]/15 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#1A365D]/25 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <CopticCross size={26} />
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
              {t.navTimeline}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B5E4E] dark:text-[#A99F8D] mt-1">
            {lang === "ar"
              ? "التسلسل الزمني التاريخي لأحداث العهد القديم من الخليقة عبر العصور."
              : "Sacred vertical chronology tracking epochs, covenants, and historical milestones."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onAddEvent && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-[#121110] font-bold text-xs sm:text-sm shadow cursor-pointer transition-colors whitespace-nowrap"
            >
              <Plus size={16} />
              <span>{t.addEvent}</span>
            </button>
          )}
          <div className="relative">
            <input
              type="search"
              placeholder={lang === "ar" ? "تصفية الأحداث بالاسم أو الشاهد..." : "Filter events by name, reference..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 rounded-xl border border-[#D4AF37]/60 bg-white dark:bg-[#121110] text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Interactive Event Type Filter Bar */}
      <div className="bg-white/85 dark:bg-[#1C1A17]/85 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border-2 border-[#D4AF37]/50 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Label + Dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37] uppercase tracking-wider">
              <Filter size={14} />
              <span>{t.filterByEventType}:</span>
            </div>

            <select
              id="timeline-event-type-select"
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#D4AF37]/60 bg-[#FBF8EF] dark:bg-[#121110] text-xs sm:text-sm text-[#2D2721] dark:text-[#E6E0D4] font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
            >
              <option value="all">
                {t.allEventTypes} ({events.length})
              </option>
              {activeEventTypes.map((typeKey) => {
                const count = eventTypeCounts[typeKey] || 0;
                const label = getEventTypeLabel(typeKey, lang);
                return (
                  <option key={`type_opt_${typeKey}`} value={typeKey}>
                    {label} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Counts & Clear Filter button */}
          <div className="flex items-center gap-2 text-xs text-[#7A6E5E] dark:text-[#A99F8D] flex-wrap">
            <span>
              {t.showingEventsCount} <strong className="text-[#800020] dark:text-[#F3E5AB] font-mono">{filteredEvents.length}</strong> {t.ofEvents} <strong className="font-mono">{events.length}</strong>
            </span>

            {(selectedEventType !== "all" || searchTerm) && (
              <button
                type="button"
                id="clear-timeline-filters-btn"
                onClick={() => {
                  setSelectedEventType("all");
                  setSearchTerm("");
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#800020]/10 hover:bg-[#800020]/20 text-[#800020] dark:text-[#F3E5AB] font-semibold transition cursor-pointer"
              >
                <X size={12} />
                <span>{t.clearTypeFilter}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick-Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#D4AF37]/20">
          <button
            type="button"
            id="timeline-pill-all"
            onClick={() => setSelectedEventType("all")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
              selectedEventType === "all"
                ? "bg-[#800020] text-[#F3E5AB] border-[#800020] shadow-sm"
                : "bg-[#FBF8EF] dark:bg-[#121110] border-[#D4AF37]/40 text-[#6B5E4E] dark:text-[#A99F8D] hover:border-[#D4AF37]"
            }`}
          >
            <span>{t.allEventTypes}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                selectedEventType === "all"
                  ? "bg-[#F3E5AB] text-[#800020]"
                  : "bg-[#D4AF37]/20 text-[#800020] dark:text-[#F3E5AB]"
              }`}
            >
              {events.length}
            </span>
          </button>

          {activeEventTypes.map((typeKey) => {
            const isSelected = selectedEventType === typeKey;
            const count = eventTypeCounts[typeKey] || 0;
            const def = getEventTypeDefinition(typeKey);
            const Icon = def.icon;
            const label = lang === "ar" ? def.labelAr : def.labelEn;

            return (
              <button
                key={`pill_${typeKey}`}
                id={`timeline-pill-${typeKey}`}
                type="button"
                onClick={() => setSelectedEventType(isSelected ? "all" : typeKey)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
                  isSelected
                    ? "bg-[#800020] text-[#F3E5AB] border-[#800020] shadow-sm ring-1 ring-[#D4AF37]"
                    : `${def.badgeBg} ${def.badgeBorder} ${def.badgeText} hover:opacity-90`
                }`}
                title={lang === "ar" ? `تصفية أحداث: ${label}` : `Filter events: ${label}`}
              >
                <Icon size={12} className={isSelected ? "text-[#F3E5AB]" : def.colorClass} />
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? "bg-[#F3E5AB] text-[#800020]" : "bg-black/10 dark:bg-white/10"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State when no events match */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed border-[#D4AF37]/40 bg-white/50 dark:bg-[#1C1A17]/50 space-y-3">
          <Filter size={32} className="mx-auto text-[#D4AF37]" />
          <h3 className="text-base font-bold text-[#800020] dark:text-[#F3E5AB]">
            {t.noEventsForType}
          </h3>
          <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] max-w-sm mx-auto">
            {lang === "ar"
              ? "لم يتم العثور على أحداث تطابق النوع أو البحث المحدد. حاول تغيير نوع الحدث أو مسح حقل البحث."
              : "No biblical events match the active event type or search query. Try clearing the filter or adjusting search terms."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedEventType("all");
              setSearchTerm("");
            }}
            className="px-4 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-[#121110] font-bold text-xs shadow transition cursor-pointer"
          >
            {t.clearTypeFilter}
          </button>
        </div>
      )}

      {/* Vertical Timeline Track */}
      {filteredEvents.length > 0 && (
        <div className="relative border-s-2 border-[#D4AF37]/60 ms-6 sm:ms-44 ps-6 sm:ps-8 py-4 space-y-8">
          {filteredEvents.map((event, index) => {
            const displayTitle = getEventDisplayTitle(event, lang);
            const displayDesc = getEventDisplayDescription(event, lang);
            const effYear = resolveEventYear(event, people) ?? event.date?.year;
            const formattedYear = formatYearDisplay(effYear, lang);
            const secondaryTitle = lang === "ar" ? event.title : event.arabicTitle;
            const resolvedType = event.eventType || guessEventTypeForLegacyEvent(event);

            return (
              <div key={`tl_ev_${event.id}_${index}`} className="relative group">
                {/* Timeline Gold Rosette Node */}
                <div
                  className={`absolute -start-[31px] sm:-start-[45px] top-1.5 w-6 h-6 rounded-full border-2 border-[#D4AF37] bg-white dark:bg-[#121110] flex items-center justify-center shadow-md group-hover:scale-125 transition-transform z-10`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#800020]" />
                </div>

                {/* Year Stamp Pill (Shown on start side with generous breathing room before the bullet) */}
                <div
                  className={`sm:absolute sm:-start-52 sm:top-1 hidden sm:flex flex-col items-end justify-center w-36 pe-5`}
                >
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#800020] dark:text-[#F3E5AB] bg-[#D4AF37]/15 border border-[#D4AF37]/40 shadow-2xs font-mono tracking-tight whitespace-nowrap">
                    {formattedYear}
                  </span>
                  {event.anchorPersonId && (
                    <span className="text-[10px] text-[#800020] dark:text-[#D4AF37] font-semibold mt-0.5 whitespace-nowrap truncate max-w-full">
                      {getPersonName(event.anchorPersonId)} ({event.anchorAge ?? event.anchorPersonAgeAtEvent} {t.years})
                    </span>
                  )}
                </div>

                {/* Event Card */}
                <div
                  onClick={() => handleOpenModal(event)}
                  className="cursor-pointer p-5 rounded-2xl border-2 border-[#D4AF37]/40 bg-white/70 dark:bg-[#1C1A17] shadow-sm hover:shadow-lg hover:border-[#D4AF37] transition-all space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                          {displayTitle}
                        </h3>
                        {/* Event Type Badge - Clickable to quick-filter */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEventType(resolvedType === selectedEventType ? "all" : resolvedType);
                          }}
                          className="cursor-pointer hover:opacity-85 transition-opacity"
                          title={lang === "ar" ? "تصفية حسب هذا النوع" : "Filter by this type"}
                        >
                          <EventTypeBadge eventType={resolvedType} lang={lang} size="sm" />
                        </button>
                      </div>
                      {secondaryTitle && (
                        <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D]">
                          {secondaryTitle}
                        </p>
                      )}
                    </div>

                    {/* Mobile Year Badge */}
                    <div className="sm:hidden flex flex-col items-end gap-0.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                        {formattedYear}
                      </span>
                      {event.anchorPersonId && (
                        <span className="text-[9px] text-[#800020] dark:text-[#D4AF37] font-semibold">
                          {getPersonName(event.anchorPersonId)} ({event.anchorAge ?? event.anchorPersonAgeAtEvent} {t.years})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Relative to Person Chip inside Card */}
                  {event.anchorPersonId && (
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#1A365D]/10 text-[#1A365D] dark:text-[#90CDF4] border border-[#1A365D]/30">
                        <Sparkles size={12} className="text-[#D4AF37] shrink-0" />
                        <span>
                          {lang === "ar" ? "مرتبط بعمر" : "Relative to figure"}:{" "}
                          <strong className="text-[#800020] dark:text-[#F3E5AB]">{getPersonName(event.anchorPersonId)}</strong> (
                          {event.anchorAge ?? event.anchorPersonAgeAtEvent} {t.years})
                        </span>
                      </span>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-1.5 text-xs text-[#6B5E4E] dark:text-[#A99F8D]">
                      <MapPin size={13} className="text-[#800020] dark:text-[#D4AF37]" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {displayDesc && (
                    <p className="text-xs text-[#4A3E31] dark:text-[#C5BBAE] leading-relaxed line-clamp-3">
                      {displayDesc}
                    </p>
                  )}

                  {/* Associated People Chips */}
                  {event.personIds && event.personIds.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {event.personIds.map((id, pIdx) => {
                        const p = people.find((person) => person.id === id);
                        const pName = p
                          ? lang === "ar" && p.arabicName
                            ? p.arabicName
                            : p.name
                          : id;
                        return (
                          <span
                            key={`ev_p_${id}_${pIdx}`}
                            className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#800020]/10 text-[#800020] dark:text-[#F3E5AB] border border-[#D4AF37]/30"
                          >
                            👤 {pName}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {event.biblicalReferences && event.biblicalReferences.length > 0 && (
                    <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center gap-1.5 text-[11px] text-[#8C6F12] dark:text-[#F3E5AB] font-semibold">
                      <BookOpen size={12} />
                      <span>
                        {localizeBiblicalReferences(event.biblicalReferences, lang).join(
                          lang === "ar" ? "، " : ", "
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View / Edit Modal */}
      {selectedEvent && !isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative w-full max-w-lg p-6 rounded-2xl bg-[#FBF8EF] dark:bg-[#1C1A17] border-2 border-[#D4AF37] shadow-2xl text-[#2D2721] dark:text-[#E6E0D4] space-y-4"
            onClick={(e) => e.stopPropagation()}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2">
                <CopticCross size={24} />
                <h3 className="text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                  {getEventDisplayTitle(selectedEvent, lang)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg hover:bg-[#D4AF37]/20 text-[#6B5E4E]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full font-bold border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                  {formatYearDisplay(resolveEventYear(selectedEvent, people) ?? selectedEvent.date?.year, lang)}
                </span>
                {/* Event Type Badge in Modal */}
                <EventTypeBadge
                  eventType={selectedEvent.eventType || guessEventTypeForLegacyEvent(selectedEvent)}
                  lang={lang}
                  size="md"
                />
                {selectedEvent.anchorPersonId && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-[#1A365D]/40 bg-[#1A365D]/10 text-[#1A365D] dark:text-[#90CDF4]">
                    <Sparkles size={12} className="text-[#D4AF37]" />
                    <span>
                      {lang === "ar" ? "مرتبط بعمر" : "Relative to figure"}:{" "}
                      <span className="font-bold text-[#800020] dark:text-[#F3E5AB]">{getPersonName(selectedEvent.anchorPersonId)}</span> (
                      {selectedEvent.anchorAge ?? selectedEvent.anchorPersonAgeAtEvent} {t.years})
                    </span>
                  </span>
                )}
                {selectedEvent.country && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#800020] dark:text-[#F3E5AB] border border-[#D4AF37]/50 font-medium">
                    <Globe size={12} />
                    {selectedEvent.country}
                  </span>
                )}
                {((selectedEvent.locations && selectedEvent.locations.length > 0) || selectedEvent.location) && (
                  <div className="flex flex-wrap items-center gap-1 text-[#6B5E4E] dark:text-[#A99F8D]">
                    <MapPin size={12} className="text-[#D4AF37]" />
                    {(selectedEvent.locations && selectedEvent.locations.length > 0
                      ? selectedEvent.locations
                      : [selectedEvent.location!]
                    ).map((loc, locIdx) => (
                      <span
                        key={`ev_loc_${locIdx}`}
                        className="px-2 py-0.5 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px]"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {getEventDisplayDescription(selectedEvent, lang) && (
                <p className="leading-relaxed bg-[#D4AF37]/10 p-3 rounded-xl border border-[#D4AF37]/20">
                  {getEventDisplayDescription(selectedEvent, lang)}
                </p>
              )}

              {selectedEvent.personIds && selectedEvent.personIds.length > 0 && (
                <div className="p-2.5 bg-white/60 dark:bg-[#141210] rounded-xl border border-[#D4AF37]/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#800020] dark:text-[#D4AF37]">
                    <Users size={13} />
                    <span>{t.associatedPeople}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#800020]/15 dark:bg-[#D4AF37]/25 font-semibold">
                      {selectedEvent.personIds.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedEvent.personIds.map((id, pIdx) => {
                      const p = people.find((person) => person.id === id);
                      const name = p ? getPersonDisplayName(p, lang) : id;
                      return (
                        <span
                          key={`sel_ev_p_${id}_${pIdx}`}
                          className="px-2 py-0.5 rounded-md bg-[#800020]/10 text-[#800020] dark:text-[#F3E5AB] border border-[#D4AF37]/30 text-[11px] font-medium"
                        >
                          👤 {name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedEvent.biblicalReferences && selectedEvent.biblicalReferences.length > 0 && (
                <div className="p-2.5 bg-white/60 dark:bg-[#141210] rounded-xl border border-[#D4AF37]/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#8C6F12] dark:text-[#F3E5AB]">
                    <BookOpen size={13} />
                    <span>{t.references}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {localizeBiblicalReferences(selectedEvent.biblicalReferences, lang).map((ref, rIdx) => (
                      <span
                        key={`sel_ev_ref_${rIdx}`}
                        className="px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB] border border-[#D4AF37]/30 text-[11px] font-medium"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#D4AF37]/30 pt-3">
              {onDeleteEvent && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        lang === "ar"
                          ? `هل أنت متأكد من حذف حدث "${getEventDisplayTitle(selectedEvent, lang)}"؟`
                          : `Are you sure you want to delete "${getEventDisplayTitle(selectedEvent, lang)}"?`
                      )
                    ) {
                      onDeleteEvent(selectedEvent.id);
                      setSelectedEvent(null);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-bold hover:bg-red-100 transition cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>{t.delete}</span>
                </button>
              )}

              <div className="flex items-center gap-2 ms-auto">
                {onUpdateEvent && (
                  <button
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D4AF37] bg-[#D4AF37]/20 text-[#800020] dark:text-[#F3E5AB] font-bold hover:bg-[#D4AF37]/30 transition cursor-pointer"
                  >
                    <Edit3 size={14} />
                    <span>{t.edit}</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#800020] text-[#F3E5AB] font-bold hover:bg-[#990026] transition cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedEvent && isEditing && onUpdateEvent && (
        <AddEventModal
          existingPeople={people}
          initialEvent={selectedEvent}
          onUpdateEvent={(updatedEvent) => {
            onUpdateEvent(updatedEvent);
            setSelectedEvent(updatedEvent);
            setIsEditing(false);
          }}
          onClose={() => setIsEditing(false)}
          lang={lang}
        />
      )}

      {/* Add Modal */}
      {isAdding && onAddEvent && (
        <AddEventModal
          existingPeople={people}
          onAddEvent={(newEvent) => {
            onAddEvent(newEvent);
            setIsAdding(false);
          }}
          onClose={() => setIsAdding(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
