import {
  Baby,
  Skull,
  Heart,
  GitBranch,
  Route,
  Navigation,
  Swords,
  ShieldAlert,
  Scroll,
  Eye,
  Sparkles,
  Sun,
  Flame,
  Scale,
  AlertTriangle,
  Church,
  Gift,
  PhoneCall,
  Crown,
  Award,
  LogOut,
  LogIn,
  Hammer,
  Building2,
  Box,
  Users,
  Flag,
  Divide,
  FileCheck,
  WheatOff,
  Biohazard,
  CloudLightning,
  History,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Language } from "../types/genealogy";

export type EventType =
  | "birth"
  | "death"
  | "marriage"
  | "genealogy"
  | "journey"
  | "migration"
  | "battle"
  | "war"
  | "covenant"
  | "prophecy"
  | "vision"
  | "dream"
  | "divine_appearance"
  | "miracle"
  | "judgment"
  | "sin_rebellion"
  | "worship"
  | "sacrifice"
  | "offering"
  | "calling"
  | "anointing"
  | "coronation"
  | "reign"
  | "exile"
  | "return"
  | "building"
  | "destruction"
  | "burial"
  | "meeting"
  | "birth_of_nation"
  | "division_of_nations"
  | "treaty"
  | "famine"
  | "plague"
  | "natural_event"
  | "historical_event"
  | "other";

