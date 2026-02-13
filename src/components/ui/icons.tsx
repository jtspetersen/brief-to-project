import { cn } from "@/lib/utils";

interface IconProps {
  size?: number;
  className?: string;
}

// ── UI Icons ──────────────────────────────────────────────────────────

export function IconUser({ size = 24, className }: IconProps) {
  const s = size * 36 / 24; // scale factor — viewBox is 36
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <circle cx="18" cy="13" r="5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 30C7 24.5 11.5 21 18 21C24.5 21 29 24.5 29 30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function IconAiAdvisor({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <rect x="8" y="6" width="20" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M13 13H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 17.5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24.5" cy="24.5" r="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" />
      <path d="M22.5 24.5L24 26L27 23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSend({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <path d="M6 18L28 7L20 18L28 29L6 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.12" />
      <path d="M14 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconSettings({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <path d="M16 3h4v3.1a11 11 0 0 1 3.4 1.4l2.2-2.2 2.8 2.8-2.2 2.2A11 11 0 0 1 27.6 14H31v4h-3.4a11 11 0 0 1-1.4 3.4l2.2 2.2-2.8 2.8-2.2-2.2a11 11 0 0 1-3.4 1.4V29h-4v-3.4a11 11 0 0 1-3.4-1.4l-2.2 2.2-2.8-2.8 2.2-2.2A11 11 0 0 1 8.4 18H5v-4h3.4a11 11 0 0 1 1.4-3.4L7.6 8.4l2.8-2.8 2.2 2.2A11 11 0 0 1 16 6.4V3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="18" cy="18" r="4.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconDocuments({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <rect x="6" y="8" width="16" height="22" rx="3" fill="#FEEFD6" stroke="#F9A842" strokeWidth="2" />
      <rect x="14" y="6" width="16" height="22" rx="3" fill="#FFF8F0" stroke="#F9A842" strokeWidth="2" />
      <path d="M18 13H26" stroke="#F9A842" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 17H24" stroke="#F9A842" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <path d="M18 21H22" stroke="#F9A842" strokeWidth="1.8" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export function IconDownload({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <path d="M18 6V22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 18L18 24L24 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 28H28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function IconPreview({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <path d="M4 18C4 18 9 10 18 10C27 10 32 18 32 18C32 18 27 26 18 26C9 26 4 18 4 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="18" r="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
      <circle cx="18" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function IconDarkMode({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <path d="M26 10C22.5 12 20 15.5 20 19.5C20 23.5 22.5 27 26 29C21 29.5 16 25.5 16 19.5C16 13.5 21 9.5 26 10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

export function IconLightMode({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <circle cx="18" cy="18" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
      <path d="M18 7V10M18 26V29M7 18H10M26 18H29M10.3 10.3L12.4 12.4M23.6 23.6L25.7 25.7M25.7 10.3L23.6 12.4M12.4 23.6L10.3 25.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconBiasCheck({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <rect x="7" y="5" width="22" height="26" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M12 14L15 17L22 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 21H22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      <path d="M12 25H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export function IconInsight({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <path d="M18 5C12.5 5 9 9 9 13.5C9 17 11 19 13 21V24C13 25.1 13.9 26 15 26H21C22.1 26 23 25.1 23 24V21C25 19 27 17 27 13.5C27 9 23.5 5 18 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="currentColor" fillOpacity="0.1" />
      <path d="M15 29H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 12V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 15L18 17L20.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRiskFlag({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <path d="M18 6L32 30H4L18 6Z" stroke="#D4785B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#D4785B" fillOpacity="0.1" />
      <path d="M18 15V21" stroke="#D4785B" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="18" cy="25" r="1.2" fill="#D4785B" />
    </svg>
  );
}

export function IconComplete({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <circle cx="18" cy="18" r="12" stroke="#5B7C50" strokeWidth="2" fill="#5B7C50" fillOpacity="0.1" />
      <path d="M12 18L16 22L24 14" stroke="#5B7C50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Stage Icons ───────────────────────────────────────────────────────
// These use currentColor so they can be styled by the parent's state
// (active = white on amber, complete = white on green, pending = muted)

export function StageDiscover({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="2.2" />
      <path d="M20 20L27 27" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function StageDefine({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="16" cy="16" r="3.5" fill="currentColor" fillOpacity="0.4" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

export function StagePlan({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <path d="M6 8H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 14H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 20H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 26H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 8V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function StageGovern({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="24" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 14V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 22L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 22L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function StageRisk({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <path d="M16 4L28 26H4L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 12V19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="23" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function StagePackage({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size} className={cn("shrink-0", className)}>
      <rect x="5" y="10" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M5 14H27" stroke="currentColor" strokeWidth="2" />
      <path d="M12 10V6H20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 20H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Array of stage icon components indexed by stage number (1-6) */
export const STAGE_ICONS = [
  StageDiscover,  // Stage 1
  StageDefine,    // Stage 2
  StagePlan,      // Stage 3
  StageGovern,    // Stage 4
  StageRisk,      // Stage 5
  StagePackage,   // Stage 6
] as const;
