// RsvpForm.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Users } from "lucide-react";

const OLIVE = "#535935";

export function RsvpForm() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [total, setTotal] = useState<number>(1); // ⬅️ total incl. you
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first.trim(),
          last_name: last.trim(),
          email: email.trim(),
          guests_count: Number.isFinite(total) ? total : 1, // ⬅️ send total
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao confirmar presença");

      if (json.alreadyConfirmed) {
        toast.info(json.message || "Este e-mail já tem presença confirmada.");
      } else {
        toast.success(
          "Presença confirmada! Enviamos um e-mail de confirmação."
        );
        setFirst("");
        setLast("");
        setEmail("");
        setTotal(1);
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro ao confirmar presença");
    } finally {
      setBusy(false);
    }
  }

  const MIN = 1;
  const MAX = 2;

  const clamp = (n: number) => Math.max(MIN, Math.min(MAX, n));
  const inc = () => setTotal((t) => clamp(t + 1));
  const dec = () => setTotal((t) => clamp(t - 1));

  const onQtyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      inc();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      dec();
    } else if (e.key.toLowerCase() === "home") {
      e.preventDefault();
      setTotal(MIN);
    } else if (e.key.toLowerCase() === "end") {
      e.preventDefault();
      setTotal(MAX);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl mx-auto">
      <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[#C96E2D33] to-[#53593533]">
        <div className="rounded-2xl bg-white/90 backdrop-blur p-6 md:p-8 shadow-sm">
          {/* name grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium" style={{ color: OLIVE }}>
                Nome
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9 h-11 rounded-xl shadow-sm focus-visible:ring-2"
                  style={{
                    borderColor: "rgba(0,0,0,0.08)",
                    outlineColor: OLIVE,
                  }}
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium" style={{ color: OLIVE }}>
                Sobrenome
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9 h-11 rounded-xl shadow-sm focus-visible:ring-2"
                  style={{
                    borderColor: "rgba(0,0,0,0.08)",
                    outlineColor: OLIVE,
                  }}
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  placeholder="Seu sobrenome"
                  required
                />
              </div>
            </div>
          </div>

          {/* email */}
          <div className="mt-4">
            <Label className="text-sm font-medium" style={{ color: OLIVE }}>
              E-mail
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                className="pl-9 h-11 rounded-xl shadow-sm focus-visible:ring-2"
                style={{ borderColor: "rgba(0,0,0,0.08)", outlineColor: OLIVE }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                required
              />
            </div>
          </div>

          {/* total people incl. self */}
          <div className="mt-4">
            <Label className="text-sm font-medium" style={{ color: OLIVE }}>
              Número de convidados
            </Label>

            <div className="mt-1 flex items-center gap-3">
              {/* – button (OLIVE) */}
              <button
                type="button"
                onClick={dec}
                disabled={total <= MIN}
                aria-label="Diminuir quantidade"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow ring-1 ring-black/5 transition active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: OLIVE }}
              >
                <span className="text-2xl leading-none">−</span>
              </button>

              {/* tiny read-only number field */}
              <input
                type="number"
                inputMode="numeric"
                min={MIN}
                max={MAX}
                step={1}
                readOnly
                onKeyDown={onQtyKeyDown}
                onWheel={(e) => e.currentTarget.blur()} // block wheel changes
                value={total}
                className={[
                  "h-10 w-12 md:w-14 text-center text-lg",
                  "rounded-xl border shadow-sm focus-visible:outline-none focus-visible:ring-2",
                  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                ].join(" ")}
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
                aria-live="polite"
                aria-label="Quantidade selecionada"
              />

              {/* + button (ORANGE) */}
              <button
                type="button"
                onClick={inc}
                disabled={total >= MAX}
                aria-label="Aumentar quantidade"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow ring-1 ring-black/5 transition active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: "#C96E2D" /* ORANGE */ }}
              >
                <span className="text-2xl leading-none">+</span>
              </button>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Informe o número total de pessoas{" "}
              <strong>contando com você</strong>.
            </p>
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="mt-6 w-full md:w-auto rounded-xl px-6 h-11 shadow-sm transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: OLIVE, color: "white" }}
          >
            {busy ? "Confirmando..." : "Confirmar presença"}
          </Button>

          <p className="mt-3 text-xs text-gray-500">
            Usaremos seu e-mail apenas para a confirmação neste evento.
          </p>
        </div>
      </div>
    </form>
  );
}
