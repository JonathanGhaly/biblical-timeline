import type { Language } from "../types/genealogy";

export interface BibleBookDefinition {
  canonicalEn: string;
  canonicalAr: string;
  chapterSingularEn?: string;
  chapterSingularAr?: string;
  aliasesEn: string[];
  aliasesAr: string[];
}

export const BIBLE_BOOKS: BibleBookDefinition[] = [
  // =========================================================================
  // THE PENTATEUCH / LAW (توراه موسى)
  // =========================================================================
  {
    canonicalEn: "Genesis",
    canonicalAr: "التكوين",
    aliasesEn: ["genesis", "gen", "ge", "gn"],
    aliasesAr: ["التكوين", "تكوين", "سفر التكوين", "سفر تكوين", "تك"],
  },
  {
    canonicalEn: "Exodus",
    canonicalAr: "الخروج",
    aliasesEn: ["exodus", "exod", "ex", "exo"],
    aliasesAr: ["الخروج", "خروج", "سفر الخروج", "سفر خروج", "خر"],
  },
  {
    canonicalEn: "Leviticus",
    canonicalAr: "اللاويين",
    aliasesEn: ["leviticus", "lev", "le", "lv"],
    aliasesAr: ["اللاويين", "لاويين", "سفر اللاويين", "سفر لاويين", "لا"],
  },
  {
    canonicalEn: "Numbers",
    canonicalAr: "العدد",
    aliasesEn: ["numbers", "num", "nu", "nm", "nb"],
    aliasesAr: ["العدد", "عدد", "سفر العدد", "سفر عدد", "عد"],
  },
  {
    canonicalEn: "Deuteronomy",
    canonicalAr: "التثنية",
    aliasesEn: ["deuteronomy", "deut", "dt", "de"],
    aliasesAr: ["التثنية", "تثنية", "سفر التثنية", "سفر تثنية", "تث"],
  },

  // =========================================================================
  // HISTORICAL BOOKS (الأسفار التاريخية)
  // =========================================================================
  {
    canonicalEn: "Joshua",
    canonicalAr: "يشوع",
    aliasesEn: ["joshua", "josh", "jos", "jsh"],
    aliasesAr: ["يشوع", "سفر يشوع", "يش"],
  },
  {
    canonicalEn: "Judges",
    canonicalAr: "القضاة",
    aliasesEn: ["judges", "judg", "jdg", "jg", "jgs"],
    aliasesAr: ["القضاة", "قضاة", "سفر القضاة", "سفر قضاة", "قض"],
  },
  {
    canonicalEn: "Ruth",
    canonicalAr: "راعوث",
    aliasesEn: ["ruth", "rth", "ru"],
    aliasesAr: ["راعوث", "سفر راعوث", "را"],
  },
  {
    canonicalEn: "1 Samuel",
    canonicalAr: "1 صموئيل",
    aliasesEn: ["1 samuel", "1 sam", "1sa", "1s", "1 sm", "first samuel", "i samuel", "i sam"],
    aliasesAr: [
      "1 صموئيل",
      "1صموئيل",
      "صموئيل الأول",
      "صموئيل الاول",
      "صموئيل 1",
      "1 صم",
      "1صم",
      "صم 1",
      "سفر صموئيل الأول",
      "سفر صموئيل الاول",
    ],
  },
  {
    canonicalEn: "2 Samuel",
    canonicalAr: "2 صموئيل",
    aliasesEn: ["2 samuel", "2 sam", "2sa", "2s", "2 sm", "second samuel", "ii samuel", "ii sam"],
    aliasesAr: [
      "2 صموئيل",
      "2صموئيل",
      "صموئيل الثاني",
      "صموئيل 2",
      "2 صم",
      "2صم",
      "صم 2",
      "سفر صموئيل الثاني",
    ],
  },
  {
    canonicalEn: "1 Kings",
    canonicalAr: "1 ملوك",
    aliasesEn: ["1 kings", "1 kgs", "1ki", "1k", "1 kin", "first kings", "i kings", "i kgs"],
    aliasesAr: [
      "1 ملوك",
      "1ملوك",
      "الملوك الأول",
      "الملوك الاول",
      "ملوك 1",
      "1 مل",
      "1مل",
      "مل 1",
      "سفر الملوك الأول",
      "سفر الملوك الاول",
    ],
  },
  {
    canonicalEn: "2 Kings",
    canonicalAr: "2 ملوك",
    aliasesEn: ["2 kings", "2 kgs", "2ki", "2k", "2 kin", "second kings", "ii kings", "ii kgs"],
    aliasesAr: [
      "2 ملوك",
      "2ملوك",
      "الملوك الثاني",
      "ملوك 2",
      "2 مل",
      "2مل",
      "مل 2",
      "سفر الملوك الثاني",
    ],
  },
  {
    canonicalEn: "1 Chronicles",
    canonicalAr: "1 أخبار الأيام",
    aliasesEn: ["1 chronicles", "1 chron", "1ch", "1 chr", "first chronicles", "i chronicles", "i chron"],
    aliasesAr: [
      "1 أخبار الأيام",
      "1 اخبار الايام",
      "1 أخبار",
      "1 اخبار",
      "أخبار الأيام الأول",
      "اخبار الايام الاول",
      "أخبار الأيام 1",
      "اخبار الايام 1",
      "1 أخ",
      "1 اخ",
      "1أخ",
      "1اخ",
      "سفر أخبار الأيام الأول",
      "سفر اخبار الايام الاول",
    ],
  },
  {
    canonicalEn: "2 Chronicles",
    canonicalAr: "2 أخبار الأيام",
    aliasesEn: ["2 chronicles", "2 chron", "2ch", "2 chr", "second chronicles", "ii chronicles", "ii chron"],
    aliasesAr: [
      "2 أخبار الأيام",
      "2 اخبار الايام",
      "2 أخبار",
      "2 اخبار",
      "أخبار الأيام الثاني",
      "اخبار الايام الثاني",
      "أخبار الأيام 2",
      "اخبار الايام 2",
      "2 أخ",
      "2 اخ",
      "2أخ",
      "2اخ",
      "سفر أخبار الأيام الثاني",
      "سفر اخبار الايام الثاني",
    ],
  },
  {
    canonicalEn: "Ezra",
    canonicalAr: "عزرا",
    aliasesEn: ["ezra", "ezr", "ez"],
    aliasesAr: ["عزرا", "سفر عزرا", "عز"],
  },
  {
    canonicalEn: "Nehemiah",
    canonicalAr: "نحميا",
    aliasesEn: ["nehemiah", "neh", "ne"],
    aliasesAr: ["نحميا", "سفر نحميا", "نح"],
  },
  {
    canonicalEn: "Tobit",
    canonicalAr: "طوبيا",
    aliasesEn: ["tobit", "tob"],
    aliasesAr: ["طوبيا", "سفر طوبيا", "طوب"],
  },
  {
    canonicalEn: "Judith",
    canonicalAr: "يهوديت",
    aliasesEn: ["judith", "jdt", "jth"],
    aliasesAr: ["يهوديت", "سفر يهوديت"],
  },
  {
    canonicalEn: "Esther",
    canonicalAr: "أستير",
    aliasesEn: ["esther", "esth", "es"],
    aliasesAr: ["أستير", "استير", "سفر أستير", "سفر استير", "أس", "اس"],
  },
  {
    canonicalEn: "1 Maccabees",
    canonicalAr: "1 مكابيين",
    aliasesEn: ["1 maccabees", "1 macc", "1 mac", "1ma", "1m"],
    aliasesAr: ["1 مكابيين", "1مكابيين", "المكابيين الأول", "المكابيين الاول", "1 مك", "1مك"],
  },
  {
    canonicalEn: "2 Maccabees",
    canonicalAr: "2 مكابيين",
    aliasesEn: ["2 maccabees", "2 macc", "2 mac", "2ma", "2m"],
    aliasesAr: ["2 مكابيين", "2مكابيين", "المكابيين الثاني", "2 مك", "2مك"],
  },

  // =========================================================================
  // WISDOM & POETICAL BOOKS (الأسفار الشعرية والحكمية)
  // =========================================================================
  {
    canonicalEn: "Job",
    canonicalAr: "أيوب",
    aliasesEn: ["job", "jb"],
    aliasesAr: ["أيوب", "ايوب", "سفر أيوب", "سفر ايوب", "أي", "اي"],
  },
  {
    canonicalEn: "Psalms",
    canonicalAr: "المزامير",
    chapterSingularEn: "Psalm",
    chapterSingularAr: "مزمور",
    aliasesEn: ["psalms", "psalm", "psa", "ps", "pss"],
    aliasesAr: ["المزامير", "مزامير", "المزمور", "مزمور", "سفر المزامير", "مز"],
  },
  {
    canonicalEn: "Proverbs",
    canonicalAr: "الأمثال",
    aliasesEn: ["proverbs", "prov", "prv", "pr"],
    aliasesAr: ["الأمثال", "الامثال", "أمثال", "امثال", "سفر الأمثال", "سفر الامثال", "أم", "ام"],
  },
  {
    canonicalEn: "Ecclesiastes",
    canonicalAr: "الجامعة",
    aliasesEn: ["ecclesiastes", "eccles", "ecc", "ec", "qoh", "qoheleth"],
    aliasesAr: ["الجامعة", "جامعة", "سفر الجامعة", "جا"],
  },
  {
    canonicalEn: "Song of Solomon",
    canonicalAr: "نشيد الأنشاد",
    aliasesEn: [
      "song of solomon",
      "song of songs",
      "canticles",
      "canticle",
      "song",
      "sos",
      "so",
    ],
    aliasesAr: [
      "نشيد الأنشاد",
      "نشيد الانشاد",
      "نشيد الأناشيد",
      "نشيد الاناشيد",
      "سفر نشيد الأنشاد",
      "سفر نشيد الانشاد",
      "النشيد",
      "نش",
    ],
  },
  {
    canonicalEn: "Wisdom of Solomon",
    canonicalAr: "حكمة سليمان",
    aliasesEn: ["wisdom of solomon", "wisdom", "wis"],
    aliasesAr: ["حكمة سليمان", "سفر حكمة سليمان", "الحكمة", "حكمة", "حك"],
  },
  {
    canonicalEn: "Sirach",
    canonicalAr: "يشوع بن سيراخ",
    aliasesEn: ["sirach", "ecclesiasticus", "sir"],
    aliasesAr: ["يشوع بن سيراخ", "سيراخ", "سفر يشوع بن سيراخ", "سر"],
  },

  // =========================================================================
  // PROPHETS (الأنبياء)
  // =========================================================================
  {
    canonicalEn: "Isaiah",
    canonicalAr: "إشعياء",
    aliasesEn: ["isaiah", "isa", "is"],
    aliasesAr: ["إشعياء", "اشعياء", "سفر إشعياء", "سفر اشعياء", "إش", "اش"],
  },
  {
    canonicalEn: "Jeremiah",
    canonicalAr: "إرميا",
    aliasesEn: ["jeremiah", "jer", "je", "jr"],
    aliasesAr: ["إرميا", "ارميا", "سفر إرميا", "سفر ارميا", "إر", "ار"],
  },
  {
    canonicalEn: "Lamentations",
    canonicalAr: "مراثي إرميا",
    aliasesEn: ["lamentations", "lam", "la"],
    aliasesAr: [
      "مراثي إرميا",
      "مراثي ارميا",
      "المراثي",
      "مراثي",
      "سفر مراثي إرميا",
      "مر",
    ],
  },
  {
    canonicalEn: "Baruch",
    canonicalAr: "باروخ",
    aliasesEn: ["baruch", "bar"],
    aliasesAr: ["باروخ", "سفر باروخ", "بار"],
  },
  {
    canonicalEn: "Ezekiel",
    canonicalAr: "حزقيال",
    aliasesEn: ["ezekiel", "ezek", "eze", "ezk"],
    aliasesAr: ["حزقيال", "سفر حزقيال", "حز"],
  },
  {
    canonicalEn: "Daniel",
    canonicalAr: "دانيال",
    aliasesEn: ["daniel", "dan", "da", "dn"],
    aliasesAr: ["دانيال", "سفر دانيال", "دا"],
  },
  {
    canonicalEn: "Hosea",
    canonicalAr: "هوشع",
    aliasesEn: ["hosea", "hos", "ho"],
    aliasesAr: ["هوشع", "سفر هوشع", "هو"],
  },
  {
    canonicalEn: "Joel",
    canonicalAr: "يوئيل",
    aliasesEn: ["joel", "joe", "jl"],
    aliasesAr: ["يوئيل", "سفر يوئيل", "يؤ"],
  },
  {
    canonicalEn: "Amos",
    canonicalAr: "عاموس",
    aliasesEn: ["amos", "amo", "am"],
    aliasesAr: ["عاموس", "سفر عاموس", "عا"],
  },
  {
    canonicalEn: "Obadiah",
    canonicalAr: "عوبديا",
    aliasesEn: ["obadiah", "obad", "ob"],
    aliasesAr: ["عوبديا", "سفر عوبديا", "عو"],
  },
  {
    canonicalEn: "Jonah",
    canonicalAr: "يونان",
    aliasesEn: ["jonah", "jon", "jnh"],
    aliasesAr: ["يونان", "سفر يونان", "يون"],
  },
  {
    canonicalEn: "Micah",
    canonicalAr: "ميخا",
    aliasesEn: ["micah", "mic", "mc"],
    aliasesAr: ["ميخا", "سفر ميخا", "مي"],
  },
  {
    canonicalEn: "Nahum",
    canonicalAr: "ناحوم",
    aliasesEn: ["nahum", "nah", "na"],
    aliasesAr: ["ناحوم", "سفر ناحوم", "نا"],
  },
  {
    canonicalEn: "Habakkuk",
    canonicalAr: "حبقوق",
    aliasesEn: ["habakkuk", "hab", "hb"],
    aliasesAr: ["حبقوق", "سفر حبقوق", "حب"],
  },
  {
    canonicalEn: "Zephaniah",
    canonicalAr: "صفنيا",
    aliasesEn: ["zephaniah", "zeph", "zep", "zp"],
    aliasesAr: ["صفنيا", "سفر صفنيا", "صف"],
  },
  {
    canonicalEn: "Haggai",
    canonicalAr: "حجي",
    aliasesEn: ["haggai", "hag", "hg"],
    aliasesAr: ["حجي", "سفر حجي", "حج"],
  },
  {
    canonicalEn: "Zechariah",
    canonicalAr: "زكريا",
    aliasesEn: ["zechariah", "zech", "zec", "zc"],
    aliasesAr: ["زكريا", "سفر زكريا", "زك"],
  },
  {
    canonicalEn: "Malachi",
    canonicalAr: "ملاخي",
    aliasesEn: ["malachi", "mal", "ml"],
    aliasesAr: ["ملاخي", "سفر ملاخي", "ملخ"],
  },

  // =========================================================================
  // NEW TESTAMENT (العهد الجديد)
  // =========================================================================
  {
    canonicalEn: "Matthew",
    canonicalAr: "متى",
    aliasesEn: ["matthew", "matt", "mt"],
    aliasesAr: ["متى", "إنجيل متى", "انجيل متى", "مت"],
  },
  {
    canonicalEn: "Mark",
    canonicalAr: "مرقس",
    aliasesEn: ["mark", "mk", "mrk"],
    aliasesAr: ["مرقس", "إنجيل مرقس", "انجيل مرقس", "مر"],
  },
  {
    canonicalEn: "Luke",
    canonicalAr: "لوقا",
    aliasesEn: ["luke", "lk", "luk"],
    aliasesAr: ["لوقا", "إنجيل لوقا", "انجيل لوقا", "لو"],
  },
  {
    canonicalEn: "John",
    canonicalAr: "يوحنا",
    aliasesEn: ["john", "jn", "joh"],
    aliasesAr: ["يوحنا", "إنجيل يوحنا", "انجيل يوحنا", "يو"],
  },
  {
    canonicalEn: "Acts",
    canonicalAr: "أعمال الرسل",
    aliasesEn: ["acts", "act", "acts of the apostles"],
    aliasesAr: ["أعمال الرسل", "اعمال الرسل", "الأعمال", "أعمال", "اعمال", "أع", "اع"],
  },
  {
    canonicalEn: "Romans",
    canonicalAr: "رومية",
    aliasesEn: ["romans", "rom", "ro", "rm"],
    aliasesAr: ["رومية", "رسالة رومية", "رو"],
  },
  {
    canonicalEn: "1 Corinthians",
    canonicalAr: "1 كورنثوس",
    aliasesEn: ["1 corinthians", "1 cor", "1co", "1c"],
    aliasesAr: ["1 كورنثوس", "1كورنثوس", "كورنثوس الأولى", "كورنثوس الاولى", "1 كو", "1كو", "1 كور"],
  },
  {
    canonicalEn: "2 Corinthians",
    canonicalAr: "2 كورنثوس",
    aliasesEn: ["2 corinthians", "2 cor", "2co", "2c"],
    aliasesAr: ["2 كورنثوس", "2كورنثوس", "كورنثوس الثانية", "2 كو", "2كو", "2 كور"],
  },
  {
    canonicalEn: "Galatians",
    canonicalAr: "غلاطية",
    aliasesEn: ["galatians", "gal", "ga"],
    aliasesAr: ["غلاطية", "رسالة غلاطية", "غل"],
  },
  {
    canonicalEn: "Ephesians",
    canonicalAr: "أفسس",
    aliasesEn: ["ephesians", "eph", "ep"],
    aliasesAr: ["أفسس", "افسس", "رسالة أفسس", "رسالة افسس", "أف", "اف"],
  },
  {
    canonicalEn: "Philippians",
    canonicalAr: "فيلبي",
    aliasesEn: ["philippians", "phil", "php", "pp"],
    aliasesAr: ["فيلبي", "رسالة فيلبي", "في"],
  },
  {
    canonicalEn: "Colossians",
    canonicalAr: "كولوسي",
    aliasesEn: ["colossians", "col", "co"],
    aliasesAr: ["كولوسي", "رسالة كولوسي", "كو"],
  },
  {
    canonicalEn: "1 Thessalonians",
    canonicalAr: "1 تسالونيكي",
    aliasesEn: ["1 thessalonians", "1 thess", "1th", "1ts"],
    aliasesAr: ["1 تسالونيكي", "1تسالونيكي", "تسالونيكي الأولى", "تسالونيكي الاولى", "1 تس", "1تس"],
  },
  {
    canonicalEn: "2 Thessalonians",
    canonicalAr: "2 تسالونيكي",
    aliasesEn: ["2 thessalonians", "2 thess", "2th", "2ts"],
    aliasesAr: ["2 تسالونيكي", "2تسالونيكي", "تسالونيكي الثانية", "2 تس", "2تس"],
  },
  {
    canonicalEn: "1 Timothy",
    canonicalAr: "1 تيموثاوس",
    aliasesEn: ["1 timothy", "1 tim", "1ti", "1t"],
    aliasesAr: ["1 تيموثاوس", "1تيموثاوس", "تيموثاوس الأولى", "تيموثاوس الاولى", "1 تي", "1تي"],
  },
  {
    canonicalEn: "2 Timothy",
    canonicalAr: "2 تيموثاوس",
    aliasesEn: ["2 timothy", "2 tim", "2ti", "2t"],
    aliasesAr: ["2 تيموثاوس", "2تيموثاوس", "تيموثاوس الثانية", "2 تي", "2تي"],
  },
  {
    canonicalEn: "Titus",
    canonicalAr: "تيطس",
    aliasesEn: ["titus", "tit", "ti"],
    aliasesAr: ["تيطس", "رسالة تيطس", "تي"],
  },
  {
    canonicalEn: "Philemon",
    canonicalAr: "فليمون",
    aliasesEn: ["philemon", "phlm", "phm", "pm"],
    aliasesAr: ["فليمون", "رسالة فليمون", "فل"],
  },
  {
    canonicalEn: "Hebrews",
    canonicalAr: "العبرانيين",
    aliasesEn: ["hebrews", "heb", "he"],
    aliasesAr: ["العبرانيين", "عبرانيين", "رسالة العبرانيين", "عب"],
  },
  {
    canonicalEn: "James",
    canonicalAr: "يعقوب",
    aliasesEn: ["james", "jas", "jm"],
    aliasesAr: ["يعقوب", "رسالة يعقوب", "يع"],
  },
  {
    canonicalEn: "1 Peter",
    canonicalAr: "1 بطرس",
    aliasesEn: ["1 peter", "1 pet", "1pe", "1p", "1 pt"],
    aliasesAr: ["1 بطرس", "1بطرس", "بطرس الأولى", "بطرس الاولى", "1 بط", "1بط"],
  },
  {
    canonicalEn: "2 Peter",
    canonicalAr: "2 بطرس",
    aliasesEn: ["2 peter", "2 pet", "2pe", "2p", "2 pt"],
    aliasesAr: ["2 بطرس", "2بطرس", "بطرس الثانية", "2 بط", "2بط"],
  },
  {
    canonicalEn: "1 John",
    canonicalAr: "1 يوحنا",
    aliasesEn: ["1 john", "1 jn", "1jo", "1j"],
    aliasesAr: ["1 يوحنا", "1يوحنا", "يوحنا الأولى", "يوحنا الاولى", "1 يو", "1يو"],
  },
  {
    canonicalEn: "2 John",
    canonicalAr: "2 يوحنا",
    aliasesEn: ["2 john", "2 jn", "2jo", "2j"],
    aliasesAr: ["2 يوحنا", "2يوحنا", "يوحنا الثانية", "2 يو", "2يو"],
  },
  {
    canonicalEn: "3 John",
    canonicalAr: "3 يوحنا",
    aliasesEn: ["3 john", "3 jn", "3jo", "3j"],
    aliasesAr: ["3 يوحنا", "3يوحنا", "يوحنا الثالثة", "3 يو", "3يو"],
  },
  {
    canonicalEn: "Jude",
    canonicalAr: "يهوذا",
    aliasesEn: ["jude", "jud", "jd"],
    aliasesAr: ["يهوذا", "رسالة يهوذا", "يه"],
  },
  {
    canonicalEn: "Revelation",
    canonicalAr: "الرؤيا",
    aliasesEn: ["revelation", "rev", "re", "apocalypse"],
    aliasesAr: ["الرؤيا", "رؤيا يوحنا", "سفر الرؤيا", "رؤ"],
  },
];

