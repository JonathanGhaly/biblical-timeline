import React from "react";
import {
  getEventTypeDefinition,
  type EventType,
} from "../../data/biblicalEventTypes";
import type { Language } from "../../types/genealogy";

interface EventTypeBadgeProps {
  eventType?: EventType | string;
  lang?: Language;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const EventTypeBadge: React.FC<EventTypeBadgeProps> = ({
  eventType,
  lang = "en",
  size = "sm",
  showLabel = true,
  className = "",
}) => {
  const def = getEventTypeDefinition(eventType);
  const Icon = def.icon;
  const label = lang === "ar" ? def.labelAr : def.labelEn;

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const padSizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border shadow-2xs whitespace-nowrap transition-colors ${def.badgeBg} ${def.badgeBorder} ${def.badgeText} ${padSizes[size]} ${className}`}
      title={label}
    >
      <Icon size={iconSizes[size]} className={def.colorClass} />
      {showLabel && <span>{label}</span>}
    </span>
  );
};
