/**
 * Cart icon used across the app. Uses the Material Symbols `inventory_2`
 * glyph (a clean 3D open box) rendered via the already-loaded Material
 * Symbols web font. The component keeps the same `size` and `strokeWidth`
 * props so callers don't have to change.
 */
export function SushiBoxIcon({
  className,
  size = 24,
  strokeWidth: _strokeWidth, // accepted for API compatibility, unused for icon-font glyph
}: {
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  // strokeWidth no longer applies — Material Symbols use font weight instead.
  void _strokeWidth;
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined inline-flex items-center justify-center leading-none ${className ?? ""}`}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
    >
      inventory_2
    </span>
  );
}
