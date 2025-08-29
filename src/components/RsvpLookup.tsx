"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // if you have a cn helper; otherwise remove

const OLIVE = "#535935";
const ORANGE = "#C96E2D";

type Guest = {
  id: string;
  name: string;
  guests_count: number;
  attending: boolean;
};

export function RsvpLookup() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Guest[]>([]);
  const [selected, setSelected] = useState<Guest | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // simple debounce to avoid spamming the API
  const debouncedQ = useMemo(() => q.trim(), [q]);
  useEffect(() => {
    const t = setTimeout(() => {
      void fetchResults(debouncedQ);
    }, 250);
    return () => clearTimeout(t);
  }, [debouncedQ]);

  async function fetchResults(term: string) {
    setErr(null);
    if (!term) {
      setResults([]);
      setSelected(null);
      return;
    }
    try {
      const res = await fetch(
        `/api/rsvp/search?q=${encodeURIComponent(term)}`,
        {
          cache: "no-store",
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Falha na busca");
      setResults(json.results || []);
      setSelected(null);
    } catch (e: any) {
      setErr(e?.message || "Falha na busca");
      setResults([]);
    }
  }

  async function confirmSelected() {
    if (!selected) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/rsvp/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Falha ao confirmar");

      // Success: clear list & show message
      setConfirmed(true);
      setResults([]);
      setSelected(null);
      setQ("");
    } catch (e: any) {
      setErr(e?.message || "Falha ao confirmar");
    } finally {
      setBusy(false);
    }
  }

  if (confirmed) {
    return (
      <div className="mx-auto mt-6 max-w-xl rounded-2xl border p-6 text-center shadow-sm bg-white/90">
        <CheckCircle2
          className="mx-auto mb-2 h-8 w-8"
          style={{ color: OLIVE }}
        />
        <h3 className="text-xl font-semibold" style={{ color: OLIVE }}>
          Sua presença foi confirmada!
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Obrigado! Se precisar, você pode buscar novamente para outra
          confirmação.
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setConfirmed(false)}
        >
          Confirmar outro nome
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: OLIVE }}
      >
        Procure seu nome
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Digite seu nome..."
          className="pl-9 h-11 rounded-xl shadow-sm focus-visible:ring-2"
          style={{ borderColor: "rgba(0,0,0,0.08)", outlineColor: OLIVE }}
        />
      </div>

      {/* results */}
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}

      {q && results.length === 0 && !err && (
        <p className="mt-3 text-sm text-gray-500">
          Nenhum convidado encontrado (ou já confirmado).
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-3 rounded-xl border bg-white shadow-sm overflow-hidden">
          <ul className="divide-y">
            {results.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => setSelected(g)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 transition-colors",
                    selected?.id === g.id && "bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: OLIVE }}>
                        {g.name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {g.guests_count}{" "}
                        {g.guests_count === 1 ? "pessoa" : "pessoas"}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* confirm bar */}
      {selected && (
        <div className="mt-4 flex items-center justify-between rounded-xl border p-3 bg-white shadow-sm">
          <div>
            <p className="text-sm text-gray-600">Selecionado:</p>
            <p className="font-medium" style={{ color: OLIVE }}>
              {selected.name}
            </p>
          </div>
          <Button
            onClick={confirmSelected}
            disabled={busy}
            className="rounded-xl px-5 h-11 shadow-sm"
            style={{ backgroundColor: OLIVE, color: "white" }}
          >
            {busy ? "Confirmando..." : "Confirmar presença"}
          </Button>
        </div>
      )}
    </div>
  );
}
