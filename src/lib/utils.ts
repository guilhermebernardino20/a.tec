import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * A escala tipográfica do projeto (`text-display`, `text-title`, …) vem do
 * `@theme` e é indistinguível de uma cor para o tailwind-merge: sem esta
 * extensão ele trata `text-display text-paper` como conflito e descarta o
 * tamanho, deixando o título no corpo de texto.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "title", "heading", "lead", "body", "mono"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