export interface EventTypeDefinition {
  id: EventType;
  labelEn: string;
  labelAr: string;
  icon: LucideIcon;
  colorClass: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const BIBLICAL_EVENT_TYPES: Record<EventType, EventTypeDefinition> = {
  birth: {
    id: "birth",
    labelEn: "Birth",
    labelAr: "ميلاد",
    icon: Baby,
    colorClass: "text-emerald-700 dark:text-emerald-300",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeBorder: "border-emerald-300 dark:border-emerald-800",
    badgeText: "text-emerald-800 dark:text-emerald-200",
  },
  death: {
    id: "death",
    labelEn: "Death",
    labelAr: "وفاة / انتقال",
    icon: Skull,
    colorClass: "text-stone-600 dark:text-stone-400",
    badgeBg: "bg-stone-100 dark:bg-stone-900/60",
    badgeBorder: "border-stone-300 dark:border-stone-700",
    badgeText: "text-stone-700 dark:text-stone-300",
  },
  marriage: {
    id: "marriage",
    labelEn: "Marriage",
    labelAr: "زواج / اقتران",
    icon: Heart,
    colorClass: "text-pink-600 dark:text-pink-400",
    badgeBg: "bg-pink-50 dark:bg-pink-950/40",
    badgeBorder: "border-pink-300 dark:border-pink-800",
    badgeText: "text-pink-800 dark:text-pink-200",
  },
  genealogy: {
    id: "genealogy",
    labelEn: "Genealogy",
    labelAr: "سلسلة أنساب",
    icon: GitBranch,
    colorClass: "text-amber-700 dark:text-amber-300",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeBorder: "border-amber-300 dark:border-amber-800",
    badgeText: "text-amber-800 dark:text-amber-200",
  },
  journey: {
    id: "journey",
    labelEn: "Journey",
    labelAr: "رحلة / مسيرة",
    icon: Route,
    colorClass: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40",
    badgeBorder: "border-blue-300 dark:border-blue-800",
    badgeText: "text-blue-800 dark:text-blue-200",
  },
  migration: {
    id: "migration",
    labelEn: "Migration",
    labelAr: "هجرة / ارتحال",
    icon: Navigation,
    colorClass: "text-cyan-700 dark:text-cyan-300",
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/40",
    badgeBorder: "border-cyan-300 dark:border-cyan-800",
    badgeText: "text-cyan-800 dark:text-cyan-200",
  },
  battle: {
    id: "battle",
    labelEn: "Battle",
    labelAr: "معركة",
    icon: Swords,
    colorClass: "text-red-700 dark:text-red-400",
    badgeBg: "bg-red-50 dark:bg-red-950/40",
    badgeBorder: "border-red-300 dark:border-red-800",
    badgeText: "text-red-800 dark:text-red-200",
  },
  war: {
    id: "war",
    labelEn: "War",
    labelAr: "حرب",
    icon: ShieldAlert,
    colorClass: "text-rose-700 dark:text-rose-400",
    badgeBg: "bg-rose-50 dark:bg-rose-950/40",
    badgeBorder: "border-rose-300 dark:border-rose-800",
    badgeText: "text-rose-800 dark:text-rose-200",
  },
  covenant: {
    id: "covenant",
    labelEn: "Covenant",
    labelAr: "عهد إلهي",
    icon: Scroll,
    colorClass: "text-amber-600 dark:text-amber-300",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeBorder: "border-[#D4AF37] dark:border-[#D4AF37]/60",
    badgeText: "text-[#800020] dark:text-[#F3E5AB]",
  },
  prophecy: {
    id: "prophecy",
    labelEn: "Prophecy",
    labelAr: "نبوءة",
    icon: Eye,
    colorClass: "text-purple-700 dark:text-purple-300",
    badgeBg: "bg-purple-50 dark:bg-purple-950/40",
    badgeBorder: "border-purple-300 dark:border-purple-800",
    badgeText: "text-purple-800 dark:text-purple-200",
  },
  vision: {
    id: "vision",
    labelEn: "Vision",
    labelAr: "رؤيا",
    icon: Sparkles,
    colorClass: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeBorder: "border-indigo-300 dark:border-indigo-800",
    badgeText: "text-indigo-800 dark:text-indigo-200",
  },
  dream: {
    id: "dream",
    labelEn: "Dream",
    labelAr: "حلم إلهي",
    icon: Sparkles,
    colorClass: "text-violet-600 dark:text-violet-400",
    badgeBg: "bg-violet-50 dark:bg-violet-950/40",
    badgeBorder: "border-violet-300 dark:border-violet-800",
    badgeText: "text-violet-800 dark:text-violet-200",
  },
  divine_appearance: {
    id: "divine_appearance",
    labelEn: "Divine Appearance",
    labelAr: "ظهور إلهي (ثيوفانيا)",
    icon: Sun,
    colorClass: "text-yellow-600 dark:text-yellow-400",
    badgeBg: "bg-yellow-50 dark:bg-yellow-950/40",
    badgeBorder: "border-yellow-400 dark:border-yellow-700",
    badgeText: "text-yellow-900 dark:text-yellow-200",
  },
  miracle: {
    id: "miracle",
    labelEn: "Miracle",
    labelAr: "معجزة / آية",
    icon: Sparkles,
    colorClass: "text-sky-600 dark:text-sky-400",
    badgeBg: "bg-sky-50 dark:bg-sky-950/40",
    badgeBorder: "border-sky-300 dark:border-sky-800",
    badgeText: "text-sky-800 dark:text-sky-200",
  },
  judgment: {
    id: "judgment",
    labelEn: "Judgment",
    labelAr: "قضاء ودينونة",
    icon: Scale,
    colorClass: "text-red-800 dark:text-red-300",
    badgeBg: "bg-red-50 dark:bg-red-950/40",
    badgeBorder: "border-red-400 dark:border-red-800",
    badgeText: "text-red-900 dark:text-red-200",
  },
  sin_rebellion: {
    id: "sin_rebellion",
    labelEn: "Sin / Rebellion",
    labelAr: "عصيان / خطية",
    icon: AlertTriangle,
    colorClass: "text-orange-700 dark:text-orange-400",
    badgeBg: "bg-orange-50 dark:bg-orange-950/40",
    badgeBorder: "border-orange-300 dark:border-orange-800",
    badgeText: "text-orange-800 dark:text-orange-200",
  },
  worship: {
    id: "worship",
    labelEn: "Worship",
    labelAr: "عبادة وسجود",
    icon: Church,
    colorClass: "text-teal-700 dark:text-teal-300",
    badgeBg: "bg-teal-50 dark:bg-teal-950/40",
    badgeBorder: "border-teal-300 dark:border-teal-800",
    badgeText: "text-teal-800 dark:text-teal-200",
  },
  sacrifice: {
    id: "sacrifice",
    labelEn: "Sacrifice",
    labelAr: "ذبيحة",
    icon: Flame,
    colorClass: "text-amber-700 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeBorder: "border-amber-300 dark:border-amber-800",
    badgeText: "text-amber-800 dark:text-amber-200",
  },
  offering: {
    id: "offering",
    labelEn: "Offering",
    labelAr: "تقدمة ونذر",
    icon: Gift,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeBorder: "border-emerald-300 dark:border-emerald-800",
    badgeText: "text-emerald-800 dark:text-emerald-200",
  },
  calling: {
    id: "calling",
    labelEn: "Calling",
    labelAr: "دعوة إلهية",
    icon: PhoneCall,
    colorClass: "text-blue-700 dark:text-blue-300",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40",
    badgeBorder: "border-blue-300 dark:border-blue-800",
    badgeText: "text-blue-800 dark:text-blue-200",
  },
  anointing: {
    id: "anointing",
    labelEn: "Anointing",
    labelAr: "مسحة مقدسة",
    icon: Crown,
    colorClass: "text-amber-600 dark:text-amber-300",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeBorder: "border-[#D4AF37]",
    badgeText: "text-[#800020] dark:text-[#F3E5AB]",
  },
  coronation: {
    id: "coronation",
    labelEn: "Coronation",
    labelAr: "تتويج ملكي",
    icon: Crown,
    colorClass: "text-yellow-600 dark:text-yellow-400",
    badgeBg: "bg-yellow-50 dark:bg-yellow-950/40",
    badgeBorder: "border-yellow-400 dark:border-yellow-700",
    badgeText: "text-yellow-900 dark:text-yellow-200",
  },
  reign: {
    id: "reign",
    labelEn: "Reign",
    labelAr: "فترة حكم / ملك",
    icon: Award,
    colorClass: "text-indigo-700 dark:text-indigo-300",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeBorder: "border-indigo-300 dark:border-indigo-800",
    badgeText: "text-indigo-800 dark:text-indigo-200",
  },
  exile: {
    id: "exile",
    labelEn: "Exile",
    labelAr: "سبي وتغريب",
    icon: LogOut,
    colorClass: "text-gray-700 dark:text-gray-300",
    badgeBg: "bg-gray-100 dark:bg-gray-900/60",
    badgeBorder: "border-gray-300 dark:border-gray-700",
    badgeText: "text-gray-800 dark:text-gray-200",
  },
  return: {
    id: "return",
    labelEn: "Return",
    labelAr: "رجوع من السبي",
    icon: LogIn,
    colorClass: "text-emerald-700 dark:text-emerald-300",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeBorder: "border-emerald-300 dark:border-emerald-800",
    badgeText: "text-emerald-800 dark:text-emerald-200",
  },
  building: {
    id: "building",
    labelEn: "Building / Construction",
    labelAr: "بناء وتشييد",
    icon: Hammer,
    colorClass: "text-stone-700 dark:text-stone-300",
    badgeBg: "bg-stone-100 dark:bg-stone-900/50",
    badgeBorder: "border-stone-300 dark:border-stone-700",
    badgeText: "text-stone-800 dark:text-stone-200",
  },
  destruction: {
    id: "destruction",
    labelEn: "Destruction",
    labelAr: "خراب وهدم",
    icon: Building2,
    colorClass: "text-red-700 dark:text-red-400",
    badgeBg: "bg-red-50 dark:bg-red-950/40",
    badgeBorder: "border-red-300 dark:border-red-800",
    badgeText: "text-red-800 dark:text-red-200",
  },
  burial: {
    id: "burial",
    labelEn: "Burial",
    labelAr: "دفن وقبر",
    icon: Box,
    colorClass: "text-stone-600 dark:text-stone-400",
    badgeBg: "bg-stone-100 dark:bg-stone-900/50",
    badgeBorder: "border-stone-300 dark:border-stone-700",
    badgeText: "text-stone-700 dark:text-stone-300",
  },
  meeting: {
    id: "meeting",
    labelEn: "Meeting",
    labelAr: "لقاء واجتماع",
    icon: Users,
    colorClass: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40",
    badgeBorder: "border-blue-300 dark:border-blue-800",
    badgeText: "text-blue-800 dark:text-blue-200",
  },
  birth_of_nation: {
    id: "birth_of_nation",
    labelEn: "Birth of Nation",
    labelAr: "نشأة أمة وشعب",
    icon: Flag,
    colorClass: "text-amber-700 dark:text-amber-300",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeBorder: "border-amber-300 dark:border-amber-800",
    badgeText: "text-amber-800 dark:text-amber-200",
  },
  division_of_nations: {
    id: "division_of_nations",
    labelEn: "Division of Nations",
    labelAr: "انقسام الشعوب والأمم",
    icon: Divide,
    colorClass: "text-orange-600 dark:text-orange-400",
    badgeBg: "bg-orange-50 dark:bg-orange-950/40",
    badgeBorder: "border-orange-300 dark:border-orange-800",
    badgeText: "text-orange-800 dark:text-orange-200",
  },
  treaty: {
    id: "treaty",
    labelEn: "Treaty",
    labelAr: "معاهدة وحلف",
    icon: FileCheck,
    colorClass: "text-teal-700 dark:text-teal-300",
    badgeBg: "bg-teal-50 dark:bg-teal-950/40",
    badgeBorder: "border-teal-300 dark:border-teal-800",
    badgeText: "text-teal-800 dark:text-teal-200",
  },
  famine: {
    id: "famine",
    labelEn: "Famine",
    labelAr: "مجاعة وقحط",
    icon: WheatOff,
    colorClass: "text-amber-800 dark:text-amber-300",
    badgeBg: "bg-amber-100/70 dark:bg-amber-950/50",
    badgeBorder: "border-amber-400 dark:border-amber-700",
    badgeText: "text-amber-900 dark:text-amber-100",
  },
  plague: {
    id: "plague",
    labelEn: "Plague",
    labelAr: "ضربة ووباء",
    icon: Biohazard,
    colorClass: "text-red-700 dark:text-red-400",
    badgeBg: "bg-red-50 dark:bg-red-950/40",
    badgeBorder: "border-red-300 dark:border-red-800",
    badgeText: "text-red-800 dark:text-red-200",
  },
  natural_event: {
    id: "natural_event",
    labelEn: "Natural Event",
    labelAr: "حدث طبيعي / كوني",
    icon: CloudLightning,
    colorClass: "text-sky-700 dark:text-sky-300",
    badgeBg: "bg-sky-50 dark:bg-sky-950/40",
    badgeBorder: "border-sky-300 dark:border-sky-800",
    badgeText: "text-sky-800 dark:text-sky-200",
  },
  historical_event: {
    id: "historical_event",
    labelEn: "Historical Event",
    labelAr: "حدث تاريخي",
    icon: History,
    colorClass: "text-stone-700 dark:text-stone-300",
    badgeBg: "bg-stone-50 dark:bg-stone-900/50",
    badgeBorder: "border-stone-300 dark:border-stone-700",
    badgeText: "text-stone-800 dark:text-stone-200",
  },
  other: {
    id: "other",
    labelEn: "Other",
    labelAr: "أخرى",
    icon: HelpCircle,
    colorClass: "text-stone-600 dark:text-stone-400",
    badgeBg: "bg-stone-50 dark:bg-stone-900/40",
    badgeBorder: "border-stone-200 dark:border-stone-700",
    badgeText: "text-stone-700 dark:text-stone-300",
  },
};

export const ALL_EVENT_TYPES: EventType[] = [
  "birth",
  "death",
  "marriage",
  "genealogy",
  "journey",
  "migration",
  "battle",
  "war",
  "covenant",
  "prophecy",
  "vision",
  "dream",
  "divine_appearance",
  "miracle",
  "judgment",
  "sin_rebellion",
  "worship",
  "sacrifice",
  "offering",
  "calling",
  "anointing",
  "coronation",
  "reign",
  "exile",
  "return",
  "building",
  "destruction",
  "burial",
  "meeting",
  "birth_of_nation",
  "division_of_nations",
  "treaty",
  "famine",
  "plague",
  "natural_event",
  "historical_event",
  "other",
];

export function getEventTypeDefinition(type?: EventType | string): EventTypeDefinition {
  if (type && type in BIBLICAL_EVENT_TYPES) {
    return BIBLICAL_EVENT_TYPES[type as EventType];
  }
  return BIBLICAL_EVENT_TYPES.other;
}

export function getEventTypeLabel(type?: EventType | string, lang: Language = "en"): string {
  const def = getEventTypeDefinition(type);
  return lang === "ar" ? def.labelAr : def.labelEn;
}

export function guessEventTypeForLegacyEvent(event: {
  id?: string;
  title?: string;
  description?: string;
}): EventType {
  const text = `${event.id || ""} ${event.title || ""} ${event.description || ""}`.toLowerCase();
  if (text.includes("birth") || text.includes("born") || text.includes("ولد") || text.includes("ميلاد")) {
    return "birth";
  }
  if (text.includes("death") || text.includes("died") || text.includes("وفاة") || text.includes("موت") || text.includes("وفاه")) {
    return "death";
  }
  if (text.includes("burial") || text.includes("buried") || text.includes("دفن") || text.includes("قبر") || text.includes("مغارة") || text.includes("machpelah")) {
    return "burial";
  }
  if (text.includes("marriage") || text.includes("wedding") || text.includes("زواج") || text.includes("عرس") || text.includes("اقتران")) {
    return "marriage";
  }
  if (text.includes("covenant") || text.includes("عهد")) {
    return "covenant";
  }
  if (text.includes("destruction") || text.includes("destroy") || text.includes("خراب") || text.includes("دمار") || text.includes("sodom") || text.includes("سدوم") || text.includes("عمورة") || text.includes("gomorrah")) {
    return "destruction";
  }
  if (text.includes("flood") || text.includes("طوفان") || text.includes("creation") || text.includes("خليقة")) {
    return "natural_event";
  }
  if (text.includes("judgment") || text.includes("دينونة") || text.includes("قضاء") || text.includes("عقاب")) {
    return "judgment";
  }
  if (text.includes("fall") || text.includes("سقوط") || text.includes("sin") || text.includes("rebel") || text.includes("معصية")) {
    return "sin_rebellion";
  }
  if (text.includes("calling") || text.includes("دعوة") || text.includes("نداء")) {
    return "calling";
  }
  if (text.includes("vision") || text.includes("رؤيا") || text.includes("رؤية")) {
    return "vision";
  }
  if (text.includes("dream") || text.includes("حلم") || text.includes("أحلام")) {
    return "dream";
  }
  if (text.includes("miracle") || text.includes("معجزة") || text.includes("عجيبة")) {
    return "miracle";
  }
  if (text.includes("worship") || text.includes("عبادة") || text.includes("مذبح") || text.includes("altar")) {
    return "worship";
  }
  if (text.includes("sacrifice") || text.includes("ذبيحة") || text.includes("محرقة") || text.includes("offering") || text.includes("قربان")) {
    return "sacrifice";
  }
  if (text.includes("journey") || text.includes("travel") || text.includes("رحلة")) {
    return "journey";
  }
  if (text.includes("leaves ur") || text.includes("migration") || text.includes("ارتحال") || text.includes("هجرة")) {
    return "migration";
  }
  if (text.includes("battle") || text.includes("معركة")) {
    return "battle";
  }
  if (text.includes("war") || text.includes("حرب")) {
    return "war";
  }
  if (text.includes("famine") || text.includes("مجاعة")) {
    return "famine";
  }
  if (text.includes("plague") || text.includes("ضربة") || text.includes("وباء")) {
    return "plague";
  }
  if (text.includes("building") || text.includes("build") || text.includes("بناء") || text.includes("برج") || text.includes("tower") || text.includes("babel") || text.includes("بابل")) {
    return "building";
  }
  if (text.includes("exile") || text.includes("سبي")) {
    return "exile";
  }
  if (text.includes("return") || text.includes("رجوع")) {
    return "return";
  }
  return "other";
}
