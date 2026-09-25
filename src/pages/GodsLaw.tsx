import { useState, useMemo } from "react";
import {
  Scroll,
  Plus,
  Search,
  BookOpen,
  Users,
  MapPin,
  LayoutGrid,
  List,
  RotateCcw,
  Edit3,
  Trash2,
  ExternalLink,
} from "lucide-react";
import type { BiblicalLaw, Person, Language, LawCategory } from "../types/genealogy";
import { UI_TRANSLATIONS } from "../utils/i18n";
import { CopticCross } from "../components/Coptic/CopticCross";
import { AddLawModal } from "../components/Law/AddLawModal";
import { LawDetailsModal } from "../components/Law/LawDetailsModal";

interface GodsLawProps {
  laws: BiblicalLaw[];
  people: Person[];
  onAddLaw: (newLaw: BiblicalLaw) => void;
  onUpdateLaw: (updatedLaw: BiblicalLaw) => void;
  onDeleteLaw: (lawId: string) => void;
  lang: Language;
}

export default function GodsLaw({
  laws,
  people,
  onAddLaw,
  onUpdateLaw,
  onDeleteLaw,
  lang,
}: GodsLawProps) {
  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLaw, setEditingLaw] = useState<BiblicalLaw | null>(null);
  const [selectedLawForDetails, setSelectedLawForDetails] = useState<BiblicalLaw | null>(null);

  // Available unique recipients for filter
  const availableRecipients = useMemo(() => {
    const set = new Set<string>();
    laws.forEach((law) => {
      const recipient = lang === "ar" && law.arabicSpokenTo ? law.arabicSpokenTo : law.spokenTo;
      if (recipient) set.add(recipient);
    });
    return Array.from(set).sort();
  }, [laws, lang]);

  // Filtered laws list
  const filteredLaws = useMemo(() => {
    const term = search.trim().toLowerCase();

    return laws.filter((law) => {
      // Category filter
      if (selectedCategory !== "all" && law.category !== selectedCategory) {
        return false;
      }

      // Recipient filter
      if (selectedRecipient !== "all") {
        const rName = lang === "ar" && law.arabicSpokenTo ? law.arabicSpokenTo : law.spokenTo;
        if (rName !== selectedRecipient && law.spokenTo !== selectedRecipient) {
          return false;
        }
      }

      // Search term
      if (!term) return true;

      const titleEn = (law.title || "").toLowerCase();
      const titleAr = (law.arabicTitle || "").toLowerCase();
      const recipientEn = (law.spokenTo || "").toLowerCase();
      const recipientAr = (law.arabicSpokenTo || "").toLowerCase();
      const spokenByEn = (law.spokenBy || "").toLowerCase();
      const spokenByAr = (law.arabicSpokenBy || "").toLowerCase();
      const scripture = (law.scriptureReference || "").toLowerCase();
      const textEn = (law.commandmentTextEn || "").toLowerCase();
      const textAr = (law.commandmentTextAr || "").toLowerCase();
      const summaryEn = (law.summaryEn || "").toLowerCase();
      const summaryAr = (law.summaryAr || "").toLowerCase();
      const location = (law.location || "").toLowerCase();
      const principles = (law.keyPrinciples || []).join(" ").toLowerCase();

      return (
        titleEn.includes(term) ||
        titleAr.includes(term) ||
        recipientEn.includes(term) ||
        recipientAr.includes(term) ||
        spokenByEn.includes(term) ||
        spokenByAr.includes(term) ||
        scripture.includes(term) ||
        textEn.includes(term) ||
        textAr.includes(term) ||
        summaryEn.includes(term) ||
        summaryAr.includes(term) ||
        location.includes(term) ||
        principles.includes(term)
      );
    });
  }, [laws, selectedCategory, selectedRecipient, search, lang]);

  // Statistics counters
  const stats = useMemo(() => {
    const total = laws.length;
    const tenCmds = laws.filter(
      (l) => l.category === "moral" || l.id.includes("ten") || (l.title || "").toLowerCase().includes("commandment")
    ).length;
    const covenants = laws.filter((l) => l.category === "covenant").length;
    const holinessMoral = laws.filter(
      (l) => l.category === "holiness_ethics" || l.category === "moral"
    ).length;
    const civilCeremonial = laws.filter(
      (l) => l.category === "civil_judicial" || l.category === "ceremonial_worship" || l.category === "festivals_sabbath"
    ).length;

    return { total, tenCmds, covenants, holinessMoral, civilCeremonial };
  }, [laws]);

  const getCategoryBadge = (category: LawCategory) => {
    switch (category) {
      case "moral":
        return {
          label: t.catMoral,
          color: "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/60",
        };
      case "covenant":
        return {
          label: t.catCovenant,
          color: "bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700/60",
        };
      case "civil_judicial":
        return {
          label: t.catCivil,
          color: "bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700/60",
        };
      case "ceremonial_worship":
        return {
          label: t.catCeremonial,
          color: "bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700/60",
        };
      case "festivals_sabbath":
        return {
          label: t.catSabbath,
          color: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/60",
        };
      case "holiness_ethics":
        return {
          label: t.catHoliness,
          color: "bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700/60",
        };
      default:
        return {
          label: t.catOther,
          color: "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-200 border-stone-300 dark:border-stone-700",
        };
    }
  };

  const handleOpenEdit = (law: BiblicalLaw, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingLaw(law);
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingLaw(null);
    setIsAddModalOpen(true);
  };

  const hasActiveFilters =
    search.trim() !== "" || selectedCategory !== "all" || selectedRecipient !== "all";

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedRecipient("all");
  };

  return (
    <div className="space-y-6 pb-12" dir={isRTL ? "rtl" : "ltr"}>
      {/* Grand Top Banner with Coptic Motif */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#800020] via-[#910027] to-[#800020] p-4 sm:p-6 lg:p-8 text-[#F3E5AB] shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <CopticCross size={180} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-xl bg-white/10 border border-[#D4AF37]/50 shadow-inner shrink-0">
                <Scroll size={24} className="text-[#D4AF37]" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-cinzel tracking-wide text-white drop-shadow-sm">
                {t.godsLawTitle}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#F3E5AB]/90 max-w-2xl font-serif leading-relaxed">
              {t.godsLawSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <button
              type="button"
              id="btn-add-gods-law"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#D4AF37] hover:bg-[#E5C158] text-[#800020] shadow-lg hover:shadow-xl transition-all scale-100 hover:scale-[1.02] cursor-pointer"
            >
              <Plus size={16} />
              <span>{t.addLaw}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Statistics Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-6 pt-5 border-t border-[#D4AF37]/30 text-xs">
          <div className="p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-[#D4AF37]/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3E5AB]/80 block">
              {t.totalLawsCount}
            </span>
            <span className="text-xl sm:text-2xl font-black font-cinzel text-white">
              {stats.total}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-[#D4AF37]/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3E5AB]/80 block">
              {t.tenCommandmentsShort}
            </span>
            <span className="text-xl sm:text-2xl font-black font-cinzel text-[#D4AF37]">
              {stats.tenCmds}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-[#D4AF37]/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3E5AB]/80 block">
              {t.covenantsShort}
            </span>
            <span className="text-xl sm:text-2xl font-black font-cinzel text-white">
              {stats.covenants}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-[#D4AF37]/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3E5AB]/80 block">
              {t.civilCeremonialShort}
            </span>
            <span className="text-xl sm:text-2xl font-black font-cinzel text-white">
              {stats.civilCeremonial}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#181613] border border-[#D4AF37]/40 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Keyword search */}
          <div className="relative flex-1">
            <Search
              size={17}
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRTL ? "right-3.5" : "left-3.5"
              } text-[#800020] dark:text-[#D4AF37] pointer-events-none`}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchLawsPlaceholder}
              className={`w-full py-2.5 text-xs sm:text-sm rounded-xl border border-[#D4AF37]/50 bg-white/80 dark:bg-[#121110] text-[#2D2721] dark:text-[#E6E0D4] focus:ring-2 focus:ring-[#800020] focus:outline-none shadow-sm ${
                isRTL ? "pr-10 pl-3" : "pl-10 pr-3"
              }`}
            />
          </div>

          {/* Recipient Filter Dropdown & View Mode Switch */}
          <div className="flex items-center gap-2">
            <select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              className="py-2.5 px-3 text-xs rounded-xl border border-[#D4AF37]/50 bg-white/80 dark:bg-[#121110] text-[#2D2721] dark:text-[#E6E0D4] focus:ring-1 focus:ring-[#800020] focus:outline-none"
            >
              <option value="all">{t.allRecipients}</option>
              {availableRecipients.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/80 dark:bg-[#121110] border border-[#D4AF37]/50 rounded-xl p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#800020] text-[#F3E5AB] shadow-sm"
                    : "text-[#7A6E5E] dark:text-[#9A8E7E] hover:text-[#800020]"
                }`}
                title={t.viewModeGrid}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#800020] text-[#F3E5AB] shadow-sm"
                    : "text-[#7A6E5E] dark:text-[#9A8E7E] hover:text-[#800020]"
                }`}
                title={t.viewModeList}
              >
                <List size={16} />
              </button>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl bg-stone-200 dark:bg-stone-800 text-[#5A4D3E] dark:text-[#C5BBAE] hover:bg-stone-300 transition-colors cursor-pointer"
                title={t.clearLawFilters}
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">{t.clearLawFilters}</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
              selectedCategory === "all"
                ? "bg-[#800020] text-[#F3E5AB] border-[#800020] shadow-sm"
                : "bg-white/70 dark:bg-[#121110] border-[#D4AF37]/40 text-[#6B5E4E] dark:text-[#A99F8D] hover:border-[#D4AF37]"
            }`}
          >
            {t.allCategories} ({laws.length})
          </button>

          {[
            { id: "moral", label: t.catMoral },
            { id: "covenant", label: t.catCovenant },
            { id: "civil_judicial", label: t.catCivil },
            { id: "ceremonial_worship", label: t.catCeremonial },
            { id: "festivals_sabbath", label: t.catSabbath },
            { id: "holiness_ethics", label: t.catHoliness },
          ].map((cat) => {
            const count = laws.filter((l) => l.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? "all" : cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? "bg-[#800020] text-[#F3E5AB] border-[#800020] shadow-sm font-bold"
                    : "bg-white/70 dark:bg-[#121110] border-[#D4AF37]/40 text-[#6B5E4E] dark:text-[#A99F8D] hover:border-[#D4AF37]"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between px-1 text-xs text-[#7A6E5E] dark:text-[#A99F8D]">
        <span>
          {t.showingCount} <strong className="text-[#800020] dark:text-[#D4AF37] font-bold">{filteredLaws.length}</strong> {t.ofEvents} {laws.length} {t.lawsWord}
        </span>
      </div>

      {/* Empty State */}
      {filteredLaws.length === 0 && (
        <div className="text-center py-16 px-4 bg-[#FAF6EE]/60 dark:bg-[#181613]/50 rounded-2xl border-2 border-dashed border-[#D4AF37]/40 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#800020]/10 dark:bg-[#800020]/30 text-[#800020] dark:text-[#D4AF37] flex items-center justify-center">
            <Scroll size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold font-cinzel text-[#800020] dark:text-[#D4AF37]">
              {t.noLawsFound}
            </h3>
            <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] max-w-md mx-auto">
              {lang === "ar"
                ? "يمكنك تعديل كلمات البحث أو مسح التصفيات، أو إضافة شريعة ووصية إلهية جديدة."
                : "Try adjusting your search terms or filters, or add a new divine law to the codex."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-[#2D2721] dark:text-[#E6E0D4] transition"
              >
                {t.clearLawFilters}
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#800020] text-[#F3E5AB] hover:opacity-95 shadow transition"
            >
              <Plus size={14} />
              <span>{t.addLaw}</span>
            </button>
          </div>
        </div>
      )}

      {/* GRID VIEW: Illuminated Manuscript Cards */}
      {viewMode === "grid" && filteredLaws.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLaws.map((law) => {
            const badge = getCategoryBadge(law.category);
            const title =
              lang === "ar" && law.arabicTitle ? law.arabicTitle : law.title;
            const recipient =
              lang === "ar" && law.arabicSpokenTo ? law.arabicSpokenTo : law.spokenTo;
            const scriptureWords =
              lang === "ar"
                ? law.commandmentTextAr || law.commandmentTextEn
                : law.commandmentTextEn || law.commandmentTextAr;

            return (
              <div
                key={law.id}
                onClick={() => setSelectedLawForDetails(law)}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#181613] border border-[#D4AF37]/50 hover:border-[#800020] dark:hover:border-[#D4AF37] hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden text-[#2D2721] dark:text-[#E6E0D4]"
              >
                {/* Decorative Coptic border accent */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-3">
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${badge.color}`}
                    >
                      {badge.label}
                    </span>

                    <div className="flex items-center gap-1">
                      {law.biblicalYearBC && (
                        <span className="text-[10px] font-mono font-bold text-[#8C6F12] dark:text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded-full">
                          ~{law.biblicalYearBC} {t.bc}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Scripture */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB] group-hover:text-[#9E0028] transition-colors leading-snug">
                      {title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#8C6F12] dark:text-[#D4AF37] mt-1">
                      <BookOpen size={12} />
                      <span>{law.scriptureReference}</span>
                    </div>
                  </div>

                  {/* Spoken To & Setting */}
                  <div className="p-2.5 rounded-xl bg-[#F3EDE0]/60 dark:bg-[#201D19] border border-[#D4AF37]/25 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[#5A4D3E] dark:text-[#C5BBAE]">
                      <Users size={12} className="text-[#800020] dark:text-[#D4AF37] shrink-0" />
                      <span className="font-bold text-[#800020] dark:text-[#F3E5AB]">
                        {t.spokenTo}:
                      </span>
                      <span className="truncate">{recipient}</span>
                    </div>

                    {law.location && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#7A6E5E] dark:text-[#9A8E7E]">
                        <MapPin size={11} className="shrink-0" />
                        <span className="truncate">{lang === "ar" && law.arabicLocation ? law.arabicLocation : law.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Excerpt of God's Spoken Words */}
                  <div className="relative p-3 rounded-xl bg-white/70 dark:bg-[#121110] border border-[#D4AF37]/30 text-xs font-serif italic line-clamp-3 text-[#3A3228] dark:text-[#D5CCBD] leading-relaxed">
                    « {scriptureWords} »
                  </div>

                  {/* Key Principles Pills */}
                  {law.keyPrinciples && law.keyPrinciples.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {law.keyPrinciples.slice(0, 3).map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] rounded-md bg-amber-50 dark:bg-amber-950/30 text-[#6B5E4E] dark:text-[#C5BBAE] border border-[#D4AF37]/20 truncate max-w-[120px]"
                        >
                          ✦ {p}
                        </span>
                      ))}
                      {law.keyPrinciples.length > 3 && (
                        <span className="text-[10px] text-[#8C6F12] dark:text-[#A99F8D] font-mono self-center">
                          +{law.keyPrinciples.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#D4AF37]/30">
                  <span className="text-xs font-bold text-[#800020] dark:text-[#D4AF37] group-hover:underline flex items-center gap-1">
                    <span>{t.viewLawDetails}</span>
                    <ExternalLink size={12} />
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(law, e)}
                      className="p-1.5 rounded-lg text-[#5A4D3E] dark:text-[#C5BBAE] hover:text-[#800020] dark:hover:text-[#F3E5AB] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title={t.editLaw}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(t.confirmDeleteLaw)) {
                          onDeleteLaw(law.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title={t.delete}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW: Compact Table / Rows */}
      {viewMode === "list" && filteredLaws.length > 0 && (
        <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#FAF6EE] dark:bg-[#181613] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D2721] dark:text-[#E6E0D4]" dir={isRTL ? "rtl" : "ltr"}>
              <thead className="bg-[#F3EDE0] dark:bg-[#201D19] border-b border-[#D4AF37]/40 text-[#800020] dark:text-[#D4AF37] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">{t.lawTitleEn}</th>
                  <th className="py-3 px-3">{t.spokenTo}</th>
                  <th className="py-3 px-3">{t.lawCategory}</th>
                  <th className="py-3 px-3">{t.scriptureReference}</th>
                  <th className="py-3 px-3">{t.year}</th>
                  <th className="py-3 px-4 text-center">{t.edit}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/20">
                {filteredLaws.map((law) => {
                  const badge = getCategoryBadge(law.category);
                  const title =
                    lang === "ar" && law.arabicTitle ? law.arabicTitle : law.title;
                  const recipient =
                    lang === "ar" && law.arabicSpokenTo ? law.arabicSpokenTo : law.spokenTo;

                  return (
                    <tr
                      key={law.id}
                      onClick={() => setSelectedLawForDetails(law)}
                      className="hover:bg-[#800020]/5 dark:hover:bg-[#800020]/15 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-bold text-[#800020] dark:text-[#F3E5AB]">
                        {title}
                      </td>
                      <td className="py-3 px-3 font-medium">
                        {recipient}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#8C6F12] dark:text-[#D4AF37]">
                        {law.scriptureReference}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {law.biblicalYearBC ? `~${law.biblicalYearBC} ${t.bc}` : "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(law)}
                            className="p-1.5 rounded-lg text-[#5A4D3E] dark:text-[#C5BBAE] hover:text-[#800020] transition"
                            title={t.editLaw}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(t.confirmDeleteLaw)) {
                                onDeleteLaw(law.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 transition"
                            title={t.delete}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Law Modal */}
      <AddLawModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(lawToSave) => {
          if (editingLaw) {
            onUpdateLaw(lawToSave);
          } else {
            onAddLaw(lawToSave);
          }
        }}
        initialLaw={editingLaw}
        people={people}
        lang={lang}
      />

      {/* Law Details Modal */}
      <LawDetailsModal
        law={selectedLawForDetails}
        onClose={() => setSelectedLawForDetails(null)}
        onEdit={(law) => handleOpenEdit(law)}
        onDelete={(lawId) => onDeleteLaw(lawId)}
        people={people}
        lang={lang}
      />
    </div>
  );
}
