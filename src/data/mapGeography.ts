// Real-world GIS Coordinates for the Ancient Near East & Old Testament World
// Bounding box: Latitude 22°N to 42°N, Longitude 24°E to 56°E
// Equirectangular projection mapping to 1800 x 1000 canvas

export const MAP_BOUNDS = {
  minLon: 24, // Western Egypt / Cyrenaica
  maxLon: 56, // Zagros / Persia / Persian Gulf
  minLat: 22, // Upper Egypt / Southern Red Sea
  maxLat: 42, // Ararat / Black Sea / Anatolia
};

export const MAP_WIDTH = 1800;
export const MAP_HEIGHT = 1000;

export function geoToPixel(lat: number, lon: number): { x: number; y: number } {
  const clampedLon = Math.max(MAP_BOUNDS.minLon, Math.min(MAP_BOUNDS.maxLon, lon));
  const clampedLat = Math.max(MAP_BOUNDS.minLat, Math.min(MAP_BOUNDS.maxLat, lat));

  const x = ((clampedLon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * MAP_WIDTH;
  const y = ((MAP_BOUNDS.maxLat - clampedLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * MAP_HEIGHT;

  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

// Converts array of [lat, lon] coordinates into an SVG path
export function coordsToSvgPath(
  coords: [number, number][],
  close: boolean = false,
  curved: boolean = false
): string {
  if (!coords || coords.length === 0) return "";

  const points = coords.map(([lat, lon]) => geoToPixel(lat, lon));

  if (!curved || points.length < 3) {
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x},${points[i].y}`;
    }
    if (close) d += " Z";
    return d;
  }

  // Smooth Catmull-Rom or Cardinal Spline conversion to Cubic Bezier
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : p2;

    const tension = 0.25;
    const cp1x = p1.x + ((p2.x - p0.x) * tension);
    const cp1y = p1.y + ((p2.y - p0.y) * tension);
    const cp2x = p2.x - ((p3.x - p1.x) * tension);
    const cp2y = p2.y - ((p3.y - p1.y) * tension);

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x},${p2.y}`;
  }

  if (close) d += " Z";
  return d;
}

// =========================================================================
// 1. COASTLINES OF THE BIBLICAL WORLD
// =========================================================================

// Mediterranean Sea (Coastline from Libya across Egypt, Levant, Anatolia)
export const MEDITERRANEAN_COAST: [number, number][] = [
  // West edge (Cyrenaica / Libya)
  [32.0, 24.0],
  [31.8, 24.6],
  [31.6, 25.1], // Gulf of Sollum
  [31.4, 26.0],
  [31.35, 27.2], // Marsa Matruh
  [31.1, 28.5],
  [31.05, 29.3],
  [31.2, 29.9], // Alexandria (Abu Qir)
  [31.35, 30.15],
  [31.46, 30.36], // Rosetta mouth (Western Nile Delta)
  [31.55, 30.7],
  [31.6, 31.0], // Lake Burullus (Northern apex of Delta)
  [31.55, 31.4],
  [31.52, 31.84], // Damietta mouth (Eastern Nile Delta)
  [31.35, 32.15], // Lake Manzala
  [31.26, 32.3], // Port Said / Pelusium entrance
  [31.15, 32.8],
  [31.25, 33.1], // Bardawil Lagoon sand spit
  [31.2, 33.4],
  [31.13, 33.8], // El-Arish (Brook of Egypt)
  [31.28, 34.24], // Raphia
  [31.5, 34.47], // Gaza
  [31.67, 34.56], // Ashkelon
  [31.8, 34.65], // Ashdod
  [32.05, 34.75], // Joppa (Jaffa)
  [32.32, 34.86], // Sharon plain / Apollonia
  [32.5, 34.89], // Caesarea Maritima
  [32.83, 34.97], // Mount Carmel promontory
  [32.92, 35.08], // Bay of Acre / Acco (Acre)
  [33.1, 35.15], // Ladder of Tyre
  [33.27, 35.2], // Tyre (Sur)
  [33.4, 35.28], // Sarepta (Zarephath)
  [33.56, 35.38], // Sidon (Saida)
  [33.9, 35.5], // Beirut
  [34.12, 35.65], // Byblos (Jbeil / Gebal)
  [34.28, 35.7], // Batroun
  [34.44, 35.84], // Tripoli
  [34.7, 35.86],
  [34.9, 35.88], // Tartus & Arwad Island
  [35.15, 35.92], // Baniyas
  [35.53, 35.78], // Latakia (Ugarit)
  [35.85, 35.88], // Mount Casius / Ras al-Bassit
  [36.0, 35.95], // Mouth of Orontes River
  [36.3, 35.8],
  [36.6, 36.18], // Gulf of Alexandretta / Issus (Iskenderun)
  [36.9, 35.95], // Issus plain
  [36.75, 35.5],
  [36.7, 34.9], // Cilician Plain / Mersin
  [36.4, 34.2], // Silifke / Calycadnus
  [36.15, 33.5], // Anamur
  [36.05, 32.85], // Cape Anamur
  [36.3, 32.2], // Alanya
  [36.88, 30.7], // Gulf of Antalya
  [36.25, 30.4], // Cape Gelidonya
  [36.2, 29.6], // Finike / Kas
  [36.7, 28.5], // Marmaris
  [36.8, 27.5], // Bodrum / Halicarnassus
  [37.5, 27.2], // Miletus / Didyma
  [38.0, 27.0], // Ephesus / Samos
  [38.4, 26.8], // Smyrna / Chios
  [39.5, 26.5], // Pergamum / Lesbos
  [40.0, 26.2], // Troas / Troy / Dardanelles
  [40.8, 26.2],
  [41.5, 26.0],
  [42.0, 24.0], // Top-left corner of bounding box
  [42.0, 24.0],
  [32.0, 24.0],
];

// Mediterranean Water Fill (Polygon closing around the sea)
export const MEDITERRANEAN_POLYGON: [number, number][] = [
  ...MEDITERRANEAN_COAST,
  [42.0, 24.0],
  [32.0, 24.0],
];

// Cyprus Island (Accurate perimeter with Karpas peninsula)
export const CYPRUS_COAST: [number, number][] = [
  [35.0, 32.3], // Cape Drepanum (West)
  [34.75, 32.4], // Paphos
  [34.65, 32.75], // Episkopi Bay
  [34.6, 33.0], // Akrotiri Peninsula (South)
  [34.67, 33.04], // Limassol
  [34.85, 33.5], // Larnaca
  [34.96, 34.08], // Cape Greco
  [35.1, 33.95], // Famagusta Bay
  [35.35, 34.1], // Karpas Peninsula base
  [35.5, 34.3],
  [35.7, 34.58], // Cape Apostolos Andreas (Northeast tip!)
  [35.55, 34.35],
  [35.4, 33.85], // Kantara
  [35.34, 33.32], // Kyrenia
  [35.4, 32.92], // Cape Kormakitis
  [35.15, 32.8], // Morphou Bay
  [35.0, 32.3],
];

// Red Sea & Sinai (Gulf of Suez, Gulf of Aqaba, Egyptian & Arabian coasts)
export const RED_SEA_COAST: [number, number][] = [
  // Suez apex (Northern end of Gulf of Suez)
  [29.97, 32.55],
  // Egyptian Western Shore of Gulf of Suez
  [29.6, 32.33], // Ain Sukhna
  [29.1, 32.65], // Zaafarana
  [28.35, 33.08], // Ras Gharib
  [28.15, 33.28], // Ras Shukeir
  [27.7, 33.5], // Gemsa
  [27.25, 33.8], // Hurghada
  [26.73, 33.93], // Safaga
  [26.1, 34.28], // Quseir
  [25.06, 34.9], // Marsa Alam
  [23.9, 35.5], // Berenice
  [22.8, 36.0],
  [22.0, 36.8], // Southern bound (Egypt/Sudan)
  // Cross to Arabian side at lat 22
  [22.0, 39.2], // Jeddah/Hejaz south
  [22.8, 38.8], // Rabigh
  [24.09, 38.06], // Yanbu
  [25.02, 37.26], // Umm Lajj
  [26.24, 36.45], // Al Wajh
  [27.35, 35.7], // Duba
  [27.8, 35.2], // Sharma
  [28.03, 34.6], // Ras al-Sheikh Humaid (Midian / opposite Tiran)
  // East shore of Gulf of Aqaba
  [28.4, 34.75], // Magna
  [29.0, 34.88], // Bir Marsha
  [29.28, 34.94], // Haql
  [29.52, 35.0], // Aqaba / Ezion-Geber apex
  // Sinai East shore (Western shore of Gulf of Aqaba)
  [29.55, 34.95], // Eilat / Taba
  [29.0, 34.66], // Nuweiba
  [28.5, 34.51], // Dahab
  [28.0, 34.45], // Strait of Tiran / Nabq
  [27.85, 34.3], // Sharm El Sheikh
  [27.73, 34.25], // Ras Muhammad (Southern tip of Sinai!)
  // Sinai West shore (Eastern shore of Gulf of Suez)
  [28.0, 33.85],
  [28.23, 33.62], // El Tor (Elim/Raithu)
  [28.89, 33.18], // Abu Rudeis
  [29.04, 33.1], // Abu Zenima
  [29.28, 32.96], // Wadi Gharandal (Elim)
  [29.58, 32.7], // Ras Sudr
  [29.85, 32.6], // Ayun Musa (Springs of Moses)
  [29.97, 32.55], // Back to Suez apex
];

// Persian Gulf & Shatt al-Arab
export const PERSIAN_GULF_COAST: [number, number][] = [
  // Shatt al-Arab mouth (confluence of Euphrates/Tigris into the Gulf)
  [29.96, 48.6],
  // Arabian/Western Coast
  [29.8, 48.4], // Bubiyan Island
  [29.4, 48.0], // Kuwait Bay (Failaka)
  [29.0, 48.3], // Al Ahmadi
  [28.45, 48.5], // Ras al-Khafji
  [27.8, 49.0], // Ras al-Mishab
  [27.0, 49.65], // Jubail
  [26.55, 50.05], // Tarut Bay / Qatif
  [26.2, 50.2], // Khobar / Dammam
  [25.8, 50.3], // Half Moon Bay
  [25.0, 50.6], // Gulf of Salwa (West of Qatar)
  [24.7, 50.8], // Salwa apex
  [25.3, 51.0], // Western Qatar coast
  [26.15, 51.2], // Northern tip of Qatar Peninsula (Ras Laffan / Zubarah)
  [25.28, 51.53], // Doha (East Qatar)
  [24.8, 51.6], // Mesaieed
  [24.2, 51.7], // Khor Al Adaid (Inland Sea)
  [24.1, 52.6], // UAE / Sila
  [24.2, 53.5], // Ruwais
  [24.4, 54.3], // Abu Dhabi islands
  [25.0, 55.1], // Dubai coast
  [25.3, 55.4], // Sharjah / Ajman
  [25.8, 55.9], // Ras Al Khaimah
  [26.2, 56.4], // Musandam Peninsula (Strait of Hormuz tip)
  // Cross Strait of Hormuz to Iranian side
  [27.18, 56.27], // Bandar Abbas
  [27.0, 55.8], // Qeshm Island passage
  [26.55, 54.88], // Bandar Lengeh
  [26.7, 54.0], // Chiru
  [27.2, 53.3], // Bandar Charak
  [27.48, 52.6], // Asaluyeh
  [27.67, 52.34], // Bandar Siraf (Taheri)
  [27.8, 52.06], // Kangan
  [28.15, 51.28], // Mand River delta
  [28.97, 50.83], // Bushehr Peninsula
  [29.5, 50.5], // Ganaveh
  [30.05, 50.15], // Bandar Deylam
  [30.4, 49.1], // Bandar-e Emam Khomeyni (Khor Musa)
  [30.34, 48.28], // Abadan Island
  [29.96, 48.6], // Shatt al-Arab mouth
];

// Black Sea (Southern Anatolian Shore)
export const BLACK_SEA_COAST: [number, number][] = [
  [41.0, 28.5], // Bosporus entrance (Byzantium)
  [41.2, 29.2], // Sile
  [41.12, 30.65], // Sakarya river mouth
  [41.28, 31.4], // Eregli (Heraclea Pontica)
  [41.55, 31.8], // Zonguldak
  [41.75, 32.38], // Amasra (Sesamus)
  [41.9, 33.1], // Cide
  [41.97, 33.76], // Inebolu
  [42.02, 35.15], // Cape Inceburun & Sinope (Sinop)
  [41.7, 35.8], // Kizilirmak (Halys) delta
  [41.3, 36.33], // Samsun (Amisos)
  [41.2, 36.8], // Yesilirmak delta
  [41.1, 37.5], // Unye
  [40.95, 38.38], // Ordu / Giresun
  [41.0, 39.72], // Trabzon (Trebizond)
  [41.03, 40.52], // Rize
  [41.35, 41.2], // Hopa
  [41.64, 41.63], // Batumi (Colchis)
  [42.0, 41.8], // Bound top
  [42.0, 28.5],
  [41.0, 28.5],
];

// Caspian Sea (Southwest & South Shore - Media/Hyrcania)
export const CASPIAN_SEA_COAST: [number, number][] = [
  [40.4, 49.9], // Baku / Absheron Peninsula
  [39.9, 49.4], // Gobustan
  [39.3, 49.2], // Kura River Delta
  [38.75, 48.85], // Lenkoran
  [38.43, 48.87], // Astara (Iran/Azerbaijan border)
  [37.8, 48.9], // Talesh
  [37.47, 49.46], // Anzali Lagoon
  [37.2, 50.0], // Rasht / Lahijan
  [36.9, 50.65], // Ramsar
  [36.65, 51.4], // Chalus / Nowshahr
  [36.7, 52.65], // Babolsar / Mazandaran
  [36.85, 53.5], // Gorgan Bay (Miankaleh Spit)
  [36.8, 54.0], // Bandar Torkaman
  [37.3, 54.0], // Atrek River mouth / Turkmenistan
  [42.0, 54.0],
  [42.0, 49.9],
  [40.4, 49.9],
];

// =========================================================================
// 2. INLAND SEAS, LAKES & BASINS
// =========================================================================

// Dead Sea (Yam HaMelah / Salt Sea) - Detailed real geometry with Lisan Peninsula
export const DEAD_SEA_COAST: [number, number][] = [
  [31.76, 35.54], // Jordan River entry (North end)
  [31.7, 35.5], // Qumran shore
  [31.55, 35.45], // Ein Feshkha
  [31.45, 35.39], // En Gedi spring
  [31.31, 35.35], // Masada cliffs
  [31.2, 35.36], // Mount Sodom entry
  [31.05, 35.38], // Southern shallow basin (Sodom plain)
  [31.0, 35.36], // Southern tip
  [31.05, 35.42], // Zoar / Bab edh-Dhra
  [31.2, 35.48], // Lisan base
  [31.25, 35.43], // The Lisan "Tongue" Peninsula tip
  [31.33, 35.5], // Northern edge of Lisan
  [31.47, 35.57], // Arnon River (Wadi Mujib) canyon mouth
  [31.6, 35.58], // Callirrhoe hot springs
  [31.72, 35.56],
  [31.76, 35.54],
];

// Sea of Galilee (Lake Kinneret) - Real harp shape
export const SEA_OF_GALILEE_COAST: [number, number][] = [
  [32.88, 35.62], // Jordan River entry (North - Bethsaida / Capernaum)
  [32.87, 35.65], // Tabgha
  [32.85, 35.67], // Kursi (Country of Gadarenes)
  [32.8, 35.66], // Hippos / Susita
  [32.73, 35.61], // En Gev
  [32.71, 35.58], // Jordan River outlet (Degania)
  [32.74, 35.56], // Kinneret
  [32.79, 35.53], // Tiberias
  [32.83, 35.52], // Magdala
  [32.86, 35.55], // Gennesaret plain
  [32.88, 35.62],
];

// Lake Van (Urartu / Armenia) - Largest lake in Anatolia
export const LAKE_VAN_COAST: [number, number][] = [
  [38.75, 42.6], // West tip (Tatvan)
  [38.5, 42.85], // Akdamar Island
  [38.45, 43.1], // Gevas
  [38.5, 43.35], // Van Castle / Tushpa (Urartu Capital)
  [38.8, 43.6], // Muradiye bay
  [39.0, 43.4], // Ercis (North)
  [38.95, 42.9], // Adilcevaz / Süphan base
  [38.85, 42.65], // Ahlat
  [38.75, 42.6],
];

// Lake Urmia (Media / NW Iran) - Giant salt lake of Media
export const LAKE_URMIA_COAST: [number, number][] = [
  [38.15, 45.1], // North tip (Salmas)
  [38.0, 45.4],
  [37.6, 45.75], // East shore (Tabriz side)
  [37.2, 45.8], // South shore (Mahabad / Miandoab)
  [37.15, 45.4],
  [37.4, 45.15], // West shore (Urmia city side)
  [37.8, 45.05],
  [38.15, 45.1],
];

// Lake Moeris / Qarun & Faiyum Depression (Egypt)
export const LAKE_QARUN_COAST: [number, number][] = [
  [29.45, 30.55],
  [29.5, 30.7],
  [29.48, 30.85],
  [29.43, 30.88],
  [29.41, 30.7],
  [29.42, 30.58],
  [29.45, 30.55],
];

// =========================================================================
// 3. RIVER SYSTEMS (Real Meanders & Tributaries)
// =========================================================================

// Nile River (Main Trunk from Aswan to Delta Apex)
export const NILE_RIVER_MAIN: [number, number][] = [
  [24.09, 32.9], // Aswan (Elephantine / 1st Cataract)
  [24.47, 32.95], // Kom Ombo
  [24.98, 32.87], // Edfu
  [25.29, 32.55], // Esna
  [25.69, 32.64], // Thebes (Luxor / Karnak)
  [26.0, 32.72], // Great Eastward Bend begins
  [26.16, 32.72], // Qena (Apex of Great Qena Bend)
  [26.05, 32.24], // Nag Hammadi
  [26.23, 32.0], // Abydos (Balyana)
  [26.56, 31.7], // Sohag
  [26.9, 31.45], // Tahta
  [27.18, 31.18], // Asyut
  [27.5, 30.95], // Manfalut
  [27.65, 30.9], // Tell el-Amarna (Akhetaten)
  [27.73, 30.84], // Mallawi / Hermopolis
  [28.1, 30.75], // Minya
  [28.7, 30.85], // Samalut
  [29.07, 31.1], // Beni Suef
  [29.45, 31.15], // Al Wasta
  [29.85, 31.25], // Memphis (Mit Rahina) / Dahshur
  [29.97, 31.13], // Giza Pyramids
  [30.13, 31.32], // Heliopolis (On) / Cairo
  [30.18, 31.2], // Qalyub (Apex of the Nile Delta)
];

// Western Nile Branch (Rosetta / Bolbitic Branch)
export const NILE_ROSETTA_BRANCH: [number, number][] = [
  [30.18, 31.2], // Apex
  [30.4, 31.0], // Menoufia
  [30.82, 30.81], // Kafr El Zayat
  [31.13, 30.65], // Desouk
  [31.35, 30.5], // Rosetta (Rashid)
  [31.46, 30.36], // Mediterranean Mouth
];

// Eastern Nile Branch (Damietta / Phatnitic Branch)
export const NILE_DAMIETTA_BRANCH: [number, number][] = [
  [30.18, 31.2], // Apex
  [30.46, 31.18], // Benha (Athribis)
  [30.71, 31.24], // Zifta
  [31.04, 31.38], // Mansoura
  [31.4, 31.75], // Damietta (Dumyat)
  [31.52, 31.84], // Mediterranean Mouth
];

// Ancient Pelusiac Branch & Land of Goshen (Exodus Route to Rameses & Tanis)
export const NILE_GOSHEN_PELUSIAC_BRANCH: [number, number][] = [
  [30.18, 31.2], // Apex
  [30.42, 31.56], // Bilbeis
  [30.58, 31.5], // Bubastis (Pi-Beseth / Zagazig)
  [30.796, 31.83], // Rameses (Tell el-Dab'a / Qantir / Goshen)
  [30.977, 31.88], // Zoan (Tanis / San el-Hagar)
  [31.1, 32.2], // Defenneh (Tahpanhes)
  [31.05, 32.55], // Pelusium (Sin / Mediterranean Sea entry)
];

// Wadi Tumilat Canal (The Biblical canal of Goshen past Pithom to the Red Sea)
export const WADI_TUMILAT_ROUTE: [number, number][] = [
  [30.58, 31.5], // Bubastis
  [30.552, 32.098], // Pithom (Tell el-Maskhuta)
  [30.58, 32.3], // Lake Timsah (Ismailia)
  [30.3, 32.4], // Bitter Lakes
  [29.97, 32.55], // Gulf of Suez (Red Sea)
];

// Euphrates River (Perat) - From Armenian Highlands to Shatt al-Arab
export const EUPHRATES_RIVER: [number, number][] = [
  [39.7, 41.0], // Murat Su source (Armenia)
  [39.2, 40.0], // Bingöl
  [38.7, 39.0], // Keban / Elazığ
  [38.5, 38.6], // Malatya
  [37.55, 38.48], // Samosata (Samsat) - Cuts through Taurus
  [37.0, 38.0], // Birecik
  [36.83, 37.93], // Carchemish (Karkamış / Jerablus - Hittite Border)
  [36.2, 38.15], // Jaber Castle
  [35.85, 38.45], // Emar / Lake Assad / Great Eastward Bend
  [35.95, 39.05], // Raqqa (Confluence with Balikh River from Haran)
  [35.6, 39.8], // Resafa
  [35.3, 40.15], // Halabiyeh Gorge
  [35.15, 40.42], // Deir ez-Zor (Confluence with Khabur River)
  [34.9, 40.6], // Terqa
  [34.55, 40.89], // Mari (Tell Hariri)
  [34.36, 41.1], // Al-Qaim (Syria/Iraq border)
  [34.2, 41.8], // Anah
  [34.1, 42.4], // Haditha
  [33.64, 42.82], // Hit
  [33.35, 43.78], // Ramadi / Fallujah
  [33.15, 44.15], // Approaches Tigris near Baghdad
  [33.06, 44.25], // Sippar
  [32.536, 44.42], // Babylon (Babel / Hillah)
  [32.55, 44.65], // Kish
  [32.12, 45.23], // Nippur
  [31.77, 45.51], // Shuruppak
  [31.326, 45.637], // Erech (Uruk / Warka)
  [31.28, 45.85], // Larsa
  [30.962, 46.104], // Ur of the Chaldees
  [30.82, 45.99], // Eridu
  [30.7, 46.8], // Nasiriyah / Al-Chibayish marshes
  [31.0, 47.43], // Qurna (Confluence with Tigris to form Shatt al-Arab)
  [30.5, 47.8], // Basra
  [30.43, 48.18], // Khorramshahr (Joined by Karun River from Susa)
  [29.96, 48.6], // Persian Gulf mouth
];

// Balikh River (Mesopotamian tributary connecting Haran to Euphrates)
export const BALIKH_RIVER: [number, number][] = [
  [36.864, 39.031], // Haran (Paddan-Aram)
  [36.5, 39.0],
  [36.2, 38.95], // Ain Aissa
  [35.95, 39.05], // Raqqa (Meets Euphrates)
];

// Khabur River (Ancient River of Gozan / Exile of Northern Israel)
export const KHABUR_RIVER: [number, number][] = [
  [36.85, 40.05], // Ras al-Ayn (Gozan / Tell Halaf)
  [36.5, 40.75], // Al-Hasakah
  [35.8, 40.7], // Shadadi
  [35.15, 40.42], // Meets Euphrates at Busayrah
];

// Tigris River (Hiddekel) - From Taurus Mountains through Assyria to Qurna
export const TIGRIS_RIVER: [number, number][] = [
  [38.48, 39.42], // Lake Hazar source (Taurus)
  [37.9, 40.24], // Diyarbakir (Amida)
  [37.75, 40.9], // Bismil
  [37.71, 41.4], // Hasankeyf
  [37.33, 42.18], // Cizre (Jazirat ibn Umar)
  [37.11, 42.36], // Faysh Khabur (Turkey/Syria/Iraq tripoint)
  [36.8, 42.7], // Mosul Lake
  [36.367, 43.15], // Nineveh / Mosul
  [36.1, 43.33], // Calah (Nimrud) / Confluence with Great Zab
  [35.458, 43.256], // Assur (Ashur / Qal'at Sherqat)
  [35.15, 43.43], // Confluence with Lesser Zab
  [34.6, 43.68], // Tikrit
  [34.2, 43.88], // Samarra
  [33.7, 44.3], // Balad
  [33.32, 44.42], // Baghdad / Ctesiphon
  [33.22, 44.51], // Confluence with Diyala River from Zagros
  [32.8, 45.1], // Aziziyah
  [32.5, 45.82], // Kut
  [32.0, 46.5], // Ali al-Gharbi
  [31.84, 47.14], // Amarah
  [31.3, 47.4], // Qal'at Saleh
  [31.0, 47.43], // Qurna (Meets Euphrates)
];

// Great Zab River (Tigris tributary from Zagros Mountains)
export const GREAT_ZAB_RIVER: [number, number][] = [
  [37.5, 44.2], // Zagros peaks near Hakkari
  [36.8, 43.8], // Bekhme
  [36.1, 43.33], // Meets Tigris at Nimrud
];

// Karun River (Flowing from Zagros through Elam / Susa to Shatt al-Arab)
export const KARUN_RIVER: [number, number][] = [
  [32.2, 50.1], // Zagros headwaters (Zard-Kuh)
  [32.0, 49.0], // Shushtar
  [31.3, 48.7], // Ahvaz (Elam)
  [30.43, 48.18], // Khorramshahr (Meets Shatt al-Arab)
];

// Jordan River System (From Mt. Hermon through Galilee to Dead Sea)
export const JORDAN_RIVER_SYSTEM: [number, number][] = [
  [33.3, 35.7], // Mount Hermon snowfields
  [33.249, 35.652], // Dan springs (Dan / Caesarea Philippi)
  [33.08, 35.6], // Lake Hula
  [32.95, 35.62], // Upper Jordan Gorge
  [32.88, 35.62], // Sea of Galilee Inlet
  // Passes through Sea of Galilee...
  [32.71, 35.58], // Sea of Galilee Outlet (Degania)
  [32.6, 35.56], // Yarmouk River confluence
  [32.5, 35.54], // Beth Shean (Scythopolis)
  [32.35, 35.53], // Pella
  [32.19, 35.55], // Jabbok River confluence (Adam / Succoth)
  [32.0, 35.53], // Sartaba
  [31.87, 35.5], // Jericho Ford (Bethabara / Baptism site)
  [31.76, 35.54], // Dead Sea mouth
];

// Jabbok River (Wadi Zarqa - where Jacob wrestled with the Angel)
export const JABBOK_RIVER: [number, number][] = [
  [31.95, 35.93], // Rabbah of the Ammonites (Amman)
  [32.15, 35.8], // Zarqa
  [32.22, 35.65], // Penuel / Mahanaim
  [32.19, 35.55], // Meets Jordan River
];

// Arnon River (Wadi Mujib - boundary of Moab)
export const ARNON_RIVER: [number, number][] = [
  [31.45, 35.9], // Aroer on the lip of the Arnon Gorge
  [31.46, 35.75], // Deep canyon of Arnon
  [31.47, 35.57], // Enters Dead Sea
];

// Orontes River (Syria - flowing north through Hama and Antioch)
export const ORONTES_RIVER: [number, number][] = [
  [34.2, 36.3], // Bekaa Valley (Lebanon)
  [34.73, 36.7], // Homs (Emesa)
  [35.13, 36.75], // Hama (Hamath)
  [35.45, 36.4], // Apamea
  [36.2, 36.15], // Antioch (Antakya)
  [36.0, 35.95], // Mediterranean Sea mouth (Seleucia Pieria)
];

// =========================================================================
// 4. MOUNTAIN RANGES & TOPOGRAPHY
// =========================================================================

export type MountainRange = {
  id: string;
  name: string;
  arabicName: string;
  coords: [number, number][]; // Line along mountain crest
  elevationLabel?: string;
  peaks: {
    id: string;
    name: string;
    arabicName: string;
    lat: number;
    lon: number;
    elevation: number;
    symbolSize: number;
  }[];
};

export const BIBLICAL_MOUNTAIN_RANGES: MountainRange[] = [
  {
    id: "ararat-range",
    name: "Mount Ararat & Armenian Highlands",
    arabicName: "جبال أرارات ومرتفعات أورارتو",
    coords: [
      [39.8, 43.2],
      [39.75, 43.8],
      [39.702, 44.299],
      [39.6, 44.8],
      [39.4, 45.3],
    ],
    elevationLabel: "5,137m",
    peaks: [
      {
        id: "greater-ararat",
        name: "Greater Ararat",
        arabicName: "جبل أرارات الكبير (ماسيس)",
        lat: 39.702,
        lon: 44.299,
        elevation: 5137,
        symbolSize: 34,
      },
      {
        id: "lesser-ararat",
        name: "Lesser Ararat",
        arabicName: "أرارات الصغير (سيس)",
        lat: 39.65,
        lon: 44.49,
        elevation: 3896,
        symbolSize: 24,
      },
      {
        id: "mount-suphan",
        name: "Mt. Süphan",
        arabicName: "جبل سيبان",
        lat: 38.92,
        lon: 42.82,
        elevation: 4058,
        symbolSize: 26,
      },
    ],
  },
  {
    id: "taurus-range",
    name: "Taurus Mountains (Toroslar)",
    arabicName: "سلسلة جبال طوروس",
    coords: [
      [37.2, 31.0],
      [37.0, 32.5],
      [37.2, 34.2],
      [37.5, 35.2], // Cilician Gates (Aladağlar)
      [38.0, 37.0],
      [38.5, 39.0],
      [38.3, 41.5],
    ],
    elevationLabel: "3,756m",
    peaks: [
      {
        id: "cilician-gates",
        name: "Cilician Gates Pass",
        arabicName: "أبواب قيليقية",
        lat: 37.28,
        lon: 34.78,
        elevation: 1400,
        symbolSize: 22,
      },
      {
        id: "taurus-bolkar",
        name: "Bolkar Mountains",
        arabicName: "جبال بولكار",
        lat: 37.24,
        lon: 34.6,
        elevation: 3524,
        symbolSize: 26,
      },
      {
        id: "amanus-mountains",
        name: "Amanus Mts. (Mt. Hor)",
        arabicName: "جبال الأمانوس (جبل هور)",
        lat: 36.75,
        lon: 36.3,
        elevation: 2262,
        symbolSize: 24,
      },
    ],
  },
  {
    id: "lebanon-hermon",
    name: "Lebanon & Mount Hermon",
    arabicName: "جبل لبنان وجبل الشيخ (حرمون)",
    coords: [
      [34.4, 36.1],
      [34.1, 35.9],
      [33.8, 35.8],
      [33.416, 35.856],
      [33.1, 35.75],
    ],
    elevationLabel: "2,814m",
    peaks: [
      {
        id: "mount-hermon",
        name: "Mount Hermon (Sirion / Senir)",
        arabicName: "جبل الشيخ (حرمون / سنير)",
        lat: 33.416,
        lon: 35.856,
        elevation: 2814,
        symbolSize: 28,
      },
      {
        id: "mount-lebanon",
        name: "Mount Lebanon (Cedars)",
        arabicName: "جبل لبنان (أرز الرب)",
        lat: 34.3,
        lon: 36.1,
        elevation: 3088,
        symbolSize: 28,
      },
    ],
  },
  {
    id: "canaan-central-ridge",
    name: "Canaan Highlands & Judean Mountains",
    arabicName: "مرتفعات كنعان وتلال يهوذا",
    coords: [
      [33.0, 35.3], // Upper Galilee
      [32.733, 35.05], // Mount Carmel
      [32.5, 35.3], // Mount Gilboa
      [32.2, 35.25], // Mount Gerizim & Mount Ebal
      [31.93, 35.24], // Bethel ridge
      [31.77, 35.24], // Mount of Olives / Zion
      [31.53, 35.1], // Hebron hills
    ],
    peaks: [
      {
        id: "mount-carmel",
        name: "Mount Carmel",
        arabicName: "جبل الكرمل (مذبح إيليا)",
        lat: 32.733,
        lon: 35.05,
        elevation: 546,
        symbolSize: 20,
      },
      {
        id: "mount-gerizim",
        name: "Mt. Gerizim & Mt. Ebal",
        arabicName: "جبلا جرزيم وعيبال (البركة واللعنة)",
        lat: 32.2,
        lon: 35.27,
        elevation: 940,
        symbolSize: 18,
      },
      {
        id: "mount-olives",
        name: "Mount of Olives & Moriah",
        arabicName: "جبل الزيتون وجبل المريا",
        lat: 31.778,
        lon: 35.245,
        elevation: 826,
        symbolSize: 22,
      },
    ],
  },
  {
    id: "transjordan-mountains",
    name: "Transjordan & Mount Seir (Edom)",
    arabicName: "مرتفعات شرق الأردن وجبال سعير (أدوم)",
    coords: [
      [32.4, 35.8], // Gilead
      [31.765, 35.725], // Mount Nebo
      [31.3, 35.7], // Moab plateau
      [30.6, 35.6], // Edom hills
      [30.32, 35.4], // Mount Seir / Petra
    ],
    peaks: [
      {
        id: "mount-nebo",
        name: "Mount Nebo (Pisgah)",
        arabicName: "جبل نيبو (الفَسجة - مشهد موسى)",
        lat: 31.765,
        lon: 35.725,
        elevation: 817,
        symbolSize: 22,
      },
      {
        id: "mount-hor-edom",
        name: "Mount Hor (Aaron's Tomb / Petra)",
        arabicName: "جبل هور (جبل هارون / البتراء)",
        lat: 30.317,
        lon: 35.405,
        elevation: 1350,
        symbolSize: 24,
      },
    ],
  },
  {
    id: "sinai-massif",
    name: "Sinai Granite Massif",
    arabicName: "كتلة جبال سيناء الجرانيتية",
    coords: [
      [28.9, 33.5],
      [28.64, 33.65], // Mount Serbal
      [28.539, 33.975], // Mount Sinai / Horeb
      [28.51, 33.95], // Mount Catherine
      [28.2, 34.1],
    ],
    elevationLabel: "2,285m",
    peaks: [
      {
        id: "mount-sinai-peak",
        name: "Mount Sinai (Horeb / Jabal Musa)",
        arabicName: "جبل موسى (حوريب / جبل الوصايا)",
        lat: 28.5394,
        lon: 33.975,
        elevation: 2285,
        symbolSize: 28,
      },
      {
        id: "mount-serbal",
        name: "Mount Serbal",
        arabicName: "جبل سربال",
        lat: 28.646,
        lon: 33.65,
        elevation: 2070,
        symbolSize: 22,
      },
    ],
  },
  {
    id: "zagros-range",
    name: "Zagros Mountains (Media & Elam)",
    arabicName: "سلسلة جبال زاغروس (مادي وعيلام)",
    coords: [
      [37.0, 44.5],
      [36.2, 45.8],
      [35.0, 46.8],
      [33.8, 48.2],
      [32.5, 49.8],
      [31.0, 51.5],
      [29.8, 53.0],
    ],
    elevationLabel: "4,409m",
    peaks: [
      {
        id: "mount-dena",
        name: "Mount Dena",
        arabicName: "جبل دنا (أعلى قمم زاغروس)",
        lat: 30.9,
        lon: 51.45,
        elevation: 4409,
        symbolSize: 26,
      },
      {
        id: "mount-zardkuh",
        name: "Zard-Kuh",
        arabicName: "جبل زردكوه (جبال عيلام)",
        lat: 32.36,
        lon: 50.07,
        elevation: 4221,
        symbolSize: 24,
      },
    ],
  },
  {
    id: "alborz-range",
    name: "Alborz Mountains (Mount Damavand)",
    arabicName: "سلسلة جبال ألبرز (جبل دماوند)",
    coords: [
      [36.8, 49.5],
      [36.4, 51.0],
      [35.95, 52.11],
      [36.0, 53.5],
      [36.5, 55.0],
    ],
    elevationLabel: "5,610m",
    peaks: [
      {
        id: "mount-damavand",
        name: "Mount Damavand",
        arabicName: "جبل دماوند (أعلى قمة في الشرق الأوسط)",
        lat: 35.95,
        lon: 52.11,
        elevation: 5610,
        symbolSize: 30,
      },
    ],
  },
];

// =========================================================================
// 5. ANCIENT TRADE ROUTES & HIGHWAYS
// =========================================================================

export type AncientRoute = {
  id: string;
  name: string;
  arabicName: string;
  type: "trade" | "exodus" | "royal" | "abraham";
  coords: [number, number][];
};

export interface RouteStation {
  id: string;
  stationNumber: number;
  title: string;
  arabicTitle: string;
  scripture: string;
  coords: [number, number]; // [lat, lon]
  description: string;
  arabicDescription: string;
  routeType: "abraham" | "exodus";
  stage?: number;
  stageName?: string;
  stageArabicName?: string;
}

export const ABRAHAM_STATIONS: RouteStation[] = [
  {
    id: "abraham-ur",
    stationNumber: 1,
    title: "Ur of the Chaldees",
    arabicTitle: "أور الكلدانيين",
    scripture: "Genesis 11:31, 15:7",
    coords: [30.962, 46.104],
    description: "Abram's ancestral birthplace in Sumer on the lower Euphrates. Departure with his father Terah, wife Sarai, and nephew Lot.",
    arabicDescription: "مسقط رأس إبراهيم وموطن آبائه في بلاد سومر. انطلق مع أبيه تارح وزوجته ساراي ولوط ابن أخيه طاعة للدعوة الإلهية.",
    routeType: "abraham",
  },
  {
    id: "abraham-haran",
    stationNumber: 2,
    title: "Haran (Paddan-Aram)",
    arabicTitle: "حاران (فدان أرام)",
    scripture: "Genesis 11:31 - 12:4",
    coords: [36.864, 39.031],
    description: "Major trading crossroads on the Balikh River where Terah died at 205 years. God gave Abraham the Great Call: 'Go from your country... to the land that I will show you.'",
    arabicDescription: "ملتقى القوافل على نهر البليخ حيث مات تارح، وفيها وجه الله لأبينا إبراهيم الدعوة الكبرى: 'اذهب من أرضك ومن عشيرتك... إلى الأرض التي أريك'.",
    routeType: "abraham",
  },
  {
    id: "abraham-damascus",
    stationNumber: 3,
    title: "Damascus Oasis",
    arabicTitle: "واحة دمشق",
    scripture: "Genesis 15:2",
    coords: [33.51, 36.29],
    description: "Caravan resting oasis en route south into Canaan, and home of Abraham's trusted steward Eliezer of Damascus.",
    arabicDescription: "واحة استراحة القوافل في طريق النزول إلى كنعان، وموطن أليعازر الدمشقي وكيل بيت إبراهيم الأمين.",
    routeType: "abraham",
  },
  {
    id: "abraham-shechem",
    stationNumber: 4,
    title: "Shechem (Oak of Moreh)",
    arabicTitle: "شكيم (بلوطة مورة)",
    scripture: "Genesis 12:6-7",
    coords: [32.213, 35.281],
    description: "Abraham's first recorded encampment in the Promised Land. The Lord appeared to him and promised 'To your offspring I will give this land.' Abraham built his first altar here.",
    arabicDescription: "أول محطة لإبراهيم في أرض كنعان عند بلوطة مورة. ظهر له الرب ووعده 'لنسلك أعطي هذه الأرض' فبنى هناك أول مذبح للرب.",
    routeType: "abraham",
  },
  {
    id: "abraham-bethel",
    stationNumber: 5,
    title: "Bethel & Ai",
    arabicTitle: "بين بيت إيل وعاي",
    scripture: "Genesis 12:8, 13:3-4",
    coords: [31.93, 35.22],
    description: "Abraham pitched his tent with Bethel on the west and Ai on the east, built an altar to the Lord and called on the name of Yahweh.",
    arabicDescription: "نصب إبراهيم خيمته وجعل بيت إيل من المغرب وعاي من المشرق، وبنى مذبحاً للرب ودعا باسم الرب العلي.",
    routeType: "abraham",
  },
  {
    id: "abraham-egypt",
    stationNumber: 6,
    title: "Egypt (Nile Delta)",
    arabicTitle: "أرض مصر (دلتا النيل)",
    scripture: "Genesis 12:10-20",
    coords: [30.796, 31.83],
    description: "Famine forced Abraham to sojourn in Egypt. God protected Sarah from Pharaoh through plagues, and Abraham returned to Canaan enriched.",
    arabicDescription: "اضطر إبراهيم للنزول إلى مصر لشدة الجوع. حفظ الله سارة من فرعون بضربات عظيمة، وخرج إبراهيم غنياً جداً في المواشي والفضة والذهب.",
    routeType: "abraham",
  },
  {
    id: "abraham-hebron",
    stationNumber: 7,
    title: "Hebron (Oaks of Mamre)",
    arabicTitle: "حبرون (بلوطات ممرا)",
    scripture: "Genesis 13:18, 18:1, 23:19",
    coords: [31.53, 35.10],
    description: "Abraham settled by the Oaks of Mamre in Hebron, built an altar, received the Three Heavenly Visitors, and purchased the Cave of Machpelah for burial.",
    arabicDescription: "استقر إبراهيم عند بلوطات ممرا في حبرون وبنى مذبحاً، واستضاف الملائكة الثلاثة وبُشر بإسحق، واشترى حقل ومغارة المكفيلة كمدفن لأجيال الإيمان.",
    routeType: "abraham",
  },
  {
    id: "abraham-beersheba",
    stationNumber: 8,
    title: "Beersheba (Well of Oath)",
    arabicTitle: "بئر سبع (بئر القَسَم)",
    scripture: "Genesis 21:31-33",
    coords: [31.25, 34.79],
    description: "Abraham made a peace covenant with Abimelech, dug the historic well, planted a tamarisk tree, and called on the name of Yahweh the Everlasting God.",
    arabicDescription: "قطع إبراهيم عهد سلام مع أبيمالك وحفر البئر وغرس أثلاً في بئر سبع ودعا هناك باسم الرب الإله السرمدي.",
    routeType: "abraham",
  },
  {
    id: "abraham-moriah",
    stationNumber: 9,
    title: "Mount Moriah (Jerusalem)",
    arabicTitle: "جبل المريا (أورشليم)",
    scripture: "Genesis 22:1-14",
    coords: [31.777, 35.234],
    description: "The supreme test of faith: God commanded Abraham to offer Isaac. An angel stopped him, a ram was provided in the thicket, and Abraham named the place 'The Lord Will Provide' (Yahweh-Yireh).",
    arabicDescription: "امتحان الإيمان الأسمى: أمر الله بتقديم إسحق ذبيحة، فافتدى الرب إسحق بكبش موثق في الغابة، ودعا إبراهيم الموضع 'يهوه يرأه' (في جبل الرب يُرى).",
    routeType: "abraham",
  },
];

export const EXODUS_STATIONS: RouteStation[] = [
  // Stage 1: Deliverance from Egypt
  {
    id: "exodus-rameses",
    stationNumber: 1,
    stage: 1,
    stageName: "Departure from Egypt",
    stageArabicName: "الانطلاق والعبور المعجزي",
    title: "Rameses (Goshen)",
    arabicTitle: "رعمسيس (أرض جاسان)",
    scripture: "Exodus 12:37, Numbers 33:3",
    coords: [30.796, 31.83],
    description: "Launch point of the Exodus after the tenth plague and Passover night. 600,000 men plus women and children marched out in victory.",
    arabicDescription: "نقطة انطلاق الخروج بعد الضربة العاشرة وليلة الفصح الأولى، نحو 600 ألف رجل مشاة عدا النساء والأولاد خرجوا بذراع رفيعة.",
    routeType: "exodus",
  },
  {
    id: "exodus-succoth",
    stationNumber: 2,
    stage: 1,
    stageName: "Departure from Egypt",
    stageArabicName: "الانطلاق والعبور المعجزي",
    title: "Succoth",
    arabicTitle: "سكوت (المظال)",
    scripture: "Exodus 12:37, 13:20",
    coords: [30.552, 32.098],
    description: "First encampment station east of Goshen. Israelites baked unleavened cakes of dough brought out of Egypt.",
    arabicDescription: "أول محطة للمخيم شرق جاسان حيث خبز الشعب عجيناً فطيراً لأنهم طردوا من مصر ولم يقدروا أن يتأخروا.",
    routeType: "exodus",
  },
  {
    id: "exodus-red-sea",
    stationNumber: 3,
    stage: 1,
    stageName: "Departure from Egypt",
    stageArabicName: "الانطلاق والعبور المعجزي",
    title: "Red Sea Crossing (Yam Suph)",
    arabicTitle: "عبور بحر سوف (البحر الأحمر)",
    scripture: "Exodus 14:15-31",
    coords: [29.97, 32.55],
    description: "God split the sea with an east wind. Israel crossed on dry ground with walls of water on left and right; Pharaoh's chariots and army were drowned.",
    arabicDescription: "شق الرب البحر بريح شرقية شديدة وعبر بنو إسرائيل في وسطه على اليابسة والماء سور لهم، وغرق فرعون ومركباته وخيله في لجة اليم.",
    routeType: "exodus",
  },

  // Stage 2: Wilderness to Mount Sinai
  {
    id: "exodus-marah",
    stationNumber: 4,
    stage: 2,
    stageName: "Journey to Mount Sinai",
    stageArabicName: "المسير إلى جبل سيناء",
    title: "Marah (Bitter Waters)",
    arabicTitle: "مارة (المياه المرة)",
    scripture: "Exodus 15:23-25",
    coords: [29.566, 32.883],
    description: "Three days in the wilderness without water. The bitter waters were miraculously made sweet when Moses threw a piece of wood into the spring.",
    arabicDescription: "ساروا ثلاثة أيام في البرية ولم يجدوا ماء. تحولت المياه المرة إلى ماء عذب حلو بعدما طرح موسى شجرة أراه إياها الرب.",
    routeType: "exodus",
  },
  {
    id: "exodus-elim",
    stationNumber: 5,
    stage: 2,
    stageName: "Journey to Mount Sinai",
    stageArabicName: "المسير إلى جبل سيناء",
    title: "Elim (12 Springs & 70 Palms)",
    arabicTitle: "إيليم (12 عيناً و70 نخلة)",
    scripture: "Exodus 15:27",
    coords: [29.283, 32.966],
    description: "Refreshment oasis in the desert featuring 12 springs of water and 70 date palm trees, where the congregation encamped.",
    arabicDescription: "واحة راحة وارتواء في البرية تضم 12 عين ماء بعدد أسباط إسرائيل و70 نخلة بعدد الشيوخ، فنزلوا هناك عند الماء.",
    routeType: "exodus",
  },
  {
    id: "exodus-rephidim",
    stationNumber: 6,
    stage: 2,
    stageName: "Journey to Mount Sinai",
    stageArabicName: "المسير إلى جبل سيناء",
    title: "Rephidim (Massah & Meribah)",
    arabicTitle: "رفيديم (صخرة مريبة وهزيمة عماليق)",
    scripture: "Exodus 17:1-16",
    coords: [28.716, 33.616],
    description: "Moses struck the rock at Horeb to bring forth water. Joshua led Israel in defeating Amalek while Aaron and Hur held up Moses' hands until sunset.",
    arabicDescription: "ضرب موسى الصخرة بعصاه فخرج ماء ارتوى منه الشعب. وهزم يشوع جيش عماليق حين أسند هارون وحور يدي موسى المرفوعتين بالصلاة.",
    routeType: "exodus",
  },
  {
    id: "exodus-sinai",
    stationNumber: 7,
    stage: 2,
    stageName: "Covenant & Law at Sinai",
    stageArabicName: "العهد والوصايا في سيناء",
    title: "Mount Sinai (Horeb)",
    arabicTitle: "جبل سيناء (حوريب / جبل الوصايا)",
    scripture: "Exodus 19-20, 24, 40",
    coords: [28.5394, 33.975],
    description: "The peak where God descended in fire and smoke, gave the Ten Commandments and the Law, made the Covenant with Israel, and the Tabernacle was erected.",
    arabicDescription: "جبل الله المقدس حيث نزل الرب بالنار والسحاب وسلم موسى لوحي العهد والوصايا العشر، وفيه كُشف مثال خيمة الاجتماع وبنيت وحلت شكينة مجد الرب.",
    routeType: "exodus",
  },

  // Stage 3: The 38 Years Wanderings
  {
    id: "exodus-kadesh",
    stationNumber: 8,
    stage: 3,
    stageName: "The 38 Years Wanderings",
    stageArabicName: "تيه الـ 38 عاماً في قادش",
    title: "Kadesh-Barnea",
    arabicTitle: "قادش برنيع",
    scripture: "Numbers 13:26, 14:33-34, 20:1",
    coords: [30.647, 34.417],
    description: "Oasis base where 12 spies were sent into Canaan. Israel rebelled in unbelief and was sentenced to wander 40 years until the generation passed.",
    arabicDescription: "واحة البرية الكبرى التي أرسل منها موسى الجواسيس الـ 12 لتفقد كنعان، وبسبب تمرد الشعب قُضي عليهم بالتيه 40 سنة حتى فني ذلك الجيل.",
    routeType: "exodus",
  },
  {
    id: "exodus-mount-hor",
    stationNumber: 9,
    stage: 3,
    stageName: "The 38 Years Wanderings",
    stageArabicName: "تيه الـ 38 عاماً في قادش",
    title: "Mount Hor (Aaron's Death)",
    arabicTitle: "جبل هور (وفاة هارون الكاهن)",
    scripture: "Numbers 20:22-29",
    coords: [30.317, 35.405],
    description: "Summit on the border of Edom where High Priest Aaron was gathered to his people. His priestly garments were transferred to his son Eleazar.",
    arabicDescription: "قمة جبلية على تخوم أدوم حيث صعد هارون ومات، ونزع موسى عنه ثياب الكهنوت وألبسها ألعازار ابنه، وبكاه الشعب 30 يوماً.",
    routeType: "exodus",
  },

  // Stage 4: Around Edom to Mount Nebo & Promised Land
  {
    id: "exodus-punon",
    stationNumber: 10,
    stage: 4,
    stageName: "Journey to Mount Nebo",
    stageArabicName: "بلوغ جبل نيبو وأرض الموعد",
    title: "Punon (The Bronze Serpent)",
    arabicTitle: "فونون (الحية النحاسية)",
    scripture: "Numbers 21:4-9",
    coords: [30.65, 35.60],
    description: "Fiery serpents bit the people for grumbling. God instructed Moses to make a bronze serpent and put it on a pole; anyone who looked at it lived.",
    arabicDescription: "لدغت الحيات المحرقة الشعب لتذمرهم، فأمر الرب موسى بصنع حية من نحاس ورفعها على راية، فكان كل لديغ ينظر إليها يبرأ ويحيا.",
    routeType: "exodus",
  },
  {
    id: "exodus-arnon",
    stationNumber: 11,
    stage: 4,
    stageName: "Journey to Mount Nebo",
    stageArabicName: "بلوغ جبل نيبو وأرض الموعد",
    title: "Arnon River Gorge",
    arabicTitle: "وادي وسيل أرنون",
    scripture: "Numbers 21:13-20",
    coords: [31.45, 35.75],
    description: "Dramatic canyon border between Moab and the Amorites. Israel sang the Song of the Well and conquered Sihon king of the Amorites.",
    arabicDescription: "الوادي والخانق الطبيعي الفاصل بين موآب والأموريين. ترنم الشعب بأنشودة البئر وهزموا سيحون ملك الأموريين واستولوا على أرضه.",
    routeType: "exodus",
  },
  {
    id: "exodus-mount-nebo",
    stationNumber: 12,
    stage: 4,
    stageName: "Journey to Mount Nebo",
    stageArabicName: "بلوغ جبل نيبو وأرض الموعد",
    title: "Mount Nebo (Pisgah)",
    arabicTitle: "جبل نيبو (الفَسجة - مشهد موسى)",
    scripture: "Deuteronomy 34:1-5",
    coords: [31.765, 35.725],
    description: "Moses climbed from the Plains of Moab to Pisgah. God showed him all the Promised Land from Dan to the Western Sea. Moses died there and God buried him.",
    arabicDescription: "صعد موسى إلى رأس الفسجة فأراه الرب جميع أرض الموعد من جلعاد إلى دان والبحر الغربي. ومات هناك موسى عبد الرب ودفنه الرب في الجواء.",
    routeType: "exodus",
  },
  {
    id: "exodus-plains-of-moab",
    stationNumber: 13,
    stage: 4,
    stageName: "Journey to Mount Nebo",
    stageArabicName: "بلوغ جبل نيبو وأرض الموعد",
    title: "Plains of Moab (Shittim)",
    arabicTitle: "عربات موآب (شطيم أمام أريحا)",
    scripture: "Numbers 22:1, Joshua 3:1",
    coords: [31.84, 35.65],
    description: "Final encampment station east of Jordan opposite Jericho where Deuteronomy was delivered, Joshua was commissioned, and Israel prepared to cross the Jordan.",
    arabicDescription: "المحطة الختامية ومقر المخيم شرق الأردن مقابل أريحا، حيث ألقى موسى خطب سفر التثنية، وتولى يشوع القيادة للعبور إلى كنعان.",
    routeType: "exodus",
  },
];

export const ANCIENT_ROUTES: AncientRoute[] = [
  // =========================================================================
  // 1. ABRAHAM'S PATH (FROM UR TO HARAN, CANAAN & EGYPT)
  // =========================================================================
  {
    id: "abraham-route",
    name: "Abraham's Journey of Faith (Ur to Canaan & Egypt)",
    arabicName: "مسار رحلة إبراهيم الخليل (من أور الكلدانيين إلى كنعان ومصر)",
    type: "abraham",
    coords: [
      [30.962, 46.104], // 1. Ur of the Chaldees (Birthplace & departure)
      [31.326, 45.637], // Uruk / Erech
      [32.12, 45.23], // Nippur
      [32.536, 44.42], // Babylon (Land of Shinar)
      [33.32, 44.42], // Akkad / Opis
      [34.4, 40.92], // Mari on Euphrates
      [35.95, 39.05], // Balikh river confluence
      [36.864, 39.031], // 2. Haran (Paddan-Aram - Terah dies, Divine Call)
      [36.83, 37.93], // Carchemish (Crossing Euphrates into Syria)
      [36.2, 37.15], // Aleppo corridor
      [35.13, 36.75], // Hamath on Orontes
      [34.73, 36.71], // Emesa / Homs
      [33.51, 36.29], // 3. Damascus oasis (Eliezer's home)
      [33.249, 35.652], // Dan / Headwaters of Jordan
      [33.0, 35.65], // Hazor
      [32.7, 35.3], // Jezreel Valley
      [32.213, 35.281], // 4. Shechem (Oak of Moreh - 1st Altar in Promised Land)
      [31.93, 35.22], // 5. Bethel & Ai (Pitching tent & altar of Yahweh)
      [31.777, 35.234], // Jerusalem / Salem (Melchizedek & Mount Moriah)
      [31.53, 35.1], // 6. Hebron / Mamre (Oaks of Mamre & Machpelah)
      [31.25, 34.79], // Beersheba (The South / Negev)
      [31.0, 33.5], // Way of Shur
      [30.796, 31.83], // 7. Goshen / Lower Egypt (Famine journey)
      [29.845, 31.25], // Memphis (Court of Pharaoh)
      [30.796, 31.83], // Return via Goshen
      [31.25, 34.79], // 8. Beersheba (Tamarisk tree & Covenant of Oath)
      [31.777, 35.234], // Mount Moriah (Offering of Isaac - Yahweh Yireh)
      [31.53, 35.1], // Hebron (Cave of Machpelah - Resting place of Patriarchs)
    ],
  },

  // =========================================================================
  // 2. MOSES' EXODUS & 40 YEARS WILDERNESS WANDERINGS
  // =========================================================================
  {
    id: "exodus-route",
    name: "Moses' Exodus & 40 Years Wilderness Wanderings",
    arabicName: "مسار خروج موسى وتيه الـ 40 سنة في البرية",
    type: "exodus",
    coords: [
      [30.796, 31.83], // 1. Rameses / Goshen (Passover night departure)
      [30.552, 32.098], // 2. Pithom / Succoth (First encampment)
      [30.1, 32.5], // Etham at edge of wilderness (Pillar of cloud & fire)
      [29.97, 32.55], // 3. Pi-Hahiroth / Red Sea Crossing (Yam Suph)
      [29.75, 32.7], // Wilderness of Shur
      [29.566, 32.883], // 4. Marah (Bitter waters made sweet)
      [29.283, 32.966], // 5. Elim (12 springs of water & 70 palm trees)
      [28.95, 33.15], // Wilderness of Sin (Manna & quail given)
      [28.85, 33.3], // Encampment by the Red Sea
      [28.78, 33.45], // Dophkah & Alush
      [28.716, 33.616], // 6. Rephidim (Water from the Rock, victory over Amalek)
      [28.5394, 33.975], // 7. Mount Sinai / Horeb (Giving of the Law & Tabernacle)
      [28.7, 34.1], // Taberah (Fire of the Lord)
      [28.8, 34.2], // Kibroth-Hattaavah (Graves of craving)
      [29.0, 34.4], // Hazeroth (Miriam & Aaron)
      [29.25, 34.7], // Wilderness of Paran
      [29.55, 34.95], // Ezion-Geber / Gulf of Aqaba
      [30.647, 34.417], // 8. Kadesh-Barnea (12 Spies dispatched, 38 years wandering)
      [30.317, 35.405], // 9. Mount Hor (Death of Aaron the High Priest)
      [29.65, 35.05], // Compass around the land of Edom
      [30.65, 35.6], // 10. Punon (Fiery serpents & Bronze Serpent lifted up)
      [30.85, 35.65], // Oboth
      [31.05, 35.75], // Iye-Abarim (Border of Moab)
      [31.25, 35.8], // Valley of Zered (38-year milestone)
      [31.45, 35.75], // 11. Arnon River Gorge (Border of Moab & Amorites)
      [31.5, 35.78], // Dibon-Gad
      [31.765, 35.725], // 12. Mount Nebo / Pisgah (Moses views Promised Land)
      [31.84, 35.65], // 13. Plains of Moab / Shittim (Final encampment before Jordan)
    ],
  },

  {
    id: "fertile-crescent-royal-road",
    name: "Mesopotamian Highway & Persian Royal Road",
    arabicName: "طريق الفرات الملكي وقوافل ما بين النهرين",
    type: "royal",
    coords: [
      [30.962, 46.104], // Ur of the Chaldees
      [31.326, 45.637], // Erech (Uruk)
      [32.12, 45.23], // Nippur
      [32.536, 44.42], // Babylon
      [33.32, 44.42], // Baghdad / Opis
      [34.2, 43.88], // Samarra
      [35.458, 43.256], // Assur
      [36.1, 43.33], // Calah (Nimrud)
      [36.367, 43.15], // Nineveh
      [36.864, 39.031], // Haran (Paddan-Aram)
      [36.83, 37.93], // Carchemish
      [36.916, 34.895], // Tarsus / Cilician Gates
    ],
  },
  {
    id: "via-maris",
    name: "Way of the Sea (Via Maris)",
    arabicName: "طريق البحر (فيا ماريس)",
    type: "trade",
    coords: [
      [30.13, 31.32], // Heliopolis
      [30.796, 31.83], // Rameses / Goshen
      [31.05, 32.55], // Pelusium
      [31.13, 33.8], // El-Arish
      [31.28, 34.24], // Raphia
      [31.5, 34.47], // Gaza
      [31.67, 34.56], // Ashkelon
      [31.8, 34.65], // Ashdod
      [32.05, 34.75], // Joppa
      [32.45, 35.0], // Megiddo Pass in Carmel
      [32.58, 35.18], // Megiddo (Armageddon valley)
      [32.7, 35.3], // Jezreel Valley
      [32.8, 35.53], // Tiberias (Sea of Galilee)
      [33.0, 35.65], // Hazor
      [33.25, 35.65], // Dan
      [33.51, 36.29], // Damascus
    ],
  },
  {
    id: "kings-highway",
    name: "The King's Highway (Derekh HaMelekh)",
    arabicName: "طريق الملك (درب السلطان)",
    type: "trade",
    coords: [
      [29.52, 35.0], // Ezion-Geber / Gulf of Aqaba
      [30.32, 35.4], // Petra / Sela (Edom)
      [30.8, 35.6], // Bozrah (Edom)
      [31.1, 35.7], // Kir of Moab (Karak)
      [31.45, 35.75], // Dibon / Arnon Gorge
      [31.7, 35.8], // Medeba (Madaba)
      [31.765, 35.725], // Mount Nebo
      [31.95, 35.93], // Rabbah of the Ammonites (Amman)
      [32.28, 35.9], // Ramoth-Gilead
      [32.7, 36.1], // Ashtaroth (Bashan)
      [33.51, 36.29], // Damascus
    ],
  },
];

// =========================================================================
// 6. FERTILE CRESCENT VEGETATION BIOME ZONE
// =========================================================================

// High-fidelity polygon accurately hugging the ancient arable crescent
export const FERTILE_CRESCENT_POLYGON: [number, number][] = [
  // Nile Delta
  [30.2, 30.5],
  [31.5, 30.2],
  [31.6, 31.0],
  [31.5, 32.2],
  [31.1, 33.0],
  [31.13, 33.8], // Brook of Egypt
  [31.5, 34.47], // Gaza
  [32.0, 34.75], // Sharon Plain
  [32.8, 35.0], // Carmel
  [33.3, 35.2], // Phoenicia
  [34.4, 35.8], // Tripoli
  [35.5, 35.8], // Latakia
  [36.6, 36.2], // Gulf of Issus / Antioch
  // Across Northern Syria & Upper Mesopotamia (Paddan-Aram)
  [37.0, 37.5], // Aleppo / Carchemish
  [37.2, 39.0], // Haran / Urfa
  [37.5, 40.5], // Upper Khabur basin
  [37.2, 42.0], // Nisibis / Tigris entry
  [36.8, 43.2], // Nineveh plain
  [36.0, 44.0], // Arbela (Erbil)
  [35.0, 44.8], // Kirkuk / Zagros foothills
  [34.0, 45.5], // Diyala valley
  // Down Tigris & Euphrates Alluvial Floodplain
  [33.3, 44.5], // Baghdad / Akkad
  [32.5, 45.0], // Babylonia / Kish
  [31.5, 46.0], // Sumer / Uruk
  [30.9, 46.5], // Ur & Eridu
  [30.4, 48.0], // Basra / Shatt al-Arab
  [30.0, 48.7], // Persian Gulf head
  // Southern boundary of Fertile Crescent (Desert transition line)
  [30.2, 47.5],
  [31.0, 45.5],
  [32.0, 44.0],
  [33.0, 42.5],
  [33.5, 40.0],
  [33.5, 37.0], // Palmyra / Syrian Desert fringe
  [32.5, 36.0], // Damascus / Hauran oasis
  [31.8, 35.5], // Jordan Valley
  [31.2, 34.8], // Beersheba / Negev boundary
  [30.5, 32.5], // Suez isthmus
  [30.2, 30.5],
];
