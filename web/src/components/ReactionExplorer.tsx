import { useState, useCallback, useMemo } from "react";
import {
  REACTIONS,
  REACTION_TYPES,
  REACTION_TYPE_LABELS,
  REACTION_TYPE_COLORS,
  type ReactionType,
  type Reaction,
} from "../data/reactions";
import { parseEquation } from "../lib/parser";
import { balanceEquation } from "../lib/balancer";

interface Props {
  onBalanceEquation: (equation: string) => void;
}

export default function ReactionExplorer({ onBalanceEquation }: Props) {
  const [activeType, setActiveType] = useState<ReactionType | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (activeType === "all" ? REACTIONS : REACTIONS.filter((r) => r.type === activeType)),
    [activeType],
  );

  const toggleExpand = useCallback(
    (id: string) => {
      setExpandedId((prev) => (prev === id ? null : id));
    },
    [],
  );

  const getBalancedEquation = useCallback((equation: string): string => {
    try {
      const parsed = parseEquation(equation);
      const result = balanceEquation(parsed);
      return result.success ? result.balanced : equation;
    } catch {
      return equation;
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="All"
          active={activeType === "all"}
          color="var(--accent)"
          onClick={() => setActiveType("all")}
        />
        {REACTION_TYPES.map((type) => (
          <FilterChip
            key={type}
            label={REACTION_TYPE_LABELS[type]}
            active={activeType === type}
            color={REACTION_TYPE_COLORS[type]}
            onClick={() => setActiveType(type)}
          />
        ))}
      </div>

      {/* Reaction list */}
      <div className="space-y-3">
        {filtered.map((reaction) => (
          <ReactionCard
            key={reaction.id}
            reaction={reaction}
            expanded={expandedId === reaction.id}
            onToggle={() => toggleExpand(reaction.id)}
            getBalancedEquation={getBalancedEquation}
            onBalance={() => onBalanceEquation(reaction.equation)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-8 text-sm" style={{ color: "var(--muted)" }}>
          No reactions in this category.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-4 py-1.5 text-sm font-semibold transition-all"
      style={
        active
          ? { background: color, color: "#fff" }
          : {
              background: "var(--panel)",
              color: "var(--muted)",
              border: "1px solid var(--line)",
            }
      }
    >
      {label}
    </button>
  );
}

function ReactionCard({
  reaction,
  expanded,
  onToggle,
  getBalancedEquation,
  onBalance,
}: {
  reaction: Reaction;
  expanded: boolean;
  onToggle: () => void;
  getBalancedEquation: (eq: string) => string;
  onBalance: () => void;
}) {
  const typeColor = REACTION_TYPE_COLORS[reaction.type];
  const balanced = useMemo(() => getBalancedEquation(reaction.equation), [reaction.equation, getBalancedEquation]);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-4"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ background: typeColor }}
            >
              {REACTION_TYPE_LABELS[reaction.type]}
            </span>
          </div>
          <p className="text-base font-semibold" style={{ color: "var(--ink)" }}>
            {reaction.name}
          </p>
          <p className="text-sm font-mono mt-1" style={{ color: "var(--accent)" }}>
            {balanced}
          </p>
        </div>
        <span
          className="text-lg mt-1 transition-transform"
          style={{
            color: "var(--muted)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          {"▾"}
        </span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div
          className="px-5 pb-4 pt-0 space-y-3"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <div className="pt-3">
            <p className="text-sm" style={{ color: "var(--ink)" }}>
              {reaction.description}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>
              Real-world application
            </p>
            <p className="text-sm" style={{ color: "var(--ink)" }}>
              {reaction.application}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBalance();
            }}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--accent)" }}
          >
            Balance this equation
          </button>
        </div>
      )}
    </div>
  );
}
