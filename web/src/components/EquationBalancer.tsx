import { useState, useCallback } from "react";
import { parseEquation, parseCompound } from "../lib/parser";
import { balanceEquation, type BalancingResult } from "../lib/balancer";
import MoleculeView from "./MoleculeView";

interface Props {
  initialEquation?: string;
}

export default function EquationBalancer({ initialEquation }: Props) {
  const [input, setInput] = useState(initialEquation ?? "");
  const [result, setResult] = useState<BalancingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBalance = useCallback(() => {
    setError(null);
    setResult(null);

    if (!input.trim()) {
      setError("Please enter a chemical equation.");
      return;
    }

    try {
      const parsed = parseEquation(input);
      const balanced = balanceEquation(parsed);
      setResult(balanced);
      if (!balanced.success && balanced.error) {
        setError(balanced.error);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse equation.");
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBalance();
    }
  };

  // Parse balanced compounds for molecule views
  const balancedCompounds =
    result?.success
      ? (() => {
          try {
            const eq = parseEquation(input);
            return [
              ...eq.left.compounds.map((c, i) => ({
                formula: result.leftCoeffs[i] !== 1 ? `${result.leftCoeffs[i]}${c}` : c,
                counts: parseCompound(
                  result.leftCoeffs[i] !== 1 ? `${result.leftCoeffs[i]}${c}` : c,
                ),
              })),
              ...eq.right.compounds.map((c, i) => ({
                formula: result.rightCoeffs[i] !== 1 ? `${result.rightCoeffs[i]}${c}` : c,
                counts: parseCompound(
                  result.rightCoeffs[i] !== 1 ? `${result.rightCoeffs[i]}${c}` : c,
                ),
              })),
            ];
          } catch {
            return [];
          }
        })()
      : [];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: "var(--muted)" }}>
          Enter a chemical equation
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Fe + O2 -> Fe2O3"
            className="flex-1 rounded-xl px-4 py-3 text-lg font-mono outline-none transition-all"
            style={{
              background: "var(--panel)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
            }}
          />
          <button
            onClick={handleBalance}
            className="rounded-xl px-6 py-3 font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--accent)" }}
          >
            Balance
          </button>
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Use <code className="px-1 py-0.5 rounded" style={{ background: "var(--panel)" }}>-&gt;</code> or{" "}
          <code className="px-1 py-0.5 rounded" style={{ background: "var(--panel)" }}>=</code> as the arrow.
          Supports parentheses like Ca(OH)2 and hydrates like CuSO4{"·"}5H2O.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: "color-mix(in srgb, var(--error) 12%, transparent)", color: "var(--error)" }}
        >
          {error}
        </div>
      )}

      {/* Result */}
      {result?.success && (
        <div className="space-y-6">
          {/* Balanced equation */}
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
              Balanced Equation
            </p>
            <p className="text-2xl md:text-3xl font-bold font-mono" style={{ color: "var(--ink)" }}>
              {result.balanced}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
              Solution Steps
            </p>
            <div className="space-y-2">
              {result.steps.map((step, i) => (
                <div
                  key={i}
                  className="rounded-xl px-4 py-3 text-sm flex items-start gap-3"
                  style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: "var(--ink)" }}>{step.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Molecule views */}
          {balancedCompounds.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
                Molecule Visualisation
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {balancedCompounds.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 text-center"
                    style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
                  >
                    <MoleculeView counts={c.counts} size={140} />
                    <p className="mt-2 text-sm font-mono font-semibold" style={{ color: "var(--ink)" }}>
                      {c.formula}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
