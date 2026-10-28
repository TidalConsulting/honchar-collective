/**
 * Every piece of public-site copy, in Spanish and English.
 *
 * Spanish is the default: almost every customer is in the Dominican Republic.
 * The admin dashboard stays in English and doesn't use this file.
 *
 * Values that are stored in the database or used in URLs (categories,
 * conditions, "comes with" entries) keep their English names everywhere and
 * are only translated for display, through the lookup tables at the bottom of
 * each dictionary. A value with no entry there is shown as typed.
 */
export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "es";
export const LANG_COOKIE = "lang";

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many);

const en = {
  locale: "en-US",
  ogLocale: "en_US",

  meta: {
    tagline: "Authentic luxury, shipped from the US to the Dominican Republic",
    description:
      "Pre-owned and new luxury handbags, shoes, watches, jewelry, and ready-to-wear — bought in the United States, authenticated, and delivered to you in the Dominican Republic.",
  },

  nav: {
    shop: "Shop",
    arriving: "Arriving Soon",
    request: "Request an Item",
    layaway: "Layaway",
    about: "About",
    contact: "Contact",
    shopNow: "Shop now",
    saved: "Saved items",
    savedCount: (count: number) => `Saved items (${count})`,
    menu: "Toggle navigation menu",
    home: (name: string) => `${name} home`,
    language: "Language",
  },

  whatsapp: {
    cta: "Message us on WhatsApp",
    short: "WhatsApp",
    ask: "Ask on WhatsApp",
    screenshot: "Send a screenshot on WhatsApp",
    orScreenshot: "Or send a screenshot",
    bookVisit: "Book a visit",
    msgItem: (title: string, sku: string | null, url: string) =>
      `Hi! I'm interested in the ${title}${sku ? ` (SKU ${sku})` : ""} — ${url}`,
    msgFind: "Hi! I'm looking for a piece. Can you help me find it?",
    msgNotListed: "Hi! I'm looking for a piece I don't see on the site.",
    msgVisit: "Hi! I'd like to book a showroom visit.",
  },

  footer: {
    shop: "Shop",
    shopAll: "Shop everything →",
    services: "Services",
    requestUs: "Request an item from the US",
    layaway: "Layaway",
    about: (name: string) => `About ${name}`,
    contact: "Contact",
    staff: "Staff login",
    visit: "Visit the showroom",
    touch: "Get in touch",
    byAppointment: "by appointment",
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    disclaimer: (name: string) =>
      `${name} is an independent reseller and is not affiliated with any brand shown. Prices are in US dollars; peso amounts are approximate.`,
  },

  hours: {
    "Monday – Saturday": "Monday – Saturday",
    Sunday: "Sunday",
    "By appointment": "By appointment",
  } as Record<string, string>,

  home: {
    inCollection: (count: number) => `${count} ${plural(count, "piece", "pieces")} in the collection`,
    title1: "Authentic luxury,",
    title2: "delivered home.",
    lede: "Handbags, shoes, watches, and jewelry from the houses you love, bought in the United States, authenticated, and brought to you in the Dominican Republic.",
    stats: { inStock: "In stock", designers: "Designers", arriving: "Arriving soon", from: "Starting at" },
    edit: {
      eyebrow: "The Edit",
      title: "Highlighted this week",
      blurb: "Hand-picked by our buyers. The pieces we'd reach for first.",
      cta: "Shop the collection",
    },
    categories: { eyebrow: "Shop by category", title: "Find your next piece" },
    fresh: {
      eyebrow: "Just in",
      title: (city: string) => `New in ${city}`,
      blurb: "Unpacked, authenticated, and ready to go home with you today.",
      cta: "See everything new",
    },
    arriving: {
      eyebrow: (count: number) => `Arriving soon · ${count} in transit`,
      title: "Reserve it before it lands",
      blurb: (days: string) =>
        `These pieces are already bought and on their way from the US, usually ${days} days door to door. Reserve one now and it's yours the day it arrives.`,
      cta: "See all arriving",
    },
    brands: { eyebrow: "Designers", title: "The houses in the collection" },
    how: {
      eyebrow: "How it works",
      title: "From the US to your door",
      steps: (days: string) => [
        {
          title: "Bought in the US",
          body: "From boutiques, authorised resellers, and private sellers we've vetted. Never from a marketplace we can't verify.",
        },
        {
          title: "Authenticated twice",
          body: "Checked before it ships and again when it lands. Stitching, hardware, date codes, and materials.",
        },
        {
          title: "Shipped and cleared",
          body: `We handle the freight and customs. Usually ${days} days from purchase to the showroom.`,
        },
        {
          title: "Yours, your way",
          body: "Pay in full or on interest-free layaway. Delivered anywhere in the DR, or collect by appointment.",
        },
      ],
    },
    requestCta: {
      eyebrow: "Personal sourcing",
      title: "Don't see it? We'll find it.",
      body: "Send us the bag, the watch, or the sneaker, with your size. We source it in the US and send you one all-in price, shipping and customs included.",
      button: "Request an item",
    },
    empty: {
      title: "The collection is being unpacked",
      before: "Sign in to the",
      link: "staff dashboard",
      after: "to list your first piece.",
    },
  },

  search: {
    category: "Category",
    everything: "Everything",
    label: "Search the collection",
    placeholder: "Brand, style, or colour",
    submit: "Search",
    popular: "Popular",
    quick: [
      { label: "Handbags", href: "/shop?category=Handbags" },
      { label: "Under $1,000", href: "/shop?priceMax=1000" },
      { label: "New with tags", href: "/shop?condition=NEW" },
      { label: "Arriving soon", href: "/shop?arrival=arriving" },
    ],
  },

  card: {
    sold: "Sold",
    inTransit: "In transit",
    arrives: (date: string) => `Arrives ${date}`,
    featured: "★ Featured",
    justIn: "Just in",
    size: (size: string) => `Size ${size}`,
    belowRetail: (pct: number) => `${pct}% below retail`,
    soldNote: "Sold — no longer available",
    layawayShort: (amount: string) => `or ${amount} ×4 on layaway`,
    authenticated: "Authenticated",
    seeSold: "See what sold",
    reserve: "Reserve before it lands",
    check: "Check availability",
    save: "Save this item",
    unsave: "Remove from saved",
    saveLabel: "Save",
    savedLabel: "Saved",
    prevPhoto: "Previous photo",
    nextPhoto: "Next photo",
    photoN: (n: number) => `Photo ${n}`,
  },

  shop: {
    metaTitle: "Shop the Collection",
    metaDescription:
      "Authentic designer handbags, shoes, watches, jewelry, and ready-to-wear, in Santo Domingo or on the way from the US.",
    eyebrow: "Shop",
    recentlySold: "Recently sold",
    arriving: "Arriving soon",
    collection: "The collection",
    count: (count: number) => `${count.toLocaleString("en-US")} ${plural(count, "piece", "pieces")}`,
    subSold: (count: string) => `${count} we've sold recently — a feel for what moves through here and how fast.`,
    subAll: (count: string) => `${count}, available and recently sold together.`,
    subArriving: (count: string) => `${count} already bought in the US and on the way. Reserve one before it lands.`,
    subDefault: (count: string, place: string) =>
      `${count} in ${place} or on the way — every one authenticated, priced in dollars.`,
    pageOf: (page: number, count: number) => `Showing page ${page} of ${count}`,
    emptyTitle: "Nothing matches those filters",
    emptyBody:
      "Try widening the price range or clearing a filter or two. Or tell us exactly what you want and we'll find it in the US for you.",
    clearAll: "Clear all filters",
    requestItem: "Request an item",
  },

  filters: {
    results: (count: number) => `${count.toLocaleString("en-US")} ${plural(count, "result", "results")}`,
    clearAll: "Clear all",
    searchPlaceholder: "Try “Neverfull” or “black heels”",
    searchLabel: "Search the collection",
    search: "Search",
    specificTitle: "Looking for something specific?",
    specificBody: "Send us a photo and your size. We'll find it in the US.",
    availability: "Availability",
    stillAvailable: "Still available",
    recentlySold: "Recently sold",
    showBoth: "Show both",
    where: "Where it is",
    readyNow: (city: string) => `Ready now in ${city}`,
    arrivingSoon: "Arriving soon from the US",
    transitNote: (days: string) => `Pieces in transit can be reserved now. Usually ${days} days door to door.`,
    category: "Category",
    designer: "Designer",
    price: "Price (USD)",
    condition: "Condition",
    size: "Size",
    for: "For",
    noMatches: "No matches with the current filters.",
    clear: "Clear",
    filters: "Filters",
    close: "Close filters",
    show: (count: number) => `Show ${count.toLocaleString("en-US")} results`,
    sort: "Sort:",
    chip: {
      q: "Search",
      category: "Category",
      brand: "Designer",
      condition: "Condition",
      size: "Size",
      gender: "For",
      arrival: "Where",
      availability: "Showing",
      priceMin: "Min price",
      priceMax: "Max price",
    } as Record<string, string>,
    arrivalValue: { arriving: "Arriving soon", ready: "Ready now" } as Record<string, string>,
    availabilityValue: { sold: "Sold", all: "Everything" } as Record<string, string>,
    previous: "Previous",
    next: "Next",
    pagination: "Pagination",
  },

  sort: {
    best: "Featured",
    newest: "Just in",
    "price-asc": "Price: low to high",
    "price-desc": "Price: high to low",
    condition: "Condition: best first",
  } as Record<string, string>,

  item: {
    notFound: "Item not found",
    metaDescription: (title: string, name: string, place: string) =>
      `Authentic ${title} for sale at ${name}, delivered in ${place}.`,
    home: "Home",
    shop: "Shop",
    piece: "The piece",
    details: "Details",
    comesWith: "Comes with",
    spec: {
      brand: "Brand",
      category: "Category",
      condition: "Condition",
      size: "Size",
      color: "Color",
      material: "Material",
      hardware: "Hardware",
      year: "Year",
      for: "For",
      sku: "SKU",
    },
    conditionHeading: (label: string) => `Condition · ${label}`,
    authenticity: "Authenticity",
    authenticDefault:
      "Inspected and authenticated before it was listed. If it is ever proven not genuine, you get every peso back.",
    authenticPending:
      "Authentication is in progress. This piece cannot be purchased until it has been verified.",
    how: "How it works",
    howSteps: [
      {
        title: "Reserve it",
        body: "Send us a WhatsApp or the form. We hold the piece for 24 hours while we talk it through.",
      },
      {
        title: "See it up close",
        body: "Get a live video of the piece, or visit us by appointment to see it in person.",
      },
      {
        title: "Pay your way",
        body: "Pay in full, or put down a deposit and finish on layaway. Delivery anywhere in the DR.",
      },
    ],
    onTheWay: "On its way from the US",
    expected: (city: string, date: string) => `Expected in ${city} around ${date}.`,
    usually: (days: string) => `Usually ${days} days door to door.`,
    reserveNow: "Reserve it now and it's yours the day it lands.",
    soldTitle: "This piece has sold",
    soldBody: (days: string) =>
      `Tell us what you were after. We can find another one in the US and ship it to you, usually within ${days} days.`,
    findOne: "Find me one",
    browseSimilar: "Browse similar pieces",
    orDetails: "or leave your details",
    reserveHeading: "Reserve before it lands",
    checkHeading: "Check availability",
    askSku: (sku: string) => `Ask about SKU ${sku}`,
    askPiece: "Ask about this piece",
    reserveButton: "Reserve this piece",
    showroom: (place: string) => `${place} · showroom by appointment`,
    call: (phone: string) => `Call ${phone}`,
    reviews: (count: number) => plural(count, "review", "reviews"),
    alsoLike: "You may also like",
    viewAll: "View all →",
    retail: (price: string) => `Retail ${price}`,
    priceDrop: (amount: string) => `${amount} price drop`,
    layawayLine: "Or layaway:",
    layawayPlan: (deposit: number, payments: number, amount: string) =>
      `${deposit}% down, then ${payments} payments of ${amount}`,
    photosPending: "Photos of this piece are being taken now — message us on WhatsApp for a video today.",
    viewer: (title: string) => `${title} photo viewer`,
    closeViewer: "Close photo viewer",
    viewPhoto: (n: number) => `View photo ${n}`,
  },

  lead: {
    fullName: "Full name",
    phone: "WhatsApp or phone",
    email: "Email",
    either: "Leave a WhatsApp number, an email, or both.",
    messageLabel: "What are you looking for?",
    messagePlaceholder: "Your size, when you need it, or any questions about the piece.",
    sending: "Sending…",
    consent: "By submitting you agree to be contacted about this item. We never sell your information.",
    sent: "Request sent",
    success: "Thanks — a member of our team will reach out within one business hour.",
    honeypot: "Thanks — we'll be in touch shortly.",
    fixFields: "Please fix the highlighted fields.",
    errors: {
      name: "Please enter your name",
      email: "Enter a valid email address",
      phone: "Leave a WhatsApp number or an email so we can reply",
      message: "That message is too long",
    } as Record<string, string>,
    check: "Check availability",
  },

  layaway: {
    metaTitle: "Layaway",
    metaDescription:
      "Reserve a luxury piece with a deposit and pay the balance in interest-free instalments. No credit check.",
    eyebrow: "Layaway · Apartado",
    title: "Make it yours now. Pay for it over time.",
    lede: "Put down a deposit and the piece is taken off the site and held for you. Pay the balance in equal instalments, weekly, every two weeks, or monthly, and take it home with the last one. No interest and no credit check.",
    perks: (deposit: number) => [
      {
        title: `${deposit}% holds it`,
        body: "Your deposit takes the piece off the site the same day. Nobody else can buy it.",
      },
      {
        title: "Zero interest",
        body: "You pay the price on the tag and nothing more. Split it into as many as 8 payments.",
      },
      {
        title: "Kept safe for you",
        body: "Stored and insured in our showroom until the final payment, then delivered or collected.",
      },
    ],
    formHeading: "Start a layaway",
    formSub: "Tell us which piece and the plan that suits you. We'll confirm it on WhatsApp.",
    formLabel: "Which piece, and which plan?",
    formPlaceholder: "e.g. the Gucci Marmont, 30% down and 4 payments every two weeks.",
    formSubmit: "Request layaway",
    fineTitle: "The fine print",
    fine: (min: string) => [
      `Layaway is available on pieces from ${min}.`,
      "Plans run up to 4 months. Pay ahead at any time.",
      "Miss a payment and we'll message you first. After 14 days late the piece may be released.",
      "Deposits can be moved to a different piece within 7 days.",
    ],
    browse: "Browse the collection",
    calc: {
      title: "Layaway plan",
      introEditable:
        "Put in a price and see how a layaway plan would work. No interest, no credit check.",
      introItem:
        "Hold this piece with a deposit and pay the rest over time. No interest, no credit check.",
      price: "Item price (USD)",
      paymentsOf: (n: number) => `${n} payments of`,
      after: (deposit: string, dop: string) => `after a ${deposit} deposit · ${dop} each`,
      deposit: "Deposit today",
      payments: "Number of payments",
      howOften: "How often",
      intervals: { 7: "Weekly", 14: "Every 2 weeks", 30: "Monthly" } as Record<number, string>,
      yours: "Start today and the piece is yours on",
      note: "The piece stays in our showroom, insured, until the final payment. Deposits are non-refundable after 7 days but can be moved to another piece. Peso amounts are approximate.",
    },
  },

  request: {
    metaTitle: "Request an Item",
    metaDescription: (name: string) =>
      `Tell ${name} what you want. We find it in the United States, authenticate it, and deliver it to you in the Dominican Republic.`,
    eyebrow: "Personal sourcing",
    title: "Tell us what you want. We'll bring it home.",
    lede: "Looking for a specific bag, a size that never reaches the DR, or a sneaker that sold out here in an hour? We buy from boutiques, authorised resellers, and vetted private sellers in the United States, authenticate every piece, and ship it to you.",
    steps: (days: string) => [
      {
        title: "Describe the piece",
        body: "Brand, model, size, colour, and your budget. A screenshot over WhatsApp works just as well.",
      },
      {
        title: "We find it and send you a quote",
        body: "One all-in price in dollars: the piece, shipping, and customs. No surprises at the door.",
      },
      {
        title: "Deposit, authenticate, ship",
        body: "A 30% deposit secures it. We authenticate it in the US before it ships, then again when it lands.",
      },
      {
        title: "Delivered to you",
        body: `Usually ${days} days from purchase to your door anywhere in the DR. Pay the balance on delivery.`,
      },
    ],
    oftenTitle: "Often requested",
    oftenBody:
      "Louis Vuitton and Goyard totes, Chanel flap bags, Cartier Love and Juste un Clou, Rolex and Cartier watches, limited Jordan and Nike releases, Moncler outerwear, and Christian Louboutin heels in sizes 35–42.",
    formHeading: "Request an item",
    formSub: "We reply with availability and an all-in quote, usually within a day.",
    formPlaceholder: "Brand, model, size, colour, condition you'd accept, and your budget.",
    formSubmit: "Find it for me",
  },

  about: {
    metaDescription: (name: string, place: string) =>
      `${name} brings authentic luxury from the United States to customers in ${place}.`,
    eyebrow: "Our story",
    title: "Luxury shouldn't depend on where you live.",
    paragraphs: (name: string) => [
      "The boutiques are in Miami and New York. The releases sell out online in minutes and rarely ship to the Dominican Republic. And the pieces that do turn up locally come with no way of knowing whether they're real.",
      `${name} closes that gap. We buy in the United States, from boutiques, authorised resellers, and private sellers we've vetted, and bring each piece home to the DR. Every one is inspected and authenticated before it's listed, priced in plain dollars, and delivered to your door.`,
      "If something isn't in the collection, ask. Finding the exact bag, size, or watch a client wants is half of what we do.",
    ],
    closing: "Real pieces, fair prices, and the same access as anywhere else.",
    stats: (days: string) => [
      { label: "Every piece authenticated", value: "100%" },
      { label: "From US purchase to your door", value: `${days} days` },
      { label: "Interest on layaway", value: "0%" },
    ],
    visitTitle: "Come see the collection",
    shopNow: "Shop now",
  },

  contact: {
    metaDescription: (name: string, place: string) => `WhatsApp, call, or email ${name} in ${place}.`,
    eyebrow: "Contact",
    title: "We're a message away.",
    lede: "Questions about a piece, a size, or a delivery? WhatsApp is the fastest way to reach us. We answer every message ourselves.",
    call: "Call",
    email: "Email",
    showroom: "Showroom",
    hours: "Hours",
    formHeading: "Send us a message",
    formSub: "We reply within a few hours during opening hours.",
    formPlaceholder: "Ask us anything: a piece, a size, delivery, or layaway.",
    formSubmit: "Send message",
  },

  saved: {
    eyebrow: "Wishlist",
    title: "Your saved pieces",
    lede: "Saved on this device. Tap the heart on any listing to add it here.",
    emptyTitle: "Nothing saved yet",
    emptyBody: "Browse the collection and tap the heart on anything you love.",
    shop: "Shop the collection",
  },

  notFound: {
    eyebrow: "Page not found",
    title: "This piece has moved on",
    body: "The page may have moved, or the piece you were looking at has found a new home. The full collection is a click away, and we can always find you another.",
    shop: "Shop the collection",
    request: "Request an item",
  },

  error: {
    eyebrow: "Something went wrong",
    title: "This page didn't load",
    body: "Try again in a moment. If it keeps happening, message us on WhatsApp and we'll help you straight away.",
    retry: "Try again",
    reference: "Reference",
  },

  preview: "Preview site — items shown are sample data, not real stock. Not visible to search engines.",

  category: {} as Record<string, string>,
  condition: {
    NEW: "New",
    EXCELLENT: "Excellent",
    VERY_GOOD: "Very Good",
    GOOD: "Good",
    FAIR: "Fair",
  } as Record<string, string>,
  conditionDetail: {
    NEW: "Never used. Tags, stickers, or protective film still in place.",
    EXCELLENT: "Used a handful of times. No visible wear without close inspection.",
    VERY_GOOD: "Light signs of use, such as faint corner rubbing or hardware scratches.",
    GOOD: "Visible wear consistent with regular use. Structurally sound.",
    FAIR: "Noticeable wear or repairs, priced accordingly. Every flaw is photographed.",
  } as Record<string, string>,
  gender: {} as Record<string, string>,
  includes: {} as Record<string, string>,
  hardware: {} as Record<string, string>,
};

