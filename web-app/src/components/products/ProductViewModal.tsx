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
  slug: string;
  status: string;
  images: (string | ImageItem)[];
  category?: { id?: number; name: string };
  category_id?: number;
  variants?: Variant[];
  product_attributes?: any[];
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
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Price must be > 0",
    }),
  sku: z.string().min(1, "SKU is required"),
  stock: z
    .union([z.number(), z.string()])
    .refine(
      (v) => {
        const n = typeof v === "string" ? parseInt(v, 10) : v;
        return !isNaN(n) && n >= 0;
      },
      { message: "Stock must be ≥ 0" }
    ),
  _destroy: z.boolean().optional(),
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required").min(3, "At least 3 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Lowercase letters, numbers, hyphens only"
    ),
  status: z.enum(["active", "inactive", "draft"] as const, {
    message: "Select a valid status",
  }),
  description: z
    .string()
    .max(2000, "Max 2000 characters")
    .optional()
    .or(z.literal("")),
  category_id: z
    .number({ message: "Category is required" })
    .positive("Select a category"),
  variants: z.array(variantSchema).optional(),
});

/* ─── Helpers ───────────────────────────────────── */
const toImageItem = (img: string | ImageItem): ImageItem =>
  typeof img === "string" ? { url: img } : img;

const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; pill: string }
> = {
  active: {
    label: "Active",
    dot: "#22c55e",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  draft: {
    label: "Draft",
    dot: "#f59e0b",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  inactive: {
    label: "Inactive",
    dot: "#94a3b8",
    pill: "bg-slate-100 text-slate-500 border border-slate-200",
  },
};

/* ─── Sub-components ────────────────────────────── */
function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {error}
    </p>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
      {children}
    </p>
  );
}

