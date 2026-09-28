import {
  ProductCategory,
  ProductConcern,
  SkinType,
} from "@/types/discovery";

export const DISCOVERY_STEPS = [
  {
    id: 1,
    title: "Your skin concerns",
    shortTitle: "Concerns",
  },
  {
    id: 2,
    title: "Your skin type",
    shortTitle: "Skin type",
  },
  {
    id: 3,
    title: "What are you looking for?",
    shortTitle: "Product",
  },
  {
    id: 4,
    title: "Your budget",
    shortTitle: "Budget",
  },
  {
    id: 5,
    title: "Your matches",
    shortTitle: "Results",
  },
] as const;

export const CONCERN_OPTIONS: {
  value: ProductConcern;
  label: string;
  description: string;
}[] = [
  {
    value: "ACNE_PRONE",
    label: "Acne-prone skin",
    description: "Breakouts, blemishes and clogged pores",
  },
  {
    value: "DARK_SPOTS",
    label: "Dark spots",
    description: "Visible marks and post-blemish pigmentation",
  },
  {
    value: "UNEVEN_SKIN_TONE",
    label: "Uneven skin tone",
    description: "Dull or inconsistent-looking complexion",
  },
  {
    value: "DRYNESS",
    label: "Dryness",
    description: "Tight, flaky or dehydrated-feeling skin",
  },
  {
    value: "OILY_SKIN",
    label: "Oily skin",
    description: "Excess shine or oil production",
  },
  {
    value: "SENSITIVE_SKIN",
    label: "Sensitive skin",
    description: "Skin that is easily irritated or reactive",
  },
  {
    value: "ROUGH_SKIN",
    label: "Rough skin",
    description: "Uneven or textured skin surface",
  },
  {
    value: "BUMPY_SKIN",
    label: "Bumpy skin",
    description: "Small bumps or uneven texture",
  },
  {
    value: "BODY_ACNE",
    label: "Body acne",
    description: "Breakouts on the chest, back or body",
  },
  {
    value: "ANTI_AGING",
    label: "Anti-aging",
    description: "Fine lines, firmness and skin aging concerns",
  },
];

export const SKIN_TYPE_OPTIONS: {
  value: SkinType;
  label: string;
  description: string;
}[] = [
  {
    value: "NORMAL",
    label: "Normal",
    description: "Generally balanced and comfortable",
  },
  {
    value: "DRY",
    label: "Dry",
    description: "Often feels tight or lacks moisture",
  },
  {
    value: "OILY",
    label: "Oily",
    description: "Tends to produce more oil and shine",
  },
  {
    value: "COMBINATION",
    label: "Combination",
    description: "Oilier in some areas and drier in others",
  },
  {
    value: "SENSITIVE",
    label: "Sensitive",
    description: "Easily irritated or reactive",
  },
  {
    value: "UNKNOWN",
    label: "I'm not sure",
    description: "We'll focus on your other preferences",
  },
];

export const PRODUCT_TYPE_OPTIONS: {
  value: ProductCategory;
  label: string;
  description: string;
}[] = [
  {
    value: "CLEANSER",
    label: "Cleanser",
    description: "Cleanse and prepare your skin",
  },
  {
    value: "SERUM",
    label: "Serum",
    description: "Target specific skin concerns",
  },
  {
    value: "MOISTURISER",
    label: "Moisturiser",
    description: "Hydrate and support your skin barrier",
  },
  {
    value: "SUNSCREEN",
    label: "Sunscreen",
    description: "Daily protection from UV exposure",
  },
  {
    value: "TONER",
    label: "Toner",
    description: "Refresh and prepare your skin",
  },
  {
    value: "BODY_CARE",
    label: "Body care",
    description: "Care for your skin beyond the face",
  },
];

export const BUDGET_OPTIONS = [
  5000,
  10000,
  15000,
  25000,
  50000,
] as const;

export const DEFAULT_DISCOVERY_PAGE_SIZE = 12;