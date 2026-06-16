import { useFormContext } from "react-hook-form";
import type { SiteFormData } from "@/lib/validations/site";
import { StepHeader, Field, Input, Textarea, NavButtons } from "./shared";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

function parseMapsUrl(url: string): { lat: number; lng: number } | null {
  // Pattern: @lat,lng (Google Maps share URLs)
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }
  // Pattern: ?q=lat,lng
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) {
    return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  }
  // Pattern: ll=lat,lng
  const llMatch = url.match(/ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) {
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  }
  return null;
}

export default function Step2Contact({ onNext, onBack }: Props) {
  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<SiteFormData>();

  const mapsLat = watch("mapsLat");
  const mapsLng = watch("mapsLng");
  const mapsUrl = watch("mapsUrl");

  function handleMapsUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    setValue("mapsUrl", url);
    const parsed = parseMapsUrl(url);
    if (parsed) {
      setValue("mapsLat", parsed.lat);
      setValue("mapsLng", parsed.lng);
    }
  }

  async function handleNext() {
    const valid = await trigger([
      "whatsapp",
      "whatsappDisplay",
      "instagram",
      "instagramUrl",
      "address",
      "mapsLat",
      "mapsLng",
    ]);
    if (valid) onNext();
  }

  const coordsSet =
    mapsLat !== 13.7563 || mapsLng !== 100.5018 || mapsUrl;

  return (
    <div>
      <StepHeader
        step={2}
        title="Contact & Location"
        subtitle="How customers will find and reach the restaurant."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="WhatsApp Number" error={errors.whatsapp?.message}>
          <Input
            {...register("whatsapp")}
            placeholder="+66812345678"
            hasError={!!errors.whatsapp}
          />
        </Field>
        <Field
          label="WhatsApp Display"
          error={errors.whatsappDisplay?.message}
          hint="Formatted for display"
        >
          <Input
            {...register("whatsappDisplay")}
            placeholder="+66 81 234 5678"
            hasError={!!errors.whatsappDisplay}
          />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Instagram Handle" error={errors.instagram?.message}>
          <Input
            {...register("instagram")}
            placeholder="@lejardin.bkk"
            hasError={!!errors.instagram}
          />
        </Field>
        <Field label="Instagram URL" error={errors.instagramUrl?.message}>
          <Input
            {...register("instagramUrl")}
            placeholder="https://instagram.com/lejardin.bkk"
            hasError={!!errors.instagramUrl}
          />
        </Field>
      </div>

      <Field label="Full Address" error={errors.address?.message}>
        <Textarea
          {...register("address")}
          rows={2}
          placeholder="12/3 Silom Soi 4, Bang Rak, Bangkok 10500"
          hasError={!!errors.address}
        />
      </Field>

      <Field
        label="Google Maps URL"
        error={errors.mapsUrl?.message}
        hint="Paste any Google Maps share link — coordinates are extracted automatically"
      >
        <Input
          value={mapsUrl ?? ""}
          onChange={handleMapsUrlChange}
          placeholder="https://maps.google.com/?q=13.7563,100.5018"
        />
      </Field>

      {/* Coordinate display */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "10px 14px",
          background: coordsSet ? "#f0fdf4" : "#f9fafb",
          border: `1px solid ${coordsSet ? "#bbf7d0" : "#e5e7eb"}`,
          borderRadius: 8,
          marginBottom: "1.25rem",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: coordsSet ? "#166534" : "#9ca3af",
            fontWeight: 500,
          }}
        >
          {coordsSet ? "✓ Coordinates detected" : "Coordinates"}
        </span>
        <span style={{ fontSize: 12, color: "#6b7280", marginLeft: "auto" }}>
          Lat: <strong>{mapsLat?.toFixed(6)}</strong> &nbsp; Lng:{" "}
          <strong>{mapsLng?.toFixed(6)}</strong>
        </span>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>
          (edit below if needed)
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Latitude" error={errors.mapsLat?.message}>
          <Input
            type="number"
            step="any"
            value={mapsLat ?? ""}
            onChange={(e) => setValue("mapsLat", parseFloat(e.target.value))}
            placeholder="13.7563"
            hasError={!!errors.mapsLat}
          />
        </Field>
        <Field label="Longitude" error={errors.mapsLng?.message}>
          <Input
            type="number"
            step="any"
            value={mapsLng ?? ""}
            onChange={(e) => setValue("mapsLng", parseFloat(e.target.value))}
            placeholder="100.5018"
            hasError={!!errors.mapsLng}
          />
        </Field>
      </div>

      <NavButtons onBack={onBack} onNext={handleNext} />
    </div>
  );
}
