import type { Person, BiblicalEvent, Language } from "../types/genealogy";

export const BIBLICAL_NAMES_ARABIC: Record<string, string> = {
  adam: "آدم",
  eve: "حواء",
  cain: "قايين",
  abel: "هابيل",
  seth: "شيث",
  enosh: "أنوش",
  kenan: "قينان",
  mahalalel: "مهللئيل",
  jared: "يارد",
  enoch: "أخنوخ",
  methuselah: "متوشالح",
  lamech: "لامك",
  noah: "نوح",
  shem: "سام",
  ham: "حام",
  japheth: "يافث",
  terah: "تارح",
  abraham: "إبراهيم",
  sarah: "سارة",
  hagar: "هاجر",
  lot: "لوط",
  ishmael: "إسماعيل",
  isaac: "إسحاق",
  rebekah: "رفقة",
  esau: "عيسو",
  jacob: "يعقوب",
  leah: "ليئة",
  rachel: "راحيل",
  bilhah: "بلهة",
  zilpah: "زلفة",
  reuben: "رأوبين",
  simeon: "شمعون",
  levi: "لاوي",
  judah: "يهوذا",
  dan: "دان",
  naphtali: "نفتالي",
  gad: "جاد",
  asher: "أشير",
  issachar: "يساكر",
  zebulun: "زبولون",
  joseph: "يوسف",
  benjamin: "بنيامين",
  ephraim: "أفرايم",
  manasseh: "منسى",
  moses: "موسى",
  aaron: "هارون",
  miriam: "مريم",
  joshua: "يشوع",
  david: "داود",
  solomon: "سليمان",
};

export const BIBLICAL_EVENTS_ARABIC: Record<string, { title: string; description?: string }> = {
  creation: {
    title: "الخلق",
    description: "قصة خلق العالم والإنسان في سفر التكوين.",
  },
  fall: {
    title: "السقوط",
    description: "أكل آدم وحواء من شجرة معرفة الخير والشر والخروج من الجنة.",
  },
  flood: {
    title: "الطوفان العظيم",
    description: "طوفان نوح وتجديد العهد الإلهي مع البشرية.",
  },
  "tower-of-babel": {
    title: "برج بابل",
    description: "بلبلة الألسن وتفرق الشعوب في الأرض.",
  },
  "call-of-abraham": {
    title: "دعوة إبراهيم",
    description: "دعوة الله لإبراهيم للخروج من أور الكلدانيين إلى أرض الموعد.",
  },
  "abraham-covenant": {
    title: "العهد مع إبراهيم",
    description: "تأسيس الله عهد النسل والبركة مع أبي الآباء إبراهيم.",
  },
  "isaac-birth": {
    title: "ميلاد إسحاق",
    description: "ولادة ابن الموعد إسحاق لإبراهيم وسارة في شيخوختهما.",
  },
};

