import type { BiblicalLaw } from "../types/genealogy";

export const INITIAL_BIBLICAL_LAWS: BiblicalLaw[] = [
  {
    id: "law-eden-tree",
    title: "The Edenic Commandment (Tree of Knowledge)",
    arabicTitle: "وصية جنة عدن (شجرة معرفة الخير والشر)",
    spokenTo: "Adam",
    arabicSpokenTo: "آدم",
    spokenBy: "The LORD God in the Garden of Eden",
    arabicSpokenBy: "الرب الإله في جنة عدن",
    category: "moral",
    scriptureReference: "Genesis 2:16-17",
    arabicScriptureReference: "تكوين 2: 16-17",
    commandmentTextEn:
      "Of every tree of the garden you may freely eat; but of the tree of the knowledge of good and evil you shall not eat, for in the day that you eat of it you shall surely die.",
    commandmentTextAr:
      "«مِنْ جَمِيعِ شَجَرِ الْجَنَّةِ تَأْكُلُ أَكْلًا، وَأَمَّا شَجَرَةُ مَعْرِفَةِ الْخَيْرِ وَالشَّرِّ فَلَا تَأْكُلْ مِنْهَا، لِأَنَّكَ يَوْمَ تَأْكُلُ مِنْهَا مَوْتًا تَمُوتُ.»",
    summaryEn:
      "The first divine commandment given to mankind in paradise, instituting human moral free will, obedience to the Creator, and warning of spiritual and physical death through disobedience.",
    summaryAr:
      "أول وصية إلهية أُعطيت للإنسان في الفردوس، مؤسسةً لحرية الإرادة البشرية، وطاعة الخالق، والتحذير من الموت الروحي والجسدي بالعصيان.",
    biblicalYearBC: 4004,
    location: "Garden of Eden",
    arabicLocation: "جنة عدن",
    keyPrinciples: ["Obedience to God", "Sanctity of Life", "Moral Choice", "Creation Harmony"],
    linkedPersonIds: ["adam", "eve"],
  },
  {
    id: "law-noah-covenant",
    title: "The Covenant with Noah & Sanctity of Human Life",
    arabicTitle: "عهد نوح وقدسية دم الإنسان",
    spokenTo: "Noah and his sons",
    arabicSpokenTo: "نوح وبنوه",
    spokenBy: "God to Noah and his family after the Flood",
    arabicSpokenBy: "الله لنوح وبنيه بعد الخروج من الفلك",
    category: "covenant",
    scriptureReference: "Genesis 9:1-7",
    arabicScriptureReference: "تكوين 9: 1-7",
    commandmentTextEn:
      "Every moving thing that lives shall be food for you. I have given you all things, even as the green herbs. But you shall not eat flesh with its life, that is, its blood. Surely for your lifeblood I will demand a reckoning; from the hand of every beast I will require it, and from the hand of man. From the hand of every man's brother I will require the life of man. Whoever sheds man's blood, by man his blood shall be shed; for in the image of God He made man.",
    commandmentTextAr:
      "«كُلُّ دَابَّةٍ حَيَّةٍ تَكُونُ لَكُمْ طَعَامًا. كَالْعُشْبِ الأَخْضَرِ دَفَعْتُ إِلَيْكُمُ الْجَمِيعَ. غَيْرَ أَنَّ لَحْمًا بِحَيَاتِهِ، دَمِهِ، لَا تَأْكُلُوهُ. وَأَطْلُبُ أَنَا دَمَكُمْ لِأَنْفُسِكُمْ فَقَطْ. مِنْ يَدِ كُلِّ حَيَوَانٍ أَطْلُبُهُ. وَمِنْ يَدِ الإِنْسَانِ أَطْلُبُ نَفْسَ الإِنْسَانِ، مِنْ يَدِ الإِنْسَانِ أَخِيهِ. سَافِكُ دَمِ الإِنْسَانِ بِالإِنْسَانِ يُسْفَكُ دَمُهُ، لِأَنَّ اللهَ عَلَى صُورَتِهِ عَمِلَ الإِنْسَانَ.»",
    summaryEn:
      "God's universal covenant with post-flood humanity prohibiting the consumption of blood, establishing the sacredness of human life bearing God's image, and forbidding murder.",
    summaryAr:
      "عهد الله الشامل مع البشرية بعد الطوفان، محذراً من أكل اللحم بدمه، ومؤكداً على قدسية حياة الإنسان المصنوع على صورة الله، وحظر القتل وسفك الدماء.",
    biblicalYearBC: 2348,
    location: "Mount Ararat",
    arabicLocation: "جبال أراراط",
    keyPrinciples: ["Sanctity of Life", "Image of God", "Prohibition of Murder", "Respect for Blood/Life"],
    linkedPersonIds: ["noah", "shem", "ham", "japheth"],
  },
  {
    id: "law-abraham-circumcision",
    title: "The Covenant of Circumcision",
    arabicTitle: "عهد الختان لإبراهيم ونسله",
    spokenTo: "Abraham",
    arabicSpokenTo: "إبراهيم",
    spokenBy: "The Almighty God (El Shaddai) appearing to Abram at age 99",
    arabicSpokenBy: "الله القدير لإبرام وهو ابن تسع وتسعين سنة",
    category: "covenant",
    scriptureReference: "Genesis 17:1-14",
    arabicScriptureReference: "تكوين 17: 1-14",
    commandmentTextEn:
      "I am Almighty God; walk before Me and be blameless. And I will make My covenant between Me and you, and will multiply you exceedingly... This is My covenant which you shall keep, between Me and you and your descendants after you: Every male child among you shall be circumcised... at eight days old.",
    commandmentTextAr:
      "«أَنَا اللهُ الْقَدِيرُ. سِرْ أَمَامِي وَكُنْ كَامِلًا، فَأَجْعَلَ عَهْدِي بَيْنِي وَبَيْنَكَ، وَأُكَثِّرَكَ كَثِيرًا جِدًّا... هذَا هُوَ عَهْدِي الَّذِي تَحْفَظُونَهُ بَيْنِي وَبَيْنَكُمْ، وَبَيْنَ نَسْلِكَ مِنْ بَعْدِكَ: يُخْتَنُ مِنْكُمْ كُلُّ ذَكَرٍ، فَتُخْتَنُونَ فِي لَحْمِ غُرْلَتِكُمْ، فَيَكُونُ عَلَامَةَ عَهْدٍ بَيْنِي وَبَيْنَكُمْ. اِبْنَ ثَمَانِيَةِ أَيَّامٍ يُخْتَنُ مِنْكُمْ كُلُّ ذَكَرٍ فِي أَجْيَالِكُمْ.»",
    summaryEn:
      "The perpetual covenant sign given to Abraham and his descendants, symbolizing dedicated consecration to God, the promise of multiplied offspring, and walking blameless before El Shaddai.",
    summaryAr:
      "علامة العهد الأبدي الممنوح لإبراهيم ونسله، رمزاً للتكريس والطهارة والولاء للرب، ووعداً ببركة النسل والميراث والسير في الكمال أمام الله القدير.",
    biblicalYearBC: 1897,
    location: "Mamre / Hebron",
    arabicLocation: "مَمْرَا / حبرون",
    keyPrinciples: ["Faith & Covenant", "Walking Blameless", "Sign of Dedication", "Generational Promise"],
    linkedPersonIds: ["abraham", "ishmael", "isaac"],
  },
  {
    id: "law-ten-commandments",
    title: "The Ten Commandments (The Decalogue)",
    arabicTitle: "الوصايا العشر (اللوحان الإلهيان في سيناء)",
    spokenTo: "Moses and the entire Congregation of Israel",
    arabicSpokenTo: "موسى وجميع جماعة بني إسرائيل",
    spokenBy: "God speaking audibly out of the midst of the fire and cloud on Mount Sinai",
    arabicSpokenBy: "الله متكلماً بصوته من وسط النار والسحاب على جبل سيناء",
    category: "moral",
    scriptureReference: "Exodus 20:1-17; Deuteronomy 5:6-21",
    arabicScriptureReference: "خروج 20: 1-17؛ تثنية 5: 6-21",
    commandmentTextEn:
      "I am the LORD your God, who brought you out of the land of Egypt, out of the house of bondage.\n1. You shall have no other gods before Me.\n2. You shall not make for yourself a carved image...\n3. You shall not take the name of the LORD your God in vain...\n4. Remember the Sabbath day, to keep it holy...\n5. Honor your father and your mother...\n6. You shall not murder.\n7. You shall not commit adultery.\n8. You shall not steal.\n9. You shall not bear false witness against your neighbor.\n10. You shall not covet your neighbor's house, wife, or anything that is your neighbor's.",
    commandmentTextAr:
      "«أَنَا الرَّبُّ إِلهُكَ الَّذِي أَخْرَجَكَ مِنْ أَرْضِ مِصْرَ مِنْ بَيْتِ الْعُبُودِيَّةِ.\n١. لَا يَكُنْ لَكَ آلِهَةٌ أُخْرَى أَمَامِي.\n٢. لَا تَصْنَعْ لَكَ تِمْثَالًا مَنْحُوتًا، وَلَا صُورَةً مَّا مِمَّا فِي السَّمَاءِ مِنْ فَوْقُ، وَمَا فِي الأَرْضِ مِنْ تَحْتُ...\n٣. لَا تَنْطِقْ بِاسْمِ الرَّبِّ إِلهِكَ بَاطِلًا...\n٤. اُذْكُرْ يَوْمَ السَّبْتِ لِتُقَدِّسَهُ...\n٥. أَكْرِمْ أَبَاكَ وَأُمَّكَ لِكَيْ تَطُولَ أَيَّامُكَ عَلَى الأَرْضِ...\n٦. لَا تَقْتُلْ.\n٧. لَا تَزْنِ.\n٨. لَا تَسْرِقْ.\n٩. لَا تَشْهَدْ عَلَى قَرِيبِكَ شَهَادَةَ زُورٍ.\n١٠. لَا تَشْتَهِ بَيْتَ قَرِيبِكَ. لَا تَشْتَهِ امْرَأَةَ قَرِيبِكَ، وَلَا عَبْدَهُ، وَلَا أَمَتَهُ، وَلَا ثَوْرَهُ، وَلَا حِمَارَهُ، وَلَا شَيْئًا مِمَّا لِقَرِيبِكَ.»",
    summaryEn:
      "The foundational divine moral law of the Scriptures, inscribed by the finger of God upon two tablets of stone. The first four govern duty toward God; the latter six govern duty toward fellow human beings.",
    summaryAr:
      "أساس الناموس الأخلاقي الإلهي في الكتاب المقدس، المكتوب بإصبع الله على لوحي حجر. الأربع الأولى تنظم العبادة والواجب نحو الله، والست التالية تنظم المحبة والعدالة نحو القريب والإنسان.",
    biblicalYearBC: 1446,
    location: "Mount Sinai (Horeb)",
    arabicLocation: "جبل سيناء (حوريب)",
    keyPrinciples: [
      "Monotheism",
      "Worship in Spirit & Truth",
      "Reverence of God's Name",
      "Sabbath Rest",
      "Honor Parents",
      "Purity of Life",
      "Faithfulness in Marriage",
      "Respect for Property",
      "Truth & Integrity",
      "Contentment & Purity of Heart",
    ],
    linkedPersonIds: ["moses", "aaron"],
  },
  {
    id: "law-greatest-commandment-shema",
    title: "The Shema & The Greatest Commandment of Love",
    arabicTitle: "الشماع ووصية المحبة العظمى لله وللقريب",
    spokenTo: "Moses for the Children of Israel",
    arabicSpokenTo: "موسى لجميع بني إسرائيل",
    spokenBy: "The LORD through Moses",
    arabicSpokenBy: "الرب بفم موسى النبي",
    category: "moral",
    scriptureReference: "Deuteronomy 6:4-9; Leviticus 19:18",
    arabicScriptureReference: "تثنية 6: 4-9؛ لاويين 19: 18",
    commandmentTextEn:
      "Hear, O Israel: The LORD our God, the LORD is one! You shall love the LORD your God with all your heart, with all your soul, and with all your strength. And these words which I command you today shall be in your heart... You shall not take vengeance, nor bear any grudge against the children of your people, but you shall love your neighbor as yourself: I am the LORD.",
    commandmentTextAr:
      "«اِسْمَعْ يَا إِسْرَائِيلُ: الرَّبُّ إِلهُنَا رَبٌّ وَاحِدٌ. فَتُحِبُّ الرَّبَّ إِلهَكَ مِنْ كُلِّ قَلْبِكَ وَمِنْ كُلِّ نَفْسِكَ وَمِنْ كُلِّ قُوَّتِكَ. وَلْتَكُنْ هذِهِ الْكَلِمَاتُ الَّتِي أَنَا أُوصِيكَ بِهَا الْيَوْمَ عَلَى قَلْبِكَ... لَا تَنْتَقِمْ وَلَا تَحْقِدْ عَلَى أَبْنَاءِ شَعْبِكَ، بَلْ تُحِبُّ قَرِيبَكَ كَنَفْسِكَ. أَنَا الرَّبُّ.»",
    summaryEn:
      "The central confession and supreme ethical imperative of biblical faith: single-hearted love for the one true God, and unconditional love toward one's neighbor as oneself.",
    summaryAr:
      "جوهر الإيمان الكتابي وأعظم الوصايا الأخلاقية: المحبة الكاملة لله الواحد بكل القلب والنفس والقدرة، ومحبة القريب كالنفس بلا حقد أو انتقام.",
    biblicalYearBC: 1406,
    location: "Plains of Moab / Mount Sinai",
    arabicLocation: "عربات موآب / سيناء",
    keyPrinciples: ["Single-hearted Love for God", "Unity of God", "Love of Neighbor", "Teaching Children"],
    linkedPersonIds: ["moses"],
  },
  {
    id: "law-holiness-code",
    title: "The Law of Holiness: 'Be Holy, for I am Holy'",
    arabicTitle: "شريعة القداسة: «كونوا قديسين لأني أنا قدوس»",
    spokenTo: "Moses to all the congregation of the children of Israel",
    arabicSpokenTo: "موسى لكل جماعة بني إسرائيل",
    spokenBy: "The LORD speaking to Moses from the Tent of Meeting",
    arabicSpokenBy: "الرب مخاطباً موسى من خيمة الاجتماع",
    category: "holiness_ethics",
    scriptureReference: "Leviticus 19:1-18",
    arabicScriptureReference: "لاويين 19: 1-18",
    commandmentTextEn:
      "Speak to all the congregation of the children of Israel, and say to them: 'You shall be holy, for I the LORD your God am holy.' ... When you reap the harvest of your land, you shall not wholly reap the corners of your field... you shall leave them for the poor and the stranger. You shall not steal, nor deal falsely, nor lie to one another... You shall not oppress your neighbor... You shall not curse the deaf, nor put a stumbling block before the blind... You shall not hate your brother in your heart.",
    commandmentTextAr:
      "«كَلِّمْ كُلَّ جَمَاعَةِ بَنِي إِسْرَائِيلَ وَقُلْ لَهُمْ: قِدِّيسِينَ تَكُونُونَ لِأَنِّي قُدُّوسٌ الرَّبُّ إِلهُكُمْ... وَعِنْدَمَا تَحْصُدُونَ حَصِيدَ أَرْضِكُمْ لَا تُكَمِّلْ زَوَايَا حَقْلِكَ فِي حَصَادِكَ... لِلْمِسْكِينِ وَالْغَرِيبِ تَتْرُكُهَا. أَنَا الرَّبُّ إِلهُكُمْ. لَا تَسْرِقُوا، وَلَا تَكْذِبُوا، وَلَا تَغْدُرُوا أَحَدُكُمْ بِصَاحِبِهِ... لَا تَظْلِمْ قَرِيبَكَ وَلَا تَسْلِبْهُ... لَا تَسُبَّ الأَصَمَّ، وَقُدَّامَ الأَعْمَى لَا تَجْعَلْ مَعْثَرَةً... لَا تُبْغِضْ أَخَاكَ فِي قَلْبِكَ.»",
    summaryEn:
      "The divine call to emulate God's holiness through social justice, compassion for the disabled, generosity to the poor, honest business practices, and mutual love.",
    summaryAr:
      "الدعوة الإلهية للتشبه بقداسة الله عبر العدالة الاجتماعية، والرفق بذوي الاحتياجات، وإعانة الفقراء والغرباء، والأمانة في التعامل، ونقاء القلب من البغضة.",
    biblicalYearBC: 1445,
    location: "Wilderness of Sinai",
    arabicLocation: "برية سيناء",
    keyPrinciples: ["Divine Holiness", "Social Justice", "Care for Poor & Strangers", "Compassion for Vulnerable"],
    linkedPersonIds: ["moses", "aaron"],
  },
  {
    id: "law-justice-stranger-widow",
    title: "Justice for the Stranger, Widow, and Orphan",
    arabicTitle: "شريعة العدل والرحمة بالغريب والأرملة واليتيم",
    spokenTo: "Moses and Israel (Book of the Covenant)",
    arabicSpokenTo: "موسى وبنو إسرائيل (كتاب العهد)",
    spokenBy: "God to Moses after delivering the Decalogue",
    arabicSpokenBy: "الله لموسى بعد تسليم الوصايا العشر",
    category: "civil_judicial",
    scriptureReference: "Exodus 22:21-27; Exodus 23:1-9",
    arabicScriptureReference: "خروج 22: 21-27؛ خروج 23: 1-9",
    commandmentTextEn:
      "You shall neither mistreat a stranger nor oppress him, for you were strangers in the land of Egypt. You shall not afflict any widow or fatherless child. If you afflict them in any way, and they cry at all to Me, I will surely hear their cry... You shall not circulate a false report... You shall not follow a crowd to do evil... If you meet your enemy's ox or his donkey going astray, you shall surely bring it back to him again.",
    commandmentTextAr:
      "«لَا تَضْطَهِدِ الْغَرِيبَ وَلَا تُضَايِقْهُ، لِأَنَّكُمْ كُنْتُمْ غُرَبَاءَ فِي أَرْضِ مِصْرَ. لَا تُسِيئُوا إِلَى أَرْمَلَةٍ مَا وَلَا يَتِيمٍ. إِنْ أَسَأْتُمْ إِلَيْهِ فَصَرَخَ إِلَيَّ أَسْمَعُ صُرَاخَهُ... لَا تَقْبَلْ خَبَرًا كَاذِبًا... لَا تَتْبَعِ الْكَثِيرِينَ إِلَى فِعْلِ الشَّرِّ... إِذَا صَادَفْتَ ثَوْرَ عَدُوِّكَ أَوْ حِمَارَهُ شَارِدًا، تَرُدُّهُ إِلَيْهِ.»",
    summaryEn:
      "Civil and humanitarian statutes guaranteeing legal protection, mercy, and dignity for the powerless, forbidding prejudice, corruption of courts, and oppression of foreigners.",
    summaryAr:
      "أحكام مدنية وإنسانية تحمي الضعفاء والغرباء وتضمن كرامتهم، محذرةً من استغلال الأرملة واليتيم، وموجبةً نزاهة القضاء والإحسان حتى نحو دابة العدو.",
    biblicalYearBC: 1446,
    location: "Mount Sinai",
    arabicLocation: "جبل سيناء",
    keyPrinciples: ["Protection of the Vulnerable", "Integrity of Justice", "Mercy to Strangers", "Doing Good to Enemies"],
    linkedPersonIds: ["moses"],
  },
  {
    id: "law-sabbath-sign",
    title: "The Perpetual Sabbath as a Sign of Sanctification",
    arabicTitle: "شريعة حفظ السبت علامةً أبدية للتقديس",
    spokenTo: "Moses for the Children of Israel",
    arabicSpokenTo: "موسى لبني إسرائيل",
    spokenBy: "The LORD to Moses",
    arabicSpokenBy: "الرب لموسى النبي",
    category: "festivals_sabbath",
    scriptureReference: "Exodus 31:12-17; Leviticus 23:3",
    arabicScriptureReference: "خروج 31: 12-17؛ لاويين 23: 3",
    commandmentTextEn:
      "Speak also to the children of Israel, saying: 'Surely My Sabbaths you shall keep, for it is a sign between Me and you throughout your generations, that you may know that I am the LORD who sanctifies you. Six days may work be done, but the seventh is the Sabbath of rest, holy to the LORD.'",
    commandmentTextAr:
      "«وَأَنْتَ تُكَلِّمُ بَنِي إِسْرَائِيلَ قَائِلًا: إِنَّكُمْ تَحْفَظُونَ سُبُوتِي، لِأَنَّهُ عَلَامَةٌ بَيْنِي وَبَيْنَكُمْ فِي أَجْيَالِكُمْ لِتَعْلَمُوا أَنِّي أَنَا الرَّبُّ الَّذِي يُقَدِّسُكُمْ. سِتَّةَ أَيَّامٍ يُعْمَلُ عَمَلٌ، وَأَمَّا الْيَوْمُ السَّابِعُ فَفِيهِ سَبْتُ عُطْلَةٍ مُقَدَّسٌ لِلرَّبِّ.»",
    summaryEn:
      "The institution of the weekly sacred Sabbath rest, celebrating God's completed creation and liberation from Egyptian slavery, as a perpetual covenant sign of sanctification.",
    summaryAr:
      "تأسيس راحة السبت الأسبوعية المقدسة، احتفاءً بكمال خليقة الله والتحرر من عبودية مصر، علامةً لعهد التقديس والتكريس المستمر للرب.",
    biblicalYearBC: 1446,
    location: "Mount Sinai",
    arabicLocation: "جبل سيناء",
    keyPrinciples: ["Rest & Renewal", "Covenant Sign", "God as Sanctifier", "Creation Memorial"],
    linkedPersonIds: ["moses"],
  },
  {
    id: "law-sabbatical-jubilee",
    title: "The Sabbatical Year & The Jubilee (Proclaim Liberty)",
    arabicTitle: "سنة الإبراء واليوبيل (المناداة بالحرية والعتق)",
    spokenTo: "Moses on Mount Sinai",
    arabicSpokenTo: "موسى في جبل سيناء",
    spokenBy: "The LORD to Moses on Mount Sinai",
    arabicSpokenBy: "الرب لموسى في جبل سيناء",
    category: "festivals_sabbath",
    scriptureReference: "Leviticus 25:1-17, 23-28",
    arabicScriptureReference: "لاويين 25: 1-17، 23-28",
    commandmentTextEn:
      "When you come into the land which I give you, then the land shall keep a sabbath to the LORD. Six years you shall sow your field... but in the seventh year there shall be a sabbath of solemn rest for the land... And you shall consecrate the fiftieth year, and proclaim liberty throughout all the land to all its inhabitants. It shall be a Jubilee for you... The land shall not be sold permanently, for the land is Mine; for you are strangers and sojourners with Me.",
    commandmentTextAr:
      "«مَتَى أَتَيْتُمْ إِلَى الأَرْضِ الَّتِي أَنَا أُعْطِيكُمْ تَسْبِتُ الأَرْضُ سَبْتًا لِلرَّبِّ. سِتَّ سِنِينَ تَزْرَعُ حَقْلَكَ... وَأَمَّا السَّنَةُ السَّابِعَةُ فَفِيهَا يَكُونُ لِلأَرْضِ سَبْتُ عُطْلَةٍ... وَتُقَدِّسُونَ السَّنَةَ الْخَمْسِينَ، وَتُنَادُونَ بِالْعِتْقِ فِي الأَرْضِ لِجَمِيعِ سُكَّانِهَا. تَكُونُ لَكُمْ يُوبِيلًا، وَتَرْجِعُونَ كُلٌّ إِلَى مُلْكِهِ... وَالأَرْضُ لَا تُبَاعُ بَتَاتًا، لِأَنَّ الأَرْضَ لِي، وَأَنْتُمْ غُرَبَاءُ وَنُزَلَاءُ عِنْدِي.»",
    summaryEn:
      "Economic and agricultural ordinances requiring ecological rest for the land every seven years, and debt cancellation, restoration of ancestral lands, and release of bondservants every fiftieth year.",
    summaryAr:
      "شريعة زراعية واقتصادية تمنح الأرض راحة بيئية كل سبع سنين، وفي سنة اليوبيل الخمسين يُنادى بالعتق ورد الممتلكات لأصحابها وإلغاء الديون، مؤكدةً أن الأرض ملك لله والإنسان نزيل عنده.",
    biblicalYearBC: 1445,
    location: "Mount Sinai",
    arabicLocation: "جبل سيناء",
    keyPrinciples: ["Ecological Stewardship", "Economic Relief", "Liberation from Bondage", "God's Ownership of the Earth"],
    linkedPersonIds: ["moses"],
  },
  {
    id: "law-priestly-blessing",
    title: "The Priestly Benediction (Aaron's Blessing)",
    arabicTitle: "البركة الكهنوتية الإلهية (بركة هارون وبنيه)",
    spokenTo: "Moses to command Aaron and his sons",
    arabicSpokenTo: "موسى ليوصي هارون وبنيه الكهنة",
    spokenBy: "The LORD speaking to Moses",
    arabicSpokenBy: "الرب مخاطباً موسى النبي",
    category: "ceremonial_worship",
    scriptureReference: "Numbers 6:22-27",
    arabicScriptureReference: "عدد 6: 22-27",
    commandmentTextEn:
      "And the LORD spoke to Moses, saying, 'Speak to Aaron and his sons, saying, This is the way you shall bless the children of Israel. Say to them:\nThe LORD bless you and keep you;\nThe LORD make His face shine upon you, and be gracious to you;\nThe LORD lift up His countenance upon you, and give you peace.\nSo they shall put My name on the children of Israel, and I will bless them.'",
    commandmentTextAr:
      "«وَكَلَّمَ الرَّبُّ مُوسَى قَائِلًا: كَلِّمْ هَارُونَ وَبَنِيهِ قَائِلًا: هكَذَا تُبَارِكُونَ بَنِي إِسْرَائِيلَ قَائِلِينَ لَهُمْ:\nيُبَارِكُكَ الرَّبُّ وَيَحْرُسُكَ.\nيُضِيءُ الرَّبُّ بِوَجْهِهِ عَلَيْكَ وَيَرْحَمُكَ.\nيَرْفَعُ الرَّبُّ وَجْهَهُ عَلَيْكَ وَيَمْنَحُكَ سَلَامًا.\nفَيَجْعَلُونَ اسْمِي عَلَى بَنِي إِسْرَائِيلَ، وَأَنَا أُبَارِكُهُمْ.»",
    summaryEn:
      "The sacred liturgical blessing ordained directly by God for the priests to pronounce over the people, sealing the divine name, protection, grace, and shalom (peace) upon them.",
    summaryAr:
      "البركة الليتورجية المقدسة التي أمر الله موسى أن يضعها في فم هارون والكهنة لمباركة الشعب، واضعين اسم الرب عليهم لينالوا الحراسة والنعمة والسلام الإلهي.",
    biblicalYearBC: 1445,
    location: "Wilderness of Sinai",
    arabicLocation: "برية سيناء",
    keyPrinciples: ["Divine Blessing & Grace", "Divine Protection", "Peace (Shalom)", "Sanctity of God's Name"],
    linkedPersonIds: ["moses", "aaron"],
  },
  {
    id: "law-cities-of-refuge",
    title: "The Law of Cities of Refuge & Protection of the Accused",
    arabicTitle: "شريعة مدن الملجأ وحماية القاتل بغير قصد",
    spokenTo: "Moses for the Children of Israel",
    arabicSpokenTo: "موسى لبني إسرائيل",
    spokenBy: "The LORD to Moses in the plains of Moab by the Jordan",
    arabicSpokenBy: "الرب لموسى في عربات موآب على أردن أريحا",
    category: "civil_judicial",
    scriptureReference: "Numbers 35:9-28; Joshua 20:1-9",
    arabicScriptureReference: "عدد 35: 9-28؛ يشوع 20: 1-9",
    commandmentTextEn:
      "Speak to the children of Israel, and say to them: 'When you cross the Jordan into the land of Canaan, then you shall appoint cities to be cities of refuge for you, that the manslayer who kills any person accidentally may flee there. They shall be cities of refuge for you from the avenger, that the manslayer may not die until he stands before the congregation for judgment.'",
    commandmentTextAr:
      "«كَلِّمْ بَنِي إِسْرَائِيلَ وَقُلْ لَهُمْ: إِنَّكُمْ عَابِرُونَ الأُرْدُنَّ إِلَى أَرْضِ كَنْعَانَ. فَتُعَيِّنُونَ لِأَنْفُسِكُمْ مُدُنًا تَكُونُ مُدُنَ مَلْجَأٍ لَكُمْ، لِيَهْرُبَ إِلَيْهَا الْقَاتِلُ ضَارِبُ نَفْسٍ سَهْوًا. فَتَكُونُ لَكُمُ الْمُدُنُ مَلْجَأً مِنَ الْوَلِيِّ، لِكَيْلا يَمُوتَ الْقَاتِلُ حَتَّى يَقِفَ أَمَامَ الْجَمَاعَةِ لِلْقَضَاءِ.»",
    summaryEn:
      "Judicial statute setting apart six designated asylum cities to protect those who caused unintentional deaths from vengeance, ensuring fair trial, presumption of innocence, and proportional justice.",
    summaryAr:
      "قانون قضائي يخصص ست مدن للملجأ لحماية القاتل سهواً من انتقام ولي الدم، ضامناً المحاكمة العادلة أمام الجماعة والتحري الدقيق لمنع سفك الدم البريء.",
    biblicalYearBC: 1406,
    location: "Plains of Moab",
    arabicLocation: "عربات موآب",
    keyPrinciples: ["Fair Trial", "Protection from Blood Vengeance", "Distinction between Intent and Accident", "Justice & Equity"],
    linkedPersonIds: ["moses", "joshua"],
  },
];

export const initialBiblicalLaws = INITIAL_BIBLICAL_LAWS;

