import { useState } from "react";
import type { BiblicalEvent, DateInfo, Person, Language } from "../../types/genealogy";
import { CopticCross } from "../Coptic/CopticCross";
import { UI_TRANSLATIONS } from "../../utils/i18n";
import { X, MapPin, BookOpen } from "lucide-react";

type AddEventModalProps = {
  existingPeople: Person[];
  onAddEvent: (newEvent: BiblicalEvent) => void;
  onClose: () => void;
  lang?: Language;
};

const OT_LOCATIONS = [
  "Asshur",
  "Babylon",
  "Beersheba",
  "Calah (Nimrud)",
  "Carchemish",
  "Damascus",
  "Dan",
  "Dedan",
  "Ecbatana",
  "Erech (Uruk)",
  "Ezion-Geber",
  "Gaza",
  "Haran",
  "Hebron",
  "Jericho",
  "Jerusalem",
  "Joppa",
  "Kir-hareseth (Moab)",
  "Memphis (Noph)",
  "Mt. Sinai (Horeb)",
  "Nineveh",
  "Persepolis",
  "Rabbah (Ammon)",
  "Rameses (Goshen)",
  "Samaria",
  "Shechem",
  "Sidon",
  "Susa (Shushan)",
  "Tema",
  "Thebes (No-Amon)",
  "Tyre",
  "Ur of the Chaldees",
];

export default function AddEventModal({
  existingPeople = [],
  onAddEvent,
  onClose,
  lang = "en",
}: AddEventModalProps) {
  const [dateType, setDateType] = useState<"direct" | "anchor">("direct");
  const [formData, setFormData] = useState({
    title: "",
    arabicTitle: "",
    year: "",
    era: "BC",
    anchorPersonId: "",
    anchorAge: "",
    location: "",
    description: "",
    arabicDescription: "",
    biblicalReferences: "",
  });

  const t = UI_TRANSLATIONS[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let computedDate: DateInfo | undefined = undefined;

    if (dateType === "direct" && formData.year) {
      const numericYear = Number(formData.year);
      const signedYear =
        formData.era === "BC" ? -Math.abs(numericYear) : Math.abs(numericYear);
      computedDate = { year: signedYear, precision: "exact" };
    }

    const newEvent: BiblicalEvent = {
      id: formData.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      title: formData.title,
      arabicTitle: formData.arabicTitle || undefined,
      date: computedDate,
      anchorPersonId:
        dateType === "anchor" ? formData.anchorPersonId || undefined : undefined,
      anchorAge:
        dateType === "anchor" && formData.anchorAge
          ? Number(formData.anchorAge)
          : undefined,
      location: formData.location || undefined,
      description: formData.description || undefined,
      arabicDescription: formData.arabicDescription || undefined,
      biblicalReferences: formData.biblicalReferences
        ? formData.biblicalReferences.split(",").map((r) => r.trim()).filter(Boolean)
        : [],
    };

    onAddEvent(newEvent);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-[#FBF8EF] dark:bg-[#1C1A17] text-[#2D2721] dark:text-[#E6E0D4] border-2 border-[#D4AF37] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#D4AF37]/40 bg-gradient-to-r from-[#800020]/15 via-[#D4AF37]/15 to-[#1A365D]/10">
          <div className="flex items-center gap-3">
            <CopticCross size={28} />
            <h3 className="text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
              {t.addEvent}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B5E4E] dark:text-[#A99F8D] hover:bg-[#D4AF37]/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.eventTitleEn} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Call of Abraham"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.eventTitleAr}
              </label>
              <input
                type="text"
                placeholder="مثال: دعوة إبراهيم"
                value={formData.arabicTitle}
                onChange={(e) => setFormData({ ...formData, arabicTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-amiri"
              />
            </div>
          </div>

          {/* Date Type Selector */}
          <div className="space-y-2 p-3.5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5">
            <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
              {lang === "ar" ? "طريقة تحديد التاريخ" : "Chronology Method"}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="dateType"
                  value="direct"
                  checked={dateType === "direct"}
                  onChange={() => setDateType("direct")}
                  className="accent-[#800020]"
                />
                <span>{lang === "ar" ? "تاريخ مباشر (سنة ق.م / م)" : "Direct Year (BC / AD)"}</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="dateType"
                  value="anchor"
                  checked={dateType === "anchor"}
                  onChange={() => setDateType("anchor")}
                  className="accent-[#800020]"
                />
                <span>{lang === "ar" ? "مرتبط بعمر شخصية مرجعية" : "Relative to Biblical Figure"}</span>
              </label>
            </div>

            {dateType === "direct" ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs text-[#6B5E4E] dark:text-[#A99F8D]">{t.year}</label>
                  <input
                    type="number"
                    placeholder="e.g. 2000"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B5E4E] dark:text-[#A99F8D]">{t.era}</label>
                  <select
                    value={formData.era}
                    onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm"
                  >
                    <option value="BC">{t.bc}</option>
                    <option value="AD">{t.ad}</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs text-[#6B5E4E] dark:text-[#A99F8D]">{t.anchorPerson}</label>
                  <select
                    value={formData.anchorPersonId}
                    onChange={(e) => setFormData({ ...formData, anchorPersonId: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm"
                  >
                    <option value="">-- {lang === "ar" ? "اختر الشخصية" : "Select Figure"} --</option>
                    {existingPeople.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.arabicName ? `(${p.arabicName})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#6B5E4E] dark:text-[#A99F8D]">{t.anchorAgeLabel}</label>
                  <input
                    type="number"
                    value={formData.anchorAge}
                    onChange={(e) => setFormData({ ...formData, anchorAge: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location & References */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                <MapPin size={14} />
                {t.location}
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">-- {lang === "ar" ? "اختر الموقع الجغرافي" : "Select Location"} --</option>
                {OT_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                <BookOpen size={14} />
                {t.references}
              </label>
              <input
                type="text"
                placeholder="e.g. Genesis 12:1-4"
                value={formData.biblicalReferences}
                onChange={(e) => setFormData({ ...formData, biblicalReferences: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Bilingual Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.eventDescEn}
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.eventDescAr}
              </label>
              <textarea
                rows={2}
                value={formData.arabicDescription}
                onChange={(e) => setFormData({ ...formData, arabicDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-amiri"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4AF37]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#D4AF37]/50 text-sm font-semibold hover:bg-[#D4AF37]/15 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#A01128] text-white font-bold text-sm shadow-md hover:brightness-110 transition-all"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
