import React, { useState } from "react";
import type { BiblicalEvent, Person, Language } from "../../types/genealogy";
import {
  computeMillenniumSummaries,
  getMillenniumDisplayLabel,
  getMillenniumSpanDisplay,
  type MillenniumId,
  type MillenniumSummaryItem,
} from "../../utils/millennium";
import {
  UI_TRANSLATIONS,
  getPersonDisplayName,
} from "../../utils/i18n";
import {
  BookOpen,
  Calendar,
  Users,
  Check,
  X,
  Filter,
  Layers,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export interface TabPeopleFilterState {
  enabled: boolean;
  selectedPersonIds: string[];
}

interface EventsSummaryDashboardProps {
  events: BiblicalEvent[];
  people: Person[];
  selectedTab: MillenniumId;
  onSelectTab: (tabId: MillenniumId) => void;
  tabFilters: Record<string, TabPeopleFilterState>;
  onUpdateTabFilter: (
    tabId: string,
    filter: Partial<TabPeopleFilterState>
  ) => void;
  lang: Language;
}

export const EventsSummaryDashboard: React.FC<EventsSummaryDashboardProps> = ({
  events,
  people,
  selectedTab,
  onSelectTab,
  tabFilters,
  onUpdateTabFilter,
  lang,
}) => {
  const [personSearch, setPersonSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  // Compute all millennia summaries and event mapping
  const { totalEvents, summaries, eventMillenniumMap } =
    computeMillenniumSummaries(events, people);

  // Active filter for the currently selected tab
  const activeTabFilter: TabPeopleFilterState = tabFilters[selectedTab] || {
    enabled: false,
    selectedPersonIds: [],
  };

  // Events belonging to the currently selected tab (before people filtering)
  const eventsInCurrentTab = events.filter((ev) => {
    if (selectedTab === "all") return true;
    return eventMillenniumMap.get(ev.id) === selectedTab;
  });

  // Figures involved in this tab's events, sorted by event count descending
  const figuresInCurrentTab = React.useMemo(() => {
    const counts = new Map<string, number>();
    eventsInCurrentTab.forEach((ev) => {
      const ids = new Set<string>();
      if (ev.personIds) {
        ev.personIds.forEach((id) => ids.add(id));
      }
      if (ev.anchorPersonId) {
        ids.add(ev.anchorPersonId);
      }
      ids.forEach((id) => {
        counts.set(id, (counts.get(id) || 0) + 1);
      });
    });

    const list: { personId: string; person?: Person; count: number }[] = [];
    counts.forEach((count, personId) => {
      const person = people.find((p) => p.id === personId);
      list.push({ personId, person, count });
    });

    return list.sort((a, b) => b.count - a.count);
  }, [eventsInCurrentTab, people]);

  // Handler for the Switch: toggles person filter for the active tab
  const handleToggleSwitch = () => {
    const newEnabled = !activeTabFilter.enabled;
    onUpdateTabFilter(selectedTab, {
      enabled: newEnabled,
      // If enabling for the first time with empty selection, keep empty (showing all tab's people)
      selectedPersonIds: activeTabFilter.selectedPersonIds,
    });
  };

  // Handler for toggling an individual person's selection in this tab
  const handleTogglePerson = (personId: string) => {
    const currentList = activeTabFilter.selectedPersonIds;
    const exists = currentList.includes(personId);
    const updated = exists
      ? currentList.filter((id) => id !== personId)
      : [...currentList, personId];

    onUpdateTabFilter(selectedTab, {
      enabled: true,
      selectedPersonIds: updated,
    });
  };

  // Handler for selecting all figures in this tab
  const handleSelectAll = () => {
    onUpdateTabFilter(selectedTab, {
      enabled: true,
      selectedPersonIds: figuresInCurrentTab.map((f) => f.personId),
    });
  };

  // Handler for clearing person selection in this tab
  const handleClearSelection = () => {
    onUpdateTabFilter(selectedTab, {
      enabled: true,
      selectedPersonIds: [],
    });
  };

  // Filtered dropdown list of all figures
  const searchablePeople = React.useMemo(() => {
    if (!personSearch.trim()) return people.slice(0, 15);
    const term = personSearch.toLowerCase();
    return people.filter((p) => {
      const en = p.name.toLowerCase().includes(term);
      const ar = (p.arabicName || "").toLowerCase().includes(term);
      return en || ar;
    });
  }, [people, personSearch]);

  // Active tab label
  const activeTabDefinition = summaries.find(
    (s) => s.definition.id === selectedTab
  )?.definition;

  const activeTabDisplayName =
    selectedTab === "all"
      ? t.allMillenniaTab
      : activeTabDefinition
      ? getMillenniumDisplayLabel(activeTabDefinition, lang)
      : selectedTab;

  return (
    <div
      className="space-y-4 rounded-2xl border-2 border-[#D4AF37]/50 bg-white/70 dark:bg-[#181614]/80 p-4 sm:p-5 shadow-sm"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D4AF37]/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#800020]/15 dark:bg-[#800020]/30 border border-[#800020]/30 flex items-center justify-center text-[#800020] dark:text-[#F3E5AB]">
            <Layers size={17} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
              {t.eventsSummaryTitle}
            </h3>
            <p className="text-[11px] text-[#7A6E5E] dark:text-[#A99F8D]">
              {t.eventsSummarySubtitle}
            </p>
          </div>
        </div>

        {/* Total recorded badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37] bg-[#D4AF37]/15 text-xs font-bold text-[#8C6F12] dark:text-[#F3E5AB]">
          <BookOpen size={13} className="text-[#800020] dark:text-[#D4AF37]" />
          <span>
            {t.totalRecordedEvents}: {totalEvents}
          </span>
        </div>
      </div>

      {/* 2. Millennium Stat Cards Grid (Clickable to switch tab) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Card 0: All Recorded Events */}
        <button
          type="button"
          onClick={() => onSelectTab("all")}
          className={`text-start p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[88px] ${
            selectedTab === "all"
              ? "border-[#800020] bg-gradient-to-br from-[#800020]/10 to-[#D4AF37]/10 dark:from-[#800020]/30 dark:to-[#D4AF37]/20 ring-2 ring-[#800020]/30 shadow-xs"
              : "border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-[#1C1A17]/60 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-bold text-[#6B5E4E] dark:text-[#A99F8D] truncate">
              {t.allMillenniaTab}
            </span>
            <Calendar size={13} className="text-[#800020] dark:text-[#D4AF37] shrink-0" />
          </div>
          <div className="flex items-baseline justify-between w-full">
            <span className="text-xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
              {totalEvents}
            </span>
            <span className="text-[10px] text-[#8C6F12] dark:text-[#D4AF37] font-semibold">
              100%
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-1 rounded-full overflow-hidden">
            <div className="bg-[#800020] dark:bg-[#D4AF37] h-full w-full rounded-full" />
          </div>
        </button>

        {/* Cards 1..N: Individual Millennia */}
        {summaries.map((item) => {
          const isSelected = selectedTab === item.definition.id;
          const label = getMillenniumDisplayLabel(item.definition, lang);
          const span = getMillenniumSpanDisplay(item.definition, lang);

          return (
            <button
              key={item.definition.id}
              type="button"
              onClick={() => onSelectTab(item.definition.id)}
              className={`text-start p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[88px] ${
                isSelected
                  ? "border-[#800020] bg-gradient-to-br from-[#800020]/10 to-[#D4AF37]/10 dark:from-[#800020]/30 dark:to-[#D4AF37]/20 ring-2 ring-[#800020]/30 shadow-xs"
                  : "border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-[#1C1A17]/60 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-bold text-[#6B5E4E] dark:text-[#A99F8D] truncate">
                  {label}
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${
                    isSelected
                      ? "border-[#800020] bg-[#800020] text-white"
                      : "border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#8C6F12] dark:text-[#F3E5AB]"
                  }`}
                >
                  {item.count}
                </span>
              </div>
              <div className="text-[10px] text-[#7A6E5E] dark:text-[#887C6C] truncate font-mono">
                {span}
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-[#D4AF37] dark:bg-[#D4AF37] h-full rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Bar & People Filter Switch Toolbar */}
      <div className="pt-2 border-t border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Millennium Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedTab === "all"
                ? "bg-[#800020] text-white shadow-xs font-bold"
                : "bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-[#D4AF37]/20 hover:text-[#800020]"
            }`}
          >
            <span>{t.allMillenniaTab}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedTab === "all"
                  ? "bg-white/20 text-white"
                  : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
              }`}
            >
              {totalEvents}
            </span>
          </button>

          {summaries.map((item) => {
            const isSelected = selectedTab === item.definition.id;
            const shortLabel =
              lang === "ar"
                ? item.definition.shortLabelAr
                : item.definition.shortLabelEn;

            return (
              <button
                key={`pill_${item.definition.id}`}
                type="button"
                onClick={() => onSelectTab(item.definition.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#800020] text-white shadow-xs font-bold"
                    : "bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-[#D4AF37]/20 hover:text-[#800020]"
                }`}
              >
                <span>{shortLabel}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* The People Filter Switch for this Tab */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-[#FBF8EF] dark:bg-[#121110] px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 shrink-0">
          <div className="flex items-center gap-1.5">
            <Users size={15} className="text-[#800020] dark:text-[#D4AF37]" />
            <label
              htmlFor={`people-switch-${selectedTab}`}
              className="text-xs font-bold text-[#800020] dark:text-[#F3E5AB] cursor-pointer select-none"
            >
              {t.filterPeopleSwitch}
            </label>
          </div>

          {/* Accessible Toggle Switch */}
          <button
            type="button"
            role="switch"
            id={`people-switch-${selectedTab}`}
            aria-checked={activeTabFilter.enabled}
            onClick={handleToggleSwitch}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
              activeTabFilter.enabled
                ? "bg-[#800020] dark:bg-[#D4AF37]"
                : "bg-stone-300 dark:bg-stone-700"
            }`}
          >
            <span className="sr-only">{t.filterPeopleSwitch}</span>
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                activeTabFilter.enabled
                  ? isRTL
                    ? "-translate-x-5"
                    : "translate-x-5"
                  : "translate-x-0"
              }`}
            />
          </button>

          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              activeTabFilter.enabled
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
            }`}
          >
            {activeTabFilter.enabled ? t.filterPeopleActive : t.filterPeopleInactive}
          </span>
        </div>
      </div>

      {/* 4. Expandable People Filter Area (when Switch is ON for this tab) */}
      {activeTabFilter.enabled && (
        <div className="pt-3 border-t border-dashed border-[#D4AF37]/40 space-y-2.5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[#6B5E4E] dark:text-[#A99F8D]">
              <Filter size={13} className="text-[#800020] dark:text-[#D4AF37]" />
              <span className="font-semibold">{t.filterPeopleHint}</span>
              <span className="text-[11px] text-[#8C6F12] dark:text-[#D4AF37]">
                ({activeTabDisplayName})
              </span>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              {figuresInCurrentTab.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[11px] px-2.5 py-1 rounded-md border border-[#D4AF37]/40 bg-white/60 dark:bg-[#1C1A17] text-[#6B5E4E] dark:text-[#A99F8D] hover:text-[#800020] hover:border-[#800020] transition-colors"
                  >
                    {t.selectAllPeople}
                  </button>
                  {activeTabFilter.selectedPersonIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="text-[11px] px-2.5 py-1 rounded-md border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                    >
                      {t.clearPeopleFilter}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick Person Filter Chips for this Tab */}
          {figuresInCurrentTab.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
              {figuresInCurrentTab.map(({ personId, person, count }) => {
                const isSelected =
                  activeTabFilter.selectedPersonIds.includes(personId);
                const name = person ? getPersonDisplayName(person, lang) : personId;

                return (
                  <button
                    key={`tab_p_chip_${personId}`}
                    type="button"
                    onClick={() => handleTogglePerson(personId)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#800020] text-white shadow-xs font-bold border border-[#800020]"
                        : "bg-white/80 dark:bg-[#1C1A17] border border-[#D4AF37]/50 text-[#2D2721] dark:text-[#E6E0D4] hover:border-[#800020] hover:text-[#800020]"
                    }`}
                  >
                    <span>👤 {name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]"
                      }`}
                    >
                      {count}
                    </span>
                    {isSelected && <Check size={12} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] italic py-1">
              {isRTL
                ? "لا توجد شخصيات مرتبطة مسجلة في هذا التبويب."
                : "No linked figures found in this tab's events."}
            </div>
          )}

          {/* Quick Search & Add other figures from whole database */}
          <div className="relative pt-1">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-1.5 text-xs text-[#800020] dark:text-[#F3E5AB] hover:underline font-semibold"
            >
              <Sparkles size={12} className="text-[#D4AF37]" />
              <span>
                {isRTL
                  ? "البحث عن شخصيات أخرى من قاعدة البيانات..."
                  : "Search other figures from database..."}
              </span>
              <ChevronDown size={13} />
            </button>

            {isDropdownOpen && (
              <div className="mt-2 p-3 rounded-xl border border-[#D4AF37] bg-white dark:bg-[#1C1A17] shadow-lg space-y-2 z-20">
                <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-800">
                  <span className="text-xs font-bold text-[#800020] dark:text-[#F3E5AB]">
                    {isRTL ? "اختر شخصية لإضافتها للتصفية" : "Select figure to filter by"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="p-1 rounded text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                  >
                    <X size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={
                    isRTL
                      ? "ابحث بالاسم العربي أو الإنجليزي..."
                      : "Search by English or Arabic name..."
                  }
                  value={personSearch}
                  onChange={(e) => setPersonSearch(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
                <div className="max-h-40 overflow-y-auto space-y-1 scrollbar-thin">
                  {searchablePeople.map((p) => {
                    const isSelected =
                      activeTabFilter.selectedPersonIds.includes(p.id);
                    const displayName = getPersonDisplayName(p, lang);
                    return (
                      <button
                        key={`dropdown_p_${p.id}`}
                        type="button"
                        onClick={() => {
                          handleTogglePerson(p.id);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors text-start ${
                          isSelected
                            ? "bg-[#800020] text-white"
                            : "hover:bg-[#D4AF37]/10 text-stone-700 dark:text-stone-300"
                        }`}
                      >
                        <span>{displayName}</span>
                        {isSelected && <Check size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
