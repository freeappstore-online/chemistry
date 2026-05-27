/**
 * Equation balancer using a null-space / algebraic method.
 *
 * 1. Build the composition matrix: rows = elements, columns = compounds.
 *    Left-side compounds get positive counts, right-side get negative.
 * 2. Reduce to row-echelon form (Gaussian elimination over rationals).
 * 3. Read off the null-space vector (the coefficients).
 * 4. Scale to smallest positive integers.
 */

import { type ParsedEquation } from "./parser";

export interface BalancingStep {
  description: string;
  /** Coefficients at this step (left then right). null = not yet determined. */
  coefficients: (number | null)[];
}

export interface BalancingResult {
  /** Whether balancing succeeded. */
  success: boolean;
  /** Left-side coefficients (same order as parsed compounds). */
  leftCoeffs: number[];
  /** Right-side coefficients. */
  rightCoeffs: number[];
  /** Human-readable steps. */
  steps: BalancingStep[];
  /** Formatted balanced equation string. */
  balanced: string;
  /** Error message if not successful. */
  error?: string;
}

/** Greatest common divisor. */
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** Least common multiple. */
function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

/**
 * Rational number to avoid floating-point issues during elimination.
 */
class Rat {
  constructor(
    public n: number,
    public d: number,
  ) {
    if (d < 0) {
      this.n = -n;
      this.d = -d;
    }
    const g = gcd(Math.abs(this.n), Math.abs(this.d));
    if (g > 0) {
      this.n /= g;
      this.d /= g;
    }
  }

  static ZERO = new Rat(0, 1);
  static ONE = new Rat(1, 1);

  static from(v: number): Rat {
    return new Rat(v, 1);
  }

  isZero(): boolean {
    return this.n === 0;
  }

  neg(): Rat {
    return new Rat(-this.n, this.d);
  }

  add(o: Rat): Rat {
    return new Rat(this.n * o.d + o.n * this.d, this.d * o.d);
  }

  sub(o: Rat): Rat {
    return this.add(o.neg());
  }

  mul(o: Rat): Rat {
    return new Rat(this.n * o.n, this.d * o.d);
  }

  div(o: Rat): Rat {
    if (o.n === 0) throw new Error("Division by zero");
    return new Rat(this.n * o.d, this.d * o.n);
  }

  toNumber(): number {
    return this.n / this.d;
  }
}

