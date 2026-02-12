import { cn } from "@/lib/utils";

interface BriefKitLogoProps {
  size?: number;
  className?: string;
}

export function BriefKitLogo({ size = 80, className }: BriefKitLogoProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-label="BriefKit logo"
      role="img"
    >
      <defs>
        <linearGradient id="kitGrad" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#FCC47D" />
          <stop offset="100%" stopColor="#F9A842" />
        </linearGradient>
        <linearGradient id="emberGrad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#C97318" />
          <stop offset="100%" stopColor="#E8922B" />
        </linearGradient>
      </defs>
      {/* Amber rounded square */}
      <rect width="80" height="80" rx="20" fill="url(#kitGrad)" />
      {/* Back document */}
      <path
        d="M18 32C18 28.69 20.69 26 24 26H34L44 36V52C44 55.31 41.31 58 38 58H24C20.69 58 18 55.31 18 52V32Z"
        fill="white"
        fillOpacity="0.35"
      />
      {/* Middle document */}
      <path
        d="M24 30C24 26.69 26.69 24 30 24H42L54 36V54C54 57.31 51.31 60 48 60H30C26.69 60 24 57.31 24 54V30Z"
        fill="white"
        fillOpacity="0.55"
      />
      {/* Front document */}
      <path
        d="M30 28C30 24.69 32.69 22 36 22H48L62 36V56C62 59.31 59.31 62 56 62H36C32.69 62 30 59.31 30 56V28Z"
        fill="white"
        fillOpacity="0.92"
      />
      {/* Folded corner */}
      <path
        d="M48 22L62 36H52C48.69 36 48 34.31 48 31V22Z"
        fill="white"
        fillOpacity="0.55"
      />
      {/* Content lines */}
      <path d="M38 46H54" stroke="url(#emberGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 50H50" stroke="url(#emberGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M38 54H46" stroke="url(#emberGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}