// Helper to normalize Arabic characters for robust matching
export function normalizeArabicKey(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0640]/g, "") // remove tashkeel and tatweel
    .replace(/[أإآ]/g, "ا") // normalize alefs
    .replace(/ة/g, "ه") // normalize teh marbuta
    .replace(/ى/g, "ي") // normalize alef maksura
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660)) // Arabic-Indic digits
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06F0)) // Eastern Arabic-Indic digits
    .toLowerCase()
    .trim();
}

export function normalizeEnglishKey(text: string): string {
  return text
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06F0))
    .toLowerCase()
    .trim();
}

interface CompiledAlias {
  pattern: RegExp;
  book: BibleBookDefinition;
  rawAlias: string;
  isArabic: boolean;
}

// Compile all aliases sorted by length descending so multi-word aliases match first
const COMPILED_ALIASES: CompiledAlias[] = (() => {
  const list: { rawAlias: string; book: BibleBookDefinition; isArabic: boolean }[] = [];

  for (const book of BIBLE_BOOKS) {
    // English canonical & aliases
    const enAliases = new Set<string>([
      book.canonicalEn,
      book.chapterSingularEn || "",
      ...book.aliasesEn,
    ]);
    for (const a of enAliases) {
      if (!a) continue;
      list.push({ rawAlias: a, book, isArabic: false });
    }

    // Arabic canonical & aliases
    const arAliases = new Set<string>([
      book.canonicalAr,
      book.chapterSingularAr || "",
      ...book.aliasesAr,
    ]);
    for (const a of arAliases) {
      if (!a) continue;
      list.push({ rawAlias: a, book, isArabic: true });
    }
  }

  // Sort descending by raw string length
  list.sort((a, b) => b.rawAlias.length - a.rawAlias.length);

  return list.map(({ rawAlias, book, isArabic }) => {
    // Escape regex special characters
    const escaped = rawAlias.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

    if (isArabic) {
      // Also generate variant without hamza or tashkeel
      const norm = normalizeArabicKey(rawAlias).replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const combinedPattern = norm !== escaped ? `(?:${escaped}|${norm})` : escaped;
      // Preceded by start or whitespace/punctuation, followed by end, whitespace, punctuation, or digit
      const pattern = new RegExp(
        `^\\s*(?:سفر|رسالة|انجيل|إنجيل)?\\s*(${combinedPattern})(?=$|[\\s\\d:.,;،؛\\-\\–\\—])`,
        "i"
      );
      return { pattern, book, rawAlias, isArabic };
    } else {
      const pattern = new RegExp(`^\\s*(${escaped})\\b`, "i");
      return { pattern, book, rawAlias, isArabic };
    }
  });
})();

