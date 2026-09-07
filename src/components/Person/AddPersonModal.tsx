import { useState } from "react";
import type { Person, Language } from "../../types/genealogy";
import { CopticCross } from "../Coptic/CopticCross";
import { UI_TRANSLATIONS, BIBLICAL_NAMES_ARABIC } from "../../utils/i18n";
import { X, User, BookOpen, MapPin, Calendar, Heart } from "lucide-react";

type CityRegion =
  | "Egypt & Sinai"
  | "Canaan & Levant"
  | "Mesopotamia & Assyria"
  | "Babylonia"
  | "Arabia"
  | "Persia & Media";

type CityOption = {
  id: string;
  name: string;
  region: CityRegion;
};

const OT_CITIES: CityOption[] = [
  { id: "thebes", name: "Thebes (No-Amon)", region: "Egypt & Sinai" },
  { id: "memphis", name: "Memphis (Noph)", region: "Egypt & Sinai" },
  { id: "rameses", name: "Rameses (Goshen)", region: "Egypt & Sinai" },
  { id: "sinai", name: "Mt. Sinai (Horeb)", region: "Egypt & Sinai" },
  { id: "eziongeber", name: "Ezion-Geber", region: "Egypt & Sinai" },
  { id: "gaza", name: "Gaza", region: "Canaan & Levant" },
  { id: "beersheba", name: "Beersheba", region: "Canaan & Levant" },
  { id: "kirhareseth", name: "Kir-hareseth (Moab)", region: "Canaan & Levant" },
  { id: "hebron", name: "Hebron", region: "Canaan & Levant" },
  { id: "jerusalem", name: "Jerusalem", region: "Canaan & Levant" },
  { id: "jericho", name: "Jericho", region: "Canaan & Levant" },
  { id: "rabbah", name: "Rabbah (Ammon)", region: "Canaan & Levant" },
  { id: "joppa", name: "Joppa", region: "Canaan & Levant" },
  { id: "shechem", name: "Shechem", region: "Canaan & Levant" },
  { id: "samaria", name: "Samaria", region: "Canaan & Levant" },
  { id: "dan", name: "Dan", region: "Canaan & Levant" },
  { id: "tyre", name: "Tyre", region: "Canaan & Levant" },
  { id: "sidon", name: "Sidon", region: "Canaan & Levant" },
  { id: "damascus", name: "Damascus", region: "Canaan & Levant" },
  { id: "carchemish", name: "Carchemish", region: "Mesopotamia & Assyria" },
  { id: "haran", name: "Haran", region: "Mesopotamia & Assyria" },
  { id: "asshur", name: "Asshur", region: "Mesopotamia & Assyria" },
  { id: "nineveh", name: "Nineveh", region: "Mesopotamia & Assyria" },
  { id: "calah", name: "Calah (Nimrud)", region: "Mesopotamia & Assyria" },
  { id: "babylon", name: "Babylon", region: "Babylonia" },
  { id: "erech", name: "Erech (Uruk)", region: "Babylonia" },
  { id: "ur", name: "Ur of the Chaldees", region: "Babylonia" },
  { id: "dedan", name: "Dedan", region: "Arabia" },
  { id: "tema", name: "Tema", region: "Arabia" },
  { id: "ecbatana", name: "Ecbatana", region: "Persia & Media" },
  { id: "susa", name: "Susa (Shushan)", region: "Persia & Media" },
  { id: "persepolis", name: "Persepolis", region: "Persia & Media" },
];

export type AddPersonModalProps = {
  existingPeople?: Person[];
  people?: Person[];
  isOpen?: boolean;
  onClose: () => void;
  onAddPerson?: (newPerson: Person) => void;
  onSave?: (newPerson: Partial<Person>) => void;
  onSavePerson?: (newPerson: Person) => void;
  lang?: Language;
};

