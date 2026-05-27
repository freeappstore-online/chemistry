import { useState, useCallback } from "react";
import { parseCompound } from "../lib/parser";
import { computeMolarMass, type MolarMassResult } from "../lib/molar-mass";

export default function MolarMassCalculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<MolarMassResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(() => {
    setError(null);
    setResult(null);

    if (!input.trim()) {
      setError("Please enter a chemical formula.");
      return;
    }

    try {
      const counts = parseCompound(input);
      if (Object.keys(counts).length === 0) {
        setError("Could not parse any elements from the formula.");
        return;
      }
      const massResult = computeMolarMass(counts);
      if (massResult.unknownSymbols.length > 0) {
        setError(`Unknown element(s): ${massResult.unknownSymbols.join(", ")}`);
      }
      if (massResult.contributions.length > 0) {
        setResult(massResult);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse formula.");
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  // Bar chart color palette (accessible, distinct)
  const chartColors = [
    "#2563eb",
    "#dc2626",
    "#16a34a",
    "#d97706",
    "#8b5cf6",
    "#ec4899",
    "#0891b2",
    "#65a30d",
    "#be123c",
    "#7c3aed",
  ];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: "var(--muted)" }}>
          Enter a chemical formula
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. H2SO4"
            className="flex-1 rounded-xl px-4 py-3 text-lg font-mono outline-none transition-all"
            style={{
              background: "var(--panel)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
            }}
          />
          <button
            onClick={handleCalculate}
            className="rounded-xl px-6 py-3 font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--accent)" }}
          >
            Calculate
          </button>
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Supports subscripts (H2O), parentheses Ca(OH)2, and hydrates CuSO4{"·"}5H2O.
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
      {result && (
        <div className="space-y-6">
          {/* Total */}
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
              Molar Mass
            </p>
            <p className="text-3xl md:text-4xl font-bold" style={{ color: "var(--ink)" }}>
              {result.totalMass.toFixed(3)}{" "}
              <span className="text-lg font-normal" style={{ color: "var(--muted)" }}>
                g/mol
              </span>
            </p>
          </div>

          {/* Element breakdown table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--line)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--panel)" }}>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>
                    Element
                  </th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>
                    Count
                  </th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>
                    Atomic Mass
                  </th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>
                    Total
                  </th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.contributions.map((c) => (
                  <tr key={c.symbol} style={{ borderTop: "1px solid var(--line)" }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: "var(--ink)" }}>
                      <span className="font-mono">{c.symbol}</span>{" "}
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {c.name}
                      </span>
                    </td>
                    <td className="text-right px-4 py-3 font-mono" style={{ color: "var(--ink)" }}>
                      {c.count}
                    </td>
                    <td className="text-right px-4 py-3 font-mono" style={{ color: "var(--muted)" }}>
                      {c.atomicMass.toFixed(3)}
                    </td>
                    <td className="text-right px-4 py-3 font-mono font-semibold" style={{ color: "var(--ink)" }}>
                      {c.totalMass.toFixed(3)}
                    </td>
                    <td className="text-right px-4 py-3 font-mono font-semibold" style={{ color: "var(--accent)" }}>
                      {c.percent.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Composition bar chart */}
          <div className="space-y-3">
            <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
              Percent Composition
            </p>
            <div className="space-y-2">
              {result.contributions.map((c, i) => {
                const barColor = chartColors[i % chartColors.length]!;
                return (
                  <div key={c.symbol} className="flex items-center gap-3">
                    <span
                      className="w-8 text-right text-sm font-mono font-semibold"
                      style={{ color: "var(--ink)" }}
                    >
                      {c.symbol}
                    </span>
                    <div
                      className="flex-1 rounded-full overflow-hidden h-6"
                      style={{ background: "var(--panel)" }}
                    >
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2 text-xs font-bold text-white transition-all duration-500"
                        style={{
                          width: `${Math.max(c.percent, 3)}%`,
                          background: barColor,
                        }}
                      >
                        {c.percent >= 8 ? `${c.percent.toFixed(1)}%` : ""}
                      </div>
                    </div>
                    {c.percent < 8 && (
                      <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                        {c.percent.toFixed(1)}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stacked bar */}
            <div className="mt-4">
              <div className="rounded-full overflow-hidden h-8 flex" style={{ background: "var(--panel)" }}>
                {result.contributions.map((c, i) => {
                  const barColor = chartColors[i % chartColors.length]!;
                  return (
                    <div
                      key={c.symbol}
                      className="h-full flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        width: `${c.percent}%`,
                        background: barColor,
                        minWidth: c.percent > 0 ? "2px" : "0",
                      }}
                      title={`${c.symbol}: ${c.percent.toFixed(1)}%`}
                    >
                      {c.percent >= 10 ? c.symbol : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
