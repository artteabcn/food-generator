import { useRef, useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import type { SiteFormData } from "@/lib/validations/site";
import { StepHeader, NavButtons } from "./shared";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

interface PhotoEntry {
  name: string;
  data: string; // base64
  mimeType: string;
  size: number;
  preview: string; // object URL
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Step5Photos({ onNext, onBack }: Props) {
  const { setValue, trigger, formState: { errors } } =
    useFormContext<SiteFormData>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localPhotos, setLocalPhotos] = useState<PhotoEntry[]>([]);

  async function processFile(file: File): Promise<PhotoEntry | null> {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) return null;
    if (file.size > 10 * 1024 * 1024) return null;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        // Extract base64 without the data URL prefix
        const base64 = dataUrl.split(",")[1];
        resolve({
          name: file.name,
          data: base64,
          mimeType: file.type,
          size: file.size,
          preview: dataUrl,
        });
      };
      reader.readAsDataURL(file);
    });
  }

  async function addFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    const currentCount = localPhotos.length;
    const available = 6 - currentCount;
    if (available <= 0) return;

    setLoading(true);
    const toProcess = fileArray.slice(0, available);
    const results = await Promise.all(toProcess.map(processFile));
    const valid = results.filter(Boolean) as PhotoEntry[];

    const updated = [...localPhotos, ...valid];
    setLocalPhotos(updated);
    setValue(
      "photos",
      updated.map(({ name, data, mimeType }) => ({ name, data, mimeType }))
    );
    setLoading(false);
  }

  function removePhoto(index: number) {
    const updated = localPhotos.filter((_, i) => i !== index);
    setLocalPhotos(updated);
    setValue(
      "photos",
      updated.map(({ name, data, mimeType }) => ({ name, data, mimeType }))
    );
  }

  function reorder(from: number, to: number) {
    const updated = [...localPhotos];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setLocalPhotos(updated);
    setValue(
      "photos",
      updated.map(({ name, data, mimeType }) => ({ name, data, mimeType }))
    );
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [localPhotos]
  );

  async function handleNext() {
    const valid = await trigger(["photos"]);
    if (valid) onNext();
  }

  const photosError = errors.photos?.message ?? (errors.photos as { root?: { message?: string } })?.root?.message;

  return (
    <div>
      <StepHeader
        step={5}
        title="Menu Photos"
        subtitle="Upload 1–6 photos. They'll be displayed in the menu section. JPEG, PNG or WebP, max 10 MB each."
      />

      {/* Drop zone */}
      {localPhotos.length < 6 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? "#111827" : "#d1d5db"}`,
            borderRadius: 12,
            padding: "2.5rem 1.5rem",
            textAlign: "center",
            cursor: "pointer",
            background: isDragging ? "#f9fafb" : "white",
            transition: "all 0.15s",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              background: "#f3f4f6",
              borderRadius: 10,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
            {loading ? "Processing…" : "Drop photos here or click to browse"}
          </p>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
            {6 - localPhotos.length} slot{6 - localPhotos.length !== 1 ? "s" : ""}{" "}
            remaining
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {photosError && (
        <p style={{ fontSize: 12, color: "#dc2626", marginBottom: "1rem" }}>
          {photosError}
        </p>
      )}

      {/* Photo grid */}
      {localPhotos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: "1rem",
          }}
        >
          {localPhotos.map((photo, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                aspectRatio: "4/3",
              }}
            >
              <img
                src={photo.preview}
                alt={photo.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
                }}
              />
              {/* Index badge */}
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  left: 6,
                  width: 22,
                  height: 22,
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </span>
              {/* File name & size */}
              <div
                style={{
                  position: "absolute",
                  bottom: 6,
                  left: 6,
                  right: 32,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "white",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {photo.name}
                </p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>
                  {formatBytes(photo.size)}
                </p>
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePhoto(i)}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 22,
                  height: 22,
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  borderRadius: 4,
                  color: "white",
                  cursor: "pointer",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
                aria-label="Remove photo"
              >
                ×
              </button>
              {/* Reorder arrows */}
              <div
                style={{
                  position: "absolute",
                  bottom: 6,
                  right: 6,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => reorder(i, i - 1)}
                    style={{
                      width: 18,
                      height: 18,
                      background: "rgba(0,0,0,0.5)",
                      border: "none",
                      borderRadius: 3,
                      color: "white",
                      cursor: "pointer",
                      fontSize: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ↑
                  </button>
                )}
                {i < localPhotos.length - 1 && (
                  <button
                    type="button"
                    onClick={() => reorder(i, i + 1)}
                    style={{
                      width: 18,
                      height: 18,
                      background: "rgba(0,0,0,0.5)",
                      border: "none",
                      borderRadius: 3,
                      color: "white",
                      cursor: "pointer",
                      fontSize: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ↓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {localPhotos.length > 0 && (
        <p style={{ fontSize: 12, color: "#9ca3af" }}>
          {localPhotos.length} / 6 photos · First photo is the hero image ·
          Use arrows to reorder
        </p>
      )}

      <NavButtons onBack={onBack} onNext={handleNext} />
    </div>
  );
}