function SectionHeading({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5 group">
      {icon && <span className="text-primary-500 transition-transform group-hover:scale-110">{icon}</span>}
      <h3 className="text-sm font-display font-semibold text-slate-800 tracking-tight">{children}</h3>
      <span className="flex-1 h-px bg-gradient-to-r from-primary-100 to-transparent" />
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

/* ─── Main Component ────────────────────────────── */
export default function ProductModal({
  product,
  isOpen,
  onClose,
  onSave,
  categories = [],
  initialMode = "view",
}: Props) {
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [draft, setDraft] = useState<(Product & { images: ImageItem[] }) | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [tab, setTab] = useState<Tab>("details");
  const fileRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLDivElement | null>>({});


  const isEdit = mode === "edit";

  /* ── Sync ── */
  useEffect(() => {
    if (product) {
      setDraft({ ...product, images: (product.images ?? []).map(toImageItem) });
      setNewFiles([]);
      setDeletedImageIds([]);
      setActiveImg(0);
      setMode(initialMode);
      setErrors({});
      setTab("details");
    }
  }, [product, initialMode]);

  /* ── ESC ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (isOpen) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen]); // eslint-disable-line

  if (!isOpen || !product || !draft) return null;

  /* ── Validation ── */
  const validate = () => {
    const catId = draft.category_id ?? draft.category?.id;
    const result = productSchema.safeParse({
      name: draft.name,
      slug: draft.slug,
      status: draft.status,
      description: draft.description ?? "",
      category_id: catId ? Number(catId) : undefined,
      variants: draft.variants?.filter((v) => !v._destroy),
    });
    if (result.success) { setErrors({}); return true; }
    const errs: ValidationErrors = {};
    result.error.issues.forEach((i) => {
      const k = i.path.join(".");
      if (!errs[k]) errs[k] = i.message;
    });
    setErrors(errs);
    setTimeout(() => {
      contentRef.current?.querySelector("[data-err]")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    return false;
  };

  const clearErr = (field: string) =>
    setErrors((p) => { if (!p[field]) return p; const n = { ...p }; delete n[field]; return n; });

  /* ── Handlers ── */
  const handleClose = () => {
    setMode(initialMode);
    setDraft(product ? ({
      ...product,
      images: (product.images || []).map(toImageItem),
    } as Product & { images: ImageItem[] }) : null);
    setNewFiles([]);
    setDeletedImageIds([]);
    setActiveImg(0);
    setErrors({});
    onClose();
  };

  const set = <K extends keyof Product,>(key: K, val: Product[K]) => {
    setDraft((p) => (p ? { ...p, [key]: val } : p));
    clearErr(key as string);
  };

  const handleSave = () => {
    if (!draft || !validate()) return;
    const orderedIds = draft.images.filter((i) => i.id).map((i) => i.id);
    const payload: any = {
      ...draft,
      images: newFiles.length ? newFiles : undefined,
      delete_image_ids: deletedImageIds.length ? deletedImageIds : undefined,
      image_order_ids: orderedIds,
    };
    if (draft.variants?.length) {
      payload.variants_attributes = draft.variants.map((v) => ({
        id: v.id,
        name: v.name ?? "Default",
        sku: v.sku,
        price: v.price === "" ? undefined : parseFloat(v.price),
        stock: v.stock,
        _destroy: v._destroy ?? false,
      }));
    }
    onSave?.({ ...payload, id: draft.id });
    setMode("view");
  };

  /* ── Variants ── */
  const addVariant = () =>
    setDraft((p) => p ? { ...p, variants: [...(p.variants ?? []), { price: "", sku: "", stock: 0 }] } : p);

  const updateVariant = (idx: number, key: keyof Variant, val: any) => {
    setDraft((p) =>
      p ? { ...p, variants: p.variants?.map((v, i) => i === idx ? { ...v, [key]: val } : v) } : p
    );
    clearErr(`variants.${idx}.${key}`);
  };

  const deleteVariant = (idx: number) =>
    setDraft((p) => {
      if (!p?.variants) return p;
      const v = p.variants[idx];
      if (v.id) return { ...p, variants: p.variants.map((x, i) => i === idx ? { ...x, _destroy: true } : x) };
      return { ...p, variants: p.variants.filter((_, i) => i !== idx) };
    });

  /* ── Images ── */
  const addImages = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const items: ImageItem[] = arr.map((f) => ({ url: URL.createObjectURL(f) }));
    setNewFiles((p) => [...p, ...arr]);
    setDraft((p) => p ? { ...p, images: [...p.images, ...items] } : p);
  };

  const deleteImage = (i: number) => {
    const img = draft.images[i];
    if (img?.id) setDeletedImageIds((p) => img.id && !p.includes(img.id) ? [...p, img.id] : p);
    const imgs = draft.images.filter((_, idx) => idx !== i);
    setDraft((p) => p ? { ...p, images: imgs } : p);
    setActiveImg(Math.max(0, Math.min(activeImg, imgs.length - 1)));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    addImages(e.target.files);
    e.target.value = ""; // Clear the input so the same file can be selected again
  };

  /* ── Derived ── */
  const heroSrc = draft.images[activeImg]?.url ?? null;
  const visibleVariants = (draft.variants ?? []).map((v, i) => ({ ...v, _realIdx: i })).filter((v) => !v._destroy);
  const hasErrors = Object.keys(errors).length > 0;
  const statusCfg = STATUS_CONFIG[draft.status] ?? STATUS_CONFIG.inactive;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      <div className="relative flex flex-col w-full max-w-6xl h-[95vh] sm:h-[90vh] bg-white sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-slate-900/5">
        
        {/* Top Header */}
        <div className="shrink-0 bg-white border-b border-slate-100/80 px-4 sm:px-8 py-4 flex items-center gap-4 sm:gap-6 sticky top-0 z-10">
          
          <div className="flex items-center gap-4 flex-1 min-w-0 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 group-hover:scale-105 transition-all duration-300 ring-4 ring-primary-50">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-primary-600 tracking-wider mb-0.5 uppercase">
                {isEdit ? "Edit Product" : "New Product"}
              </p>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 truncate">
                {draft.name || "Untitled Product"}
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
                    setDraft(product ? { ...product, images: product.images.map(toImageItem) } : null);
                    setErrors({});
                    setMode("view");
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/40 hover:-translate-y-0.5 flex items-center gap-2 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  Save changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setMode("edit")}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
            )}
            <button
              onClick={handleClose}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
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

        {/* ══ BODY ══ */}
        <div className="flex min-h-0 flex-1 overflow-hidden">

          {/* ── Image Panel ── */}
          <div className="flex w-64 shrink-0 flex-col gap-3 overflow-y-auto border-r border-slate-100 bg-slate-50/60 p-4">
            {/* Hero */}
            <div
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white"
              style={{ aspectRatio: "1" }}
            >
              {heroSrc ? (
                <img
                  src={heroSrc}
                  alt={draft.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50">
                  <Image className="h-10 w-10 text-slate-200" />
                  <span className="text-xs text-slate-300">No images</span>
                </div>
              )}

              {draft.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((i) => Math.max(0, i - 1))}
                    disabled={activeImg === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100 disabled:!opacity-0 hover:bg-white"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveImg((i) => Math.min(draft.images.length - 1, i + 1))}
                    disabled={activeImg === draft.images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100 disabled:!opacity-0 hover:bg-white"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </>
              )}

              {isEdit && heroSrc && (
                <button
                  onClick={() => deleteImage(activeImg)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-400 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}

              {draft.images.length > 0 && (
                <div className="absolute bottom-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white">
                  {activeImg + 1}/{draft.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex flex-wrap gap-2">
              {draft.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${activeImg === i
                    ? "border-slate-900 shadow-sm"
                    : "border-transparent hover:border-slate-300"
                    }`}
                >
                  <img src={draft.images[i] instanceof Object ? (draft.images[i] as ImageItem).url : (draft.images[i] as string)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
              {isEdit && (
                  <button className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:text-primary-500 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-300 shrink-0 relative overflow-hidden group shadow-sm bg-white">
                    <Plus className="w-4 h-4 group-hover:scale-125 transition-transform duration-300" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                    />
                  </button>
              )}
            </div>

            {isEdit && draft.images.length > 1 && (
              <p className="text-center text-[10px] text-slate-400">Click to select · trash to remove</p>
            )}
          </div>

          {/* ── Tab Content ── */}
          <div ref={contentRef} className="flex-1 overflow-y-auto px-7 py-6">

            {/* ── DETAILS TAB ── */}
            {tab === "details" && (
              <div className="space-y-7">

                <section>
                  <SectionHeading icon={<Package className="h-4 w-4" />}>Product Name</SectionHeading>
                  {isEdit ? (
                    <div data-err={errors.name ? true : undefined}>
                      <input
                        ref={(el) => (inputRefs.current.name = el)}
                        type="text"
                        placeholder="Product name..."
                        value={draft.name}
                        onChange={(e) => {
                          set("name", e.target.value);
                          set("slug", e.target.value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                        }}
                        className={inputCls(!!errors.name)}
                      />
                      <FieldError error={errors.name} />
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-slate-800">{draft.name}</p>
                  )}
                </section>

                <section>
                  <SectionHeading icon={<Pencil className="h-4 w-4" />}>Description</SectionHeading>
                  {isEdit ? (
                    <>
                      <textarea
                        rows={4}
                        value={draft.description ?? ""}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="Write a compelling product description…"
                        className={`w-full resize-none rounded-xl border px-4 py-3 text-sm leading-relaxed outline-none transition placeholder:text-slate-300 focus:ring-2 ${errors.description
                          ? "border-red-300 bg-red-50/40 text-red-700 focus:ring-red-100"
                          : "border-slate-200 bg-white text-slate-700 focus:border-slate-400 focus:ring-slate-100"
                          }`}
                      />
                      <FieldError error={errors.description} />
                    </>
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-600">
                      {draft.description || <span className="italic text-slate-300">No description.</span>}
                    </p>
                  )}
                </section>

                <section>
                  <SectionHeading icon={<Eye className="h-4 w-4" />}>General</SectionHeading>
                  <div className="grid grid-cols-2 gap-4">

                    {/* Status */}
                    <div>
                      <Label>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Status</span>
                      </Label>
                      {isEdit ? (
                        <div data-err={errors.status ? true : undefined}>
                          <select
                            value={draft.status}
                            onChange={(e) => set("status", e.target.value)}
                            className={selectCls(!!errors.status)}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="draft">Draft</option>
                          </select>
                          <FieldError error={errors.status} />
                        </div>
                      ) : (
                        <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusCfg.pill}`}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusCfg.dot }} />
                          {statusCfg.label}
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <Label>
                        <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Category</span>
                      </Label>
                      {isEdit ? (
                        <div data-err={errors.category_id ? true : undefined}>
                          <select
                            value={draft.category_id ?? draft.category?.id ?? ""}
                            onChange={(e) => set("category_id", Number(e.target.value))}
                            className={selectCls(!!errors.category_id)}
                          >
                            <option value="">Select category…</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          <FieldError error={errors.category_id} />
                        </div>
                      ) : (
                        <p className="mt-1 text-sm font-medium text-slate-800">
                          {draft.category?.name ?? <span className="text-slate-300 italic">Uncategorised</span>}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

              </div>
            )}

            {/* ── VARIANTS TAB ── */}
            {tab === "variants" && (
              <div>
                <SectionHeading icon={<Package className="h-4 w-4" />}>Variants</SectionHeading>

                {visibleVariants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
                    <Package className="mb-2 h-8 w-8 text-slate-200" />
                    <p className="text-sm font-medium text-slate-400">No variants yet</p>
                    {isEdit && <p className="mt-1 text-xs text-slate-300">Click below to add one</p>}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visibleVariants.map((v, visIdx) => (
                      <div
                        key={v.id ?? v._realIdx}
                        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative group hover:border-primary-200 transition-colors duration-300"
                      >
                        <div className="absolute -left-2.5 top-5 w-1 h-8 bg-gradient-to-b from-primary-400 to-secondary-400 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                              <Hash className="h-3.5 w-3.5" />
                            </span>
                            <p className="text-sm font-semibold text-slate-700">
                              Variant {visIdx + 1}
                              {v.name && <span className="ml-1 font-normal text-slate-400">— {v.name}</span>}
                            </p>
                          </div>
                          {isEdit && (
                            <button
                              type="button"
                              onClick={() => deleteVariant(v._realIdx)}
                              className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Remove variant"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Variant fields */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {(["name", "price", "stock", "sku"] as const).map((field) => {
                            const errKey = `variants.${visIdx}.${field}`;
                            return (
                              <div key={field}>
                                <Label>{field}</Label>
                                <input
                                  type={field === "price" || field === "stock" ? "number" : "text"}
                                  placeholder={field === "price" ? "0.00" : field === "stock" ? "0" : field === "sku" ? "SKU-001" : "e.g. Large"}
                                  value={(v as any)[field] ?? ""}
                                  disabled={!isEdit}
                                  onChange={(e) =>
                                    updateVariant(
                                      v._realIdx,
                                      field,
                                      field === "stock"
                                        ? e.target.value === "" ? "" : Number(e.target.value)
                                        : e.target.value
                                    )
                                  }
                                  className={inputCls(!!errors[errKey])}
                                />
                                <FieldError error={errors[errKey]} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isEdit && (
                  <button
                    onClick={addVariant}
                    className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  >
                    <Plus className="h-4 w-4" /> Add variant
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
