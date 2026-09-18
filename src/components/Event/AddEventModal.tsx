import React, { useState, useMemo, useEffect } from "react";
import type { BiblicalEvent, DateInfo, Person, Language } from "../../types/genealogy";
import { CopticCross } from "../Coptic/CopticCross";
import { UI_TRANSLATIONS, formatYearDisplay } from "../../utils/i18n";
import { calculateAnchorEventYear } from "../../utils/chronology";
import { BIBLICAL_LOCATIONS } from "../../data/biblicalLocations";
import { BIBLICAL_COUNTRIES } from "../../data/biblicalLands";
import { X, MapPin, BookOpen, Plus, Sparkles, Calendar, Globe } from "lucide-react";
import { PersonSelector } from "./PersonSelector";
import {
  ALL_EVENT_TYPES,
  getEventTypeDefinition,
  guessEventTypeForLegacyEvent,
  type EventType,
} from "../../data/biblicalEventTypes";
import { EventTypeBadge } from "./EventTypeBadge";
import { BiblicalPlaceSelector } from "./BiblicalPlaceSelector";
import { PrecisionIndicator } from "../Common/PrecisionIndicator";
import type { BiblicalPlace } from "../../data/biblicalPlaces";
import type { DatePrecision } from "../../types/genealogy";

export type EventModalProps = {
  existingPeople: Person[];
  onAddEvent?: (newEvent: BiblicalEvent) => void;
  onUpdateEvent?: (updatedEvent: BiblicalEvent) => void;
  initialEvent?: BiblicalEvent | null;
  onClose: () => void;
  lang?: Language;
};

type CityRegion =
  | "Egypt & Sinai"
  | "Canaan & Levant"
  | "Mesopotamia & Assyria"
  | "Babylonia"
  | "Arabia"
  | "Persia & Media"
  | "Anatolia & Other";

type CityOption = {
  id: string;
  name: string;
  arabicName?: string;
  region: CityRegion;
};

