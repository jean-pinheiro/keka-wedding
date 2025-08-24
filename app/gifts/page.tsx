import { getSupabaseClient } from "@/src/lib/supabase-server"
import { GiftCard } from "@/src/components/GiftCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
}

interface PixInfo {
  qrUrl?: string
  linkUrl?: string
  instructions?: string
}

async function getGifts(): Promise<Gift[]> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    console.log("Supabase not configured, returning empty gifts array")
    return []
  }

  const { data: gifts, error } = await supabase.from("gifts").select("*").order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching gifts:", error)
    return []
  }

  return gifts || []
}

async function reserveGift(
  giftId: string,
  name: string,
  email: string,
  viaPix: boolean,
): Promise<{ success: boolean; pixInfo?: PixInfo }> {
  "use server"

  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/reserve-gift`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ giftId, name, email, viaPix }),
  })

  if (!response.ok) {
    throw new Error("Failed to reserve gift")
  }

  const result = await response.json()
  return {
    success: result.ok,
    pixInfo: result.pix,
  }
}

export default async function GiftsPage() {
  const gifts = await getGifts()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Lista de Presentes</h1>
            <p className="text-muted-foreground mb-6">
              Escolha um presente especial para nos ajudar a começar nossa nova vida juntos
            </p>
            <Button asChild variant="outline">
              <Link href="/">Voltar ao Início</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} onReserve={reserveGift} />
            ))}
          </div>

          {gifts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhum presente disponível no momento. Configure o Supabase para gerenciar a lista de presentes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
