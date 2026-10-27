import { z } from "zod";

// Most customers in the DR live on WhatsApp, so a phone number alone is a
// complete enquiry. Either contact route will do; neither is not enough.
export const leadSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(120),
    email: z
      .string()
      .trim()
      .max(200)
      .optional()
      .transform((value) => (value ? value : undefined))
      .refine(
        (value) => value === undefined || z.email().safeParse(value).success,
        "Enter a valid email address",
      ),
    phone: z
      .string()
      .trim()
      .max(40)
      .optional()
      .transform((value) => (value ? value : undefined)),
    message: z.string().trim().max(2000).optional(),
    itemId: z.string().trim().optional(),
    type: z.enum(["AVAILABILITY", "LAYAWAY", "SOURCING", "GENERAL"]).default("AVAILABILITY"),
  })
  .refine((lead) => lead.email || lead.phone, {
    message: "Leave a WhatsApp number or an email so we can reply",
    path: ["phone"],
  });

export type LeadInput = z.infer<typeof leadSchema>;

const optionalInt = (max = 100_000_000) =>
  z
    .union([z.string(), z.number(), z.null()])
    .optional()
    .transform((value) => {
      if (value === null || value === undefined || value === "") return null;
      const parsed = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));
      return Number.isFinite(parsed) ? Math.round(parsed) : null;
    })
    .refine((value) => value === null || (value >= 0 && value <= max), "Value is out of range");

const optionalText = (max = 200) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : null));

export const itemSchema = z.object({
  brand: z.string().trim().min(1, "Brand is required").max(60),
  name: z.string().trim().min(1, "Name is required").max(120),
  category: z.string().trim().min(1, "Category is required").max(60),
  gender: optionalText(20),
  condition: z.enum(["NEW", "EXCELLENT", "VERY_GOOD", "GOOD", "FAIR"]).default("EXCELLENT"),

  price: z.coerce.number().int().min(1, "Price is required").max(10_000_000),
  retailPrice: optionalInt(),
  /** What it actually went for. Staff-only; never sent to a shopper's browser. */
  soldPrice: optionalInt(),
  /** Landed cost. Staff-only, like soldPrice. */
  costPrice: optionalInt(),
  importCost: optionalInt(),

  sku: optionalText(40),
  serialNumber: optionalText(60),

  size: optionalText(40),
  color: optionalText(60),
  material: optionalText(80),
  hardware: optionalText(40),
  year: optionalInt(new Date().getFullYear() + 1),

  authenticated: z.coerce.boolean().default(false),
  authenticationNote: optionalText(400),

  description: z.string().trim().max(6000).optional().transform((value) => value || null),
  includes: z.array(z.string().trim().max(60)).max(30).default([]),

  arrival: z.enum(["IN_DR", "IN_TRANSIT"]).default("IN_DR"),
  arrivesAt: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value) return null;
      const date = new Date(`${value}T12:00:00`);
      return Number.isNaN(date.getTime()) ? null : date;
    }),

  status: z.enum(["DRAFT", "PUBLISHED", "SOLD"]).default("PUBLISHED"),
  featured: z.coerce.boolean().default(false),

  images: z
    .array(z.object({ url: z.string().trim().min(1).max(2000), alt: z.string().trim().max(200).optional() }))
    .max(30)
    .default([]),
});

export type ItemInput = z.infer<typeof itemSchema>;

export const userSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  role: z.enum(["OWNER", "STAFF"]).default("STAFF"),
});
