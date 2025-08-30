"use client";

import { useTheme } from "@/components/context/theme-provider";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Componente que alterna entre os temas claro e escuro da aplicação.
 *
 * @param className Classe CSS opcional para estilização adicional.
 * @param size Tamanho do ícone exibido ("sm", "md" ou "lg"). Padrão é "md".
 *
 * Ao clicar ou pressionar Enter/Espaço, alterna o tema atual.
 * Exibe um ícone de Sol para o tema escuro e de Lua para o tema claro.
 */
export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const iconSize = sizeMap[size];

  return (
    <div
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center justify-center cursor-pointer transition-transform duration-500",
        isDark ? "rotate-180" : "rotate-0",
        className
      )}
      role="button"
      tabIndex={0}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setTheme(isDark ? "light" : "dark");
        }
      }}
    >
      {isDark ? (
        <Sun
          className={cn(iconSize, "text-yellow-500 rotate-0 transition-all")}
        />
      ) : (
        <Moon
          className={cn(iconSize, "text-yellow-300 rotate-0 transition-all")}
        />
      )}
    </div>
  );
}