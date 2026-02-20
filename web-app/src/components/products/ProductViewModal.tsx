import { useState, useRef, useEffect } from "react";
import {
  X, Pencil, Check, GripVertical, Trash2,
  Plus, Eye, Tag, Hash, Layers, Package,
  ChevronLeft, ChevronRight, ChevronDown
} from "lucide-react";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Variant = {
  id?: number;
  name?: string; 
  price: string;
  sku: string;
  stock: number;
  _destroy?: boolean;
};

type Product = {
  id?: number;
  name: string;
  description?: string;
  slug: string;
  status: string;
  images: string[];
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

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function ProductModal({ product, isOpen, onClose, onSave, categories = [], initialMode = "view" }: Props) {
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [draft, setDraft] = useState<Product | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [newImageDrop, setNewImageDrop] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setDraft({ ...product, images: [...(product.images || [])] });
      setNewFiles([]);
      setActiveImg(0);
      setMode(initialMode);
    }
  }, [product, initialMode]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  if (!isOpen || !product || !draft) return null;

  const isEdit = mode === "edit";

  const handleClose = () => {
    setMode(initialMode);
    setDraft(product ? { ...product, images: [...(product.images || [])] } : null);
    setNewFiles([]);
    setActiveImg(0);
    onClose();
  };

  const set = <K extends keyof Product>(key: K, val: Product[K]) =>
    setDraft(p => p ? { ...p, [key]: val } : p);

  const setVariant = <K extends keyof Variant>(key: K, val: Variant[K]) =>
    setDraft(p => p ? {
      ...p,
      variants: p.variants?.map((v, i) => i === 0 ? { ...v, [key]: val } : v),
    } : p);


  const addVariant = () => {
  setDraft(p => p ? {
    ...p,
    variants: [
      ...(p.variants || []),
      {
        price: "",
        sku: "",
        stock: 0,
      }
    ]
  } : p);
};

const updateVariant = (index: number, key: keyof Variant, value: any) => {
  setDraft(p => p ? {
    ...p,
    variants: p.variants?.map((v, i) =>
      i === index ? { ...v, [key]: value } : v
    )
  } : p);
};