export const UI_TRANSLATIONS = {
  en: {
    appTitle: "Biblical Timeline",
    appSubtitle: "Old Testament Genealogy & Historical Chronology",
    copticTradition: "Coptic Heritage Edition",
    navDashboard: "Dashboard",
    navPeople: "Patriarchs & People",
    navFamilyTree: "Genealogy Tree",
    navLifespans: "Lifespans & Events",
    navTimeline: "Chronology Timeline",
    navEvents: "Biblical Events",
    navMap: "Ancient Near East Map",
    
    // Actions & Sync
    exportJson: "Export JSON",
    resetData: "Reset Data",
    gistSync: "Gist Database",
    gistLive: "Live Gist Connected",
    gistCached: "Local Storage (Offline)",
    gistSyncing: "Syncing...",
    gistPending: "Pending Sync",
    gistConfigure: "Configure Gist Database",
    saveToGist: "Save & Push to Gist",
    refreshFromGist: "Pull Latest from Gist",
    
    // Stats & Dashboard
    totalPeople: "Biblical Figures",
    totalEvents: "Historical Events",
    generationsSpan: "Generations Recorded",
    earliestDate: "Earliest Era",
    recentEvents: "Key Biblical Events",
    exploreDescription: "Explore the sacred lineage from Adam through the Patriarchs, with accurate biblical lifespans, genealogies, and historical events documented in the Scriptures.",
    
    // People Page
    peopleTitle: "Biblical Figures & Patriarchs",
    peopleSubtitle: "Search and explore individuals recorded in the Old Testament Scriptures.",
    addPerson: "+ Add Person",
    editPerson: "Edit",
    deletePerson: "Delete",
    searchPeoplePlaceholder: "Search by English or Arabic name...",
    gender: "Gender",
    male: "Male",
    female: "Female",
    lifespan: "Lifespan",
    years: "years",
    birth: "Birth",
    death: "Death",
    marriedAt: "Married at age",
    father: "Father",
    mother: "Mother",
    spouse: "Spouse",
    references: "Biblical References",
    notes: "Historical / Theological Notes",
    
    // Modal Titles
    addPersonModalTitle: "Add New Biblical Figure",
    editPersonModalTitle: "Edit Biblical Figure",
    nameEn: "Name (English)",
    nameAr: "Name (Arabic)",
    notesEn: "Notes (English)",
    notesAr: "Notes (Arabic)",
    fatherSelect: "Father (Generation Above)",
    motherSelect: "Mother",
    spouseSelect: "Spouse (Current Generation)",
    anchorPerson: "Reference / Father Person",
    anchorAgeLabel: "Age of Reference Person at Birth",
    yearsLivedLabel: "Total Lifespan (Years Lived)",
    placeOfBirthLabel: "Place of Birth / City",
    cancel: "Cancel",
    save: "Save",
    
    // Events
    eventsTitle: "Biblical Events",
    eventsSubtitle: "Historical milestones, covenants, and sacred epochs.",
    addEvent: "+ Add Event",
    editEvent: "Edit Event",
    eventTitleEn: "Title (English)",
    eventTitleAr: "Title (Arabic)",
    eventDescEn: "Description (English)",
    eventDescAr: "Description (Arabic)",
    year: "Year",
    era: "Era",
    bc: "BC",
    ad: "AD",
    location: "Location",
    associatedPeople: "Associated People",
    
    // Tree & Timeline
    treeTitle: "Sacred Lineage & Family Tree",
    treeSubtitle: "Hierarchical view distinguishing Parent Generations (Mother & Father) from Spouses and Descendants.",
    parentGeneration: "Parents (Prior Generation)",
    marriageGeneration: "Patriarch & Marriage Union",
    childrenGeneration: "Children (Next Generation)",
    noChildren: "No children recorded in database",
    rootCreation: "Created / Root",
    
    // Settings / Gist Modal
    gistSettingsTitle: "GitHub Gist Database Connection",
    gistSettingsDesc: "The application uses a live GitHub Gist as its remote database for seamless read and write operations.",
    gistIdLabel: "Target Gist ID",
    githubTokenLabel: "GitHub Personal Access Token (Optional for write access)",
    githubTokenHelp: "To commit changes directly to the remote Gist, provide a token with 'gist' scope. Read operations work publicly without a token.",
    statusConnected: "Connected to Gist ID: ",
    lastUpdated: "Last synchronized:",
    saveSettings: "Save Settings & Re-sync",
    copyJson: "Copy Raw JSON",
    jsonCopied: "JSON Copied!",
  },
  ar: {
    appTitle: "الخط الزمني الكتابي",
    appSubtitle: "سلسلة أنساب العهد القديم والتسلسل الزمني التاريخي",
    copticTradition: "إصدار التراث القبطي الأرثوذكسي",
    navDashboard: "لوحة المعلومات",
    navPeople: "الآباء والشخصيات",
    navFamilyTree: "شجرة الأنساب",
    navLifespans: "الأعمار والأحداث",
    navTimeline: "الخط الزمني",
    navEvents: "الأحداث الكتابية",
    navMap: "خريطة الشرق الأدنى القديم",
    
    // Actions & Sync
    exportJson: "تصدير JSON",
    resetData: "إعادة الضبط",
    gistSync: "قاعدة بيانات الجيست",
    gistLive: "متصل بالجيست المباشر",
    gistCached: "تخزين محلي (دون إنترنت)",
    gistSyncing: "جاري المزامنة...",
    gistPending: "تعديلات قيد المزامنة",
    gistConfigure: "إعدادات قاعدة بيانات Gist",
    saveToGist: "حفظ ونشر على الجيست",
    refreshFromGist: "تحديث من الجيست",
    
    // Stats & Dashboard
    totalPeople: "الشخصيات المسجلة",
    totalEvents: "الأحداث التاريخية",
    generationsSpan: "الأجيال الموثقة",
    earliestDate: "أقدم حقبة",
    recentEvents: "أبرز الأحداث الكتابية",
    exploreDescription: "استكشف الأنساب المقدسة من آدم مروراً بالآباء الأولين، مع أعمار دقيقة وتواريخ الأنساب والأحداث التاريخية الموثقة في الأسفار الإلهية.",
    
    // People Page
    peopleTitle: "شخصيات وآباء العهد القديم",
    peopleSubtitle: "ابحث واستكشف الشخصيات المسجلة في أسفار العهد القديم.",
    addPerson: "+ إضافة شخصية",
    editPerson: "تعديل",
    deletePerson: "حذف",
    searchPeoplePlaceholder: "ابحث بالاسم العربي أو الإنجليزي...",
    gender: "الجنس",
    male: "ذكر",
    female: "أنثى",
    lifespan: "العمر الكلي",
    years: "سنة",
    birth: "الميلاد",
    death: "الوفاة",
    marriedAt: "تزوج في عمر",
    father: "الأب",
    mother: "الأم",
    spouse: "الزوج / الزوجة",
    references: "الشواهد الكتابية",
    notes: "ملاحظات تاريخية ولاهوتية",
    
    // Modal Titles
    addPersonModalTitle: "إضافة شخصية كتابية جديدة",
    editPersonModalTitle: "تعديل بيانات الشخصية الكتابية",
    nameEn: "الاسم (باللغة الإنجليزية)",
    nameAr: "الاسم (باللغة العربية)",
    notesEn: "الملاحظات (باللغة الإنجليزية)",
    notesAr: "الملاحظات (باللغة العربية)",
    fatherSelect: "الأب (الجيل السابق)",
    motherSelect: "الأم",
    spouseSelect: "الزوج / الزوجة (الجيل الحالي)",
    anchorPerson: "الشخص المرجعي / الأب",
    anchorAgeLabel: "عمر الأب/المرجع عند ولادته",
    yearsLivedLabel: "إجمالي سنوات العمر",
    placeOfBirthLabel: "مكان الميلاد / المدينة",
    cancel: "إلغاء",
    save: "حفظ",
    
    // Events
    eventsTitle: "الأحداث الكتابية",
    eventsSubtitle: "المحطات التاريخية والعهود الإلهية والحقب المقدسة.",
    addEvent: "+ إضافة حدث",
    editEvent: "تعديل الحدث",
    eventTitleEn: "عنوان الحدث (إنجليزي)",
    eventTitleAr: "عنوان الحدث (عربي)",
    eventDescEn: "الوصف (إنجليزي)",
    eventDescAr: "الوصف (عربي)",
    year: "السنة",
    era: "الحقبة",
    bc: "ق.م",
    ad: "م",
    location: "المكان",
    associatedPeople: "الشخصيات المرتبطة",
    
    // Tree & Timeline
    treeTitle: "سلسلة الأنساب وشجرة العائلة المقدسة",
    treeSubtitle: "عرض تسلسلي هرمي يميز بين جيل الآباء (الأب والأم) وجيل الزواج الحالي والأبناء.",
    parentGeneration: "جيل الآباء (الجيل السابق)",
    marriageGeneration: "الأب ورابطة الزواج",
    childrenGeneration: "الأبناء (الجيل اللاحق)",
    noChildren: "لا يوجد أبناء مسجلون في قاعدة البيانات",
    rootCreation: "بداية الخليقة",
    
    // Settings / Gist Modal
    gistSettingsTitle: "الاتصال بقاعدة بيانات GitHub Gist",
    gistSettingsDesc: "يعتمد التطبيق على GitHub Gist كقاعدة بيانات حية مباشرة لعمليات القراءة والتحديث.",
    gistIdLabel: "معرّف الجيست (Gist ID)",
    githubTokenLabel: "رمز الوصول الشخصي من GitHub (اختياري للكتابة والتعديل)",
    githubTokenHelp: "لتطبيق التعديلات وحفظها مباشرة في الجيست، يمكنك إدخال رمز وصول يحتوي على صلاحية 'gist'. القراءة تتم دون الحاجة لرمز.",
    statusConnected: "متصل بالجيست معرّف: ",
    lastUpdated: "آخر مزامنة:",
    saveSettings: "حفظ الإعدادات والمزامنة",
    copyJson: "نسخ ملف JSON",
    jsonCopied: "تم نسخ JSON بنجاح!",
  },
};