export function balanceEquation(eq: ParsedEquation): BalancingResult {
  const { left, right, elements } = eq;
  const numCompounds = left.compounds.length + right.compounds.length;
  const steps: BalancingStep[] = [];

  // Step 0: show unbalanced element counts
  const leftTotal: Record<string, number> = {};
  const rightTotal: Record<string, number> = {};
  for (const cc of left.compoundCounts) {
    for (const [el, n] of Object.entries(cc)) {
      leftTotal[el] = (leftTotal[el] ?? 0) + n;
    }
  }
  for (const cc of right.compoundCounts) {
    for (const [el, n] of Object.entries(cc)) {
      rightTotal[el] = (rightTotal[el] ?? 0) + n;
    }
  }

  const countSummary = elements
    .map((el) => `${el}: ${leftTotal[el] ?? 0} left, ${rightTotal[el] ?? 0} right`)
    .join("; ");

  steps.push({
    description: `Unbalanced element counts: ${countSummary}`,
    coefficients: Array(numCompounds).fill(1) as number[],
  });

  // Build composition matrix: rows=elements, cols=compounds.
  // Left compounds positive, right compounds negative.
  const rows = elements.length;
  const cols = numCompounds;

  const matrix: Rat[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Rat[] = [];
    const el = elements[r]!;
    for (let c = 0; c < left.compounds.length; c++) {
      const cc = left.compoundCounts[c];
      row.push(Rat.from(cc?.[el] ?? 0));
    }
    for (let c = 0; c < right.compounds.length; c++) {
      const cc = right.compoundCounts[c];
      row.push(Rat.from(-(cc?.[el] ?? 0)));
    }
    matrix.push(row);
  }

  steps.push({
    description: `Set up composition matrix (${rows} elements x ${cols} compounds). Left-side compounds positive, right-side negative.`,
    coefficients: Array(numCompounds).fill(null) as null[],
  });

  // Gaussian elimination to row-echelon form
  let pivotRow = 0;
  const pivotCols: number[] = [];

  for (let col = 0; col < cols && pivotRow < rows; col++) {
    // Find pivot
    let maxRow = -1;
    for (let r = pivotRow; r < rows; r++) {
      if (!matrix[r]![col]!.isZero()) {
        maxRow = r;
        break;
      }
    }
    if (maxRow === -1) continue;

    // Swap
    if (maxRow !== pivotRow) {
      [matrix[pivotRow], matrix[maxRow]] = [matrix[maxRow]!, matrix[pivotRow]!];
    }

    pivotCols.push(col);

    // Eliminate below
    const pivotVal = matrix[pivotRow]![col]!;
    for (let r = pivotRow + 1; r < rows; r++) {
      const factor = matrix[r]![col]!.div(pivotVal);
      if (!factor.isZero()) {
        for (let c = col; c < cols; c++) {
          matrix[r]![c] = matrix[r]![c]!.sub(factor.mul(matrix[pivotRow]![c]!));
        }
      }
    }
    pivotRow++;
  }

  steps.push({
    description: "Perform Gaussian elimination to find the null space of the composition matrix.",
    coefficients: Array(numCompounds).fill(null) as null[],
  });

  // Back-substitution to find null-space vector.
  // Free variables: columns not in pivotCols.
  const freeVars = new Set<number>();
  for (let c = 0; c < cols; c++) {
    if (!pivotCols.includes(c)) freeVars.add(c);
  }

  // If no free variable, equation can't be balanced (shouldn't happen for valid chem eq)
  if (freeVars.size === 0) {
    return {
      success: false,
      leftCoeffs: left.compounds.map(() => 1),
      rightCoeffs: right.compounds.map(() => 1),
      steps,
      balanced: "",
      error: "No solution found — the equation may already be balanced trivially or is invalid.",
    };
  }

  // Set each free variable to 1, solve for pivot variables via back-substitution.
  const solution: Rat[] = Array(cols)
    .fill(null)
    .map(() => Rat.ZERO);

  // Pick the first free variable and set it to 1
  const freeArr = [...freeVars];
  for (const fv of freeArr) {
    solution[fv] = Rat.ONE;
  }

  // Back-substitute
  for (let p = pivotCols.length - 1; p >= 0; p--) {
    const pCol = pivotCols[p]!;
    const pRow = p; // since we've been incrementing pivotRow in order
    let sum = Rat.ZERO;
    for (let c = pCol + 1; c < cols; c++) {
      sum = sum.add(matrix[pRow]![c]!.mul(solution[c]!));
    }
    solution[pCol] = sum.neg().div(matrix[pRow]![pCol]!);
  }

  // Convert to positive integers
  // First, make all positive (if any negative, flip sign of all)
  let allNeg = true;
  let allPos = true;
  for (const s of solution) {
    if (s.toNumber() > 0) allNeg = false;
    if (s.toNumber() < 0) allPos = false;
  }

  const signed = allNeg
    ? solution.map((s) => s.neg())
    : allPos
      ? solution
      : solution.map((s) => (s.toNumber() < 0 ? s.neg() : s));

  // Find LCM of denominators to make integers
  let commonDenom = 1;
  for (const s of signed) {
    commonDenom = lcm(commonDenom, Math.abs(s.d));
  }

  let intCoeffs = signed.map((s) => Math.round(s.toNumber() * commonDenom));

  // Make sure all positive
  if (intCoeffs.some((c) => c < 0)) {
    // Flip negatives — this can happen with multi-dimensional null spaces
    intCoeffs = intCoeffs.map((c) => Math.abs(c));
  }

  // Reduce by GCD
  let g = intCoeffs[0] ?? 1;
  for (let i = 1; i < intCoeffs.length; i++) {
    g = gcd(g, intCoeffs[i] ?? 1);
  }
  if (g > 1) {
    intCoeffs = intCoeffs.map((c) => c / g);
  }

  // Any zero coefficient means that compound is not part of the balanced equation — error
  if (intCoeffs.some((c) => c === 0)) {
    return {
      success: false,
      leftCoeffs: left.compounds.map(() => 1),
      rightCoeffs: right.compounds.map(() => 1),
      steps,
      balanced: "",
      error: "Could not balance — a compound has coefficient 0, suggesting the equation is invalid.",
    };
  }

  const leftCoeffs = intCoeffs.slice(0, left.compounds.length);
  const rightCoeffs = intCoeffs.slice(left.compounds.length);

  // Verification step
  const verify: Record<string, number> = {};
  for (let i = 0; i < left.compounds.length; i++) {
    const cc = left.compoundCounts[i]!;
    const coeff = leftCoeffs[i]!;
    for (const [el, n] of Object.entries(cc)) {
      verify[el] = (verify[el] ?? 0) + n * coeff;
    }
  }
  for (let i = 0; i < right.compounds.length; i++) {
    const cc = right.compoundCounts[i]!;
    const coeff = rightCoeffs[i]!;
    for (const [el, n] of Object.entries(cc)) {
      verify[el] = (verify[el] ?? 0) - n * coeff;
    }
  }

  const isBalanced = Object.values(verify).every((v) => v === 0);

  if (!isBalanced) {
    return {
      success: false,
      leftCoeffs: leftCoeffs,
      rightCoeffs: rightCoeffs,
      steps,
      balanced: "",
      error: "Verification failed — the computed coefficients do not balance all elements.",
    };
  }

  steps.push({
    description: `Found coefficients: ${intCoeffs.join(", ")}. Verified that all elements balance.`,
    coefficients: intCoeffs,
  });

  // Format balanced equation string
  const formatSide = (compounds: string[], coeffs: number[]): string =>
    compounds
      .map((c, i) => {
        const coeff = coeffs[i]!;
        return coeff === 1 ? c : `${coeff}${c}`;
      })
      .join(" + ");

  const balanced = `${formatSide(left.compounds, leftCoeffs)} -> ${formatSide(right.compounds, rightCoeffs)}`;

  steps.push({
    description: `Balanced: ${balanced}`,
    coefficients: intCoeffs,
  });

  return {
    success: true,
    leftCoeffs,
    rightCoeffs,
    steps,
    balanced,
  };
}
