import { z } from "zod";

const DaySchema = z
  .object({
    open: z.string(),
    close: z.string(),
  })
  .nullable();

export const SiteFormSchema = z.object({
  // Step 1 — Basic
  name: z.string().min(1, "Restaurant name required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, hyphens"),
  tagline: z.string().min(1, "Tagline required"),
  locationEyebrow: z
    .string()
    .min(1, "Location required (e.g. Bangkok · Silom)"),
  timezone: z.string().default("Asia/Bangkok"),
  defaultLocale: z.enum(["en", "fr", "th"]).default("en"),

  // Step 2 — Contact
  whatsapp: z.string().min(1, "WhatsApp number required"),
  whatsappDisplay: z.string().min(1, "WhatsApp display number required"),
  instagram: z.string().min(1, "Instagram handle required"),
  instagramUrl: z.string().url("Must be a valid URL"),
  address: z.string().min(1, "Address required"),
  mapsUrl: z.string().url("Paste a Google Maps URL").optional(),
  mapsLat: z.number(),
  mapsLng: z.number(),

  // Step 3 — Hours
  hours: z.object({
    monday: DaySchema,
    tuesday: DaySchema,
    wednesday: DaySchema,
    thursday: DaySchema,
    friday: DaySchema,
    saturday: DaySchema,
    sunday: DaySchema,
  }),

  // Step 4 — Content (EN only, stored in i18n/en.json)
  heroTitle: z.string().min(1, "Hero title required"),
  heroSubtitle: z.string().min(1, "Hero subtitle required"),
  heroEyebrow: z.string().min(1, "Hero eyebrow required"),
  aboutTitle: z.string().default("The room"),
  aboutPullquote: z.string().min(1, "Pull quote required"),
  aboutBody: z.string().min(1, "About body text required"),
  menuIntro: z.string().min(1, "Menu intro required"),
  footerTagline: z.string().min(1, "Footer tagline required"),
  footerAddressShort: z.string().min(1, "Short address required"),
  footerHoursShort: z.string().min(1, "Hours summary required"),

  // Step 5 — Photos (base64 strings from file upload)
  photos: z
    .array(
      z.object({
        name: z.string(),
        data: z.string(), // base64
        mimeType: z.string(),
      })
    )
    .min(1, "At least 1 photo required")
    .max(6, "Maximum 6 photos"),

  // Step 6 — Theme
  theme: z.enum([
    "baroque-dark",
    "coastal-light",
    "tropical-modern",
    "tokyo-minimal",
    "mediterranean",
    "nordic-forest",
  ]),
});

export type SiteFormData = z.infer<typeof SiteFormSchema>;
