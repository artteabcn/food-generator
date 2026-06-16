import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { SiteFormData } from "@/lib/validations/site";
import { THEMES } from "@/lib/themes";
import { StepHeader, NavButtons } from "./shared";

interface Props {
  onNext: () => void;
  onBack: () => void;
  stepNumber?: number;
}

const EASE = "cubic-bezier(0.32,0.72,0,1)";
const ACCEPT = "image/svg+xml,image/png,image/jpeg,image/webp";
const MAX_BYTES = 2 * 1024 * 1024;

function buildAutoSvg(name: string, accent: string): string {
  const initial = (name.trim().split(/\s+/)[0]?.[0] ?? "R").toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="10" fill="${accent}"/><text x="40" y="56" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="44" fill="rgba(255,255,255,0.92)">${initial}</text></svg>`;
}

export default function StepLogo({ onNext, onBack, stepNumber = 7 }: Props) {
  const { setValue, watch } = useFormContext<SiteFormData>();
  const logo = watch("logo");
  const name = watch("name") || "Restaurant";
  const themeId = watch("theme");

  const theme = THEMES.find((t) => t.id === themeId);
  const accent = theme?.preview.accent ?? "#374151";
  const autoSvg = buildAutoSvg(name, accent);
  const autoSvgUrl = `data:image/svg+xml,${encodeURIComponent(autoSvg)}`;

  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function processFile(file: File) {
    setError(null);
    if (!ACCEPT.split(",").includes(file.type)) {
      setError("Unsupported format. Please use SVG, PNG, JPG or WEBP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File exceeds 2 MB. Please compress or resize your logo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setValue("logo", { data: dataUrl.split(",")[1], mimeType: file.type, name: file.name });
      setPreviewUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setValue("logo", undefined);
    setPreviewUrl(null);
    setError(null);
  }

  return (
    <div>
      <StepHeader
        step={stepNumber}
        title="Logo"
        subtitle="Upload your logo, or skip — we'll auto-generate a clean one from your restaurant name and theme."
      />

      {/* ── Upload zone (hidden once a logo is uploaded) ── */}
      {!logo && (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) processFile(file);
            }}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? "#0f172a" : "rgba(0,0,0,0.1)"}`,
              borderRadius: 14,
              padding: "2.25rem 1.5rem",
              textAlign: "center",
              cursor: "pointer",
              background: isDragging ? "#f0efec" : "white",
              transition: `all 0.2s ${EASE}`,
              marginBottom: error ? "0.75rem" : "1.5rem",
            }}
          >
            <div style={{ width: 44, height: 44, background: "#f8f7f4", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 4, letterSpacing: "-0.01em" }}>
              Drop your logo here, or click to browse
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>SVG · PNG · JPG · WEBP &nbsp;·&nbsp; Max 2 MB</p>
            <input ref={fileRef} type="file" accept={ACCEPT} style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file);
                e.target.value = "";
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: 12, color: "#ef4444", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </p>
          )}
        </>
      )}

      {/* ── Uploaded logo preview ── */}
      {logo && previewUrl && (
        <div style={{ marginBottom: "1.25rem", padding: "1.125rem 1.25rem", background: "#f8f7f4", borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", background: "white", border: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src={previewUrl} alt="Logo preview" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.015em", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {logo.name}
            </p>
            <p style={{ fontSize: 12, color: "#64748b" }}>
              {logo.mimeType === "image/svg+xml" ? "SVG" : logo.mimeType.split("/")[1]?.toUpperCase()}
            </p>
          </div>
          <button
            type="button"
            onClick={removeLogo}
            style={{ padding: "6px 14px", border: "1.5px solid rgba(0,0,0,0.1)", borderRadius: 100, fontSize: 12, fontWeight: 600, color: "#64748b", background: "white", cursor: "pointer", transition: `all 0.2s ${EASE}`, flexShrink: 0 }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)"; e.currentTarget.style.color = "#0f172a"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.color = "#64748b"; }}
          >
            Remove
          </button>
        </div>
      )}

      {/* ── Auto-generate preview ── */}
      <div style={{ padding: "1.125rem 1.25rem", background: "#f8f7f4", borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: 56, height: 56, borderRadius: 9, overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}>
          <img src={autoSvgUrl} alt="Auto-generated logo preview" style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em", marginBottom: 3 }}>
            {logo ? "Auto-generated fallback" : "Auto-generated logo preview"}
          </p>
          <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55 }}>
            {logo
              ? "Shown if your logo fails to load."
              : `Built from "${name[0]?.toUpperCase() ?? "R"}" using your ${theme?.name ?? "selected"} theme. Upload above to override.`}
          </p>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel={logo ? "Continue" : "Skip & auto-generate"} />
    </div>
  );
}