/**
 * Standardizes Arabic/English digits into standard Latin digits 0-9.
 */
function convertDigitsToLatin(str: string): string {
  return str
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06F0));
}

/**
 * Normalizes numbers and chapter/verse delimiters for Arabic RTL rendering:
 * e.g., "11:28" -> "11: 28" (adds space after colon for clean RTL legibility)
 * "and" -> "و", "to" -> "إلى"
 */
function formatChapterVerseArabic(str: string): string {
  let res = convertDigitsToLatin(str);
  // Add space after colon if followed by digits
  res = res.replace(/:\s*(\d)/g, ": $1");
  // Replace words
  res = res.replace(/\band\b/gi, "و");
  res = res.replace(/\bto\b/gi, "إلى");
  // Normalize dashes
  res = res.replace(/\s*([–—])\s*/g, " - ");
  return res.trim();
}

/**
 * Normalizes numbers and chapter/verse delimiters for English LTR rendering:
 * e.g., "11: 28" -> "11:28" (compact chapter:verse)
 * "و" -> "and", "إلى" -> "to"
 */
function formatChapterVerseEnglish(str: string): string {
  let res = convertDigitsToLatin(str);
  // Remove space after colon in numbers: 11: 28 -> 11:28
  res = res.replace(/:\s+(\d)/g, ":$1");
  // Replace Arabic conjunctions
  res = res.replace(/\s+و\s+/g, " and ");
  res = res.replace(/\s+إلى\s+/g, " to ");
  res = res.replace(/\s*([–—])\s*/g, " - ");
  return res.trim();
}

