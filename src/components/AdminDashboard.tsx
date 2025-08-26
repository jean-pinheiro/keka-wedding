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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [settings, setSettings] = useState(initialData.settings || {});
  const [savingSettings, setSavingSettings] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [newGift, setNewGift] = useState<Partial<Gift>>({});
  const [newPhoto, setNewPhoto] = useState<Partial<Photo>>({});

  const handleLogout = () => {
    document.cookie = "admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  const saveGift = async (gift: Partial<Gift>) => {
    try {
      const res = await fetch("/api/admin/gifts/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gift),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao salvar presente");

      const saved: Gift = json.gift;
      setGifts((prev) => {
        const i = prev.findIndex((g) => g.id === saved.id);
        if (i >= 0) {
          const copy = [...prev];
          copy[i] = saved;
          return copy;
        }
        return [saved, ...prev];
      });
      setEditingGift(null);
      setNewGift({});
      toast.success("Presente salvo");
    } catch (e: any) {
      toast.error(e?.message || "Falha ao salvar presente");
      alert(e.message || "Falha ao salvar presente");
    }
  };

  const deleteGift = async (id: string) => {
    if (!confirm("Excluir este presente?")) return;
    const res = await fetch("/api/admin/gifts/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error || "Falha ao excluir");
    setGifts(gifts.filter((g) => g.id !== id));
    toast.success("Presente excluído");
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
            <div className="grid gap-4">
              {initialData.rsvps.map((rsvp) => (
                <Card key={rsvp.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{rsvp.name}</h3>
                          <Badge
                            variant={rsvp.attending ? "default" : "secondary"}
                          >
                            {rsvp.attending ? "Confirmado" : "Não Confirmado"}
                          </Badge>
                        </div>
                        {rsvp.email && (
                          <p className="text-sm text-muted-foreground">
                            {rsvp.email}
                          </p>
                        )}
                        {rsvp.message && (
                          <p className="text-sm mt-2">{rsvp.message}</p>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(rsvp.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                    <Label>URL do QR Code Pix Global</Label>
                    <Input
                      value={settings.pix_qr_url || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, pix_qr_url: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL do Link Pix Global</Label>
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
                <div className="space-y-2">
                  <Label>Instruções do Pix</Label>
                  <Textarea
                    value={settings.pix_instructions || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pix_instructions: e.target.value,
                      })
                    }
                  />
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
