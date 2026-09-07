import { useState, useMemo } from "react";
import type { Person, BiblicalEvent, Language } from "../types/genealogy";
import {
  UI_TRANSLATIONS,
  getEventDisplayTitle,
  getEventDisplayDescription,
  formatYearDisplay,
} from "../utils/i18n";
import { MapPin, BookOpen, Edit3, X } from "lucide-react";
import { CopticCross } from "../components/Coptic/CopticCross";

type TimelineProps = {
  people: Person[];
  events: BiblicalEvent[];
  onUpdateEvent?: (updatedEvent: BiblicalEvent) => void;
  lang?: Language;
};

export default function Timeline({
  people,
  events,
  onUpdateEvent,
  lang = "en",
}: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<BiblicalEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const t = UI_TRANSLATIONS[lang];

  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const sorted = [...events].sort((a, b) => (a.date?.year ?? 0) - (b.date?.year ?? 0));

    if (!term) return sorted;

    return sorted.filter((evt) => {
      const matchTitle = evt.title.toLowerCase().includes(term);
      const matchArTitle = (evt.arabicTitle || "").toLowerCase().includes(term);
      const matchDesc = evt.description?.toLowerCase().includes(term) ?? false;
      const matchArDesc = evt.arabicDescription?.toLowerCase().includes(term) ?? false;
      const matchLocation = evt.location?.toLowerCase().includes(term) ?? false;
      const matchRef = (evt.biblicalReferences || []).some((r) =>
        r.toLowerCase().includes(term)
      );
      const matchPeople = (evt.personIds || []).some((id) => {
        const p = people.find((person) => person.id === id);
        return (
          p?.name.toLowerCase().includes(term) ||
          (p?.arabicName && p.arabicName.toLowerCase().includes(term))
        );
      });

      return (
        matchTitle ||
        matchArTitle ||
        matchDesc ||
        matchArDesc ||
        matchLocation ||
        matchRef ||
        matchPeople
      );
    });
  }, [events, people, searchTerm]);

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

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#800020]/15 via-[#FBF8EF] to-[#1A365D]/15 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#1A365D]/25 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <CopticCross size={26} />
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
              {t.navTimeline}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B5E4E] dark:text-[#A99F8D] mt-1">
            {lang === "ar"
              ? "التسلسل الزمني التاريخي لأحداث العهد القديم من الخليقة عبر العصور."
              : "Sacred vertical chronology tracking epochs, covenants, and historical milestones."}
          </p>
        </div>

        <div className="relative">
          <input
            type="search"
            placeholder={lang === "ar" ? "تصفية الأحداث بالاسم أو الشاهد..." : "Filter events by name, reference..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-xl border border-[#D4AF37]/60 bg-white dark:bg-[#121110] text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>
      </div>

      {/* Vertical Timeline Track */}
      <div className="relative border-s-2 border-[#D4AF37]/60 ms-6 sm:ms-44 ps-6 sm:ps-8 py-4 space-y-8">
        {filteredEvents.map((event) => {
          const displayTitle = getEventDisplayTitle(event, lang);
          const displayDesc = getEventDisplayDescription(event, lang);
          const formattedYear = formatYearDisplay(event.date?.year, lang);
          const secondaryTitle = lang === "ar" ? event.title : event.arabicTitle;

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Gold Rosette Node */}
              <div
                className={`absolute -start-[31px] sm:-start-[45px] top-1.5 w-6 h-6 rounded-full border-2 border-[#D4AF37] bg-white dark:bg-[#121110] flex items-center justify-center shadow-md group-hover:scale-125 transition-transform z-10`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#800020]" />
              </div>

              {/* Year Stamp Pill (Shown on start side with generous breathing room before the bullet) */}
              <div
                className={`sm:absolute sm:-start-52 sm:top-1 hidden sm:flex items-center justify-end w-36 pe-5`}
              >
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#800020] dark:text-[#F3E5AB] bg-[#D4AF37]/15 border border-[#D4AF37]/40 shadow-2xs font-mono tracking-tight whitespace-nowrap">
                  {formattedYear}
                </span>
              </div>

              {/* Event Card */}
              <div
                onClick={() => handleOpenModal(event)}
                className="cursor-pointer p-5 rounded-2xl border-2 border-[#D4AF37]/40 bg-white/70 dark:bg-[#1C1A17] shadow-sm hover:shadow-lg hover:border-[#D4AF37] transition-all space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                      {displayTitle}
                    </h3>
                    {secondaryTitle && (
                      <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D]">
                        {secondaryTitle}
                      </p>
                    )}
                  </div>

                  {/* Mobile Year Badge */}
                  <span className="sm:hidden px-2 py-0.5 rounded-full text-xs font-bold border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                    {formattedYear}
                  </span>
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

                {event.biblicalReferences && event.biblicalReferences.length > 0 && (
                  <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center gap-1.5 text-[11px] text-[#8C6F12] dark:text-[#F3E5AB] font-semibold">
                    <BookOpen size={12} />
                    <span>{event.biblicalReferences.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* View / Edit Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative w-full max-w-lg p-6 rounded-2xl bg-[#FBF8EF] dark:bg-[#1C1A17] border-2 border-[#D4AF37] shadow-2xl text-[#2D2721] dark:text-[#E6E0D4] space-y-4"
            onClick={(e) => e.stopPropagation()}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2">
                <CopticCross size={24} />
                <h3 className="text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                  {isEditing ? t.editEvent : getEventDisplayTitle(selectedEvent, lang)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg hover:bg-[#D4AF37]/20 text-[#6B5E4E]"
              >
                <X size={18} />
              </button>
            </div>

            {isEditing && editForm ? (
              <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#800020] dark:text-[#D4AF37]">
                    {t.eventTitleEn} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#800020] dark:text-[#D4AF37]">
                    {t.eventTitleAr}
                  </label>
                  <input
                    type="text"
                    value={editForm.arabicTitle || ""}
                    onChange={(e) => setEditForm({ ...editForm, arabicTitle: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] font-amiri"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#800020] dark:text-[#D4AF37]">
                    {t.eventDescEn}
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#800020] dark:text-[#D4AF37]">
                    {t.eventDescAr}
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.arabicDescription || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, arabicDescription: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] font-amiri"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 text-xs font-semibold"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#800020] to-[#A01128] text-white font-bold text-xs shadow"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full font-bold border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                    {formatYearDisplay(selectedEvent.date?.year, lang)}
                  </span>
                  {selectedEvent.location && (
                    <span className="flex items-center gap-1 text-[#6B5E4E] dark:text-[#A99F8D]">
                      <MapPin size={12} />
                      {selectedEvent.location}
                    </span>
                  )}
                </div>

                {getEventDisplayDescription(selectedEvent, lang) && (
                  <p className="leading-relaxed bg-[#D4AF37]/10 p-3 rounded-xl border border-[#D4AF37]/20">
                    {getEventDisplayDescription(selectedEvent, lang)}
                  </p>
                )}

                {selectedEvent.biblicalReferences && selectedEvent.biblicalReferences.length > 0 && (
                  <div className="flex items-center gap-1.5 font-semibold text-[#8C6F12] dark:text-[#F3E5AB]">
                    <BookOpen size={13} />
                    <span>{selectedEvent.biblicalReferences.join(", ")}</span>
                  </div>
                )}

                <div className="flex justify-end pt-3 border-t border-[#D4AF37]/30">
                  <button
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-[#121110] font-bold shadow text-xs"
                  >
                    <Edit3 size={13} />
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
