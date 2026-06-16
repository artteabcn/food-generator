import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { SiteFormData } from "@/lib/validations/site";
import { StepHeader, Field, Input, Textarea, NavButtons } from "./shared";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

function parseMapsUrl(url: string): { lat: number; lng: number } | null {
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  const llMatch = url.match(/ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  return null;
}

const SOCIAL_OPTIONS = [
  { value: "none", label: "None" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
] as const;

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
  const socialType = watch("socialType") ?? "none";

  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState("");

  async function handleMapsUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    setValue("mapsUrl", url);
    setResolveError("");

    // Try parsing directly first (works for full URLs with @lat,lng)
    const parsed = parseMapsUrl(url);
    if (parsed) {
      setValue("mapsLat", parsed.lat);
      setValue("mapsLng", parsed.lng);
      return;
    }

    // If it looks like a short/redirect URL, resolve server-side
    if (url.startsWith("http") && url.length > 10) {
      setResolving(true);
      try {
        const res = await fetch("/api/resolve-maps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json() as { lat?: number; lng?: number; error?: string };
        if (data.lat && data.lng) {
          setValue("mapsLat", data.lat);
          setValue("mapsLng", data.lng);
        } else {
          setResolveError("Couldn't extract coordinates — try a full Google Maps URL or enter lat/lng manually");
        }
      } catch {
        setResolveError("Failed to resolve URL — enter coordinates manually");
      } finally {
        setResolving(false);
      }
    }
  }

  async function handleNext() {
    const fields: (keyof SiteFormData)[] = [
      "whatsapp",
      "whatsappDisplay",
      "address",
      "mapsLat",
      "mapsLng",
    ];
    if (socialType !== "none") {
      fields.push("socialHandle", "socialUrl");
    }
    const valid = await trigger(fields);
    if (valid) onNext();
  }

  const coordsSet = mapsLat !== 13.7563 || mapsLng !== 100.5018 || mapsUrl;

  const socialPlaceholders = {
    instagram: { handle: "@lejardin.bkk", url: "https://instagram.com/lejardin.bkk" },
    facebook: { handle: "Le Jardin Bangkok", url: "https://facebook.com/lejardinbkk" },
    none: { handle: "", url: "" },
  };
  const ph = socialPlaceholders[socialType as keyof typeof socialPlaceholders] ?? socialPlaceholders.none;

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
        <Field label="WhatsApp Display" error={errors.whatsappDisplay?.message} hint="Formatted for display">
          <Input
            {...register("whatsappDisplay")}
            placeholder="+66 81 234 5678"
            hasError={!!errors.whatsappDisplay}
          />
        </Field>
      </div>

      {/* Social media choice */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 8 }}>
          Social Media
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {SOCIAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setValue("socialType", opt.value);
                if (opt.value === "none") {
                  setValue("socialHandle", "");
                  setValue("socialUrl", "");
                }
              }}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: `2px solid ${socialType === opt.value ? "#111827" : "#e5e7eb"}`,
                background: socialType === opt.value ? "#111827" : "white",
                color: socialType === opt.value ? "white" : "#6b7280",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {socialType !== "none" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field
            label={`${socialType === "instagram" ? "Instagram" : "Facebook"} Handle`}
            error={errors.socialHandle?.message}
          >
            <Input
              {...register("socialHandle")}
              placeholder={ph.handle}
              hasError={!!errors.socialHandle}
            />
          </Field>
          <Field
            label={`${socialType === "instagram" ? "Instagram" : "Facebook"} URL`}
            error={errors.socialUrl?.message}
          >
            <Input
              {...register("socialUrl")}
              placeholder={ph.url}
              hasError={!!errors.socialUrl}
            />
          </Field>
        </div>
      )}

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
        hint="Paste any Google Maps link including short links (maps.app.goo.gl/…) — coordinates extracted automatically"
      >
        <Input
          value={mapsUrl ?? ""}
          onChange={handleMapsUrlChange}
          placeholder="https://maps.app.goo.gl/… or https://maps.google.com/…"
        />
      </Field>

      {resolveError && (
        <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 12, marginTop: -8 }}>{resolveError}</p>
      )}

      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "10px 14px",
          background: resolving ? "#fffbeb" : coordsSet ? "#f0fdf4" : "#f9fafb",
          border: `1px solid ${resolving ? "#fde68a" : coordsSet ? "#bbf7d0" : "#e5e7eb"}`,
          borderRadius: 8,
          marginBottom: "1.25rem",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12, color: resolving ? "#92400e" : coordsSet ? "#166534" : "#9ca3af", fontWeight: 500 }}>
          {resolving ? "⏳ Resolving URL…" : coordsSet ? "✓ Coordinates detected" : "Coordinates"}
        </span>
        <span style={{ fontSize: 12, color: "#6b7280", marginLeft: "auto" }}>
          Lat: <strong>{mapsLat?.toFixed(6)}</strong> &nbsp; Lng: <strong>{mapsLng?.toFixed(6)}</strong>
        </span>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>(edit below if needed)</span>
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
