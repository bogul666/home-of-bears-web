
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { storyblok } from '@storyblok/astro';
import tailwindcss from '@tailwindcss/vite'; // Importujemy nowy Tailwind
import basicSsl from '@vitejs/plugin-basic-ssl'; // Importujemy certyfikat HTTPS

export default defineConfig({
  integrations: [
    react(),
    storyblok({
      accessToken: 'M4xOmZ5wrFy815lFOAH29gtt', // <-- TUTAJ TWÓJ KLUCZ (PREVIEW)
      components: {
        page: "storyblok/Page",
        hero_section: "storyblok/HeroSection",
        metodyka_section: "storyblok/MetodykaSection",
        obiekcje_section: "storyblok/ObiekcjeSection",
        kalkulator_section: "storyblok/KalkulatorSection",
        obiekcja_karta: "storyblok/ObiekcjaKarta",
        opinie_section: "storyblok/OpinieSection", 
        opinia_karta: "storyblok/OpiniaKarta",
        video_section: "storyblok/VideoSection",
        kursy_section: "storyblok/KursySection", 
        kurs_karta: "storyblok/KursKarta",
        zalozycielka_section: "storyblok/ZalozycielkaSection",
        baza_wiedzy_section: "storyblok/BazaWiedzySection",
        nasz_zespol_section: "storyblok/NaszZespolSection", // <-- DODAJ TĘ LINIJKĘ
        czlonek_zespolu: "storyblok/CzlonekZespolu",
        artykul: "storyblok/Artykul"
      },
      apiOptions: {
        region: "eu" 
      }
    })
  ],
  vite: {
    plugins: [
      tailwindcss(), // Włącza style
      basicSsl()     // Włącza HTTPS (Rozwiązuje problem ze Storyblok)
    ],
  },
  server: {
    host: true,
    port: 4321
  }
});