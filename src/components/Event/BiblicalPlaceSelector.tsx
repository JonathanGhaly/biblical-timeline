import React, { useState, useMemo } from "react";
import { Search, MapPin, Check, Globe } from "lucide-react";
import {
  ALL_BIBLICAL_PLACES,
  searchBiblicalPlaces,
  PLACE_TYPE_INFO,
  getCertaintyBadge,
  type BiblicalPlace,
} from "../../data/biblicalPlaces";
import type { Language } from "../../types/genealogy";

interface BiblicalPlaceSelectorProps {
  selectedPlaceId?: string;
  selectedPlaceName?: string;
  onSelect: (place: BiblicalPlace) => void;
  onClear?: () => void;
  lang?: Language;
}

export const BiblicalPlaceSelector: React.FC<BiblicalPlaceSelectorProps> = ({
  selectedPlaceId,
  selectedPlaceName,
  onSelect,
  onClear,
  lang = "en",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const isRTL = lang === "ar";

  const filteredPlaces = useMemo(() => {
    let places = searchQuery ? searchBiblicalPlaces(searchQuery) : ALL_BIBLICAL_PLACES;
    if (selectedType !== "all") {
      places = places.filter((p) => p.type === selectedType);
    }
    return places;
  }, [searchQuery, selectedType]);

  const currentPlace = useMemo(() => {
    if (selectedPlaceId) {
      return ALL_BIBLICAL_PLACES.find((p) => p.id === selectedPlaceId);
    }
    if (selectedPlaceName) {
      return ALL_BIBLICAL_PLACES.find(
        (p) =>
          p.name.toLowerCase() === selectedPlaceName.toLowerCase() ||
          (p.arabicName && p.arabicName.toLowerCase() === selectedPlaceName.toLowerCase())
      );
    }
    return undefined;
  }, [selectedPlaceId, selectedPlaceName]);

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center justify-between gap-2 px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-left hover:bg-stone-100 dark:hover:bg-stone-750 transition-colors"
        >
          <span className="flex items-center gap-2 truncate">
            <MapPin size={16} className="text-stone-400 shrink-0" />
            {currentPlace ? (
              <span className="font-medium text-stone-900 dark:text-stone-100">
                {isRTL && currentPlace.arabicName ? currentPlace.arabicName : currentPlace.name}
                {currentPlace.modernCountry && (
                  <span className="text-xs font-normal text-stone-500 ms-1.5">
                    ({currentPlace.modernCountry})
                  </span>
                )}
              </span>
            ) : selectedPlaceName ? (
              <span className="text-stone-900 dark:text-stone-100">{selectedPlaceName}</span>
            ) : (
              <span className="text-stone-400">
                {isRTL ? "اختر موقعاً كتابياً من قاعدة البيانات..." : "Select biblical place from database..."}
              </span>
            )}
          </span>
          <span className="text-xs text-stone-400 font-mono shrink-0">
            {isOpen ? "▲" : "▼"}
          </span>
        </button>

        {onClear && (currentPlace || selectedPlaceName) && (
          <button
            type="button"
            onClick={onClear}
            className="px-2.5 py-2 text-xs text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            title={isRTL ? "مسح الاختيار" : "Clear selection"}
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isRTL
                    ? "ابحث بالاسم، الاسم العربي، المترادفات، البلد الحديث..."
                    : "Search by name, Arabic name, aliases, country..."
                }
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                autoFocus
              />
            </div>

            <div className="flex gap-1 overflow-x-auto mt-2 pb-1 scrollbar-none text-[10px]">
              <button
                type="button"
                onClick={() => setSelectedType("all")}
                className={`px-2 py-0.5 rounded-full whitespace-nowrap border ${
                  selectedType === "all"
                    ? "bg-stone-800 text-white border-stone-800 dark:bg-stone-200 dark:text-stone-900"
                    : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700"
                }`}
              >
                {isRTL ? "الكل" : "All"} ({ALL_BIBLICAL_PLACES.length})
              </button>
              {Object.entries(PLACE_TYPE_INFO).map(([typeKey, typeInfo]) => {
                const count = ALL_BIBLICAL_PLACES.filter((p) => p.type === typeKey).length;
                if (count === 0) return null;
                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => setSelectedType(typeKey)}
                    className={`px-2 py-0.5 rounded-full whitespace-nowrap border ${
                      selectedType === typeKey
                        ? "bg-amber-600 text-white border-amber-600 dark:bg-amber-500"
                        : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700"
                    }`}
                  >
                    {isRTL ? typeInfo.labelAr : typeInfo.labelEn} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
            {filteredPlaces.length === 0 ? (
              <div className="p-4 text-center text-xs text-stone-500 dark:text-stone-400">
                {isRTL ? "لا توجد مواقع مطابقة للبحث" : "No biblical places found"}
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const isSelected =
                  currentPlace?.id === place.id ||
                  selectedPlaceName?.toLowerCase() === place.name.toLowerCase();
                const typeInfo = PLACE_TYPE_INFO[place.type] || PLACE_TYPE_INFO.other;
                const certainty = getCertaintyBadge(place.certainty, lang);

                return (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => {
                      onSelect(place);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 text-left flex items-start justify-between gap-2 hover:bg-amber-50/50 dark:hover:bg-stone-800/60 transition-colors ${
                      isSelected ? "bg-amber-50 dark:bg-amber-950/20" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                          {place.name}
                        </span>
                        {place.arabicName && (
                          <span className="text-[11px] text-stone-600 dark:text-stone-300 font-serif">
                            ({place.arabicName})
                          </span>
                        )}
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-medium border ${certainty.badgeClass}`}
                        >
                          {certainty.label}
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400">
                          • {isRTL ? typeInfo.labelAr : typeInfo.labelEn}
                        </span>
                      </div>

                      {place.description && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                          {isRTL && place.arabicDescription
                            ? place.arabicDescription
                            : place.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[10px] text-stone-400 mt-1">
                        {place.modernName && (
                          <span className="flex items-center gap-0.5">
                            <Globe size={10} />
                            {place.modernName}
                            {place.modernCountry ? `, ${place.modernCountry}` : ""}
                          </span>
                        )}
                        <span>
                          [{place.latitude.toFixed(2)}°, {place.longitude.toFixed(2)}°]
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <Check size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
