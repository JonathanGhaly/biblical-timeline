import React, { useState } from "react";
import {
  X,
  Compass,
  Navigation,
  MapPin,
  Sparkles,
  BookOpen,
  Layers,
  Check,
  Mountain,
  Waves,
  Eye,
  Route,
} from "lucide-react";
import {
  ABRAHAM_STATIONS,
  EXODUS_STATIONS,
  type RouteStation,
} from "../data/mapGeography";
import type { MapLayerVisibility } from "./BiblicalWorldSvgMap";
import type { Language } from "../types/genealogy";
import { localizeBiblicalReference } from "../utils/i18n";

interface BiblicalMapLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRTL: boolean;
  lang?: Language;
  layers: MapLayerVisibility;
  onToggleLayer: (layerKey: keyof MapLayerVisibility) => void;
  onFocusLocation: (lat: number, lon: number, zoomLevel?: number) => void;
  onFocusAbrahamRoute: () => void;
  onFocusExodusRoute: () => void;
  selectedStationId?: string | null;
  onSelectStation?: (station: RouteStation) => void;
}

export const BiblicalMapLegendModal: React.FC<BiblicalMapLegendModalProps> = ({
  isOpen,
  onClose,
  isRTL,
  lang = "en",
  layers,
  onToggleLayer,
  onFocusLocation,
  onFocusAbrahamRoute,
  onFocusExodusRoute,
  selectedStationId,
  onSelectStation,
}) => {
  const [activeTab, setActiveTab] = useState<"abraham" | "exodus" | "symbology">("abraham");
  const [expandedStationId, setExpandedStationId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div
      id="biblical-map-legend-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-stone-900/60 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        id="biblical-map-legend-dialog"
        dir={isRTL ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] bg-[#FDFBF7] rounded-2xl shadow-2xl border-2 border-[#D4AF37] flex flex-col overflow-hidden font-serif animate-in fade-in zoom-in-95 duration-200"
      >
        {/* HEADER */}
        <div className="px-5 py-4 bg-[#F5E8CA] border-b border-[#D4AF37]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#800020] text-[#D4AF37] flex items-center justify-center shadow-sm shrink-0 border border-[#D4AF37]/60">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg md:text-xl font-bold text-[#800020] leading-tight ${isRTL ? "font-['Amiri']" : "font-['Cinzel']"}`}>
                {isRTL ? "مفتاح الخريطة والمسارات الكتابية" : "Map Legend & Biblical Holy Routes"}
              </h2>
              <p className="text-xs text-[#78350F] font-sans">
                {isRTL
                  ? "دليل مسار رحلة إبراهيم، ومسار خروج موسى وتيه سيناء، ورموز التضاريس"
                  : "Cartographic guide to Abraham's Path, Moses' Exodus, and Ancient Geography"}
              </p>
            </div>
          </div>

          <button
            id="legend-modal-close-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/80 hover:bg-white text-stone-700 hover:text-[#800020] flex items-center justify-center border border-[#D4AF37]/40 transition shadow-xs cursor-pointer"
            title={isRTL ? "إغلاق" : "Close"}
            aria-label="Close Legend"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center border-b border-stone-200 bg-[#FAF6EC] px-4 pt-2 gap-2 shrink-0 font-sans text-xs">
          <button
            id="tab-abraham-route"
            onClick={() => setActiveTab("abraham")}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition flex items-center gap-2 border-t border-x cursor-pointer ${
              activeTab === "abraham"
                ? "bg-[#FDFBF7] text-[#B45309] border-[#D4AF37] border-b-transparent shadow-xs"
                : "border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] border border-[#92400E] shrink-0" />
            <span>{isRTL ? "مسار رحلة إبراهيم الخليل" : "Abraham's Journey of Faith"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#FEF3C7] text-[#92400E] font-semibold">
              9 {isRTL ? "محطات" : "stations"}
            </span>
          </button>

          <button
            id="tab-exodus-route"
            onClick={() => setActiveTab("exodus")}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition flex items-center gap-2 border-t border-x cursor-pointer ${
              activeTab === "exodus"
                ? "bg-[#FDFBF7] text-[#DC2626] border-[#D4AF37] border-b-transparent shadow-xs"
                : "border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#DC2626] border border-[#7F1D1D] shrink-0" />
            <span>{isRTL ? "مسار خروج موسى وتيه سيناء" : "Moses' Exodus & 40 Years"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#FEE2E2] text-[#991B1B] font-semibold">
              13 {isRTL ? "محطة" : "stations"}
            </span>
          </button>

          <button
            id="tab-symbology"
            onClick={() => setActiveTab("symbology")}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition flex items-center gap-2 border-t border-x cursor-pointer ${
              activeTab === "symbology"
                ? "bg-[#FDFBF7] text-[#800020] border-[#D4AF37] border-b-transparent shadow-xs"
                : "border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#800020]" />
            <span>{isRTL ? "مفتاح الرموز والطبقات" : "Map Symbols & Layers"}</span>
          </button>
        </div>

        {/* TAB CONTENTS (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {/* ========================================================= */}
          {/* TAB 1: ABRAHAM'S PATH                                     */}
          {/* ========================================================= */}
          {activeTab === "abraham" && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="p-4 bg-gradient-to-br from-[#FEF3C7]/70 to-[#FDE68A]/40 rounded-xl border border-[#F59E0B]/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className={`text-base font-bold text-[#92400E] ${isRTL ? "font-['Amiri']" : "font-['Cinzel']"}`}>
                      {isRTL
                        ? "مسار رحلة أبينا إبراهيم من أور الكلدانيين إلى أرض الموعد ومصر"
                        : "The Patriarchal Journey of Abraham (Ur to Canaan & Egypt)"}
                    </h3>
                    <p className="text-xs text-stone-700 font-sans mt-0.5">
                      {isRTL
                        ? "المسافة الإجمالية: قرابة 2,400 كم (1,500 ميل) • الفترة التاريخية: عصر الآباء (~2091 ق.م) • سفر التكوين (11: 31 - 25: 10)"
                        : "Distance: ~1,500 miles (2,400 km) • Era: Patriarchal (~2091 BC) • Genesis 11:31 – Genesis 25:10"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onFocusAbrahamRoute}
                      className="px-3 py-1.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-sans font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isRTL ? "عرض المسار كاملاً" : "Focus Path"}</span>
                    </button>

                    <button
                      onClick={() => onToggleLayer("showAbrahamRoute")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                        layers.showAbrahamRoute !== false
                          ? "bg-white text-[#92400E] border-[#F59E0B]"
                          : "bg-stone-100 text-stone-500 border-stone-300"
                      }`}
                    >
                      {layers.showAbrahamRoute !== false ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span>{isRTL ? "ظاهر بالخريطة" : "Visible"}</span>
                        </>
                      ) : (
                        <span>{isRTL ? "مخفي" : "Hidden"}</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-stone-800 font-sans leading-relaxed bg-white/70 p-3 rounded-lg border border-[#FDE68A]">
                  <p>
                    {isRTL
                      ? "استجاب إبراهيم لدعوة الله وانطلق بالإيمان من مسقط رأسه في أور الكلدانيين بجنوب بلاد ما بين النهرين بمحاذاة الفرات إلى حاران شمالاً، ومنها إلى أرض كنعان (شكيم، بيت إيل، حبرون، وبئر سبع) ثم نزل إلى مصر وعاد ليرث وعد البركة والعهد الأبدي لكافة أمم الأرض."
                      : "By faith Abraham obeyed when he was called to go out to a place he was to receive as an inheritance. Travelling along the Fertile Crescent from Ur along the Euphrates to Haran, southward into Canaan (Shechem, Bethel, Hebron, Beersheba), sojourning in Egypt, and returning to build altars to Yahweh."}
                  </p>
                </div>
              </div>

              {/* Station Timeline List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[#800020] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isRTL ? "محطات مسار رحلة إبراهيم بالترتيب الكتابي" : "Chronological Biblical Stations"}</span>
                </h4>

                <div className="space-y-2 font-sans">
                  {ABRAHAM_STATIONS.map((station) => {
                    const isExpanded = expandedStationId === station.id;
                    const isSelected = selectedStationId === station.id;

                    return (
                      <div
                        key={station.id}
                        id={`legend-abraham-station-${station.id}`}
                        className={`rounded-xl border transition duration-150 overflow-hidden ${
                          isSelected
                            ? "bg-[#FEF3C7] border-[#D97706] shadow-sm"
                            : "bg-white border-stone-200 hover:border-[#D4AF37] hover:bg-[#FDFBF7]"
                        }`}
                      >
                        <div
                          className="p-3 flex items-start justify-between gap-3 cursor-pointer"
                          onClick={() => setExpandedStationId(isExpanded ? null : station.id)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-7 h-7 rounded-full bg-[#D97706] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ring-2 ring-[#FEF3C7]">
                              {station.stationNumber}
                            </span>
                            <div>
                              <div className="flex items-baseline gap-2">
                                <h5 className="font-bold text-sm text-stone-900">
                                  {isRTL ? station.arabicTitle : station.title}
                                </h5>
                                <span className="text-xs text-[#92400E] font-medium">
                                  {isRTL ? station.title : station.arabicTitle}
                                </span>
                              </div>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                                {localizeBiblicalReference(station.scripture, lang)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                onSelectStation?.(station);
                                onFocusLocation(station.coords[0], station.coords[1], 3.0);
                              }}
                              className="px-2.5 py-1 rounded-md bg-[#FAF5E6] hover:bg-[#F5E8CA] text-[#800020] text-xs font-semibold flex items-center gap-1 border border-[#D4AF37]/50 transition active:scale-95 cursor-pointer"
                              title={isRTL ? "تكبير وعرض الموقع على الخريطة" : "Focus on map"}
                            >
                              <MapPin className="w-3 h-3 text-[#B45309]" />
                              <span>{isRTL ? "عرض بالخريطة" : "Locate"}</span>
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Details */}
                        {isExpanded && (
                          <div className="px-4 pb-3 pt-1 text-xs text-stone-700 space-y-2 border-t border-stone-100 bg-[#FAF7F0]">
                            <p className="leading-relaxed">
                              {isRTL ? station.arabicDescription : station.description}
                            </p>
                            {isRTL && (
                              <p className="text-[11px] text-stone-500 italic border-t border-stone-200/60 pt-1.5">
                                {station.description}
                              </p>
                            )}
                            <div className="text-[10px] text-stone-500 font-mono">
                              {station.coords[0].toFixed(3)}° N, {station.coords[1].toFixed(3)}° E
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: MOSES' EXODUS                                      */}
          {/* ========================================================= */}
          {activeTab === "exodus" && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="p-4 bg-gradient-to-br from-[#FEE2E2]/70 to-[#FECACA]/40 rounded-xl border border-[#DC2626]/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className={`text-base font-bold text-[#991B1B] ${isRTL ? "font-['Amiri']" : "font-['Cinzel']"}`}>
                      {isRTL
                        ? "مسار خروج موسى وتيه الـ 40 سنة في برية سيناء حتى جبل نيبو"
                        : "Moses' Exodus & 40 Years in the Wilderness to Mount Nebo"}
                    </h3>
                    <p className="text-xs text-stone-700 font-sans mt-0.5">
                      {isRTL
                        ? "المدة: 40 سنة • الفترة التاريخية: عصر الخروج (~1446 ق.م) • أسفار الخروج واللاويين والعدد والتثنية"
                        : "Duration: 40 Years • Era: Exodus (~1446 BC) • Exodus, Leviticus, Numbers, Deuteronomy"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onFocusExodusRoute}
                      className="px-3 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-sans font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isRTL ? "عرض مسار الخروج" : "Focus Exodus"}</span>
                    </button>

                    <button
                      onClick={() => onToggleLayer("showExodusRoute")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                        layers.showExodusRoute !== false
                          ? "bg-white text-[#991B1B] border-[#DC2626]"
                          : "bg-stone-100 text-stone-500 border-stone-300"
                      }`}
                    >
                      {layers.showExodusRoute !== false ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span>{isRTL ? "ظاهر بالخريطة" : "Visible"}</span>
                        </>
                      ) : (
                        <span>{isRTL ? "مخفي" : "Hidden"}</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-stone-800 font-sans leading-relaxed bg-white/70 p-3 rounded-lg border border-[#FECACA]">
                  <p>
                    {isRTL
                      ? "المسار الإعجازي لخلاص بني إسرائيل بقيادة النبي موسى: الخروج ليلة الفصح من رعمسيس في أرض جاسان، عبور بحر سوف المعجزي، تلقي الشريعة والوصايا العشر في جبل سيناء (حوريب)، تيه الـ 38 عاماً حول قادش برنيع، والالتفاف حول أدوم حتى بلوغ قمة جبل نيبو وعربات موآب قبالة أريحا."
                      : "The miraculous deliverance of Israel under Moses: Passover departure from Rameses in Goshen, splitting of the Red Sea (Yam Suph), the Law and Covenant at Mount Sinai (Horeb), the 38 years wandering around Kadesh-Barnea, and passing through Edom and Moab to Mount Nebo."}
                  </p>
                </div>
              </div>

              {/* Station Timeline List */}
              <div className="space-y-3 font-sans">
                <h4 className="text-xs font-bold text-[#800020] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>{isRTL ? "مراحل ومحطات مسار الخروج (13 محطة رئيسية)" : "The 13 Key Biblical Stations & 4 Phases"}</span>
                </h4>

                {/* Group by Stage */}
                {[1, 2, 3, 4].map((stageNum) => {
                  const stageStations = EXODUS_STATIONS.filter((s) => s.stage === stageNum);
                  if (stageStations.length === 0) return null;
                  const stageTitle = isRTL
                    ? stageStations[0].stageArabicName
                    : stageStations[0].stageName;

                  return (
                    <div key={`stage-${stageNum}`} className="space-y-2">
                      <div className="flex items-center gap-2 pt-2 border-b border-stone-200 pb-1">
                        <span className="w-5 h-5 rounded-md bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">
                          {stageNum}
                        </span>
                        <h5 className="font-bold text-xs text-[#800020]">
                          {stageTitle}
                        </h5>
                      </div>

                      <div className="space-y-2">
                        {stageStations.map((station) => {
                          const isExpanded = expandedStationId === station.id;
                          const isSelected = selectedStationId === station.id;

                          return (
                            <div
                              key={station.id}
                              id={`legend-exodus-station-${station.id}`}
                              className={`rounded-xl border transition duration-150 overflow-hidden ${
                                isSelected
                                  ? "bg-[#FEE2E2] border-[#DC2626] shadow-sm"
                                  : "bg-white border-stone-200 hover:border-[#DC2626]/50 hover:bg-[#FDFBF7]"
                              }`}
                            >
                              <div
                                className="p-3 flex items-start justify-between gap-3 cursor-pointer"
                                onClick={() => setExpandedStationId(isExpanded ? null : station.id)}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="w-7 h-7 rounded-full bg-[#DC2626] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ring-2 ring-[#FEE2E2]">
                                    {station.stationNumber}
                                  </span>
                                  <div>
                                    <div className="flex items-baseline gap-2">
                                      <h6 className="font-bold text-sm text-stone-900">
                                        {isRTL ? station.arabicTitle : station.title}
                                      </h6>
                                      <span className="text-xs text-[#991B1B] font-medium">
                                        {isRTL ? station.title : station.arabicTitle}
                                      </span>
                                    </div>
                                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]">
                                      {localizeBiblicalReference(station.scripture, lang)}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => {
                                      onSelectStation?.(station);
                                      onFocusLocation(station.coords[0], station.coords[1], 3.0);
                                    }}
                                    className="px-2.5 py-1 rounded-md bg-[#FAF5E6] hover:bg-[#FEE2E2] text-[#800020] text-xs font-semibold flex items-center gap-1 border border-[#D4AF37]/50 transition active:scale-95 cursor-pointer"
                                    title={isRTL ? "تكبير وعرض الموقع على الخريطة" : "Focus on map"}
                                  >
                                    <MapPin className="w-3 h-3 text-[#DC2626]" />
                                    <span>{isRTL ? "عرض بالخريطة" : "Locate"}</span>
                                  </button>
                                </div>
                              </div>

                              {/* Collapsible Details */}
                              {isExpanded && (
                                <div className="px-4 pb-3 pt-1 text-xs text-stone-700 space-y-2 border-t border-stone-100 bg-[#FAF7F0]">
                                  <p className="leading-relaxed">
                                    {isRTL ? station.arabicDescription : station.description}
                                  </p>
                                  {isRTL && (
                                    <p className="text-[11px] text-stone-500 italic border-t border-stone-200/60 pt-1.5">
                                      {station.description}
                                    </p>
                                  )}
                                  <div className="text-[10px] text-stone-500 font-mono">
                                    {station.coords[0].toFixed(3)}° N, {station.coords[1].toFixed(3)}° E
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SYMBOLOGY & LAYERS                                 */}
          {/* ========================================================= */}
          {activeTab === "symbology" && (
            <div className="space-y-5 font-sans">
              {/* Swatches Legend Card */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-[#800020] uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isRTL ? "دلالات خطوط المسارات ورموز الخريطة" : "Cartographic Symbols & Line Work"}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Abraham Path Swatch */}
                  <div className="p-3 bg-[#FEF3C7]/40 rounded-lg border border-[#FDE68A] space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-3 flex items-center">
                        <div className="w-full h-1 bg-[#D97706] rounded-full" style={{ borderTop: "2px dashed #92400E" }} />
                      </div>
                      <span className="font-bold text-[#92400E]">
                        {isRTL ? "مسار رحلة إبراهيم (خط عنبري متقطع نقطي)" : "Abraham's Journey (Amber Dash-Dot)"}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      {isRTL
                        ? "من أور الكلدانيين إلى حاران وكنعان ومصر وجبل المريا"
                        : "From Ur of the Chaldees to Haran, Shechem, Hebron, Egypt & Moriah"}
                    </p>
                  </div>

                  {/* Moses Exodus Swatch */}
                  <div className="p-3 bg-[#FEE2E2]/40 rounded-lg border border-[#FECACA] space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-3 flex items-center">
                        <div className="w-full h-1 bg-[#DC2626] rounded-full" style={{ borderTop: "2px dashed #7F1D1D" }} />
                      </div>
                      <span className="font-bold text-[#991B1B]">
                        {isRTL ? "مسار خروج موسى (خط أحمر قرمزي متقطع)" : "Moses' Exodus (Crimson Dashed)"}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      {isRTL
                        ? "من رعمسيس وبحر سوف إلى جبل سيناء وقادش برنيع وجبل نيبو"
                        : "From Rameses & Yam Suph to Mount Sinai, Kadesh, & Mount Nebo"}
                    </p>
                  </div>

                  {/* Trade Highway Swatch */}
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-3 flex items-center">
                        <div className="w-full h-0.5 bg-[#854D0E]" style={{ borderTop: "2px dotted #854D0E" }} />
                      </div>
                      <span className="font-bold text-[#854D0E]">
                        {isRTL ? "طرق التجارة والقوافل القديمة" : "Ancient Trade Highways"}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      {isRTL
                        ? "طريق البحر (فيا ماريس) ودرب السلطان (طريق الملك بشرق الأردن)"
                        : "Way of the Sea (Via Maris) and The King's Highway through Edom/Moab"}
                    </p>
                  </div>

                  {/* City Site Swatch */}
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#800020] ring-2 ring-[#D4AF37] shrink-0" />
                      <span className="font-bold text-stone-900">
                        {isRTL ? "المدن والمواقع الكتابية التاريخية" : "Biblical Historical Sites & Cities"}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      {isRTL
                        ? "نقطة ذهبية مع حلقة قرمزية وربط مع الموقع الأثري الحديث"
                        : "Gilded crimson markers correlated to modern verified archaeological finds"}
                    </p>
                  </div>

                  {/* Mountain Peak Swatch */}
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-[#CA8A04] shrink-0" />
                      <span className="font-bold text-[#854D0E]">
                        {isRTL ? "قمم وسلاسل الجبال التوراتية" : "Mountain Summits & Ridges"}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      {isRTL
                        ? "جبل سيناء (2,285م)، جبل أرارات (5,137م)، جبل نيبو (817م)، جبل حرمون"
                        : "Mt. Sinai (2,285m), Ararat (5,137m), Nebo (817m), Hermon (2,814m)"}
                    </p>
                  </div>

                  {/* Waterways & Fertile Crescent */}
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-md bg-[#65A30D]/30 border border-[#65A30D] shrink-0" />
                      <span className="font-bold text-[#4D7C0F]">
                        {isRTL ? "حزام الهلال الخصيب ومجاري الأنهار" : "Fertile Crescent & Riverways"}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      {isRTL
                        ? "الأراضي الصالحة للزراعة والاستيطان، ونهر النيل والأردن والفرات ودجلة"
                        : "Arable agricultural crescent and sacred biblical river waterways"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Layer Switches */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-[#800020] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isRTL ? "التحكم في إظهار وإخفاء الطبقات" : "Interactive Layer Visibility Toggles"}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Abraham Path */}
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-[#FAF6EC] cursor-pointer transition">
                    <span className="flex items-center gap-2 font-medium text-stone-800">
                      <Route className="w-4 h-4 text-[#D97706]" />
                      {isRTL ? "مسار رحلة إبراهيم" : "Abraham's Journey"}
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.showAbrahamRoute !== false}
                      onChange={() => onToggleLayer("showAbrahamRoute")}
                      className="w-4 h-4 text-[#800020] rounded accent-[#800020] cursor-pointer"
                    />
                  </label>

                  {/* Moses Exodus */}
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-[#FAF6EC] cursor-pointer transition">
                    <span className="flex items-center gap-2 font-medium text-stone-800">
                      <Route className="w-4 h-4 text-[#DC2626]" />
                      {isRTL ? "مسار خروج موسى" : "Moses' Exodus Route"}
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.showExodusRoute !== false}
                      onChange={() => onToggleLayer("showExodusRoute")}
                      className="w-4 h-4 text-[#800020] rounded accent-[#800020] cursor-pointer"
                    />
                  </label>

                  {/* Trade Routes */}
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-[#FAF6EC] cursor-pointer transition">
                    <span className="flex items-center gap-2 font-medium text-stone-800">
                      <Navigation className="w-4 h-4 text-[#854D0E]" />
                      {isRTL ? "طرق التجارة القديمة" : "Ancient Trade Routes"}
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.showRoutes}
                      onChange={() => onToggleLayer("showRoutes")}
                      className="w-4 h-4 text-[#800020] rounded accent-[#800020] cursor-pointer"
                    />
                  </label>

                  {/* Rivers */}
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-[#FAF6EC] cursor-pointer transition">
                    <span className="flex items-center gap-2 font-medium text-stone-800">
                      <Waves className="w-4 h-4 text-[#0E4861]" />
                      {isRTL ? "الأنهار والمسطحات المائية" : "Rivers & Waterways"}
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.showRivers}
                      onChange={() => onToggleLayer("showRivers")}
                      className="w-4 h-4 text-[#800020] rounded accent-[#800020] cursor-pointer"
                    />
                  </label>

                  {/* Mountains */}
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-[#FAF6EC] cursor-pointer transition">
                    <span className="flex items-center gap-2 font-medium text-stone-800">
                      <Mountain className="w-4 h-4 text-[#78350F]" />
                      {isRTL ? "سلاسل الجبال والقمم" : "Mountain Summits"}
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.showMountains}
                      onChange={() => onToggleLayer("showMountains")}
                      className="w-4 h-4 text-[#800020] rounded accent-[#800020] cursor-pointer"
                    />
                  </label>

                  {/* Fertile Crescent */}
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-[#FAF6EC] cursor-pointer transition">
                    <span className="flex items-center gap-2 font-medium text-stone-800">
                      <Sparkles className="w-4 h-4 text-[#65A30D]" />
                      {isRTL ? "حزام الهلال الخصيب" : "Fertile Crescent"}
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.showFertileCrescent}
                      onChange={() => onToggleLayer("showFertileCrescent")}
                      className="w-4 h-4 text-[#800020] rounded accent-[#800020] cursor-pointer"
                    />
                  </label>

                  {/* Graticule Grid */}
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-[#FAF6EC] cursor-pointer transition">
                    <span className="flex items-center gap-2 font-medium text-stone-800">
                      <Compass className="w-4 h-4 text-[#92400E]" />
                      {isRTL ? "شبكة الإحداثيات الجغرافية" : "Coordinate Graticule"}
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.showGraticule}
                      onChange={() => onToggleLayer("showGraticule")}
                      className="w-4 h-4 text-[#800020] rounded accent-[#800020] cursor-pointer"
                    />
                  </label>

                  {/* Regional Empire Labels */}
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-[#FAF6EC] cursor-pointer transition">
                    <span className="flex items-center gap-2 font-medium text-stone-800">
                      <BookOpen className="w-4 h-4 text-[#800020]" />
                      {isRTL ? "أسماء الأقاليم والممالك" : "Territory & Realm Labels"}
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.showRegionLabels}
                      onChange={() => onToggleLayer("showRegionLabels")}
                      className="w-4 h-4 text-[#800020] rounded accent-[#800020] cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BAR */}
        <div className="px-5 py-3 bg-[#FAF6EC] border-t border-stone-200 flex items-center justify-between font-sans text-xs shrink-0">
          <span className="text-stone-500">
            {isRTL
              ? "انقر فوق أي محطة أو زر 'عرض بالخريطة' للانتقال الفوري إلى موضعها"
              : "Click any station or 'Locate' to pan & zoom directly to it on the map."}
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#800020] hover:bg-[#991B1B] text-[#D4AF37] font-bold transition shadow-sm cursor-pointer"
          >
            {isRTL ? "العودة للخريطة" : "Return to Map"}
          </button>
        </div>
      </div>
    </div>
  );
};
