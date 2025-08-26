"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail } from "lucide-react";
import { ainslay } from "@/src/lib/fonts";

const ORANGE = "#C96E2D";
const OLIVE = "#535935";

export function RsvpForm() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
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
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro ao confirmar presença");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl mx-auto">
      {/* gradient hairline border */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[#C96E2D33] to-[#53593533]">
        <div className="rounded-2xl bg-white/90 backdrop-blur p-6 md:p-8 shadow-sm">
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

          <div className="mt-4">
            <Label className="text-sm font-medium" style={{ color: OLIVE }}>
              E-mail
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                className="pl-9 h-11 rounded-xl shadow-sm focus-visible:ring-2"
                style={{
                  borderColor: "rgba(0,0,0,0.08)",
                  outlineColor: OLIVE,
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="mt-6 w-full md:w-auto rounded-xl px-6 h-11 shadow-sm transition-transform hover:scale-[1.02]"
            style={{
              backgroundColor: OLIVE,
              color: "white",
            }}
          >
            {busy ? "Confirmando..." : "Confirmar presença"}
          </Button>

          {/* tiny note */}
          <p className="mt-3 text-xs text-gray-500">
            Usaremos seu e-mail apenas para a confirmação neste evento.
          </p>
        </div>
      </div>
    </form>
  );
}
