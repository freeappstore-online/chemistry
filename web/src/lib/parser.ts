/**
 * Chemical formula parser.
 *
 * Handles:
 *   - Subscripts:          H2O   -> { H: 2, O: 1 }
 *   - Parenthetical groups: Ca(OH)2 -> { Ca: 1, O: 2, H: 2 }
 *   - Leading coefficients: 2H2O  -> { H: 4, O: 2 }
 *   - Hydrate dot:          CuSO4·5H2O (splits on the dot)
 *   - Nested parens:        Mg3(PO4)2
 */

export type ElementCounts = Record<string, number>;

/** Merge b into a (mutates a). */
function merge(a: ElementCounts, b: ElementCounts, factor: number): void {
  for (const [el, n] of Object.entries(b)) {
    a[el] = (a[el] ?? 0) + n * factor;
  }
}

/**
 * Tokenise a formula string (no leading coefficient) into a flat element-count map.
 * Uses a recursive descent approach to handle parenthetical groups.
 */
function parseGroup(formula: string, pos: { i: number }): ElementCounts {
  const counts: ElementCounts = {};

  while (pos.i < formula.length) {
    const ch = formula[pos.i];

    if (ch === "(") {
      // Recurse into parenthetical group
      pos.i++; // skip '('
      const inner = parseGroup(formula, pos);
      // pos.i now points at ')' or past end
      if (pos.i < formula.length && formula[pos.i] === ")") {
        pos.i++; // skip ')'
      }
      const sub = readNumber(formula, pos);
      merge(counts, inner, sub);
    } else if (ch === ")") {
      // End of current group; let caller handle
      break;
    } else if (ch !== undefined && ch >= "A" && ch <= "Z") {
      let symbol = ch;
      pos.i++;
      while (pos.i < formula.length) {
        const lc = formula[pos.i];
        if (lc !== undefined && lc >= "a" && lc <= "z") {
          symbol += lc;
          pos.i++;
        } else {
          break;
        }
      }
      const sub = readNumber(formula, pos);
      counts[symbol] = (counts[symbol] ?? 0) + sub;
    } else {
      // Unknown character; skip
      pos.i++;
    }
  }

  return counts;
}

/** Read a numeric subscript at the current position; default 1. */
function readNumber(formula: string, pos: { i: number }): number {
  let numStr = "";
  while (pos.i < formula.length) {
    const c = formula[pos.i];
    if (c !== undefined && c >= "0" && c <= "9") {
      numStr += c;
      pos.i++;
    } else {
      break;
    }
  }
  return numStr.length > 0 ? parseInt(numStr, 10) : 1;
}

/**
 * Parse a single compound string (may include a leading coefficient).
 * Examples: "2H2O", "Ca(OH)2", "CuSO4·5H2O"
 */
export function parseCompound(raw: string): ElementCounts {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return {};

  // Handle hydrate dot: split on middle-dot, regular dot between formulas, or
  // the Unicode interpunct.  We detect a dot separator when the character after
  // the dot is a digit (coefficient of the hydrate water) — this avoids
  // mis-splitting element symbols that happen to follow a digit.
  const hydrateParts = trimmed.split(/[·]/);
  // Also try ASCII period as hydrate separator when followed by a digit:
  if (hydrateParts.length === 1) {
    const dotMatch = trimmed.match(/^(.+?)\.(\d.+)$/);
    if (dotMatch) {
      const p1 = dotMatch[1];
      const p2 = dotMatch[2];
      if (p1 !== undefined && p2 !== undefined) {
        const a = parseSingleCompound(p1);
        const b = parseSingleCompound(p2);
        merge(a, b, 1);
        return a;
      }
    }
  }

  if (hydrateParts.length > 1) {
    const result: ElementCounts = {};
    for (const part of hydrateParts) {
      if (part !== undefined) {
        merge(result, parseSingleCompound(part), 1);
      }
    }
    return result;
  }

  return parseSingleCompound(trimmed);
}

/** Parse a single compound (no hydrate dots). */
function parseSingleCompound(raw: string): ElementCounts {
  const trimmed = raw.trim();
  const pos = { i: 0 };

  // Read optional leading coefficient
  const coeff = readNumber(trimmed, pos);
  const counts = parseGroup(trimmed, pos);

  if (coeff !== 1) {
    for (const el of Object.keys(counts)) {
      counts[el] = (counts[el] ?? 0) * coeff;
    }
  }

  return counts;
}

/** Represents one side of a chemical equation. */
export interface EquationSide {
  /** Raw compound strings (trimmed). */
  compounds: string[];
  /** Per-compound element counts (without coefficients from balancing). */
  compoundCounts: ElementCounts[];
}

/** Parsed chemical equation. */
export interface ParsedEquation {
  left: EquationSide;
  right: EquationSide;
  /** All unique element symbols appearing in the equation. */
  elements: string[];
}

/**
 * Parse an equation string like "Fe + O2 -> Fe2O3".
 * Accepts  ->  ,  -->  ,  =  ,  =>  as arrow separators.
 */
export function parseEquation(input: string): ParsedEquation {
  const normalized = input.trim();
  // Split on arrow
  const arrowMatch = normalized.split(/\s*(?:-->|->|=>|=)\s*/);
  if (arrowMatch.length !== 2) {
    throw new Error("Equation must have exactly one arrow (-> or = or =>).");
  }

  const [leftStr, rightStr] = arrowMatch;
  if (!leftStr || !rightStr) {
    throw new Error("Both sides of the equation must be non-empty.");
  }

  const parseSide = (s: string): EquationSide => {
    const compounds = s.split("+").map((c) => c.trim()).filter(Boolean);
    const compoundCounts = compounds.map((c) => parseCompound(c));
    return { compounds, compoundCounts };
  };

  const left = parseSide(leftStr);
  const right = parseSide(rightStr);

  const elementSet = new Set<string>();
  for (const cc of [...left.compoundCounts, ...right.compoundCounts]) {
    for (const el of Object.keys(cc)) {
      elementSet.add(el);
    }
  }

  return { left, right, elements: [...elementSet].sort() };
}
