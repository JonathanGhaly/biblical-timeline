import React, { useState } from "react";
import {
  X,
  Scroll,
  BookOpen,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  AlertCircle,
  Check,
} from "lucide-react";
import type { BiblicalLaw, LawCategory, Person, Language } from "../../types/genealogy";
import { UI_TRANSLATIONS, getPersonDisplayName } from "../../utils/i18n";
import { CopticCross } from "../Coptic/CopticCross";

interface AddLawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (law: BiblicalLaw) => void;
  initialLaw?: BiblicalLaw | null;
  people: Person[];
  lang: Language;
}

const CATEGORIES: { id: LawCategory; labelEn: string; labelAr: string; color: string }[] = [
  {
    id: "moral",
    labelEn: "Moral & Ten Commandments",
    labelAr: "الوصايا العشر والأخلاق",
    color: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-700/50",
  },
  {
    id: "covenant",
    labelEn: "Covenants & Pledges",
    labelAr: "العهود والمواثيق الإلهية",
    color: "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/50 dark:text-purple-200 dark:border-purple-700/50",
  },
  {
    id: "civil_judicial",
    labelEn: "Civil & Judicial",
    labelAr: "الأحكام المدنية والقضائية",
    color: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-700/50",
  },
  {
    id: "ceremonial_worship",
    labelEn: "Ceremonial & Worship",
    labelAr: "الطقوس والعبادة والكهنوت",
    color: "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-700/50",
  },
  {
    id: "festivals_sabbath",
    labelEn: "Sabbaths & Holy Feasts",
    labelAr: "السبوت والأعياد المقدسة",
    color: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-700/50",
  },
  {
    id: "holiness_ethics",
    labelEn: "Holiness & Ethical Code",
    labelAr: "القداسة والسلوك الفاضل",
    color: "bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/50 dark:text-teal-200 dark:border-teal-700/50",
  },
  {
    id: "other",
    labelEn: "Other Decrees",
    labelAr: "أوامر ونواهٍ أخرى",
    color: "bg-stone-100 text-stone-900 border-stone-300 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-600",
  },
];

const COMMON_RECIPIENTS: { en: string; ar: string }[] = [
  { en: "Moses and the Children of Israel", ar: "موسى وبنو إسرائيل" },
  { en: "Moses", ar: "موسى النبي" },
  { en: "Aaron and the Priests", ar: "هارون وبنوه الكهنة" },
  { en: "Noah and his sons", ar: "نوح وبنوه" },
  { en: "Abraham", ar: "إبراهيم الخليل" },
  { en: "Adam", ar: "آدم" },
  { en: "All Humanity", ar: "البشرية جمعاء" },
];

