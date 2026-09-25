import { useState, useMemo } from "react";
import AddEventModal from "../components/Event/AddEventModal";
import {
  EventsSummaryDashboard,
  type TabPeopleFilterState,
} from "../components/Event/EventsSummaryDashboard";
import {
  computeMillenniumSummaries,
  type MillenniumId,
} from "../utils/millennium";
import type { BiblicalEvent, Person, Language } from "../types/genealogy";
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
  Search,
  Plus,
  BookOpen,
  MapPin,
  X,
  Edit3,
  Trash2,
  Users,
  RotateCcw,
} from "lucide-react";
import { CopticCross } from "../components/Coptic/CopticCross";

type EventsProps = {
  events: BiblicalEvent[];
  people: Person[];
  onAddEvent: (newEvent: BiblicalEvent) => void;
  onUpdateEvent?: (updatedEvent: BiblicalEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  lang?: Language;
};

export default function Events({
  events,
  people,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  lang = "en",
}: EventsProps) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<BiblicalEvent | null>(null);

  // Millennium tabs & per-tab people filtering state
  const [selectedTab, setSelectedTab] = useState<MillenniumId>("all");
  const [tabFilters, setTabFilters] = useState<Record<string, TabPeopleFilterState>>({});

  const t = UI_TRANSLATIONS[lang];

  const handleUpdateTabFilter = (
    tabId: string,
    filter: Partial<TabPeopleFilterState>
  ) => {
    setTabFilters((prev) => ({
      ...prev,
      [tabId]: {
        enabled: filter.enabled !== undefined ? filter.enabled : prev[tabId]?.enabled || false,
        selectedPersonIds:
          filter.selectedPersonIds !== undefined
            ? filter.selectedPersonIds
            : prev[tabId]?.selectedPersonIds || [],
      },
    }));
  };

  const { eventMillenniumMap } = useMemo(
    () => computeMillenniumSummaries(events, people),
    [events, people]
  );

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Search Query Match
      if (search.trim()) {
        const term = search.toLowerCase();
        const titleMatch = event.title.toLowerCase().includes(term);
        const arTitleMatch = (event.arabicTitle || "").toLowerCase().includes(term);
        const descMatch = (event.description || "").toLowerCase().includes(term);
        const arDescMatch = (event.arabicDescription || "").toLowerCase().includes(term);
        const locMatch =
          (event.location || "").toLowerCase().includes(term) ||
          (event.locations || []).some((loc) => loc.toLowerCase().includes(term));
        const refMatch = (event.biblicalReferences || []).some((r) =>
          matchesBiblicalSearch(r, term)
        );
        const personMatch = (event.personIds || []).some((id) => {
          const p = people.find((person) => person.id === id);
          if (!p) return id.toLowerCase().includes(term);
          return (
            p.name.toLowerCase().includes(term) ||
            (p.arabicName || "").toLowerCase().includes(term)
          );
        });
        const matched =
          titleMatch ||
          arTitleMatch ||
          descMatch ||
          arDescMatch ||
          locMatch ||
          refMatch ||
          personMatch;
        if (!matched) return false;
      }

      // 2. Millennium Tab Filtering
      if (selectedTab !== "all") {
        const mId = eventMillenniumMap.get(event.id);
        if (mId !== selectedTab) return false;
      }

      // 3. Tab People Filter Switch & Selected Figures
      const currentTabFilter = tabFilters[selectedTab];
      if (currentTabFilter?.enabled) {
        if (currentTabFilter.selectedPersonIds.length > 0) {
          const eventPersonIds = new Set<string>([
            ...(event.personIds || []),
            ...(event.anchorPersonId ? [event.anchorPersonId] : []),
          ]);
          const hasSelectedPerson = currentTabFilter.selectedPersonIds.some((id) =>
            eventPersonIds.has(id)
          );
          if (!hasSelectedPerson) return false;
        }
      }

      return true;
    });
  }, [events, people, search, selectedTab, tabFilters, eventMillenniumMap]);

  const getPersonName = (id?: string) => {
    if (!id) return null;
    const found = people.find((p) => p.id === id);
    if (!found) return id;
    return getPersonDisplayName(found, lang);
  };

  const handleOpenModal = (event: BiblicalEvent) => {
    setSelectedEvent(event);
  };

  const handleStartEdit = (eventToEdit?: BiblicalEvent) => {
    const ev = eventToEdit || selectedEvent;
    if (ev) {
      setEditingEvent(ev);
      setSelectedEvent(null);
    }
  };

  const handleDelete = () => {
    if (!selectedEvent) return;

    const dispTitle = getEventDisplayTitle(selectedEvent, lang);
    const confirmed = window.confirm(
      lang === "ar"
        ? `هل أنت متأكد من حذف حدث "${dispTitle}"؟`
        : `Are you sure you want to delete "${dispTitle}"?`
    );

    if (confirmed) {
      if (onDeleteEvent) {
        onDeleteEvent(selectedEvent.id);
      }
      setSelectedEvent(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#800020]/15 via-[#FBF8EF] to-[#1A365D]/15 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#1A365D]/25 shadow-md">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
            {t.eventsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E4E] dark:text-[#A99F8D] mt-1">
            {t.eventsSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#A01128] text-white font-bold text-xs sm:text-sm shadow-md hover:brightness-110 transition-all hover:scale-105 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>{t.addEvent}</span>
        </button>
      </div>

      {/* Events Summary Dashboard with Total Events & Millennia Tabs & Per-tab People Filter Switch */}
      <EventsSummaryDashboard
        events={events}
        people={people}
        selectedTab={selectedTab}
        onSelectTab={(tabId) => setSelectedTab(tabId)}
        tabFilters={tabFilters}
        onUpdateTabFilter={handleUpdateTabFilter}
        lang={lang}
      />

      {/* Bilingual Search */}
      <div className="relative">
        <div className={`absolute top-1/2 -translate-y-1/2 ${lang === "ar" ? "right-4" : "left-4"} text-[#D4AF37]`}>
          <Search size={18} />
        </div>
        <input
          type="search"
          placeholder={lang === "ar" ? "ابحث عن الأحداث الكتابية بالعربية أو الإنجليزية..." : "Search events by title, description, or location..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full py-2.5 sm:py-3.5 rounded-xl border-2 border-[#D4AF37]/50 bg-white/80 dark:bg-[#1C1A17] shadow-sm text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${
            lang === "ar" ? "pr-11 pl-4 font-amiri text-sm sm:text-base" : "pl-11 pr-4"
          }`}
        />
      </div>

      {/* Filter Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#7A6E5E] dark:text-[#A99F8D]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">
            {t.showingEventsCount} <span className="font-bold text-[#800020] dark:text-[#F3E5AB] font-mono">{filteredEvents.length}</span> {t.ofEvents} <span className="font-mono">{events.length}</span> {t.eventsWord}
          </span>

          {selectedTab !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#800020]/10 dark:bg-[#800020]/30 text-[#800020] dark:text-[#F3E5AB] border border-[#800020]/20 font-medium">
              <span>{selectedTab}</span>
              <button
                type="button"
                onClick={() => setSelectedTab("all")}
                className="hover:text-red-700 transition cursor-pointer"
                title={lang === "ar" ? "إلغاء تصفية الألفية" : "Clear millennium filter"}
              >
                <X size={12} />
              </button>
            </span>
          )}

          {tabFilters[selectedTab]?.enabled && tabFilters[selectedTab].selectedPersonIds.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-medium">
              <Users size={12} />
              <span>
                {lang === "ar"
                  ? `${tabFilters[selectedTab].selectedPersonIds.length} شخصية محددة`
                  : `${tabFilters[selectedTab].selectedPersonIds.length} figures selected`}
              </span>
              <button
                type="button"
                onClick={() => handleUpdateTabFilter(selectedTab, { selectedPersonIds: [] })}
                className="hover:text-red-700 transition cursor-pointer"
                title={lang === "ar" ? "إلغاء تصفية الشخصيات" : "Clear figure filter"}
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>

        {(selectedTab !== "all" || search || (tabFilters[selectedTab]?.enabled && tabFilters[selectedTab].selectedPersonIds.length > 0)) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedTab("all");
              if (tabFilters[selectedTab]?.enabled) {
                handleUpdateTabFilter(selectedTab, { selectedPersonIds: [] });
              }
            }}
            className="inline-flex items-center gap-1 text-[11px] text-[#800020] dark:text-[#D4AF37] hover:underline font-semibold cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>{lang === "ar" ? "إعادة ضبط التصفية" : "Reset all filters"}</span>
          </button>
        )}
      </div>

      {/* Empty State when no events match */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-[#D4AF37]/50 bg-white/40 dark:bg-[#1C1A17]/40 space-y-3">
          <BookOpen size={36} className="mx-auto text-[#D4AF37]" />
          <h3 className="text-base font-bold text-[#800020] dark:text-[#F3E5AB]">
            {t.noEventsInMillennium}
          </h3>
          <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] max-w-md mx-auto">
            {lang === "ar"
              ? "لم يتم العثور على أحداث تطابق خيارات البحث أو التصفية الحالية. جرب تغيير الألفية أو إزالة تصفية الشخصيات."
              : "No events match the current search or tab filters. Try switching millennium or clearing the figure filter."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedTab("all");
              if (tabFilters[selectedTab]?.enabled) {
                handleUpdateTabFilter(selectedTab, { selectedPersonIds: [] });
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold shadow-sm hover:brightness-110 transition"
          >
            <RotateCcw size={13} />
            <span>{lang === "ar" ? "عرض جميع الأحداث" : "Show All Events"}</span>
          </button>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {filteredEvents.map((event, index) => {
          const displayTitle = getEventDisplayTitle(event, lang);
          const displayDesc = getEventDisplayDescription(event, lang);
          const effYear = resolveEventYear(event, people);
          const formattedYear = formatYearDisplay(effYear, lang);
          const secondaryTitle = lang === "ar" ? event.title : event.arabicTitle;
          const locList =
            event.locations && event.locations.length > 0
              ? event.locations
              : event.location
              ? [event.location]
              : [];

          return (
            <div
              key={`event_${event.id}_${index}`}
              onClick={() => handleOpenModal(event)}
              className="cursor-pointer relative flex flex-col justify-between p-5 rounded-2xl border-2 border-[#D4AF37]/50 bg-white/70 dark:bg-[#1C1A17] shadow-sm hover:shadow-lg hover:border-[#D4AF37] transition-all transform hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#D4AF37]/30">
                  <div>
                    <h3 className="text-lg font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                      {displayTitle}
                    </h3>
                    {secondaryTitle && (
                      <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] mt-0.5">
                        {secondaryTitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {effYear !== undefined ? (
                      <div className="flex flex-col items-end">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                          {formattedYear}
                        </span>
                        {event.anchorPersonId && (
                          <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                            {getPersonName(event.anchorPersonId)} ({event.anchorAge ?? event.anchorPersonAgeAtEvent} {t.years})
                          </span>
                        )}
                      </div>
                    ) : event.anchorPersonId ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#1A365D]/40 bg-[#1A365D]/10 text-[#1A365D] dark:text-[#90CDF4]">
                        {getPersonName(event.anchorPersonId)} ({event.anchorAge ?? event.anchorPersonAgeAtEvent} {t.years})
                      </span>
                    ) : null}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(event);
                      }}
                      className="p-1 rounded-md text-[#6B5E4E] dark:text-[#A99F8D] hover:bg-[#D4AF37]/20 hover:text-[#800020] dark:hover:text-[#F3E5AB] transition-colors"
                      title={t.editEvent}
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                </div>

                {locList.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B5E4E] dark:text-[#A99F8D]">
                    <MapPin size={13} className="text-[#800020] dark:text-[#D4AF37] shrink-0" />
                    {locList.map((loc, lIdx) => (
                      <span
                        key={`loc_${lIdx}`}
                        className="px-2 py-0.5 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-stone-700 dark:text-stone-300 font-medium text-[11px]"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                )}

                {displayDesc && (
                  <p className="text-xs text-[#4A3E31] dark:text-[#C5BBAE] leading-relaxed line-clamp-3">
                    {displayDesc}
                  </p>
                )}

                {event.personIds && event.personIds.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 mt-2">
                    <Users size={12} className="text-[#800020] dark:text-[#D4AF37] shrink-0" />
                    {event.personIds.map((id, pIdx) => (
                      <span
                        key={`ev_pid_${id}_${pIdx}`}
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#1A365D]/10 dark:bg-[#1A365D]/30 border border-[#1A365D]/20 text-[#1A365D] dark:text-[#90CDF4]"
                      >
                        {getPersonName(id)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {event.biblicalReferences && event.biblicalReferences.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center gap-1.5 text-[11px] text-[#8C6F12] dark:text-[#F3E5AB] font-semibold">
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

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <AddEventModal
          existingPeople={people}
          onAddEvent={onAddEvent}
          onClose={() => setIsAddModalOpen(false)}
          lang={lang}
        />
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <AddEventModal
          existingPeople={people}
          initialEvent={editingEvent}
          onUpdateEvent={(updated) => {
            if (onUpdateEvent) onUpdateEvent(updated);
            setSelectedEvent(updated);
            setEditingEvent(null);
          }}
          onClose={() => setEditingEvent(null)}
          lang={lang}
        />
      )}

      {/* View Event Modal */}
      {selectedEvent && !editingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-[#FBF8EF] dark:bg-[#1C1A17] text-[#2D2721] dark:text-[#E6E0D4] border-2 border-[#D4AF37] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#D4AF37]/40 bg-gradient-to-r from-[#800020]/15 via-[#D4AF37]/15 to-[#1A365D]/10">
              <div className="flex items-center gap-3">
                <CopticCross size={28} />
                <div>
                  <h3 className="text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                    {getEventDisplayTitle(selectedEvent, lang)}
                  </h3>
                  {((lang === "ar" && selectedEvent.title) || (lang !== "ar" && selectedEvent.arabicTitle)) && (
                    <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] mt-0.5">
                      {lang === "ar" ? selectedEvent.title : selectedEvent.arabicTitle}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg text-[#6B5E4E] dark:text-[#A99F8D] hover:bg-[#D4AF37]/20 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2">
                {resolveEventYear(selectedEvent, people) !== undefined && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                    {formatYearDisplay(resolveEventYear(selectedEvent, people), lang)}
                  </span>
                )}
                {selectedEvent.anchorPersonId && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-[#1A365D]/30 bg-[#1A365D]/10 text-[#1A365D] dark:text-[#90CDF4]">
                    {lang === "ar" ? "مرتبط بـ" : "Relative to"}{" "}
                    <span className="font-bold">{getPersonName(selectedEvent.anchorPersonId)}</span> (
                    {selectedEvent.anchorAge ?? selectedEvent.anchorPersonAgeAtEvent} {t.years})
                  </span>
                )}
              </div>

              {/* Multiple Locations Display */}
              {((selectedEvent.locations && selectedEvent.locations.length > 0) || selectedEvent.location) && (
                <div className="p-3 bg-white/60 dark:bg-[#141210] rounded-xl border border-[#D4AF37]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                    <MapPin size={14} />
                    <span>{t.multipleLocations}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvent.locations && selectedEvent.locations.length > 0 ? (
                      selectedEvent.locations.map((loc, lIdx) => (
                        <span
                          key={`loc_badge_${lIdx}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-stone-800 dark:text-stone-200"
                        >
                          <MapPin size={11} className="text-[#800020] dark:text-[#D4AF37]" />
                          {loc}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                        {selectedEvent.location}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {getEventDisplayDescription(selectedEvent, lang) && (
                <p className="text-sm leading-relaxed text-[#4A3E31] dark:text-[#C5BBAE] bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/25">
                  {getEventDisplayDescription(selectedEvent, lang)}
                </p>
              )}

              {selectedEvent.personIds && selectedEvent.personIds.length > 0 && (
                <div className="p-3 bg-white/60 dark:bg-[#141210] rounded-xl border border-[#D4AF37]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                    <Users size={14} />
                    <span>{t.associatedPeople}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#800020]/15 dark:bg-[#D4AF37]/25 font-semibold">
                      {selectedEvent.personIds.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvent.personIds.map((id, pIdx) => (
                      <span
                        key={`sel_ev_pid_${id}_${pIdx}`}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1A365D]/10 dark:bg-[#1A365D]/30 border border-[#1A365D]/25 text-[#1A365D] dark:text-[#90CDF4] shadow-xs"
                      >
                        {getPersonName(id)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.biblicalReferences && selectedEvent.biblicalReferences.length > 0 && (
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6F12] dark:text-[#F3E5AB]">
                  <BookOpen size={14} />
                  <span>
                    {localizeBiblicalReferences(selectedEvent.biblicalReferences, lang).join(
                      lang === "ar" ? "، " : ", "
                    )}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/30">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>{lang === "ar" ? "حذف الحدث" : "Delete Event"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartEdit(selectedEvent)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-[#121110] text-xs font-bold shadow cursor-pointer"
                >
                  <Edit3 size={14} />
                  <span>{t.editEvent}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
