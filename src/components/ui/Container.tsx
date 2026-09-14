import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Contêiner mestre: max-w-7xl, respiro lateral de 24px (mobile) e 48px. */
export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 md:px-12", className)}>
      {children}
    </div>
  );
}
