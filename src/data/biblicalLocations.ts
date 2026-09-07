import type { BiblicalLocation } from "../types/genealogy";

export const BIBLICAL_LOCATIONS: BiblicalLocation[] = [
  // === MESOPOTAMIA ===
  {
    id: "ur",
    name: "Ur of the Chaldees",
    arabicName: "أور الكلدانيين",
    modernName: "Tell el-Muqayyar, Dhi Qar, Iraq",
    coordinates: [30.9622, 46.1044],
    region: "Mesopotamia",
    biblicalEra: "Patriarchal",
    keyEvents: ["abraham-covenant"],
    description:
      "Ancient Sumerian metropolis on the Euphrates and birthplace of Abram (Abraham) before his divine pilgrimage to Canaan via Haran.",
    arabicDescription:
      "مدينة سومرية عريقة على نهر الفرات ومسقط رأس أبينا إبراهيم (أبرام) وتارح أبيه قبل الارتحال الإلهي إلى حاران ثم أرض الموعد كنعان.",
    biblicalReferences: ["Genesis 11:28-31", "Genesis 15:7", "Nehemiah 9:7"],
  },
  {
    id: "haran",
    name: "Haran (Paddan-Aram)",
    arabicName: "حاران / فدان أرام",
    modernName: "Harran, Şanlıurfa Province, Turkey",
    coordinates: [36.864, 39.031],
    region: "Mesopotamia",
    biblicalEra: "Patriarchal",
    keyEvents: ["abraham-covenant"],
    description:
      "Crucial staging hub on the Balikh river where Terah settled and died, and where God called Abraham to leave his kindred. Later home of Laban and Rebekah.",
    arabicDescription:
      "محطة تجارية رئيسية على نهر البليخ حيث سكن تارح ومات، وفيها دعا الرب إبراهيم للرحيل نحو أرض كنعان. وهي موطن لابان ورفقة وزوجات يعقوب.",
    biblicalReferences: ["Genesis 11:31", "Genesis 12:1-4", "Genesis 28:10", "Genesis 29:4"],
  },
  {
    id: "babylon",
    name: "Babylon (Babel)",
    arabicName: "بابل (برج بابل)",
    modernName: "Hillah, Babil Governorate, Iraq",
    coordinates: [32.5364, 44.4208],
    region: "Mesopotamia",
    biblicalEra: "Patriarchal",
    keyEvents: ["creation"],
    description:
      "Fabled Mesopotamian capital in Shinar where humanity attempted to construct the Tower of Babel, resulting in the confusion of tongues.",
    arabicDescription:
      "العاصمة البابلية في أرض شنعار حيث شرع البشر في بناء برج بابل فبلبل الرب ألسنتهم وشتتهم على وجه الأرض كلها.",
    biblicalReferences: ["Genesis 10:10", "Genesis 11:1-9", "2 Kings 24-25", "Daniel 1:1"],
  },
  {
    id: "nineveh",
    name: "Nineveh",
    arabicName: "نينوى",
    modernName: "Mosul, Nineveh Governorate, Iraq",
    coordinates: [36.3667, 43.15],
    region: "Mesopotamia",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Imperial capital of the ancient Assyrian Empire on the eastern bank of the Tigris River, famous for the repentance mission of Jonah the prophet.",
    arabicDescription:
      "عاصمة الإمبراطورية الآشورية العظمى على الضفة الشرقية لنهر دجلة، المشهورة بتوبة أهلها العظيمة إثر كرازة يونان النبي.",
    biblicalReferences: ["Genesis 10:11", "Jonah 1:2", "Jonah 3:1-10", "Nahum 1:1"],
  },
  {
    id: "erech",
    name: "Erech (Uruk)",
    arabicName: "أروك (الوركاء)",
    modernName: "Warka, Al-Muthanna Governorate, Iraq",
    coordinates: [31.3259, 45.6374],
    region: "Mesopotamia",
    biblicalEra: "Patriarchal",
    keyEvents: [],
    description:
      "One of the earliest cradle cities of world civilization, founded in the realm of Nimrod in the land of Shinar.",
    arabicDescription:
      "من أقدم مدن الحضارة الإنسانية ومهد الكتابة، تأسست ضمن مملكة نمرود الجبار في أرض شنعار.",
    biblicalReferences: ["Genesis 10:10"],
  },
  {
    id: "calah",
    name: "Calah (Nimrud)",
    arabicName: "كالح (نمرود)",
    modernName: "Nimrud, Nineveh Governorate, Iraq",
    coordinates: [36.096, 43.332],
    region: "Mesopotamia",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Major royal stronghold of the Assyrian kings between the Tigris and the Great Zab river, built by Asshur.",
    arabicDescription:
      "حصن ملكي رئيسي لملوك آشور بين نهر دجلة ونهر الزاب الكبير، شيدها آشور بعد خروجه من شنعار.",
    biblicalReferences: ["Genesis 10:11-12"],
  },
  {
    id: "asshur",
    name: "Asshur (Ashur)",
    arabicName: "آشور",
    modernName: "Qal'at Sherqat, Saladin Governorate, Iraq",
    coordinates: [35.458, 43.256],
    region: "Mesopotamia",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Original religious capital and sacred sanctuary of the Assyrian realm overlooking the Tigris River.",
    arabicDescription:
      "العاصمة الدينية والتاريخية الأولى للآشوريين والمقدس الحصين المطل على نهر دجلة.",
    biblicalReferences: ["Genesis 10:11", "Numbers 24:22"],
  },

  // === CANAAN ===
  {
    id: "jerusalem",
    name: "Jerusalem (Salem / Jebus / Zion)",
    arabicName: "أورشليم (شاليم / يبوس / صهيون)",
    modernName: "City of David & Old City, Jerusalem",
    coordinates: [31.7767, 35.2342],
    region: "Canaan",
    biblicalEra: "United Monarchy",
    keyEvents: ["abraham-covenant"],
    description:
      "Holy City where Melchizedek blessed Abraham, conquered by King David from the Jebusites, and chosen site of Solomon's Holy Temple on Mount Moriah.",
    arabicDescription:
      "مدينة السلام حيث بارك ملكي صادق أبانا إبراهيم، فتحها داود الملك من اليبوسيين وجعلها عاصمة المملكة، وبنى فيها سليمان الهيكل المقدس على جبل المريا.",
    biblicalReferences: ["Genesis 14:18", "2 Samuel 5:6-10", "1 Kings 6:1", "Psalm 122:6"],
  },
  {
    id: "hebron",
    name: "Hebron (Kiriath-Arba / Mamre)",
    arabicName: "حبرون (قرية أربع / بلوطات ممرا)",
    modernName: "Al-Khalil, West Bank",
    coordinates: [31.5326, 35.0998],
    region: "Canaan",
    biblicalEra: "Patriarchal",
    keyEvents: ["abraham-covenant", "isaac-birth"],
    description:
      "Dwelling place of Abraham by the Oaks of Mamre, location of the Cave of Machpelah (burial tomb of the Patriarchs and Matriarchs), and David's first capital.",
    arabicDescription:
      "مقر إقامة إبراهيم عند بلوطات ممرا، وموقع مغارة المكفيلة (مدفن الآباء إبراهيم وإسحق ويعقوب وسارة ورفقة وليئة)، وأول عاصمة لملك داود لسبع سنين.",
    biblicalReferences: ["Genesis 13:18", "Genesis 23:1-20", "Genesis 25:9-10", "2 Samuel 2:1-4"],
  },
  {
    id: "shechem",
    name: "Shechem",
    arabicName: "شكيم",
    modernName: "Tell Balata, Nablus, West Bank",
    coordinates: [32.213, 35.282],
    region: "Canaan",
    biblicalEra: "Patriarchal",
    keyEvents: ["abraham-covenant"],
    description:
      "First stop of Abraham in Canaan where God promised 'To your offspring I will give this land.' Location of Jacob's Well and burial place of Joseph's bones.",
    arabicDescription:
      "أول محطة لإبراهيم في أرض كنعان حيث وعده الرب 'لنسلك أعطي هذه الأرض' فبنى مذبحاً للرب، وبجوارها بئر يعقوب ومدفن عظام يوسف الصديق.",
    biblicalReferences: ["Genesis 12:6-7", "Genesis 33:18-20", "Joshua 24:32", "John 4:5-6"],
  },
  {
    id: "beersheba",
    name: "Beersheba",
    arabicName: "بئر سبع",
    modernName: "Tel Be'er Sheva, Negev, Israel",
    coordinates: [31.2529, 34.7915],
    region: "Canaan",
    biblicalEra: "Patriarchal",
    keyEvents: ["isaac-birth"],
    description:
      "Southern boundary marker of the Promised Land ('from Dan to Beersheba'), where Abraham and Abimelech swore an oath of covenant and planted a tamarisk tree.",
    arabicDescription:
      "الحد الجنوبي لأرض الميعاد ('من دان إلى بئر سبع')، حيث حلف إبراهيم وأبيمالك عهد سلام وغرس إبراهيم أثلاً ودعا باسم الرب الإله السرمدي.",
    biblicalReferences: ["Genesis 21:31-33", "Genesis 26:31-33", "1 Kings 19:3"],
  },
  {
    id: "bethel",
    name: "Bethel (Luz)",
    arabicName: "بيت إيل (لوز)",
    modernName: "Beitin, Ramallah and al-Bireh, West Bank",
    coordinates: [31.93, 35.24],
    region: "Canaan",
    biblicalEra: "Patriarchal",
    keyEvents: [],
    description:
      "Sanctuary of vision where Jacob dreamed of the heavenly ladder with angels ascending and descending, naming it 'Bethel' (House of God).",
    arabicDescription:
      "موضع الرؤيا الإلهية حيث رأى يعقوب السلم المنصوب إلى السماء والملائكة صاعدة ونازلة عليه، فدعاه 'بيت إيل' (بيت الله وباب السماء).",
    biblicalReferences: ["Genesis 12:8", "Genesis 28:10-22", "Genesis 35:1-7"],
  },
  {
    id: "jericho",
    name: "Jericho",
    arabicName: "أريحا (مدينة النخيل)",
    modernName: "Tell es-Sultan, Jericho, West Bank",
    coordinates: [31.8717, 35.4446],
    region: "Canaan",
    biblicalEra: "Exodus",
    keyEvents: [],
    description:
      "Ancient fortified oasis city near the Jordan River whose formidable walls miraculously collapsed before Joshua and the Ark of the Covenant.",
    arabicDescription:
      "أقدم واحة محصنة بجوار نهر الأردن سقطت أسوارها العظيمة بأمر إلهي أمام يشوع وتابوت عهد الرب بعد الطواف حولها سبعة أيام.",
    biblicalReferences: ["Joshua 6:1-27", "Deuteronomy 34:3", "Luke 19:1-10"],
  },
  {
    id: "shiloh",
    name: "Shiloh",
    arabicName: "شيلوه",
    modernName: "Khirbet Seilun, West Bank",
    coordinates: [32.055, 35.289],
    region: "Canaan",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Central religious shrine of the Tabernacle and the Ark of the Covenant for over three centuries during the era of the Judges and early prophet Samuel.",
    arabicDescription:
      "المقر المقدس لخيمة الاجتماع وتابوت العهد لأكثر من ثلاثة قرون في عصر القضاة وبداية خدمة صموئيل النبي.",
    biblicalReferences: ["Joshua 18:1", "1 Samuel 1:3", "1 Samuel 3:21", "Jeremiah 7:12"],
  },
  {
    id: "dan",
    name: "Dan (Laish)",
    arabicName: "دان (لايش)",
    modernName: "Tel Dan, Upper Galilee, Israel",
    coordinates: [33.249, 35.652],
    region: "Canaan",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Northernmost frontier settlement of ancient Israel, fed by the headwaters of the Jordan River.",
    arabicDescription:
      "الحد الشمالي لأرض إسرائيل القديمة، عند ينابيع نهر الأردن الرئيسية.",
    biblicalReferences: ["Judges 18:27-29", "1 Kings 12:28-30"],
  },
  {
    id: "samaria",
    name: "Samaria (Shomron)",
    arabicName: "السامرة (شومرون)",
    modernName: "Sebastia, Nablus Governorate, West Bank",
    coordinates: [32.276, 35.188],
    region: "Canaan",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Strategic hilltop capital of the Northern Kingdom of Israel founded by King Omri and fortified by Ahab.",
    arabicDescription:
      "العاصمة الجبلية الحصينة لمملكة إسرائيل الشمالية، بناها الملك عمري وحصنها أخآب.",
    biblicalReferences: ["1 Kings 16:24", "2 Kings 17:5-6"],
  },
  {
    id: "tyre",
    name: "Tyre (Sour)",
    arabicName: "صور",
    modernName: "Tyre, South Governorate, Lebanon",
    coordinates: [33.27, 35.203],
    region: "Canaan",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Maritime Phoenician island port ruled by King Hiram, who supplied cedar timbers and master craftsmen for David's palace and Solomon's Temple.",
    arabicDescription:
      "الميناء الفينيقي العريق الذي حكمه حيرام ملك صور، وأمد داود وسليمان بأخشاب الأرز والصناع المهرة لبناء قصر الملك وهيكل الرب.",
    biblicalReferences: ["2 Samuel 5:11", "1 Kings 5:1-12", "Ezekiel 27"],
  },
  {
    id: "sidon",
    name: "Sidon (Saida)",
    arabicName: "صيدون",
    modernName: "Sidon, South Governorate, Lebanon",
    coordinates: [33.56, 35.375],
    region: "Canaan",
    biblicalEra: "Patriarchal",
    keyEvents: [],
    description:
      "Legendary coastal Phoenician city named after Canaan's firstborn son, renowned for purple dyeing, glassmaking, and seafaring trade.",
    arabicDescription:
      "المدينة الساحلية الشهيرة المنسوبة لبكر كنعان، تميزت بصناعة الصباغ الأرجواني والزجاج والتجارة البحرية الدولية.",
    biblicalReferences: ["Genesis 10:15", "Joshua 19:28", "1 Kings 16:31"],
  },
  {
    id: "gaza",
    name: "Gaza",
    arabicName: "غزة",
    modernName: "Gaza City, Gaza Strip",
    coordinates: [31.5017, 34.4668],
    region: "Canaan",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Key Philistine coastal stronghold of the Pentapolis, famous in the biblical narrative of Samson and Delilah.",
    arabicDescription:
      "معقل ساحلي حصين من مدن الفلسطينيين الخمس العظمى، واشتهرت بقصة شمشون ودليلة.",
    biblicalReferences: ["Judges 16:1-30", "1 Samuel 6:17"],
  },
  {
    id: "joppa",
    name: "Joppa (Jaffa)",
    arabicName: "يافا",
    modernName: "Jaffa, Tel Aviv, Israel",
    coordinates: [32.05, 34.75],
    region: "Canaan",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Ancient natural Mediterranean port where cedar rafts from Lebanon were landed for the construction of Solomon's Temple, and where Jonah fled to Tarshish.",
    arabicDescription:
      "الميناء الطبيعي القديم على البحر المتوسط حيث استقبلت أخشاب الأرز اللبناني لبناء هيكل سليمان، وميناء هروب يونان نحو ترشيش.",
    biblicalReferences: ["2 Chronicles 2:16", "Jonah 1:3", "Acts 9:36-43"],
  },

  // === EGYPT ===
  {
    id: "rameses",
    name: "Rameses (Goshen / Avaris)",
    arabicName: "رعمسيس (أرض جاسان / أفاريس)",
    modernName: "Tell el-Dab'a & Qantir, Sharqia Governorate, Egypt",
    coordinates: [30.796, 31.83],
    region: "Egypt",
    biblicalEra: "Exodus",
    keyEvents: [],
    description:
      "Store-city built by enslaved Israelites in fertile Goshen, and launchpad of the Exodus under Moses during the Passover night.",
    arabicDescription:
      "مدينة المخازن التي بناها بنو إسرائيل في أرض جاسان الخصيبة بشرق الدلتا، ومنها انطلق موكب الخروج العظيم بقيادة موسى بعد ليلة الفصح المجيدة.",
    biblicalReferences: ["Genesis 47:11", "Exodus 1:11", "Exodus 12:37", "Numbers 33:3"],
  },
  {
    id: "memphis",
    name: "Memphis (Noph / Moph)",
    arabicName: "منف (نوف)",
    modernName: "Mit Rahina, Giza Governorate, Egypt",
    coordinates: [29.8448, 31.2508],
    region: "Egypt",
    biblicalEra: "Patriarchal",
    keyEvents: [],
    description:
      "Ancient royal capital of Lower Egypt near the apex of the Nile Delta, renowned for royal Pharaoh courts and majestic necropolises.",
    arabicDescription:
      "العاصمة الملكية الأولى لمصر القديمة عند رأس الدلتا، مقر فراعنة الأسرات المبكرة والأهرامات والمقابر الملكية.",
    biblicalReferences: ["Isaiah 19:13", "Jeremiah 2:16", "Jeremiah 46:14", "Hosea 9:6"],
  },
  {
    id: "on",
    name: "On (Heliopolis)",
    arabicName: "أون (عين شمس / هليوبوليس)",
    modernName: "Ain Shams & Matariya, Cairo, Egypt",
    coordinates: [30.129, 31.316],
    region: "Egypt",
    biblicalEra: "Patriarchal",
    keyEvents: [],
    description:
      "Sanctuary of priestly learning and seat of Potiphera, priest of On, whose daughter Asenath was given to Joseph as wife by Pharaoh.",
    arabicDescription:
      "مركز الكهانة والحكمة في مصر القديمة ومدينة فوطيفارع كاهن أون، الذي تزوج يوسف الصديق ابنته أسنات وأنجبت له منسى وإفرايم.",
    biblicalReferences: ["Genesis 41:45", "Genesis 41:50", "Genesis 46:20"],
  },
  {
    id: "thebes",
    name: "Thebes (No-Amon)",
    arabicName: "طيبة (نو آمون / الأقصر)",
    modernName: "Luxor & Karnak, Luxor Governorate, Egypt",
    coordinates: [25.6872, 32.6396],
    region: "Egypt",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Monumental religious and imperial capital of Upper Egypt during the New Kingdom, flanked by Karnak and the Valley of the Kings.",
    arabicDescription:
      "عاصمة مصر العليا العظيمة في عصر الدولة الحديثة، الشهيرة بمعابد الكرنك والأقصر ووادي الملوك التي ورد ذكرها في نبوات الأنبياء.",
    biblicalReferences: ["Jeremiah 46:25", "Ezekiel 30:14-16", "Nahum 3:8"],
  },
  {
    id: "zoan",
    name: "Zoan (Tanis)",
    arabicName: "صوعن (تانيس)",
    modernName: "San el-Hagar, Sharqia Governorate, Egypt",
    coordinates: [30.977, 31.881],
    region: "Egypt",
    biblicalEra: "Exodus",
    keyEvents: [],
    description:
      "Delta capital where God performed wonders and the Ten Plagues through Moses ('wonders in the field of Zoan').",
    arabicDescription:
      "المدينة الملكية في دلتا النيل التي أجرى فيها الرب عجائبه وضرباته العشر على يد موسى في 'بلاد صوعن'.",
    biblicalReferences: ["Numbers 13:22", "Psalm 78:12", "Psalm 78:43", "Isaiah 19:11"],
  },
  {
    id: "pithom",
    name: "Pithom",
    arabicName: "فيثوم",
    modernName: "Tell el-Maskhuta, Wadi Tumilat, Ismailia, Egypt",
    coordinates: [30.552, 32.098],
    region: "Egypt",
    biblicalEra: "Exodus",
    keyEvents: [],
    description:
      "Store-city in Wadi Tumilat constructed by the Hebrew laborers under harsh taskmaster oppression prior to the Exodus.",
    arabicDescription:
      "مدينة مخازن فرعونية في وادي طميلات بناها العبرانيون تحت وطأة التسخير والعبودية قبل الخروج.",
    biblicalReferences: ["Exodus 1:11"],
  },

  // === SINAI ===
  {
    id: "mount-sinai",
    name: "Mount Sinai (Horeb / Jabal Musa)",
    arabicName: "جبل سيناء (حوريب / جبل موسى)",
    modernName: "Jabal Musa, South Sinai Governorate, Egypt",
    coordinates: [28.5394, 33.975],
    region: "Sinai",
    biblicalEra: "Exodus",
    keyEvents: [],
    description:
      "The Holy Mountain of God where the Burning Bush appeared, the Ten Commandments and the Law were given to Moses amidst thunder and thick cloud, and Elijah heard the still small voice.",
    arabicDescription:
      "جبل الله المقدس حيث كلم الرب موسى في العليقة المشتعلة، وسلمه لوحي الشريعة والوصايا العشر وسط السحاب والرعود، وفيه سمع إيليا النبي صوت النسيم الخفيف.",
    biblicalReferences: ["Exodus 19:1-25", "Exodus 20:1-17", "Deuteronomy 5", "1 Kings 19:8-12"],
  },
  {
    id: "kadesh-barnea",
    name: "Kadesh-Barnea",
    arabicName: "قادش برنيع",
    modernName: "Ein el-Qudeirat / Tell el-Qudeirat, Sinai",
    coordinates: [30.647, 34.417],
    region: "Sinai",
    biblicalEra: "Exodus",
    keyEvents: [],
    description:
      "Wilderness oasis where Israel camped for nearly 38 years, from which the twelve spies were dispatched into Canaan, and where Miriam passed away.",
    arabicDescription:
      "واحة البرية الرئيسية حيث استقر بنو إسرائيل نحو 38 عاماً، ومنها أرسل موسى الجواسيس الاثني عشر لتفقد أرض كنعان، وفيها ماتت مريم النبية.",
    biblicalReferences: ["Numbers 13:26", "Numbers 20:1", "Deuteronomy 1:46"],
  },
  {
    id: "ezion-geber",
    name: "Ezion-Geber",
    arabicName: "عصيون جابر",
    modernName: "Tell el-Kheleifeh, Gulf of Aqaba / Eilat",
    coordinates: [29.55, 34.95],
    region: "Sinai",
    biblicalEra: "Exodus",
    keyEvents: [],
    description:
      "Encampment station of the wilderness wanderings on the Red Sea's Gulf of Aqaba; later home port of King Solomon's merchant fleet bound for Ophir.",
    arabicDescription:
      "محطة هامة في ارتحال بني إسرائيل على خليج العقبة في البحر الأحمر، وبنى فيها سليمان الملك أسطول سفنه التجارية المنطلقة إلى أوفير.",
    biblicalReferences: ["Numbers 33:35", "Deuteronomy 2:8", "1 Kings 9:26", "2 Chronicles 8:17"],
  },
  {
    id: "elim",
    name: "Elim",
    arabicName: "إيليم",
    modernName: "Wadi Gharandal, South Sinai, Egypt",
    coordinates: [29.283, 32.966],
    region: "Sinai",
    biblicalEra: "Exodus",
    keyEvents: [],
    description:
      "Blessed desert oasis with twelve springs of freshwater and seventy palm trees where the weary congregation camped following the Red Sea crossing.",
    arabicDescription:
      "واحة الراحة والبركة في صحراء سيناء حيث وجد بنو إسرائيل اثنتي عشرة عين ماء وسبعين نخلة فنزلوا هناك عند الماء.",
    biblicalReferences: ["Exodus 15:27", "Numbers 33:9"],
  },
  {
    id: "rephidim",
    name: "Rephidim",
    arabicName: "رفيديم",
    modernName: "Wadi Feiran, South Sinai, Egypt",
    coordinates: [28.716, 33.616],
    region: "Sinai",
    biblicalEra: "Exodus",
    keyEvents: [],
    description:
      "Wilderness valley where water gushed from the stricken rock at Massah and Meribah, and where Aaron and Hur held up Moses' arms to defeat Amalek.",
    arabicDescription:
      "وادي البرية حيث تفجر الماء من الصخرة المضروبة بعصا موسى في مريبة ومسة، وفيه أسند هارون وحور يدي موسى حتى هُزم عماليق.",
    biblicalReferences: ["Exodus 17:1-16", "Numbers 33:14"],
  },
  {
    id: "marah",
    name: "Marah",
    arabicName: "مارة (مياه مارة)",
    modernName: "Ain Hawara, South Sinai, Egypt",
    coordinates: [29.566, 32.883],
    region: "Sinai",
    biblicalEra: "Exodus",
    keyEvents: [],
    description:
      "First campsite in the wilderness of Shur where bitter waters were made sweet when Moses cast a tree shown to him by the Lord into the water.",
    arabicDescription:
      "أول محطة في برية شور حيث كانت المياه مرة، فأمر الرب موسى أن يطرح شجرة في الماء فصار الماء عذباً حلواً.",
    biblicalReferences: ["Exodus 15:23-25", "Numbers 33:8"],
  },

  // === ANATOLIA ===
  {
    id: "mount-ararat",
    name: "Mount Ararat Range (Urartu)",
    arabicName: "جبال أرارات (أورارتو)",
    modernName: "Mount Ararat, Ağrı Province, Eastern Anatolia, Turkey",
    coordinates: [39.702, 44.299],
    region: "Anatolia",
    biblicalEra: "Patriarchal",
    keyEvents: ["flood"],
    description:
      "Majestic mountain range in ancient Urartu upon which Noah's Ark rested after the global deluge, marking the covenant of the rainbow.",
    arabicDescription:
      "سلسلة الجبال الشاهقة في بلاد أورارتو التي استقر عليها فلك نوح بعد الطوفان، وحيث قدم نوح ذبيحة الشكر وقطع الرب ميثاق قوس قزح.",
    biblicalReferences: ["Genesis 8:4", "2 Kings 19:37", "Isaiah 37:38"],
  },
  {
    id: "carchemish",
    name: "Carchemish",
    arabicName: "كركميش",
    modernName: "Karkamış, Gaziantep Province, Turkey",
    coordinates: [36.83, 37.93],
    region: "Anatolia",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Ancient fortified Neo-Hittite citadel commanding the Euphrates crossing, site of the epochal battle where Nebuchadnezzar defeated Pharaoh Necho.",
    arabicDescription:
      "حصن حثي عريق ومعبر استراتيجي على الفرات، وموقع معركة كركميش الفاصلة حيث هزم نبوخذنصر جيش فرعون نخو ملك مصر.",
    biblicalReferences: ["2 Chronicles 35:20", "Isaiah 10:9", "Jeremiah 46:2"],
  },
  {
    id: "tarsus",
    name: "Tarsus (Tarshish of Cilicia)",
    arabicName: "طرسوس (ترشيش قيليقية)",
    modernName: "Tarsus, Mersin Province, Turkey",
    coordinates: [36.916, 34.895],
    region: "Anatolia",
    biblicalEra: "United Monarchy",
    keyEvents: [],
    description:
      "Ancient Cilician coastal city linked to early seafaring trade with King Solomon, celebrated in history as the hometown of the Apostle Paul.",
    arabicDescription:
      "مدينة قيليقية ساحلية ارتبطت بتجارة الملاحة البحرية مع سليمان الملك، ومسقط رأس القديس بولس الرسول.",
    biblicalReferences: ["Genesis 10:4", "1 Kings 10:22", "Acts 22:3"],
  },
  {
    id: "hattusa",
    name: "Hattusa (Land of the Hittites)",
    arabicName: "حتوسا (أرض الحثيين)",
    modernName: "Boğazkale, Çorum Province, Central Anatolia, Turkey",
    coordinates: [40.019, 34.615],
    region: "Anatolia",
    biblicalEra: "Patriarchal",
    keyEvents: [],
    description:
      "Imperial capital of the Hittites, frequently referenced throughout the Patriarchal narratives and covenant promises to Abraham.",
    arabicDescription:
      "عاصمة الإمبراطورية الحثية القديمة، المتكرر ذكر شعبها الحثي في أسفار العهد القديم وعهود الرب لإبراهيم.",
    biblicalReferences: ["Genesis 15:20", "Genesis 23:10", "Joshua 1:4"],
  },
];
