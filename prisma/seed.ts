/**
 * Demo collection so the site and dashboard look real before real pieces are
 * added. Run with `npm run db:seed`. Safe to re-run — it clears items, leads,
 * and visit data first. Never run it against production.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type Seed = {
  brand: string;
  name: string;
  category: string;
  gender?: string;
  condition?: "NEW" | "EXCELLENT" | "VERY_GOOD" | "GOOD" | "FAIR";
  price: number;
  retailPrice?: number;
  previousPrice?: number;
  costPrice: number;
  importCost: number;
  size?: string;
  color?: string;
  material?: string;
  hardware?: string;
  year?: number;
  description: string;
  includes: string[];
  featured?: boolean;
  status?: "DRAFT" | "PUBLISHED" | "SOLD";
  /** Days until it lands; set for pieces still on the way from the US. */
  arrivesInDays?: number;
};

const ITEMS: Seed[] = [
  {
    brand: "Louis Vuitton",
    name: "Neverfull MM",
    category: "Handbags",
    gender: "Women",
    condition: "EXCELLENT",
    price: 1650,
    retailPrice: 2030,
    costPrice: 1180,
    importCost: 95,
    size: "MM",
    color: "Monogram / Beige",
    material: "Coated canvas, vachetta leather",
    hardware: "Gold-tone",
    year: 2022,
    featured: true,
    description:
      "The everyday tote, in the classic monogram with the beige interior. Handles have a light honey patina, corners are clean, and the interior has no stains or pen marks.\n\nComes with the matching pochette, which zips and has no cracking.",
    includes: ["Dust bag", "Receipt"],
  },
  {
    brand: "Chanel",
    name: "Classic Medium Double Flap",
    category: "Handbags",
    gender: "Women",
    condition: "VERY_GOOD",
    price: 8900,
    retailPrice: 10800,
    costPrice: 7200,
    importCost: 260,
    size: "Medium",
    color: "Black",
    material: "Caviar leather",
    hardware: "Gold-tone",
    year: 2019,
    featured: true,
    description:
      "Black caviar with gold hardware, the combination that holds its value best. Caviar keeps its shape and resists scratches; there's light wear on the CC turnlock and one faint corner rub.\n\nSerial sticker intact and matches the card.",
    includes: ["Dust bag", "Original box", "Authenticity card"],
  },
  {
    brand: "Hermès",
    name: "Evelyne III PM",
    category: "Handbags",
    gender: "Women",
    condition: "EXCELLENT",
    price: 3450,
    retailPrice: 3600,
    costPrice: 2650,
    importCost: 120,
    size: "PM",
    color: "Gold",
    material: "Clemence leather",
    hardware: "Palladium",
    year: 2023,
    description:
      "Hermès gold Clemence, the warm tan that goes with everything. Crossbody strap is clean with no fraying, and the perforated H is crisp.\n\nCarried a handful of times.",
    includes: ["Dust bag", "Original box", "Shopping bag"],
  },
  {
    brand: "Gucci",
    name: "GG Marmont Small Shoulder Bag",
    category: "Handbags",
    gender: "Women",
    condition: "EXCELLENT",
    price: 1450,
    retailPrice: 2650,
    previousPrice: 1590,
    costPrice: 980,
    importCost: 80,
    size: "Small",
    color: "Black",
    material: "Matelassé chevron leather",
    hardware: "Antique gold-tone",
    year: 2022,
    description:
      "Quilted chevron leather with the double-G hardware. The chain strap doubles for shoulder or crossbody. Leather is supple and the hardware has only hairline scratches.",
    includes: ["Dust bag", "Original box"],
  },
  {
    brand: "Dior",
    name: "Saddle Bag",
    category: "Handbags",
    gender: "Women",
    condition: "NEW",
    price: 4100,
    retailPrice: 4400,
    costPrice: 3350,
    importCost: 140,
    color: "Blue Oblique",
    material: "Oblique jacquard",
    hardware: "Gold-tone",
    year: 2024,
    arrivesInDays: 6,
    description:
      "The Saddle in blue Oblique jacquard, bought new at the boutique and never carried. Protective film still on the hardware.\n\nOn its way from Miami now.",
    includes: ["Dust bag", "Original box", "Receipt", "Shoulder strap"],
  },
  {
    brand: "Goyard",
    name: "Saint Louis PM",
    category: "Handbags",
    gender: "Unisex",
    condition: "VERY_GOOD",
    price: 1550,
    retailPrice: 2070,
    costPrice: 1150,
    importCost: 90,
    size: "PM",
    color: "Black",
    material: "Goyardine canvas",
    description:
      "The Goyard tote everyone recognises. Light wear on the handle edges, interior clean, and it comes with the pouch.",
    includes: ["Dust bag"],
  },
  {
    brand: "Louis Vuitton",
    name: "Zippy Wallet",
    category: "Small Leather Goods",
    gender: "Unisex",
    condition: "EXCELLENT",
    price: 780,
    retailPrice: 1170,
    costPrice: 520,
    importCost: 40,
    color: "Damier Ebene",
    material: "Coated canvas",
    hardware: "Gold-tone",
    year: 2021,
    description:
      "Damier Ebene, which hides wear better than any other LV canvas. Zip runs smoothly and the card slots are firm.",
    includes: ["Dust bag", "Original box"],
  },
  {
    brand: "Cartier",
    name: "Love Bracelet",
    category: "Jewelry",
    gender: "Unisex",
    condition: "EXCELLENT",
    price: 6450,
    retailPrice: 7650,
    costPrice: 5300,
    importCost: 180,
    size: "17",
    color: "Yellow gold",
    material: "18k yellow gold",
    featured: true,
    description:
      "The classic Love in 18k yellow gold, size 17. Light surface scratches from wear, which can be polished out by Cartier. Screwdriver included.\n\nSerial engraved and matches the certificate.",
    includes: ["Original box", "Authenticity card", "Receipt"],
  },
  {
    brand: "Van Cleef & Arpels",
    name: "Vintage Alhambra Necklace",
    category: "Jewelry",
    gender: "Women",
    condition: "EXCELLENT",
    price: 4650,
    retailPrice: 5300,
    costPrice: 3800,
    importCost: 140,
    color: "Onyx / Yellow gold",
    material: "18k yellow gold, onyx",
    description: "10-motif onyx Alhambra. Clasp secure, stones free of chips.",
    includes: ["Original box", "Authenticity card"],
    arrivesInDays: 9,
  },
  {
    brand: "Rolex",
    name: "Datejust 36",
    category: "Watches",
    gender: "Unisex",
    condition: "VERY_GOOD",
    price: 9800,
    retailPrice: 10750,
    costPrice: 8400,
    importCost: 300,
    size: "36mm",
    color: "Silver dial",
    material: "Oystersteel, white gold bezel",
    year: 2018,
    featured: true,
    description:
      "Fluted white gold bezel, silver stick dial, Jubilee bracelet. Keeps excellent time. Bracelet has light stretch normal for the age.\n\nBox and papers dated 2018.",
    includes: ["Original box", "Warranty papers", "Extra links"],
  },
  {
    brand: "Cartier",
    name: "Tank Must Large",
    category: "Watches",
    gender: "Unisex",
    condition: "NEW",
    price: 3100,
    retailPrice: 3350,
    costPrice: 2550,
    importCost: 110,
    size: "Large",
    color: "Black dial",
    material: "Steel, leather strap",
    year: 2024,
    description: "Unworn, with stickers still on the case back. Black dial, black alligator-effect strap.",
    includes: ["Original box", "Warranty papers", "Care booklet"],
  },
  {
    brand: "Christian Louboutin",
    name: "So Kate 120 Pumps",
    category: "Shoes",
    gender: "Women",
    condition: "EXCELLENT",
    price: 520,
    retailPrice: 795,
    costPrice: 300,
    importCost: 35,
    size: "38",
    color: "Black",
    material: "Patent leather",
    description:
      "The sharpest Louboutin pump, in black patent. Worn once indoors: red soles show only the lightest marking.",
    includes: ["Dust bag", "Original box"],
  },
  {
    brand: "Gucci",
    name: "Horsebit 1953 Loafers",
    category: "Shoes",
    gender: "Men",
    condition: "VERY_GOOD",
    price: 520,
    retailPrice: 980,
    costPrice: 310,
    importCost: 35,
    size: "42",
    color: "Black",
    material: "Leather",
    hardware: "Gold-tone",
    description: "Classic horsebit loafer. Soles show light wear, uppers conditioned and clean.",
    includes: ["Dust bag"],
  },
  {
    brand: "Jordan",
    name: "Air Jordan 1 Retro High OG 'Chicago Lost & Found'",
    category: "Sneakers",
    gender: "Men",
    condition: "NEW",
    price: 380,
    retailPrice: 180,
    costPrice: 250,
    importCost: 30,
    size: "10",
    color: "Red / White / Black",
    material: "Leather",
    year: 2022,
    featured: true,
    description: "Deadstock, never tried on. Original box with the aged lid and the extra laces.",
    includes: ["Original box", "Replacement laces"],
  },
  {
    brand: "Nike",
    name: "Dunk Low 'Panda'",
    category: "Sneakers",
    gender: "Unisex",
    condition: "NEW",
    price: 160,
    retailPrice: 115,
    costPrice: 105,
    importCost: 20,
    size: "8",
    color: "Black / White",
    material: "Leather",
    description: "Deadstock pair in the colourway that goes with everything.",
    includes: ["Original box"],
    arrivesInDays: 4,
  },
  {
    brand: "Balenciaga",
    name: "Triple S",
    category: "Sneakers",
    gender: "Men",
    condition: "VERY_GOOD",
    price: 520,
    retailPrice: 1150,
    costPrice: 300,
    importCost: 40,
    size: "43",
    color: "White",
    material: "Mesh, leather",
    description: "Light creasing at the toe box, soles clean. Comes with the box and dust bag.",
    includes: ["Original box", "Dust bag"],
  },
  {
    brand: "Moncler",
    name: "Maya Short Down Jacket",
    category: "Outerwear",
    gender: "Men",
    condition: "EXCELLENT",
    price: 950,
    retailPrice: 1750,
    costPrice: 620,
    importCost: 65,
    size: "3 (L)",
    color: "Navy",
    material: "Laqué nylon, down fill",
    description: "The shiny Maya, worn a single winter in New York. Hologram tag and NFC chip both present.",
    includes: ["Tags attached"],
  },
  {
    brand: "Saint Laurent",
    name: "Cassandre Leather Belt",
    category: "Belts",
    gender: "Unisex",
    condition: "EXCELLENT",
    price: 380,
    retailPrice: 595,
    costPrice: 230,
    importCost: 25,
    size: "85",
    color: "Black",
    material: "Calfskin",
    hardware: "Gold-tone",
    description: "Black leather with the YSL buckle. Faint marks on the most-used hole only.",
    includes: ["Dust bag", "Original box"],
  },
  {
    brand: "Prada",
    name: "Symbole Sunglasses",
    category: "Sunglasses",
    gender: "Women",
    condition: "NEW",
    price: 330,
    retailPrice: 520,
    costPrice: 200,
    importCost: 20,
    color: "Black",
    material: "Acetate",
    description: "Chunky acetate frame with the triangle logo on the temples. Unworn, lenses still filmed.",
    includes: ["Original box", "Care booklet"],
  },
  {
    brand: "Hermès",
    name: "Twilly d'Hermès",
    category: "Accessories",
    gender: "Women",
    condition: "NEW",
    price: 260,
    retailPrice: 245,
    costPrice: 185,
    importCost: 15,
    color: "Orange / Gold",
    material: "Silk twill",
    description: "Tie it on a bag handle or wear it in the hair. Unworn, in the orange box.",
    includes: ["Original box"],
  },
  {
    brand: "Off-White",
    name: "Arrows Logo Hoodie",
    category: "Ready-to-Wear",
    gender: "Men",
    condition: "EXCELLENT",
    price: 340,
    retailPrice: 795,
    costPrice: 190,
    importCost: 25,
    size: "M",
    color: "Black",
    material: "Cotton fleece",
    description: "Oversized fit. Print has no cracking; washed cold and hung to dry.",
    includes: [],
  },
  {
    brand: "Bottega Veneta",
    name: "Mini Jodie",
    category: "Handbags",
    gender: "Women",
    condition: "EXCELLENT",
    price: 2200,
    retailPrice: 3200,
    costPrice: 1600,
    importCost: 90,
    size: "Mini",
    color: "Parakeet green",
    material: "Intrecciato leather",
    hardware: "Gold-tone",
    year: 2023,
    status: "DRAFT",
    description: "Still being photographed. Intrecciato weave in the green that started it all.",
    includes: ["Dust bag"],
  },
];

