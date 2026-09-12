import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-28 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-base text-ink outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-subtle focus-visible:border-line focus-visible:ring-2 focus-visible:ring-line/30 disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
