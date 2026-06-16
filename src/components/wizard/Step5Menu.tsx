import { useRef, useState, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { SiteFormData, MenuItem } from "@/lib/validations/site";
import { StepHeader, NavButtons } from "./shared";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

interface PhotoEntry {
  name: string;
  data: string;
  mimeType: string;
  size: number;
  preview: string;
}

const TAG_LABELS: Record<string, string> = {
  veg: "Veg",
  vegan: "Vegan",
  gf: "Gluten-free",
  spicy: "Spicy",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const emptyItem = (): Omit<MenuItem, "tags"> & { tags: string[] } => ({
  category: "",
  name: "",
  description: "",
  price: "",
  tags: [],
});

export default function Step5Menu({ onNext, onBack }: Props) {
  const { setValue, trigger, formState: { errors } } = useFormContext<SiteFormData>();
  const menuMode = useWatch<SiteFormData, "menuMode">({ name: "menuMode" });
  const menuItems = useWatch<SiteFormData, "menuItems">({ name: "menuItems" }) ?? [];

  // Photos state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [localPhotos, setLocalPhotos] = useState<PhotoEntry[]>([]);

  // Menu item editor state
  const [addingItem, setAddingItem] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState(emptyItem());
  const [itemError, setItemError] = useState("");

  // ── mode helpers ──────────────────────────────────────────────────────
  const showPhotos = menuMode === "photos" || menuMode === "both";
  const showItems = menuMode === "items" || menuMode === "both";

  function setMode(m: "photos" | "items" | "both") {
    setValue("menuMode", m);
  }

  // ── photo logic ───────────────────────────────────────────────────────
  async function processFile(file: File): Promise<PhotoEntry | null> {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return null;
    if (file.size > 10 * 1024 * 1024) return null;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        resolve({ name: file.name, data: dataUrl.split(",")[1], mimeType: file.type, size: file.size, preview: dataUrl });
      };
      reader.readAsDataURL(file);
    });
  }

  async function addFiles(files: FileList | File[]) {
    const available = 6 - localPhotos.length;
    if (available <= 0) return;
    setPhotoLoading(true);
    const results = await Promise.all(Array.from(files).slice(0, available).map(processFile));
    const valid = results.filter(Boolean) as PhotoEntry[];
    const updated = [...localPhotos, ...valid];
    setLocalPhotos(updated);
    setValue("photos", updated.map(({ name, data, mimeType }) => ({ name, data, mimeType })));
    setPhotoLoading(false);
  }

  function removePhoto(index: number) {
    const updated = localPhotos.filter((_, i) => i !== index);
    setLocalPhotos(updated);
    setValue("photos", updated.map(({ name, data, mimeType }) => ({ name, data, mimeType })));
  }

  function reorder(from: number, to: number) {
    const updated = [...localPhotos];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setLocalPhotos(updated);
    setValue("photos", updated.map(({ name, data, mimeType }) => ({ name, data, mimeType })));
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [localPhotos]);

  // ── menu item logic ───────────────────────────────────────────────────
  function openAdd() {
    setDraft(emptyItem());
    setEditIndex(null);
    setItemError("");
    setAddingItem(true);
  }

  function openEdit(i: number) {
    const item = menuItems[i];
    setDraft({ ...item, tags: [...item.tags] });
    setEditIndex(i);
    setItemError("");
    setAddingItem(true);
  }

  function saveItem() {
    if (!draft.name.trim()) { setItemError("Item name is required"); return; }
    const item: MenuItem = { ...draft, name: draft.name.trim(), tags: draft.tags as MenuItem["tags"] };
    const updated = editIndex !== null
      ? menuItems.map((it, i) => (i === editIndex ? item : it))
      : [...menuItems, item];
    setValue("menuItems", updated);
    setAddingItem(false);
    setEditIndex(null);
  }

  function removeItem(i: number) {
    setValue("menuItems", menuItems.filter((_, idx) => idx !== i));
  }

  function toggleTag(tag: string) {
    const tags = draft.tags.includes(tag) ? draft.tags.filter(t => t !== tag) : [...draft.tags, tag];
    setDraft(d => ({ ...d, tags }));
  }

  // ── validation on next ────────────────────────────────────────────────
  async function handleNext() {
    if (showPhotos && localPhotos.length === 0 && !showItems) {
      setValue("photos", []);
      await trigger(["photos"]);
      return;
    }
    if (showItems && menuItems.length === 0 && !showPhotos) {
      setItemError("Add at least one menu item");
      return;
    }
    onNext();
  }

  // ── grouped items display ─────────────────────────────────────────────
  const categories = Array.from(new Set(menuItems.map(it => it.category || ""))).filter(Boolean);
  const uncategorised = menuItems.filter(it => !it.category);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", border: "1px solid #d1d5db",
    borderRadius: 7, fontSize: 14, outline: "none", background: "white",
  };

  return (
    <div>
      <StepHeader step={5} title="Menu" subtitle="Upload menu photos, write menu items, or both." />

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {(["photos", "items", "both"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{
              flex: 1, padding: "9px 0", border: "1px solid",
              borderColor: menuMode === m ? "#111827" : "#d1d5db",
              borderRadius: 8, fontSize: 13, fontWeight: menuMode === m ? 600 : 400,
              background: menuMode === m ? "#111827" : "white",
              color: menuMode === m ? "white" : "#6b7280",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {m === "photos" ? "📸 Photos only" : m === "items" ? "✍️ Written menu" : "📸 + ✍️ Both"}
          </button>
        ))}
      </div>

      {/* ── PHOTOS ── */}
      {showPhotos && (
        <div style={{ marginBottom: showItems ? 28 : 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>
            Menu photos <span style={{ fontWeight: 400, color: "#9ca3af" }}>(1–6 images, max 10 MB each)</span>
          </p>

          {localPhotos.length < 6 && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? "#111827" : "#d1d5db"}`,
                borderRadius: 12, padding: "2rem 1.5rem", textAlign: "center",
                cursor: "pointer", background: isDragging ? "#f9fafb" : "white",
                transition: "all 0.15s", marginBottom: 12,
              }}
            >
              <p style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
                {photoLoading ? "Processing…" : "Drop photos here or click to browse"}
              </p>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                {6 - localPhotos.length} slot{6 - localPhotos.length !== 1 ? "s" : ""} remaining
              </p>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                multiple style={{ display: "none" }}
                onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
            </div>
          )}

          {localPhotos.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 8 }}>
              {localPhotos.map((photo, i) => (
                <div key={i} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb", aspectRatio: "4/3" }}>
                  <img src={photo.preview} alt={photo.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                  <span style={{ position: "absolute", top: 6, left: 6, width: 22, height: 22, background: "rgba(0,0,0,0.6)", color: "white", fontSize: 11, fontWeight: 600, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                  <div style={{ position: "absolute", bottom: 6, left: 6, right: 32 }}>
                    <p style={{ fontSize: 11, color: "white", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{photo.name}</p>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{formatBytes(photo.size)}</p>
                  </div>
                  <button type="button" onClick={() => removePhoto(i)} style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 4, color: "white", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  <div style={{ position: "absolute", bottom: 6, right: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                    {i > 0 && <button type="button" onClick={() => reorder(i, i - 1)} style={{ width: 18, height: 18, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: 3, color: "white", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>}
                    {i < localPhotos.length - 1 && <button type="button" onClick={() => reorder(i, i + 1)} style={{ width: 18, height: 18, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: 3, color: "white", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>↓</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {localPhotos.length > 0 && (
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 0 }}>
              {localPhotos.length} / 6 · First photo is the hero image · Use arrows to reorder
            </p>
          )}
        </div>
      )}

      {/* ── MENU ITEMS ── */}
      {showItems && (
        <div>
          {showPhotos && <div style={{ height: 1, background: "#f3f4f6", margin: "0 0 24px" }} />}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: 0 }}>
              Menu items <span style={{ fontWeight: 400, color: "#9ca3af" }}>({menuItems.length})</span>
            </p>
            {!addingItem && (
              <button type="button" onClick={openAdd}
                style={{ padding: "6px 14px", background: "#111827", color: "white", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                + Add item
              </button>
            )}
          </div>

          {/* Item editor */}
          {addingItem && (
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "1rem", marginBottom: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, display: "block", marginBottom: 4 }}>Category <span style={{ color: "#9ca3af" }}>(optional)</span></label>
                  <input style={inputStyle} placeholder="e.g. Starters, Mains, Desserts"
                    value={draft.category} onChange={e => setDraft(d => ({ ...d, category: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, display: "block", marginBottom: 4 }}>Price <span style={{ color: "#9ca3af" }}>(optional)</span></label>
                  <input style={inputStyle} placeholder="e.g. ฿280"
                    value={draft.price} onChange={e => setDraft(d => ({ ...d, price: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, display: "block", marginBottom: 4 }}>Dish name *</label>
                <input style={{ ...inputStyle, borderColor: itemError ? "#dc2626" : "#d1d5db" }}
                  placeholder="e.g. Tom Kha Gai"
                  value={draft.name} onChange={e => { setDraft(d => ({ ...d, name: e.target.value })); setItemError(""); }} />
                {itemError && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{itemError}</p>}
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, display: "block", marginBottom: 4 }}>Description <span style={{ color: "#9ca3af" }}>(optional)</span></label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60 }}
                  placeholder="Coconut milk soup with galangal, lemongrass, mushrooms and chicken"
                  value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, display: "block", marginBottom: 6 }}>Tags</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.entries(TAG_LABELS).map(([tag, label]) => (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)}
                      style={{
                        padding: "4px 12px", borderRadius: 9999, border: "1px solid",
                        borderColor: draft.tags.includes(tag) ? "#111827" : "#d1d5db",
                        background: draft.tags.includes(tag) ? "#111827" : "white",
                        color: draft.tags.includes(tag) ? "white" : "#6b7280",
                        fontSize: 12, cursor: "pointer",
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={saveItem}
                  style={{ padding: "7px 20px", background: "#111827", color: "white", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                  {editIndex !== null ? "Save changes" : "Add to menu"}
                </button>
                <button type="button" onClick={() => { setAddingItem(false); setEditIndex(null); setItemError(""); }}
                  style={{ padding: "7px 16px", background: "white", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 13, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Items list */}
          {menuItems.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {/* Categorised */}
              {categories.map(cat => (
                <div key={cat}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", margin: "8px 0 4px" }}>{cat}</p>
                  {menuItems.filter(it => it.category === cat).map((item, globalIdx) => {
                    const i = menuItems.indexOf(item);
                    return <ItemRow key={globalIdx} item={item} onEdit={() => openEdit(i)} onRemove={() => removeItem(i)} />;
                  })}
                </div>
              ))}
              {/* Uncategorised */}
              {uncategorised.length > 0 && (
                <div>
                  {categories.length > 0 && <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", margin: "8px 0 4px" }}>Other</p>}
                  {uncategorised.map((item) => {
                    const i = menuItems.indexOf(item);
                    return <ItemRow key={i} item={item} onEdit={() => openEdit(i)} onRemove={() => removeItem(i)} />;
                  })}
                </div>
              )}
            </div>
          )}

          {menuItems.length === 0 && !addingItem && (
            <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", padding: "1.5rem 0" }}>
              No items yet — click "Add item" to start building the menu
            </p>
          )}
        </div>
      )}

      <NavButtons onBack={onBack} onNext={handleNext} />
    </div>
  );
}

function ItemRow({ item, onEdit, onRemove }: { item: MenuItem; onEdit: () => void; onRemove: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "white", border: "1px solid #e5e7eb", borderRadius: 8 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{item.name}</span>
          {item.price && <span style={{ fontSize: 13, color: "#6b7280" }}>{item.price}</span>}
          {item.tags.map(t => (
            <span key={t} style={{ fontSize: 10, padding: "1px 6px", background: "#f3f4f6", borderRadius: 9999, color: "#6b7280" }}>
              {t === "gf" ? "GF" : t === "veg" ? "V" : t === "vegan" ? "VG" : "🌶"}
            </span>
          ))}
        </div>
        {item.description && <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.description}</p>}
      </div>
      <div style={{ display: "flex", gap: 6, marginLeft: 12 }}>
        <button type="button" onClick={onEdit} style={{ fontSize: 12, color: "#6b7280", background: "none", border: "1px solid #e5e7eb", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>Edit</button>
        <button type="button" onClick={onRemove} style={{ fontSize: 12, color: "#dc2626", background: "none", border: "1px solid #fecaca", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>✕</button>
      </div>
    </div>
  );
}
