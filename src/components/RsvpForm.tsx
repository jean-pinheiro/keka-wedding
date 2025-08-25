"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        // reset only on new confirmation
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
    <form
      onSubmit={onSubmit}
      className="w-full max-w-xl mx-auto rounded-lg border p-4 space-y-3"
    >
      <h3 className="text-xl font-semibold">Confirme sua presença</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Nome</Label>
          <Input
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Sobrenome</Label>
          <Input
            value={last}
            onChange={(e) => setLast(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <Label>E-mail</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={busy} className="w-full md:w-auto">
        {busy ? "Confirmando..." : "Confirmar presença"}
      </Button>
    </form>
  );
}
