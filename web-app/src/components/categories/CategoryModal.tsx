import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import {
  X, Pencil, Check, Trash2,
  Plus, Eye, Layers, Folder, Image as ImageIcon,
  AlertCircle
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

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  is_active: z.boolean(),
  sort_order: z.union([z.number().min(0, "Must be >= 0"), z.literal("")]).optional(),
  parent_id: z.number().nullable().optional(),
});
type CategoryErrors = z.inferFlattenedErrors<typeof categorySchema>["fieldErrors"];

function FieldError({ error }: { error?: string[] }) {
  if (!error || error.length === 0) return null;
  return (
    <p className="mt-1.5 text-[11px] font-medium text-rose-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
      <AlertCircle className="w-3 h-3" />
      {error[0]}
    </p>
  );
}

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
  const [errors, setErrors] = useState<CategoryErrors>({});
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>>({});

  const hasErrors = Object.keys(errors).length > 0;

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
    setErrors({});
    onClose();
  };

  const set = <K extends keyof Category>(key: K, val: Category[K]) => {
    setDraft(p => p ? { ...p, [key]: val } : p);
    if (errors[key as keyof CategoryErrors]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSave = () => {
    if (!draft) return;

    const parsed = categorySchema.safeParse(draft);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors(fieldErrors);

      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField && inputRefs.current[firstErrorField]) {
        inputRefs.current[firstErrorField]?.focus();
        inputRefs.current[firstErrorField]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={handleClose}
      />
      <div
        className="relative flex flex-col w-full max-w-5xl h-[95vh] sm:h-[85vh] bg-white sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-slate-900/5"
        onClick={e => e.stopPropagation()}
      >

        {/* Top Header */}
        <div className="shrink-0 bg-white border-b border-primary-100/50 px-4 sm:px-8 py-5 flex items-center justify-between gap-4 sticky top-0 z-10">
          
          <div className="flex items-center gap-4 flex-1 min-w-0 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 group-hover:scale-105 transition-all duration-300 ring-4 ring-primary-50">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-primary-600 tracking-widest mb-0.5 uppercase">
                {draft?.id ? "Editing Category" : "Creating Category"}
              </p>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 truncate">
                {draft.name || "Untitled Category"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEdit && hasErrors && (
              <span className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                <AlertCircle className="h-3 w-3" /> Fix errors
              </span>
            )}

            {isEdit ? (
              <>
                <button
                  onClick={() => {
                    setDraft(category ? { ...category, images: [...category.images] } : null);
                    setNewFiles([]);
                    setErrors({});
                    setMode("view");
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Discard
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/40 hover:-translate-y-0.5 flex items-center gap-2 active:scale-95"
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
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" /> Edit category
              </button>
            )}
            <button
              onClick={handleClose}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 flex overflow-hidden min-h-0 bg-slate-50/30">

          {/* LEFT IMAGE PANEL */}
          <div className="w-full sm:w-80 flex-shrink-0 flex flex-col gap-6 p-6 sm:p-8 border-r border-slate-100/80 overflow-y-auto bg-white/50 backdrop-blur-sm z-0 relative">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -z-10" />

            {/* Hero Image */}
            <div className="bg-slate-50/50 rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-inner overflow-hidden">
                {draft.images.length > 0 ? (
                  <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" onClick={(e) => e.stopPropagation()}>
                      <img
                          src={draft.images[activeImg]}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {draft.images.length > 1 && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                          {draft.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); setActiveImg(idx); }}
                              className={`h-1.5 rounded-full transition-all duration-300 ${activeImg === idx ? "w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
                            />
                          ))}
                        </div>
                      )}
                      {isEdit && draft.images.length > 0 && (
                      <button
                          onClick={(e) => { e.stopPropagation(); deleteImage(); }}
                          className="absolute right-3 top-3 rounded-xl bg-white/90 p-2 text-rose-500 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-rose-500 hover:text-white group-hover:opacity-100 ring-1 ring-black/5"
                      >
                          <Trash2 className="w-4 h-4" />
                      </button>
                      )}
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white shadow-sm ring-1 ring-slate-100/50 transition-colors group-hover:border-primary-300 group-hover:bg-primary-50/30">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-slate-50/50 mt-4">
                          <ImageIcon className="w-8 h-8 text-slate-300" />
                      </div>
                      <span className="text-sm font-semibold text-slate-400">No image uploaded</span>
                      <p className="text-xs text-slate-400 mt-1 mb-4">Upload an image to get started</p>
                  </div>
                )}
            </div>

            {/* Thumbnails + Add */}
            <div className="flex flex-wrap gap-3">
                {draft.images.map((img, i) => (
                <div
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 shadow-sm ${
                    activeImg === i
                        ? "border-primary-500 shadow-lg shadow-primary-500/20 scale-110"
                        : "border-transparent border-slate-200 hover:border-primary-300"
                    }`}
                >
                    <img src={img} className="w-full h-full object-cover" />
                </div>
                ))}

                {isEdit && draft.images.length === 0 && (
                <label
                    className="w-16 h-16 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1 transition-all duration-300 border-slate-200 bg-white hover:border-primary-400 hover:bg-primary-50/50 hover:text-primary-500 text-slate-400 shadow-sm group"
                >
                    <Plus className="w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => addImage(e.target.files)}
                    />
                </label>
                )}
            </div>

            {isEdit && (
                <p className="text-xs text-slate-400 font-medium text-center bg-slate-100/50 px-3 py-2 rounded-lg">
                  Click image to preview · trash to remove
                </p>
            )}
            </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white z-0 relative">
            <div className="absolute -left-64 -bottom-64 w-[500px] h-[500px] bg-secondary-500/5 rounded-full blur-3xl -z-10" />
            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-10">

              <section>
                <SectionLabel icon={<Eye className="w-4 h-4" />}>General</SectionLabel>
                <div className="space-y-4">
                  <InfoCard label="Category Name">
                    {isEdit ? (
                      <div data-err={errors.name ? true : undefined}>
                        <input
                          ref={(el) => (inputRefs.current.name = el)}
                          type="text"
                          placeholder="Category name..."
                          value={draft.name}
                          onChange={e => {
                            const value = e.target.value;
                            const slug = value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                            set("name", value);
                            set("slug", slug);
                          }}
                          className={inputCls(!!errors.name)}
                        />
                        <FieldError error={errors.name} />
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 mt-2">{draft.name}</p>
                    )}
                  </InfoCard>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard label="Status">
                    {isEdit ? (
                        <div data-err={errors.is_active ? true : undefined}>
                          <select
                              value={draft.is_active ? "active" : "inactive"}
                              onChange={e => set("is_active", e.target.value === "active")}
                              className={selectCls()}
                          >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                          </select>
                          <FieldError error={errors.is_active as any} />
                        </div>
                        ) : (
                        <div className="mt-2">
                          <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                              draft.is_active
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                  : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
                              }`}
                          >
                              <span className={`w-1.5 h-1.5 rounded-full ${draft.is_active ? "bg-emerald-500/80" : "bg-slate-400"}`} />
                              {draft.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                    )}
                  </InfoCard>

                  <InfoCard label="Sort Order">
                    {isEdit ? (
                        <div data-err={errors.sort_order ? true : undefined}>
                          <input
                              ref={(el) => (inputRefs.current.sort_order = el)}
                              type="number"
                              min="0"
                              value={draft.sort_order ?? ""}
                              onChange={(e) =>
                              set(
                                  "sort_order",
                                  e.target.value === "" ? "" : Number(e.target.value)
                              )
                              }
                              className={inputCls(!!errors.sort_order)}
                          />
                          <FieldError error={errors.sort_order} />
                        </div>
                        ) : (
                        <p className="text-sm font-semibold text-slate-800 mt-2">
                            {draft.sort_order === "" || draft.sort_order == null ? "—" : draft.sort_order}
                        </p>
                        )}
                  </InfoCard>
                  </div>
                </div>
              </section>

              <section>
                <SectionLabel icon={<Folder className="w-4 h-4" />}>Hierarchy</SectionLabel>
                <InfoCard label="Parent Category">
                  {isEdit ? (
                    <div data-err={errors.parent_id ? true : undefined}>
                      <select
                          ref={(el) => (inputRefs.current.parent_id = el as any)}
                          value={draft.parent_id ?? ""}
                          onChange={e =>
                            set("parent_id", e.target.value ? Number(e.target.value) : null)
                          }
                          className={selectCls(!!errors.parent_id)}
                      >
                          <option value="">No parent (Top Level)</option>
                          {categories.filter(c => c.id !== draft.id).map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                      </select>
                      <FieldError error={errors.parent_id} />
                      <p className="text-[11px] text-slate-400 mt-2 font-medium">Select a parent category to create a sub-category.</p>
                    </div>
                    ) : (
                    <p className="text-sm font-semibold text-slate-800 mt-2">
                        {categories.find(c => c.id === draft.parent_id)?.name || "— (Top Level)"}
                    </p>
                    )}
                </InfoCard>
              </section>

              <section>
                <SectionLabel icon={<Layers className="w-4 h-4" />}>Routing & SEO</SectionLabel>
                <InfoCard label="URL Slug">
                  {isEdit ? (
                    <div data-err={errors.slug ? true : undefined}>
                      <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all duration-300 shadow-sm">
                        <span className="flex items-center border-r border-slate-200 bg-slate-50/50 px-4 text-sm font-mono text-slate-400 whitespace-nowrap">
                          mysite.com/c/
                        </span>
                        <input
                            ref={(el) => (inputRefs.current.slug = el)}
                            value={draft.slug}
                            onChange={e => set("slug", e.target.value)}
                            className="flex-1 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm font-mono text-slate-800 outline-none placeholder:text-slate-300 disabled:bg-transparent"
                        />
                      </div>
                      <FieldError error={errors.slug} />
                      <p className="mt-2 text-xs text-slate-400 font-medium">
                        Must be unique, lowercase, and use hyphens for spaces.
                      </p>
                    </div>
                    ) : (
                    <p className="text-sm font-mono text-primary-600 break-all mt-2 py-1.5 px-3 bg-primary-50/50 rounded border border-primary-100 w-fit">
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

function SectionLabel({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5 group">
      {icon && <span className="text-primary-500 transition-transform group-hover:scale-110">{icon}</span>}
      <h3 className="text-sm font-display font-semibold text-slate-800 tracking-tight">{children}</h3>
      <span className="flex-1 h-px bg-gradient-to-r from-primary-100 to-transparent" />
    </div>
  );
}

function InfoCard({ label, children }: any) {
  return (
    <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-primary-200 transition-colors duration-300">
      <div className="absolute -left-2.5 top-5 w-1 h-8 bg-gradient-to-b from-primary-400 to-secondary-400 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity" />
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
      {children}
    </div>
  );
}

const inputCls = (err?: boolean) =>
  `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-4 focus:ring-offset-0 disabled:cursor-default disabled:border-slate-100 disabled:bg-slate-50/50 disabled:text-slate-500 shadow-sm ${
    err
      ? "border-rose-300 bg-rose-50/50 text-rose-900 placeholder:text-rose-400 focus:border-rose-500 focus:ring-rose-500/20 shadow-rose-100"
      : "border-slate-200 bg-white/50 backdrop-blur-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:ring-primary-500/20 hover:border-primary-300 hover:bg-white"
  }`;

const selectCls = (err?: boolean) =>
  `w-full rounded-xl border px-4 py-3 text-sm outline-none appearance-none transition-all duration-300 focus:ring-4 focus:ring-offset-0 cursor-pointer disabled:cursor-default disabled:border-slate-100 disabled:bg-slate-50/50 disabled:text-slate-500 shadow-sm ${
    err
      ? "border-rose-300 bg-rose-50/50 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20 shadow-rose-100"
      : "border-slate-200 bg-white/50 backdrop-blur-sm text-slate-800 focus:border-primary-500 focus:ring-primary-500/20 hover:border-primary-300 hover:bg-white"
  }`;