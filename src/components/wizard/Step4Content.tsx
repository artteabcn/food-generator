import { useFormContext } from "react-hook-form";
import type { SiteFormData } from "@/lib/validations/site";
import {
  StepHeader,
  Field,
  Input,
  Textarea,
  NavButtons,
  SectionDivider,
} from "./shared";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Content({ onNext, onBack }: Props) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<SiteFormData>();

  async function handleNext() {
    const valid = await trigger([
      "heroTitle",
      "heroSubtitle",
      "heroEyebrow",
      "aboutTitle",
      "aboutPullquote",
      "aboutBody",
      "menuIntro",
      "footerTagline",
      "footerAddressShort",
      "footerHoursShort",
    ]);
    if (valid) onNext();
  }

  return (
    <div>
      <StepHeader
        step={4}
        title="Content"
        subtitle="English copy for the site. French and Thai can be updated in the repo later."
      />

      <SectionDivider label="Hero section" />

      <Field
        label="Hero Eyebrow"
        error={errors.heroEyebrow?.message}
        hint='Small text above the title (e.g. "Bangkok · Silom · 2024")'
      >
        <Input
          {...register("heroEyebrow")}
          placeholder="Bangkok · Silom · Est. 2024"
          hasError={!!errors.heroEyebrow}
        />
      </Field>

      <Field
        label="Hero Title"
        error={errors.heroTitle?.message}
        hint="Large display title — usually the restaurant name in italic"
      >
        <Input
          {...register("heroTitle")}
          placeholder="Le Jardin"
          hasError={!!errors.heroTitle}
        />
      </Field>

      <Field
        label="Hero Subtitle"
        error={errors.heroSubtitle?.message}
        hint="One sentence describing the atmosphere or cuisine"
      >
        <Input
          {...register("heroSubtitle")}
          placeholder="Contemporary French cuisine in a tranquil garden setting"
          hasError={!!errors.heroSubtitle}
        />
      </Field>

      <SectionDivider label="About section" />

      <Field label="About Title" error={errors.aboutTitle?.message}>
        <Input
          {...register("aboutTitle")}
          placeholder="The room"
          hasError={!!errors.aboutTitle}
        />
      </Field>

      <Field
        label="Pull Quote"
        error={errors.aboutPullquote?.message}
        hint="A short evocative sentence displayed in large type"
      >
        <Input
          {...register("aboutPullquote")}
          placeholder="Where every plate tells a story of the garden"
          hasError={!!errors.aboutPullquote}
        />
      </Field>

      <Field
        label="About Body"
        error={errors.aboutBody?.message}
        hint="One or two paragraphs about the restaurant"
      >
        <Textarea
          {...register("aboutBody")}
          rows={4}
          placeholder="Nestled in the heart of Silom, Le Jardin is a contemporary French restaurant where the spirit of a Parisian garden meets the warmth of Bangkok..."
          hasError={!!errors.aboutBody}
        />
      </Field>

      <SectionDivider label="Menu section" />

      <Field
        label="Menu Introduction"
        error={errors.menuIntro?.message}
        hint="One sentence that introduces the menu philosophy"
      >
        <Textarea
          {...register("menuIntro")}
          rows={2}
          placeholder="A seasonal menu drawn from local farms and artisan producers, reinterpreted through a French lens."
          hasError={!!errors.menuIntro}
        />
      </Field>

      <SectionDivider label="Footer" />

      <Field label="Footer Tagline" error={errors.footerTagline?.message}>
        <Input
          {...register("footerTagline")}
          placeholder="Le Jardin · Bangkok"
          hasError={!!errors.footerTagline}
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field
          label="Short Address"
          error={errors.footerAddressShort?.message}
          hint="For footer display"
        >
          <Input
            {...register("footerAddressShort")}
            placeholder="Silom Soi 4, Bangkok"
            hasError={!!errors.footerAddressShort}
          />
        </Field>

        <Field
          label="Hours Summary"
          error={errors.footerHoursShort?.message}
          hint="For footer display"
        >
          <Input
            {...register("footerHoursShort")}
            placeholder="Tue – Sun · 18:00 – Midnight"
            hasError={!!errors.footerHoursShort}
          />
        </Field>
      </div>

      <NavButtons onBack={onBack} onNext={handleNext} />
    </div>
  );
}