/**
 * Pieces already sold, so days-on-market, sold-vs-asking and margin have
 * history to report in the demo. These are demo records; production starts empty.
 */
const SOLD: (Seed & { soldFor: number; daysToSell: number; soldDaysAgo: number })[] = [
  {
    brand: "Louis Vuitton",
    name: "Speedy Bandoulière 25",
    category: "Handbags",
    gender: "Women",
    condition: "EXCELLENT",
    price: 1450,
    retailPrice: 2100,
    costPrice: 980,
    importCost: 85,
    color: "Monogram",
    description: "Sold. Kept online because the listing still brings in searches.",
    includes: ["Dust bag", "Shoulder strap"],
    soldFor: 1400,
    daysToSell: 9,
    soldDaysAgo: 5,
  },
  {
    brand: "Chanel",
    name: "Classic Card Holder",
    category: "Small Leather Goods",
    condition: "NEW",
    price: 640,
    retailPrice: 750,
    costPrice: 450,
    importCost: 30,
    color: "Black caviar",
    description: "Sold.",
    includes: ["Original box", "Dust bag"],
    soldFor: 640,
    daysToSell: 3,
    soldDaysAgo: 11,
  },
  {
    brand: "Rolex",
    name: "Oyster Perpetual 41",
    category: "Watches",
    condition: "EXCELLENT",
    price: 8200,
    retailPrice: 6400,
    costPrice: 6900,
    importCost: 250,
    color: "Green dial",
    description: "Sold.",
    includes: ["Original box", "Warranty papers"],
    soldFor: 7950,
    daysToSell: 21,
    soldDaysAgo: 18,
  },
  {
    brand: "Jordan",
    name: "Air Jordan 4 Retro 'Military Black'",
    category: "Sneakers",
    condition: "NEW",
    price: 290,
    retailPrice: 210,
    costPrice: 200,
    importCost: 25,
    size: "9.5",
    color: "White / Black",
    description: "Sold.",
    includes: ["Original box"],
    soldFor: 290,
    daysToSell: 2,
    soldDaysAgo: 24,
  },
  {
    brand: "Gucci",
    name: "Dionysus Small",
    category: "Handbags",
    condition: "VERY_GOOD",
    price: 1350,
    retailPrice: 2900,
    costPrice: 900,
    importCost: 80,
    color: "Beige GG Supreme",
    description: "Sold.",
    includes: ["Dust bag"],
    soldFor: 1250,
    daysToSell: 34,
    soldDaysAgo: 40,
  },
];

