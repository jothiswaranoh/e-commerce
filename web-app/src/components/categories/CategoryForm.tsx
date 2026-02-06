import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Category, CategoryPayload } from '../../api/category';
import { useCategories } from '../../hooks/useCategory';


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
    const { data: categories = [] } = useCategories();

    const [form, setForm] = useState<CategoryPayload>({
        name: initialData?.name ?? '',
        slug: initialData?.slug ?? '',
        parent_id: initialData?.parent_id ?? null,
        is_active: initialData?.is_active ?? true,
        sort_order: initialData?.sort_order ?? 0,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(
    initialData?.image ?? null
);

    /* =========================
       Validation
    ========================= */

    const validate = (): boolean => {
        const nextErrors: FormErrors = {};

        if (!form.name.trim()) {
            nextErrors.name = 'Name is required';
        } else if (form.name.trim().length < 2) {
            nextErrors.name = 'Name must be at least 2 characters';
        } else if (form.name.trim().length > 50) {
            nextErrors.name = 'Name cannot exceed 50 characters';
        }

        if (!form.slug.trim()) {
            nextErrors.slug = 'Description is required';
        }

        if (form.sort_order === undefined || Number.isNaN(form.sort_order)) {
            nextErrors.sort_order = 'Sort order must be a number';
        } else if (form.sort_order < 0) {
            nextErrors.sort_order = 'Sort order cannot be negative';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    /* =========================
       Handlers
    ========================= */

    const handleChange = <K extends keyof CategoryPayload>(
        key: K,
        value: CategoryPayload[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
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

    /* =========================
       Render
    ========================= */

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <Input
                label="Name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                required
            />

            {/* Description */}
            <Input
                label="Description"
                value={form.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                error={errors.slug}
                required
            />

            {/* Parent Category */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Parent Category
                </label>
                <select
                    value={form.parent_id ?? ''}
                    onChange={(e) =>
                        handleChange(
                            'parent_id',
                            e.target.value ? Number(e.target.value) : null
                        )
                    }
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">No parent (top-level)</option>

                    {categories
                        .filter(
                            (cat) =>
                                !initialData || cat.id !== initialData.id
                        )
                        .map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                </select>
            </div>

            {/* Sort Order */}
            <Input
                label="Sort Order"
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                    handleChange('sort_order', Number(e.target.value))
                }
                error={errors.sort_order}
            />
            {/* Category Image */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Category Image
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-neutral-600
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-medium
                            file:bg-neutral-100 file:text-neutral-700
                            hover:file:bg-neutral-200"
                />

                {preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        className="mt-3 w-20 h-20 object-cover rounded-lg border"
                    />
                )}
            </div>
            {/* Submit */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    {submitText}
                </Button>
            </div>
        </form>
    );
}