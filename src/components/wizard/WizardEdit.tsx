import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteFormSchema, type SiteFormData } from "@/lib/validations/site";
import Step1Basic from "./Step1Basic";
import Step2Contact from "./Step2Contact";
import Step3Hours from "./Step3Hours";
import Step4Content from "./Step4Content";
import Step5Menu from "./Step5Menu";
import Step6Theme from "./Step6Theme";
import StepLogo from "./StepLogo";
import StepRedeploy from "./StepRedeploy";

const EASE = "cubic-bezier(0.32,0.72,0,1)";

interface Props {
  slug: string;
  initialData: SiteFormData;
  deployUrl: string | null;
  githubRepo: string;
}

const STEPS = [
  { id: 1, label: "Basic Info",  desc: "Name & timezone" },
  { id: 2, label: "Contact",     desc: "Address & WhatsApp" },
  { id: 3, label: "Hours",       desc: "Opening times" },
  { id: 4, label: "Content",     desc: "Copy & translations" },
  { id: 5, label: "Menu",        desc: "Photos or items" },
  { id: 6, label: "Theme",       desc: "Visual identity" },
  { id: 7, label: "Logo",        desc: "Upload or auto-generate" },
  { id: 8, label: "Save",        desc: "Commit & redeploy" },
];

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function WizardEdit({ slug, initialData, deployUrl, githubRepo }: Props) {
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);

  const methods = useForm<SiteFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(SiteFormSchema) as any,
    defaultValues: initialData,
    mode: "onChange",
  });

  function next() { setStep((s) => Math.min(s + 1, 8)); }
  function prev() { setStep((s) => Math.max(s - 1, 1)); }

  return (
    <FormProvider {...methods}>
      <style>{`
        @media (max-width: 700px) {
          .wizard-layout { flex-direction: column !important; }
          .wizard-sidebar { display: none !important; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-panel { animation: fadeSlideUp 0.4s ${EASE} both; }
      `}</style>

      <div style={{ minHeight: "100dvh", background: "#f8f7f4", display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <header style={{ background: "#0f172a", padding: "0 2rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.125rem 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2h18l-2 7H5L3 2z"/><path d="M5 9c0 7 14 7 14 0"/><path d="M12 16v6"/><path d="M8 22h8"/>
                </svg>
              </div>
              <div>
                <span style={{ display: "block", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", lineHeight: 1, marginBottom: 2 }}>Arkadya</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "white", letterSpacing: "-0.02em", lineHeight: 1 }}>Food Generator</span>
              </div>
            </div>
            <a href={`/sites/${slug}`} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 500, transition: `color 0.2s ${EASE}` }}
               onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
               onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back to site
            </a>
          </div>
        </header>

        {/* Sub-header */}
        <div style={{ background: "white", borderBottom: "1px solid #f1f5f9", padding: "0 2rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.125rem 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h1 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
                Edit: {initialData.name}
              </h1>
              <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 3, fontWeight: 400 }}>Changes push to GitHub and redeploy automatically.</p>
            </div>
            {deployUrl && (
              <a href={deployUrl} target="_blank" rel="noopener noreferrer"
                 style={{ fontSize: 12.5, color: "#0f172a", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "1.5px solid rgba(0,0,0,0.1)", borderRadius: 100 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                View live site
              </a>
            )}
          </div>
        </div>

        {/* Main layout */}
        <div className="wizard-layout" style={{ flex: 1, maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", gap: "1.5rem", padding: "1.75rem 2rem 5rem", alignItems: "flex-start" }}>

          {/* Sidebar */}
          <aside className="wizard-sidebar" style={{ width: 210, flexShrink: 0, background: "white", borderRadius: 14, border: "1px solid rgba(0,0,0,0.055)", padding: "0.625rem", position: "sticky", top: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.03)" }}>
            {STEPS.map((s) => {
              const isActive = s.id === step;
              const isDone = s.id < step;
              return (
                <div
                  key={s.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 11px", borderRadius: 9, marginBottom: 1,
                    background: isActive ? "#0f172a" : "transparent",
                    cursor: isDone ? "pointer" : "default",
                    transition: `background 0.3s ${EASE}`,
                  }}
                  onClick={() => { if (isDone) setStep(s.id); }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                    background: isActive ? "rgba(255,255,255,0.12)" : isDone ? "#dcfce7" : "#f8f7f4",
                    border: `1.5px solid ${isActive ? "rgba(255,255,255,0.15)" : isDone ? "#bbf7d0" : "#e9ecef"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: `all 0.3s ${EASE}`,
                  }}>
                    {isDone ? <CheckIcon /> : (
                      <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? "rgba(255,255,255,0.9)" : "#94a3b8" }}>
                        {s.id}
                      </span>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span style={{
                      display: "block", fontSize: 13, lineHeight: 1.2, letterSpacing: "-0.01em",
                      fontWeight: isActive ? 700 : isDone ? 500 : 400,
                      color: isActive ? "white" : isDone ? "#374151" : "#94a3b8",
                    }}>
                      {s.label}
                    </span>
                    <span style={{
                      display: "block", fontSize: 11, lineHeight: 1.2, marginTop: 1,
                      color: isActive ? "rgba(255,255,255,0.45)" : isDone ? "#9ca3af" : "#cbd5e1",
                    }}>
                      {s.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </aside>

          {/* Step content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Progress bar */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid rgba(0,0,0,0.055)", padding: "10px 16px", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ flex: 1, height: 3, background: "#f1f5f9", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${((step - 1) / (STEPS.length - 1)) * 100}%`, background: "#0f172a", borderRadius: 100, transition: `width 0.5s ${EASE}` }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
                {step} <span style={{ color: "#cbd5e1", fontWeight: 400 }}>/ {STEPS.length}</span>
              </span>
            </div>

            <div key={step} className="step-panel" style={{ background: "white", borderRadius: 16, border: "1px solid rgba(0,0,0,0.055)", padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04)" }}>
              {step === 1 && <Step1Basic onNext={next} editMode />}
              {step === 2 && <Step2Contact onNext={next} onBack={prev} />}
              {step === 3 && <Step3Hours onNext={next} onBack={prev} />}
              {step === 4 && <Step4Content onNext={next} onBack={prev} />}
              {step === 5 && <Step5Menu onNext={next} onBack={prev} />}
              {step === 6 && <Step6Theme onNext={next} onBack={prev} />}
              {step === 7 && <StepLogo onNext={next} onBack={prev} stepNumber={7} />}
              {step === 8 && (
                <StepRedeploy slug={slug} onBack={prev} onSuccess={() => setSaved(true)} deployUrl={deployUrl} githubRepo={githubRepo} />
              )}
            </div>

            {saved && (
              <div style={{ marginTop: "1.125rem", padding: "1.25rem 1.5rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14 }}>
                <p style={{ fontWeight: 700, color: "#166534", marginBottom: 10, fontSize: 14.5, letterSpacing: "-0.01em" }}>
                  Changes saved — redeploying now.
                </p>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {deployUrl && (
                    <a href={deployUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13.5, color: "#15803d", fontWeight: 600 }}>
                      View live site →
                    </a>
                  )}
                  <a href={`/sites/${slug}`} style={{ fontSize: 13.5, color: "#64748b" }}>
                    Back to site details →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
