/**
 * Empty sushi-takeout box icon used as the brand's cart symbol. Outline style,
 * matches the size of Material Symbols at the same font-size by using viewBox
 * 0 0 24 24. Color comes from currentColor — set via the `text-*` classes on
 * the parent.
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
      {/* Open lid flap at the back, folded behind the box */}
      <path d="M7 4.5 L12 6.3 L17 4.5 L12 2.7 Z" />
      <path d="M7 4.5 L7 6.5" />
      <path d="M17 4.5 L17 6.5" />

      {/* Box rim (top opening) */}
      <path d="M3 9 L12 12 L21 9 L12 6 Z" />

      {/* Box body — left face */}
      <path d="M3 9 L3 16.5 L12 19.5" />

      {/* Box body — right face */}
      <path d="M21 9 L21 16.5 L12 19.5" />

      {/* Box body — front center seam */}
      <path d="M12 12 L12 19.5" />
    </svg>
  );
}
