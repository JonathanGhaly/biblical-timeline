import React from "react";
import { X, BookOpen, Clock, Heart, Sparkles, MapPin, Users, Calendar } from "lucide-react";
import type { Language, Person } from "../../types/genealogy";
import {
  UI_TRANSLATIONS,
  getPersonDisplayName,
  getPersonDisplayNotes,
  getEventDisplayTitle,
  getEventDisplayDescription,
  formatYearDisplay,
  localizeBiblicalReferences,
} from "../../utils/i18n";
import { CopticCross } from "../Coptic/CopticCross";
import { PrecisionIndicator } from "../Common/PrecisionIndicator";
import type { TimelineMarriageItem, TimelineSelectedItem } from "./timelineUtils";

interface TimelineDetailModalProps {
  item: TimelineSelectedItem | null;
  onClose: () => void;
  lang: Language;
  allPeople: Person[];
  onSetPersonYear?: (person: Person) => void;
}

export const TimelineDetailModal: React.FC<TimelineDetailModalProps> = ({
  item,
  onClose,
  lang,
  allPeople,
  onSetPersonYear,
}) => {
  if (!item) return null;

  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const getMarriageTitle = (marriage: TimelineMarriageItem): string => {
    return isRTL ? marriage.arabicTitle : marriage.title;
  };

  const getMarriageDescription = (marriage: TimelineMarriageItem): string => {
    return isRTL
      ? marriage.arabicDescription || marriage.description || ""
      : marriage.description || marriage.arabicDescription || "";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-6 rounded-2xl bg-[#FBF8EF] dark:bg-[#1C1A17] border-2 border-[#D4AF37] shadow-2xl text-[#2D2721] dark:text-[#E6E0D4] space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
          <div className="flex items-center gap-2">
            <CopticCross size={24} />
            <div>
              <h3 className="text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                {item.type === "person"
                  ? getPersonDisplayName(item.data, lang)
                  : item.type === "event"
                  ? getEventDisplayTitle(item.data, lang)
                  : getMarriageTitle(item.data)}
              </h3>
              {item.type === "person" && item.data.arabicName && lang === "en" && (
                <p className="text-xs text-[#6B5E4E] dark:text-[#A99F8D]">
                  {item.data.arabicName}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#D4AF37]/20 text-[#6B5E4E] dark:text-[#A99F8D] hover:text-[#800020] dark:hover:text-[#F3E5AB] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Person Content */}
        {item.type === "person" && (
          <div className="space-y-3.5 text-xs sm:text-sm">
            {/* Lifespan & Dates Badge */}
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-gradient-to-r from-[#D4AF37]/15 to-[#800020]/10 border border-[#D4AF37]/40 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[#800020] dark:text-[#F3E5AB] font-bold">
                  <Clock size={16} />
                  <span>
                    {formatYearDisplay(item.birthYear, lang)}
                    {item.isDeathUnknown || !item.data.yearsLived
                      ? ""
                      : ` — ${formatYearDisplay(item.deathYear, lang)}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#8C6F12] dark:text-[#D4AF37] font-semibold text-xs sm:text-sm">
                    {item.data.yearsLived
                      ? `${item.data.yearsLived} ${t.years}`
                      : isRTL
                      ? "العمر: غير معروف"
                      : "Unknown age"}
                  </span>
                  <PrecisionIndicator
                    precision={
                      item.data.birth?.precision ??
                      (item.isEstimatedBirth ? "approximate" : "calculated")
                    }
                    lang={lang}
                    size="sm"
                  />
                </div>
              </div>
              {item.isEstimatedBirth && (
                <p className="text-[11px] text-[#8C6F12] dark:text-[#D4AF37] font-sans font-medium">
                  {isRTL
                    ? "📍 تاريخ الميلاد غير مسجل؛ تم تقديره ووضعه زمنياً تحت والده."
                    : "📍 Birth year not explicitly recorded; placed chronologically under their father."}
                </p>
              )}

              {/* Action Button: Put / Set Person on Correct Year */}
              {onSetPersonYear && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSetPersonYear(item.data);
                      onClose();
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#800020] hover:bg-[#9B1238] text-[#F3E5AB] border border-[#D4AF37] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
                  >
                    <Calendar size={13} />
                    <span>
                      {isRTL
                        ? "تعديل وضبط سنة الشخص على الخط الزمني"
                        : "Set / Correct Year on Timeline"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Country / Place of Birth */}
            {(item.data.country || item.data.placeOfBirth) && (
              <div className="flex items-center gap-2 text-xs text-[#6B5E4E] dark:text-[#A99F8D] p-2 bg-white/50 dark:bg-[#121110] rounded-lg border border-[#D4AF37]/30">
                <MapPin size={14} className="text-[#800020] dark:text-[#D4AF37]" />
                <span className="font-semibold">
                  {[item.data.placeOfBirth, item.data.country].filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            {/* Relationships Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(item.data.fatherId || (item.data as any).anchorPersonId) && (
                <div className="p-2.5 rounded-lg bg-white/60 dark:bg-[#121110] border border-[#D4AF37]/30">
                  <span className="text-[#6B5E4E] dark:text-[#A99F8D] block text-[11px]">
                    {t.father}:
                  </span>
                  <span className="font-bold text-[#800020] dark:text-[#F3E5AB]">
                    {allPeople.find((p) => p.id === (item.data.fatherId || (item.data as any).anchorPersonId))
                      ? getPersonDisplayName(
                          allPeople.find((p) => p.id === (item.data.fatherId || (item.data as any).anchorPersonId))!,
                          lang
                        )
                      : item.data.fatherId}
                  </span>
                  {item.data.fatherAgeAtBirth !== undefined ? (
                    <span className="text-[10px] text-[#8C6F12] block">
                      ({t.anchorAgeLabel}: {item.data.fatherAgeAtBirth} {t.years})
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#8C6F12] dark:text-[#D4AF37] block">
                      ({isRTL ? "عمر الأب غير محدد — موضوع تحت الأب" : "Father's age unspecified — placed under father"})
                    </span>
                  )}
                </div>
              )}

              {(item.data.spouseIds?.length || item.data.wifeId || item.data.husbandId) && (
                <div className="p-2.5 rounded-lg bg-white/60 dark:bg-[#121110] border border-[#D4AF37]/30">
                  <span className="text-[#6B5E4E] dark:text-[#A99F8D] block text-[11px]">
                    {t.spouse}:
                  </span>
                  <span className="font-bold text-[#800020] dark:text-[#F3E5AB]">
                    {[
                      ...(item.data.spouseIds || []),
                      item.data.wifeId,
                      item.data.husbandId,
                    ]
                      .filter(Boolean)
                      .map((sid) => {
                        const spouse = allPeople.find((p) => p.id === sid);
                        return spouse ? getPersonDisplayName(spouse, lang) : sid;
                      })
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Notes */}
            {getPersonDisplayNotes(item.data, lang) && (
              <div className="bg-[#D4AF37]/10 p-3 rounded-xl border border-[#D4AF37]/20 leading-relaxed">
                <p className="font-semibold text-[#800020] dark:text-[#D4AF37] mb-1 text-xs">
                  {isRTL ? "الوصف والتأملات:" : "Historical & Theological Notes:"}
                </p>
                <p className="italic text-xs sm:text-sm">
                  {getPersonDisplayNotes(item.data, lang)}
                </p>
              </div>
            )}

            {/* Biblical References */}
            {item.data.biblicalReferences && item.data.biblicalReferences.length > 0 && (
              <div className="flex items-start gap-2 text-xs font-semibold text-[#800020] dark:text-[#D4AF37] pt-2 border-t border-[#D4AF37]/20">
                <BookOpen size={15} className="shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#6B5E4E] dark:text-[#A99F8D]">
                    {t.references}:
                  </span>
                  <span>
                    {localizeBiblicalReferences(item.data.biblicalReferences, lang).join(
                      isRTL ? "؛ " : "; "
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Marriage Content */}
        {item.type === "marriage" && (
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#800020]/10 border border-[#D4AF37]/40 font-mono">
              <Heart size={16} className="text-[#800020]" />
              <span className="font-bold text-[#800020] dark:text-[#F3E5AB]">
                {t.year}: {formatYearDisplay(item.data.year, lang)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {item.data.husbandAge !== undefined && (
                <div className="p-2.5 rounded-lg bg-white/60 dark:bg-[#121110] border border-[#D4AF37]/30">
                  <span className="text-[#6B5E4E] dark:text-[#A99F8D] block text-[11px]">
                    {isRTL ? "عمر الزوج:" : "Husband's Age"}:
                  </span>
                  <span className="font-bold text-[#800020] dark:text-[#F3E5AB]">
                    {item.data.husbandAge} {t.years}
                  </span>
                </div>
              )}
              {item.data.wifeAge !== undefined && (
                <div className="p-2.5 rounded-lg bg-white/60 dark:bg-[#121110] border border-[#D4AF37]/30">
                  <span className="text-[#6B5E4E] dark:text-[#A99F8D] block text-[11px]">
                    {isRTL ? "عمر الزوجة:" : "Wife's Age"}:
                  </span>
                  <span className="font-bold text-[#800020] dark:text-[#F3E5AB]">
                    {item.data.wifeAge} {t.years}
                  </span>
                </div>
              )}
            </div>

            {getMarriageDescription(item.data) && (
              <div className="bg-[#D4AF37]/10 p-3 rounded-xl border border-[#D4AF37]/20 leading-relaxed text-xs">
                <p className="font-semibold text-[#800020] dark:text-[#D4AF37] mb-1">
                  {isRTL ? "تفاصيل الارتباط المقدس:" : "Sacred Union Details:"}
                </p>
                <p className="italic">{getMarriageDescription(item.data)}</p>
              </div>
            )}

            {item.data.references && item.data.references.length > 0 && (
              <div className="flex items-start gap-2 text-xs font-semibold text-[#800020] dark:text-[#D4AF37] pt-2 border-t border-[#D4AF37]/20">
                <BookOpen size={15} className="shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#6B5E4E] dark:text-[#A99F8D]">
                    {t.references}:
                  </span>
                  <span>{item.data.references.join("; ")}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Event Content */}
        {item.type === "event" && (
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-gradient-to-r from-[#1A365D]/20 to-[#800020]/10 border border-[#1A365D]/40 font-mono">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#D4AF37]" />
                <span className="font-bold text-[#1A365D] dark:text-[#90CDF4]">
                  {t.year}: {formatYearDisplay(item.year ?? item.data.date?.year, lang)}
                </span>
              </div>
              {item.data.anchorPersonId && (
                <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#1A365D]/20 text-[#1A365D] dark:text-[#90CDF4] border border-[#1A365D]/40">
                  {isRTL ? "مرتبط بعمر" : "Relative to figure"}:{" "}
                  <strong>
                    {(() => {
                      const ap = allPeople.find((p) => p.id === item.data.anchorPersonId);
                      return ap ? getPersonDisplayName(ap, lang) : item.data.anchorPersonId;
                    })()}
                  </strong>{" "}
                  ({item.data.anchorAge ?? item.data.anchorPersonAgeAtEvent} {t.years})
                </span>
              )}
            </div>

            {(item.data.locations?.length || item.data.location || item.data.country || item.data.countries?.length) && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B5E4E] dark:text-[#A99F8D] p-2 bg-white/50 dark:bg-[#121110] rounded-lg border border-[#D4AF37]/30">
                <MapPin size={14} className="text-[#800020] dark:text-[#D4AF37]" />
                <span className="font-semibold">
                  {[
                    ...(item.data.locations || []),
                    ...(item.data.location && !item.data.locations?.includes(item.data.location) ? [item.data.location] : []),
                    ...(item.data.countries || []),
                    ...(item.data.country && !item.data.countries?.includes(item.data.country) ? [item.data.country] : []),
                  ].join(", ")}
                </span>
              </div>
            )}

            {getEventDisplayDescription(item.data, lang) && (
              <div className="bg-[#D4AF37]/10 p-3 rounded-xl border border-[#D4AF37]/20 leading-relaxed text-xs">
                <p className="font-semibold text-[#800020] dark:text-[#D4AF37] mb-1">
                  {isRTL ? "تفاصيل الحدث التاريخي:" : "Historical Narrative:"}
                </p>
                <p className="italic">{getEventDisplayDescription(item.data, lang)}</p>
              </div>
            )}

            {item.data.personIds && item.data.personIds.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-[#1A365D] dark:text-[#90CDF4] font-semibold">
                  <Users size={14} />
                  <span>{isRTL ? "الشخصيات المرتبطة بالحدث:" : "People connected to event:"}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.data.personIds.map((id) => {
                    const person = allPeople.find((p) => p.id === id);
                    if (!person) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-[#121110] border border-[#D4AF37]/40 text-xs font-medium"
                      >
                        <span>{getPersonDisplayName(person, lang)}</span>
                        {onSetPersonYear && (
                          <button
                            type="button"
                            onClick={() => {
                              onSetPersonYear(person);
                              onClose();
                            }}
                            className="p-0.5 rounded hover:bg-[#800020]/20 text-[#800020] dark:text-[#D4AF37] ms-1"
                            title={isRTL ? "ضبط سنة هذا الشخص" : "Set this person's year"}
                          >
                            <Calendar size={12} />
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {item.data.biblicalReferences && item.data.biblicalReferences.length > 0 && (
              <div className="flex items-start gap-2 text-xs font-semibold text-[#800020] dark:text-[#D4AF37] pt-2 border-t border-[#D4AF37]/20">
                <BookOpen size={15} className="shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#6B5E4E] dark:text-[#A99F8D]">
                    {t.references}:
                  </span>
                  <span>
                    {localizeBiblicalReferences(item.data.biblicalReferences, lang).join(
                      isRTL ? "؛ " : "; "
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
