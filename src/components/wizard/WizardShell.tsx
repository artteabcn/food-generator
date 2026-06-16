import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteFormSchema, type SiteFormData } from "@/lib/validations/site";
import Step1Basic from "./Step1Basic";
import Step2Contact from "./Step2Contact";
import Step3Hours from "./Step3Hours";
import Step4Content from "./Step4Content";
import Step5Photos from "./Step5Photos";
import Step6Theme from "./Step6Theme";
import Step7Deploy, { type DeploySuccess } from "./Step7Deploy";

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Contact" },
  { id: 3, label: "Hours" },
  { id: 4, label: "Content" },
  { id: 5, label: "Photos" },
  { id: 6, label: "Theme" },
  { id: 7, label: "Deploy" },
];

const DEFAULT_VALUES: Partial<SiteFormData> = {
  timezone: "Asia/Bangkok",
  defaultLocale: "en",
  theme: "baroque-dark",
  aboutTitle: "The room",
  hours: {
    monday: null,
    tuesday: { open: "18:00", close: "00:00" },
    wednesday: { open: "18:00", close: "00:00" },
    thursday: { open: "18:00", close: "00:00" },
    friday: { open: "18:00", close: "00:00" },
    saturday: { open: "18:00", close: "00:00" },
    sunday: { open: "18:00", close: "00:00" },
  },
  photos: [],
  mapsLat: 13.7563,
  mapsLng: 100.5018,
};

export default function WizardShell() {
  const [step, setStep] = useState(1);
  const [deployResult, setDeployResult] = useState<DeploySuccess | null>(null);

  const methods = useForm<SiteFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(SiteFormSchema) as any,
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  function next() {
    setStep((s) => Math.min(s + 1, 7));
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 1));
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <FormProvider {...methods}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem 5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <a
            href="/"
            style={{
              fontSize: 13,
              color: "#9ca3af",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ← Dashboard
          </a>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#111827",
              marginTop: 8,
            }}
          >
            New Restaurant Site
          </h1>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: "0.5rem" }}>
          <div
            style={{
              height: 4,
              background: "#e5e7eb",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#111827",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Step labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          {STEPS.map((s) => (
            <span
              key={s.id}
              style={{
                fontSize: 11,
                fontWeight: s.id === step ? 600 : 400,
                color: s.id <= step ? "#111827" : "#d1d5db",
                transition: "color 0.2s",
              }}
            >
              {s.label}
            </span>
          ))}
        </div>

        {/* Step card */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            padding: "2rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          {step === 1 && <Step1Basic onNext={next} />}
          {step === 2 && <Step2Contact onNext={next} onBack={prev} />}
          {step === 3 && <Step3Hours onNext={next} onBack={prev} />}
          {step === 4 && <Step4Content onNext={next} onBack={prev} />}
          {step === 5 && <Step5Photos onNext={next} onBack={prev} />}
          {step === 6 && <Step6Theme onNext={next} onBack={prev} />}
          {step === 7 && (
            <Step7Deploy onBack={prev} onSuccess={setDeployResult} />
          )}
        </div>

        {/* Success banner */}
        {deployResult && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1.25rem 1.5rem",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 12,
            }}
          >
            <p
              style={{
                fontWeight: 600,
                color: "#166534",
                marginBottom: 8,
                fontSize: 15,
              }}
            >
              Site deployed successfully!
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              <a
                href={deployResult.pagesUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: "#15803d", fontWeight: 500 }}
              >
                View live site →
              </a>
              <a
                href={deployResult.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: "#6b7280" }}
              >
                GitHub repo →
              </a>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
}
