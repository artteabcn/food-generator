import { useFormContext } from "react-hook-form";
import type { SiteFormData } from "@/lib/validations/site";
import { THEMES } from "@/lib/themes";
import { StepHeader, NavButtons } from "./shared";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step6Theme({ onNext, onBack }: Props) {
  const { setValue, watch } = useFormContext<SiteFormData>();
  const selectedTheme = watch("theme");

  return (
    <div>
      <StepHeader
        step={6}
        title="Choose a Theme"
        subtitle="Select the visual identity for the restaurant site. All themes are fully responsive."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: "1.5rem",
        }}
      >
        {THEMES.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() =>
                setValue("theme", theme.id as SiteFormData["theme"])
              }
              style={{
                textAlign: "left",
                border: `2px solid ${isSelected ? "#111827" : "#e5e7eb"}`,
                borderRadius: 12,
                padding: 0,
                cursor: "pointer",
                background: "white",
                overflow: "hidden",
                transition: "border-color 0.15s, box-shadow 0.15s",
                boxShadow: isSelected
                  ? "0 0 0 3px rgba(17,24,39,0.1)"
                  : "none",
              }}
            >
              {/* Color swatch bar */}
              <div
                style={{
                  display: "flex",
                  height: 48,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    flex: 2,
                    background: theme.preview.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: theme.fonts.display,
                      color: theme.preview.text,
                      fontStyle: "italic",
                    }}
                  >
                    Aa
                  </span>
                </div>
                <div style={{ flex: 1, background: theme.preview.accent }} />
                <div
                  style={{ flex: 1, background: theme.preview.secondary }}
                />
              </div>

              {/* Theme info */}
              <div style={{ padding: "12px 14px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {theme.name}
                  </span>
                  {isSelected && (
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        background: "#111827",
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <polyline
                          points="2,5 4,7 8,3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.4 }}>
                  {theme.description}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "#9ca3af",
                    marginTop: 6,
                    fontStyle: "italic",
                  }}
                >
                  {theme.fonts.display.replace(/'/g, "").split(",")[0]} /{" "}
                  {theme.fonts.body.replace(/'/g, "").split(",")[0]}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected preview */}
      {selectedTheme && (
        <div
          style={{
            padding: "1rem 1.25rem",
            background: "#f9fafb",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            marginBottom: "0.5rem",
          }}
        >
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
            Selected theme
          </p>
          <p style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
            {THEMES.find((t) => t.id === selectedTheme)?.name}
          </p>
        </div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}
