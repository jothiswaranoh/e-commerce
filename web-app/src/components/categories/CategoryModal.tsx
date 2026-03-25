import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import {
  X, Pencil, Check, Trash2,
  Plus, Eye, Folder, Image as ImageIcon,
  AlertCircle
} from "lucide-react";

type Category = {
  id?: number;
  name: string;
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
  const inputRefs = useRef<Record<string, any>>({});

  const isEdit = mode === "edit";

  useEffect(() => {
    if (category) {
      setDraft({ ...category, images: [...(category.images || [])] });
      setNewFiles([]);
      setActiveImg(0);
      setMode(initialMode);
    }
  }, [category, initialMode]);

  if (!isOpen || !draft) return null;

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

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">

          <div>
            {isEdit ? (
              <input
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                className="text-xl font-bold outline-none border-b"
              />
            ) : (
              <h2 className="text-xl font-bold">{draft.name}</h2>
            )}
          </div>

          <div className="flex gap-2">
            {isEdit ? (
              <>
                <button onClick={handleSave} className="btn-primary">
                  <Check /> Save
                </button>
                <button onClick={() => setMode("view")} className="btn-secondary">
                  <X />
                </button>
              </>
            ) : (
              <button onClick={() => setMode("edit")}>
                <Pencil />
              </button>
            )}
          </div>

        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          {/* Name */}
          <div>
            <label>Name</label>
            <input
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              className="input"
            />
            <FieldError error={errors.name} />
          </div>

          {/* Status */}
          <div>
            <label>Status</label>
            <select
              value={draft.is_active ? "active" : "inactive"}
              onChange={(e) => set("is_active", e.target.value === "active")}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Parent */}
          <div>
            <label>Parent</label>
            <select
              value={draft.parent_id ?? ""}
              onChange={(e) =>
                set("parent_id", e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">None</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div>
            <label>Image</label>
            <input type="file" onChange={(e) => addImage(e.target.files)} />
            {draft.images[0] && (
              <img src={draft.images[0]} className="w-32 h-32 object-cover mt-2" />
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

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}