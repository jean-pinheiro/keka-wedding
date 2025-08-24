import { getSupabaseClient } from "@/src/lib/supabase-server"
import { Carousel } from "@/src/components/Carousel"
import { MapEmbed } from "@/src/components/MapEmbed"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Gift } from "lucide-react"

interface Photo {
  id: string
  image_url: string
  caption?: string
  sort_order: number
}

interface SiteSettings {
  location_address?: string
  maps_embed_url?: string
  cover_title?: string
  cover_subtitle?: string
}

async function getPhotos(): Promise<Photo[]> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    console.log("Supabase not configured, returning empty photos array")
    return []
  }

  const { data: photos, error } = await supabase.from("photos").select("*").order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching photos:", error)
    return []
  }

  return photos || []
}

async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    console.log("Supabase not configured, returning default settings")
    return {
      cover_title: "Nosso Casamento",
      cover_subtitle: "Celebre conosco nosso dia especial",
      location_address: "Local a ser definido",
    }
  }

  const { data: settings, error } = await supabase.from("site_settings").select("*").single()

  if (error) {
    console.error("Error fetching site settings:", error)
    return {
      cover_title: "Nosso Casamento",
      cover_subtitle: "Celebre conosco nosso dia especial",
      location_address: "Local a ser definido",
    }
  }

  return settings || {}
}

export default async function HomePage() {
  const [photos, settings] = await Promise.all([getPhotos(), getSiteSettings()])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel Section */}
      <section className="relative">
        <div className="h-screen relative overflow-hidden">
          <Carousel photos={photos} />
          {/* Overlay with couple names */}
          <div className="absolute inset-0 bg-black/30 flex items-end justify-center pb-20">
            <div className="text-center text-white">
              {/* Decorative leaf element */}
              <div className="mb-4">
                <svg
                  className="w-12 h-12 mx-auto text-white/80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 7s7-3 7-7c0-4-3-7-7-7z" />
                  <path d="M12 16v6" />
                  <path d="M8 14l-2 2" />
                  <path d="M16 14l2 2" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif italic mb-2">Jessica e Artur</h1>
              <p className="text-lg md:text-xl font-light tracking-wider">
                {settings.cover_subtitle || "9 DE AGOSTO DE 2025"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About the Couple Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Decorative leaf element */}
            <div className="mb-8">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 7s7-3 7-7c0-4-3-7-7-7z" />
                <path d="M12 16v6" />
                <path d="M8 14l-2 2" />
                <path d="M16 14l2 2" />
              </svg>
            </div>
            <h2 className="text-4xl font-serif italic mb-8 text-gray-800">Sobre o Evento</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              Criamos essa site para compartilhar com vocês os detalhes do nosso casamento. Estamos muito felizes e
              contentes com a presença de todos os nossos grandes amigos. Aguardamos vocês no nosso grande dia!
            </p>
          </div>
        </div>
      </section>

      {/* Gifts Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Decorative leaf element */}
            <div className="mb-8">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 7s7-3 7-7c0-4-3-7-7-7z" />
                <path d="M12 16v6" />
                <path d="M8 14l-2 2" />
                <path d="M16 14l2 2" />
              </svg>
            </div>
            <h2 className="text-4xl font-serif italic mb-8 text-gray-800">Lista de Presentes</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              Escolha um presente especial para nos ajudar a começar nossa nova vida juntos. Sua presença já é o maior
              presente, mas se desejar nos presentear, ficamos muito gratos.
            </p>
            <Button asChild size="lg" className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3">
              <Link href="/gifts">
                <Gift className="mr-2 h-5 w-5" />
                Ver Lista de Presentes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Decorative leaf element */}
            <div className="mb-8 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 7s7-3 7-7c0-4-3-7-7-7z" />
                <path d="M12 16v6" />
                <path d="M8 14l-2 2" />
                <path d="M16 14l2 2" />
              </svg>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-serif italic mb-4 text-gray-800">Cerimônia</h2>
              {settings.location_address && <p className="text-gray-600 text-lg">{settings.location_address}</p>}
            </div>
            <MapEmbed embedUrl={settings.maps_embed_url} address={settings.location_address} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <svg
              className="w-8 h-8 mx-auto text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 7s7-3 7-7c0-4-3-7-7-7z" />
              <path d="M12 16v6" />
              <path d="M8 14l-2 2" />
              <path d="M16 14l2 2" />
            </svg>
          </div>
          <p className="text-gray-500">Feito com amor para nosso dia especial</p>
        </div>
      </footer>
    </div>
  )
}
