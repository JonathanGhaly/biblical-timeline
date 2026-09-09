import React from "react";
import {
  Layers,
  List,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Search,
  X,
  Users,
  Heart,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import type { Language } from "../../types/genealogy";
import { UI_TRANSLATIONS } from "../../utils/i18n";
import {
  BIBLICAL_ERAS,
  type EraId,
  type TimelineViewMode,
} from "./timelineUtils";

interface TimelineControlsProps {
  lang: Language;
  viewMode: TimelineViewMode;
  onViewModeChange: (mode: TimelineViewMode) => void;
  selectedEra: EraId;
  onEraChange: (era: EraId) => void;
  zoomLevel: number; // 1 = fit, 1.5 = comfortable, 2.5 = detailed
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onResetZoom: () => void;
  isFitToScreen: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showFigures: boolean;
  onToggleFigures: () => void;
  showMarriages: boolean;
  onToggleMarriages: () => void;
  showEvents: boolean;
  onToggleEvents: () => void;
  counts: {
    figures: number;
    marriages: number;
    events: number;
    matchedFigures?: number;
  };
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  lang,
  viewMode,
  onViewModeChange,
  selectedEra,
  onEraChange,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onResetZoom,
  isFitToScreen,
  searchTerm,
  onSearchChange,
  showFigures,
  onToggleFigures,
  showMarriages,
  onToggleMarriages,
  showEvents,
  onToggleEvents,
  counts,
}) => {
  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  return (
    <div className="space-y-3 bg-white/85 dark:bg-[#1C1A17]/85 backdrop-blur-md p-4 rounded-2xl border-2 border-[#D4AF37]/50 shadow-sm">
      {/* Top Row: Search, View Mode & Zoom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search
            size={16}
            className={`absolute top-1/2 -translate-y-1/2 ${
              isRTL ? "right-3 text-right" : "left-3 text-left"
            } text-[#800020] dark:text-[#D4AF37] pointer-events-none`}
          />
          <input
            type="search"
            id="timeline-search-input"
            placeholder={t.searchPeoplePlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full py-1.5 rounded-xl border border-[#D4AF37]/60 bg-[#FBF8EF] dark:bg-[#121110] text-xs sm:text-sm text-[#2D2721] dark:text-[#E6E0D4] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
              isRTL ? "pr-9 pl-8" : "pl-9 pr-8"
            }`}
          />
          {searchTerm && (
            <button
              id="clear-timeline-search-btn"
              onClick={() => onSearchChange("")}
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRTL ? "left-2.5" : "right-2.5"
              } p-0.5 rounded-full hover:bg-[#D4AF37]/20 text-[#6B5E4E]`}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* View Mode Switcher (Compact Multi-Track vs Expanded Rows) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#FBF8EF] dark:bg-[#121110] border border-[#D4AF37]/40">
          <button
            id="view-mode-compact-btn"
            onClick={() => onViewModeChange("compact")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "compact"
                ? "bg-gradient-to-r from-[#800020] to-[#991B1B] text-[#F3E5AB] shadow-sm"
                : "text-[#6B5E4E] dark:text-[#A99F8D] hover:text-[#800020] dark:hover:text-[#F3E5AB]"
            }`}
            title={t.compactLanes}
          >
            <Layers size={14} />
            <span className="hidden sm:inline">{t.compactLanes}</span>
          </button>
          <button
            id="view-mode-expanded-btn"
            onClick={() => onViewModeChange("expanded")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "expanded"
                ? "bg-gradient-to-r from-[#800020] to-[#991B1B] text-[#F3E5AB] shadow-sm"
                : "text-[#6B5E4E] dark:text-[#A99F8D] hover:text-[#800020] dark:hover:text-[#F3E5AB]"
            }`}
            title={t.expandedRows}
          >
            <List size={14} />
            <span className="hidden sm:inline">{t.expandedRows}</span>
          </button>
        </div>

        {/* Zoom & Fit to Screen Controls */}
        <div className="flex items-center gap-1.5">
          <button
            id="zoom-fit-screen-btn"
            onClick={onFitToScreen}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isFitToScreen
                ? "bg-[#D4AF37] text-[#121110] border-[#8C6F12] shadow-sm font-extrabold"
                : "bg-[#FBF8EF] dark:bg-[#121110] border-[#D4AF37]/40 text-[#800020] dark:text-[#F3E5AB] hover:bg-[#D4AF37]/15"
            }`}
            title={t.fitToScreen}
          >
            <Maximize2 size={13} />
            <span>{t.fitToScreen}</span>
          </button>

          <div className="flex items-center bg-[#FBF8EF] dark:bg-[#121110] rounded-xl border border-[#D4AF37]/40 p-0.5">
            <button
              id="zoom-out-btn"
              onClick={onZoomOut}
              className="p-1.5 rounded-lg hover:bg-[#D4AF37]/20 text-[#800020] dark:text-[#F3E5AB] transition-colors"
              title={t.zoomOut}
            >
              <ZoomOut size={14} />
            </button>
            <span className="px-2 text-[11px] font-mono font-bold text-[#800020] dark:text-[#D4AF37] select-none">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              id="zoom-in-btn"
              onClick={onZoomIn}
              className="p-1.5 rounded-lg hover:bg-[#D4AF37]/20 text-[#800020] dark:text-[#F3E5AB] transition-colors"
              title={t.zoomIn}
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <button
            id="reset-zoom-btn"
            onClick={onResetZoom}
            className="p-1.5 rounded-xl border border-[#D4AF37]/40 bg-[#FBF8EF] dark:bg-[#121110] text-[#6B5E4E] dark:text-[#A99F8D] hover:text-[#800020] dark:hover:text-[#F3E5AB] transition-colors"
            title={t.resetZoom}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Middle Row: Era Quick-Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#D4AF37]/20">
        <span className="text-[11px] font-bold text-[#800020] dark:text-[#D4AF37] uppercase tracking-wider me-1">
          {t.filterByEra}:
        </span>
        {BIBLICAL_ERAS.map((era) => {
          const isActive = selectedEra === era.id;
          const label = (t as any)[era.labelKey] || era.id;

          return (
            <button
              key={era.id}
              id={`era-filter-${era.id}-btn`}
              onClick={() => onEraChange(era.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#800020] text-[#F3E5AB] border border-[#D4AF37] shadow-sm"
                  : "bg-[#FBF8EF] dark:bg-[#121110] border border-[#D4AF37]/30 text-[#6B5E4E] dark:text-[#A99F8D] hover:border-[#D4AF37] hover:text-[#800020] dark:hover:text-[#F3E5AB]"
              }`}
              title={isRTL ? era.descriptionAr : era.descriptionEn}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Layer Toggles (Figures, Marriages, Events) & Counts */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#D4AF37]/20 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Figures */}
          <button
            id="toggle-figures-layer-btn"
            onClick={onToggleFigures}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all border ${
              showFigures
                ? "bg-[#800020]/15 text-[#800020] dark:text-[#F3E5AB] border-[#800020]/40 dark:border-[#D4AF37]/40"
                : "bg-transparent text-[#9CA3AF] border-transparent opacity-60 line-through"
            }`}
          >
            <Users size={13} />
            <span>{t.toggleFigures}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#800020] text-[#F3E5AB]">
              {counts.figures}
            </span>
          </button>

          {/* Toggle Marriages */}
          <button
            id="toggle-marriages-layer-btn"
            onClick={onToggleMarriages}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all border ${
              showMarriages
                ? "bg-[#D4AF37]/20 text-[#8C6F12] dark:text-[#F3E5AB] border-[#D4AF37]/50"
                : "bg-transparent text-[#9CA3AF] border-transparent opacity-60 line-through"
            }`}
          >
            <Heart size={13} className="text-[#800020] dark:text-[#D4AF37]" />
            <span>{t.toggleMarriages}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#D4AF37] text-[#121110]">
              {counts.marriages}
            </span>
          </button>

          {/* Toggle Events */}
          <button
            id="toggle-events-layer-btn"
            onClick={onToggleEvents}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all border ${
              showEvents
                ? "bg-[#1A365D]/20 text-[#1A365D] dark:text-[#90CDF4] border-[#1A365D]/40 dark:border-[#90CDF4]/40"
                : "bg-transparent text-[#9CA3AF] border-transparent opacity-60 line-through"
            }`}
          >
            <Sparkles size={13} />
            <span>{t.toggleEvents}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#1A365D] text-white">
              {counts.events}
            </span>
          </button>
        </div>

        {/* Matched Count indicator when searching */}
        {searchTerm && counts.matchedFigures !== undefined && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#800020] dark:text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded-lg border border-[#D4AF37]/30">
            <span>{counts.matchedFigures}</span>
            <span>{t.matchingFigures}</span>
          </div>
        )}
      </div>
    </div>
  );
};
