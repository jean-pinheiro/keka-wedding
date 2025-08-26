import { supabaseServer } from "@/src/lib/supabase-server";
import { Carousel } from "@/src/components/Carousel";
import { MapEmbed } from "@/src/components/MapEmbed";
import { RsvpForm } from "@/src/components/RsvpForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Gift } from "lucide-react";
import Flourish from "@/src/components/Flourish";
import SideMenu from "@/src/components/SideMenu";
import { ainslay } from "@/src/lib/fonts";
interface Photo {
  id: string;
  image_url: string;
  caption?: string;
  sort_order: number;
}

interface SiteSettings {
  location_address?: string;
  maps_embed_url?: string;
  cover_title?: string;
  cover_subtitle?: string;
  pix_link_url?: string; // if not already included here
  amazon_list_url?: string; // 👈 new
  cover_image_url?: string; // Added cover image URL field
  about_text?: string; // Added about text field
}

async function getPhotos(): Promise<Photo[]> {
  const supabase = supabaseServer();

  if (!supabase) {
    console.log("Supabase not configured, returning empty photos array");
    return [];
  }

  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching photos:", error);
    return [];
  }

  return photos || [];
}

async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = supabaseServer();

  if (!supabase) {
    console.log("Supabase not configured, returning default settings");
    return {
      cover_title: "Nosso Casamento",
      cover_subtitle: "Celebre conosco nosso dia especial",
      location_address: "Local a ser definido",
    };
  }

  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching site settings:", error);
    return {
      cover_title: "Nosso Casamento",
      cover_subtitle: "Celebre conosco nosso dia especial",
      location_address: "Local a ser definido",
    };
  }

  return settings || {};
}

export default async function HomePage() {
  const [photos, settings] = await Promise.all([
    getPhotos(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <SideMenu />

      {/* Hero Carousel Section */}
      <section id="inicio" className="relative">
        <div className="h-screen relative overflow-hidden">
          {/* Cover image (fallback to first photo) */}
          {settings.cover_image_url || photos[0]?.image_url ? (
            <img
              src={settings.cover_image_url || photos[0]?.image_url}
              alt="Capa do casamento"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}
          {/* Overlay with couple names/date */}
          <div className="absolute inset-0 bg-black/30 flex items-end justify-center pb-20">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-7xl font-ainslay font-bold mb-2">
                {settings.cover_title || "Jessica e Artur"}
              </h1>
              <p className="text-lg md:text-xl font-light tracking-wider">
                {settings.cover_subtitle || "3 DE OUTUBRO DE 2025"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About the Couple Section */}
      <section id="sobre" className="py-15 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Decorative element */}
            <div className="mb-8 text-[--gold]">
              <div className="text-[#6B7A3C]">
                <Flourish className="w-60 h-16" />
              </div>
            </div>
            <h2 className="text-4xl font-ainslay font-bold mb-8 text-gray-800">
              Sobre o Evento
            </h2>
            {/* Bounded carousel */}
            <div className="mx-auto mb-8 w-full max-w-[800px]">
              {/* wrapper to keep reasonable height; adjust as you like */}
              <div className="relative w-full max-h-[800px]">
                <Carousel photos={photos} />
              </div>
            </div>

            {/* About text from settings */}
            {settings.about_text ? (
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {settings.about_text}
              </p>
            ) : (
              <p className="text-gray-600 leading-relaxed text-lg">
                Criamos esse site para compartilhar com vocês os detalhes do
                nosso casamento. Estamos muito felizes e contentes com a
                presença de todos os nossos grandes amigos. Aguardamos vocês no
                nosso grande dia!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="confirme" className="py-15 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Decorative element */}
            <div className="mb-8 text-[--gold]">
              <div className="text-[#6B7A3C]">
                <Flourish className="w-60 h-16" />
              </div>
            </div>
            <h2 className="text-4xl font-ainslay font-bold mb-8 text-center text-gray-800">
              Confirme sua Presença
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8 text-center">
              Por favor, confirme sua presença para que possamos nos organizar
              melhor para recebê-los em nosso dia especial.
            </p>
            <RsvpForm />
          </div>
        </div>
      </section>

      {/* Gifts Section */}
      <section id="presentes" className="py-15 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 text-[--gold]">
              <div className="text-[#6B7A3C]">
                <Flourish className="w-60 h-16" />
              </div>
            </div>

            <h2 className="text-4xl font-ainslay font-bold mb-6 text-gray-800">
              Lista de Presentes
            </h2>

            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              Escolha um presente especial para nos ajudar a começar nossa nova
              vida juntos. Sua presença já é o maior presente, mas se desejar
              nos presentear, ficamos muito gratos. Este é o link para a nossa
              lista na Amazon; ou, se preferir presentear de outra forma, também
              há a opção de contribuir via Pix. ❤️
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Amazon list (from DB settings) */}
              {!!settings.amazon_list_url && (
                <Button
                  asChild
                  size="lg"
                  className="bg-gray-800 hover:bg-gray-900 text-white"
                >
                  <Link
                    href={settings.amazon_list_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Gift className="mr-2 h-5 w-5" />
                    Abrir lista na Amazon
                  </Link>
                </Button>
              )}

              {/* Pix link (from DB settings) */}
              {!!settings.pix_link_url && (
                <Button asChild size="lg" variant="outline">
                  <Link
                    href={settings.pix_link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contribuir via Pix
                  </Link>
                </Button>
              )}
            </div>

            {/* Optional helper when neither is configured */}
            {!settings.amazon_list_url && !settings.pix_link_url && (
              <p className="text-sm text-gray-500 mt-6">
                Em breve adicionaremos as opções de presente 😊
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="local" className="py-15 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Decorative leaf element */}
            <div className="mb-8 text-[--gold]">
              <div className="text-[#6B7A3C]">
                <Flourish className="w-60 h-16" />
              </div>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-ainslay font-bold mb-4 text-gray-800">
                Cerimônia
              </h2>
              {settings.location_address && (
                <p className="text-gray-600 text-lg">
                  {settings.location_address}
                </p>
              )}
            </div>
            <MapEmbed
              embedUrl={settings.maps_embed_url}
              address={settings.location_address}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          {/* Decorative element */}
          <div className="mb-8 text-[--gold]">
            <div className="text-[#6B7A3C]">
              <Flourish className="w-24 h-12" />
            </div>
          </div>
          <p className="text-gray-500">
            Feito com amor para nosso dia especial
          </p>
        </div>
      </footer>
    </div>
  );
}
