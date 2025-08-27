"use client";

import { useEffect, useRef, useState } from "react";
import { ainslay } from "@/src/lib/fonts";

type Item = { id: string; label: string };

const ITEMS: Item[] = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "confirme", label: "Confirme" },
  { id: "presentes", label: "Presentes" },
  { id: "recepcao", label: "Recepção" },
  { id: "cerimonia", label: "Cerimônia" },
];

const ORANGE = "#C96E2D";
const OLIVE = "#535935";

export default function NavMenus() {
  const [active, setActive] = useState<string>("inicio");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
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
                    "inline-flex items-center justify-center w-36 h-14 rounded-full select-none",
                    "transition-all duration-200 transform-gpu",
                    scaleClass,
                    "hover:scale-110 active:scale-115",
                    "text-3xl font-bold",
                    ainslay.className,
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

      {/* Mobile / Tablet top bar (< md) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm md:hidden">
        {/* 400–767px: inline items  */}
        {/* FIX: put `flex` first then hide on <400: `max-[399px]:hidden` */}
        <ul className="flex max-[399px]:hidden justify-around">
          {ITEMS.map((item) => {
            const isActive = active === item.id;
            const color = isActive ? OLIVE : ORANGE;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={handleClick(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "block px-3 py-3 text-xl font-bold",
                    ainslay.className,
                    "transition-colors",
                  ].join(" ")}
                  style={{ color }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* <400px: compact Menu button */}
        <div className="hidden max-[399px]:flex items-center justify-between px-4 py-2">
          <span
            className={["text-lg font-bold", ainslay.className].join(" ")}
            style={{ color: OLIVE }}
          >
            Menu
          </span>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu-sheet"
            onClick={() => setOpen((v) => !v)}
            className="px-4 py-2 rounded-md border border-gray-200 shadow-sm bg-white text-sm"
            style={{ color: ORANGE }}
          >
            {open ? "Fechar" : "Abrir"}
          </button>
        </div>

        {/* Dropdown for <400px */}
        {open && (
          <>
            <div className="fixed inset-0 top-12 bg-black/30" />
            <div
              id="mobile-menu-sheet"
              ref={dropdownRef}
              className="absolute top-12 left-0 right-0 bg-white shadow-lg border-t"
            >
              <ul className="flex flex-col divide-y">
                {ITEMS.map((item) => {
                  const isActive = active === item.id;
                  const color = isActive ? OLIVE : ORANGE;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={handleClick(item.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={[
                          "block px-5 py-4 text-2xl font-bold",
                          ainslay.className,
                        ].join(" ")}
                        style={{ color }}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </nav>
    </>
  );
}
