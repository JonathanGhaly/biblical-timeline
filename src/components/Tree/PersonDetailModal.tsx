import React from "react";
import type { ComputedPerson } from "../../utils/chronology";
import type { Language } from "../../types/genealogy";
import {
  UI_TRANSLATIONS,
  getPersonDisplayName,
  formatYearDisplay,
} from "../../utils/i18n";
import {
  X,
  Calendar,
  Clock,
  Heart,
  User,
  Users,
  GitCommit,
  BookOpen,
} from "lucide-react";
import { CopticCross } from "../Coptic/CopticCross";

interface PersonDetailModalProps {
  person: ComputedPerson | null;
  allPeople: ComputedPerson[];
  lang: Language;
  onClose: () => void;
  onSelectPerson: (person: ComputedPerson) => void;
}

export const PersonDetailModal: React.FC<PersonDetailModalProps> = ({
  person,
  allPeople,
  lang,
  onClose,
  onSelectPerson,
}) => {
  if (!person) return null;

  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";
  const peopleMap = new Map(allPeople.map((p) => [p.id, p]));

  const displayName = getPersonDisplayName(person, lang);
  const subName = lang === "ar" ? person.name : person.arabicName;

  // Parents
  const father = person.fatherId ? peopleMap.get(person.fatherId) : undefined;
  const mother = person.motherId ? peopleMap.get(person.motherId) : undefined;

  // Spouses
  const spouses = allPeople.filter(
    (p) =>
      (person.spouseIds || []).includes(p.id) ||
      p.husbandId === person.id ||
      p.wifeId === person.id
  );

  // Children
  const children = allPeople.filter(
    (p) => p.fatherId === person.id || p.motherId === person.id
  );

  // Build Ancestry Breadcrumb Trail
  const ancestryTrail: ComputedPerson[] = [];
  let curr = father;
  const visited = new Set<string>();
  while (curr && !visited.has(curr.id)) {
    visited.add(curr.id);
    ancestryTrail.unshift(curr);
    curr = curr.fatherId ? peopleMap.get(curr.fatherId) : undefined;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      dir={isRTL ? "rtl" : "ltr"}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-[#D4AF37] bg-[#FAF8F5] dark:bg-[#1A1816] text-[#2C241E] dark:text-[#E8DEC8] p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-start justify-between gap-4 border-b border-[#D4AF37]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#800020] dark:text-[#D4AF37]">
              <CopticCross size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                  {displayName}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    person.gender === "male"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      : "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300"
                  }`}
                >
                  {person.gender === "male" ? t.male : t.female}
                </span>
              </div>
              {subName && (
                <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] mt-0.5">
                  {subName}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A6E5E] hover:text-[#800020] hover:bg-[#800020]/10 dark:text-[#A99F8D] dark:hover:text-[#F3E5AB] dark:hover:bg-white/5 transition-colors"
            title={lang === "ar" ? "إغلاق" : "Close"}
          >
            <X size={20} />
          </button>
        </div>

        {/* Ancestry Trail Breadcrumbs */}
        {ancestryTrail.length > 0 && (
          <div className="space-y-1.5 p-3 rounded-xl border border-[#D4AF37]/40 bg-white/70 dark:bg-[#121110]/50">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
              <GitCommit size={14} />
              <span>{t.lineage}:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {ancestryTrail.map((ancestor) => (
                <React.Fragment key={ancestor.id}>
                  <button
                    onClick={() => onSelectPerson(ancestor)}
                    className="font-medium px-2 py-0.5 rounded-md hover:bg-[#D4AF37]/20 text-[#800020] dark:text-[#F3E5AB] transition-colors"
                  >
                    {getPersonDisplayName(ancestor, lang)}
                  </button>
                  <span className="text-[#D4AF37] font-bold">
                    {isRTL ? "←" : "→"}
                  </span>
                </React.Fragment>
              ))}
              <span className="font-bold px-2 py-0.5 rounded-md bg-[#800020]/10 dark:bg-[#D4AF37]/20 text-[#800020] dark:text-[#D4AF37]">
                {displayName}
              </span>
            </div>
          </div>
        )}

        {/* Chronological Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Lifespan */}
          <div className="p-3 rounded-xl border border-[#D4AF37]/40 bg-white/80 dark:bg-[#121110] space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#800020] dark:text-[#D4AF37]">
              <Calendar size={13} />
              <span>{t.lifespan}</span>
            </div>
            <div className="text-base font-bold text-[#2C241E] dark:text-[#F3E5AB]">
              {person.yearsLived !== undefined
                ? `${person.yearsLived} ${t.years}`
                : t.unspecified}
            </div>
          </div>

          {/* Birth Year BC */}
          <div className="p-3 rounded-xl border border-[#D4AF37]/40 bg-white/80 dark:bg-[#121110] space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#800020] dark:text-[#D4AF37]">
              <Clock size={13} />
              <span>{t.birth}</span>
            </div>
            <div className="text-sm font-semibold text-[#2C241E] dark:text-[#F3E5AB]">
              {formatYearDisplay(person.birthYearBC, lang)}
            </div>
          </div>

          {/* Death Year BC */}
          <div className="p-3 rounded-xl border border-[#D4AF37]/40 bg-white/80 dark:bg-[#121110] space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#800020] dark:text-[#D4AF37]">
              <Clock size={13} />
              <span>{t.death}</span>
            </div>
            <div className="text-sm font-semibold text-[#2C241E] dark:text-[#F3E5AB]">
              {formatYearDisplay(person.deathYearBC, lang)}
            </div>
          </div>

          {/* Father's age at birth */}
          {(person.anchorPersonAgeAtBirth !== undefined ||
            person.fatherAgeAtBirth !== undefined) && (
            <div className="p-3 rounded-xl border border-[#D4AF37]/40 bg-white/80 dark:bg-[#121110] space-y-1 col-span-2 sm:col-span-3">
              <div className="text-[11px] font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.anchorAgeLabel}:
              </div>
              <div className="text-sm font-medium">
                {person.anchorPersonAgeAtBirth ?? person.fatherAgeAtBirth} {t.years}
              </div>
            </div>
          )}
        </div>

        {/* Parents & Spouses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Parents Box */}
          <div className="p-4 rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37]">
              <Users size={14} />
              <span>{t.parentGeneration}</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#7A6E5E] dark:text-[#A99F8D]">{t.father}:</span>
                {father ? (
                  <button
                    onClick={() => onSelectPerson(father)}
                    className="font-bold text-[#800020] dark:text-[#F3E5AB] hover:underline"
                  >
                    {getPersonDisplayName(father, lang)}
                  </button>
                ) : (
                  <span className="italic text-[#8C7B6B] dark:text-[#A99F8D]">
                    {t.rootCreation}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#7A6E5E] dark:text-[#A99F8D]">{t.mother}:</span>
                {mother ? (
                  <button
                    onClick={() => onSelectPerson(mother)}
                    className="font-bold text-pink-700 dark:text-pink-300 hover:underline"
                  >
                    {getPersonDisplayName(mother, lang)}
                  </button>
                ) : (
                  <span className="italic text-[#8C7B6B] dark:text-[#A99F8D]">
                    {lang === "ar" ? "غير مسجلة" : "Unrecorded"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Spouses Box */}
          <div className="p-4 rounded-xl border border-pink-300/50 dark:border-pink-900/50 bg-pink-50/30 dark:bg-pink-950/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-700 dark:text-pink-400">
              <Heart size={14} />
              <span>{t.spouse}</span>
            </div>
            {spouses.length > 0 ? (
              <div className="space-y-2">
                {spouses.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => onSelectPerson(s)}
                      className="font-bold text-pink-900 dark:text-pink-200 hover:underline"
                    >
                      {getPersonDisplayName(s, lang)}
                    </button>
                    {s.yearsLived && (
                      <span className="text-[11px] text-[#7A6E5E] dark:text-[#A99F8D]">
                        {s.yearsLived} {t.years}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-[#8C7B6B] dark:text-[#A99F8D]">
                {lang === "ar"
                  ? "غير مسجلة بالاسم في السفر"
                  : "Unrecorded in Scripture"}
              </p>
            )}
          </div>
        </div>

        {/* Children Generation */}
        <div className="p-4 rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A365D] dark:text-[#90CDF4]">
              <User size={14} />
              <span>
                {t.childrenGeneration} ({children.length})
              </span>
            </div>
          </div>

          {children.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => onSelectPerson(child)}
                  className="flex items-center justify-between p-2 rounded-lg border border-[#D4AF37]/30 bg-white/60 dark:bg-[#1C1A17] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs transition-colors text-start"
                >
                  <span className="font-semibold text-[#800020] dark:text-[#F3E5AB] truncate">
                    {getPersonDisplayName(child, lang)}
                  </span>
                  <span
                    className={`text-[9px] px-1 py-0.5 rounded font-bold shrink-0 ${
                      child.gender === "male"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300"
                    }`}
                  >
                    {child.gender === "male" ? t.male : t.female}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-[#8C7B6B] dark:text-[#A99F8D]">
              {t.noChildren}
            </p>
          )}
        </div>

        {/* Biblical Notes & References */}
        {(Boolean(person.notes) || Boolean(person.biblicalReferences && person.biblicalReferences.length > 0)) && (
          <div className="p-4 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 dark:bg-[#161412] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#800020] dark:text-[#D4AF37]">
              <BookOpen size={14} />
              <span>{t.references}:</span>
            </div>
            {person.biblicalReferences && person.biblicalReferences.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {person.biblicalReferences.map((ref, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-white dark:bg-[#201D1A] border border-[#D4AF37]/30 font-semibold text-[#800020] dark:text-[#F3E5AB]"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            )}
            {person.notes && (
              <p className="text-[#5C5042] dark:text-[#C5BAA8] leading-relaxed pt-1">
                {person.notes}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