export const AddLawModal: React.FC<AddLawModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLaw,
  people,
  lang,
}) => {
  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const emptyForm: Partial<BiblicalLaw> = {
    title: "",
    arabicTitle: "",
    spokenTo: "",
    arabicSpokenTo: "",
    spokenBy: "",
    arabicSpokenBy: "",
    category: "moral",
    scriptureReference: "",
    arabicScriptureReference: "",
    commandmentTextEn: "",
    commandmentTextAr: "",
    summaryEn: "",
    summaryAr: "",
    biblicalYearBC: undefined,
    location: "",
    arabicLocation: "",
    keyPrinciples: [],
    linkedPersonIds: [],
  };

  const [formData, setFormData] = useState<Partial<BiblicalLaw>>(
    initialLaw ? { ...initialLaw } : emptyForm
  );
  const [principlesInput, setPrinciplesInput] = useState(
    initialLaw ? (initialLaw.keyPrinciples || []).join(", ") : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prevLawId, setPrevLawId] = useState(initialLaw?.id);

  if (initialLaw?.id !== prevLawId) {
    setPrevLawId(initialLaw?.id);
    setFormData(initialLaw ? { ...initialLaw } : emptyForm);
    setPrinciplesInput(initialLaw ? (initialLaw.keyPrinciples || []).join(", ") : "");
    setErrors({});
  }

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim() && !formData.arabicTitle?.trim()) {
      newErrors.title = lang === "ar" ? "يرجى كتابة عنوان الشريعة" : "Please provide a law title";
    }
    if (!formData.spokenTo?.trim() && !formData.arabicSpokenTo?.trim()) {
      newErrors.spokenTo = lang === "ar" ? "يرجى تحديد المُخاطَب بالشريعة" : "Please specify who God spoke this to";
    }
    if (!formData.scriptureReference?.trim() && !formData.arabicScriptureReference?.trim()) {
      newErrors.scriptureReference = lang === "ar" ? "يرجى إدخال الشاهد الكتابي" : "Please enter the scripture reference";
    }
    if (!formData.commandmentTextEn?.trim() && !formData.commandmentTextAr?.trim()) {
      newErrors.commandmentText =
        lang === "ar" ? "يرجى إدخال نص كلام الله المقدس" : "Please enter God's spoken words or scripture text";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedPrinciples = principlesInput
      .split(/[,،]/)
      .map((p) => p.trim())
      .filter(Boolean);

    const lawToSave: BiblicalLaw = {
      id: initialLaw?.id || `law-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: formData.title?.trim() || formData.arabicTitle?.trim() || "Untitled Law",
      arabicTitle: formData.arabicTitle?.trim() || undefined,
      spokenTo: formData.spokenTo?.trim() || formData.arabicSpokenTo?.trim() || "Israel",
      arabicSpokenTo: formData.arabicSpokenTo?.trim() || undefined,
      spokenBy: formData.spokenBy?.trim() || undefined,
      arabicSpokenBy: formData.arabicSpokenBy?.trim() || undefined,
      category: (formData.category as LawCategory) || "moral",
      scriptureReference: formData.scriptureReference?.trim() || formData.arabicScriptureReference?.trim() || "",
      arabicScriptureReference: formData.arabicScriptureReference?.trim() || undefined,
      commandmentTextEn: formData.commandmentTextEn?.trim() || formData.commandmentTextAr?.trim() || "",
      commandmentTextAr: formData.commandmentTextAr?.trim() || undefined,
      summaryEn: formData.summaryEn?.trim() || undefined,
      summaryAr: formData.summaryAr?.trim() || undefined,
      biblicalYearBC: formData.biblicalYearBC ? Number(formData.biblicalYearBC) : undefined,
      location: formData.location?.trim() || undefined,
      arabicLocation: formData.arabicLocation?.trim() || undefined,
      keyPrinciples: parsedPrinciples.length > 0 ? parsedPrinciples : undefined,
      linkedPersonIds: formData.linkedPersonIds && formData.linkedPersonIds.length > 0 ? formData.linkedPersonIds : undefined,
    };

    onSave(lawToSave);
    onClose();
  };

  const handleTogglePerson = (personId: string) => {
    const current = formData.linkedPersonIds || [];
    if (current.includes(personId)) {
      setFormData({
        ...formData,
        linkedPersonIds: current.filter((id) => id !== personId),
      });
    } else {
      setFormData({
        ...formData,
        linkedPersonIds: [...current, personId],
      });
    }
  };

  const handleSelectQuickRecipient = (r: { en: string; ar: string }) => {
    setFormData((prev) => ({
      ...prev,
      spokenTo: r.en,
      arabicSpokenTo: r.ar,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF6EE] dark:bg-[#1A1815] border-2 border-[#D4AF37] rounded-2xl shadow-2xl my-8 overflow-hidden text-[#2D2721] dark:text-[#E6E0D4] font-body"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Coptic cross banner */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#800020] via-[#940026] to-[#800020] text-[#F3E5AB] border-b border-[#D4AF37]/50 shadow-sm">
          <div className="flex items-center gap-3">
            <CopticCross size={24} className="text-[#D4AF37]" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-cinzel tracking-wide">
                {initialLaw ? t.editLaw : t.addLaw}
              </h2>
              <p className="text-xs text-[#F3E5AB]/80">
                {lang === "ar"
                  ? "تسجيل شريعة أو وصية إلهية نطق بها الرب إلى الناس"
                  : "Record a divine law or commandment spoken by God to people"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#F3E5AB]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={t.close}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section: Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-1">
                {t.lawTitleEn} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. The Ten Commandments, Sabbath Law..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
              {errors.title && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-1">
                {t.lawTitleAr}
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.arabicTitle || ""}
                onChange={(e) => setFormData({ ...formData, arabicTitle: e.target.value })}
                placeholder="مثال: الوصايا العشر، شريعة السبت..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>
          </div>

          {/* Section: Spoken To & Quick Presets */}
          <div className="bg-[#F3EDE0]/70 dark:bg-[#201D19] p-3.5 rounded-xl border border-[#D4AF37]/30 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-xs font-bold text-[#800020] dark:text-[#D4AF37] flex items-center gap-1.5">
                <Users size={14} />
                {t.spokenTo} <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] text-[#7A6E5E] dark:text-[#A99F8D]">
                {lang === "ar" ? "اقتراحات سريعة للمُخاطَبين:" : "Quick recipients:"}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_RECIPIENTS.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectQuickRecipient(r)}
                  className="px-2 py-0.5 text-xs rounded-full bg-white/80 dark:bg-[#151311] border border-[#D4AF37]/40 hover:border-[#800020] text-[#5A4D3E] dark:text-[#C5BBAE] hover:text-[#800020] transition-colors"
                >
                  {lang === "ar" ? r.ar : r.en}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-[#5A4D3E] dark:text-[#BDB19F] mb-1">
                  {lang === "ar" ? "المُخاطَب (باللغة الإنجليزية)" : "Recipient in English"}
                </label>
                <input
                  type="text"
                  value={formData.spokenTo || ""}
                  onChange={(e) => setFormData({ ...formData, spokenTo: e.target.value })}
                  placeholder={t.spokenToPlaceholder}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-[#D4AF37]/40 bg-white/80 dark:bg-[#121110] focus:ring-1 focus:ring-[#800020] focus:outline-none"
                />
                {errors.spokenTo && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.spokenTo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A4D3E] dark:text-[#BDB19F] mb-1">
                  {lang === "ar" ? "المُخاطَب (باللغة العربية)" : "Recipient in Arabic"}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.arabicSpokenTo || ""}
                  onChange={(e) => setFormData({ ...formData, arabicSpokenTo: e.target.value })}
                  placeholder="مثال: موسى وبنو إسرائيل، نوح، آدم..."
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-[#D4AF37]/40 bg-white/80 dark:bg-[#121110] focus:ring-1 focus:ring-[#800020] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Category & Scripture Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-1">
                {t.lawCategory}
              </label>
              <select
                value={formData.category || "moral"}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as LawCategory })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] focus:ring-2 focus:ring-[#800020] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {lang === "ar" ? cat.labelAr : cat.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-1 flex items-center gap-1.5">
                <BookOpen size={14} />
                {t.scriptureReference} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.scriptureReference || ""}
                onChange={(e) => setFormData({ ...formData, scriptureReference: e.target.value })}
                placeholder={t.scripturePlaceholder}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
              {errors.scriptureReference && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.scriptureReference}
                </p>
              )}
            </div>
          </div>

          {/* Section: God's Direct Spoken Words (The Heart of the Law) */}
          <div className="border border-[#D4AF37]/60 rounded-xl p-4 bg-amber-50/40 dark:bg-[#171512] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#800020] dark:text-[#D4AF37]">
              <Sparkles size={16} />
              <span>{t.divineProclamation}</span>
              <span className="text-xs font-normal text-[#7A6E5E] dark:text-[#9A8E7E]">
                ({lang === "ar" ? "الكلمات الإلهية الصريحة المنطوقة من فم الله" : "Direct scripture words spoken by the Lord"})
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#635546] dark:text-[#C5BBAE] mb-1">
                {t.commandmentTextEn}
              </label>
              <textarea
                rows={3}
                value={formData.commandmentTextEn || ""}
                onChange={(e) => setFormData({ ...formData, commandmentTextEn: e.target.value })}
                placeholder={t.commandmentTextPlaceholder}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/50 bg-white/80 dark:bg-[#100F0D] focus:ring-2 focus:ring-[#800020] focus:outline-none font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#635546] dark:text-[#C5BBAE] mb-1">
                {t.commandmentTextAr}
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={formData.commandmentTextAr || ""}
                onChange={(e) => setFormData({ ...formData, commandmentTextAr: e.target.value })}
                placeholder="اكتب الآيات والكلمات الصريحة التي نطق بها الرب إلى شعبه أو أنبيائه..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/50 bg-white/80 dark:bg-[#100F0D] focus:ring-2 focus:ring-[#800020] focus:outline-none font-serif leading-relaxed"
              />
            </div>

            {errors.commandmentText && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.commandmentText}
              </p>
            )}
          </div>

          {/* Section: Spoken By / Divine Setting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-1">
                {t.spokenBy}
              </label>
              <input
                type="text"
                value={formData.spokenBy || ""}
                onChange={(e) => setFormData({ ...formData, spokenBy: e.target.value })}
                placeholder={t.spokenByPlaceholder}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-1">
                {t.spokenByAr}
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.arabicSpokenBy || ""}
                onChange={(e) => setFormData({ ...formData, arabicSpokenBy: e.target.value })}
                placeholder="مثال: الله من وسط النار على جبل سيناء..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>
          </div>

          {/* Section: Spiritual Meaning / Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-1">
                {t.summaryEn}
              </label>
              <textarea
                rows={2}
                value={formData.summaryEn || ""}
                onChange={(e) => setFormData({ ...formData, summaryEn: e.target.value })}
                placeholder="Theological purpose, ethical significance, or historical impact..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-1">
                {t.summaryAr}
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={formData.summaryAr || ""}
                onChange={(e) => setFormData({ ...formData, summaryAr: e.target.value })}
                placeholder="المغزى الروحي واللاهوتي للشريعة أو أثرها على الشعب..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>
          </div>

          {/* Section: Year BC, Location, Key Principles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-1 flex items-center gap-1">
                <Calendar size={13} />
                {t.lawYearBC}
              </label>
              <input
                type="number"
                value={formData.biblicalYearBC ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    biblicalYearBC: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  })
                }
                placeholder="e.g. 1446"
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-1 flex items-center gap-1">
                <MapPin size={13} />
                {t.lawLocation}
              </label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Mount Sinai, Eden, Moab..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-1">
                {t.keyPrinciples}
              </label>
              <input
                type="text"
                value={principlesInput}
                onChange={(e) => setPrinciplesInput(e.target.value)}
                placeholder={t.keyPrinciplesPlaceholder}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-[#121110] focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>
          </div>

          {/* Section: Associated Biblical Figures */}
          {people.length > 0 && (
            <div className="border-t border-[#D4AF37]/30 pt-3">
              <label className="block text-xs font-bold text-[#800020] dark:text-[#D4AF37] mb-2 flex items-center gap-1.5">
                <Users size={14} />
                {t.linkedPeople} ({lang === "ar" ? "اضغط لربط الشخصية" : "Click to associate figure"}):
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-white/40 dark:bg-[#121110] rounded-xl border border-[#D4AF37]/30">
                {people.map((person) => {
                  const isSelected = (formData.linkedPersonIds || []).includes(person.id);
                  return (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => handleTogglePerson(person.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer border ${
                        isSelected
                          ? "bg-[#800020] text-[#F3E5AB] border-[#800020] shadow-sm font-bold"
                          : "bg-white/70 dark:bg-[#1A1815] border-[#D4AF37]/40 text-[#4A3E31] dark:text-[#C5BBAE] hover:border-[#D4AF37]"
                      }`}
                    >
                      {isSelected && <Check size={11} />}
                      <span>{getPersonDisplayName(person, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4AF37]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#5A4D3E] dark:text-[#C5BBAE] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#800020] to-[#9E0028] text-[#F3E5AB] hover:opacity-95 shadow-md transition-all cursor-pointer"
            >
              <Scroll size={16} />
              <span>{initialLaw ? t.save : t.addLaw}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
