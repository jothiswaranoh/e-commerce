import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Category, CategoryPayload } from "../../api/category";
import CategoryAPI from "../../api/category";
import { ImagePlus, X, ChevronDown } from "lucide-react";

interface Props {
  initialData?: Category;
  onSubmit: (data: CategoryPayload) => void;
  submitText: string;
  isLoading?: boolean;
}

type FormErrors = {
  name?: string;
  slug?: string;
  sort_order?: string;
};

export default function CategoryForm({
  initialData,
  onSubmit,
  submitText,
  isLoading = false,
}: Props) {
  /* ----------------------------------------
     Parent categories
  ---------------------------------------- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchParents() {
      setLoadingParents(true);
      const res = await CategoryAPI.list({ page: 1, per_page: 100 });
      if (mounted && res.success) setCategories(res.data?.data ?? []);
      setLoadingParents(false);
    }
    fetchParents();
    return () => { mounted = false; };
  }, []);

  /* ----------------------------------------
     Form state
  ---------------------------------------- */
  const [form, setForm] = useState<CategoryPayload>({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    parent_id: initialData?.parent_id ?? null,
    is_active: initialData?.is_active ?? true,
    sort_order: initialData?.sort_order ?? 0,
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.image ?? null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [dragOver, setDragOver] = useState(false);

  /* ----------------------------------------
     Auto-slug from name
  ---------------------------------------- */
  const handleNameChange = (value: string) => {
    handleChange("name", value);
    if (!initialData) {
      handleChange(
        "slug",
        value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      );
    }
  };

  /* ----------------------------------------
     Validation
  ---------------------------------------- */
  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.slug.trim()) nextErrors.slug = "Slug is required";
    if (form.sort_order! < 0) nextErrors.sort_order = "Must be 0 or greater";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  /* ----------------------------------------
     Handlers
  ---------------------------------------- */
  const handleChange = <K extends keyof CategoryPayload>(
    key: K,
    value: CategoryPayload[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, image });
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
  };

  /* ----------------------------------------
     Render
  ---------------------------------------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Name */}
      <Field label="Name" required error={errors.name}>
        <input
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Electronics"
          className={inputClass(!!errors.name)}
        />
      </Field>

      {/* Slug */}
      <Field label="Slug" required error={errors.slug}
        hint="URL-friendly identifier, auto-generated from name">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
            /
          </span>
          <input
            value={form.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            placeholder="electronics"
            className={`${inputClass(!!errors.slug)} pl-6 font-mono`}
          />
        </div>
      </Field>

      {/* Two-column row: Parent + Sort Order */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Parent Category">
          <div className="relative">
            <select
              value={form.parent_id ?? ""}
              onChange={(e) =>
                handleChange("parent_id", e.target.value ? Number(e.target.value) : null)
              }
              disabled={loadingParents}
              className={`${inputClass(false)} appearance-none pr-8 cursor-pointer disabled:opacity-50`}
            >
              <option value="">No parent</option>
              {categories
                .filter((c) => !initialData || c.id !== initialData.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </Field>

        <Field label="Sort Order" error={errors.sort_order}>
          <input
            type="number"
            min={0}
            value={form.sort_order}
            onChange={(e) => handleChange("sort_order", Number(e.target.value))}
            className={inputClass(!!errors.sort_order)}
          />
        </Field>
      </div>

      {/* Status toggle */}
      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-700">Active</p>
          <p className="text-xs text-gray-400 mt-0.5">Show this category on the storefront</p>
        </div>
        <button
          type="button"
          onClick={() => handleChange("is_active", !form.is_active)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${form.is_active ? "bg-indigo-500" : "bg-gray-200"
            }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.is_active ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
      </div>

      {/* Image upload */}
      <Field label="Category Image">
        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
            </button>
          </div>
        ) : (
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${dragOver
                ? "border-indigo-400 bg-indigo-50"
                : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
              }`}
          >
            <ImagePlus className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">
              Drop image or <span className="text-indigo-500 font-medium">browse</span>
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </Field>

      {/* Submit */}
      <div className="pt-1">
        <Button type="submit" fullWidth isLoading={isLoading}>
          {submitText}
        </Button>
      </div>

    </form>
  );
}

/* ----------------------------------------
   Field wrapper
---------------------------------------- */
function Field({
  label,
  children,
  required,
  error,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}
        {required && <span className="text-indigo-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

/* ----------------------------------------
   Shared input class
---------------------------------------- */
function inputClass(hasError: boolean) {
  return [
    "w-full h-10 px-3 rounded-xl text-sm text-gray-800 bg-white",
    "border transition-colors outline-none",
    "placeholder:text-gray-300",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
  ].join(" ");
}