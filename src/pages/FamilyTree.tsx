import { useState } from "react";
import { computeAllDates } from "../utils/chronology";
import type { Person, Language } from "../types/genealogy";
import {
  UI_TRANSLATIONS,
  getPersonDisplayName,
  formatYearDisplay,
} from "../utils/i18n";
import { Heart, GitCommit, User, Sparkles } from "lucide-react";
import { CopticCross } from "../components/Coptic/CopticCross";

type FamilyTreeProps = {
  people: Person[];
  lang?: Language;
};

export default function FamilyTree({ people = [], lang = "en" }: FamilyTreeProps) {
  const [selectedPatriarchId, setSelectedPatriarchId] = useState<string>("all");
  const t = UI_TRANSLATIONS[lang];

  const computedPeople = computeAllDates(people);
  const findPerson = (id?: string) => computedPeople.find((p) => p.id === id);

  // Patriarchs (male lineage figures)
  const patriarchs = computedPeople.filter((p) => p.gender === "male");

  const displayedPatriarchs =
    selectedPatriarchId === "all"
      ? patriarchs
      : patriarchs.filter((p) => p.id === selectedPatriarchId);

  return (
    <div className="space-y-8 animate-fadeIn" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="p-6 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#800020]/15 via-[#FBF8EF] to-[#D4AF37]/15 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#800020]/25 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CopticCross size={26} />
              <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                {t.treeTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6B5E4E] dark:text-[#A99F8D] mt-1 max-w-2xl">
              {t.treeSubtitle}
            </p>
          </div>

          {/* Quick Filter dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#800020] dark:text-[#D4AF37] whitespace-nowrap">
              {lang === "ar" ? "تصفية حسب الأب:" : "Filter Patriarch:"}
            </span>
            <select
              value={selectedPatriarchId}
              onChange={(e) => setSelectedPatriarchId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#D4AF37]/60 bg-white dark:bg-[#1C1A17] text-xs sm:text-sm font-semibold text-[#800020] dark:text-[#F3E5AB] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="all">{lang === "ar" ? "جميع الآباء والبطاركة" : "All Biblical Patriarchs"}</option>
              {patriarchs.map((p) => (
                <option key={p.id} value={p.id}>
                  {getPersonDisplayName(p, lang)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patriarchs Family Units List */}
      <div className="space-y-8">
        {displayedPatriarchs.map((husband) => {
          const husbandDisplayName = getPersonDisplayName(husband, lang);
          const husbandSubName = lang === "ar" ? husband.name : husband.arabicName;

          // 1. Prior Generation (Parents)
          const father = findPerson(husband.fatherId);
          const mother = findPerson(husband.motherId);
          const fatherName = father ? getPersonDisplayName(father, lang) : t.rootCreation;
          const motherName = mother
            ? getPersonDisplayName(mother, lang)
            : husband.fatherId
            ? lang === "ar"
              ? "أم غير مسجلة في السفر"
              : "Unrecorded Mother"
            : t.rootCreation;

          // 2. Marriage Generation (Wives / Spouses)
          const wives: Person[] = computedPeople.filter(
            (p) =>
              (husband.spouseIds || []).includes(p.id) ||
              p.husbandId === husband.id
          );

          // 3. Next Generation (Children)
          const children = computedPeople.filter((p) => p.fatherId === husband.id);

          return (
            <div
              key={husband.id}
              className="relative overflow-hidden rounded-2xl border-2 border-[#D4AF37] bg-white/70 dark:bg-[#1C1A17] p-6 shadow-md transition-all space-y-6"
            >
              {/* Top Illuminated Accents */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#1A365D]" />

              {/* 1. PARENTS GENERATION (Mother & Father) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B5E4E] dark:text-[#A99F8D]">
                  <GitCommit size={14} className="text-[#800020] dark:text-[#D4AF37]" />
                  <span>{t.parentGeneration}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Father Pill */}
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-xs font-semibold text-[#800020] dark:text-[#F3E5AB]">
                    <span className="text-[10px] uppercase font-bold text-[#8C6F12] dark:text-[#C5A028]">
                      {t.father}:
                    </span>
                    <span>{fatherName}</span>
                  </div>

                  <span className="text-xs font-bold text-[#D4AF37]">+</span>

                  {/* Mother Pill */}
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-pink-300/60 bg-pink-50/50 dark:bg-pink-950/30 text-xs font-semibold text-pink-900 dark:text-pink-300">
                    <span className="text-[10px] uppercase font-bold text-pink-700 dark:text-pink-400">
                      {t.mother}:
                    </span>
                    <span>{motherName}</span>
                  </div>
                </div>
              </div>

              {/* Vertical Decorative Divider */}
              <div className="flex justify-center my-2">
                <div className="w-px h-6 bg-[#D4AF37]/60" />
              </div>

              {/* 2. MARRIAGE GENERATION (Husband & Spouses) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37]">
                  <Sparkles size={14} />
                  <span>{t.marriageGeneration}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Patriarch Box */}
                  <div className="rounded-xl p-4 border-2 border-[#800020]/40 dark:border-[#800020] bg-gradient-to-br from-[#800020]/5 to-transparent space-y-2 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37]">
                          {lang === "ar" ? "رأس الأسرة / الأب" : "Husband / Patriarch"}
                        </span>
                        <h4 className="text-lg font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                          {husbandDisplayName}
                        </h4>
                        {husbandSubName && (
                          <span className="text-xs text-[#7A6E5E] dark:text-[#A99F8D]">
                            {husbandSubName}
                          </span>
                        )}
                      </div>

                      {husband.yearsLived && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                          {husband.yearsLived} {t.years}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#5C5042] dark:text-[#A99F8D] space-y-1 pt-1">
                      <div>
                        <strong>{t.birth}:</strong> {formatYearDisplay(husband.birthYearBC, lang)}
                        {" — "}
                        <strong>{t.death}:</strong> {formatYearDisplay(husband.deathYearBC, lang)}
                      </div>
                      {husband.husbandMarriageAge && (
                        <div>
                          <strong>{t.marriedAt}:</strong> {husband.husbandMarriageAge} {t.years}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Wives / Spouses Box */}
                  <div className="rounded-xl p-4 border-2 border-pink-300/50 dark:border-pink-900/60 bg-gradient-to-br from-pink-50/40 dark:from-pink-950/20 to-transparent space-y-3 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-700 dark:text-pink-400">
                      <Heart size={12} />
                      <span>{t.spouse}</span>
                    </div>

                    {wives.length > 0 ? (
                      wives.map((wife) => {
                        const wifeDisplayName = getPersonDisplayName(wife, lang);
                        return (
                          <div key={wife.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-base font-cinzel text-pink-900 dark:text-pink-200">
                                {wifeDisplayName}
                              </h5>
                              {wife.yearsLived && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-300">
                                  {wife.yearsLived} {t.years}
                                </span>
                              )}
                            </div>
                            {wife.notes && (
                              <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] italic">
                                {wife.notes}
                              </p>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-[#8C7B6B] dark:text-[#9F9382] italic py-2">
                        {lang === "ar"
                          ? "الزوجة غير مسجلة بالاسم (وفقاً لسجل سفر التكوين)"
                          : "Wife unrecorded by name (Genesis 5 genealogy record)"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. NEXT GENERATION (Children) */}
              <div className="space-y-2 pt-2 border-t border-[#D4AF37]/20">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A365D] dark:text-[#90CDF4]">
                  <User size={14} />
                  <span>{t.childrenGeneration} ({children.length})</span>
                </div>

                {children.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {children.map((child) => {
                      const childDisplayName = getPersonDisplayName(child, lang);
                      const childMother = findPerson(child.motherId);
                      const motherLabel = childMother
                        ? getPersonDisplayName(childMother, lang)
                        : lang === "ar"
                        ? "غير مسجلة"
                        : "Unrecorded";

                      return (
                        <div
                          key={child.id}
                          className="p-3 rounded-xl border border-[#D4AF37]/40 bg-white/50 dark:bg-[#121110]/50 space-y-1 hover:border-[#D4AF37] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-[#800020] dark:text-[#F3E5AB]">
                              {childDisplayName}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                child.gender === "male"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                  : "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300"
                              }`}
                            >
                              {child.gender === "male" ? t.male : t.female}
                            </span>
                          </div>

                          <div className="text-[11px] text-[#7A6E5E] dark:text-[#A99F8D]">
                            <span>{t.mother}: <strong>{motherLabel}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-[#8C7B6B] dark:text-[#9F9382] italic">
                    {t.noChildren}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
