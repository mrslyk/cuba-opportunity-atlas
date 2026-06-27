/* QvaPay brand mark — a rounded checkmark paired with a parallel diagonal bar.
   Recreated as a vector so it scales crisply and inherits color via
   `currentColor` (set the color with a text-* class on the parent). */
export function QvaPayLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="40 150 740 510"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="QvaPay"
    >
      <path
        d="M130 340 L215 560 L475 235"
        stroke="currentColor"
        strokeWidth="155"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M690 235 L445 565"
        stroke="currentColor"
        strokeWidth="155"
        strokeLinecap="round"
      />
    </svg>
  );
}
