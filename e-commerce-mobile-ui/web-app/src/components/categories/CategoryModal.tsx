import { useState, useRef, useEffect } from "react";
import {
  X, Pencil, Check, GripVertical, Trash2,
  Plus, Eye, Layers, Folder,
  ChevronLeft, ChevronRight, ChevronDown
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
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [newImageDrop, setNewImageDrop] = useState(false);
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
      ...draft,
      image: newFiles[0] ?? undefined,
      remove_image: isImageDeleted, // ALWAYS boolean
      sort_order:
        draft.sort_order === "" || draft.sort_order == null
          ? 0
          : Number(draft.sort_order),
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
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: "min(1140px, 96vw)", height: "min(800px, 92vh)" }}
        onClick={e => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="flex-shrink-0 flex items-center justify-between px-7 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Folder className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                {draft?.id ? "Editing Category" : "Creating Category"}
              </p>
              {isEdit ? (
                <input
                  value={draft.name}
                  onChange={e => {
                    const value = e.target.value;
                    set("name", value);
                    set("slug",
                      value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
                    );
                  }}
                  className="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-500"
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
                    setDraft(category ? { ...category, images: [...category.images] } : null);
                    setNewFiles([]);
                    setMode("view");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" /> Discard
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"
                >
                  <Check className="w-4 h-4" /> Save changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setMode("edit")}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700"
              >
                <Pencil className="w-4 h-4" /> Edit category
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* LEFT IMAGE PANEL identical structure */}
          <div className="w-[46%] flex-shrink-0 flex flex-col gap-4 p-6 border-r border-gray-100 overflow-y-auto bg-gray-50/40">

            {/* Hero */}
            <div
                className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                style={{ aspectRatio: "4/3" }}
            >
                {draft.images.length > 0 ? (
                <img
                    src={draft.images[activeImg]}
                    className="w-full h-full object-cover"
                />
                ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300">
                    <Folder className="w-16 h-16" />
                    <span className="text-sm font-medium">No image uploaded</span>
                </div>
                )}

                {isEdit && draft.images.length > 0 && (
                <button
                    onClick={() => deleteImage(activeImg)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center"
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
                    className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    activeImg === i
                        ? "border-indigo-500 shadow-lg shadow-indigo-100 scale-105"
                        : "border-transparent hover:border-gray-300 hover:shadow-md"
                    }`}
                >
                    <img src={img} className="w-full h-full object-cover" />
                </div>
                ))}

                {isEdit && draft.images.length === 0 && (
                <label
                    className="w-20 h-20 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1 transition-all border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50"
                >
                    <Plus className="w-5 h-5 text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-semibold">Add</span>
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
                <p className="text-xs text-gray-400 text-center">
                Click image to preview · click trash to remove
                </p>
            )}
            </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">

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
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
      {children}
      <span className="flex-1 h-px bg-gray-100" />
    </p>
  );
}

function InfoCard({ label, icon, children }: any) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3.5 border border-gray-100">
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
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