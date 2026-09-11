import gsap from 'gsap';
import Lenis from 'lenis';

// 1. Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Interactive Menu Index Switcher (Cena 3: O Cardápio em Movimento)
const menuRows = document.querySelectorAll('.menu-index-row');
const menuLiveImage = document.getElementById('menu-live-image');
const menuLiveCaption = document.getElementById('menu-live-caption');

const menuCaptions = [
  'Lâminas de Salmão em Redução Cítrica & Caviar',
  'Uramaki Ebi Flambado com Ovas de Massago & Molho Especial',
  'Yakisoba Artesanal Fumegante Servido em Cerâmica',
  'Cocktail Autoral da Casa com Espuma Densa & Flores Comestíveis'
];

if (menuRows.length > 0 && menuLiveImage && menuLiveCaption) {
  menuRows.forEach((row, index) => {
    const targetImg = row.getAttribute('data-menu-img');
    const caption = menuCaptions[index] || '';

    const activateRow = () => {
      // Highlight active row
      menuRows.forEach((r) => r.classList.remove('opacity-100', 'bg-white/[0.04]'));
      row.classList.add('opacity-100', 'bg-white/[0.04]');

      // Transition image smoothly
      if (menuLiveImage.src !== targetImg && !menuLiveImage.src.endsWith(targetImg)) {
        gsap.to(menuLiveImage, {
          opacity: 0.3,
          scale: 0.98,
          duration: 0.25,
          onComplete: () => {
            menuLiveImage.src = targetImg;
            if (menuLiveCaption) menuLiveCaption.textContent = caption;
            gsap.to(menuLiveImage, {
              opacity: 1,
              scale: 1,
              duration: 0.45,
              ease: 'power2.out'
            });
          }
        });
      }
    };

    row.addEventListener('mouseenter', activateRow);
    row.addEventListener('click', activateRow);
  });
}