/**
 * Extracts a biblical book match at the beginning of a text segment.
 */
function matchBookAtStart(
  text: string
): { book: BibleBookDefinition; matchedLength: number } | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // First try direct regex test with our compiled aliases
  for (const item of COMPILED_ALIASES) {
    const match = item.pattern.exec(trimmed);
    if (match) {
      return {
        book: item.book,
        matchedLength: match[0].length,
      };
    }
  }

  // Second pass: try with normalized Arabic text if not matched yet
  const norm = normalizeArabicKey(trimmed);
  for (const item of COMPILED_ALIASES) {
    if (!item.isArabic) continue;
    const match = item.pattern.exec(norm);
    if (match) {
      return {
        book: item.book,
        matchedLength: match[0].length,
      };
    }
  }

  return null;
}

/**
 * Localizes a single biblical reference string (or comma/semicolon-separated list)
 * into either Arabic or English, regardless of whether the original input was English or Arabic.
 *
 * Examples:
 *   localizeBiblicalReference("Genesis 11:28-31", "ar") -> "التكوين 11: 28-31"
 *   localizeBiblicalReference("تكوين 11: 28-31", "en") -> "Genesis 11:28-31"
 *   localizeBiblicalReference("Psalm 122:6", "ar")      -> "مزمور 122: 6"
 *   localizeBiblicalReference("مزمور 122: 6", "en")     -> "Psalm 122:6"
 *   localizeBiblicalReference("Exodus 12:37, Numbers 33:3", "ar") -> "الخروج 12: 37، العدد 33: 3"
 *   localizeBiblicalReference("الخروج 12: 37، العدد 33: 3", "en") -> "Exodus 12:37, Numbers 33:3"
 *   localizeBiblicalReference("Genesis 11:31, 15:7", "ar") -> "التكوين 11: 31، 15: 7"
 *   localizeBiblicalReference("تكوين 11: 31، 15: 7", "en") -> "Genesis 11:31, 15:7"
 */
