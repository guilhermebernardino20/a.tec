import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "dark" | "light" | "ghost" | "outline";

const VARIANTS: Record<Variant, string> = {
  dark: "bg-ink text-paper hover:bg-olive",
  light: "bg-paper text-ink hover:bg-mint",
  ghost: "text-ink hover:bg-ink/[0.06]",
  outline:
    "border border-ink/20 text-ink hover:border-ink/60 hover:bg-ink/[0.04]",
};

/**
 * Botão-pílula em mono, com a etiqueta deslizando no hover.
 */
export default function Pill({
  children,
  href,
  variant = "dark",
  className,
  ...rest
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
} & Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  "href" | "className" | "children"
>) {
  return (
    <Link
      href={href}
      className={cn(
        "group/pill relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-full px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-all duration-500 active:scale-[0.98]",
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pill:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pill:translate-y-0"
        >
          {children}
        </span>
      </span>
    </Link>
  );
}
