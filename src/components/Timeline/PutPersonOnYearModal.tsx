import React, { useState, useMemo, useEffect } from "react";
import type { Language, Person, DatePrecision } from "../../types/genealogy";
import {
  UI_TRANSLATIONS,
  getPersonDisplayName,
  formatYearDisplay,
} from "../../utils/i18n";
import {
  X,
  Calendar,
  User,
  Search,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { CopticCross } from "../Coptic/CopticCross";
import {
  hasPersonBirth,
  hasPersonDeath,
  getBirthYear,
  isBirthYearEstimated,
} from "./timelineUtils";

interface PutPersonOnYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  people: Person[];
  initialPersonId?: string | null;
  onSavePerson: (updatedPerson: Person) => void;
  lang?: Language;
}

export const PutPersonOnYearModal: React.FC<PutPersonOnYearModalProps> = ({
  isOpen,
  onClose,
  people,
  initialPersonId,
  onSavePerson,
  lang = "en",
}) => {
  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  // Selected Person
  const [selectedPersonId, setSelectedPersonId] = useState<string>(
    initialPersonId || (people[0]?.id ?? "")
  );

  // Search in selector
  const [searchFilter, setSearchFilter] = useState("");
  const [tabFilter, setTabFilter] = useState<"all" | "unplaced" | "estimated" | "placed">("all");

  // Form Fields
  const [mode, setMode] = useState<"direct" | "anchor">("direct");
  const [yearInput, setYearInput] = useState<string>("2000");
  const [era, setEra] = useState<"BC" | "AD">("BC");
  const [lifespanInput, setLifespanInput] = useState<string>("120");
  const [precision, setPrecision] = useState<DatePrecision>("exact");
  const [anchorFatherId, setAnchorFatherId] = useState<string>("");
  const [fatherAgeAtBirthInput, setFatherAgeAtBirthInput] = useState<string>("70");
  const [biblicalRefInput, setBiblicalRefInput] = useState<string>("");

  // Sync when initialPersonId changes
  useEffect(() => {
    if (initialPersonId) {
      setSelectedPersonId(initialPersonId);
    }
  }, [initialPersonId]);

  // Find currently selected person
  const activePerson = useMemo(() => {
    return people.find((p) => p.id === selectedPersonId) || null;
  }, [people, selectedPersonId]);

  // When activePerson changes, populate form values
  useEffect(() => {
    if (!activePerson) return;

    const hasBirth = hasPersonBirth(activePerson);
    const isEst = isBirthYearEstimated(activePerson);

    if (hasBirth) {
      const birth = getBirthYear(activePerson, people);
      const isBC = birth < 0;
      setYearInput(String(Math.abs(birth)));
      setEra(isBC ? "BC" : "AD");
      setPrecision(activePerson.birth?.precision || (isEst ? "approximate" : "exact"));
    } else {
      setYearInput("2000");
      setEra("BC");
      setPrecision("exact");
    }

    const duration =
      activePerson.yearsLived ||
      (activePerson as any).lifespan ||
      (activePerson.death?.year !== undefined && activePerson.birth?.year !== undefined
        ? Math.abs(activePerson.death.year - activePerson.birth.year)
        : 120);

    setLifespanInput(String(duration));

    const fatherId =
      activePerson.fatherId ||
      activePerson.anchorPersonId ||
      (activePerson as any).parentId;
    setAnchorFatherId(fatherId || "");

    const fatherAge =
      activePerson.anchorPersonAgeAtBirth ??
      activePerson.fatherAgeAtBirth ??
      (activePerson as any).ageAtBirth;

    if (fatherAge !== undefined && fatherAge !== null) {
      setFatherAgeAtBirthInput(String(fatherAge));
      setMode("anchor");
    } else {
      setMode("direct");
    }

    setBiblicalRefInput(
      (activePerson.biblicalReferences || []).join(", ")
    );
  }, [activePerson, people]);

  // Filtered people for selector
  const eligiblePeople = useMemo(() => {
    return people.filter((p) => {
      // Tab filter
      const onTimeline = hasPersonBirth(p) && hasPersonDeath(p);
      const isEst = isBirthYearEstimated(p);

      if (tabFilter === "unplaced" && onTimeline) return false;
      if (tabFilter === "estimated" && (!onTimeline || !isEst)) return false;
      if (tabFilter === "placed" && (!onTimeline || isEst)) return false;

      // Text search
      if (!searchFilter.trim()) return true;
      const term = searchFilter.trim().toLowerCase();
      const matchName = p.name.toLowerCase().includes(term);
      const matchAr = (p.arabicName || "").toLowerCase().includes(term);
      return matchName || matchAr;
    });
  }, [people, tabFilter, searchFilter]);

  // Counts for tabs
  const unplacedCount = useMemo(() => {
    return people.filter((p) => !(hasPersonBirth(p) && hasPersonDeath(p))).length;
  }, [people]);

  const estimatedCount = useMemo(() => {
    return people.filter(
      (p) => hasPersonBirth(p) && hasPersonDeath(p) && isBirthYearEstimated(p)
    ).length;
  }, [people]);

  // Computed values from current form
  const computedResult = useMemo(() => {
    if (!activePerson) return null;

    let computedBirthYear: number | undefined;

    if (mode === "direct") {
      const num = parseInt(yearInput, 10);
      if (!isNaN(num)) {
        computedBirthYear = era === "BC" ? -Math.abs(num) : Math.abs(num);
      }
    } else {
      // Anchor mode
      if (anchorFatherId) {
        const father = people.find((p) => p.id === anchorFatherId);
        if (father) {
          const fatherBirth = getBirthYear(father, people);
          const ageAtBirth = parseInt(fatherAgeAtBirthInput, 10);
          if (!isNaN(ageAtBirth)) {
            computedBirthYear = fatherBirth + ageAtBirth;
          }
        }
      }
    }

    const durationNum = parseInt(lifespanInput, 10);
    const validDuration = !isNaN(durationNum) && durationNum > 0 ? durationNum : 70;

    const computedDeathYear =
      computedBirthYear !== undefined ? computedBirthYear + validDuration : undefined;

    return {
      birthYear: computedBirthYear,
      deathYear: computedDeathYear,
      duration: validDuration,
    };
  }, [
    activePerson,
    mode,
    yearInput,
    era,
    anchorFatherId,
    fatherAgeAtBirthInput,
    lifespanInput,
    people,
  ]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!activePerson || !computedResult || computedResult.birthYear === undefined) {
      return;
    }

    const refs = biblicalRefInput
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    const updatedPerson: Person = {
      ...activePerson,
      birth: {
        year: computedResult.birthYear,
        precision,
      },
      death: {
        year: computedResult.deathYear,
        precision,
      },
      yearsLived: computedResult.duration,
      fatherId: anchorFatherId || activePerson.fatherId,
      anchorPersonId: mode === "anchor" ? anchorFatherId : activePerson.anchorPersonId,
      anchorPersonAgeAtBirth:
        mode === "anchor" ? parseInt(fatherAgeAtBirthInput, 10) : undefined,
      fatherAgeAtBirth:
        mode === "anchor" ? parseInt(fatherAgeAtBirthInput, 10) : undefined,
      biblicalReferences: refs.length > 0 ? refs : activePerson.biblicalReferences,
    };

    onSavePerson(updatedPerson);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FBF8EF] dark:bg-[#1C1A17] rounded-3xl border-2 border-[#D4AF37] shadow-2xl text-[#2D2721] dark:text-[#E6E0D4] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#D4AF37]/30 bg-gradient-to-r from-[#800020]/10 via-[#D4AF37]/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#800020] text-[#F3E5AB]">
              <CopticCross size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                {isRTL ? "ضبط وتثبيت الشخص على سنته الصحيحة" : "Put Person on Correct Year"}
              </h2>
              <p className="text-xs text-[#6B5E4E] dark:text-[#A99F8D]">
                {isRTL
                  ? "تحديد أو تصحيح سنة الميلاد وسنوات العمر ليظهر الشخص في مكانه الدقيق على الخط الزمني"
                  : "Specify or correct birth year and lifespan so this person appears accurately on the timeline"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#D4AF37]/20 text-[#6B5E4E] dark:text-[#A99F8D] hover:text-[#800020] dark:hover:text-[#F3E5AB] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Step 1: Select Person & Quick Filters */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37] flex items-center gap-1.5">
                <User size={14} />
                <span>{isRTL ? "اختر الشخص المراد ضبطه" : "Select Person"}</span>
              </label>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setTabFilter("all")}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    tabFilter === "all"
                      ? "bg-[#800020] text-[#F3E5AB]"
                      : "bg-[#D4AF37]/15 text-[#6B5E4E] dark:text-[#A99F8D] hover:bg-[#D4AF37]/25"
                  }`}
                >
                  {isRTL ? "الكل" : "All"} ({people.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTabFilter("unplaced")}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    tabFilter === "unplaced"
                      ? "bg-amber-600 text-white"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25"
                  }`}
                >
                  {isRTL ? "غير محدد" : "Unplaced"} ({unplacedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTabFilter("estimated")}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    tabFilter === "estimated"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25"
                  }`}
                >
                  {isRTL ? "تقديري" : "Estimated"} ({estimatedCount})
                </button>
              </div>
            </div>

            {/* Search Box & Person Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute top-3 left-3 text-[#6B5E4E] dark:text-[#A99F8D]"
                />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isRTL ? "بحث عن اسم شخص..." : "Search person name..."}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-[#121110] border border-[#D4AF37]/50 focus:outline-none focus:ring-2 focus:ring-[#800020]"
                />
              </div>

              <select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#121110] border border-[#D4AF37]/50 focus:outline-none focus:ring-2 focus:ring-[#800020] font-semibold"
              >
                {eligiblePeople.map((p) => {
                  const onTimeline = hasPersonBirth(p) && hasPersonDeath(p);
                  const isEst = isBirthYearEstimated(p);
                  const statusNote = !onTimeline
                    ? isRTL
                      ? "⚠️ غير مثبت"
                      : "⚠️ Unplaced"
                    : isEst
                    ? isRTL
                      ? "⏳ تقديري"
                      : "⏳ Est."
                    : isRTL
                    ? "✓ مثبت"
                    : "✓ Placed";
                  return (
                    <option key={p.id} value={p.id}>
                      {getPersonDisplayName(p, lang)} ({statusNote})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Current Person Timeline Status Banner */}
            {activePerson && (
              <div className="p-2.5 rounded-xl bg-[#F4EEDD] dark:bg-[#151311] border border-[#D4AF37]/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#800020] dark:text-[#F3E5AB]">
                    {getPersonDisplayName(activePerson, lang)}
                  </span>
                  {activePerson.arabicName && lang === "en" && (
                    <span className="text-[#6B5E4E] dark:text-[#A99F8D]">
                      ({activePerson.arabicName})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  {hasPersonBirth(activePerson) && hasPersonDeath(activePerson) ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      {isRTL ? "موجود على الخط الزمني:" : "On Timeline:"}{" "}
                      {formatYearDisplay(getBirthYear(activePerson, people), lang)}
                    </span>
                  ) : (
                    <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <HelpCircle size={13} />
                      {isRTL ? "غير محدد التواريخ بعد" : "Missing Birth/Death"}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Chronology Placement Method */}
          <div className="space-y-3 p-4 rounded-2xl bg-white/70 dark:bg-[#121110]/60 border border-[#D4AF37]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37]">
                {isRTL ? "طريقة تحديد السنة" : "Chronological Dating Method"}
              </span>

              <div className="flex items-center gap-1 bg-[#FBF8EF] dark:bg-[#1C1A17] p-1 rounded-xl border border-[#D4AF37]/40">
                <button
                  type="button"
                  onClick={() => setMode("direct")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    mode === "direct"
                      ? "bg-[#800020] text-[#F3E5AB] shadow-sm"
                      : "text-[#6B5E4E] dark:text-[#A99F8D] hover:text-[#800020]"
                  }`}
                >
                  {isRTL ? "سنة محددة مباشرة" : "Direct Year"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("anchor")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    mode === "anchor"
                      ? "bg-[#800020] text-[#F3E5AB] shadow-sm"
                      : "text-[#6B5E4E] dark:text-[#A99F8D] hover:text-[#800020]"
                  }`}
                >
                  {isRTL ? "ربط بعمر الأب (كتابياً)" : "Father Anchor (Biblical)"}
                </button>
              </div>
            </div>

            {/* MODE 1: Direct Year */}
            {mode === "direct" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-[#6B5E4E] dark:text-[#A99F8D]">
                    {isRTL ? "سنة الميلاد" : "Birth Year"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={yearInput}
                      onChange={(e) => setYearInput(e.target.value)}
                      placeholder="e.g. 2000"
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-white dark:bg-[#1C1A17] border border-[#D4AF37]/60 focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    />
                    <select
                      value={era}
                      onChange={(e) => setEra(e.target.value as "BC" | "AD")}
                      className="px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-[#1C1A17] border border-[#D4AF37]/60"
                    >
                      <option value="BC">{isRTL ? "ق.م (BC)" : "BC"}</option>
                      <option value="AD">{isRTL ? "ب.م (AD)" : "AD"}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#6B5E4E] dark:text-[#A99F8D]">
                    {isRTL ? "سنوات العمر (Lifespan)" : "Lifespan (Years lived)"}
                  </label>
                  <input
                    type="number"
                    value={lifespanInput}
                    onChange={(e) => setLifespanInput(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-white dark:bg-[#1C1A17] border border-[#D4AF37]/60 focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  />
                </div>
              </div>
            )}

            {/* MODE 2: Biblical Father Anchor */}
            {mode === "anchor" && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#6B5E4E] dark:text-[#A99F8D]">
                      {isRTL ? "الأب المرجعي" : "Father / Anchor Person"}
                    </label>
                    <select
                      value={anchorFatherId}
                      onChange={(e) => setAnchorFatherId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1C1A17] border border-[#D4AF37]/60 font-semibold"
                    >
                      <option value="">{isRTL ? "-- اختر الأب --" : "-- Select Father --"}</option>
                      {people
                        .filter((p) => p.id !== activePerson?.id && p.gender === "male")
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {getPersonDisplayName(f, lang)}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#6B5E4E] dark:text-[#A99F8D]">
                      {isRTL ? "عمر الأب عند ولادته (سنة)" : "Father's Age at Birth (years)"}
                    </label>
                    <input
                      type="number"
                      value={fatherAgeAtBirthInput}
                      onChange={(e) => setFatherAgeAtBirthInput(e.target.value)}
                      placeholder="e.g. 70"
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-white dark:bg-[#1C1A17] border border-[#D4AF37]/60 focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#6B5E4E] dark:text-[#A99F8D]">
                    {isRTL ? "سنوات العمر (Lifespan)" : "Lifespan (Years lived)"}
                  </label>
                  <input
                    type="number"
                    value={lifespanInput}
                    onChange={(e) => setLifespanInput(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-white dark:bg-[#1C1A17] border border-[#D4AF37]/60 focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  />
                </div>
              </div>
            )}

            {/* Precision & Certainty */}
            <div className="pt-2 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <label className="text-[11px] font-semibold text-[#6B5E4E] dark:text-[#A99F8D]">
                  {isRTL ? "درجة الدقة التاريخية:" : "Date Precision:"}
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPrecision("exact")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      precision === "exact"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white dark:bg-[#1C1A17] text-[#6B5E4E] dark:text-[#A99F8D] border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {isRTL ? "دقيق مؤكد (Exact)" : "Exact"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrecision("calculated")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      precision === "calculated"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-[#1C1A17] text-[#6B5E4E] dark:text-[#A99F8D] border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {isRTL ? "محسوب كتابياً (Calculated)" : "Calculated"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrecision("approximate")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      precision === "approximate"
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white dark:bg-[#1C1A17] text-[#6B5E4E] dark:text-[#A99F8D] border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {isRTL ? "تقريبي (Approximate)" : "Approximate"}
                  </button>
                </div>
              </div>

              {/* Biblical Reference */}
              <div className="w-full sm:w-auto flex-1 sm:max-w-xs space-y-0.5">
                <label className="text-[11px] font-semibold text-[#6B5E4E] dark:text-[#A99F8D]">
                  {isRTL ? "الشاهد الكتابي (اختياري)" : "Biblical Reference"}
                </label>
                <input
                  type="text"
                  value={biblicalRefInput}
                  onChange={(e) => setBiblicalRefInput(e.target.value)}
                  placeholder="e.g. Genesis 5:3"
                  className="w-full px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#1C1A17] border border-[#D4AF37]/50"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          {computedResult && computedResult.birthYear !== undefined && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#800020]/15 via-[#D4AF37]/15 to-[#800020]/10 border-2 border-[#D4AF37] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#800020] dark:text-[#F3E5AB]">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#D4AF37]" />
                  <span>{isRTL ? "معاينة الوضع على الخط الزمني" : "Timeline Placement Preview"}</span>
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#800020] text-[#F3E5AB]">
                  {computedResult.duration} {t.years}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-[#6B5E4E] dark:text-[#A99F8D] block text-[11px]">
                    {t.birth}:
                  </span>
                  <span className="font-bold font-mono text-[#800020] dark:text-[#F3E5AB]">
                    {formatYearDisplay(computedResult.birthYear, lang)}
                  </span>
                </div>

                <div className="flex items-center text-[#D4AF37]">
                  <ArrowRight size={18} className={isRTL ? "rotate-180" : ""} />
                </div>

                <div>
                  <span className="text-[#6B5E4E] dark:text-[#A99F8D] block text-[11px]">
                    {t.death}:
                  </span>
                  <span className="font-bold font-mono text-[#800020] dark:text-[#F3E5AB]">
                    {formatYearDisplay(computedResult.deathYear!, lang)}
                  </span>
                </div>

                <div className="w-full pt-1">
                  <div className="h-6 w-full rounded-lg bg-gradient-to-r from-[#800020] via-[#941c30] to-[#730018] text-[#F3E5AB] border border-[#D4AF37] flex items-center justify-between px-3 text-[11px] font-bold shadow-sm">
                    <span>{activePerson ? getPersonDisplayName(activePerson, lang) : ""}</span>
                    <span>
                      {formatYearDisplay(computedResult.birthYear, lang)} —{" "}
                      {formatYearDisplay(computedResult.deathYear!, lang)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#D4AF37]/30 bg-[#FBF8EF] dark:bg-[#1C1A17] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 dark:border-gray-700 text-[#6B5E4E] dark:text-[#A99F8D] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!computedResult || computedResult.birthYear === undefined}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#800020] via-[#A0153E] to-[#800020] text-[#F3E5AB] border border-[#D4AF37] shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calendar size={14} />
            <span>{isRTL ? "حفظ وتثبيت على الخط الزمني" : "Save & Place on Timeline"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
