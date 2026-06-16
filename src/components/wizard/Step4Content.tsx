import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { SiteFormData } from "@/lib/validations/site";
import { StepHeader, Field, Input, Textarea, NavButtons, SectionDivider } from "./shared";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

type Locale = "en" | "fr" | "th";

const LOCALE_LABELS: Record<Locale, string> = { en: "🇬🇧 English", fr: "🇫🇷 Français", th: "🇹🇭 ภาษาไทย" };

export default function Step4Content({ onNext, onBack }: Props) {
  const { register, trigger, watch, formState: { errors } } = useFormContext<SiteFormData>();
  const [locale, setLocale] = useState<Locale>("en");

  const enValues = {
    heroEyebrow: watch("heroEyebrow"),
    heroTitle: watch("heroTitle"),
    heroSubtitle: watch("heroSubtitle"),
    aboutTitle: watch("aboutTitle"),
    aboutPullquote: watch("aboutPullquote"),
    aboutBody: watch("aboutBody"),
    menuIntro: watch("menuIntro"),
    footerTagline: watch("footerTagline"),
    footerAddressShort: watch("footerAddressShort"),
    footerHoursShort: watch("footerHoursShort"),
  };

  async function handleNext() {
    const valid = await trigger([
      "heroTitle", "heroSubtitle", "heroEyebrow", "aboutTitle",
      "aboutPullquote", "aboutBody", "menuIntro", "footerTagline",
      "footerAddressShort", "footerHoursShort",
    ]);
    if (valid) onNext();
  }

  const isEn = locale === "en";

  return (
    <div>
      <StepHeader
        step={4}
        title="Content & Translations"
        subtitle="Write the English copy first, then add French and Thai translations."
      />

      {/* Locale tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", padding: "4px", background: "#f1f5f9", borderRadius: 10 }}>
        {(["en", "fr", "th"] as Locale[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            style={{
              flex: 1,
              padding: "7px 12px",
              borderRadius: 7,
              border: "none",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              background: locale === l ? "white" : "transparent",
              color: locale === l ? "#0f172a" : "#64748b",
              boxShadow: locale === l ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.15s",
            }}
          >
            {LOCALE_LABELS[l]}
            {l === "en" && <span style={{ marginLeft: 5, fontSize: 10, color: "#ef4444", fontWeight: 700 }}>*</span>}
          </button>
        ))}
      </div>

      {/* Translation hint */}
      {!isEn && (
        <div style={{ padding: "10px 14px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, marginBottom: "1.25rem", fontSize: 12, color: "#92400e" }}>
          Leave any field blank to use the English version on the live site.
        </div>
      )}

      <SectionDivider label="Hero section" />

      <Field
        label="Hero Eyebrow"
        error={isEn ? errors.heroEyebrow?.message : undefined}
        hint={isEn ? 'Small text above the title (e.g. "Bangkok · Silom · 2024")' : undefined}
      >
        {isEn ? (
          <Input {...register("heroEyebrow")} placeholder="Bangkok · Silom · Est. 2024" hasError={!!errors.heroEyebrow} />
        ) : (
          <TranslationInput register={register} name={`translations.${locale}.heroEyebrow`} reference={enValues.heroEyebrow} />
        )}
      </Field>

      <Field
        label="Hero Title"
        error={isEn ? errors.heroTitle?.message : undefined}
        hint={isEn ? "Large display title — usually the restaurant name in italic" : undefined}
      >
        {isEn ? (
          <Input {...register("heroTitle")} placeholder="Le Jardin" hasError={!!errors.heroTitle} />
        ) : (
          <TranslationInput register={register} name={`translations.${locale}.heroTitle`} reference={enValues.heroTitle} />
        )}
      </Field>

      <Field
        label="Hero Subtitle"
        error={isEn ? errors.heroSubtitle?.message : undefined}
        hint={isEn ? "One sentence describing the atmosphere or cuisine" : undefined}
      >
        {isEn ? (
          <Input {...register("heroSubtitle")} placeholder="Contemporary French cuisine in a tranquil garden setting" hasError={!!errors.heroSubtitle} />
        ) : (
          <TranslationInput register={register} name={`translations.${locale}.heroSubtitle`} reference={enValues.heroSubtitle} />
        )}
      </Field>

      <SectionDivider label="About section" />

      <Field label="About Title" error={isEn ? errors.aboutTitle?.message : undefined}>
        {isEn ? (
          <Input {...register("aboutTitle")} placeholder="The room" hasError={!!errors.aboutTitle} />
        ) : (
          <TranslationInput register={register} name={`translations.${locale}.aboutTitle`} reference={enValues.aboutTitle} />
        )}
      </Field>

      <Field label="Pull Quote" error={isEn ? errors.aboutPullquote?.message : undefined} hint={isEn ? "A short evocative sentence displayed in large type" : undefined}>
        {isEn ? (
          <Input {...register("aboutPullquote")} placeholder="Where every plate tells a story of the garden" hasError={!!errors.aboutPullquote} />
        ) : (
          <TranslationInput register={register} name={`translations.${locale}.aboutPullquote`} reference={enValues.aboutPullquote} />
        )}
      </Field>

      <Field label="About Body" error={isEn ? errors.aboutBody?.message : undefined} hint={isEn ? "One or two paragraphs about the restaurant" : undefined}>
        {isEn ? (
          <Textarea {...register("aboutBody")} rows={4} placeholder="Nestled in the heart of Silom…" hasError={!!errors.aboutBody} />
        ) : (
          <TranslationTextarea register={register} name={`translations.${locale}.aboutBody`} reference={enValues.aboutBody} />
        )}
      </Field>

      <SectionDivider label="Menu section" />

      <Field label="Menu Introduction" error={isEn ? errors.menuIntro?.message : undefined}>
        {isEn ? (
          <Textarea {...register("menuIntro")} rows={2} placeholder="A seasonal menu drawn from local farms…" hasError={!!errors.menuIntro} />
        ) : (
          <TranslationTextarea register={register} name={`translations.${locale}.menuIntro`} reference={enValues.menuIntro} />
        )}
      </Field>

      <SectionDivider label="Footer" />

      <Field label="Footer Tagline" error={isEn ? errors.footerTagline?.message : undefined}>
        {isEn ? (
          <Input {...register("footerTagline")} placeholder="Le Jardin · Bangkok" hasError={!!errors.footerTagline} />
        ) : (
          <TranslationInput register={register} name={`translations.${locale}.footerTagline`} reference={enValues.footerTagline} />
        )}
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Short Address" error={isEn ? errors.footerAddressShort?.message : undefined} hint={isEn ? "For footer display" : undefined}>
          {isEn ? (
            <Input {...register("footerAddressShort")} placeholder="Silom Soi 4, Bangkok" hasError={!!errors.footerAddressShort} />
          ) : (
            <TranslationInput register={register} name={`translations.${locale}.footerAddressShort`} reference={enValues.footerAddressShort} />
          )}
        </Field>

        <Field label="Hours Summary" error={isEn ? errors.footerHoursShort?.message : undefined} hint={isEn ? "For footer display" : undefined}>
          {isEn ? (
            <Input {...register("footerHoursShort")} placeholder="Tue – Sun · 18:00 – Midnight" hasError={!!errors.footerHoursShort} />
          ) : (
            <TranslationInput register={register} name={`translations.${locale}.footerHoursShort`} reference={enValues.footerHoursShort} />
          )}
        </Field>
      </div>

      <NavButtons onBack={onBack} onNext={handleNext} />
    </div>
  );
}

// Helper components for translation inputs with EN reference hint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TranslationInput({ register, name, reference }: { register: any; name: string; reference?: string }) {
  return (
    <div>
      <input
        {...register(name)}
        style={{
          width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8,
          fontSize: 14, color: "#0f172a", background: "white", outline: "none",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
      />
      {reference && (
        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, fontStyle: "italic", lineHeight: 1.4 }}>
          EN: {reference}
        </p>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TranslationTextarea({ register, name, reference }: { register: any; name: string; reference?: string }) {
  return (
    <div>
      <textarea
        {...register(name)}
        rows={4}
        style={{
          width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8,
          fontSize: 14, color: "#0f172a", background: "white", outline: "none", resize: "vertical",
          fontFamily: "inherit", lineHeight: 1.5,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
      />
      {reference && (
        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, fontStyle: "italic", lineHeight: 1.4 }}>
          EN: {reference}
        </p>
      )}
    </div>
  );
}
