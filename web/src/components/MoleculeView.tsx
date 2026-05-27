/**
 * Simple molecule visualiser: atoms as colored circles, bonds as lines.
 * Lays atoms in a ring for simple molecules. Not a real 3D renderer,
 * but gives a visual sense of the molecule's composition.
 */

import { type ElementCounts } from "../lib/parser";
import { getElement } from "../data/elements";

interface Props {
  counts: ElementCounts;
  size?: number;
}

interface AtomPos {
  symbol: string;
  x: number;
  y: number;
  color: string;
  radius: number;
}

export default function MoleculeView({ counts, size = 200 }: Props) {
  // Expand counts into an atom list
  const atoms: { symbol: string; color: string }[] = [];
  for (const [symbol, count] of Object.entries(counts)) {
    const el = getElement(symbol);
    const color = el?.color ?? "#888888";
    for (let i = 0; i < Math.min(count, 12); i++) {
      atoms.push({ symbol, color });
    }
  }

  if (atoms.length === 0) return null;

  const cx = size / 2;
  const cy = size / 2;

  // Position atoms in a ring (or single atom centered)
  const positions: AtomPos[] = [];
  const atomRadius = Math.max(12, Math.min(24, size / (atoms.length + 2)));
  const ringRadius = atoms.length === 1 ? 0 : size / 2 - atomRadius - 8;

  for (let i = 0; i < atoms.length; i++) {
    const a = atoms[i]!;
    const angle = (2 * Math.PI * i) / atoms.length - Math.PI / 2;
    positions.push({
      symbol: a.symbol,
      x: cx + ringRadius * Math.cos(angle),
      y: cy + ringRadius * Math.sin(angle),
      color: a.color,
      radius: atomRadius,
    });
  }

  // Connect each atom to its neighbours in the ring (simple bond display)
  const bonds: [number, number][] = [];
  if (positions.length > 1) {
    for (let i = 0; i < positions.length; i++) {
      bonds.push([i, (i + 1) % positions.length]);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="mx-auto"
      aria-label="Molecule visualisation"
    >
      {/* Bonds */}
      {bonds.map(([a, b], idx) => {
        const pa = positions[a]!;
        const pb = positions[b]!;
        return (
          <line
            key={`bond-${idx}`}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke="var(--line-strong)"
            strokeWidth={2}
          />
        );
      })}

      {/* Atoms */}
      {positions.map((p, idx) => {
        // Determine text color: use white for dark atom colors, dark for light
        const hex = p.color.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16) || 0;
        const g = parseInt(hex.substring(2, 4), 16) || 0;
        const b = parseInt(hex.substring(4, 6), 16) || 0;
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const textColor = luminance > 0.5 ? "#1a1a1a" : "#ffffff";

        return (
          <g key={`atom-${idx}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.radius}
              fill={p.color}
              stroke="var(--line-strong)"
              strokeWidth={1.5}
            />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={p.radius * 0.8}
              fontWeight={600}
              fill={textColor}
              fontFamily="Manrope, system-ui, sans-serif"
            >
              {p.symbol}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
