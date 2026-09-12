import { cn } from "@/lib/utils";

export function LineTohMark({
  className,
  inverse = false,
}: {
  className?: string;
  inverse?: boolean;
}) {
  const bg = inverse ? "#ffffff" : "#06C755";
  const fg = inverse ? "#06C755" : "#ffffff";
  const line = inverse ? "#ffffff" : "#06C755";
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="10" fill={bg} />
      <path
        d="M8 12.2c0-2.4 2.4-4.4 8-4.4s8 2 8 4.4v5.1c0 2.4-2.4 4.4-8 4.4-.7 0-1.4 0-2-.1L9.6 24.2c-.4.2-.8-.2-.7-.6l.7-2.4C8.6 20.3 8 19 8 17.3z"
        fill={fg}
      />
      <rect x="12" y="13.2" width="8" height="1.4" rx="0.7" fill={line} />
      <rect x="12" y="16.2" width="5.2" height="1.4" rx="0.7" fill={line} />
    </svg>
  );
}
