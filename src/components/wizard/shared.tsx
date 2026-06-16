import { forwardRef } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const EASE = "cubic-bezier(0.32,0.72,0,1)";

// ---- Field wrapper ----
interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <div style={{ marginBottom: "1.375rem" }}>
      <label style={{
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "#1e293b",
        marginBottom: hint ? 4 : 6,
        letterSpacing: "-0.005em",
        lineHeight: 1.3,
      }}>
        {label}
      </label>
      {hint && (
        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 7, lineHeight: 1.55, fontWeight: 400 }}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ---- Input ----
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ hasError, style, ...props }, ref) {
    return (
      <input
        ref={ref}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: `1.5px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
          borderRadius: 10,
          fontSize: 14,
          color: "#0f172a",
          background: hasError ? "#fff8f8" : "white",
          outline: "none",
          transition: `border-color 0.2s ${EASE}, box-shadow 0.2s ${EASE}`,
          fontFamily: "inherit",
          letterSpacing: "-0.005em",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = hasError ? "#ef4444" : "#0f172a";
          e.currentTarget.style.boxShadow = hasError
            ? "0 0 0 3px rgba(239,68,68,0.1)"
            : "0 0 0 3px rgba(15,23,42,0.08)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = hasError ? "#fca5a5" : "#e2e8f0";
          e.currentTarget.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

// ---- Textarea ----
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ hasError, style, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={4}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: `1.5px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
          borderRadius: 10,
          fontSize: 14,
          color: "#0f172a",
          background: hasError ? "#fff8f8" : "white",
          outline: "none",
          resize: "vertical",
          transition: `border-color 0.2s ${EASE}, box-shadow 0.2s ${EASE}`,
          fontFamily: "inherit",
          lineHeight: 1.6,
          letterSpacing: "-0.005em",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = hasError ? "#ef4444" : "#0f172a";
          e.currentTarget.style.boxShadow = hasError
            ? "0 0 0 3px rgba(239,68,68,0.1)"
            : "0 0 0 3px rgba(15,23,42,0.08)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = hasError ? "#fca5a5" : "#e2e8f0";
          e.currentTarget.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

// ---- Select ----
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ hasError, style, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: `1.5px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
          borderRadius: 10,
          fontSize: 14,
          color: "#0f172a",
          background: "white",
          outline: "none",
          cursor: "pointer",
          appearance: "auto",
          fontFamily: "inherit",
          letterSpacing: "-0.005em",
          transition: `border-color 0.2s ${EASE}, box-shadow 0.2s ${EASE}`,
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#0f172a";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,23,42,0.08)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = hasError ? "#fca5a5" : "#e2e8f0";
          e.currentTarget.style.boxShadow = "none";
        }}
        {...props}
      >
        {children}
      </select>
    );
  }
);

// ---- Step header ----
interface StepHeaderProps {
  step: number;
  title: string;
  subtitle: string;
}

export function StepHeader({ step, title, subtitle }: StepHeaderProps) {
  return (
    <div style={{ marginBottom: "1.875rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "#0f172a",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>{step}</span>
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.035em", lineHeight: 1.15 }}>
          {title}
        </h2>
      </div>
      <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.55, paddingLeft: 39, fontWeight: 400 }}>
        {subtitle}
      </p>
    </div>
  );
}

// ---- Nav buttons ----
interface NavButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  loading?: boolean;
}

export function NavButtons({ onNext, onBack, nextLabel = "Continue", loading }: NavButtonsProps) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9", alignItems: "center" }}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "9px 18px",
            border: "1.5px solid #e2e8f0",
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 600,
            color: "#64748b",
            background: "white",
            cursor: "pointer",
            transition: `all 0.25s ${EASE}`,
            letterSpacing: "-0.01em",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "#94a3b8";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 700,
            color: "white",
            background: loading ? "#94a3b8" : "#0f172a",
            cursor: loading ? "not-allowed" : "pointer",
            marginLeft: onBack ? "auto" : undefined,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            boxShadow: loading ? "none" : "0 2px 8px rgba(15,23,42,0.18)",
            transition: `all 0.25s ${EASE}`,
            letterSpacing: "-0.01em",
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.background = "#1e293b";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 5px 18px rgba(15,23,42,0.22)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = loading ? "#94a3b8" : "#0f172a";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = loading ? "none" : "0 2px 8px rgba(15,23,42,0.18)";
          }}
        >
          {loading ? "Please wait…" : nextLabel}
          {!loading && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

// ---- Section divider ----
export function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "1.625rem 0 1.25rem" }}>
      <div style={{ flex: 1, height: 1, background: "#e9ecef" }} />
      <span style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "#e9ecef" }} />
    </div>
  );
}
