import React from "react";
import type { Language } from "../../types/genealogy";
import { formatYearDisplay } from "../../utils/i18n";
import type { TimelinePersonItem } from "./timelineUtils";

interface TimelineMinimapProps {
  lang: Language;
  fullMinYear: number;
  fullMaxYear: number;
  currentMinYear: number;
  currentMaxYear: number;
  people: TimelinePersonItem[];
  onSelectYearRange: (min: number, max: number) => void;
}

export const TimelineMinimap: React.FC<TimelineMinimapProps> = ({
  lang,
  fullMinYear,
  fullMaxYear,
  currentMinYear,
  currentMaxYear,
  people,
  onSelectYearRange,
}) => {
  const isRTL = lang === "ar";
  const fullSpan = fullMaxYear - fullMinYear || 1;

  // Key historical landmark points for the mini-overview
  const landmarkYears = [-4000, -3000, -2000, -1500, -1000, -500];

  const getFullRatio = (year: number) => {
    return Math.max(0, Math.min(1, (year - fullMinYear) / fullSpan));
  };

  const windowStartRatio = getFullRatio(currentMinYear);
  const windowEndRatio = getFullRatio(currentMaxYear);
  const windowWidthRatio = Math.max(0.04, windowEndRatio - windowStartRatio);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    let ratio = clickX / rect.width;
    if (isRTL) ratio = 1 - ratio;

    const targetCenterYear = Math.round(fullMinYear + ratio * fullSpan);
    const currentSpan = currentMaxYear - currentMinYear;
    const half = Math.round(currentSpan / 2);

    let newMin = targetCenterYear - half;
    let newMax = targetCenterYear + half;

    if (newMin < fullMinYear) {
      newMin = fullMinYear;
      newMax = Math.min(fullMaxYear, newMin + currentSpan);
    }
    if (newMax > fullMaxYear) {
      newMax = fullMaxYear;
      newMin = Math.max(fullMinYear, newMax - currentSpan);
    }

    onSelectYearRange(newMin, newMax);
  };

  return (
    <div className="relative py-2 px-3 rounded-xl bg-gradient-to-r from-[#800020]/10 via-[#D4AF37]/15 to-[#1A365D]/10 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#1A365D]/20 border border-[#D4AF37]/40 shadow-inner select-none">
      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#800020] dark:text-[#D4AF37] mb-1.5">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#800020] inline-block" />
          {formatYearDisplay(fullMinYear, lang)}
        </span>
        <span className="text-[10px] text-[#6B5E4E] dark:text-[#A99F8D] font-sans font-medium hidden sm:inline">
          {isRTL ? "انقر للقفز السريع عبر التاريخ" : "Click anywhere to jump across chronology"}
        </span>
        <span className="flex items-center gap-1">
          {formatYearDisplay(fullMaxYear, lang)}
          <span className="w-2 h-2 rounded-full bg-[#1A365D] inline-block" />
        </span>
      </div>

      {/* Interactive Track */}
      <div
        className="relative h-6 rounded-lg bg-[#EFE9D9] dark:bg-[#121110] border border-[#D4AF37]/50 cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        {/* Person Density Sparks */}
        {people.map(({ person, birthYear, duration }) => {
          const ratio = getFullRatio(birthYear);
          const widthRatio = Math.max(0.005, duration / fullSpan);

          return (
            <div
              key={`mini_${person.id}`}
              className="absolute top-1 bottom-1 rounded-sm opacity-50 transition-opacity hover:opacity-100"
              style={{
                [isRTL ? "right" : "left"]: `${ratio * 100}%`,
                width: `${Math.max(2, widthRatio * 100)}%`,
                backgroundColor:
                  person.gender === "female" ? "#BE185D" : "#800020",
              }}
            />
          );
        })}

        {/* Milestone Tick Lines */}
        {landmarkYears.map((yr) => {
          const r = getFullRatio(yr);
          return (
            <div
              key={`landmark_${yr}`}
              className="absolute top-0 bottom-0 w-px bg-[#D4AF37]/60 pointer-events-none"
              style={{
                [isRTL ? "right" : "left"]: `${r * 100}%`,
              }}
            />
          );
        })}

        {/* Active Viewport Highlight Window */}
        <div
          className="absolute top-0 bottom-0 rounded-md border-2 border-[#800020] dark:border-[#D4AF37] bg-[#D4AF37]/35 shadow-md pointer-events-none transition-all duration-150"
          style={{
            [isRTL ? "right" : "left"]: `${windowStartRatio * 100}%`,
            width: `${windowWidthRatio * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
