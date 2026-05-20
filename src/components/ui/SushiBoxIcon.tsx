/**
 * Cart icon — a clean 3D open empty box (sushi-takeout style).
 * Inspired by Lucide's `box` icon with the top opened to show interior.
 * Inherits `currentColor` so it picks up parent text color.
 */
export function SushiBoxIcon({
  className,
  size = 24,
  strokeWidth = 1.7,
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
      {/* Outer 3D box silhouette: top -> right -> bottom -> left, then back to top */}
      <path d="M21 16 V8.5 L12 5 L3 8.5 V16 L12 19.5 L21 16 Z" />

      {/* Top "seam" — the line that connects the front-top-left, the
          top-center point and the front-top-right, completing the 3D look */}
      <path d="M3 8.5 L12 12 L21 8.5" />

      {/* Front vertical edge running from the top-center seam down to the
          bottom-center, giving the box its solid 3D feel */}
      <path d="M12 12 V19.5" />

      {/* Open top — small inner parallelogram showing the box is empty
          (you're looking down through the opening at the floor) */}
      <path d="M6.5 9 L12 7 L17.5 9 L12 11 Z" />
    </svg>
  );
}
