import { useFormContext } from "react-hook-form";
import type { SiteFormData } from "@/lib/validations/site";
import { THEMES } from "@/lib/themes";
import { StepHeader, NavButtons } from "./shared";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const EASE = "cubic-bezier(0.32,0.72,0,1)";

export default function Step6Theme({ onNext, onBack }: Props) {
  const { setValue, watch } = useFormContext<SiteFormData>();
  const selectedTheme = watch("theme");

  const selected = THEMES.find((t) => t.id === selectedTheme);

  return (
    <div>
      <StepHeader
        step={6}
        title="Choose a Theme"
        subtitle="Select the visual identity for the restaurant site. All themes are fully responsive."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.25rem" }}>
        {THEMES.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const p = theme.preview;
          const displayFontName = theme.fonts.display.replace(/'/g, "").split(",")[0];
          const bodyFontName = theme.fonts.body.replace(/'/g, "").split(",")[0];

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setValue("theme", theme.id as SiteFormData["theme"])}
              style={{
                textAlign: "left",
                border: `2px solid ${isSelected ? "#0f172a" : "rgba(0,0,0,0.07)"}`,
                borderRadius: 14,
                padding: 0,
                cursor: "pointer",
                background: "white",
                overflow: "hidden",
                transition: `border-color 0.25s ${EASE}, box-shadow 0.25s ${EASE}, transform 0.25s ${EASE}`,
                boxShadow: isSelected
                  ? "0 0 0 4px rgba(15,23,42,0.09)"
                  : "0 1px 3px rgba(0,0,0,0.04)",
                transform: isSelected ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              {/* Color palette preview */}
              <div style={{ height: 108, position: "relative", overflow: "hidden", background: p.bg }}>
                {/* Right accent strips */}
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 8, background: p.secondary, opacity: 0.55 }} />
                <div style={{ position: "absolute", right: 8, top: 0, bottom: 0, width: 24, background: p.accent }} />

                {/* Text content */}
                <div style={{ padding: "16px 18px", paddingRight: "48px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <p style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: p.accent,
                    marginBottom: 6,
                    opacity: 0.9,
                  }}>
                    {theme.name}
                  </p>
                  <p style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: p.text,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                    fontFamily: `${theme.fonts.display}`,
                    fontStyle: "italic",
                  }}>
                    Aa
                  </p>
                  <p style={{
                    fontSize: 10.5,
                    color: p.text,
                    opacity: 0.45,
                    marginTop: 5,
                    letterSpacing: "0.02em",
                    fontFamily: theme.fonts.body,
                  }}>
                    {displayFontName}
                  </p>
                </div>

                {/* Selected check */}
                {isSelected && (
                  <div style={{
                    position: "absolute", top: 10, right: 40,
                    width: 20, height: 20,
                    background: "#0f172a",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Theme info */}
              <div style={{ padding: "11px 14px 12px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 4 }}>
                  {theme.name}
                </p>
                <p style={{ fontSize: 11.5, color: "#64748b", lineHeight: 1.45, marginBottom: 5 }}>
                  {theme.description}
                </p>
                <p style={{ fontSize: 10.5, color: "#cbd5e1", fontWeight: 500 }}>
                  {displayFontName} · {bodyFontName}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected theme confirmation */}
      {selected && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          background: "#f8f7f4",
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.055)",
          marginBottom: "0.5rem",
        }}>
          <div style={{ display: "flex", gap: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: selected.preview.bg, border: "1px solid rgba(0,0,0,0.08)" }} />
            <div style={{ width: 12, height: 12, borderRadius: 3, background: selected.preview.accent }} />
            <div style={{ width: 12, height: 12, borderRadius: 3, background: selected.preview.secondary }} />
          </div>
          <p style={{ fontSize: 12.5, color: "#374151", fontWeight: 600, letterSpacing: "-0.01em" }}>
            {selected.name}
          </p>
          <span style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 400 }}>selected</span>
        </div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}
