import { useState, useCallback } from "react";
import EquationBalancer from "./components/EquationBalancer";
import MolarMassCalculator from "./components/MolarMassCalculator";
import ReactionExplorer from "./components/ReactionExplorer";

type Mode = "balancer" | "molar-mass" | "reactions";

const MODES: { id: Mode; label: string; icon: string }[] = [
  { id: "balancer", label: "Equation Balancer", icon: "=" },
  { id: "molar-mass", label: "Molar Mass", icon: "M" },
  { id: "reactions", label: "Reactions", icon: "R" },
];

export default function App() {
  const [mode, setMode] = useState<Mode>("balancer");
  const [balancerEquation, setBalancerEquation] = useState<string>("");
  // Incrementing key forces the EquationBalancer to remount with the new initial equation
  const [balancerKey, setBalancerKey] = useState(0);

  const handleBalanceFromExplorer = useCallback((equation: string) => {
    setBalancerEquation(equation);
    setBalancerKey((k) => k + 1);
    setMode("balancer");
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: "var(--glass)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Logo / Title */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white"
              style={{ background: "var(--accent)" }}
            >
              {"C"}
            </div>
            <div>
              <h1
                className="text-lg font-bold leading-tight"
                style={{
                  color: "var(--ink)",
                  fontFamily: "'Fraunces', serif",
                }}
              >
                Chemistry Lab
              </h1>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Balance, calculate, explore
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mode tabs */}
      <nav
        className="sticky top-[73px] z-40 backdrop-blur-xl"
        style={{
          background: "var(--glass)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all"
                style={
                  mode === m.id
                    ? { background: "var(--accent)", color: "#fff" }
                    : { color: "var(--muted)" }
                }
              >
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={
                    mode === m.id
                      ? { background: "rgba(255,255,255,0.2)", color: "#fff" }
                      : { background: "var(--panel)", color: "var(--muted)" }
                  }
                >
                  {m.icon}
                </span>
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {mode === "balancer" && (
            <EquationBalancer key={balancerKey} initialEquation={balancerEquation} />
          )}
          {mode === "molar-mass" && <MolarMassCalculator />}
          {mode === "reactions" && (
            <ReactionExplorer onBalanceEquation={handleBalanceFromExplorer} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs" style={{ color: "var(--muted)" }}>
        <p>
          Chemistry Lab{" "}
          <span style={{ color: "var(--line-strong)" }}>{"·"}</span>{" "}
          <a
            href="https://freeappstore.online"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            FreeAppStore
          </a>
        </p>
      </footer>
    </div>
  );
}
