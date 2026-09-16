export interface BiblicalLandOption {
  id: string;
  name: string;
  arabicName: string;
  type: "country" | "city";
  region: string;
}

export const BIBLICAL_COUNTRIES: BiblicalLandOption[] = [
  { id: "canaan", name: "Canaan", arabicName: "كنعان", type: "country", region: "Canaan & Levant" },
  { id: "egypt", name: "Egypt", arabicName: "مصر", type: "country", region: "Egypt & Sinai" },
  { id: "sinai", name: "Sinai Peninsula", arabicName: "شبه جزيرة سيناء", type: "country", region: "Egypt & Sinai" },
  { id: "mesopotamia", name: "Mesopotamia (Paddan-Aram)", arabicName: "بلاد ما بين النهرين (فدان أرام)", type: "country", region: "Mesopotamia & Assyria" },
  { id: "assyria", name: "Assyria", arabicName: "أشور", type: "country", region: "Mesopotamia & Assyria" },
  { id: "babylonia", name: "Babylonia (Chaldea)", arabicName: "بابل (أرض الكلدانيين)", type: "country", region: "Babylonia" },
  { id: "persia_media", name: "Persia & Media", arabicName: "فارس ومادي", type: "country", region: "Persia & Media" },
  { id: "arabia", name: "Arabia", arabicName: "بلاد العرب", type: "country", region: "Arabia" },
  { id: "midian", name: "Midian", arabicName: "مديان", type: "country", region: "Arabia" },
  { id: "moab", name: "Moab", arabicName: "موآب", type: "country", region: "Canaan & Levant" },
  { id: "edom", name: "Edom (Mt. Seir)", arabicName: "أدوم (جبل سعير)", type: "country", region: "Canaan & Levant" },
  { id: "ammon", name: "Ammon", arabicName: "عمون", type: "country", region: "Canaan & Levant" },
  { id: "philistia", name: "Philistia", arabicName: "أرض الفلسطينيين", type: "country", region: "Canaan & Levant" },
  { id: "syria_aram", name: "Syria (Aram)", arabicName: "بلاد الشام (آرام)", type: "country", region: "Canaan & Levant" },
  { id: "phoenicia", name: "Phoenicia / Lebanon", arabicName: "فينيقيا / لبنان", type: "country", region: "Canaan & Levant" },
  { id: "anatolia", name: "Asia Minor / Anatolia", arabicName: "آسيا الصغرى / الأناضول", type: "country", region: "Mesopotamia & Assyria" },
];

export const BIBLICAL_CITIES: BiblicalLandOption[] = [
  // Egypt & Sinai
  { id: "thebes", name: "Thebes (No-Amon)", arabicName: "طيبة (نو-آمون)", type: "city", region: "Egypt & Sinai" },
  { id: "memphis", name: "Memphis (Noph)", arabicName: "ممفيس (نوف)", type: "city", region: "Egypt & Sinai" },
  { id: "rameses", name: "Rameses (Goshen)", arabicName: "رعمسيس (أرض جاسان)", type: "city", region: "Egypt & Sinai" },
  { id: "sinai_mt", name: "Mt. Sinai (Horeb)", arabicName: "جبل سيناء (حوريب)", type: "city", region: "Egypt & Sinai" },
  { id: "eziongeber", name: "Ezion-Geber", arabicName: "عصيون جابر", type: "city", region: "Egypt & Sinai" },
  
  // Canaan & Levant
  { id: "jerusalem", name: "Jerusalem", arabicName: "أورشليم القدس", type: "city", region: "Canaan & Levant" },
  { id: "hebron", name: "Hebron", arabicName: "حبرون (الخليل)", type: "city", region: "Canaan & Levant" },
  { id: "beersheba", name: "Beersheba", arabicName: "بئر السبع", type: "city", region: "Canaan & Levant" },
  { id: "jericho", name: "Jericho", arabicName: "أريحا", type: "city", region: "Canaan & Levant" },
  { id: "shechem", name: "Shechem", arabicName: "شكيم (نابلس)", type: "city", region: "Canaan & Levant" },
  { id: "samaria", name: "Samaria", arabicName: "السامرة", type: "city", region: "Canaan & Levant" },
  { id: "bethel", name: "Bethel", arabicName: "بيت إيل", type: "city", region: "Canaan & Levant" },
  { id: "shiloh", name: "Shiloh", arabicName: "شيلوه", type: "city", region: "Canaan & Levant" },
  { id: "dan", name: "Dan", arabicName: "دان", type: "city", region: "Canaan & Levant" },
  { id: "gaza", name: "Gaza", arabicName: "غزة", type: "city", region: "Canaan & Levant" },
  { id: "joppa", name: "Joppa", arabicName: "يافا", type: "city", region: "Canaan & Levant" },
  { id: "tyre", name: "Tyre", arabicName: "صور", type: "city", region: "Canaan & Levant" },
  { id: "sidon", name: "Sidon", arabicName: "صيدون", type: "city", region: "Canaan & Levant" },
  { id: "damascus", name: "Damascus", arabicName: "دمشق", type: "city", region: "Canaan & Levant" },
  { id: "rabbah", name: "Rabbah (Ammon)", arabicName: "ربة عمون (عَمّان)", type: "city", region: "Canaan & Levant" },
  { id: "kirhareseth", name: "Kir-hareseth (Moab)", arabicName: "قير حارسة (الكرك)", type: "city", region: "Canaan & Levant" },

  // Mesopotamia & Assyria
  { id: "haran", name: "Haran", arabicName: "حاران", type: "city", region: "Mesopotamia & Assyria" },
  { id: "nineveh", name: "Nineveh", arabicName: "نينوى", type: "city", region: "Mesopotamia & Assyria" },
  { id: "asshur", name: "Asshur", arabicName: "آشور", type: "city", region: "Mesopotamia & Assyria" },
  { id: "calah", name: "Calah (Nimrud)", arabicName: "كالح (نمرود)", type: "city", region: "Mesopotamia & Assyria" },
  { id: "carchemish", name: "Carchemish", arabicName: "كركميش", type: "city", region: "Mesopotamia & Assyria" },

  // Babylonia
  { id: "babylon", name: "Babylon", arabicName: "بابل", type: "city", region: "Babylonia" },
  { id: "ur", name: "Ur of the Chaldees", arabicName: "أور الكلدانيين", type: "city", region: "Babylonia" },
  { id: "erech", name: "Erech (Uruk)", arabicName: "أوروك (أرك)", type: "city", region: "Babylonia" },

  // Arabia
  { id: "dedan", name: "Dedan", arabicName: "ددان (العُلا)", type: "city", region: "Arabia" },
  { id: "tema", name: "Tema", arabicName: "تيماء", type: "city", region: "Arabia" },

  // Persia & Media
  { id: "susa", name: "Susa (Shushan)", arabicName: "شوشن (شوشان)", type: "city", region: "Persia & Media" },
  { id: "ecbatana", name: "Ecbatana", arabicName: "إكباتانا (أحمدان)", type: "city", region: "Persia & Media" },
  { id: "persepolis", name: "Persepolis", arabicName: "برسيبوليس", type: "city", region: "Persia & Media" },
];

export const ALL_BIBLICAL_PLACES = [...BIBLICAL_COUNTRIES, ...BIBLICAL_CITIES];
