import React, { useState, useMemo, useRef, useEffect } from "react";
import type { Person, Language } from "../../types/genealogy";
import { getPersonDisplayName } from "../../utils/i18n";
import { Users, Check, X, Search, UserPlus, Sparkles } from "lucide-react";

interface PersonSelectorProps {
  people: Person[];
  selectedPersonIds: string[];
  onChange: (personIds: string[]) => void;
  lang?: Language;
  label?: string;
}

const QUICK_PICK_KEYS = [
  "adam",
  "eve",
  "noah",
  "abraham",
  "sarah",
  "isaac",
  "jacob",
  "joseph",
  "moses",
  "aaron",
  "joshua",
  "david",
  "solomon",
];

export function PersonSelector({
  people = [],
  selectedPersonIds = [],
  onChange,
  lang = "en",
  label,
}: PersonSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isRTL = lang === "ar";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedPeople = useMemo(() => {
    return selectedPersonIds
      .map((id) => people.find((p) => p.id === id))
      .filter((p): p is Person => Boolean(p));
  }, [selectedPersonIds, people]);

  // Filtered available people
  const filteredPeople = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return people;
    return people.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(term);
      const arMatch = (p.arabicName || "").toLowerCase().includes(term);
      const idMatch = p.id.toLowerCase().includes(term);
      return nameMatch || arMatch || idMatch;
    });
  }, [people, searchTerm]);

  // Common notable biblical figures for quick one-tap suggestion
  const quickPickPeople = useMemo(() => {
    return QUICK_PICK_KEYS
      .map((key) =>
        people.find(
          (p) =>
            p.id.toLowerCase() === key ||
            p.name.toLowerCase() === key ||
            p.name.toLowerCase().startsWith(key)
        )
      )
      .filter((p): p is Person => p !== undefined && !selectedPersonIds.includes(p.id))
      .slice(0, 6);
  }, [people, selectedPersonIds]);

  const togglePerson = (personId: string) => {
    if (selectedPersonIds.includes(personId)) {
      onChange(selectedPersonIds.filter((id) => id !== personId));
    } else {
      onChange([...selectedPersonIds, personId]);
    }
  };

  const removePerson = (personId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedPersonIds.filter((id) => id !== personId));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      {/* Label and counter */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
          <Users size={14} className="text-[#800020] dark:text-[#D4AF37]" />
          <span>
            {label || (isRTL ? "الشخصيات المرتبطة بالحدث" : "Included Persons for Event")}
          </span>
          {selectedPersonIds.length > 0 && (
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#800020]/15 dark:bg-[#D4AF37]/25 text-[#800020] dark:text-[#F3E5AB]">
              {selectedPersonIds.length}
            </span>
          )}
        </label>

        {selectedPersonIds.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-medium text-[#800020] dark:text-[#D4AF37] hover:underline"
          >
            {isRTL ? "مسح الكل" : "Clear All"}
          </button>
        )}
      </div>

      {/* Selected Persons Chips */}
      {selectedPeople.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-[#D4AF37]/35 bg-[#D4AF37]/5 dark:bg-[#D4AF37]/10 min-h-[38px] items-center">
          {selectedPeople.map((person, idx) => {
            const displayName = getPersonDisplayName(person, lang);
            const secondaryName =
              lang === "ar" ? person.name : person.arabicName;

            return (
              <span
                key={`sel_${person.id}_${idx}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#1C1A17] text-[#800020] dark:text-[#F3E5AB] border border-[#D4AF37]/50 shadow-xs transition-all hover:border-[#800020]"
              >
                <span>{displayName}</span>
                {secondaryName && secondaryName !== displayName && (
                  <span className="text-[10px] opacity-70 font-normal">
                    ({secondaryName})
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => removePerson(person.id, e)}
                  className="p-0.5 rounded-full hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-500 hover:text-rose-700 transition-colors ms-0.5"
                  title={isRTL ? "إزالة الشخصية" : "Remove person"}
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
      ) : (
        <div className="text-[11px] text-[#7A6E5E] dark:text-[#A99F8D] italic px-1">
          {isRTL
            ? "لم يتم تحديد أي شخصيات بعد. ابحث وحدد شخصيات أدناه."
            : "No persons included yet. Search and select biblical figures below."}
        </div>
      )}

      {/* Search and Picker Trigger */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search
            size={14}
            className={`absolute ${
              isRTL ? "right-3" : "left-3"
            } text-[#8C6F12] dark:text-[#D4AF37] pointer-events-none`}
          />
          <input
            type="text"
            placeholder={
              isRTL
                ? "ابحث بالاسم العربي أو الإنجليزي لتضمين شخصية..."
                : "Search by English or Arabic name to include..."
            }
            value={searchTerm}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            className={`w-full py-2 ${
              isRTL ? "pr-9 pl-8" : "pl-9 pr-8"
            } rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]`}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className={`absolute ${
                isRTL ? "left-2.5" : "right-2.5"
              } p-1 text-[#8C6F12] hover:text-rose-600`}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Dropdown list of figures */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border-2 border-[#D4AF37] bg-[#FBF8EF] dark:bg-[#1C1A17] shadow-xl p-1.5 divide-y divide-[#D4AF37]/15">
            {filteredPeople.length === 0 ? (
              <div className="p-3 text-center text-xs text-[#7A6E5E] dark:text-[#A99F8D]">
                {isRTL
                  ? "لا توجد شخصيات مطابقة للبحث"
                  : "No matching figures found"}
              </div>
            ) : (
              filteredPeople.map((person, idx) => {
                const isSelected = selectedPersonIds.includes(person.id);
                const displayName = getPersonDisplayName(person, lang);
                const secondaryName =
                  lang === "ar" ? person.name : person.arabicName;

                return (
                  <button
                    key={`pick_${person.id}_${idx}`}
                    type="button"
                    onClick={() => togglePerson(person.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors text-xs ${
                      isSelected
                        ? "bg-[#D4AF37]/20 dark:bg-[#D4AF37]/25 font-bold text-[#800020] dark:text-[#F3E5AB]"
                        : "hover:bg-[#D4AF37]/10 text-[#2D2721] dark:text-[#E6E0D4]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          isSelected
                            ? "bg-[#800020] text-[#F3E5AB]"
                            : "bg-[#D4AF37]/20 text-[#800020] dark:text-[#D4AF37]"
                        }`}
                      >
                        {displayName.charAt(0)}
                      </div>
                      <div className="leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold">{displayName}</span>
                          {secondaryName && secondaryName !== displayName && (
                            <span className="text-[10px] text-[#7A6E5E] dark:text-[#A99F8D] font-normal">
                              ({secondaryName})
                            </span>
                          )}
                        </div>
                        {person.placeOfBirth && (
                          <div className="text-[10px] text-[#8C6F12] dark:text-[#D4AF37]/80">
                            📍 {person.placeOfBirth}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 ms-2">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#800020] text-white">
                          <Check size={11} />
                          {isRTL ? "محدد" : "Included"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border border-[#D4AF37]/40 text-[#8C6F12] dark:text-[#F3E5AB] hover:bg-[#D4AF37]/20">
                          <UserPlus size={11} />
                          {isRTL ? "إضافة" : "Add"}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Quick Suggestions Strip */}
      {quickPickPeople.length > 0 && !searchTerm && (
        <div className="flex flex-wrap items-center gap-1 pt-1">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#8C6F12] dark:text-[#D4AF37] me-1">
            <Sparkles size={11} />
            {isRTL ? "اقتراحات سريعة:" : "Quick add:"}
          </span>
          {quickPickPeople.map((person, idx) => (
            <button
              key={`quick_${person.id}_${idx}`}
              type="button"
              onClick={() => togglePerson(person.id)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border border-[#D4AF37]/35 bg-white/70 dark:bg-[#151311] text-[#2D2721] dark:text-[#E6E0D4] hover:border-[#800020] hover:text-[#800020] dark:hover:text-[#F3E5AB] transition-colors"
            >
              <UserPlus size={10} className="text-[#8C6F12]" />
              <span>{getPersonDisplayName(person, lang)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
