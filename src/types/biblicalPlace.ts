export type PlaceType =
  | "city"
  | "town"
  | "village"
  | "settlement"
  | "region"
  | "country"
  | "kingdom"
  | "mountain"
  | "hill"
  | "valley"
  | "river"
  | "sea"
  | "lake"
  | "desert"
  | "wilderness"
  | "plain"
  | "pass"
  | "spring"
  | "oasis"
  | "well"
  | "camp"
  | "other";

export type PlaceCertainty = "certain" | "probable" | "uncertain";

export interface BiblicalPlace {
  id: string;
  name: string;
  arabicName?: string;
  biblicalNames?: string[];
  aliases?: string[];
  type: PlaceType;
  latitude: number;
  longitude: number;
  certainty: PlaceCertainty;
  modernName?: string;
  modernCountry?: string;
  biblicalReferences?: string[];
  description?: string;
  arabicDescription?: string;
  region?: string;
  keyEvents?: string[];
}
