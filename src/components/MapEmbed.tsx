interface MapEmbedProps {
  embedUrl?: string
  address?: string
}

export function MapEmbed({ embedUrl, address }: MapEmbedProps) {
  if (!embedUrl) {
    return (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Localização do evento</p>
          {address && <p className="text-sm">{address}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localização do casamento"
      />
    </div>
  )
}