const OT_FALLBACK_LOCATIONS: CityOption[] = [
  { id: "thebes", name: "Thebes (No-Amon)", arabicName: "طيبة (نو-آمون)", region: "Egypt & Sinai" },
  { id: "memphis", name: "Memphis (Noph)", arabicName: "منف (نوف)", region: "Egypt & Sinai" },
  { id: "rameses", name: "Rameses (Goshen)", arabicName: "رعمسيس (أرض جاسان)", region: "Egypt & Sinai" },
  { id: "sinai", name: "Mt. Sinai (Horeb)", arabicName: "جبل سيناء (حوريب)", region: "Egypt & Sinai" },
  { id: "eziongeber", name: "Ezion-Geber", arabicName: "عصيون جابر", region: "Egypt & Sinai" },
  { id: "gaza", name: "Gaza", arabicName: "غزة", region: "Canaan & Levant" },
  { id: "beersheba", name: "Beersheba", arabicName: "بئر سبع", region: "Canaan & Levant" },
  { id: "kirhareseth", name: "Kir-hareseth (Moab)", arabicName: "قير حارسة (موآب)", region: "Canaan & Levant" },
  { id: "hebron", name: "Hebron", arabicName: "حبرون (الخليل)", region: "Canaan & Levant" },
  { id: "jerusalem", name: "Jerusalem", arabicName: "أورشليم القدس", region: "Canaan & Levant" },
  { id: "sodom", name: "Sodom", arabicName: "سدوم (مدينة السهل)", region: "Canaan & Levant" },
  { id: "gomorrah", name: "Gomorrah", arabicName: "عمورة (مدينة السهل)", region: "Canaan & Levant" },
  { id: "zoar", name: "Zoar", arabicName: "صوغر", region: "Canaan & Levant" },
  { id: "canaan", name: "Land of Canaan", arabicName: "أرض كنعان", region: "Canaan & Levant" },
  { id: "jericho", name: "Jericho", arabicName: "أريحا", region: "Canaan & Levant" },
  { id: "rabbah", name: "Rabbah (Ammon)", arabicName: "ربة عمون", region: "Canaan & Levant" },
  { id: "joppa", name: "Joppa", arabicName: "يافا", region: "Canaan & Levant" },
  { id: "shechem", name: "Shechem", arabicName: "شكيم", region: "Canaan & Levant" },
  { id: "samaria", name: "Samaria", arabicName: "السامرة", region: "Canaan & Levant" },
  { id: "dan", name: "Dan", arabicName: "دان", region: "Canaan & Levant" },
  { id: "tyre", name: "Tyre", arabicName: "صور", region: "Canaan & Levant" },
  { id: "sidon", name: "Sidon", arabicName: "صيدون", region: "Canaan & Levant" },
  { id: "damascus", name: "Damascus", arabicName: "دمشق", region: "Canaan & Levant" },
  { id: "carchemish", name: "Carchemish", arabicName: "كركميش", region: "Mesopotamia & Assyria" },
  { id: "haran", name: "Haran", arabicName: "حاران / فدان أرام", region: "Mesopotamia & Assyria" },
  { id: "asshur", name: "Asshur", arabicName: "آشور", region: "Mesopotamia & Assyria" },
  { id: "nineveh", name: "Nineveh", arabicName: "نينوى", region: "Mesopotamia & Assyria" },
  { id: "calah", name: "Calah (Nimrud)", arabicName: "كالح (نمرود)", region: "Mesopotamia & Assyria" },
  { id: "babylon", name: "Babylon", arabicName: "بابل", region: "Babylonia" },
  { id: "erech", name: "Erech (Uruk)", arabicName: "أوروك (أرك)", region: "Babylonia" },
  { id: "ur", name: "Ur of the Chaldees", arabicName: "أور الكلدانيين", region: "Babylonia" },
  { id: "dedan", name: "Dedan", arabicName: "ددان", region: "Arabia" },
  { id: "tema", name: "Tema", arabicName: "تيماء", region: "Arabia" },
  { id: "ecbatana", name: "Ecbatana", arabicName: "أحمدان (إكباتانا)", region: "Persia & Media" },
  { id: "susa", name: "Susa (Shushan)", arabicName: "شوشن (شوشان)", region: "Persia & Media" },
  { id: "persepolis", name: "Persepolis", arabicName: "برسيبوليس", region: "Persia & Media" },
];

