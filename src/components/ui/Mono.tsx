import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Rótulo técnico em mono, caixa alta — a voz "de laboratório" do layout. */
export default function Mono({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "div" | "h2";
}) {
  return (
    <Tag className={cn("font-mono text-mono uppercase", className)}>{children}</Tag>
  );
}
