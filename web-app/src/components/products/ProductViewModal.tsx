import { useState, useRef, useEffect } from "react";
import {
  X, Pencil, Check, Trash2, Plus,
  ChevronLeft, ChevronRight, AlertCircle,
  Package, Tag, Eye, Hash, Image
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

/* ─── Schema ───────────────────────────────────── */
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
    return true;
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

        {/* TABS */}
        <div className="flex gap-4 border-b px-5">
          {["details", "variants"].map((t) => (
            <button key={t} onClick={() => setTab(t as any)}>
              {t}
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

              <div>
                <label>Description</label>
                <textarea
                  value={draft.description || ""}
                  onChange={(e) =>
                    set("description", e.target.value)
                  }
                />
              </div>

            </div>
          )}

          {tab === "variants" && (
            <div className="space-y-4">
              {(draft.variants || []).map((v: any, i: number) => (
                <div key={i} className="border p-3 rounded">

                  <input
                    placeholder="SKU"
                    value={v.sku}
                    onChange={(e) => {
                      const arr = [...draft.variants];
                      arr[i].sku = e.target.value;
                      set("variants", arr);
                    }}
                  />

                  <input
                    placeholder="Price"
                    value={v.price}
                    onChange={(e) => {
                      const arr = [...draft.variants];
                      arr[i].price = e.target.value;
                      set("variants", arr);
                    }}
                  />

                </div>
              ))}

              <button
                onClick={() =>
                  set("variants", [
                    ...(draft.variants || []),
                    { sku: "", price: "", stock: 0 },
                  ])
                }
              >
                Add Variant
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}