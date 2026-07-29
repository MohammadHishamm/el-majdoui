type DownloadIconProps = {
  size?: number;
  className?: string;
};

export function DownloadIcon({ size = 20, className }: DownloadIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={`shrink-0 icon-on-light ${className ?? ""}`}
    >
      <path
        d="M17.4916 12.494V15.8257C17.4916 16.2675 17.3161 16.6913 17.0037 17.0037C16.6913 17.3161 16.2675 17.4916 15.8257 17.4916H4.16466C3.72285 17.4916 3.29913 17.3161 2.98672 17.0037C2.6743 16.6913 2.49879 16.2675 2.49879 15.8257V12.494"
        stroke="currentColor"
        strokeWidth="1.66587"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83054 8.32935L9.9952 12.494L14.1599 8.32935"
        stroke="currentColor"
        strokeWidth="1.66587"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99519 12.494V2.49881"
        stroke="currentColor"
        strokeWidth="1.66587"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