// Deterministic pseudo-random numbers, so every re-seed produces the same demo.
// mulberry32: small, fast, and stays inside 32-bit integer maths.
let state = 7;
function rand() {
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
let counter = 0;
const id = () => `demo${(counter++).toString(36).padStart(6, "0")}${Math.floor(rand() * 1e9).toString(36)}`;

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "owner@honcharcollective.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "collective1234";

  const existingUsers = await prisma.user.count();
  if (existingUsers === 0) {
    await prisma.user.create({
      data: {
        name: "Honchar Collective Owner",
        email,
        role: "OWNER",
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
    console.log(`Created owner account: ${email} / ${password}`);
  } else {
    console.log("Users already exist — skipping account creation.");
  }

  await prisma.contactTap.deleteMany({});
  await prisma.pageView.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.item.deleteMany({});

  const DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();

  let sku = 1000;
  const live: { id: string; slug: string; featured: boolean; name: string }[] = [];

  for (const [index, item] of ITEMS.entries()) {
    const { arrivesInDays, ...rest } = item;
    const status = item.status ?? "PUBLISHED";
    // Stagger listing dates so days-on-market and "longest listed" have
    // something realistic to report.
    const listedAt = status === "PUBLISHED" ? new Date(now - (2 + index * 3) * DAY) : null;

    const created = await prisma.item.create({
      data: {
        ...rest,
        slug: slugify(`${item.brand} ${item.name} ${item.color ?? ""}`),
        sku: `HC-${sku++}`,
        serialNumber: item.category === "Handbags" ? `SD${4100 + index}` : null,
        authenticated: status === "PUBLISHED",
        status,
        arrival: arrivesInDays ? "IN_TRANSIT" : "IN_DR",
        arrivesAt: arrivesInDays ? new Date(now + arrivesInDays * DAY) : null,
        listedAt,
        originalPrice: listedAt ? (item.previousPrice ?? item.price) : null,
        createdAt: listedAt ?? new Date(),
      },
    });
    if (status === "PUBLISHED") {
      live.push({ id: created.id, slug: created.slug, featured: !!item.featured, name: item.name });
    }
  }

  for (const sale of SOLD) {
    const { soldFor, daysToSell, soldDaysAgo, arrivesInDays: _unused, ...rest } = sale;
    void _unused;
    const soldAt = new Date(now - soldDaysAgo * DAY);
    const listedAt = new Date(soldAt.getTime() - daysToSell * DAY);
    await prisma.item.create({
      data: {
        ...rest,
        slug: slugify(`${sale.brand} ${sale.name} sold`),
        sku: `HC-${sku++}`,
        authenticated: true,
        status: "SOLD",
        listedAt,
        originalPrice: sale.price,
        soldAt,
        soldPrice: soldFor,
        createdAt: listedAt,
      },
    });
  }

  // --- Demo traffic ---------------------------------------------------------
  // Sixty days of visits, so the metrics page has sources, per-piece views,
  // and a previous period to compare against. Featured pieces get more
  // attention, the way they would on the real homepage.
  const SOURCES = ["Instagram", "Instagram", "Instagram", "WhatsApp", "Google", "Direct", "Facebook", "TikTok"];
  const PAGES = ["/", "/shop", "/shop?category=Handbags", "/layaway", "/request", "/about"];
  const views: {
    id: string;
    sessionId: string;
    path: string;
    itemId: string | null;
    dwellMs: number;
    source: string;
    createdAt: Date;
  }[] = [];
  const taps: { id: string; sessionId: string; path: string; itemId: string | null; channel: string; source: string; createdAt: Date }[] = [];

  for (let day = 59; day >= 0; day--) {
    // Gently rising traffic: the business is growing.
    const sessions = Math.round(14 + (59 - day) * 0.35 + rand() * 8);
    for (let s = 0; s < sessions; s++) {
      const sessionId = id();
      const source = pick(SOURCES);
      const start = now - day * DAY - Math.floor(rand() * DAY * 0.9);
      const pages = 1 + Math.floor(rand() * 5);
      for (let p = 0; p < pages; p++) {
        const weighted = live.flatMap((entry) => (entry.featured ? [entry, entry, entry] : [entry]));
        const onItem = rand() < 0.6 && weighted.length > 0;
        const target = onItem ? pick(weighted) : null;
        const createdAt = new Date(start + p * 70_000);
        views.push({
          id: id(),
          sessionId,
          path: target ? `/shop/${target.slug}` : pick(PAGES),
          itemId: target?.id ?? null,
          dwellMs: Math.round(15_000 + rand() * 150_000),
          source,
          createdAt,
        });
        if (target && rand() < 0.06) {
          taps.push({
            id: id(),
            sessionId,
            path: `/shop/${target.slug}`,
            itemId: target.id,
            channel: "whatsapp",
            source,
            createdAt,
          });
        }
      }
    }
  }
  await prisma.pageView.createMany({ data: views });
  await prisma.contactTap.createMany({ data: taps });

  const NAMES = ["Yeimy Rosario", "Carlos Peña", "Massiel Báez", "Luis Almonte", "Paola Jiménez", "Rafael Núñez", "Nicole Ureña"];
  const leadData = live.slice(0, 7).map((entry, index) => ({
    name: NAMES[index],
    phone: `809-555-01${String(20 + index)}`,
    email: index % 2 === 0 ? `${NAMES[index].split(" ")[0].toLowerCase()}@example.com` : null,
    message:
      index === 1
        ? "Can I do this one on layaway? 4 payments every two weeks."
        : `Is the ${entry.name} still available? Can you send a video?`,
    type: index === 1 ? ("LAYAWAY" as const) : ("AVAILABILITY" as const),
    status: index < 3 ? ("NEW" as const) : ("CONTACTED" as const),
    itemId: entry.id,
    createdAt: new Date(now - (index * 2 + 1) * DAY),
  }));
  await prisma.lead.createMany({
    data: [
      ...leadData,
      {
        name: "Andrea Castillo",
        phone: "829-555-0188",
        email: null,
        message: "Looking for a Goyard Anjou mini in green or burgundy. Budget around $3,000.",
        type: "SOURCING",
        status: "NEW",
        itemId: null,
        createdAt: new Date(now - 0.5 * DAY),
      },
    ],
  });

  console.log(
    `Seeded ${ITEMS.length + SOLD.length} items, ${views.length} page views, ${taps.length} WhatsApp taps, ${leadData.length + 1} leads.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