export default function AddPersonModal({
  existingPeople,
  people,
  isOpen = true,
  onClose,
  onAddPerson,
  onSave,
  onSavePerson,
  lang = "en",
}: AddPersonModalProps) {
  const personList = existingPeople || people || [];
  const t = UI_TRANSLATIONS[lang];

  const [formData, setFormData] = useState({
    name: "",
    arabicName: "",
    gender: "male" as "male" | "female",
    placeOfBirth: "",
    fatherId: "",
    motherId: "",
    anchorPersonId: "",
    anchorAgeAtBirth: 0,
    husbandId: "",
    wifeId: "",
    husbandMarriageAge: "" as string | number,
    wifeMarriageAge: "" as string | number,
    yearsLived: 100,
    biblicalReferences: "",
    notes: "",
    arabicNotes: "",
  });

  if (!isOpen) return null;

  const males = personList.filter((p) => p.gender === "male");
  const females = personList.filter((p) => p.gender === "female");
  const regions = Array.from(new Set(OT_CITIES.map((c) => c.region)));

  const handleNameChange = (nameVal: string) => {
    // If arabicName is empty, auto-suggest if known
    const autoAr = BIBLICAL_NAMES_ARABIC[nameVal.trim().toLowerCase()] || "";
    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      arabicName: prev.arabicName || autoAr,
    }));
  };

  const handleFatherChange = (fatherId: string) => {
    setFormData((prev) => ({
      ...prev,
      fatherId,
      anchorPersonId: prev.anchorPersonId ? prev.anchorPersonId : fatherId,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAnchor = formData.anchorPersonId || formData.fatherId;
    const spouseId = formData.gender === "female" ? formData.husbandId : formData.wifeId;

    const newPerson: Person = {
      id: formData.name.toLowerCase().replace(/\s+/g, "-") || `person_${Date.now()}`,
      name: formData.name,
      arabicName: formData.arabicName || undefined,
      gender: formData.gender,
      placeOfBirth: formData.placeOfBirth || undefined,
      fatherId: formData.fatherId || undefined,
      motherId: formData.motherId || undefined,
      anchorPersonId: selectedAnchor || undefined,
      anchorPersonAgeAtBirth: Number(formData.anchorAgeAtBirth) || undefined,
      fatherAgeAtBirth: Number(formData.anchorAgeAtBirth) || undefined,
      husbandId: formData.husbandId || undefined,
      wifeId: formData.wifeId || undefined,
      husbandMarriageAge:
        formData.husbandMarriageAge !== "" ? Number(formData.husbandMarriageAge) : undefined,
      wifeMarriageAge:
        formData.wifeMarriageAge !== "" ? Number(formData.wifeMarriageAge) : undefined,
      yearsLived: Number(formData.yearsLived) || undefined,
      spouseIds: spouseId ? [spouseId] : [],
      biblicalReferences: formData.biblicalReferences
        ? formData.biblicalReferences.split(",").map((r) => r.trim()).filter(Boolean)
        : [],
      notes: formData.notes || undefined,
      arabicNotes: formData.arabicNotes || undefined,
    };

    if (onAddPerson) onAddPerson(newPerson);
    if (onSavePerson) onSavePerson(newPerson);
    if (onSave) onSave(newPerson);
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
              {t.addPersonModalTitle}
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
          {/* Dual Language Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                <User size={14} />
                {t.nameEn} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Methuselah"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                <User size={14} />
                {t.nameAr}
              </label>
              <input
                type="text"
                placeholder="مثال: متوشالح"
                value={formData.arabicName}
                onChange={(e) => setFormData({ ...formData, arabicName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-amiri"
              />
            </div>
          </div>

          {/* Gender & Lifespan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.gender}
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value as "male" | "female" })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                <Calendar size={14} />
                {t.yearsLivedLabel}
              </label>
              <input
                type="number"
                min="0"
                value={formData.yearsLived}
                onChange={(e) => setFormData({ ...formData, yearsLived: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Lineage: Father & Mother */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.fatherSelect}
              </label>
              <select
                value={formData.fatherId}
                onChange={(e) => handleFatherChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">{lang === "ar" ? "— بلا أب مسجل (أو بداية الخليقة) —" : "— None (Creation / Root) —"}</option>
                {males.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.arabicName ? `(${m.arabicName})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.motherSelect}
              </label>
              <select
                value={formData.motherId}
                onChange={(e) => setFormData({ ...formData, motherId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">{lang === "ar" ? "— بلا أم مسجلة —" : "— None —"}</option>
                {females.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.arabicName ? `(${f.arabicName})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Age of Father at Birth & Place of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.anchorAgeLabel}
              </label>
              <input
                type="number"
                min="0"
                value={formData.anchorAgeAtBirth}
                onChange={(e) =>
                  setFormData({ ...formData, anchorAgeAtBirth: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                <MapPin size={14} />
                {t.placeOfBirthLabel}
              </label>
              <select
                value={formData.placeOfBirth}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">{lang === "ar" ? "— اختر مدينة العهد القديم —" : "— Select Biblical City —"}</option>
                {regions.map((region) => (
                  <optgroup key={region} label={region}>
                    {OT_CITIES.filter((c) => c.region === region).map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Marriage / Spouse */}
          <div className="space-y-1 p-3.5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
              <Heart size={14} />
              {t.spouseSelect}
            </label>
            {formData.gender === "male" ? (
              <select
                value={formData.wifeId}
                onChange={(e) => setFormData({ ...formData, wifeId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">{lang === "ar" ? "— لا توجد زوجة مسجلة —" : "— None —"}</option>
                {females.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.arabicName ? `(${f.arabicName})` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={formData.husbandId}
                onChange={(e) => setFormData({ ...formData, husbandId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">{lang === "ar" ? "— لا يوجد زوج مسجل —" : "— None —"}</option>
                {males.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.arabicName ? `(${m.arabicName})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Biblical References */}
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
              <BookOpen size={14} />
              {t.references}
            </label>
            <input
              type="text"
              placeholder="e.g. Genesis 5:3-8, 1 Chronicles 1:1"
              value={formData.biblicalReferences}
              onChange={(e) => setFormData({ ...formData, biblicalReferences: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Bilingual Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.notesEn}
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.notesAr}
              </label>
              <textarea
                rows={2}
                value={formData.arabicNotes}
                onChange={(e) => setFormData({ ...formData, arabicNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-amiri"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
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