export function getPersonDisplayName(person: Person, lang: Language): string {
  if (lang === "ar") {
    if (person.arabicName && person.arabicName.trim()) {
      return person.arabicName;
    }
    const mapped = BIBLICAL_NAMES_ARABIC[person.id.toLowerCase()] ||
      BIBLICAL_NAMES_ARABIC[person.name.toLowerCase()];
    if (mapped) return mapped;
    return person.name;
  }
  return person.name;
}

export function getPersonDisplayNotes(person: Person, lang: Language): string | undefined {
  if (lang === "ar") {
    if (person.arabicNotes && person.arabicNotes.trim()) {
      return person.arabicNotes;
    }
  }
  return person.notes;
}

export function getEventDisplayTitle(event: BiblicalEvent, lang: Language): string {
  if (lang === "ar") {
    if (event.arabicTitle && event.arabicTitle.trim()) {
      return event.arabicTitle;
    }
    const mapped = BIBLICAL_EVENTS_ARABIC[event.id.toLowerCase()];
    if (mapped?.title) return mapped.title;
    return event.title;
  }
  return event.title;
}

export function getEventDisplayDescription(event: BiblicalEvent, lang: Language): string | undefined {
  if (lang === "ar") {
    if (event.arabicDescription && event.arabicDescription.trim()) {
      return event.arabicDescription;
    }
    const mapped = BIBLICAL_EVENTS_ARABIC[event.id.toLowerCase()];
    if (mapped?.description) return mapped.description;
    return event.description;
  }
  return event.description;
}

export function formatYearDisplay(year: number | undefined, lang: Language): string {
  if (year === undefined || year === null) return "—";
  const absYear = Math.abs(year);
  if (year < 0) {
    return lang === "ar" ? `${absYear} ق.م.` : `${absYear} BC`;
  }
  return lang === "ar" ? `${absYear} م.` : `${absYear} AD`;
}
