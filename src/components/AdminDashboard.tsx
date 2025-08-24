"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Plus, Save, X } from "lucide-react"

interface Gift {
  id: string
  name: string
  description?: string
  image_url?: string
  status: "available" | "reserved" | "paid"
  reserved_by_name?: string
  reserved_by_email?: string
  pix_qr_url?: string
  pix_link_url?: string
  paid_at?: string
}

interface Photo {
  id: string
  image_url: string
  caption?: string
  sort_order: number
}

interface RSVP {
  id: string
  name: string
  email?: string
  attending: boolean
  message?: string
  created_at: string
}

interface SiteSettings {
  id?: string
  location_address?: string
  maps_embed_url?: string
  cover_title?: string
  cover_subtitle?: string
  pix_qr_url?: string
  pix_link_url?: string
  pix_instructions?: string
}

interface AdminDashboardProps {
  initialData: {
    gifts: Gift[]
    photos: Photo[]
    rsvps: RSVP[]
    settings: SiteSettings | null
  }
}

export function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [gifts, setGifts] = useState(initialData.gifts)
  const [photos, setPhotos] = useState(initialData.photos)
  const [settings, setSettings] = useState(initialData.settings || {})
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [newGift, setNewGift] = useState<Partial<Gift>>({})
  const [newPhoto, setNewPhoto] = useState<Partial<Photo>>({})

  const handleLogout = () => {
    document.cookie = "admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.reload()
  }

  const saveGift = async (gift: Partial<Gift>) => {
    // In a real implementation, this would make API calls to update the database
    console.log("Saving gift:", gift)
    // For now, just update local state
    if (gift.id) {
      setGifts(gifts.map((g) => (g.id === gift.id ? { ...g, ...gift } : g)))
    } else {
      const newGiftWithId = { ...gift, id: Date.now().toString() } as Gift
      setGifts([...gifts, newGiftWithId])
    }
    setEditingGift(null)
    setNewGift({})
  }

  const deleteGift = async (id: string) => {
    if (confirm("Are you sure you want to delete this gift?")) {
      setGifts(gifts.filter((g) => g.id !== id))
    }
  }

  const savePhoto = async (photo: Partial<Photo>) => {
    console.log("Saving photo:", photo)
    if (photo.id) {
      setPhotos(photos.map((p) => (p.id === photo.id ? { ...p, ...photo } : p)))
    } else {
      const newPhotoWithId = { ...photo, id: Date.now().toString() } as Photo
      setPhotos([...photos, newPhotoWithId])
    }
    setEditingPhoto(null)
    setNewPhoto({})
  }

  const deletePhoto = async (id: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      setPhotos(photos.filter((p) => p.id !== id))
    }
  }

  const saveSettings = async () => {
    console.log("Saving settings:", settings)
    // In a real implementation, this would make an API call
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="gifts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gifts">Gifts</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="gifts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Manage Gifts</h2>
              <Button onClick={() => setNewGift({ name: "", status: "available" })}>
                <Plus className="mr-2 h-4 w-4" />
                Add Gift
              </Button>
            </div>

            {(newGift.name !== undefined || editingGift) && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingGift ? "Edit Gift" : "Add New Gift"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={editingGift?.name || newGift.name || ""}
                        onChange={(e) =>
                          editingGift
                            ? setEditingGift({ ...editingGift, name: e.target.value })
                            : setNewGift({ ...newGift, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={editingGift?.status || newGift.status || "available"}
                        onValueChange={(value) =>
                          editingGift
                            ? setEditingGift({ ...editingGift, status: value as Gift["status"] })
                            : setNewGift({ ...newGift, status: value as Gift["status"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editingGift?.description || newGift.description || ""}
                      onChange={(e) =>
                        editingGift
                          ? setEditingGift({ ...editingGift, description: e.target.value })
                          : setNewGift({ ...newGift, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={editingGift?.image_url || newGift.image_url || ""}
                      onChange={(e) =>
                        editingGift
                          ? setEditingGift({ ...editingGift, image_url: e.target.value })
                          : setNewGift({ ...newGift, image_url: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pix QR URL</Label>
                      <Input
                        value={editingGift?.pix_qr_url || newGift.pix_qr_url || ""}
                        onChange={(e) =>
                          editingGift
                            ? setEditingGift({ ...editingGift, pix_qr_url: e.target.value })
                            : setNewGift({ ...newGift, pix_qr_url: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pix Link URL</Label>
                      <Input
                        value={editingGift?.pix_link_url || newGift.pix_link_url || ""}
                        onChange={(e) =>
                          editingGift
                            ? setEditingGift({ ...editingGift, pix_link_url: e.target.value })
                            : setNewGift({ ...newGift, pix_link_url: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => saveGift(editingGift || newGift)}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingGift(null)
                        setNewGift({})
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {gifts.map((gift) => (
                <Card key={gift.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{gift.name}</h3>
                          <Badge
                            variant={
                              gift.status === "paid" ? "default" : gift.status === "reserved" ? "secondary" : "outline"
                            }
                          >
                            {gift.status}
                          </Badge>
                        </div>
                        {gift.description && <p className="text-sm text-muted-foreground mb-2">{gift.description}</p>}
                        {gift.reserved_by_name && (
                          <p className="text-sm">
                            Reserved by: {gift.reserved_by_name} ({gift.reserved_by_email})
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingGift(gift)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteGift(gift.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Manage Photos</h2>
              <Button onClick={() => setNewPhoto({ image_url: "", sort_order: photos.length })}>
                <Plus className="mr-2 h-4 w-4" />
                Add Photo
              </Button>
            </div>

            {(newPhoto.image_url !== undefined || editingPhoto) && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingPhoto ? "Edit Photo" : "Add New Photo"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={editingPhoto?.image_url || newPhoto.image_url || ""}
                      onChange={(e) =>
                        editingPhoto
                          ? setEditingPhoto({ ...editingPhoto, image_url: e.target.value })
                          : setNewPhoto({ ...newPhoto, image_url: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Caption</Label>
                    <Input
                      value={editingPhoto?.caption || newPhoto.caption || ""}
                      onChange={(e) =>
                        editingPhoto
                          ? setEditingPhoto({ ...editingPhoto, caption: e.target.value })
                          : setNewPhoto({ ...newPhoto, caption: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={editingPhoto?.sort_order || newPhoto.sort_order || 0}
                      onChange={(e) =>
                        editingPhoto
                          ? setEditingPhoto({ ...editingPhoto, sort_order: Number.parseInt(e.target.value) })
                          : setNewPhoto({ ...newPhoto, sort_order: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => savePhoto(editingPhoto || newPhoto)}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingPhoto(null)
                        setNewPhoto({})
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
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
                        alt={photo.caption || "Photo"}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{photo.caption || "No caption"}</p>
                        <p className="text-sm text-muted-foreground">Sort order: {photo.sort_order}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingPhoto(photo)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deletePhoto(photo.id)}>
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
            <h2 className="text-2xl font-semibold">RSVPs</h2>
            <div className="grid gap-4">
              {initialData.rsvps.map((rsvp) => (
                <Card key={rsvp.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{rsvp.name}</h3>
                          <Badge variant={rsvp.attending ? "default" : "secondary"}>
                            {rsvp.attending ? "Attending" : "Not Attending"}
                          </Badge>
                        </div>
                        {rsvp.email && <p className="text-sm text-muted-foreground">{rsvp.email}</p>}
                        {rsvp.message && <p className="text-sm mt-2">{rsvp.message}</p>}
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(rsvp.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold">Site Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your wedding website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cover Title</Label>
                    <Input
                      value={settings.cover_title || ""}
                      onChange={(e) => setSettings({ ...settings, cover_title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cover Subtitle</Label>
                    <Input
                      value={settings.cover_subtitle || ""}
                      onChange={(e) => setSettings({ ...settings, cover_subtitle: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location Address</Label>
                  <Input
                    value={settings.location_address || ""}
                    onChange={(e) => setSettings({ ...settings, location_address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maps Embed URL</Label>
                  <Input
                    value={settings.maps_embed_url || ""}
                    onChange={(e) => setSettings({ ...settings, maps_embed_url: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Global Pix QR URL</Label>
                    <Input
                      value={settings.pix_qr_url || ""}
                      onChange={(e) => setSettings({ ...settings, pix_qr_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Global Pix Link URL</Label>
                    <Input
                      value={settings.pix_link_url || ""}
                      onChange={(e) => setSettings({ ...settings, pix_link_url: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Pix Instructions</Label>
                  <Textarea
                    value={settings.pix_instructions || ""}
                    onChange={(e) => setSettings({ ...settings, pix_instructions: e.target.value })}
                  />
                </div>
                <Button onClick={saveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
