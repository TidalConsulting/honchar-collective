/**
 * Single source of truth for the boutique's contact info and copy.
 * Edit this file to update the phone number, WhatsApp, address, and hours everywhere.
 */
type Address = { street: string; city: string; country: string };
type Reviews = { rating: number; count: number };

export const site = {
  name: "Honchar Collective",
  tagline: "Authentic luxury, shipped from the US to the Dominican Republic",
  description:
    "Pre-owned and new luxury handbags, shoes, watches, jewelry, and ready-to-wear — bought in the United States, authenticated, and delivered to you in the Dominican Republic.",

  // TODO: replace with the real numbers before launch. 555 numbers are
  // reserved for fiction, so nobody gets a stranger's line by mistake.
  phone: "+1 (809) 555-0142",
  phoneHref: "tel:+18095550142",
  /** Digits only, country code first — used for wa.me links. */
  whatsapp: "18095550142",
  email: "hola@honcharcollective.com",
  instagram: "honcharcollective",

  /**
   * Google Ads tag. Set NEXT_PUBLIC_GOOGLE_ADS_ID to switch it on.
   *
   * It only loads on the public site in production — see GoogleAds. Preview
   * and test deployments deliberately don't fire, so staff clicking around a
   * draft never lands in the ad account's conversion data.
   */
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",

  /**
   * Meta pixel / dataset id. Set NEXT_PUBLIC_META_PIXEL_ID to switch Meta
   * tracking on. Off by default.
   *
   * The server half (Conversions API) posts to this same id and needs
   * META_CAPI_TOKEN set — see lib/meta.ts.
   */
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",

  /**
   * Set to null to omit every address block site-wide, rather than showing a
   * placeholder — a wrong address sends customers to the wrong place, so this
   * fails closed on purpose. Showroom visits are by appointment until a real
   * address goes in here.
   */
  address: null as Address | null,

  /** City shown on listings for pieces already in the country. */
  city: "Santo Domingo",

  /**
   * Star rating and review count, shown on listing cards and the detail page.
   * Null hides them everywhere until there are reviews to point at.
   */
  reviews: null as Reviews | null,

  hours: [
    { days: "Monday – Saturday", time: "10:00 AM – 7:00 PM" },
    { days: "Sunday", time: "By appointment" },
  ],

  /**
   * Approximate USD → DOP rate, for the "≈ RD$" line under each price.
   * Prices are set in dollars; this is a convenience, not a quote. Update it
   * whenever the rate moves meaningfully.
   */
  dopPerUsd: 63,

  /** Usual door-to-door time for a piece bought in the US. */
  shippingDays: "7–12",
} as const;

/** Full one-line address, or null when no address is configured. */
export const addressLine: string | null = site.address
  ? `${site.address.street}, ${site.address.city}, ${site.address.country}`
  : null;

/** "Santo Domingo, DR" — used on listing cards and the detail page. */
export const cityState: string | null = `${site.address?.city ?? site.city}, DR`;

/** Where the boutique is, for page copy. */
export const locationLabel = cityState ?? site.name;

/** wa.me link with an optional prefilled message. */
export function whatsappHref(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Categories offered. Order drives the landing page tiles and filter list.
 * Trim this to what's actually stocked — an empty category shows "0 available".
 */
export const CATEGORIES = [
  "Handbags",
  "Small Leather Goods",
  "Shoes",
  "Sneakers",
  "Watches",
  "Jewelry",
  "Ready-to-Wear",
  "Outerwear",
  "Sunglasses",
  "Belts",
  "Accessories",
] as const;

export const GENDERS = ["Women", "Men", "Unisex"] as const;

export const BRANDS = [
  "Louis Vuitton",
  "Chanel",
  "Hermès",
  "Gucci",
  "Dior",
  "Prada",
  "Saint Laurent",
  "Balenciaga",
  "Bottega Veneta",
  "Fendi",
  "Celine",
  "Goyard",
  "Cartier",
  "Rolex",
  "Van Cleef & Arpels",
  "Tiffany & Co.",
  "Moncler",
  "Off-White",
  "Christian Louboutin",
  "Nike",
  "Jordan",
] as const;

export const HARDWARE = ["Gold-tone", "Silver-tone", "Ruthenium", "Rose gold-tone", "Palladium"] as const;

/** What comes with a piece. Shown as chips on the detail page and used by the admin form. */
export const INCLUDES_OPTIONS = [
  "Original box",
  "Dust bag",
  "Receipt",
  "Authenticity card",
  "Tags attached",
  "Shoulder strap",
  "Care booklet",
  "Extra links",
  "Warranty papers",
  "Lock & key",
  "Shopping bag",
  "Replacement laces",
] as const;