export default function AddEventModal({
  existingPeople = [],
  onAddEvent,
  onUpdateEvent,
  initialEvent = null,
  onClose,
  lang = "en",
}: EventModalProps) {
  const isEditMode = !!initialEvent;
  const t = UI_TRANSLATIONS[lang];

  // Determine initial chronology method
  const initialDateType = initialEvent?.anchorPersonId ? "anchor" : "direct";

  const [dateType, setDateType] = useState<"direct" | "anchor">(initialDateType);
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>(
    initialEvent?.personIds || []
  );

  // Multiple Locations State
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() => {
    if (initialEvent?.locations && initialEvent.locations.length > 0) {
      return [...initialEvent.locations];
    }
    if (initialEvent?.location) {
      return initialEvent.location
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  });
  const [customLocationInput, setCustomLocationInput] = useState("");
  const [selectedCityDropdown, setSelectedCityDropdown] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(
    initialEvent?.locationId
  );
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(
    initialEvent?.coordinates
  );
  const [datePrecision, setDatePrecision] = useState<DatePrecision>(
    initialEvent?.date?.precision || (initialEvent?.anchorPersonId ? "calculated" : "exact")
  );
  const [eventType, setEventType] = useState<EventType>(() => {
    if (initialEvent?.eventType) return initialEvent.eventType;
    if (initialEvent) return guessEventTypeForLegacyEvent(initialEvent);
    return "historical_event";
  });

  const [formData, setFormData] = useState({
    title: initialEvent?.title || "",
    arabicTitle: initialEvent?.arabicTitle || "",
    year: initialEvent?.date?.year !== undefined ? String(Math.abs(initialEvent.date.year)) : "",
    era: (initialEvent?.date?.year !== undefined && initialEvent.date.year >= 0) ? "AD" : "BC",
    country: initialEvent?.country || "",
    anchorPersonId: initialEvent?.anchorPersonId || "",
    anchorAge:
      initialEvent?.anchorAge !== undefined
        ? String(initialEvent.anchorAge)
        : initialEvent?.anchorPersonAgeAtEvent !== undefined
        ? String(initialEvent.anchorPersonAgeAtEvent)
        : "",
    description: initialEvent?.description || "",
    arabicDescription: initialEvent?.arabicDescription || "",
    biblicalReferences: (initialEvent?.biblicalReferences || []).join(", "),
  });

  // Re-sync if initialEvent changes
  useEffect(() => {
    if (initialEvent) {
      setFormData({
        title: initialEvent.title || "",
        arabicTitle: initialEvent.arabicTitle || "",
        year: initialEvent.date?.year !== undefined ? String(Math.abs(initialEvent.date.year)) : "",
        era: (initialEvent.date?.year !== undefined && initialEvent.date.year >= 0) ? "AD" : "BC",
        country: initialEvent.country || "",
        anchorPersonId: initialEvent.anchorPersonId || "",
        anchorAge:
          initialEvent.anchorAge !== undefined
            ? String(initialEvent.anchorAge)
            : initialEvent.anchorPersonAgeAtEvent !== undefined
            ? String(initialEvent.anchorPersonAgeAtEvent)
            : "",
        description: initialEvent.description || "",
        arabicDescription: initialEvent.arabicDescription || "",
        biblicalReferences: (initialEvent.biblicalReferences || []).join(", "),
      });
      setEventType(initialEvent.eventType || guessEventTypeForLegacyEvent(initialEvent));
      setDatePrecision(initialEvent.date?.precision || (initialEvent.anchorPersonId ? "calculated" : "exact"));
      setSelectedPlaceId(initialEvent.locationId);
      setCoordinates(initialEvent.coordinates);
      setDateType(initialEvent.anchorPersonId ? "anchor" : "direct");
      setSelectedPersonIds(initialEvent.personIds || []);
      if (initialEvent.locations && initialEvent.locations.length > 0) {
        setSelectedLocations([...initialEvent.locations]);
      } else if (initialEvent.location) {
        setSelectedLocations(
          initialEvent.location.split(",").map((s) => s.trim()).filter(Boolean)
        );
      }
    }
  }, [initialEvent]);

  // Real-time anchor date calculation
  const calculatedAnchorYear = useMemo(() => {
    if (dateType !== "anchor" || !formData.anchorPersonId || !formData.anchorAge) {
      return undefined;
    }
    const ageNum = Number(formData.anchorAge);
    if (isNaN(ageNum)) return undefined;
    return calculateAnchorEventYear(formData.anchorPersonId, ageNum, existingPeople);
  }, [dateType, formData.anchorPersonId, formData.anchorAge, existingPeople]);

  const selectedAnchorPerson = useMemo(() => {
    if (!formData.anchorPersonId) return null;
    return existingPeople.find((p) => p.id === formData.anchorPersonId) || null;
  }, [formData.anchorPersonId, existingPeople]);

  // Add location from dropdown
  const handleAddLocationFromSelect = (locationName: string) => {
    if (!locationName) return;
    if (!selectedLocations.includes(locationName)) {
      setSelectedLocations([...selectedLocations, locationName]);
    }
    setSelectedCityDropdown("");
  };

  // Add custom location
  const handleAddCustomLocation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customLocationInput.trim();
    if (!trimmed) return;
    if (!selectedLocations.includes(trimmed)) {
      setSelectedLocations([...selectedLocations, trimmed]);
    }
    setCustomLocationInput("");
  };

  // Remove location
  const handleRemoveLocation = (locationToRemove: string) => {
    setSelectedLocations(selectedLocations.filter((loc) => loc !== locationToRemove));
  };

  // Merge available biblical locations without duplicate IDs or names
  const locationOptions = useMemo(() => {
    const list: CityOption[] = [];
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();

    const normalize = (str: string) => str.split("(")[0].trim().toLowerCase();

    // From BIBLICAL_LOCATIONS
    BIBLICAL_LOCATIONS.forEach((b) => {
      const idKey = b.id.toLowerCase();
      if (!seenIds.has(idKey)) {
        seenIds.add(idKey);
        seenNames.add(b.name.toLowerCase());
        seenNames.add(normalize(b.name));

        let reg: CityRegion = "Canaan & Levant";
        if (b.region === "Mesopotamia") reg = "Mesopotamia & Assyria";
        else if (b.region === "Egypt" || b.region === "Sinai") reg = "Egypt & Sinai";
        else if (b.region === "Anatolia") reg = "Anatolia & Other";

        list.push({
          id: b.id,
          name: b.name,
          arabicName: b.arabicName,
          region: reg,
        });
      }
    });

    // Add fallback options if id and name are not already present
    OT_FALLBACK_LOCATIONS.forEach((ot) => {
      const idKey = ot.id.toLowerCase();
      const nameKey = ot.name.toLowerCase();
      const normKey = normalize(ot.name);
      if (!seenIds.has(idKey) && !seenNames.has(nameKey) && !seenNames.has(normKey)) {
        list.push(ot);
        seenIds.add(idKey);
        seenNames.add(nameKey);
        seenNames.add(normKey);
      }
    });

    return list;
  }, []);

  const regions = useMemo(() => {
    return Array.from(new Set(locationOptions.map((c) => c.region)));
  }, [locationOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let computedDate: DateInfo | undefined = undefined;

    if (dateType === "direct" && formData.year) {
      const numericYear = Number(formData.year);
      const signedYear =
        formData.era === "BC" ? -Math.abs(numericYear) : Math.abs(numericYear);
      computedDate = { year: signedYear, precision: datePrecision };
    } else if (dateType === "anchor") {
      const yearToUse =
        calculatedAnchorYear ??
        (formData.anchorPersonId && formData.anchorAge && !isNaN(Number(formData.anchorAge))
          ? calculateAnchorEventYear(formData.anchorPersonId, Number(formData.anchorAge), existingPeople)
          : undefined);
      if (yearToUse !== undefined) {
        computedDate = { year: yearToUse, precision: datePrecision || "calculated" };
      } else {
        computedDate = { precision: datePrecision || "calculated" };
      }
    }

    const eventPayload: BiblicalEvent = {
      id: initialEvent?.id || formData.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      title: formData.title.trim(),
      arabicTitle: formData.arabicTitle.trim() || undefined,
      eventType: eventType,
      date: computedDate,
      country: formData.country || undefined,
      anchorPersonId:
        dateType === "anchor" ? formData.anchorPersonId || undefined : undefined,
      anchorAge:
        dateType === "anchor" && formData.anchorAge
          ? Number(formData.anchorAge)
          : undefined,
      anchorPersonAgeAtEvent:
        dateType === "anchor" && formData.anchorAge
          ? Number(formData.anchorAge)
          : undefined,
      personIds: selectedPersonIds.length > 0 ? selectedPersonIds : undefined,
      locations: selectedLocations.length > 0 ? selectedLocations : undefined,
      location: selectedLocations.length > 0 ? selectedLocations.join(", ") : undefined,
      locationId: selectedPlaceId,
      coordinates: coordinates,
      description: formData.description.trim() || undefined,
      arabicDescription: formData.arabicDescription.trim() || undefined,
      biblicalReferences: formData.biblicalReferences
        ? formData.biblicalReferences
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean)
        : [],
    };

    if (isEditMode && onUpdateEvent) {
      onUpdateEvent(eventPayload);
    } else if (onAddEvent) {
      onAddEvent(eventPayload);
    }

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
            <div>
              <h3 className="text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                {isEditMode ? t.editEvent : t.addEvent}
              </h3>
              <p className="text-xs text-[#6B5E4E] dark:text-[#A99F8D] mt-0.5">
                {lang === "ar"
                  ? "تسجيل الأحداث التاريخية والمحطات الكبرى في العهد القديم"
                  : "Record historical milestones and key events in the Old Testament"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B5E4E] dark:text-[#A99F8D] hover:bg-[#D4AF37]/20 transition-colors"
            title={t.cancel}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Event Type (Required field) */}
          <div className="space-y-1.5 p-3.5 rounded-xl border border-[#D4AF37]/50 bg-gradient-to-r from-[#800020]/10 via-[#D4AF37]/10 to-transparent">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <span>{lang === "ar" ? "نوع الحدث الكتابي *" : "Event Type *"}</span>
              </label>
              {eventType && (
                <EventTypeBadge eventType={eventType} lang={lang} size="sm" />
              )}
            </div>
            <select
              required
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventType)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#D4AF37]/60 bg-white dark:bg-[#121110] text-sm font-semibold text-[#2C241E] dark:text-[#F3E5AB] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-2xs"
            >
              <option value="">-- {lang === "ar" ? "اختر نوع الحدث الكتابي *" : "Select Event Type *"} --</option>
              {ALL_EVENT_TYPES.map((type) => {
                const def = getEventTypeDefinition(type);
                return (
                  <option key={type} value={type}>
                    {lang === "ar" ? `${def.labelAr} — ${def.labelEn}` : `${def.labelEn} — ${def.labelAr}`}
                  </option>
                );
              })}
            </select>
          </div>

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

          {/* Chronology Method & Date Calculation */}
          <div className="space-y-3 p-4 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 dark:bg-[#D4AF37]/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37] flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{lang === "ar" ? "طريقة تحديد التاريخ الزمني" : "Chronology Method"}</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
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
              <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
                <input
                  type="radio"
                  name="dateType"
                  value="anchor"
                  checked={dateType === "anchor"}
                  onChange={() => setDateType("anchor")}
                  className="accent-[#800020]"
                />
                <span>{t.relativeToPerson}</span>
              </label>
            </div>

            {dateType === "direct" ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs text-[#6B5E4E] dark:text-[#A99F8D] font-medium">{t.year}</label>
                  <input
                    type="number"
                    placeholder="e.g. 2091"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B5E4E] dark:text-[#A99F8D] font-medium">{t.era}</label>
                  <select
                    value={formData.era}
                    onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="BC">{t.bc}</option>
                    <option value="AD">{t.ad}</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#6B5E4E] dark:text-[#A99F8D] font-medium block mb-1">
                      {t.anchorPerson}
                    </label>
                    <select
                      value={formData.anchorPersonId}
                      onChange={(e) => setFormData({ ...formData, anchorPersonId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="">-- {lang === "ar" ? "اختر الشخصية المرجعية" : "Select Figure"} --</option>
                      {existingPeople.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.arabicName ? `(${p.arabicName})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#6B5E4E] dark:text-[#A99F8D] font-medium block mb-1">
                      {t.relativeFigureAgeAtEvent}
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 75"
                      value={formData.anchorAge}
                      onChange={(e) => setFormData({ ...formData, anchorAge: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Real-time Calculation Banner */}
                <div className="p-3 rounded-xl border border-[#D4AF37]/40 bg-white/80 dark:bg-stone-900/60 shadow-xs">
                  {calculatedAnchorYear !== undefined ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#800020] dark:text-[#F3E5AB] font-bold text-sm">
                        <Sparkles size={16} className="text-[#D4AF37] shrink-0 animate-pulse" />
                        <span>
                          {t.calculatedEventYear}:{" "}
                          <span className="text-base text-[#B91C1C] dark:text-[#F6AD55] underline decoration-[#D4AF37] underline-offset-4">
                            {formatYearDisplay(calculatedAnchorYear, lang)}
                          </span>
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300">
                        {lang === "ar"
                          ? `✓ استناداً لولادة ${selectedAnchorPerson?.arabicName || selectedAnchorPerson?.name || "الشخصية"} في عمر ${formData.anchorAge} سنة (${t.calculationSuccessNotice}).`
                          : `✓ Computed relative to ${selectedAnchorPerson?.name || "figure"} at age ${formData.anchorAge} (${t.calculationSuccessNotice}).`}
                      </p>
                    </div>
                  ) : formData.anchorPersonId && formData.anchorAge ? (
                    <div className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <Sparkles size={14} className="shrink-0" />
                      <span>{t.noBirthYearForFigure}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-[#6B5E4E] dark:text-[#A99F8D] italic">
                      {lang === "ar"
                        ? "اختر الشخصية المرجعية وأدخل عمرها عند وقوع الحدث لحساب التاريخ الزمني تلقائياً."
                        : "Select a figure and enter their age at the event to automatically calculate the historical date."}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Precision Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#800020] dark:text-[#D4AF37]">
                <Calendar size={13} />
                <span>{lang === "ar" ? "دقة التاريخ الزمني:" : "Date Precision:"}</span>
                <span className="text-[10px] text-[#6B5E4E] dark:text-[#A99F8D] font-normal">
                  ({lang === "ar" ? "انقر للتبديل" : "Click to toggle"})
                </span>
              </div>
              <PrecisionIndicator
                precision={datePrecision}
                lang={lang}
                interactive={true}
                onToggle={() =>
                  setDatePrecision((prev) =>
                    prev === "exact" || prev === "calculated" ? "approximate" : "exact"
                  )
                }
                size="md"
              />
            </div>
          </div>

          {/* MULTIPLE LOCATIONS SUPPORT */}
          <div className="space-y-3 p-4 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 dark:bg-[#D4AF37]/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37] flex items-center gap-1.5">
                <MapPin size={15} />
                <span>{t.multipleLocations}</span>
                {selectedLocations.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#800020] text-white">
                    {selectedLocations.length}
                  </span>
                )}
              </label>
              <span className="text-[11px] text-stone-500">
                {lang === "ar" ? "يمكنك إضافة موقع واحد أو أكثر" : "Add one or multiple sites"}
              </span>
            </div>

            {/* Selected Location Chips */}
            {selectedLocations.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedLocations.map((loc, idx) => (
                  <span
                    key={`${loc}-${idx}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-stone-900 text-[#800020] dark:text-[#F3E5AB] border border-[#D4AF37]/60 shadow-2xs"
                  >
                    <MapPin size={12} className="text-[#D4AF37] shrink-0" />
                    <span>{loc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(loc)}
                      className="p-0.5 text-stone-400 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
                      title={lang === "ar" ? "إزالة الموقع" : "Remove location"}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic py-1">
                {lang === "ar" ? "لم يتم تحديد أي مواقع بعد." : "No locations added yet."}
              </p>
            )}

            {/* Comprehensive Biblical Places Database Selector */}
            <div className="p-3 rounded-xl border border-[#D4AF37]/50 bg-white/70 dark:bg-stone-900/60 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37] flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#800020] dark:text-[#D4AF37]" />
                  <span>{lang === "ar" ? "قاعدة بيانات المواقع الكتابية (بحث مع إحداثيات جغرافية)" : "Biblical Places Database (Geographic Lookup)"}</span>
                </label>
                {selectedPlaceId && (
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    ✓ {lang === "ar" ? "تم ربط الموقع جغرافياً" : "Geographically Linked"}
                  </span>
                )}
              </div>
              <BiblicalPlaceSelector
                selectedPlaceId={selectedPlaceId}
                selectedPlaceName={selectedLocations[0]}
                lang={lang}
                onSelect={(place: BiblicalPlace) => {
                  setSelectedPlaceId(place.id);
                  setCoordinates([place.latitude, place.longitude]);
                  const placeName = lang === "ar" && place.arabicName ? place.arabicName : place.name;
                  if (!selectedLocations.includes(placeName)) {
                    setSelectedLocations((prev) => [placeName, ...prev]);
                  }
                  const countryVal = place.modernCountry || place.region;
                  if (countryVal && !formData.country) {
                    setFormData((prev) => ({ ...prev, country: countryVal }));
                  }
                }}
                onClear={() => {
                  setSelectedPlaceId(undefined);
                  setCoordinates(undefined);
                }}
              />
            </div>

            {/* Country / Biblical Land Selection */}
            <div className="p-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37] flex items-center gap-1.5">
                <Globe size={14} />
                <span>{t.countryLabel || (lang === "ar" ? "الدولة / الإقليم (كنعان، مصر، آشور، إلخ)" : "Biblical Land / Country")}</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.country}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({ ...prev, country: val }));
                    if (val && !selectedLocations.includes(val)) {
                      setSelectedLocations((prev) => [...prev, val]);
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="">
                    {t.selectCountryPlaceholder || (lang === "ar" ? "— اختر الدولة / الإقليم —" : "— Select Country / Land —")}
                  </option>
                  {BIBLICAL_COUNTRIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {lang === "ar" ? `${c.arabicName} (${c.name})` : `${c.name} (${c.arabicName})`}
                    </option>
                  ))}
                </select>
                {formData.country && !selectedLocations.includes(formData.country) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedLocations.includes(formData.country)) {
                        setSelectedLocations([...selectedLocations, formData.country]);
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#800020] text-[#D4AF37] text-xs font-bold shrink-0 flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>{lang === "ar" ? "إضافة للمواقع" : "Add to sites"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Add Location Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Select from Biblical Sites */}
              <div>
                <label className="text-[11px] text-stone-600 dark:text-stone-400 font-medium block mb-1">
                  {lang === "ar" ? "اختر من المواقع الكتابية المعروفة:" : "Select from biblical locations:"}
                </label>
                <select
                  value={selectedCityDropdown}
                  onChange={(e) => {
                    setSelectedCityDropdown(e.target.value);
                    handleAddLocationFromSelect(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="">{t.selectLocationPlaceholder}</option>
                  {regions.map((region) => (
                    <optgroup key={region} label={region}>
                      {locationOptions
                        .filter((loc) => loc.region === region)
                        .map((loc) => {
                          const label =
                            lang === "ar" && loc.arabicName
                              ? `${loc.arabicName} (${loc.name})`
                              : loc.name;
                          return (
                            <option key={`loc-opt-${loc.id}`} value={loc.name}>
                              {label}
                            </option>
                          );
                        })}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Add Custom Location Input */}
              <div>
                <label className="text-[11px] text-stone-600 dark:text-stone-400 font-medium block mb-1">
                  {lang === "ar" ? "أو أضف موقعاً / مساراً مخصصاً:" : "Or add a custom site / route:"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t.customLocationPlaceholder}
                    value={customLocationInput}
                    onChange={(e) => setCustomLocationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomLocation();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomLocation()}
                    className="px-3 py-2 rounded-lg bg-[#800020] text-[#D4AF37] hover:bg-[#991B1B] text-xs font-bold flex items-center gap-1 transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>{t.addLocation}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scripture References */}
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
              <BookOpen size={14} />
              {t.references}
            </label>
            <input
              type="text"
              placeholder="e.g. Genesis 12:1-4, Genesis 15:1-6"
              value={formData.biblicalReferences}
              onChange={(e) => setFormData({ ...formData, biblicalReferences: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Associated Persons Selector */}
          <div className="p-3.5 rounded-xl border border-[#D4AF37]/35 bg-[#D4AF37]/5 space-y-2">
            <PersonSelector
              people={existingPeople}
              selectedPersonIds={selectedPersonIds}
              onChange={setSelectedPersonIds}
              lang={lang}
            />
          </div>

          {/* Bilingual Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.eventDescEn}
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Key details of the biblical event..."
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                {t.eventDescAr}
              </label>
              <textarea
                rows={3}
                value={formData.arabicDescription}
                onChange={(e) => setFormData({ ...formData, arabicDescription: e.target.value })}
                placeholder="تفاصيل الحدث وسياقه الكتابي واللاهوتي..."
                className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-amiri"
              />
            </div>
          </div>

          {/* Action Buttons */}
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
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#A01128] text-white font-bold text-sm shadow-md hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <span>{isEditMode ? (lang === "ar" ? "حفظ التعديلات" : "Save Changes") : t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
