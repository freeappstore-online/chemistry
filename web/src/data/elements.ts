/** Periodic table element data used by the parser and molar mass calculator. */
export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  /** Display color for molecule visualisation (hex). */
  color: string;
}

/**
 * A curated subset of elements sufficient for every reaction in the app.
 * Atomic masses from IUPAC 2021 standard atomic weights.
 */
export const ELEMENTS: Record<string, Element> = {
  H:  { symbol: "H",  name: "Hydrogen",   atomicNumber: 1,  atomicMass: 1.008,   color: "#FFFFFF" },
  He: { symbol: "He", name: "Helium",     atomicNumber: 2,  atomicMass: 4.0026,  color: "#D9FFFF" },
  Li: { symbol: "Li", name: "Lithium",    atomicNumber: 3,  atomicMass: 6.941,   color: "#CC80FF" },
  Be: { symbol: "Be", name: "Beryllium",  atomicNumber: 4,  atomicMass: 9.0122,  color: "#C2FF00" },
  B:  { symbol: "B",  name: "Boron",      atomicNumber: 5,  atomicMass: 10.81,   color: "#FFB5B5" },
  C:  { symbol: "C",  name: "Carbon",     atomicNumber: 6,  atomicMass: 12.011,  color: "#404040" },
  N:  { symbol: "N",  name: "Nitrogen",   atomicNumber: 7,  atomicMass: 14.007,  color: "#3050F8" },
  O:  { symbol: "O",  name: "Oxygen",     atomicNumber: 8,  atomicMass: 15.999,  color: "#FF0D0D" },
  F:  { symbol: "F",  name: "Fluorine",   atomicNumber: 9,  atomicMass: 18.998,  color: "#90E050" },
  Ne: { symbol: "Ne", name: "Neon",       atomicNumber: 10, atomicMass: 20.180,  color: "#B3E3F5" },
  Na: { symbol: "Na", name: "Sodium",     atomicNumber: 11, atomicMass: 22.990,  color: "#AB5CF2" },
  Mg: { symbol: "Mg", name: "Magnesium",  atomicNumber: 12, atomicMass: 24.305,  color: "#8AFF00" },
  Al: { symbol: "Al", name: "Aluminium",  atomicNumber: 13, atomicMass: 26.982,  color: "#BFA6A6" },
  Si: { symbol: "Si", name: "Silicon",    atomicNumber: 14, atomicMass: 28.086,  color: "#F0C8A0" },
  P:  { symbol: "P",  name: "Phosphorus", atomicNumber: 15, atomicMass: 30.974,  color: "#FF8000" },
  S:  { symbol: "S",  name: "Sulfur",     atomicNumber: 16, atomicMass: 32.06,   color: "#FFFF30" },
  Cl: { symbol: "Cl", name: "Chlorine",   atomicNumber: 17, atomicMass: 35.45,   color: "#1FF01F" },
  Ar: { symbol: "Ar", name: "Argon",      atomicNumber: 18, atomicMass: 39.948,  color: "#80D1E3" },
  K:  { symbol: "K",  name: "Potassium",  atomicNumber: 19, atomicMass: 39.098,  color: "#8F40D4" },
  Ca: { symbol: "Ca", name: "Calcium",    atomicNumber: 20, atomicMass: 40.078,  color: "#3DFF00" },
  Ti: { symbol: "Ti", name: "Titanium",   atomicNumber: 22, atomicMass: 47.867,  color: "#BFC2C7" },
  Cr: { symbol: "Cr", name: "Chromium",   atomicNumber: 24, atomicMass: 51.996,  color: "#8A99C7" },
  Mn: { symbol: "Mn", name: "Manganese",  atomicNumber: 25, atomicMass: 54.938,  color: "#9C7AC7" },
  Fe: { symbol: "Fe", name: "Iron",       atomicNumber: 26, atomicMass: 55.845,  color: "#E06633" },
  Co: { symbol: "Co", name: "Cobalt",     atomicNumber: 27, atomicMass: 58.933,  color: "#F090A0" },
  Ni: { symbol: "Ni", name: "Nickel",     atomicNumber: 28, atomicMass: 58.693,  color: "#50D050" },
  Cu: { symbol: "Cu", name: "Copper",     atomicNumber: 29, atomicMass: 63.546,  color: "#C88033" },
  Zn: { symbol: "Zn", name: "Zinc",       atomicNumber: 30, atomicMass: 65.38,   color: "#7D80B0" },
  Br: { symbol: "Br", name: "Bromine",    atomicNumber: 35, atomicMass: 79.904,  color: "#A62929" },
  Sr: { symbol: "Sr", name: "Strontium",  atomicNumber: 38, atomicMass: 87.62,   color: "#00FF00" },
  Ag: { symbol: "Ag", name: "Silver",     atomicNumber: 47, atomicMass: 107.87,  color: "#C0C0C0" },
  Sn: { symbol: "Sn", name: "Tin",        atomicNumber: 50, atomicMass: 118.71,  color: "#668080" },
  I:  { symbol: "I",  name: "Iodine",     atomicNumber: 53, atomicMass: 126.90,  color: "#940094" },
  Ba: { symbol: "Ba", name: "Barium",     atomicNumber: 56, atomicMass: 137.33,  color: "#00C900" },
  Au: { symbol: "Au", name: "Gold",       atomicNumber: 79, atomicMass: 196.97,  color: "#FFD123" },
  Hg: { symbol: "Hg", name: "Mercury",    atomicNumber: 80, atomicMass: 200.59,  color: "#B8B8D0" },
  Pb: { symbol: "Pb", name: "Lead",       atomicNumber: 82, atomicMass: 207.2,   color: "#575961" },
};

/** Look up an element; returns undefined for unknown symbols. */
export function getElement(symbol: string): Element | undefined {
  return ELEMENTS[symbol];
}

/** All element symbols we know about. */
export const ALL_SYMBOLS = Object.keys(ELEMENTS);
