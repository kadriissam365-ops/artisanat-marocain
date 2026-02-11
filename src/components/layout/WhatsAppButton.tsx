'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '212600000000';
  const message = encodeURIComponent('Bonjour, je souhaite avoir des informations sur vos produits artisanaux.');

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contact WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </a>
  );
}
