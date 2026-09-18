import React, { useState } from "react";
import {
  X,
  Scroll,
  BookOpen,
  MapPin,
  Users,
  Copy,
  Check,
  Edit3,
  Trash2,
  Sparkles,
} from "lucide-react";
import type { BiblicalLaw, Person, Language } from "../../types/genealogy";
import { UI_TRANSLATIONS, getPersonDisplayName } from "../../utils/i18n";
import { CopticCross } from "../Coptic/CopticCross";

interface LawDetailsModalProps {
  law: BiblicalLaw | null;
  onClose: () => void;
  onEdit: (law: BiblicalLaw) => void;
  onDelete: (lawId: string) => void;
  people: Person[];
  lang: Language;
}

export const LawDetailsModal: React.FC<LawDetailsModalProps> = ({
  law,
  onClose,
  onEdit,
  onDelete,
  people,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!law) return null;

  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const displayTitle =
    lang === "ar" && law.arabicTitle ? law.arabicTitle : law.title;
  const subtitle =
    lang === "ar" && law.arabicTitle ? law.title : law.arabicTitle;

  const displayRecipient =
    lang === "ar" && law.arabicSpokenTo ? law.arabicSpokenTo : law.spokenTo;
  const displayContext =
    lang === "ar" && law.arabicSpokenBy ? law.arabicSpokenBy : law.spokenBy;
  const displayLocation =
    lang === "ar" && law.arabicLocation ? law.arabicLocation : law.location;

  const scriptureText =
    lang === "ar"
      ? law.commandmentTextAr || law.commandmentTextEn
      : law.commandmentTextEn || law.commandmentTextAr;

  const alternativeScriptureText =
    lang === "ar"
      ? law.commandmentTextAr && law.commandmentTextEn ? law.commandmentTextEn : null
      : law.commandmentTextEn && law.commandmentTextAr ? law.commandmentTextAr : null;

  const summary =
    lang === "ar" && law.summaryAr ? law.summaryAr : law.summaryEn;

  const handleCopy = () => {
    const textToCopy = `${displayTitle} (${law.scriptureReference})\n\n"${scriptureText}"\n\n${t.spokenTo}: ${displayRecipient}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "moral":
        return "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/60";
      case "covenant":
        return "bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700/60";
      case "civil_judicial":
        return "bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700/60";
      case "ceremonial_worship":
        return "bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700/60";
      case "festivals_sabbath":
        return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/60";
      case "holiness_ethics":
        return "bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700/60";
      default:
        return "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-200 border-stone-300 dark:border-stone-700";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "moral":
        return t.catMoral;
      case "covenant":
        return t.catCovenant;
      case "civil_judicial":
        return t.catCivil;
      case "ceremonial_worship":
        return t.catCeremonial;
      case "festivals_sabbath":
        return t.catSabbath;
      case "holiness_ethics":
        return t.catHoliness;
      default:
        return t.catOther;
    }
  };

  const associatedPeopleList = (law.linkedPersonIds || [])
    .map((id) => people.find((p) => p.id === id))
    .filter(Boolean) as Person[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      dir={isRTL ? "rtl" : "ltr"}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF6EE] dark:bg-[#1A1815] border-2 border-[#D4AF37] rounded-2xl shadow-2xl my-8 overflow-hidden text-[#2D2721] dark:text-[#E6E0D4] font-body"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Parchment top header with Coptic motif */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#800020] via-[#940026] to-[#800020] text-[#F3E5AB] border-b border-[#D4AF37]/50 shadow-md">
          <div className="flex items-center gap-3">
            <CopticCross size={26} className="text-[#D4AF37] shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${getCategoryColor(
                    law.category
                  )}`}
                >
                  {getCategoryLabel(law.category)}
                </span>
                {law.biblicalYearBC && (
                  <span className="text-xs font-mono font-bold text-[#F3E5AB]/90 bg-black/20 px-2 py-0.5 rounded-full">
                    ~{law.biblicalYearBC} {t.bc}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-cinzel tracking-wide mt-1">
                {displayTitle}
              </h2>
              {subtitle && (
                <p className="text-xs text-[#F3E5AB]/75 font-serif italic">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#F3E5AB]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={t.close}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key metadata banner: Spoken To & Scripture reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#F3EDE0]/80 dark:bg-[#201D19] rounded-xl border border-[#D4AF37]/40 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-[#800020]/10 dark:bg-[#800020]/30 text-[#800020] dark:text-[#F3E5AB] shrink-0">
                <Users size={16} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6F12] dark:text-[#D4AF37] block">
                  {t.spokenTo}
                </span>
                <span className="font-bold text-sm text-[#2D2721] dark:text-[#F3E5AB]">
                  {displayRecipient}
                </span>
                {displayContext && (
                  <p className="text-[11px] text-[#7A6E5E] dark:text-[#A99F8D] mt-0.5">
                    {displayContext}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-[#800020]/10 dark:bg-[#800020]/30 text-[#800020] dark:text-[#F3E5AB] shrink-0">
                <BookOpen size={16} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6F12] dark:text-[#D4AF37] block">
                  {t.scriptureReference}
                </span>
                <span className="font-bold text-sm text-[#800020] dark:text-[#F3E5AB]">
                  {law.scriptureReference}
                </span>
                {displayLocation && (
                  <p className="text-[11px] text-[#7A6E5E] dark:text-[#A99F8D] mt-0.5 flex items-center gap-1">
                    <MapPin size={11} /> {displayLocation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Illuminated Scripture Words Box */}
          <div className="relative p-5 sm:p-6 bg-white/80 dark:bg-[#121110] rounded-2xl border-2 border-[#D4AF37]/60 shadow-inner">
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#D4AF37]/30">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37]">
                <Sparkles size={14} />
                <span>{t.divineProclamation}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF6EE] dark:bg-[#1E1C18] border border-[#D4AF37]/40 hover:border-[#800020] text-[#5A4D3E] dark:text-[#C5BBAE] hover:text-[#800020] transition-colors cursor-pointer"
                title={t.copyScripture}
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-600" />
                    <span className="text-emerald-600">{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>{t.copyScripture}</span>
                  </>
                )}
              </button>
            </div>

            {/* Primary Scripture Text */}
            <div
              className={`text-base sm:text-lg leading-relaxed whitespace-pre-line text-[#2D2721] dark:text-[#E8E1D3] font-serif ${
                lang === "ar" ? "text-right leading-loose font-amiri" : "font-serif"
              }`}
            >
              {scriptureText}
            </div>

            {/* Optional Alternative Language Secondary Text */}
            {alternativeScriptureText && (
              <div className="mt-4 pt-4 border-t border-[#D4AF37]/20">
                <span className="text-[10px] uppercase tracking-wider text-[#8C6F12] dark:text-[#A99F8D] font-bold block mb-1">
                  {lang === "ar" ? "النص بالإنجليزية:" : "Arabic Scripture Text:"}
                </span>
                <p
                  className={`text-sm text-[#5A4D3E] dark:text-[#BDB19F] whitespace-pre-line font-serif leading-relaxed ${
                    lang === "ar" ? "text-left font-serif" : "text-right font-amiri"
                  }`}
                >
                  {alternativeScriptureText}
                </p>
              </div>
            )}
          </div>

          {/* Spiritual Summary & Theological Context */}
          {summary && (
            <div className="space-y-1.5 p-4 rounded-xl bg-[#F3EDE0]/50 dark:bg-[#1E1C18] border border-[#D4AF37]/30">
              <span className="text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37] flex items-center gap-1.5">
                <Scroll size={13} />
                {t.summaryLabel}
              </span>
              <p className="text-xs sm:text-sm text-[#4A3E31] dark:text-[#C5BBAE] leading-relaxed">
                {summary}
              </p>
            </div>
          )}

          {/* Key Principles & Pillars */}
          {law.keyPrinciples && law.keyPrinciples.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6F12] dark:text-[#D4AF37] block">
                {t.keyPrinciples}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {law.keyPrinciples.map((principle, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-50 dark:bg-amber-950/30 text-[#6B5E4E] dark:text-[#D4AF37] border border-[#D4AF37]/30"
                  >
                    ✦ {principle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Associated Biblical Figures */}
          {associatedPeopleList.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6F12] dark:text-[#D4AF37] block">
                {t.linkedPeople}:
              </span>
              <div className="flex flex-wrap gap-2">
                {associatedPeopleList.map((person) => (
                  <div
                    key={person.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/80 dark:bg-[#161412] border border-[#D4AF37]/50 text-[#800020] dark:text-[#F3E5AB] shadow-sm"
                  >
                    <Users size={12} />
                    <span>{getPersonDisplayName(person, lang)}</span>
                    {person.yearsLived && (
                      <span className="text-[10px] font-normal text-[#7A6E5E] dark:text-[#9A8E7E]">
                        ({person.yearsLived} {t.years})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delete Confirmation Warning */}
          {isConfirmingDelete && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500/50 text-rose-900 dark:text-rose-200 text-xs space-y-2">
              <p className="font-bold">{t.confirmDeleteLaw}</p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(law.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow transition cursor-pointer"
                >
                  {t.delete}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 text-[#2D2721] dark:text-[#E6E0D4] rounded-lg font-semibold hover:bg-stone-300 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#F3EDE0] dark:bg-[#151311] border-t border-[#D4AF37]/40">
          <div className="flex items-center gap-2">
            {!isConfirmingDelete && (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition cursor-pointer"
              >
                <Trash2 size={13} />
                <span>{t.delete}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(law);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-[#FAF6EE] dark:bg-[#1E1C18] border border-[#D4AF37] text-[#800020] dark:text-[#F3E5AB] hover:bg-[#800020] hover:text-white dark:hover:bg-[#800020] transition shadow-sm cursor-pointer"
            >
              <Edit3 size={14} />
              <span>{t.editLaw}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-[#2D2721] dark:text-[#E6E0D4] transition cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