export type Dict = typeof en;

const es: Dict = {
  locale: "es-DO",
  ogLocale: "es_DO",

  meta: {
    tagline: "Lujo auténtico, de Estados Unidos a República Dominicana",
    description:
      "Carteras, zapatos, relojes, joyas y ropa de lujo, nuevos y de segunda mano — comprados en Estados Unidos, autenticados y entregados en República Dominicana.",
  },

  nav: {
    shop: "Tienda",
    arriving: "Por llegar",
    request: "Pedir un artículo",
    layaway: "Apartado",
    about: "Nosotros",
    contact: "Contacto",
    shopNow: "Comprar",
    saved: "Guardados",
    savedCount: (count: number) => `Guardados (${count})`,
    menu: "Abrir o cerrar el menú",
    home: (name: string) => `Inicio de ${name}`,
    language: "Idioma",
  },

  whatsapp: {
    cta: "Escríbenos por WhatsApp",
    short: "WhatsApp",
    ask: "Pregunta por WhatsApp",
    screenshot: "Envía una captura por WhatsApp",
    orScreenshot: "O envía una captura",
    bookVisit: "Agenda una visita",
    msgItem: (title: string, sku: string | null, url: string) =>
      `¡Hola! Me interesa ${title}${sku ? ` (SKU ${sku})` : ""} — ${url}`,
    msgFind: "¡Hola! Estoy buscando una pieza. ¿Me ayudan a encontrarla?",
    msgNotListed: "¡Hola! Busco una pieza que no veo en la página.",
    msgVisit: "¡Hola! Me gustaría agendar una visita al showroom.",
  },

  footer: {
    shop: "Tienda",
    shopAll: "Ver todo →",
    services: "Servicios",
    requestUs: "Pide un artículo de EE. UU.",
    layaway: "Apartado",
    about: (name: string) => `Sobre ${name}`,
    contact: "Contacto",
    staff: "Acceso del equipo",
    visit: "Visita el showroom",
    touch: "Contáctanos",
    byAppointment: "con cita previa",
    rights: "Todos los derechos reservados.",
    privacy: "Política de privacidad",
    disclaimer: (name: string) =>
      `${name} es un revendedor independiente y no está afiliado a ninguna de las marcas mostradas. Precios en dólares estadounidenses; los montos en pesos son aproximados.`,
  },

  hours: {
    "Monday – Saturday": "Lunes – sábado",
    Sunday: "Domingo",
    "By appointment": "Con cita previa",
  },

  home: {
    inCollection: (count: number) => `${count} ${plural(count, "pieza", "piezas")} en la colección`,
    title1: "Lujo auténtico,",
    title2: "hasta tu puerta.",
    lede: "Carteras, zapatos, relojes y joyas de las casas que amas, compradas en Estados Unidos, autenticadas y traídas hasta ti en República Dominicana.",
    stats: { inStock: "Disponibles", designers: "Diseñadores", arriving: "Por llegar", from: "Desde" },
    edit: {
      eyebrow: "La Selección",
      title: "Destacados de la semana",
      blurb: "Elegidos a mano por nuestro equipo. Las piezas que escogeríamos primero.",
      cta: "Ver la colección",
    },
    categories: { eyebrow: "Compra por categoría", title: "Encuentra tu próxima pieza" },
    fresh: {
      eyebrow: "Recién llegados",
      title: (city: string) => `Nuevo en ${city}`,
      blurb: "Desempacados, autenticados y listos para irse contigo hoy.",
      cta: "Ver todo lo nuevo",
    },
    arriving: {
      eyebrow: (count: number) => `Por llegar · ${count} en tránsito`,
      title: "Apártala antes de que llegue",
      blurb: (days: string) =>
        `Estas piezas ya están compradas y vienen de camino desde EE. UU., normalmente ${days} días puerta a puerta. Apártala ahora y es tuya el día que llegue.`,
      cta: "Ver todo lo que viene",
    },
    brands: { eyebrow: "Diseñadores", title: "Las casas de la colección" },
    how: {
      eyebrow: "Cómo funciona",
      title: "De EE. UU. a tu puerta",
      steps: (days: string) => [
        {
          title: "Comprado en EE. UU.",
          body: "En boutiques, revendedores autorizados y vendedores privados verificados. Nunca en un mercado que no podamos verificar.",
        },
        {
          title: "Autenticado dos veces",
          body: "Lo revisamos antes del envío y otra vez al llegar: costuras, herrajes, códigos de fecha y materiales.",
        },
        {
          title: "Enviado y desaduanado",
          body: `Nos encargamos del flete y la aduana. Normalmente ${days} días desde la compra hasta el showroom.`,
        },
        {
          title: "Tuyo, a tu manera",
          body: "Paga completo o en apartado sin intereses. Entrega en todo el país, o recógelo con cita previa.",
        },
      ],
    },
    requestCta: {
      eyebrow: "Búsqueda personal",
      title: "¿No lo ves? Lo encontramos.",
      body: "Envíanos la cartera, el reloj o los tenis, con tu talla. Lo buscamos en EE. UU. y te damos un solo precio final, con envío y aduana incluidos.",
      button: "Pedir un artículo",
    },
    empty: {
      title: "Estamos desempacando la colección",
      before: "Entra al",
      link: "panel del equipo",
      after: "para publicar la primera pieza.",
    },
  },

  search: {
    category: "Categoría",
    everything: "Todo",
    label: "Buscar en la colección",
    placeholder: "Marca, estilo o color",
    submit: "Buscar",
    popular: "Populares",
    quick: [
      { label: "Carteras", href: "/shop?category=Handbags" },
      { label: "Menos de $1,000", href: "/shop?priceMax=1000" },
      { label: "Nuevo con etiquetas", href: "/shop?condition=NEW" },
      { label: "Por llegar", href: "/shop?arrival=arriving" },
    ],
  },

  card: {
    sold: "Vendido",
    inTransit: "En tránsito",
    arrives: (date: string) => `Llega el ${date}`,
    featured: "★ Destacado",
    justIn: "Recién llegado",
    size: (size: string) => `Talla ${size}`,
    belowRetail: (pct: number) => `${pct}% menos que en tienda`,
    soldNote: "Vendido — ya no está disponible",
    layawayShort: (amount: string) => `o 4 pagos de ${amount} en apartado`,
    authenticated: "Autenticado",
    seeSold: "Ver lo vendido",
    reserve: "Apartar ahora",
    check: "Consultar disponibilidad",
    save: "Guardar esta pieza",
    unsave: "Quitar de guardados",
    saveLabel: "Guardar",
    savedLabel: "Guardado",
    prevPhoto: "Foto anterior",
    nextPhoto: "Foto siguiente",
    photoN: (n: number) => `Foto ${n}`,
  },

  shop: {
    metaTitle: "La colección",
    metaDescription:
      "Carteras, zapatos, relojes, joyas y ropa de diseñador auténticos, en Santo Domingo o en camino desde EE. UU.",
    eyebrow: "Tienda",
    recentlySold: "Vendidos recientemente",
    arriving: "Por llegar",
    collection: "La colección",
    count: (count: number) => `${count.toLocaleString("es-DO")} ${plural(count, "pieza", "piezas")}`,
    subSold: (count: string) => `${count} vendidas recientemente — para que veas qué se mueve y qué tan rápido.`,
    subAll: (count: string) => `${count}, disponibles y vendidas juntas.`,
    subArriving: (count: string) => `${count} ya compradas en EE. UU. y en camino. Aparta la tuya antes de que llegue.`,
    subDefault: (count: string, place: string) =>
      `${count} en ${place} o en camino — todas autenticadas, con precio en dólares.`,
    pageOf: (page: number, count: number) => `Página ${page} de ${count}`,
    emptyTitle: "Nada coincide con esos filtros",
    emptyBody:
      "Prueba con un rango de precio más amplio o quita algún filtro. O dinos exactamente qué quieres y lo buscamos en EE. UU. para ti.",
    clearAll: "Quitar todos los filtros",
    requestItem: "Pedir un artículo",
  },

  filters: {
    results: (count: number) => `${count.toLocaleString("es-DO")} ${plural(count, "resultado", "resultados")}`,
    clearAll: "Quitar todo",
    searchPlaceholder: "Prueba “Neverfull” o “tacones negros”",
    searchLabel: "Buscar en la colección",
    search: "Buscar",
    specificTitle: "¿Buscas algo en específico?",
    specificBody: "Envíanos una foto y tu talla. Lo encontramos en EE. UU.",
    availability: "Disponibilidad",
    stillAvailable: "Disponibles",
    recentlySold: "Vendidos recientemente",
    showBoth: "Ver ambos",
    where: "Dónde está",
    readyNow: (city: string) => `Listo en ${city}`,
    arrivingSoon: "Por llegar desde EE. UU.",
    transitNote: (days: string) => `Las piezas en tránsito se pueden apartar ya. Normalmente ${days} días puerta a puerta.`,
    category: "Categoría",
    designer: "Diseñador",
    price: "Precio (USD)",
    condition: "Condición",
    size: "Talla",
    for: "Para",
    noMatches: "Sin resultados con los filtros actuales.",
    clear: "Quitar",
    filters: "Filtros",
    close: "Cerrar filtros",
    show: (count: number) => `Ver ${count.toLocaleString("es-DO")} resultados`,
    sort: "Ordenar:",
    chip: {
      q: "Búsqueda",
      category: "Categoría",
      brand: "Diseñador",
      condition: "Condición",
      size: "Talla",
      gender: "Para",
      arrival: "Dónde",
      availability: "Mostrando",
      priceMin: "Precio mín.",
      priceMax: "Precio máx.",
    },
    arrivalValue: { arriving: "Por llegar", ready: "Listo ya" },
    availabilityValue: { sold: "Vendidos", all: "Todo" },
    previous: "Anterior",
    next: "Siguiente",
    pagination: "Paginación",
  },

  sort: {
    best: "Destacados",
    newest: "Recién llegados",
    "price-asc": "Precio: de menor a mayor",
    "price-desc": "Precio: de mayor a menor",
    condition: "Condición: mejor primero",
  },

  item: {
    notFound: "Pieza no encontrada",
    metaDescription: (title: string, name: string, place: string) =>
      `${title} auténtico a la venta en ${name}, con entrega en ${place}.`,
    home: "Inicio",
    shop: "Tienda",
    piece: "La pieza",
    details: "Detalles",
    comesWith: "Incluye",
    spec: {
      brand: "Marca",
      category: "Categoría",
      condition: "Condición",
      size: "Talla",
      color: "Color",
      material: "Material",
      hardware: "Herrajes",
      year: "Año",
      for: "Para",
      sku: "SKU",
    },
    conditionHeading: (label: string) => `Condición · ${label}`,
    authenticity: "Autenticidad",
    authenticDefault:
      "Inspeccionada y autenticada antes de publicarse. Si alguna vez se demuestra que no es original, te devolvemos cada peso.",
    authenticPending:
      "La autenticación está en proceso. Esta pieza no se puede comprar hasta que sea verificada.",
    how: "Cómo funciona",
    howSteps: [
      {
        title: "Apártala",
        body: "Escríbenos por WhatsApp o por el formulario. Te guardamos la pieza 24 horas mientras conversamos.",
      },
      {
        title: "Mírala de cerca",
        body: "Te enviamos un video en vivo de la pieza, o visítanos con cita previa para verla en persona.",
      },
      {
        title: "Paga a tu manera",
        body: "Paga completo, o deja un depósito y termina en apartado. Entrega en todo el país.",
      },
    ],
    onTheWay: "En camino desde EE. UU.",
    expected: (city: string, date: string) => `Llega a ${city} alrededor del ${date}.`,
    usually: (days: string) => `Normalmente ${days} días puerta a puerta.`,
    reserveNow: "Apártala ahora y es tuya el día que llegue.",
    soldTitle: "Esta pieza se vendió",
    soldBody: (days: string) =>
      `Dinos qué buscabas. Podemos encontrar otra en EE. UU. y enviártela, normalmente en ${days} días.`,
    findOne: "Búscame una",
    browseSimilar: "Ver piezas similares",
    orDetails: "o déjanos tus datos",
    reserveHeading: "Apártala antes de que llegue",
    checkHeading: "Consultar disponibilidad",
    askSku: (sku: string) => `Pregunta por el SKU ${sku}`,
    askPiece: "Pregunta por esta pieza",
    reserveButton: "Apartar esta pieza",
    showroom: (place: string) => `${place} · showroom con cita previa`,
    call: (phone: string) => `Llamar al ${phone}`,
    reviews: (count: number) => plural(count, "reseña", "reseñas"),
    alsoLike: "También te puede gustar",
    viewAll: "Ver todo →",
    retail: (price: string) => `En tienda ${price}`,
    priceDrop: (amount: string) => `Bajó ${amount}`,
    layawayLine: "O en apartado:",
    layawayPlan: (deposit: number, payments: number, amount: string) =>
      `${deposit}% de inicial y ${payments} pagos de ${amount}`,
    photosPending: "Estamos tomando las fotos de esta pieza. Escríbenos por WhatsApp y te enviamos un video hoy.",
    viewer: (title: string) => `Fotos de ${title}`,
    closeViewer: "Cerrar fotos",
    viewPhoto: (n: number) => `Ver foto ${n}`,
  },

  lead: {
    fullName: "Nombre completo",
    phone: "WhatsApp o teléfono",
    email: "Correo electrónico",
    either: "Déjanos un WhatsApp, un correo, o ambos.",
    messageLabel: "¿Qué estás buscando?",
    messagePlaceholder: "Tu talla, para cuándo lo necesitas o cualquier pregunta sobre la pieza.",
    sending: "Enviando…",
    consent: "Al enviar aceptas que te contactemos sobre esta pieza. Nunca vendemos tu información.",
    sent: "Solicitud enviada",
    success: "¡Gracias! Alguien de nuestro equipo te escribirá en menos de una hora laborable.",
    honeypot: "¡Gracias! Te escribiremos pronto.",
    fixFields: "Revisa los campos marcados.",
    errors: {
      name: "Escribe tu nombre",
      email: "Escribe un correo válido",
      phone: "Déjanos un WhatsApp o un correo para poder responderte",
      message: "El mensaje es demasiado largo",
    },
    check: "Consultar disponibilidad",
  },

  layaway: {
    metaTitle: "Apartado",
    metaDescription:
      "Aparta una pieza de lujo con un depósito y paga el resto en cuotas sin intereses. Sin revisión de crédito.",
    eyebrow: "Apartado",
    title: "Hazla tuya hoy. Págala poco a poco.",
    lede: "Deja un depósito y retiramos la pieza de la página para guardártela. Paga el resto en cuotas iguales, semanales, quincenales o mensuales, y llévatela con el último pago. Sin intereses y sin revisión de crédito.",
    perks: (deposit: number) => [
      {
        title: `Con ${deposit}% es tuya`,
        body: "Tu depósito retira la pieza de la página el mismo día. Nadie más la puede comprar.",
      },
      {
        title: "Cero intereses",
        body: "Pagas el precio de la etiqueta y nada más. Divídelo en hasta 8 pagos.",
      },
      {
        title: "Guardada para ti",
        body: "Guardada y asegurada en nuestro showroom hasta el último pago; luego te la entregamos o la recoges.",
      },
    ],
    formHeading: "Empieza tu apartado",
    formSub: "Dinos qué pieza y qué plan te conviene. Te lo confirmamos por WhatsApp.",
    formLabel: "¿Qué pieza y qué plan?",
    formPlaceholder: "Ej.: la Gucci Marmont, 30% de inicial y 4 pagos quincenales.",
    formSubmit: "Solicitar apartado",
    fineTitle: "Condiciones",
    fine: (min: string) => [
      `El apartado está disponible en piezas desde ${min}.`,
      "Los planes duran hasta 4 meses. Puedes adelantar pagos cuando quieras.",
      "Si te atrasas con un pago, primero te escribimos. Con 14 días de atraso la pieza puede liberarse.",
      "Puedes pasar tu depósito a otra pieza dentro de los primeros 7 días.",
    ],
    browse: "Ver la colección",
    calc: {
      title: "Plan de apartado",
      introEditable:
        "Escribe un precio y mira cómo quedaría tu apartado. Sin intereses ni revisión de crédito.",
      introItem:
        "Separa esta pieza con un depósito y paga el resto poco a poco. Sin intereses ni revisión de crédito.",
      price: "Precio de la pieza (USD)",
      paymentsOf: (n: number) => `${n} pagos de`,
      after: (deposit: string, dop: string) => `después de un depósito de ${deposit} · ${dop} cada uno`,
      deposit: "Depósito hoy",
      payments: "Cantidad de pagos",
      howOften: "Frecuencia",
      intervals: { 7: "Semanal", 14: "Quincenal", 30: "Mensual" },
      yours: "Empieza hoy y la pieza es tuya el",
      note: "La pieza se queda en nuestro showroom, asegurada, hasta el último pago. Los depósitos no son reembolsables después de 7 días, pero puedes pasarlos a otra pieza. Los montos en pesos son aproximados.",
    },
  },

  request: {
    metaTitle: "Pedir un artículo",
    metaDescription: (name: string) =>
      `Dile a ${name} qué quieres. Lo encontramos en Estados Unidos, lo autenticamos y te lo entregamos en República Dominicana.`,
    eyebrow: "Búsqueda personal",
    title: "Dinos qué quieres. Te lo traemos.",
    lede: "¿Buscas una cartera en específico, una talla que nunca llega a RD o unos tenis que se agotaron en una hora? Compramos en boutiques, revendedores autorizados y vendedores privados verificados en Estados Unidos, autenticamos cada pieza y te la enviamos.",
    steps: (days: string) => [
      {
        title: "Descríbenos la pieza",
        body: "Marca, modelo, talla, color y tu presupuesto. Una captura por WhatsApp también sirve.",
      },
      {
        title: "La buscamos y te cotizamos",
        body: "Un solo precio final en dólares: la pieza, el envío y la aduana. Sin sorpresas al recibirla.",
      },
      {
        title: "Depósito, autenticación y envío",
        body: "Con un 30% de depósito la aseguramos. La autenticamos en EE. UU. antes del envío y otra vez al llegar.",
      },
      {
        title: "Te la entregamos",
        body: `Normalmente ${days} días desde la compra hasta tu puerta, en cualquier parte del país. Pagas el resto al recibirla.`,
      },
    ],
    oftenTitle: "Lo más pedido",
    oftenBody:
      "Totes de Louis Vuitton y Goyard, carteras Chanel con solapa, Cartier Love y Juste un Clou, relojes Rolex y Cartier, ediciones limitadas de Jordan y Nike, abrigos Moncler y tacones Christian Louboutin en tallas 35–42.",
    formHeading: "Pedir un artículo",
    formSub: "Te respondemos con disponibilidad y precio final, normalmente en un día.",
    formPlaceholder: "Marca, modelo, talla, color, condición que aceptarías y tu presupuesto.",
    formSubmit: "Búscamelo",
  },

  about: {
    metaDescription: (name: string, place: string) =>
      `${name} trae lujo auténtico de Estados Unidos a clientes en ${place}.`,
    eyebrow: "Nuestra historia",
    title: "El lujo no debería depender de dónde vives.",
    paragraphs: (name: string) => [
      "Las boutiques están en Miami y Nueva York. Los lanzamientos se agotan en línea en minutos y casi nunca envían a República Dominicana. Y las piezas que aparecen aquí no traen forma de saber si son originales.",
      `${name} cierra esa brecha. Compramos en Estados Unidos, en boutiques, revendedores autorizados y vendedores privados verificados, y traemos cada pieza a RD. Todas se inspeccionan y autentican antes de publicarse, con precio claro en dólares y entrega en tu puerta.`,
      "Si algo no está en la colección, pregúntanos. Encontrar la cartera, la talla o el reloj exacto que busca un cliente es la mitad de lo que hacemos.",
    ],
    closing: "Piezas originales, precios justos y el mismo acceso que en cualquier otro lugar.",
    stats: (days: string) => [
      { label: "Piezas autenticadas", value: "100%" },
      { label: "De la compra en EE. UU. a tu puerta", value: `${days} días` },
      { label: "Intereses en apartado", value: "0%" },
    ],
    visitTitle: "Ven a ver la colección",
    shopNow: "Comprar",
  },

  contact: {
    metaDescription: (name: string, place: string) =>
      `Escribe por WhatsApp, llama o envía un correo a ${name} en ${place}.`,
    eyebrow: "Contacto",
    title: "Estamos a un mensaje.",
    lede: "¿Preguntas sobre una pieza, una talla o una entrega? WhatsApp es la forma más rápida de contactarnos. Respondemos cada mensaje nosotros mismos.",
    call: "Llamar",
    email: "Correo",
    showroom: "Showroom",
    hours: "Horario",
    formHeading: "Envíanos un mensaje",
    formSub: "Respondemos en pocas horas durante nuestro horario.",
    formPlaceholder: "Pregúntanos lo que sea: una pieza, una talla, la entrega o el apartado.",
    formSubmit: "Enviar mensaje",
  },

  saved: {
    eyebrow: "Favoritos",
    title: "Tus piezas guardadas",
    lede: "Guardadas en este dispositivo. Toca el corazón en cualquier pieza para agregarla aquí.",
    emptyTitle: "Todavía no has guardado nada",
    emptyBody: "Explora la colección y toca el corazón en lo que te guste.",
    shop: "Ver la colección",
  },

  notFound: {
    eyebrow: "Página no encontrada",
    title: "Esta pieza ya no está aquí",
    body: "La página pudo haberse movido, o la pieza que buscabas ya encontró dueño. La colección completa está a un clic, y siempre podemos buscarte otra.",
    shop: "Ver la colección",
    request: "Pedir un artículo",
  },

  error: {
    eyebrow: "Algo salió mal",
    title: "Esta página no cargó",
    body: "Inténtalo de nuevo en un momento. Si sigue pasando, escríbenos por WhatsApp y te ayudamos enseguida.",
    retry: "Intentar de nuevo",
    reference: "Referencia",
  },

  preview: "Sitio de prueba — las piezas son de muestra, no inventario real. No visible para buscadores.",

  category: {
    Handbags: "Carteras",
    "Small Leather Goods": "Marroquinería",
    Shoes: "Zapatos",
    Sneakers: "Tenis",
    Watches: "Relojes",
    Jewelry: "Joyería",
    "Ready-to-Wear": "Ropa",
    Outerwear: "Abrigos",
    Sunglasses: "Gafas de sol",
    Belts: "Correas",
    Accessories: "Accesorios",
  },
  condition: {
    NEW: "Nuevo",
    EXCELLENT: "Excelente",
    VERY_GOOD: "Muy bueno",
    GOOD: "Bueno",
    FAIR: "Aceptable",
  },
  conditionDetail: {
    NEW: "Sin usar. Todavía con etiquetas, stickers o plástico protector.",
    EXCELLENT: "Usado pocas veces. Sin desgaste visible a menos que se mire de cerca.",
    VERY_GOOD: "Leves señales de uso, como un roce suave en las esquinas o rayitas en los herrajes.",
    GOOD: "Desgaste visible propio del uso normal. En buen estado estructural.",
    FAIR: "Desgaste o reparaciones notables, con precio acorde. Cada detalle está fotografiado.",
  },
  gender: { Women: "Mujer", Men: "Hombre", Unisex: "Unisex" },
  includes: {
    "Original box": "Caja original",
    "Dust bag": "Dust bag",
    Receipt: "Recibo",
    "Authenticity card": "Tarjeta de autenticidad",
    "Tags attached": "Con etiquetas",
    "Shoulder strap": "Correa para el hombro",
    "Care booklet": "Folleto de cuidado",
    "Extra links": "Eslabones extra",
    "Warranty papers": "Papeles de garantía",
    "Lock & key": "Candado y llave",
    "Shopping bag": "Bolsa de la tienda",
    "Replacement laces": "Cordones de repuesto",
  },
  hardware: {
    "Gold-tone": "Dorado",
    "Silver-tone": "Plateado",
    "Antique gold-tone": "Dorado envejecido",
    Ruthenium: "Rutenio",
    "Rose gold-tone": "Oro rosa",
    Palladium: "Paladio",
  },
};

export const DICTIONARIES: Record<Lang, Dict> = { es, en };

export function isLang(value: unknown): value is Lang {
  return value === "es" || value === "en";
}

/** Display name for a stored value, falling back to the value itself. */
export function label(table: Record<string, string>, value: string) {
  return table[value] ?? value;
}

/** "12 nov" / "Nov 12" — arrival dates, always within the next few weeks. */
export function shortDate(value: Date | string, lang: Lang) {
  return new Intl.DateTimeFormat(DICTIONARIES[lang].locale, { month: "short", day: "numeric" }).format(
    new Date(value),
  );
}
