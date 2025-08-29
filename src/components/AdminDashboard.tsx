"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Save, X } from "lucide-react";
import { ImageUploader } from "@/src/components/ImageUploader";
import { toast } from "sonner";

interface Gift {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  status: "available" | "reserved" | "paid";
  reserved_by_name?: string;
  reserved_by_email?: string;
  pix_qr_url?: string;
  pix_link_url?: string;
  paid_at?: string;
}

interface Photo {
  id: string;
  image_url: string;
  caption?: string;
  sort_order: number;
}

interface RSVP {
  id: string;
  name: string;
  email?: string;
  attending: boolean;
  message?: string;
  created_at: string;
  guests_count?: number; // now: total incluindo o titular
}

interface SiteSettings {
  id?: string;
  location_address?: string;
  maps_embed_url?: string;
  cover_title?: string;
  cover_subtitle?: string;
  pix_qr_url?: string;
  pix_link_url?: string;
  pix_instructions?: string;
  amazon_list_url?: string;
  cover_image_url?: string;
  about_text?: string;
}

interface AdminDashboardProps {
  initialData: {
    gifts: Gift[];
    photos: Photo[];
    rsvps: RSVP[];
    settings: SiteSettings | null;
  };
}

export function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [gifts, setGifts] = useState(initialData.gifts);
  const [photos, setPhotos] = useState(initialData.photos);
  const [rsvps, setRsvps] = useState<RSVP[]>(initialData.rsvps);
  const [settings, setSettings] = useState(initialData.settings || {});
  const [savingSettings, setSavingSettings] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [newGift, setNewGift] = useState<Partial<Gift>>({});
  const [newPhoto, setNewPhoto] = useState<Partial<Photo>>({});

  // --- RSVP: add-guest mini-form state ---
  const [newName, setNewName] = useState("");
  const [newCount, setNewCount] = useState<number>(1);
  const [creating, setCreating] = useState(false);

  const handleLogout = () => {
    document.cookie = "admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  const savePhoto = async (photo: Partial<Photo>) => {
    try {
      const res = await fetch("/api/admin/photos/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photo),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao salvar foto");

      const saved: Photo = json.photo;
      setPhotos((prev) => {
        const i = prev.findIndex((p) => p.id === saved.id);
        if (i >= 0) {
          const copy = [...prev];
          copy[i] = saved;
          return copy;
        }
        return [saved, ...prev];
      });
      setEditingPhoto(null);
      setNewPhoto({});
      toast.success("Foto salva");
    } catch (e: any) {
      toast.error(e?.message || "Falha ao salvar foto");
      alert(e.message || "Falha ao salvar foto");
    }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm("Excluir esta foto?")) return;
    try {
      const res = await fetch("/api/admin/photos/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao excluir");

      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Foto excluída");
    } catch (e: any) {
      toast.error(e?.message || "Falha ao excluir foto");
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || "Erro ao salvar configurações");

      setSettings(json.settings || settings);
      toast.success("Configurações salvas");
    } catch (e: any) {
      toast.error(e?.message || "Falha ao salvar configurações");
    } finally {
      setSavingSettings(false);
    }
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !Number.isFinite(newCount) || newCount < 1) return;

    setCreating(true);
    try {
      const res = await fetch("/api/admin/rsvps/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), guests_count: newCount }),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.error || "Falha ao adicionar convidado");

      // Expect your API to return: { ok: true, rsvp: <row> }
      setRsvps((prev) => [json.rsvp, ...prev]); // <— append new row
      setNewName("");
      setNewCount(1);
      toast.success("Convidado addicionado!");
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteRsvp(id: string) {
    if (!confirm("Excluir este convidado?")) return;
    try {
      const res = await fetch("/api/admin/rsvps/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao excluir convidado");

      // Optimistic update
      setRsvps((prev) => prev.filter((r) => r.id !== id));
      // If you also keep a total at top, it will re-compute from state automatically
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Falha ao excluir convidado");
    }
  }

  async function toggleConfirm(id: string, attending: boolean) {
    try {
      const res = await fetch("/api/admin/rsvps/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, attending }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Falha ao atualizar");

      setRsvps((prev) =>
        prev.map((r) => (r.id === id ? { ...r, attending } : r))
      );
      toast.success("Confirmação modificada!");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>

        <Tabs defaultValue="gifts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photos">Fotos</TabsTrigger>
            <TabsTrigger value="rsvps">Confirmações</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Gerenciar Fotos</h2>
              <Button
                onClick={() =>
                  setNewPhoto({ image_url: "", sort_order: photos.length })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Foto
              </Button>
            </div>

            {(newPhoto.image_url !== undefined || editingPhoto) && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingPhoto ? "Editar Foto" : "Adicionar Nova Foto"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploader
                    bucket="photos"
                    label="Enviar Foto do Carrossel"
                    onUploaded={(url) =>
                      editingPhoto
                        ? setEditingPhoto({ ...editingPhoto, image_url: url })
                        : setNewPhoto({ ...newPhoto, image_url: url })
                    }
                  />
                  <div className="space-y-2">
                    <Label>URL da Imagem (ou envie acima)</Label>
                    <Input
                      value={
                        editingPhoto?.image_url || newPhoto.image_url || ""
                      }
                      onChange={(e) =>
                        editingPhoto
                          ? setEditingPhoto({
                              ...editingPhoto,
                              image_url: e.target.value,
                            })
                          : setNewPhoto({
                              ...newPhoto,
                              image_url: e.target.value,
                            })
                      }
                      placeholder="https://exemplo.com/foto.jpg"
                    />
                  </div>
                  {(editingPhoto?.image_url || newPhoto.image_url) && (
                    <div className="space-y-2">
                      <Label>Pré-visualização da Imagem</Label>
                      <img
                        src={editingPhoto?.image_url || newPhoto.image_url}
                        alt="Pré-visualização da foto"
                        className="w-48 h-32 object-contain bg-muted rounded border"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Legenda</Label>
                    <Input
                      value={editingPhoto?.caption || newPhoto.caption || ""}
                      onChange={(e) =>
                        editingPhoto
                          ? setEditingPhoto({
                              ...editingPhoto,
                              caption: e.target.value,
                            })
                          : setNewPhoto({
                              ...newPhoto,
                              caption: e.target.value,
                            })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ordem de Classificação</Label>
                    <Input
                      type="number"
                      value={
                        editingPhoto?.sort_order || newPhoto.sort_order || 0
                      }
                      onChange={(e) =>
                        editingPhoto
                          ? setEditingPhoto({
                              ...editingPhoto,
                              sort_order: Number.parseInt(e.target.value),
                            })
                          : setNewPhoto({
                              ...newPhoto,
                              sort_order: Number.parseInt(e.target.value),
                            })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => savePhoto(editingPhoto || newPhoto)}>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingPhoto(null);
                        setNewPhoto({});
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {photos.map((photo) => (
                <Card key={photo.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <img
                        src={photo.image_url || "/placeholder.svg"}
                        alt={photo.caption || "Foto"}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">
                          {photo.caption || "Sem legenda"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ordem de classificação: {photo.sort_order}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPhoto(photo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePhoto(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rsvps" className="space-y-6">
            <h2 className="text-2xl font-semibold">Confirmações de Presença</h2>

            {/* Summary: total de pessoas confirmadas (somando guests_count) */}
            {(() => {
              const totals = rsvps.reduce(
                (acc: { totalPeople: number }, r: RSVP) => {
                  if (r.attending) acc.totalPeople += r.guests_count ?? 1; // total inclui o titular
                  return acc;
                },
                { totalPeople: 0 }
              );

              return (
                <div className="rounded-lg border p-4 bg-white">
                  <p className="text-sm text-muted-foreground">
                    Número total de pessoas confirmadas
                  </p>
                  <p className="mt-1 text-3xl font-semibold">
                    {totals.totalPeople}
                  </p>
                </div>
              );
            })()}

            {/* Add guest mini-form */}
            <form
              onSubmit={handleCreate}
              className="rounded-lg border p-4 bg-white flex flex-col sm:flex-row gap-3 items-end sm:items-center"
            >
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium mb-1">
                  Nome do convidado
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border rounded-md px-3 py-2 w-full sm:w-80"
                  placeholder="Ex.: Júlio e família"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Qtd. total (inclui o convidado)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  step={1}
                  value={newCount}
                  onChange={(e) =>
                    setNewCount(parseInt(e.target.value || "1", 10))
                  }
                  className="border rounded-md px-3 py-2 w-28 text-center"
                  required
                />
              </div>

              <Button type="submit" disabled={creating} className="h-10">
                {creating ? "Adicionando..." : "Adicionar convidado"}
              </Button>
            </form>

            {/* Lista de RSVPs */}
            <div className="grid gap-4">
              {rsvps.map((rsvp) => {
                const total = rsvp.guests_count ?? 1; // total incluindo o titular
                const companions = Math.max(0, total - 1);

                return (
                  <Card key={rsvp.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold">{rsvp.name}</h3>

                            <Badge
                              variant={rsvp.attending ? "default" : "secondary"}
                            >
                              {rsvp.attending ? "Confirmado" : "Não Confirmado"}
                            </Badge>

                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-s bg-gray-100 text-gray-700">
                              <svg
                                viewBox="0 0 24 24"
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                              {total} {total === 1 ? "pessoa" : "pessoas"}
                            </span>
                          </div>

                          {rsvp.email && (
                            <p className="text-sm text-muted-foreground">
                              {rsvp.email}
                            </p>
                          )}

                          <div className="mt-2 text-sm">
                            <p className="text-muted-foreground">
                              Acompanhantes: <strong>{companions}</strong>
                            </p>
                          </div>

                          {rsvp.message && (
                            <p className="text-sm mt-2">{rsvp.message}</p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <p className="text-xs text-muted-foreground">
                            Criado em{" "}
                            {new Date(rsvp.created_at).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>

                          {rsvp.attending ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleConfirm(rsvp.id, false)}
                            >
                              Desfazer confirmação
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => toggleConfirm(rsvp.id, true)}
                            >
                              Marcar como confirmado
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRsvp(rsvp.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold">Configurações do Site</h2>
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configure seu site de casamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título da Capa</Label>
                    <Input
                      value={settings.cover_title || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          cover_title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtítulo da Capa</Label>
                    <Input
                      value={settings.cover_subtitle || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          cover_subtitle: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Imagem de Capa (Hero)</Label>
                  <ImageUploader
                    bucket="photos"
                    label="Enviar Imagem de Capa"
                    onUploaded={(url) =>
                      setSettings((s) => ({ ...s, cover_image_url: url }))
                    }
                  />
                  <Input
                    placeholder="https://... (ou envie acima)"
                    value={settings.cover_image_url || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cover_image_url: e.target.value,
                      })
                    }
                  />
                  {!!settings.cover_image_url && (
                    <img
                      src={settings.cover_image_url || "/placeholder.svg"}
                      alt="Pré-visualização da capa"
                      className="mt-2 w-full max-w-xl aspect-video object-cover rounded border"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Texto Sobre o Evento</Label>
                  <Textarea
                    placeholder="Escreva o texto de apresentação do casal/evento…"
                    value={settings.about_text || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, about_text: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL da Lista da Amazon</Label>
                  <Input
                    placeholder="https://www.amazon.com.br/hz/wishlist/ls/..."
                    value={settings.amazon_list_url || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        amazon_list_url: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Endereço do Local</Label>
                  <Input
                    value={settings.location_address || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        location_address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL de Incorporação do Mapa</Label>
                  <Input
                    value={settings.maps_embed_url || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maps_embed_url: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>URL do Link Pix</Label>
                    <Input
                      value={settings.pix_link_url || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pix_link_url: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button onClick={saveSettings} disabled={savingSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  {savingSettings ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
