
export enum GardenStyle {
  MODERN = 'Modern Minimalist',
  ENGLISH = 'English Cottage',
  JAPANESE = 'Japanese Zen',
  MEDITERRANEAN = 'Mediterranean',
  TROPICAL = 'Tropical Paradise',
  WILDLIFE = 'Wildlife-Friendly'
}

export enum SunlightLevel {
  FULL_SUN = 'Full Sun',
  PARTIAL_SHADE = 'Partial Shade',
  FULL_SHADE = 'Full Shade'
}

export interface GardenPreferences {
  style: GardenStyle;
  size: string;
  sunlight: SunlightLevel;
  features: string[];
  customDescription: string;
}

export interface GenerationState {
  isLoading: boolean;
  imageUrl: string | null;
  error: string | null;
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}