const deleteVariant = (index: number) => {
  setDraft(p => {
    if (!p || !p.variants) return p;

    const variant = p.variants[index];

    if (variant.id) {
      return {
        ...p,
        variants: p.variants.map((v, i) =>
          i === index ? { ...v, _destroy: true } : v
        ),
      };
    }

    return {
      ...p,
      variants: p.variants.filter((_, i) => i !== index),
    };
  });
};

  const handleSave = () => {
    if (!draft) return;
    const payload: any = {
      ...draft,
      images: newFiles, // New files to upload
      existing_images: draft.images.filter(img => !img.startsWith("blob:")), // Keep existing ones
    };

    // Backend expects variants_attributes for updates
    if (draft.variants && draft.variants.length > 0) {
      payload.variants_attributes = draft.variants.map(v => ({
        id: v.id,
        name: (v as any).name || "Default",
        sku: v.sku,
        price: parseFloat(v.price),
        stock: v.stock,
        _destroy: v._destroy || false
      }));
    }
    console.log("Saving draft:", draft);

    onSave?.({
      ...payload,
      id: draft.id,
    });
    setMode("view");
  };

  const handleDragStart = (i: number) => setDragIdx(i);
  const handleDragEnter = (i: number) => setDragOver(i);
  const handleDragEnd = () => {
    if (dragIdx !== null && dragOver !== null && dragIdx !== dragOver) {
      const imgs = [...draft.images];
      const [moved] = imgs.splice(dragIdx, 1);
      imgs.splice(dragOver, 0, moved);
      setDraft(p => p ? { ...p, images: imgs } : p);
      if (activeImg === dragIdx) setActiveImg(dragOver);
    }
    setDragIdx(null);
    setDragOver(null);
  };

  const deleteImage = (i: number) => {
    const imgs = draft.images.filter((_, idx) => idx !== i);
    setDraft(p => p ? { ...p, images: imgs } : p);
    setActiveImg(Math.max(0, Math.min(activeImg, imgs.length - 1)));
  };

  const addImages = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files).filter(f => f.type.startsWith("image/"));
    const urls = fileArray.map(f => URL.createObjectURL(f));

    setNewFiles(prev => [...prev, ...fileArray]);
    setDraft(p => p ? { ...p, images: [...p.images, ...urls] } : p);
  };

  const prevImg = () => setActiveImg(i => Math.max(0, i - 1));
  const nextImg = () => setActiveImg(i => Math.min(draft.images.length - 1, i + 1));

  const statusColor = (s: string) => ({
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inactive: "bg-gray-100 text-gray-500 border-gray-200",
    draft: "bg-amber-50 text-amber-700 border-amber-200",
  }[s] ?? "bg-gray-100 text-gray-500 border-gray-200");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: "min(1140px, 96vw)", height: "min(800px, 92vh)" }}
        onClick={e => e.stopPropagation()}
      >

        {/* ══ HEADER ══ */}
        <div className="flex-shrink-0 flex items-center justify-between px-7 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1">
                {draft?.id ? "Editing Product" : "Creating Product"}
              </p>
              {isEdit ? (
                <input
                  value={draft.name}
                  onChange={e => {
                    const value = e.target.value;
                    set("name", value);
                    set("slug",
                      value
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "")
                    );
                  }}
                  className="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-500 min-w-[240px]"
                />
              ) : (
                <h2 className="text-xl font-semibold text-gray-900">{draft.name}</h2>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isEdit ? (
              <>
                <button
                  onClick={() => {
                    setDraft(product ? { ...product, images: [...product.images] } : null);
                    setNewFiles([]);
                    setMode("view");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" /> Discard
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                >
                  <Check className="w-4 h-4" /> Save changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setMode("edit")}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors"
              >
                <Pencil className="w-4 h-4" /> Edit product
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors ml-1"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* ── LEFT: Images ── */}
          <div className="w-[46%] flex-shrink-0 flex flex-col gap-4 p-6 border-r border-gray-100 overflow-y-auto bg-gray-50/40">

            {/* Hero */}
            <div
              className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group"
              style={{ aspectRatio: "4/3" }}
            >
              {draft.images.length > 0 ? (
                <img
                  key={activeImg}
                  src={draft.images[activeImg]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300">
                  <Package className="w-16 h-16" />
                  <span className="text-sm font-medium">No images uploaded</span>
                </div>
              )}

              {draft.images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    disabled={activeImg === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:!opacity-0 hover:scale-110"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImg}
                    disabled={activeImg === draft.images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:!opacity-0 hover:scale-110"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {draft.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {draft.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`rounded-full transition-all duration-200 ${i === activeImg
                        ? "w-5 h-2 bg-white shadow"
                        : "w-2 h-2 bg-white/50 hover:bg-white/80"
                        }`}
                    />
                  ))}
                </div>
              )}

              {isEdit && draft.images.length > 0 && (
                <button
                  onClick={() => deleteImage(activeImg)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/95 shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors group/del"
                >
                  <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover/del:text-red-500 transition-colors" />
                </button>
              )}

              {/* Badge */}
              {draft.images.length > 0 && (
                <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-[10px] font-semibold">
                  {activeImg + 1} / {draft.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex flex-wrap gap-2.5">
              {draft.images.map((img, i) => (
                <div
                  key={i}
                  draggable={isEdit}
                  onDragStart={() => handleDragStart(i)}
                  onDragEnter={() => handleDragEnter(i)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${activeImg === i
                    ? "border-indigo-500 shadow-lg shadow-indigo-100 scale-105"
                    : "border-transparent hover:border-gray-300 hover:shadow-md"
                    } ${dragOver === i && dragIdx !== i ? "border-indigo-400 scale-105" : ""} ${dragIdx === i ? "opacity-30 scale-95" : ""
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {isEdit && (
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <GripVertical className="w-5 h-5 text-white drop-shadow" />
                    </div>
                  )}
                </div>
              ))}

              {isEdit && (
                <label
                  onDragOver={e => { e.preventDefault(); setNewImageDrop(true); }}
                  onDragLeave={() => setNewImageDrop(false)}
                  onDrop={e => { e.preventDefault(); setNewImageDrop(false); addImages(e.dataTransfer.files); }}
                  className={`w-20 h-20 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1 flex-shrink-0 transition-all ${newImageDrop
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50"
                    }`}
                >
                  <Plus className="w-5 h-5 text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-semibold">Add</span>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addImages(e.target.files)} />
                </label>
              )}
            </div>

            {isEdit && (
              <p className="text-xs text-gray-400 text-center">
                Drag thumbnails to reorder · click trash to remove active image
              </p>
            )}
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">

              {/* Description */}
              <section>
                <SectionLabel>Description</SectionLabel>
                {isEdit ? (
                  <textarea
                    value={draft.description ?? ""}
                    onChange={e => set("description", e.target.value)}
                    rows={4}
                    placeholder="Write a product description..."
                    className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-300 leading-relaxed transition-colors"
                  />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {draft.description || (
                      <span className="italic text-gray-300">No description provided.</span>
                    )}
                  </p>
                )}
              </section>

              {/* Status + Category */}
              <section>
                <SectionLabel>General</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Status" icon={<Eye className="w-3.5 h-3.5" />}>
                    {isEdit ? (
                      <div className="relative">
                        <select
                          value={draft.status}
                          onChange={e => set("status", e.target.value)}
                          className={selectCls}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft</option>
                        </select>
                        <ChevronDown aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-[20%] w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      </div>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize mt-0.5 ${statusColor(draft.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${draft.status === "active" ? "bg-emerald-500" : "bg-gray-400"
                          }`} />
                        {draft.status}
                      </span>
                    )}
                  </InfoCard>

                  <InfoCard label="Category" icon={<Tag className="w-3.5 h-3.5" />}>
                    {isEdit ? (
                      <div className="relative">
                        <select
                          value={draft.category_id || draft.category?.id}
                          onChange={e => set("category_id", Number(e.target.value))}
                          className={selectCls}
                        >
                          <option value="">Select Category</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <ChevronDown aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-[20%] w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">
                        {draft.category?.name ?? "—"}
                      </p>
                    )}
                  </InfoCard>
                </div>
              </section>

              {/* Variants */}
              <section>
                <SectionLabel>Variants</SectionLabel>

                {draft.variants && draft.variants.length > 0 ? (
                  <div className="space-y-3">
                    {draft.variants.map((v, realIndex) => {
                      if (v._destroy) return null;

                      const visibleIndex =
                        draft.variants?.filter(x => !x._destroy).indexOf(v) ?? 0;

                      return (
                        <div
                          key={v.id ?? realIndex}
                          className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold text-gray-700">
                              Variant #{visibleIndex + 1}
                            </p>

                            {isEdit && (
                              <button
                                onClick={() => deleteVariant(realIndex)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-3">
                            <input
                              placeholder="Variant Name"
                              value={(v as any).name || ""}
                              disabled={!isEdit}
                              onChange={e =>
                                updateVariant(realIndex, "name" as any, e.target.value)
                              }
                              className={inputCls}
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              value={v.price}
                              disabled={!isEdit}
                              onChange={e =>
                                updateVariant(realIndex, "price", e.target.value)
                              }
                              className={inputCls}
                            />

                            <input
                              type="number"
                              placeholder="Stock"
                              value={v.stock ?? ""}
                              disabled={!isEdit}
                              onChange={e =>
                                updateVariant(
                                  realIndex,
                                  "stock",
                                  e.target.value === "" ? "" : Number(e.target.value)
                                )
                              }
                              className={inputCls}
                            />

                            <input
                              placeholder="SKU"
                              value={v.sku}
                              disabled={!isEdit}
                              onChange={e =>
                                updateVariant(realIndex, "sku", e.target.value)
                              }
                              className={inputCls}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No variants yet.
                  </p>
                )}

                {isEdit && (
                  <button
                    onClick={addVariant}
                    className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Variant
                  </button>
                )}
              </section>

              {/* Slug */}
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
                    <p className="text-sm font-mono text-gray-600 break-all mt-0.5">{draft.slug}</p>
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

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
      {children}
      <span className="flex-1 h-px bg-gray-100" />
    </p>
  );
}

function InfoCard({
  label, icon, children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3.5 border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-gray-400">{icon}</span>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full h-9 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-colors mt-0.5";

const selectCls =
  "w-full h-9 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer transition-colors mt-0.5";