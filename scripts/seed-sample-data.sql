-- Sample data for testing the wedding website
-- Run this after the main schema.sql

-- Insert sample site settings
INSERT INTO public.site_settings (
  cover_title,
  cover_subtitle,
  location_address,
  maps_embed_url,
  pix_qr_url,
  pix_link_url,
  pix_instructions
) VALUES (
  'Maria & João',
  'Celebre conosco nosso dia especial - 15 de Junho de 2024',
  'Igreja São Francisco, Rua das Flores, 123 - Centro, São Paulo - SP',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0!2d-46.6333!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjgiUyA0NsKwMzcnNTkuOSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890',
  'https://example.com/pix-qr-code.png',
  'https://nubank.com.br/pagar/12345/abcdef',
  'Escaneie o QR Code ou clique no link para fazer o pagamento via Pix'
);

-- Insert sample gifts
INSERT INTO public.gifts (name, description, image_url, status) VALUES
('Jogo de Panelas Antiaderente', 'Conjunto completo com 5 panelas antiaderentes de alta qualidade', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 'available'),
('Máquina de Café Expresso', 'Máquina automática para café expresso perfeito todas as manhãs', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', 'available'),
('Jogo de Cama Casal King', 'Jogo de cama 100% algodão, 4 peças, cor branca', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', 'reserved'),
('Liquidificador Premium', 'Liquidificador de alta potência com 12 velocidades', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400', 'available'),
('Aspirador de Pó Robô', 'Aspirador inteligente com mapeamento automático', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'available'),
('Conjunto de Taças de Cristal', 'Set com 12 taças de cristal para vinho e champagne', 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=400', 'paid');

-- Update one gift to show reservation details
UPDATE public.gifts 
SET reserved_by_name = 'Ana Silva', reserved_by_email = 'ana@email.com'
WHERE status = 'reserved';

-- Insert sample photos for carousel
INSERT INTO public.photos (image_url, caption, sort_order) VALUES
('https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'Nosso primeiro encontro no parque', 0),
('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', 'Pedido de casamento na praia', 1),
('https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800', 'Ensaio fotográfico no campo', 2),
('https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800', 'Celebrando o noivado com a família', 3);

-- Insert sample RSVPs
INSERT INTO public.rsvps (name, email, attending, message) VALUES
('Carlos Mendes', 'carlos@email.com', true, 'Não vejo a hora de celebrar com vocês! Parabéns pelo casamento.'),
('Fernanda Costa', 'fernanda@email.com', true, 'Estarei lá para torcer por vocês dois!'),
('Roberto Santos', 'roberto@email.com', false, 'Infelizmente não poderei comparecer, mas desejo toda felicidade do mundo para vocês.'),
('Juliana Oliveira', 'juliana@email.com', true, '');
