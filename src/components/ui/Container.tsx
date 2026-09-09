import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Contêiner mestre: 1620px de largura máxima, respiro lateral de 48px. */
export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1620px] px-6 md:px-12", className)}>
      {children}
    </div>
  );
}
