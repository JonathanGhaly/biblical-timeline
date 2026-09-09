import React from "react";
import type { ComputedPerson } from "../../utils/chronology";
import type { Language } from "../../types/genealogy";
import {
  UI_TRANSLATIONS,
  getPersonDisplayName,
  formatYearDisplay,
} from "../../utils/i18n";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Heart,
  Calendar,
} from "lucide-react";

export interface TreeNodeData {
  person: ComputedPerson;
  level: number;
  generationNumber: number;
  father?: ComputedPerson;
  mother?: ComputedPerson;
  spouses: ComputedPerson[];
  children: TreeNodeData[];
}

interface InteractiveTreeNodeProps {
  node: TreeNodeData;
  lang: Language;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  onSelectPerson: (person: ComputedPerson) => void;
  searchTerm?: string;
}

export const InteractiveTreeNode: React.FC<InteractiveTreeNodeProps> = ({
  node,
  lang,
  expandedIds,
  toggleExpand,
  onSelectPerson,
  searchTerm = "",
}) => {
  const { person, children, spouses, generationNumber } = node;
  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(person.id);

  const displayName = getPersonDisplayName(person, lang);
  const subName = isRTL ? person.name : person.arabicName;

  // Search match
  const term = searchTerm.trim().toLowerCase();
  const isDirectMatch =
    Boolean(term) &&
    (person.name.toLowerCase().includes(term) ||
      (person.arabicName && person.arabicName.includes(term)) ||
      displayName.toLowerCase().includes(term));

  const sonsCount = children.filter((c) => c.person.gender === "male").length;
  const daughtersCount = children.length - sonsCount;

  const ExpandIcon = isExpanded
    ? ChevronDown
    : isRTL
    ? ChevronLeft
    : ChevronRight;

  return (
    <div className="relative flex flex-col items-start select-none">
      {/* Node Row */}
      <div className="flex items-center gap-2 group relative z-10">
        {/* Branch Toggle Button / Bullet */}
        {hasChildren ? (
          <button
            onClick={() => toggleExpand(person.id)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-200 shadow-sm shrink-0 ${
              isExpanded
                ? "border-[#800020] bg-[#800020] text-white dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#121110]"
                : "border-[#D4AF37] bg-white text-[#800020] hover:bg-[#D4AF37]/20 dark:bg-[#1C1A17] dark:text-[#F3E5AB]"
            }`}
            title={
              isExpanded
                ? lang === "ar"
                  ? "طي الفرع"
                  : "Collapse Branch"
                : lang === "ar"
                ? "توسيع الفرع"
                : "Expand Branch"
            }
          >
            <ExpandIcon size={16} />
          </button>
        ) : (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-dashed border-[#D4AF37]/40 bg-white/40 dark:bg-white/5 text-[#8C7B6B] shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          </div>
        )}

        {/* Node Card */}
        <div
          onClick={() => onSelectPerson(person)}
          className={`cursor-pointer transition-all duration-200 rounded-xl p-3 border shadow-sm flex flex-wrap items-center gap-3 ${
            isDirectMatch
              ? "ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-500"
              : "border-[#D4AF37]/60 bg-white dark:bg-[#1C1A17] hover:border-[#800020] dark:hover:border-[#D4AF37] hover:shadow-md"
          }`}
        >
          {/* Generation Badge */}
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border border-[#800020]/30 bg-[#800020]/10 dark:bg-[#800020]/30 text-[#800020] dark:text-[#F3E5AB]">
            {t.generation} {generationNumber}
          </span>

          {/* Name & Gender */}
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
              {displayName}
            </h4>
            {subName && (
              <span className="text-[11px] text-[#7A6E5E] dark:text-[#A99F8D]">
                ({subName})
              </span>
            )}
            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                person.gender === "male"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                  : "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300"
              }`}
            >
              {person.gender === "male" ? t.male : t.female}
            </span>
          </div>

          {/* Lifespan & Dates */}
          <div className="flex items-center gap-2 text-xs text-[#5C5042] dark:text-[#C5BAA8]">
            {person.yearsLived !== undefined && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#8C6F12] dark:text-[#F3E5AB]">
                <Calendar size={10} />
                {person.yearsLived} {t.years}
              </span>
            )}

            {(person.birthYearBC !== undefined || person.deathYearBC !== undefined) && (
              <span className="text-[11px] text-[#7A6E5E] dark:text-[#A99F8D]">
                {formatYearDisplay(person.birthYearBC, lang)}
                {" — "}
                {formatYearDisplay(person.deathYearBC, lang)}
              </span>
            )}
          </div>

          {/* Spouses Pill */}
          {spouses.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-pink-300/60 bg-pink-50/50 dark:bg-pink-950/30 text-pink-800 dark:text-pink-300">
              <Heart size={10} />
              <span>
                {spouses.map((s) => getPersonDisplayName(s, lang)).join(" + ")}
              </span>
            </div>
          )}

          {/* Children Count Badge */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(person.id);
              }}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#1A365D]/30 bg-[#1A365D]/10 dark:bg-[#90CDF4]/10 text-[#1A365D] dark:text-[#90CDF4] hover:bg-[#1A365D]/20 transition-colors"
            >
              {sonsCount > 0 && `${sonsCount} ${lang === "ar" ? "أبناء" : "sons"}`}
              {daughtersCount > 0 && ` ${daughtersCount} ${lang === "ar" ? "بنات" : "daughters"}`}
              {" • "}
              {isExpanded
                ? lang === "ar"
                  ? "طي"
                  : "Hide"
                : lang === "ar"
                ? "عرض"
                : "Show"}
            </button>
          )}
        </div>
      </div>

      {/* Children Subtree (Ordered Father -> Sons) */}
      {hasChildren && isExpanded && (
        <div
          className={`relative flex flex-col space-y-3 pt-3 ${
            isRTL
              ? "mr-3.5 pr-5 border-r-2 border-[#D4AF37]/50"
              : "ml-3.5 pl-5 border-l-2 border-[#D4AF37]/50"
          }`}
        >
          {children.map((childNode) => (
            <InteractiveTreeNode
              key={childNode.person.id}
              node={childNode}
              lang={lang}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onSelectPerson={onSelectPerson}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};
