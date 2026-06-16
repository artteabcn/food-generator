import { useFormContext, useWatch } from "react-hook-form";
import type { SiteFormData } from "@/lib/validations/site";
import { StepHeader, NavButtons } from "./shared";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

type DayKey = keyof SiteFormData["hours"];

const DAYS: { key: DayKey; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of ["00", "30"]) {
    TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:${m}`);
  }
}
// Add midnight as 00:00 end alias
TIME_OPTIONS.push("00:00");

function DayRow({ dayKey, label }: { dayKey: DayKey; label: string }) {
  const { setValue } = useFormContext<SiteFormData>();
  const value = useWatch({ name: `hours.${dayKey}` as `hours.${DayKey}` });
  const isOpen = value !== null && value !== undefined;

  function toggleOpen() {
    if (isOpen) {
      setValue(`hours.${dayKey}` as `hours.${DayKey}`, null);
    } else {
      setValue(`hours.${dayKey}` as `hours.${DayKey}`, {
        open: "18:00",
        close: "00:00",
      });
    }
  }

  function setTime(field: "open" | "close", val: string) {
    if (isOpen && value) {
      setValue(`hours.${dayKey}` as `hours.${DayKey}`, {
        ...value,
        [field]: val,
      });
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      {/* Day label */}
      <div style={{ width: 96, fontSize: 14, color: "#374151", fontWeight: 500 }}>
        {label}
      </div>

      {/* Toggle */}
      <button
        type="button"
        onClick={toggleOpen}
        role="switch"
        aria-checked={isOpen}
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          border: "none",
          background: isOpen ? "#111827" : "#e5e7eb",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: isOpen ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "white",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </button>

      {/* Status label */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: isOpen ? "#111827" : "#9ca3af",
          width: 48,
        }}
      >
        {isOpen ? "Open" : "Closed"}
      </span>

      {/* Time selects */}
      {isOpen && value ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
          <select
            value={value.open}
            onChange={(e) => setTime("open", e.target.value)}
            style={{
              padding: "6px 8px",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              fontSize: 13,
              color: "#374151",
              background: "white",
              cursor: "pointer",
              flex: 1,
            }}
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>to</span>
          <select
            value={value.close}
            onChange={(e) => setTime("close", e.target.value)}
            style={{
              padding: "6px 8px",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              fontSize: 13,
              color: "#374151",
              background: "white",
              cursor: "pointer",
              flex: 1,
            }}
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t === "00:00" ? "00:00 (midnight)" : t}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div style={{ flex: 1 }} />
      )}
    </div>
  );
}

export default function Step3Hours({ onNext, onBack }: Props) {
  return (
    <div>
      <StepHeader
        step={3}
        title="Opening Hours"
        subtitle="Toggle each day open or closed, then set the times."
      />

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: "0 1rem",
          marginBottom: "1.25rem",
        }}
      >
        {DAYS.map(({ key, label }) => (
          <DayRow key={key} dayKey={key} label={label} />
        ))}
      </div>

      <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: "1rem" }}>
        Use 00:00 as the close time to indicate midnight.
      </p>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}