export function localizeBiblicalReference(ref: string, lang: Language): string {
  if (!ref || typeof ref !== "string") return "";
  const trimmed = ref.trim();
  if (!trimmed) return "";

  // Split by top-level delimiters (commas and semicolons, in Latin and Arabic)
  const tokens = trimmed.split(/([,;،؛]+)/);

  let currentBook: BibleBookDefinition | null = null;
  const resultParts: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // If it's a delimiter token
    if (i % 2 === 1) {
      if (lang === "ar") {
        // Arabic delimiter: semicolons become "؛ ", commas become "، "
        const isSemi = token.includes(";") || token.includes("؛");
        resultParts.push(isSemi ? "؛ " : "، ");
      } else {
        // English delimiter: semicolons become "; ", commas become ", "
        const isSemi = token.includes(";") || token.includes("؛");
        resultParts.push(isSemi ? "; " : ", ");
      }
      continue;
    }

    const seg = token.trim();
    if (!seg) continue;

    // Check if this segment begins with a biblical book name
    const match = matchBookAtStart(seg);

    if (match) {
      currentBook = match.book;
      const remainder = seg.slice(match.matchedLength).trim();

      if (lang === "ar") {
        // Special case: for Psalms, if chapter number follows, use "مزمور"
        const hasNumbers = /\d/.test(remainder);
        const bookName =
          currentBook.canonicalEn === "Psalms" && hasNumbers
            ? currentBook.chapterSingularAr || "مزمور"
            : currentBook.canonicalAr;

        if (remainder) {
          const formattedCv = formatChapterVerseArabic(remainder);
          resultParts.push(`${bookName} ${formattedCv}`.trim());
        } else {
          resultParts.push(bookName);
        }
      } else {
        // English
        const hasNumbers = /\d/.test(remainder);
        const bookName =
          currentBook.canonicalEn === "Psalms" && hasNumbers
            ? currentBook.chapterSingularEn || "Psalm"
            : currentBook.canonicalEn;

        if (remainder) {
          const formattedCv = formatChapterVerseEnglish(remainder);
          resultParts.push(`${bookName} ${formattedCv}`.trim());
        } else {
          resultParts.push(bookName);
        }
      }
    } else if (currentBook) {
      // Continuation of the preceding book in a compound citation (e.g., "15:7" in "Genesis 11:31, 15:7")
      if (lang === "ar") {
        resultParts.push(formatChapterVerseArabic(seg));
      } else {
        resultParts.push(formatChapterVerseEnglish(seg));
      }
    } else {
      // No book matched and no preceding book: just format numbers/colons cleanly
      if (lang === "ar") {
        resultParts.push(formatChapterVerseArabic(seg));
      } else {
        resultParts.push(formatChapterVerseEnglish(seg));
      }
    }
  }

  return resultParts.join("").trim();
}

/**
 * Localizes an array of biblical references.
 */
export function localizeBiblicalReferences(
  refs: string[] | undefined,
  lang: Language
): string[] {
  if (!refs || !Array.isArray(refs)) return [];
  return refs.map((r) => localizeBiblicalReference(r, lang));
}

/**
 * Determines whether a reference query matches a target reference string
 * in either Arabic or English.
 */
export function matchesBiblicalSearch(targetRef: string, query: string): boolean {
  if (!targetRef || !query) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const raw = targetRef.toLowerCase();
  const ar = localizeBiblicalReference(targetRef, "ar").toLowerCase();
  const en = localizeBiblicalReference(targetRef, "en").toLowerCase();

  const normQ = normalizeArabicKey(q);
  const normAr = normalizeArabicKey(ar);

  return (
    raw.includes(q) ||
    ar.includes(q) ||
    en.includes(q) ||
    normAr.includes(normQ) ||
    normQ.includes(normAr)
  );
}
