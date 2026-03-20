import { useState, useRef, useEffect } from "react";
import {
  X, Pencil, Check, Trash2,
  Plus, Eye, Layers, Folder
} from "lucide-react";

type Category = {
  id?: number;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order?: number | "";
  parent_id?: number | null;
  images: string[];
};

interface Props {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updated: any) => void;
  categories?: { id: number; name: string }[];
  initialMode?: "view" | "edit";
}

export default function CategoryModal({
  category,
  isOpen,
  onClose,
  onSave,
  categories = [],
  initialMode = "view"
}: Props) {

  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [draft, setDraft] = useState<Category | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category) {
      setDraft({ ...category, images: [...(category.images || [])] });
      setNewFiles([]);
      setActiveImg(0);
      setMode(initialMode);
    }
  }, [category, initialMode]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  if (!isOpen || !draft) return null;

  const isEdit = mode === "edit";

  const handleClose = () => {
    setMode(initialMode);
    setDraft(category ? { ...category, images: [...(category.images || [])] } : null);
    setNewFiles([]);
    setActiveImg(0);
    onClose();
  };

  const set = <K extends keyof Category>(key: K, val: Category[K]) =>
    setDraft(p => p ? { ...p, [key]: val } : p);

  const handleSave = () => {
    if (!draft) return;

    const hadOriginalImage =
      category?.images && category.images.length > 0;

    const hasCurrentImage =
      draft.images && draft.images.length > 0;

    const isImageDeleted =
      hadOriginalImage && !hasCurrentImage;

    const payload = {
      name: draft.name,
      slug: draft.slug,
      parent_id: draft.parent_id ?? null,
      is_active: draft.is_active,
      sort_order:
        draft.sort_order === "" || draft.sort_order == null
          ? 0
          : Number(draft.sort_order),
      image: newFiles[0],
      remove_image: isImageDeleted
    };

    console.log("SENDING PAYLOAD:", payload);

    onSave?.(payload);
  };

  const addImage = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);

    setNewFiles([file]);
    setDraft(p => p ? { ...p, images: [url] } : p);
    setActiveImg(0);
    };

    const deleteImage = () => {
        setNewFiles([]);
        setDraft(p => p ? { ...p, images: [] } : p);
        setActiveImg(0);
        };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: "rgba(15,23,42,0.36)", backdropFilter: "blur(14px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative flex flex-col overflow-hidden rounded-[32px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,249,250,0.98))] shadow-[0_34px_100px_rgba(15,23,42,0.22)]"
        style={{ width: "min(1140px, 96vw)", height: "min(800px, 92vh)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />

        {/* HEADER */}
        <div className="relative z-10 flex flex-shrink-0 items-center justify-between border-b border-neutral-200/90 bg-white/92 px-7 py-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 shadow-[0_10px_24px_rgba(124,58,237,0.15)]">
              <Folder className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                {draft?.id ? "Editing Category" : "Creating Category"}
              </p>
              {isEdit ? (
                <input
                  value={draft.name}
                  onChange={e => {
                    const value = e.target.value;
                     const slug = value
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "");
                    set("name", value);
                    set("slug", slug.charAt(0).toUpperCase() + slug.slice(1));
                  }}
                  className="border-b-2 border-primary-300 bg-transparent text-xl font-semibold text-neutral-900 focus:border-primary-500 focus:outline-none"
                />
              ) : (
                <h2 className="text-xl font-semibold text-neutral-900">{draft.name}</h2>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isEdit ? (
              <>
                <button
                  onClick={() => {
                    setDraft(category ? { ...category, images: [...category.images] } : null);
                    setNewFiles([]);
                    setMode("view");
                  }}
                  className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
                >
                  <X className="w-4 h-4" /> Discard
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(124,58,237,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(124,58,237,0.32)]"
                >
                  <Check className="w-4 h-4" /> Save changes
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  if (category) {
                    setDraft({ ...category, images: [...(category.images || [])] });
                    setNewFiles([]);
                    setActiveImg(0);
                  }
                  setMode("edit");
                }}
                className="flex items-center gap-2 rounded-2xl bg-neutral-900 px-5 py-2 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(23,23,23,0.2)] transition-all hover:-translate-y-0.5 hover:bg-neutral-700"
              >
                <Pencil className="w-4 h-4" /> Edit category
              </button>
            )}
            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-neutral-400 transition-colors hover:bg-neutral-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* LEFT IMAGE PANEL identical structure */}
          <div className="flex w-[46%] flex-shrink-0 flex-col gap-5 overflow-y-auto border-r border-neutral-200/90 bg-[linear-gradient(180deg,#fafafa,#f4f4f5)] p-6">

            {/* Hero */}
            <div
                className="relative overflow-hidden rounded-[28px] border border-neutral-200/90 bg-white shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
                style={{ aspectRatio: "4/3" }}
            >
                {draft.images.length > 0 ? (
                <img
                    src={draft.images[activeImg]}
                    className="w-full h-full object-cover"
                />
                ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-gray-300">
                    <Folder className="w-16 h-16" />
                    <span className="text-sm font-medium">No image uploaded</span>
                </div>
                )}

                {isEdit && draft.images.length > 0 && (
                <button
                    onClick={() => deleteImage(activeImg)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white shadow-sm"
                >
                    <Trash2 className="w-4 h-4 text-red-500" />
                </button>
                )}
            </div>

            {/* Thumbnails + Add */}
            <div className="flex flex-wrap gap-2.5">
                {draft.images.map((img, i) => (
                <div
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-20 w-20 cursor-pointer overflow-hidden rounded-2xl border-2 bg-white transition-all ${
                    activeImg === i
                        ? "scale-105 border-primary-500 shadow-lg shadow-primary-100"
                        : "border-transparent hover:border-gray-300 hover:shadow-md"
                    }`}
                >
                    <img src={img} className="w-full h-full object-cover" />
                </div>
                ))}

                {isEdit && draft.images.length === 0 && (
                <label
                    className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-gray-200 bg-white transition-all hover:border-primary-300 hover:bg-primary-50/50"
                >
                    <Plus className="w-5 h-5 text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-semibold">Add</span>
                    <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    className="hidden"
                    onChange={(e) => addImage(e.target.files)}
                    />
                </label>
                )}
            </div>

            {isEdit && (
                <p className="text-xs text-gray-400 text-center">
                Click image to preview · click trash to remove
                </p>
            )}
            </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[linear-gradient(180deg,#ffffff,#fcfcfd)]">
            <div className="flex-1 space-y-7 overflow-y-auto px-7 py-6">

              <section>
                <SectionLabel>General</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Status" icon={<Eye className="w-3.5 h-3.5" />}>
                    {isEdit ? (
                        <select
                            value={draft.is_active ? "active" : "inactive"}
                            onChange={e => set("is_active", e.target.value === "active")}
                            className={selectCls}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        ) : (
                        <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            draft.is_active
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-neutral-100 text-neutral-600 border-neutral-200"
                            }`}
                        >
                            {draft.is_active ? "Active" : "Inactive"}
                        </span>
)}
                  </InfoCard>

                  <InfoCard label="Sort Order" icon={<Layers className="w-3.5 h-3.5" />}>
                    {isEdit ? (
                        <input
                            type="number"
                            value={draft.sort_order ?? ""}
                            onChange={(e) =>
                            set(
                                "sort_order",
                                e.target.value === "" ? "" : Number(e.target.value)
                            )
                            }
                            className={inputCls}
                        />
                        ) : (
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">
                            {draft.sort_order ?? "—"}
                        </p>
                        )}
                  </InfoCard>
                </div>
              </section>

              <section>
                <SectionLabel>Hierarchy</SectionLabel>
                <InfoCard label="Parent Category" icon={<Folder className="w-3.5 h-3.5" />}>
                  {isEdit ? (
                    <select
                        value={draft.parent_id ?? ""}
                        onChange={e =>
                        set("parent_id", e.target.value ? Number(e.target.value) : null)
                        }
                        className={selectCls}
                    >
                        <option value="">No parent</option>
                        {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    ) : (
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                        {categories.find(c => c.id === draft.parent_id)?.name || "—"}
                    </p>
                    )}
                </InfoCard>
              </section>

              <section>
                <SectionLabel>URL Slug</SectionLabel>
                <InfoCard label="Slug" icon={<span className="text-sm font-bold text-gray-400">/</span>}>
                  {isEdit ? (
                    <input
                        value={draft.slug}
                        onChange={e => set("slug", e.target.value)}
                        className={`${inputCls} font-mono`}
                    />
                    ) : (
                    <p className="text-sm font-mono text-gray-600 break-all mt-0.5">
                        {draft.slug}
                    </p>
                    )}
                </InfoCard>
              </section>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
      {children}
      <span className="h-px flex-1 bg-gray-100" />
    </p>
  );
}

function InfoCard({ label, icon, children }: any) {
  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-[linear-gradient(180deg,#ffffff,#fbfbfc)] px-4 py-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <div className="mb-1.5 flex items-center gap-1.5">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "mt-0.5 h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-50";

const selectCls =
  "mt-0.5 h-10 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition-colors focus:border-primary-400 focus:outline-none";
