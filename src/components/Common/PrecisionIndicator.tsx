import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";
import type { Language, DatePrecision } from "../../types/genealogy";

interface PrecisionIndicatorProps {
  precision?: DatePrecision;
  lang?: Language;
  onToggle?: () => void;
  interactive?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export const PrecisionIndicator: React.FC<PrecisionIndicatorProps> = ({
  precision = "exact",
  lang = "en",
  onToggle,
  interactive = false,
  size = "sm",
  className = "",
}) => {
  const isAccurate = precision === "calculated" || precision === "exact";

  const labelEn = isAccurate ? "Calculated (Accurate)" : "Estimated (Approximate)";
  const labelAr = isAccurate ? "محسوب بدقة" : "تقديري تقريبي";
  const label = lang === "ar" ? labelAr : labelEn;

  const content = (
    <span
      className={`inline-flex items-center gap-1 font-sans rounded-full px-2 py-0.5 text-[10px] font-medium border transition-all ${
        isAccurate
          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
          : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200"
      } ${interactive ? "cursor-pointer hover:opacity-80 active:scale-95" : ""} ${className}`}
      title={label}
    >
      {isAccurate ? (
        <CheckCircle2 size={size === "sm" ? 11 : 13} className="text-emerald-600 dark:text-emerald-400" />
      ) : (
        <HelpCircle size={size === "sm" ? 11 : 13} className="text-amber-600 dark:text-amber-400" />
      )}
      <span>{label}</span>
    </span>
  );

  if (interactive && onToggle) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex focus:outline-none"
        aria-label={label}
      >
        {content}
      </button>
    );
  }

  return content;
};
