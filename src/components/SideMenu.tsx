"use client";

import { useEffect, useState } from "react";
import { ainslay } from "@/src/lib/fonts";

type Item = { id: string; label: string };

const ITEMS: Item[] = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "confirme", label: "Confirme" },
  { id: "presentes", label: "Presentes" },
  { id: "local", label: "Local" },
];

const ORANGE = "#C96E2D";
const OLIVE = "#535935";

export default function NavMenus() {
  const [active, setActive] = useState<string>("inicio");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px -50% 0px",
      threshold: 0.2,
    };
    ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.isIntersecting && setActive(id));
      }, options);
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Desktop side menu */}
      <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block">
        <ul className="flex flex-col gap-3">
          {ITEMS.map((item) => {
            const isActive = active === item.id;
            const color = isActive ? OLIVE : ORANGE;
            const scaleClass = isActive ? "scale-110" : "scale-100";
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={handleClick(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "inline-flex items-center w-36 h-15 rounded-full select-none",
                    "transition-all duration-200 transform-gpu",
                    scaleClass,
                    "hover:scale-110 active:scale-115",
                    "pl-8 text-3xl font-bold font-ainslay",
                    "bg-white border border-white/30 backdrop-blur-sm shadow-sm",
                  ].join(" ")}
                  style={{ color }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm md:hidden">
        <ul className="flex justify-around">
          {ITEMS.map((item) => {
            const isActive = active === item.id;
            const color = isActive ? OLIVE : ORANGE;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={handleClick(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className="block px-3 py-3 text-3xl font-bold font-ainslay transition-colors"
                  style={{ color }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
