"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Gift {
  id: string
  name: string
  description?: string
  image_url?: string
  status: "available" | "reserved" | "paid"
  reserved_by_name?: string
  reserved_by_email?: string
}

interface PixInfo {
  qrUrl?: string
  linkUrl?: string
  instructions?: string
}

interface GiftCardProps {
  gift: Gift
  onReserve: (
    giftId: string,
    name: string,
    email: string,
    viaPix: boolean,
  ) => Promise<{ success: boolean; pixInfo?: PixInfo }>
}

export function GiftCard({ gift, onReserve }: GiftCardProps) {
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [reservationComplete, setReservationComplete] = useState(false)
  const [pixInfo, setPixInfo] = useState<PixInfo | null>(null)

  const handleReserve = async (viaPix: boolean) => {
    if (!name.trim() || !email.trim()) return

    setIsLoading(true)
    try {
      const result = await onReserve(gift.id, name, email, viaPix)
      if (result.success) {
        setReservationComplete(true)
        if (viaPix && result.pixInfo) {
          setPixInfo(result.pixInfo)
        }
      }
    } catch (error) {
      console.error("Erro ao reservar presente:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (gift.status) {
      case "reserved":
        return <Badge variant="secondary">Reservado</Badge>
      case "paid":
        return <Badge variant="default">Pago ✓</Badge>
      default:
        return null
    }
  }

  if (reservationComplete) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-green-600">Presente Reservado!</CardTitle>
          <CardDescription>{gift.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Obrigado {name}! Seu presente foi reservado com sucesso.</p>

          {pixInfo && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
              <h4 className="font-medium mb-2">Pagamento via Pix</h4>
              {pixInfo.instructions && <p className="text-sm text-gray-600 mb-3">{pixInfo.instructions}</p>}

              <div className="flex flex-col gap-3">
                {pixInfo.qrUrl && (
                  <div className="flex justify-center">
                    <img
                      src={pixInfo.qrUrl || "/placeholder.svg"}
                      alt="QR Code Pix"
                      className="max-w-48 h-auto border rounded"
                    />
                  </div>
                )}

                {pixInfo.linkUrl && (
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <a href={pixInfo.linkUrl} target="_blank" rel="noopener noreferrer">
                      Abrir Link do Pix
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{gift.name}</CardTitle>
            {gift.description && <CardDescription>{gift.description}</CardDescription>}
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent>
        {gift.image_url && (
          <img
            src={gift.image_url || "/placeholder.svg"}
            alt={gift.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}

        {gift.status === "available" && !showReservationForm && (
          <Button onClick={() => setShowReservationForm(true)} className="w-full">
            Reservar
          </Button>
        )}

        {gift.status === "available" && showReservationForm && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => handleReserve(false)}
                disabled={!name.trim() || !email.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? "Reservando..." : "Confirmar"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Prefere doar via Pix?</p>
                <Button
                  variant="outline"
                  onClick={() => handleReserve(true)}
                  disabled={!name.trim() || !email.trim() || isLoading}
                  className="w-full"
                >
                  Sim, via Pix
                </Button>
              </div>
            </div>

            <Button variant="ghost" onClick={() => setShowReservationForm(false)} className="w-full">
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
