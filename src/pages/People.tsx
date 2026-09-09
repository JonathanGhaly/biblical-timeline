import { useState } from "react";
import AddPersonModal from "../components/Person/AddPersonModal";
import EditPersonModal from "../components/Person/EditPersonModal";
import type { Person, Language } from "../types/genealogy";
import {
  UI_TRANSLATIONS,
  getPersonDisplayName,
  getPersonDisplayNotes,
  localizeBiblicalReferences,
  matchesBiblicalSearch,
} from "../utils/i18n";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Calendar,
  Heart,
  MapPin,
  Clock,
} from "lucide-react";

type PeopleProps = {
  people: Person[];
  onAddPerson: (newPerson: Person) => void;
  onUpdatePerson: (updatedPerson: Person) => void;
  onDeletePerson?: (personId: string) => void;
  lang?: Language;
};

export default function People({
  people,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
  lang = "en",
}: PeopleProps) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const t = UI_TRANSLATIONS[lang];

  const filteredPeople = people.filter((person) => {
    const term = search.toLowerCase();
    const nameMatch = person.name.toLowerCase().includes(term);
    const arabicMatch = (person.arabicName || "").toLowerCase().includes(term);
    const notesMatch = (person.notes || "").toLowerCase().includes(term);
    const arNotesMatch = (person.arabicNotes || "").toLowerCase().includes(term);
    const refMatch = (person.biblicalReferences || []).some((r) =>
      matchesBiblicalSearch(r, term)
    );
    return nameMatch || arabicMatch || notesMatch || arNotesMatch || refMatch;
  });

  const handleDelete = (person: Person) => {
    const dispName = getPersonDisplayName(person, lang);
    const message =
      lang === "ar"
        ? `هل أنت متأكد من حذف ${dispName} من قاعدة البيانات؟`
        : `Are you sure you want to delete ${dispName}?`;

    if (window.confirm(message) && onDeletePerson) {
      onDeletePerson(person.id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#800020]/15 via-[#FBF8EF] to-[#D4AF37]/15 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#800020]/25 shadow-md">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
            {t.peopleTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E4E] dark:text-[#A99F8D] mt-1">
            {t.peopleSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#A01128] text-white font-bold text-sm shadow-md hover:brightness-110 transition-all hover:scale-105"
        >
          <Plus size={16} />
          <span>{t.addPerson}</span>
        </button>
      </div>

      {/* Bilingual Search Bar */}
      <div className="relative">
        <div className={`absolute top-1/2 -translate-y-1/2 ${lang === "ar" ? "right-4" : "left-4"} text-[#D4AF37]`}>
          <Search size={18} />
        </div>
        <input
          type="search"
          placeholder={t.searchPeoplePlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full py-3.5 rounded-xl border-2 border-[#D4AF37]/50 bg-white/80 dark:bg-[#1C1A17] shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${
            lang === "ar" ? "pr-11 pl-4 font-amiri text-base" : "pl-11 pr-4"
          }`}
        />
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPeople.map((person, index) => {
          const displayName = getPersonDisplayName(person, lang);
          const displayNotes = getPersonDisplayNotes(person, lang);
          const secondaryName =
            lang === "ar"
              ? person.name
              : person.arabicName;

          return (
            <div
              key={`person_${person.id}_${index}`}
              className="relative flex flex-col justify-between p-5 rounded-2xl border-2 border-[#D4AF37]/50 bg-white/70 dark:bg-[#1C1A17] shadow-sm hover:shadow-lg hover:border-[#D4AF37] transition-all transform hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                {/* Person Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#D4AF37]/30">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                        {displayName}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          person.gender === "male"
                            ? "border-blue-300 bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                            : "border-pink-300 bg-pink-50 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300 dark:border-pink-800"
                        }`}
                      >
                        {person.gender === "male" ? t.male : t.female}
                      </span>
                    </div>

                    {secondaryName && (
                      <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] font-medium mt-0.5">
                        {secondaryName}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setEditingPerson(person)}
                      className="p-1.5 rounded-lg border border-[#D4AF37]/50 text-[#800020] dark:text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-colors"
                      title={t.editPerson}
                    >
                      <Edit2 size={14} />
                    </button>
                    {onDeletePerson && (
                      <button
                        onClick={() => handleDelete(person)}
                        className="p-1.5 rounded-lg border border-rose-300/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title={t.deletePerson}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-1.5 text-xs text-[#4A3E31] dark:text-[#C5BBAE]">
                  {person.yearsLived && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#8C6F12] shrink-0" />
                      <span>
                        <strong>{t.lifespan}:</strong> {person.yearsLived} {t.years}
                      </span>
                    </div>
                  )}

                  {person.fatherAgeAtBirth !== undefined && person.fatherAgeAtBirth > 0 && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#8C6F12] shrink-0" />
                      <span>
                        <strong>{t.anchorAgeLabel}:</strong> {person.fatherAgeAtBirth} {t.years}
                      </span>
                    </div>
                  )}

                  {person.placeOfBirth && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#8C6F12] shrink-0" />
                      <span>
                        <strong>{t.placeOfBirthLabel}:</strong> {person.placeOfBirth}
                      </span>
                    </div>
                  )}

                  {person.husbandMarriageAge && (
                    <div className="flex items-center gap-2">
                      <Heart size={14} className="text-[#800020] shrink-0" />
                      <span>
                        <strong>{t.marriedAt}:</strong> {person.husbandMarriageAge} {t.years}
                      </span>
                    </div>
                  )}

                  {displayNotes && (
                    <p className="mt-2 text-xs italic text-[#6B5E4E] dark:text-[#A99F8D] leading-relaxed bg-[#D4AF37]/5 p-2 rounded-lg border border-[#D4AF37]/20">
                      {displayNotes}
                    </p>
                  )}
                </div>
              </div>

              {/* Biblical References Tag */}
              {person.biblicalReferences && person.biblicalReferences.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center gap-1.5 text-[11px] text-[#8C6F12] dark:text-[#F3E5AB]">
                  <BookOpen size={12} />
                  <span className="font-semibold">
                    {localizeBiblicalReferences(person.biblicalReferences, lang).join(
                      lang === "ar" ? "، " : ", "
                    )}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isAddModalOpen && (
        <AddPersonModal
          existingPeople={people}
          onAddPerson={onAddPerson}
          onClose={() => setIsAddModalOpen(false)}
          lang={lang}
        />
      )}

      {editingPerson && (
        <EditPersonModal
          person={editingPerson}
          existingPeople={people}
          onSavePerson={onUpdatePerson}
          onClose={() => setEditingPerson(null)}
          lang={lang}
        />
      )}
    </div>
  );
}
