/**
 * Molar mass calculator.
 *
 * Given a parsed element-count map and element data, compute:
 *   - Per-element contribution (count * atomic mass)
 *   - Total molar mass
 *   - Percent composition by element
 */

import { type ElementCounts } from "./parser";
import { getElement } from "../data/elements";

export interface ElementContribution {
  symbol: string;
  name: string;
  count: number;
  atomicMass: number;
  totalMass: number;
  percent: number;
  color: string;
}

export interface MolarMassResult {
  totalMass: number;
  contributions: ElementContribution[];
  unknownSymbols: string[];
}

export function computeMolarMass(counts: ElementCounts): MolarMassResult {
  const contributions: ElementContribution[] = [];
  const unknownSymbols: string[] = [];
  let totalMass = 0;

  for (const [symbol, count] of Object.entries(counts)) {
    const el = getElement(symbol);
    if (!el) {
      unknownSymbols.push(symbol);
      continue;
    }
    const mass = count * el.atomicMass;
    totalMass += mass;
    contributions.push({
      symbol,
      name: el.name,
      count,
      atomicMass: el.atomicMass,
      totalMass: mass,
      percent: 0, // filled in below
      color: el.color,
    });
  }

  // Calculate percentages
  if (totalMass > 0) {
    for (const c of contributions) {
      c.percent = (c.totalMass / totalMass) * 100;
    }
  }

  // Sort by percentage descending
  contributions.sort((a, b) => b.percent - a.percent);

  return { totalMass, contributions, unknownSymbols };
}
