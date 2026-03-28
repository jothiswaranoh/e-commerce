import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import {
  X, Pencil, Check,
  Eye, Folder, AlertCircle
} from "lucide-react";

type Category = {
  id?: number;
  name: string;
  slug?: string;
  is_active: boolean;
  sort_order?: number | "";
  parent_id?: number | null;
  images: string[];
};

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  is_active: z.boolean(),
  sort_order: z.union([z.number().min(0), z.literal("")]).optional(),
  parent_id: z.number().nullable().optional(),
});

type CategoryErrors = z.inferFlattenedErrors<typeof categorySchema>["fieldErrors"];

function FieldError({ error }: { error?: string[] }) {
  if (!error || error.length === 0) return null;
  return (
    <p className="mt-1.5 text-[11px] font-medium text-rose-500 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      {error[0]}
    </p>
  );
}

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
      <span className="text-slate-400">{icon}</span>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{children}</h3>
    </div>
  );
}

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 rounded-xl px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      {children}
    </div>
  );
}

const inputCls = (hasError = false) =>
  `w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-white outline-none transition-all
   focus:ring-2 ${hasError
    ? "border-rose-300 focus:ring-rose-100"
    : "border-slate-200 focus:ring-primary-100 focus:border-primary-400"}`;

const selectCls = (hasError = false) =>
  `w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-white outline-none transition-all
   focus:ring-2 ${hasError
    ? "border-rose-300 focus:ring-rose-100"
    : "border-slate-200 focus:ring-primary-100 focus:border-primary-400"}`;

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
  const inputRefs = useRef<Record<string, any>>({});

  const isEdit = mode === "edit";

  useEffect(() => {
    if (category) {
      setDraft({ ...category, images: [...(category.images || [])] });
      setNewFiles([]);
      setMode(initialMode);
    }
  }, [category, initialMode]);

  if (!isOpen || !draft) return null;

  const handleClose = () => {
    setMode(initialMode);
    setDraft(category ? { ...category, images: [...(category.images || [])] } : null);
    setNewFiles([]);
    setErrors({});
    onClose();
  };

  const set = <K extends keyof Category,>(key: K, val: Category[K]) => {
    setDraft(p => p ? { ...p, [key]: val } : p);
  };

  const handleSave = () => {
    if (!draft) return;
    const parsed = categorySchema.safeParse(draft);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    const payload = {
      name: draft.name,
      parent_id: draft.parent_id ?? null,
      is_active: draft.is_active,
      sort_order: draft.sort_order || 0,
      image: newFiles[0],
      remove_image: draft.images.length === 0
    };
    onSave?.(payload);
  };

  const addImage = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setNewFiles([file]);
    setDraft(p => p ? { ...p, images: [url] } : p);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div>
            {isEdit ? (
              <input
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                className="text-xl font-bold outline-none border-b border-slate-300 focus:border-primary-400"
              />
            ) : (
              <h2 className="text-xl font-bold text-slate-800">{draft.name}</h2>
            )}
          </div>
          <div className="flex gap-2">
            {isEdit ? (
              <>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" /> Save
                </button>
                <button
                  onClick={() => setMode("view")}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setMode("edit")}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4 text-slate-500" />
                </button>
                <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto max-h-[70vh] px-6 py-6 space-y-8">

          {/* General */}
          <section>
            <SectionLabel icon={<Eye className="w-4 h-4" />}>General</SectionLabel>
            <div className="space-y-4">
              <InfoCard label="Category Name">
                {isEdit ? (
                  <div>
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
                    <div>
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
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        draft.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${draft.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {draft.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  )}
                </InfoCard>

                <InfoCard label="Sort Order">
                  {isEdit ? (
                    <div>
                      <input
                        ref={(el) => (inputRefs.current.sort_order = el)}
                        type="number"
                        min="0"
                        value={draft.sort_order ?? ""}
                        onChange={(e) => set("sort_order", e.target.value === "" ? "" : Number(e.target.value))}
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

          {/* Hierarchy */}
          <section>
            <SectionLabel icon={<Folder className="w-4 h-4" />}>Hierarchy</SectionLabel>
            <InfoCard label="Parent Category">
              {isEdit ? (
                <div>
                  <select
                    ref={(el) => (inputRefs.current.parent_id = el as any)}
                    value={draft.parent_id ?? ""}
                    onChange={e => set("parent_id", e.target.value ? Number(e.target.value) : null)}
                    className={selectCls(!!errors.parent_id)}
                  >
                    <option value="">No parent (Top Level)</option>
                    {categories.filter(c => c.id !== draft.id).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <FieldError error={errors.parent_id} />
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">Select a parent to create a sub-category.</p>
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-800 mt-2">
                  {categories.find(c => c.id === draft.parent_id)?.name || "— (Top Level)"}
                </p>
              )}
            </InfoCard>
          </section>

          {/* Image */}
          <section>
            <SectionLabel icon={<Eye className="w-4 h-4" />}>Image</SectionLabel>
            <InfoCard label="Category Image">
              {isEdit && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => addImage(e.target.files)}
                  className="mt-2 text-sm text-slate-500"
                />
              )}
              {draft.images[0] && (
                <img src={draft.images[0]} className="w-32 h-32 object-cover mt-3 rounded-lg" />
              )}
            </InfoCard>
          </section>

        </div>
      </div>
    </div>
  );
}