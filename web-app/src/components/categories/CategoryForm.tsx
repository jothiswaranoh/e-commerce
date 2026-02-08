import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Category, CategoryPayload } from "../../api/category";
import CategoryAPI from "../../api/category";

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
     Parent categories (NON-PAGINATED)
  ---------------------------------------- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchParents() {
      setLoadingParents(true);
      const res = await CategoryAPI.list({ page: 1, per_page: 100 });

      if (mounted && res.success) {
        setCategories(res.data?.data ?? []);
      }

      setLoadingParents(false);
    }

    fetchParents();
    return () => {
      mounted = false;
    };
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
  const [preview, setPreview] = useState<string | null>(
    initialData?.image ?? null
  );

  const [errors, setErrors] = useState<FormErrors>({});

  /* ----------------------------------------
     Validation
  ---------------------------------------- */
  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.slug.trim()) nextErrors.slug = "Slug is required";
    if (form.sort_order! < 0) nextErrors.sort_order = "Invalid sort order";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  /* ----------------------------------------
     Handlers
  ---------------------------------------- */
  const handleChange = <K extends keyof CategoryPayload>(
    key: K,
    value: CategoryPayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      image,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ----------------------------------------
     Render
  ---------------------------------------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
        required
      />

      <Input
        label="Slug"
        value={form.slug}
        onChange={(e) => handleChange("slug", e.target.value)}
        error={errors.slug}
        required
      />

      {/* Parent */}
      <div>
        <label className="block text-sm font-medium mb-1">Parent Category</label>
        <select
          value={form.parent_id ?? ""}
          onChange={(e) =>
            handleChange(
              "parent_id",
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="w-full border rounded px-3 py-2"
          disabled={loadingParents}
        >
          <option value="">No parent</option>
          {categories
            .filter((c) => !initialData || c.id !== initialData.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <Input
        label="Sort Order"
        type="number"
        value={form.sort_order}
        onChange={(e) => handleChange("sort_order", Number(e.target.value))}
        error={errors.sort_order}
      />

      {/* Image */}
      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview}
            className="mt-2 w-20 h-20 object-cover rounded"
          />
        )}
      </div>

      <Button type="submit" fullWidth isLoading={isLoading}>
        {submitText}
      </Button>
    </form>
  );
}