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

        </div>
      </div>
    </div>
  );
}