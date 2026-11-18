// Ícones minimalistas monocromáticos em branco (#FFFFFF) ou preto (#111111)
export const ICONS = {
  logoMark: `
    <svg width="26" height="20" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 20L9 4H21C24.5 4 26.5 6.2 25.5 9.5C24.5 12.8 21.5 14.5 18 14.5H11.5L9.8 20H4Z" stroke="#E55B00" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M10 11H18.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `,
  cart: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  `,
  home: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  `,
  search: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,
  user: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  `,
  arrowRight: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  `,
  starFilled: `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  `,
  check: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `,
  trash: `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
      <path d="M10 11v6"></path>
      <path d="M14 11v6"></path>
    </svg>
  `,

  /* Ícones simples em branco para Categorias de Produtos (Fiel à foto) */
  catCorrida: `
    <svg width="58" height="58" viewBox="0 0 64 64" fill="#FFFFFF" aria-hidden="true">
      <path d="M10 42h44c2.2 0 4 1.8 4 4v2H6v-2c0-2.2 1.8-4 4-4zm4-4l6-16 8 4 7-10 15 14c2.5 2.2 4 5.2 4 8H14z"/>
    </svg>
  `,
  catFutebol: `
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#FFFFFF"/>
      <polygon points="12 7 16 10 14.5 15 9.5 15 8 10" fill="#D95500"/>
      <line x1="12" y1="2" x2="12" y2="7" stroke="#D95500" stroke-width="1.8"/>
      <line x1="21.5" y1="9" x2="16" y2="10" stroke="#D95500" stroke-width="1.8"/>
      <line x1="18" y1="20" x2="14.5" y2="15" stroke="#D95500" stroke-width="1.8"/>
      <line x1="6" y1="20" x2="9.5" y2="15" stroke="#D95500" stroke-width="1.8"/>
      <line x1="2.5" y1="9" x2="8" y2="10" stroke="#D95500" stroke-width="1.8"/>
    </svg>
  `,
  catBermudas: `
    <svg width="56" height="56" viewBox="0 0 64 64" fill="#FFFFFF" aria-hidden="true">
      <path d="M14 12h36l4 38H36l-4-16-4 16H10l4-38zm6 6v4h24v-4H20z"/>
    </svg>
  `,
  catCamisetas: `
    <svg width="58" height="58" viewBox="0 0 64 64" fill="#FFFFFF" aria-hidden="true">
      <path d="M22 12c2.5 3.5 7.5 5 10 5s7.5-1.5 10-5l12 8-5 11-7-4v25H22V27l-7 4-5-11 12-8z"/>
    </svg>
  `,
  catBone: `
    <svg width="58" height="58" viewBox="0 0 64 64" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 36c0-11 9-20 20-20s20 9 20 20H12z"/>
      <path d="M32 16v20"/>
      <path d="M12 36h44c2 0 4 1.5 4 3.5S58 43 56 43H28"/>
    </svg>
  `,
  catMochilas: `
    <svg width="54" height="54" viewBox="0 0 64 64" fill="#FFFFFF" aria-hidden="true">
      <path d="M24 18v-3a8 8 0 0 1 16 0v3h8a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4h8zm4 0h8v-3a4 4 0 0 0-8 0v3z"/>
    </svg>
  `,

  /* Ícones simples para Benefícios */
  truck: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  `,
  refresh: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  `,
  shield: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <polyline points="9 12 11 14 15 10"></polyline>
    </svg>
  `,
  card: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  `
};
