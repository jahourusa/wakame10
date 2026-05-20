/**
 * Empty open-top box icon used as the brand's cart symbol.
 * 3D isometric drawing of an open sushi-takeout box — the inner floor of the
 * box is visible through the top opening, giving an "empty box" feel.
 *
 * Color comes from `currentColor` — set via `text-*` classes on the parent.
 */
export function SushiBoxIcon({
  className,
  size = 24,
  strokeWidth = 1.6,
}: {
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Top opening rim — outer parallelogram */}
      <path d="M3 8.5 L12 4.5 L21 8.5 L12 12.5 Z" />

      {/* Interior floor visible through the opening — smaller inner parallelogram */}
      <path d="M6.5 9 L12 7 L17.5 9 L12 11 Z" />

      {/* Box body — left vertical edge */}
      <path d="M3 8.5 L3 16.5" />

      {/* Box body — right vertical edge */}
      <path d="M21 8.5 L21 16.5" />

      {/* Box body — front center seam */}
      <path d="M12 12.5 L12 20.5" />

      {/* Bottom edges — left/right diagonals to the front bottom corner */}
      <path d="M3 16.5 L12 20.5 L21 16.5" />
    </svg>
  );
}
