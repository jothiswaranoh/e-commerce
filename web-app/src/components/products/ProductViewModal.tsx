import { useState, useRef, useEffect } from "react";
import {
  X,
  Pencil,
  Check,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Package,
  Tag,
  Eye,
  Hash,
  Image,
} from "lucide-react";
import { z } from "zod";

/* ─── Types ─────────────────────────────────────── */
type Variant = {
  id?: number;
  name?: string;
  price: string;
  sku: string;
  stock: number;
  _destroy?: boolean;
};

type ImageItem = {
  id?: number;
  url: string;
};

type Product = {
  id?: number;
  name: string;
  description?: string;
  status: string;
  images: (string | ImageItem)[];
  category?: { id?: number; name: string };
  category_id?: number;
  variants?: Variant[];
};

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updated: Product) => void;
  categories?: { id: number; name: string }[];
  initialMode?: "view" | "edit";
}

type Tab = "details" | "variants";
type ValidationErrors = Record<string, string>;

/* ─── Zod Schemas ───────────────────────────────── */
const variantSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  price: z.string().min(1),
  sku: z.string().min(1),
  stock: z.union([z.number(), z.string()]),
});

const productSchema = z.object({
  name: z.string().min(3),
  status: z.enum(["active", "inactive", "draft"]),
  description: z.string().optional(),
  category_id: z.number(),
  variants: z.array(variantSchema).optional(),
});

/* ─── Component ───────────────────────────────── */
export default function ProductModal({
  product,
  isOpen,
  onClose,
  onSave,
  categories = [],
}: any) {
  const [draft, setDraft] = useState<any>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [errors, setErrors] = useState<any>({});
  const [tab, setTab] = useState<"details" | "variants">("details");

  const inputRefs = useRef<any>({});

  useEffect(() => {
    if (product) {
      setDraft({
        ...product,
        images: (product.images || []).map((i: any) =>
          typeof i === "string" ? { url: i } : i
        ),
      });
    }
  }, [product]);

  if (!isOpen || !draft) return null;

  const set = (k: any, v: any) => {
    setDraft((p: any) => ({ ...p, [k]: v }));
  };

  const validate = () => {
    const res = productSchema.safeParse({
      name: draft.name,
      status: draft.status,
      description: draft.description,
      category_id: draft.category_id,
      variants: draft.variants,
    });

    if (!res.success) {
      const e: any = {};
      res.error.issues.forEach((i) => {
        e[i.path.join(".")] = i.message;
      });
      setErrors(e);
      return false;
    }

    setErrors({});
    onClose();
  };

  const set = <K extends keyof Product,>(key: K, val: Product[K]) => {
    setDraft((p) => (p ? { ...p, [key]: val } : p));
    clearErr(key as string);
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.(draft);
    setMode("view");
  };

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b">

          <div>
            <p className="text-xs text-primary-600 uppercase font-bold">
              {isEdit ? "Edit Product" : "Product"}
            </p>

            {isEdit ? (
              <input
                ref={(el) => (inputRefs.current.name = el)}
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                className="text-2xl font-bold outline-none"
              />
            ) : (
              <h2 className="text-2xl font-bold">{draft.name}</h2>
            )}

            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          <div className="flex gap-2">
            {isEdit ? (
              <>
                <button onClick={() => setMode("view")}>Discard</button>
                <button onClick={handleSave}>Save</button>
              </>
            ) : (
              <button onClick={() => setMode("edit")}>
                <Pencil />
              </button>
            )}
            <button onClick={onClose}><X /></button>
          </div>
        </div>

        {/* ══ TAB ROW ══ */}
        <div className="flex gap-6 px-4 sm:px-8 bg-slate-50/50 border-b border-slate-100/80">
            {[
              { id: "details", label: "Details" },
              { id: "variants", label: "Variants", count: draft.variants?.filter((v) => !v._destroy).length || 0 },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as Tab)}
                className={`relative py-4 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 rounded-sm ${
                  tab === t.id
                    ? "text-primary-700 font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {t.label}
                  {t.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                        tab === t.id ? "bg-primary-100 text-primary-700" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {t.count}
                    </span>
                  )}
                </div>
                {tab === t.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full shadow-[0_-2px_8px_rgba(99,102,241,0.5)]" />
                )}
              </button>
            ))}
          </div>

        {/* BODY */}
        <div className="p-5">

          {tab === "details" && (
            <div className="space-y-4">

              <div>
                <label>Status</label>
                <select
                  value={draft.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label>Category</label>
                <select
                  value={draft.category_id || ""}
                  onChange={(e) =>
                    set("category_id", Number(e.target.value))
                  }
                >
                  <option value="">Select</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

          </div>
        </div>
      </div>
    </div>
  );
}