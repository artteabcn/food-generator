import type { SiteFormData } from "@/lib/validations/site";
import { THEMES } from "@/lib/themes";

export function generateSiteConfig(data: SiteFormData): string {
  const theme = THEMES.find((t) => t.id === data.theme)!;
  const photos = data.photos.map((p, i) => {
    const ext = p.mimeType.split("/")[1] || "jpeg";
    return `/images/menu${i + 1}.${ext}`;
  });

  return `import type { SiteConfig } from "./types";

export const siteConfig: SiteConfig = {
  name: ${JSON.stringify(data.name)},
  slug: ${JSON.stringify(data.slug)},
  timezone: ${JSON.stringify(data.timezone)},
  defaultLocale: ${JSON.stringify(data.defaultLocale)},
  theme: ${JSON.stringify(data.theme)},
  fonts: {
    display: ${JSON.stringify(theme.fonts.display)},
    body: ${JSON.stringify(theme.fonts.body)},
    googleFontsUrl: ${JSON.stringify(theme.fonts.googleFontsUrl)},
  },
  contact: {
    whatsapp: ${JSON.stringify(data.whatsapp)},
    whatsappDisplay: ${JSON.stringify(data.whatsappDisplay)},
    socialType: ${JSON.stringify(data.socialType)},
    socialHandle: ${JSON.stringify(data.socialHandle ?? "")},
    socialUrl: ${JSON.stringify(data.socialUrl ?? "")},
    address: ${JSON.stringify(data.address)},
    mapsLat: ${data.mapsLat},
    mapsLng: ${data.mapsLng},
  },
  hours: {
    monday: ${JSON.stringify(data.hours.monday)},
    tuesday: ${JSON.stringify(data.hours.tuesday)},
    wednesday: ${JSON.stringify(data.hours.wednesday)},
    thursday: ${JSON.stringify(data.hours.thursday)},
    friday: ${JSON.stringify(data.hours.friday)},
    saturday: ${JSON.stringify(data.hours.saturday)},
    sunday: ${JSON.stringify(data.hours.sunday)},
  },
  images: {
    menu: ${JSON.stringify(photos)},
  },
};
`;
}

export function generateWorkflow(branch: string): string {
  return `name: Deploy to Cloudflare Pages

on:
  push:
    branches: [${branch}]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm install

      - run: npm run build

      - name: Deploy to Cloudflare Pages
        run: npx wrangler pages deploy dist --project-name=\${{ vars.CF_PROJECT_NAME }} --branch=${branch}
        env:
          CLOUDFLARE_API_TOKEN: \${{ vars.CF_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: \${{ vars.CF_ACCOUNT_ID }}
`;
}

export function generateWranglerToml(data: SiteFormData): string {
  return `name = "${data.slug}"
compatibility_date = "2025-02-13"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./dist"

[[d1_databases]]
binding = "DB"
database_name = "${data.slug}-db"
database_id = "REPLACE_WITH_D1_ID"
migrations_dir = "./migrations"

[vars]
WHATSAPP_TO = "${data.whatsapp}"
RESTAURANT_NAME = "${data.name}"
RESTAURANT_TIMEZONE = "${data.timezone}"
`;
}

export function generateEnJson(data: SiteFormData): string {
  const json = {
    nav: {
      home: "Home",
      menu: "Menu",
      booking: "Reservations",
      contact: "Contact",
    },
    hero: {
      eyebrow: data.heroEyebrow,
      tonight: "Tonight",
      title: data.heroTitle,
      subtitle: data.heroSubtitle,
      cta: "Reserve a table",
      secondaryCta: "View hours",
    },
    about: {
      title: data.aboutTitle,
      pullquote: data.aboutPullquote,
      body: data.aboutBody,
    },
    hours: {
      title: "Hours",
      tonightLabel: "Tonight",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
      closed: "Closed",
      openLabel: "Open this evening",
      closedLabel: "Closed today",
      openNow: "Open now",
      openSubline: "Open tonight",
      openingTonight: "Opening tonight",
      openingSubline: "See hours below",
      closedSubline: "See the week below",
    },
    reservation: { line: "Reserve your table.", cta: "Reserve a table" },
    menu: {
      title: "Menu",
      intro: data.menuIntro,
      comingSoon: "Full menu coming soon.",
      comingSoonSub: "Ask the kitchen about tonight's plates.",
      cta: "Reserve to taste tonight",
    },
    booking: {
      title: "Reserve a table",
      intro: "We confirm every booking by WhatsApp.",
      meta: {
        title: "Reservation note",
        serviceLabel: "Service",
        serviceValue: data.footerHoursShort,
        confirmLabel: "Confirmation",
        confirmValue: "Replied on WhatsApp.",
        directLabel: "Last-minute?",
        directValue: "Reach us directly on WhatsApp.",
      },
      name: "Your name",
      phone: "Phone (with country code)",
      email: "Email (optional)",
      partySize: "Number of guests",
      date: "Date",
      time: "Time",
      notes: "Anything we should know?",
      submit: "Request reservation",
      submitting: "Sending…",
      successTitle: "Thank you.",
      successBody:
        "Your request is in. We'll confirm by WhatsApp shortly.",
      errorTitle: "Something went wrong.",
      errorBody:
        "Please try again, or message us directly on WhatsApp.",
    },
    validation: {
      name: "Please enter your name.",
      phone: "Please enter a valid phone number.",
      email: "Please enter a valid email.",
      partySize: "Party size must be between 1 and 20.",
      date: "Please choose a date.",
      time: "Please choose a time.",
    },
    contact: {
      title: "Find us",
      addressLabel: "Address",
      address: data.address,
      whatsappLabel: "WhatsApp",
      directions: "Open in Google Maps",
    },
    social: {
      title: "Latest from the room",
      follow: data.socialHandle ? `Follow us · ${data.socialHandle}` : "Follow us",
    },
    footer: {
      tagline: data.footerTagline,
      rights: "All rights reserved.",
      addressShort: data.footerAddressShort,
      hoursShort: data.footerHoursShort,
    },
  };
  return JSON.stringify(json, null, 2);
}
