import { forwardRef } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

// ---- Field wrapper ----
interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: "#374151",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {hint && (
        <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>
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
          padding: "9px 12px",
          border: `1px solid ${hasError ? "#fca5a5" : "#e5e7eb"}`,
          borderRadius: 8,
          fontSize: 14,
          color: "#111827",
          background: hasError ? "#fff7f7" : "white",
          outline: "none",
          transition: "border-color 0.15s",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = hasError ? "#ef4444" : "#111827";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = hasError ? "#fca5a5" : "#e5e7eb";
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
          padding: "9px 12px",
          border: `1px solid ${hasError ? "#fca5a5" : "#e5e7eb"}`,
          borderRadius: 8,
          fontSize: 14,
          color: "#111827",
          background: hasError ? "#fff7f7" : "white",
          outline: "none",
          resize: "vertical",
          transition: "border-color 0.15s",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = hasError ? "#ef4444" : "#111827";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = hasError ? "#fca5a5" : "#e5e7eb";
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
          padding: "9px 12px",
          border: `1px solid ${hasError ? "#fca5a5" : "#e5e7eb"}`,
          borderRadius: 8,
          fontSize: 14,
          color: "#111827",
          background: "white",
          outline: "none",
          cursor: "pointer",
          appearance: "auto",
          ...style,
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
    <div style={{ marginBottom: "1.75rem" }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#9ca3af",
          marginBottom: 4,
        }}
      >
        Step {step} of 7
      </p>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111827" }}>
        {title}
      </h2>
      <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
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

export function NavButtons({
  onNext,
  onBack,
  nextLabel = "Continue →",
  loading,
}: NavButtonsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginTop: "2rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #f3f4f6",
      }}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "9px 20px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            color: "#6b7280",
            background: "white",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          style={{
            padding: "9px 24px",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            color: "white",
            background: loading ? "#9ca3af" : "#111827",
            cursor: loading ? "not-allowed" : "pointer",
            marginLeft: onBack ? "auto" : undefined,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {loading ? "Please wait…" : nextLabel}
        </button>
      )}
    </div>
  );
}

// ---- Section divider ----
export function SectionDivider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "1.5rem 0 1.25rem",
      }}
    >
      <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
      <span style={{ fontSize: 11, color: "#d1d5db", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
    </div>
  );
}
