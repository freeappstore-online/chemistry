/** Curated reaction library for the Reaction Explorer. */

export type ReactionType =
  | "combustion"
  | "acid-base"
  | "synthesis"
  | "decomposition"
  | "single-replacement"
  | "double-replacement";

export interface Reaction {
  id: string;
  equation: string;
  type: ReactionType;
  name: string;
  description: string;
  application: string;
}

export const REACTION_TYPE_LABELS: Record<ReactionType, string> = {
  combustion: "Combustion",
  "acid-base": "Acid-Base",
  synthesis: "Synthesis",
  decomposition: "Decomposition",
  "single-replacement": "Single Replacement",
  "double-replacement": "Double Replacement",
};

export const REACTION_TYPE_COLORS: Record<ReactionType, string> = {
  combustion: "#ef4444",
  "acid-base": "#8b5cf6",
  synthesis: "#2563eb",
  decomposition: "#f59e0b",
  "single-replacement": "#10b981",
  "double-replacement": "#ec4899",
};

export const REACTIONS: Reaction[] = [
  // --- Combustion (5) ---
  {
    id: "comb-1",
    equation: "CH4 + O2 -> CO2 + H2O",
    type: "combustion",
    name: "Methane Combustion",
    description: "Methane burns in oxygen to produce carbon dioxide and water.",
    application: "Natural gas heating, cooking stoves, power generation.",
  },
  {
    id: "comb-2",
    equation: "C2H5OH + O2 -> CO2 + H2O",
    type: "combustion",
    name: "Ethanol Combustion",
    description: "Ethanol reacts with oxygen, releasing heat energy.",
    application: "Biofuel engines, spirit burners in labs.",
  },
  {
    id: "comb-3",
    equation: "C3H8 + O2 -> CO2 + H2O",
    type: "combustion",
    name: "Propane Combustion",
    description: "Propane burns completely in excess oxygen.",
    application: "BBQ grills, camping gas, heating fuel.",
  },
  {
    id: "comb-4",
    equation: "C6H12O6 + O2 -> CO2 + H2O",
    type: "combustion",
    name: "Glucose Combustion",
    description: "Glucose oxidises completely (models cellular respiration).",
    application: "Biological energy release in living cells.",
  },
  {
    id: "comb-5",
    equation: "C2H2 + O2 -> CO2 + H2O",
    type: "combustion",
    name: "Acetylene Combustion",
    description: "Acetylene burns in oxygen with an extremely hot flame.",
    application: "Oxy-acetylene welding and metal cutting.",
  },

  // --- Acid-Base (5) ---
  {
    id: "ab-1",
    equation: "HCl + NaOH -> NaCl + H2O",
    type: "acid-base",
    name: "Hydrochloric Acid + Sodium Hydroxide",
    description: "A classic neutralisation producing table salt and water.",
    application: "Titration experiments, antacid chemistry.",
  },
  {
    id: "ab-2",
    equation: "H2SO4 + KOH -> K2SO4 + H2O",
    type: "acid-base",
    name: "Sulfuric Acid + Potassium Hydroxide",
    description: "Sulfuric acid neutralises potassium hydroxide.",
    application: "Fertiliser production (potassium sulfate).",
  },
  {
    id: "ab-3",
    equation: "HNO3 + NaOH -> NaNO3 + H2O",
    type: "acid-base",
    name: "Nitric Acid + Sodium Hydroxide",
    description: "Neutralisation producing sodium nitrate.",
    application: "Manufacturing sodium nitrate fertiliser.",
  },
  {
    id: "ab-4",
    equation: "H3PO4 + NaOH -> Na3PO4 + H2O",
    type: "acid-base",
    name: "Phosphoric Acid + Sodium Hydroxide",
    description: "Triprotic acid fully neutralised by sodium hydroxide.",
    application: "Cleaning agents, food chemistry.",
  },
  {
    id: "ab-5",
    equation: "HCl + Ca(OH)2 -> CaCl2 + H2O",
    type: "acid-base",
    name: "Hydrochloric Acid + Calcium Hydroxide",
    description: "Slaked lime neutralises hydrochloric acid.",
    application: "Water treatment, soil pH adjustment.",
  },

  // --- Synthesis (5) ---
  {
    id: "syn-1",
    equation: "H2 + O2 -> H2O",
    type: "synthesis",
    name: "Water Synthesis",
    description: "Hydrogen and oxygen combine to form water.",
    application: "Hydrogen fuel cells, rocket propellant.",
  },
  {
    id: "syn-2",
    equation: "N2 + H2 -> NH3",
    type: "synthesis",
    name: "Ammonia Synthesis (Haber Process)",
    description: "Nitrogen and hydrogen combine under pressure to form ammonia.",
    application: "Fertiliser manufacturing, industrial chemicals.",
  },
  {
    id: "syn-3",
    equation: "Fe + O2 -> Fe2O3",
    type: "synthesis",
    name: "Iron Oxidation (Rusting)",
    description: "Iron combines with oxygen to form iron(III) oxide.",
    application: "Explains corrosion; thermite reactions.",
  },
  {
    id: "syn-4",
    equation: "Na + Cl2 -> NaCl",
    type: "synthesis",
    name: "Sodium Chloride Formation",
    description: "Sodium metal reacts vigorously with chlorine gas.",
    application: "Table salt production, understanding ionic bonding.",
  },
  {
    id: "syn-5",
    equation: "Mg + O2 -> MgO",
    type: "synthesis",
    name: "Magnesium Combustion",
    description: "Magnesium burns brilliantly in oxygen.",
    application: "Flares, fireworks, flash photography.",
  },

  // --- Decomposition (5) ---
  {
    id: "dec-1",
    equation: "H2O2 -> H2O + O2",
    type: "decomposition",
    name: "Hydrogen Peroxide Decomposition",
    description: "Hydrogen peroxide breaks down into water and oxygen gas.",
    application: "Wound disinfection, rocket propellant (concentrated).",
  },
  {
    id: "dec-2",
    equation: "CaCO3 -> CaO + CO2",
    type: "decomposition",
    name: "Calcium Carbonate Decomposition",
    description: "Limestone breaks down when heated (calcination).",
    application: "Cement and lime manufacturing.",
  },
  {
    id: "dec-3",
    equation: "KClO3 -> KCl + O2",
    type: "decomposition",
    name: "Potassium Chlorate Decomposition",
    description: "Releases oxygen gas when heated.",
    application: "Oxygen generation in labs, matches, fireworks.",
  },
  {
    id: "dec-4",
    equation: "NaHCO3 -> Na2CO3 + H2O + CO2",
    type: "decomposition",
    name: "Baking Soda Decomposition",
    description: "Sodium bicarbonate decomposes on heating.",
    application: "Baking (leavening), fire extinguishers.",
  },
  {
    id: "dec-5",
    equation: "NH4NO3 -> N2O + H2O",
    type: "decomposition",
    name: "Ammonium Nitrate Decomposition",
    description: "Decomposes to produce nitrous oxide and water.",
    application: "Fertiliser, cold packs, (explosives under extreme conditions).",
  },

  // --- Single Replacement (5) ---
  {
    id: "sr-1",
    equation: "Zn + HCl -> ZnCl2 + H2",
    type: "single-replacement",
    name: "Zinc + Hydrochloric Acid",
    description: "Zinc displaces hydrogen from hydrochloric acid.",
    application: "Lab hydrogen production, galvanisation chemistry.",
  },
  {
    id: "sr-2",
    equation: "Fe + CuSO4 -> FeSO4 + Cu",
    type: "single-replacement",
    name: "Iron + Copper Sulfate",
    description: "Iron displaces copper from copper sulfate solution.",
    application: "Demonstrating the activity series of metals.",
  },
  {
    id: "sr-3",
    equation: "Mg + HCl -> MgCl2 + H2",
    type: "single-replacement",
    name: "Magnesium + Hydrochloric Acid",
    description: "Magnesium reacts vigorously with acid, producing hydrogen gas.",
    application: "Rate-of-reaction experiments in schools.",
  },
  {
    id: "sr-4",
    equation: "Cu + AgNO3 -> Cu(NO3)2 + Ag",
    type: "single-replacement",
    name: "Copper + Silver Nitrate",
    description: "Copper displaces silver from silver nitrate solution.",
    application: "Silver-plating demonstration, activity series.",
  },
  {
    id: "sr-5",
    equation: "Zn + CuSO4 -> ZnSO4 + Cu",
    type: "single-replacement",
    name: "Zinc + Copper Sulfate",
    description: "Zinc displaces copper, turning the solution colourless.",
    application: "Battery chemistry (Daniell cell).",
  },

  // --- Double Replacement (5) ---
  {
    id: "dr-1",
    equation: "AgNO3 + NaCl -> AgCl + NaNO3",
    type: "double-replacement",
    name: "Silver Nitrate + Sodium Chloride",
    description: "Silver chloride precipitates out of solution.",
    application: "Photography, testing for chloride ions.",
  },
  {
    id: "dr-2",
    equation: "BaCl2 + Na2SO4 -> BaSO4 + NaCl",
    type: "double-replacement",
    name: "Barium Chloride + Sodium Sulfate",
    description: "Barium sulfate precipitates (white, insoluble).",
    application: "Testing for sulfate ions, barium meal (medical imaging).",
  },
  {
    id: "dr-3",
    equation: "Pb(NO3)2 + KI -> PbI2 + KNO3",
    type: "double-replacement",
    name: "Lead Nitrate + Potassium Iodide",
    description: "Produces a bright yellow lead iodide precipitate.",
    application: "Classic 'golden rain' demonstration.",
  },
  {
    id: "dr-4",
    equation: "Na2CO3 + HCl -> NaCl + H2O + CO2",
    type: "double-replacement",
    name: "Sodium Carbonate + Hydrochloric Acid",
    description: "Produces effervescence as CO2 is released.",
    application: "Antacid tablets, cleaning agents.",
  },
  {
    id: "dr-5",
    equation: "CaCl2 + Na2CO3 -> CaCO3 + NaCl",
    type: "double-replacement",
    name: "Calcium Chloride + Sodium Carbonate",
    description: "Calcium carbonate precipitates (chalk/limestone).",
    application: "Water softening, limestone formation.",
  },
];

export function getReactionsByType(type: ReactionType): Reaction[] {
  return REACTIONS.filter((r) => r.type === type);
}

export const REACTION_TYPES: ReactionType[] = [
  "combustion",
  "acid-base",
  "synthesis",
  "decomposition",
  "single-replacement",
  "double-replacement",
];
