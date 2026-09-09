import { useState } from "react";
import AddEventModal from "../components/Event/AddEventModal";
import type { BiblicalEvent, Person, Language } from "../types/genealogy";
import {
  UI_TRANSLATIONS,
  getEventDisplayTitle,
  getEventDisplayDescription,
  formatYearDisplay,
  getPersonDisplayName,
  localizeBiblicalReferences,
  matchesBiblicalSearch,
} from "../utils/i18n";
import {
  Search,
  Plus,
  BookOpen,
  MapPin,
  X,
  Edit3,
  Trash2,
} from "lucide-react";
import { CopticCross } from "../components/Coptic/CopticCross";

type EventsProps = {
  events: BiblicalEvent[];
  people: Person[];
  onAddEvent: (newEvent: BiblicalEvent) => void;
  onUpdateEvent?: (updatedEvent: BiblicalEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  lang?: Language;
};
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

const OT_LOCATIONS: CityOption[] = [
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
export default function Events({
  events,
  people,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  lang = "en",
}: EventsProps) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<BiblicalEvent | null>(null);

  const t = UI_TRANSLATIONS[lang];

  const filteredEvents = events.filter((event) => {
    const term = search.toLowerCase();
    const titleMatch = event.title.toLowerCase().includes(term);
    const arTitleMatch = (event.arabicTitle || "").toLowerCase().includes(term);
    const descMatch = (event.description || "").toLowerCase().includes(term);
    const arDescMatch = (event.arabicDescription || "").toLowerCase().includes(term);
    const locMatch = (event.location || "").toLowerCase().includes(term);
    const refMatch = (event.biblicalReferences || []).some((r) =>
      matchesBiblicalSearch(r, term)
    );
    return titleMatch || arTitleMatch || descMatch || arDescMatch || locMatch || refMatch;
  });

  const getPersonName = (id?: string) => {
    if (!id) return null;
    const found = people.find((p) => p.id === id);
    if (!found) return id;
    return getPersonDisplayName(found, lang);
  };

  const handleOpenModal = (event: BiblicalEvent) => {
    setSelectedEvent(event);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (selectedEvent) {
      setEditForm(JSON.parse(JSON.stringify(selectedEvent)));
      setIsEditing(true);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    if (onUpdateEvent) {
      onUpdateEvent(editForm);
    }

    setSelectedEvent(editForm);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!selectedEvent) return;

    const dispTitle = getEventDisplayTitle(selectedEvent, lang);
    const confirmed = window.confirm(
      lang === "ar"
        ? `هل أنت متأكد من حذف حدث "${dispTitle}"؟`
        : `Are you sure you want to delete "${dispTitle}"?`
    );

    if (confirmed) {
      if (onDeleteEvent) {
        onDeleteEvent(selectedEvent.id);
      }
      setSelectedEvent(null);
    }
  };
const regions = Array.from(new Set(OT_LOCATIONS.map((c) => c.region)));

  return (
    <div className="space-y-6 animate-fadeIn" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#800020]/15 via-[#FBF8EF] to-[#1A365D]/15 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#1A365D]/25 shadow-md">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
            {t.eventsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E4E] dark:text-[#A99F8D] mt-1">
            {t.eventsSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#A01128] text-white font-bold text-sm shadow-md hover:brightness-110 transition-all hover:scale-105"
        >
          <Plus size={16} />
          <span>{t.addEvent}</span>
        </button>
      </div>

      {/* Bilingual Search */}
      <div className="relative">
        <div className={`absolute top-1/2 -translate-y-1/2 ${lang === "ar" ? "right-4" : "left-4"} text-[#D4AF37]`}>
          <Search size={18} />
        </div>
        <input
          type="search"
          placeholder={lang === "ar" ? "ابحث عن الأحداث الكتابية بالعربية أو الإنجليزية..." : "Search events by title, description, or location..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full py-3.5 rounded-xl border-2 border-[#D4AF37]/50 bg-white/80 dark:bg-[#1C1A17] shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${
            lang === "ar" ? "pr-11 pl-4 font-amiri text-base" : "pl-11 pr-4"
          }`}
        />
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((event) => {
          const displayTitle = getEventDisplayTitle(event, lang);
          const displayDesc = getEventDisplayDescription(event, lang);
          const formattedYear = formatYearDisplay(event.date?.year, lang);
          const secondaryTitle = lang === "ar" ? event.title : event.arabicTitle;

          return (
            <div
              key={event.id}
              onClick={() => handleOpenModal(event)}
              className="cursor-pointer relative flex flex-col justify-between p-5 rounded-2xl border-2 border-[#D4AF37]/50 bg-white/70 dark:bg-[#1C1A17] shadow-sm hover:shadow-lg hover:border-[#D4AF37] transition-all transform hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#D4AF37]/30">
                  <div>
                    <h3 className="text-lg font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                      {displayTitle}
                    </h3>
                    {secondaryTitle && (
                      <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] mt-0.5">
                        {secondaryTitle}
                      </p>
                    )}
                  </div>

                  {event.date?.year !== undefined ? (
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                      {formattedYear}
                    </span>
                  ) : event.anchorPersonId ? (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#1A365D]/40 bg-[#1A365D]/10 text-[#1A365D] dark:text-[#90CDF4]">
                      {getPersonName(event.anchorPersonId)} ({event.anchorAge} {t.years})
                    </span>
                  ) : null}
                </div>

                {event.location && (
                  <div className="flex items-center gap-1.5 text-xs text-[#6B5E4E] dark:text-[#A99F8D]">
                    <MapPin size={13} className="text-[#800020] dark:text-[#D4AF37]" />
                    <span>{event.location}</span>
                  </div>
                )}

                {displayDesc && (
                  <p className="text-xs text-[#4A3E31] dark:text-[#C5BBAE] leading-relaxed line-clamp-3">
                    {displayDesc}
                  </p>
                )}
              </div>

              {event.biblicalReferences && event.biblicalReferences.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center gap-1.5 text-[11px] text-[#8C6F12] dark:text-[#F3E5AB] font-semibold">
                  <BookOpen size={12} />
                  <span>
                    {localizeBiblicalReferences(event.biblicalReferences, lang).join(
                      lang === "ar" ? "، " : ", "
                    )}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <AddEventModal
          existingPeople={people}
          onAddEvent={onAddEvent}
          onClose={() => setIsAddModalOpen(false)}
          lang={lang}
        />
      )}

      {/* View / Edit Event Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-[#FBF8EF] dark:bg-[#1C1A17] text-[#2D2721] dark:text-[#E6E0D4] border-2 border-[#D4AF37] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#D4AF37]/40 bg-gradient-to-r from-[#800020]/15 via-[#D4AF37]/15 to-[#1A365D]/10">
              <div className="flex items-center gap-3">
                <CopticCross size={28} />
                <h3 className="text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                  {isEditing ? t.editEvent : getEventDisplayTitle(selectedEvent, lang)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg text-[#6B5E4E] dark:text-[#A99F8D] hover:bg-[#D4AF37]/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            {isEditing && editForm ? (
              <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                      {t.eventTitleEn} *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                      {t.eventTitleAr}
                    </label>
                    <input
                      type="text"
                      value={editForm.arabicTitle || ""}
                      onChange={(e) => setEditForm({ ...editForm, arabicTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm font-amiri"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                      {t.year} (e.g. -2000 for 2000 BC)
                    </label>
                    <input
                      type="number"
                      value={editForm.date?.year ?? ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          date: e.target.value !== "" ? { year: Number(e.target.value), precision: "exact" } : undefined,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                      {t.location}
                    </label>
                    <select
                      value={editForm.location || ""}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="">{lang === "ar" ? "— اختر موقعاً كتابياً —" : "— Select Location —"}</option>
                      {regions.map((region) => (
                        <optgroup key={region} label={region}>
                          {OT_LOCATIONS.filter((loc) => loc.region === region).map((city) => (
                            <option key={city.id} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                      {t.eventDescEn}
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                      {t.eventDescAr}
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.arabicDescription || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, arabicDescription: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm font-amiri"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#800020] dark:text-[#D4AF37]">
                    {t.references}
                  </label>
                  <input
                    type="text"
                    value={(editForm.biblicalReferences || []).join(", ")}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        biblicalReferences: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4AF37]/30">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-[#D4AF37]/50 text-sm font-semibold hover:bg-[#D4AF37]/15"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#A01128] text-white font-bold text-sm shadow-md hover:brightness-110"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                    {formatYearDisplay(selectedEvent.date?.year, lang)}
                  </span>
                  {selectedEvent.location && (
                    <span className="flex items-center gap-1 text-xs text-[#6B5E4E] dark:text-[#A99F8D]">
                      <MapPin size={14} className="text-[#800020] dark:text-[#D4AF37]" />
                      {selectedEvent.location}
                    </span>
                  )}
                </div>

                {getEventDisplayDescription(selectedEvent, lang) && (
                  <p className="text-sm leading-relaxed text-[#4A3E31] dark:text-[#C5BBAE] bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/25">
                    {getEventDisplayDescription(selectedEvent, lang)}
                  </p>
                )}

                {selectedEvent.biblicalReferences && selectedEvent.biblicalReferences.length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6F12] dark:text-[#F3E5AB]">
                    <BookOpen size={14} />
                    <span>
                      {localizeBiblicalReferences(selectedEvent.biblicalReferences, lang).join(
                        lang === "ar" ? "، " : ", "
                      )}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/30">
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
                  >
                    <Trash2 size={14} />
                    <span>{lang === "ar" ? "حذف الحدث" : "Delete Event"}</span>
                  </button>

                  <button
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-[#121110] text-xs font-bold shadow"
                  >
                    <Edit3 size={14} />
                    <span>{t.editEvent}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
